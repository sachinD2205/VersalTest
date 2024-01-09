import EmailIcon from "@mui/icons-material/Email";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button, Grid, Paper, Stack, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import style from "../../../styles/fireBrigadeSystem/view.module.css";
import FileTable from "./fileTable";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

// import { watch } from "fs";

// Main Component - Clerk
const Index = () => {
  let appName = "NRMS";
  let serviceName = "N-NPR";

  const [mainFiles, setMainFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);

  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  // Verification AO Dialog
  const [verificationAoDailog, setVerificationAoDailog] = useState();
  const verificationAoOpne = () => setVerificationAoDailog(true);
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [authority, setAuthority] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 5,
    page: 1,
  });

  const [notification, setNotification] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    // language == "en"
    //   ? {
    //       headerName: "Uploaded By",
    //       field: "attachedNameEn",
    //       flex: 2,
    //       // width: 300,
    //     }
    //   : {
    //       headerName: "द्वारे अपलोड केले",
    //       field: "attachedNameMr",
    //       flex: 2,
    //       // width: 300,
    //     },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setValue(
      "filePath",
      finalFiles.map((t) => t.filePath)
    );
  }, [finalFiles]);

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    watch,

    getValues,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const verificationAoClose = () => {
    setValue("subject", "");
    setValue("body", "");
    setVerificationAoDailog(false);
  };

  const onSubmitForm = (fromData) => {
    setIsLoading(true);
    const finalBody = {
      ...fromData,
    };
    console.log("finalBody", finalBody);
    axios
      .post(`${urls.NRMS}/prime/sendMail`, finalBody, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          serviceId: "435",
        },
      })
      .then((res) => {
        if (res.status == 200) {
          swal({
            title: "Email sent Successfully",
            icon: "success",
            button: "Ok",
          });
          setIsLoading(false);
          router.back();
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  // get  Notifications
  const getNotification = () => {
    axios
      .post(`${urls.NRMS}/prime/getNotifications`, null, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          // Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMDAxNDMiLCJpYXQiOjE2OTEwNjM5NTcsImV4cCI6MTY5MTA5OTk1N30.TjF0FlobVSmhO88HQjmbo81HXsoZLegO6oDKd7jcJ51YQ8H4lPCFpKDRWP-Ps2vS8TM8i69oLrKQx1oIzFVk8w`,
          serviceId: "435",
        },
      })
      .then((res) => {
        console.log("notificationData", res?.data);

        setNotification(res?.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  useEffect(() => {
    getNotification();
  }, []);

  const [result, setResult] = useState([]);
  const [index, setIndex] = useState("");
  const [img, setImg] = useState("");
  // const query = router.query;

  useEffect(() => {
    if (router.query.newsPaper) {
      //console.log(result);
      const res = JSON.parse(router.query.newsPaper);
      setResult(res);
      //   setIndex(query.index);
      //   setImg(query.img);
      console.log("99999999", res);

      //router.isReady= false;
    }
  }, [router.query.newsPaper]);

  useEffect(() => {
    if (result) {
      result?.map((r, index) => {
        setValue(`newsPapers[${index}]`, r?.newspaperName);
        setValue(`emails[${index}]`, r?.emailId);
      });
    }
  }, [result]);

  console.log("result", result);

  useEffect(() => {
    console.log("router.query", JSON.parse(router.query.newsPaper));
  }, []);

  // useEffect(() => {
  //   // console.log("Kay Ahe Ka", props);
  //   // setValue("files", props?.files);
  //   //
  //   let fileee = [];
  //   if (router?.query?.pageMode == "View") {
  //     fileee = watch("files");
  //     console.log("ahe ka kahi 1st", fileee);
  //   } else {
  //     fileee = [...mainFiles, ...additionalFiles];
  //   }
  //   setFinalFiles(
  //     fileee?.length > 0
  //       ? fileee.map((ff, i) => {
  //           return { ...ff, srNo: i + 1 };
  //         })
  //       : []
  //   );
  //   // setValue("files", fileee);
  //   // setValue("files", props?.docs?.files);
  // }, [mainFiles, additionalFiles, watch("files")]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            margin: 6,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box className={style.tableHead}>
                  <Box className={style.feildHead}>
                    {/* {<FormattedLabel id='informerDetails' />} */}
                    Send Mail
                  </Box>
                </Box>
                <br />

                {/* <Grid
                  container
                  columns={{ xs: 6, sm: 12, md: 12 }}
                  className={style.feildres}
                  spacing={2}
                >
                  <Grid item xs={6} className={style.feildres}>
                    <TextField
                      InputProps={{
                        readOnly: true, // Make the input readonly
                      }}
                      sx={{ width: "100%" }}
                      size="small"
                      label="News Paper"
                      variant="outlined"
                      style={{ backgroundColor: "white" }}
                      {...register(`newsPapers[${index}]`)}
                      // defaultValue={data?.newsPapers}
                      error={errors?.newsPapers?.[index]}
                      helperText={errors?.newsPapers?.[index]?.message}
                    />
                  </Grid>
                </Grid> */}

                {result &&
                  result.map((data, index) => {
                    return (
                      <>
                        <Grid
                          container
                          columns={{ xs: 6, sm: 12, md: 12 }}
                          className={style.feildres}
                          spacing={2}
                        >
                          <Grid item xs={6} className={style.feildres}>
                            <TextField
                              InputProps={{
                                readOnly: true, // Make the input readonly
                              }}
                              sx={{ width: "100%" }}
                              size="small"
                              label="News Paper"
                              variant="outlined"
                              style={{ backgroundColor: "white" }}
                              {...register(`newsPapers[${index}]`)}
                              // defaultValue={data?.newsPapers}
                              error={errors?.newsPapers?.[index]}
                              helperText={errors?.newsPapers?.[index]?.message}
                            />
                          </Grid>
                          <Grid item xs={6} className={style.feildres}>
                            <TextField
                              InputProps={{
                                readOnly: true, // Make the input readonly
                              }}
                              sx={{ width: "100%" }}
                              size="small"
                              label="Email"
                              variant="outlined"
                              style={{ backgroundColor: "white" }}
                              {...register(`emails[${index}]`)}
                              //   defaultValue={data.emails}
                              error={errors?.emails?.[index]}
                              helperText={errors.emails?.[index]?.message}
                            />
                          </Grid>
                        </Grid>
                        <br />
                      </>
                    );
                  })}

                <Grid
                  container
                  columns={{ xs: 12, sm: 12, md: 12 }}
                  className={style.feildres}
                  // spacing={3}
                >
                  <Grid item xs={12} className={style.feildres}>
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      id="outlined-multiline-static"
                      multiline
                      defaultValue=""
                      label="Subject"
                      variant="outlined"
                      style={{ backgroundColor: "white" }}
                      {...register("subject")}
                      error={errors.subject}
                      helperText={errors.subject?.message}
                    />
                  </Grid>
                </Grid>
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={style.feildres}
                  // spacing={3}
                >
                  <Grid item xs={4} className={style.feildres}>
                    <TextField
                      sx={{ width: "100%" }}
                      style={{ backgroundColor: "white" }}
                      {...register("body")}
                      label="Body"
                      id="outlined-multiline-static"
                      multiline
                      rows={6}
                      // defaultValue='Type here'
                    />
                  </Grid>
                  <Grid item xs={4} className={style.feildres}></Grid>
                  <Grid item xs={4} className={style.feildres}></Grid>
                </Grid>
                <br />
                <br />
                <Box className={style.tableHead}>
                  <Box className={style.feildHead}>
                    {<FormattedLabel id="documents" />}
                  </Box>
                </Box>

                <Box
                  sx={{
                    marginTop: 2,
                  }}
                >
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12}>
                      {/* <label>
                      <Add
                        color="secondary"
                        sx={{
                          width: 30,
                          height: 30,
                          border: "1.4px dashed #9c27b0",
                          marginRight: 1.5,
                        }}
                      />
                      <input
                        type="file"
                        name="name"
                        multiple
                        hidden
                      />
                      Add Files
                    </label> */}
                      <FileTable
                        appName={appName} //Module Name
                        serviceName={serviceName} //Transaction Name
                        fileName={attachedFile} //State to attach file
                        filePath={setAttachedFile} // File state upadtion function
                        newFilesFn={setAdditionalFiles} // File data function
                        columns={_columns} //columns for the table
                        rows={finalFiles} //state to be displayed in table
                        uploading={setUploading}
                        // authorizedToUpload={authorizedToUpload}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Stack
                    style={{ display: "flex", justifyContent: "center" }}
                    spacing={3}
                    direction={"row"}
                  >
                    <Button
                      type="submit"
                      size="small"
                      variant="outlined"
                      // style={{ backgroundColor: "green" }}
                      // onClick={() =>
                      //   // alert("jiii")
                      //   approveRevertRemarkDailogOpen()
                      // }
                    >
                      Send Mail
                      <EmailIcon
                        sx={{
                          marginLeft: 1,
                          fontSize: "20px",
                        }}
                      />
                    </Button>
                    <Button
                      size="small"
                      // style={{ backgroundColor: "red" }}
                      variant="outlined"
                      onClick={() => verificationAoClose()}
                    >
                      Exit
                      <ExitToAppIcon
                        sx={{
                          marginLeft: 1,
                          fontSize: "20px",
                        }}
                      />
                    </Button>
                  </Stack>
                </Grid>
              </form>
            </FormProvider>
          </div>
        </Paper>
      )}
    </>
  );
};

export default Index;
