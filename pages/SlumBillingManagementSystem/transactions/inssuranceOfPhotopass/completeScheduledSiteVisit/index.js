import {
  Button,
  Grid,
  IconButton,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import theme from "../../../../../theme";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/completeSiteVisitSchema";
import React, { useEffect } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import { ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import FileTable from "../../../../../components/SlumBillingManagementSystem/FileUpload/FileTable";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  EncryptData,
  DecryptData,
} from "../../../../../components/common/EncryptDecrypt";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import { DataGrid } from "@mui/x-data-grid";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = (props) => {
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [dataSource, setDataSource] = useState({});
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isLoading, setIsLoading] = useState(false);
  // multiple files attach
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [uploading, setUploading] = useState();
  const [mainFiles, setMainFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [payloadImages, setPayloadImages] = useState({});
  const user = useSelector((state) => state.user.user);
  const [completeSiteVisitDoc, setCompleteSiteVisitDoc] = useState([]);

  let loggedInUser = localStorage.getItem("loggedInUser");
  const headers ={ Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // Document columns
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const getFilePreview = (filePath) => {
    console.log('filePath', filePath)
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
                <html>
                  <body style="margin: 0;">
                    <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                  </body>
                </html>
              `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("finalFiles", finalFiles);

    finalFiles &&
      finalFiles.map((each, i) => {
        if (i < 5) {
          setPayloadImages({
            ...payloadImages,
            [`siteImage${i + 1}`]: each?.filePath,
          });
        }
      });
  }, [finalFiles]);

  const language = useSelector((state) => state.labels.language);
  //get logged in user

  useEffect(() => {
    setDataSource(props.data);
    setValue(
      "scheduledTime",
      props?.data?.trnVisitScheduleList[0]?.scheduledTimeText
    );
    setValue("visitTime", props?.data?.trnVisitScheduleList[0]?.visitTime);
    setValue("longitude", props?.data?.trnVisitScheduleList[0]?.longitude);
    setValue("lattitude", props?.data?.trnVisitScheduleList[0]?.lattitude);
    setValue("remarks", props?.data?.trnVisitScheduleList[0]?.remarks);
    setValue("geocode", props?.data?.trnVisitScheduleList[0]?.geocode);
    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 5; i++) {
      const attachedDocument =
        props?.data?.trnVisitScheduleList[0]?.[`siteImage${i}`];
      if (attachedDocument != null && attachedDocument != "") {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          attachedDocument
        );
        doc.push({
          id: i,
          filenm: DecryptPhoto.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: DecryptPhoto.split(".").pop().toUpperCase(),
        });
      }
      setCompleteSiteVisitDoc(doc);
    }
  }, [props]);

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let siteVisitObj = dataSource?.trnVisitScheduleList[0];

    let _body = {
      ...formData,
      ...siteVisitObj,
      isRescheduled: false,
      referenceKey: router.query.id,
      geocode: formData?.geocode,
      lattitude: formData?.lattitude,
      longitude: formData?.longitude,
      activeFlag: dataSource?.activeFlag,
      visitTimeText: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      visitTime: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      remarks: formData.remarks,
      ...payloadImages,
      isComplete: true,
    };
    console.log("_body", _body);

    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/issuePhotopass/save`, _body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language == "en"
                ? `Site visit against ${dataSource.applicationNo} Completed successfully !`
                : `विरुद्ध साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पूर्ण झाली!`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // file attache column
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          flex: 2,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          flex: 2,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.filePath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <>
        {" "}
        {isLoading && <CommonLoader />}
        <FormProvider>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            {/********* Site Visit Details **********/}
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="photopassSiteDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Schedule date & time */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Controller
                  control={control}
                  name="scheduledTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        disablePast
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{
                              m: { xs: 0, md: 1 },
                              minWidth: "100%",
                            }}
                            error={error.scheduledTime}
                            helperText={
                              error?.scheduledTime
                                ? error.scheduledTime.message
                                : null
                            }
                          />
                        )}
                        label={<FormattedLabel id="scheduleDateTime" />}
                        onChange={(date) => {
                          const formattedDate =
                            moment(date).format("DD-MM-YYYY");
                          const formattedTime =
                            moment(date).format("hh:mm:ss A");
                          field.onChange(`${formattedDate} ${formattedTime}`);
                        }}
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        disabled
                        inputFormat="DD-MM-YYYY hh:mm:ss A"
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              {/* Visit Date & Time */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Controller
                  control={control}
                  name="visitTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            error={error.visitTime}
                            helperText={
                              error?.visitTime ? error.visitTime.message : null
                            }
                          />
                        )}
                        label={<FormattedLabel id="visitDateTime" required />}
                        onChange={(date) => {
                          const formattedDate =
                            moment(date).format("YYYY-MM-DD");
                          const formattedTime =
                            moment(date).format("hh:mm:ss A");
                          field.onChange(`${formattedDate} ${formattedTime}`);
                        }}
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        inputFormat="DD-MM-YYYY hh:mm:ss A"
                        disabled={
                          dataSource?.status != 15 && dataSource?.status != 28
                            ? true
                            : false
                        }
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={
                    dataSource?.status != 15 && dataSource?.status != 28
                      ? true
                      : false
                  }
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lattitude" required />}
                  variant="standard"
                  {...register("lattitude")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
              </Grid>
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={
                    dataSource?.status != 15 && dataSource?.status != 28
                      ? true
                      : false
                  }
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="longitude" required />}
                  variant="standard"
                  {...register("longitude")}
                  InputLabelProps={{
                    shrink:
                      router.query.id || watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
              </Grid>
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled={
                    dataSource?.status != 15 && dataSource?.status != 28
                      ? true
                      : false
                  }
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="geocode" required />}
                  variant="standard"
                  {...register("geocode")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("geocode") ? true : false,
                  }}
                  error={!!error.geocode}
                  helperText={error?.geocode ? error.geocode.message : null}
                />
              </Grid>
            </Grid>

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="attachInspectionImages" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Attachement */}
              {dataSource?.status != 15 && dataSource?.status != 28 ? (
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "10px",
                    overflowY: "scroll",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="standard"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={completeSiteVisitDoc}
                  columns={docColumns}
                />
              ) : (
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <FileTable
                      appName="SLUM" //Module Name
                      serviceName="SLUM-IssuancePhotopass" //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={_columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      getValues={getValues}
                      pageMode={router.query.pageMode}
                      authorizedToUpload={authorizedToUpload}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <TextField
                  disabled={
                    dataSource?.status != 15 && dataSource?.status != 28
                      ? true
                      : false
                  }
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="remarks" />}
                  inputProps={{ maxLength: 500 }}
                  multiline
                  variant="standard"
                  {...register("remarks")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("remarks") ? true : false,
                  }}
                  error={!!error.remarks}
                  helperText={error?.remarks ? error.remarks.message : null}
                />
              </Grid>
            </Grid>
            {(dataSource?.status === 15 || dataSource?.status === 28) && (
              <Grid container spacing={2} sx={{ padding: "1rem" }}>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      if(loggedInUser==='citizenUser'){
                        router.push("/dashboard");
                      }else if(loggedInUser==='cfcUser'){
                        router.push("/CFC_Dashboard");
                      } else {
                        router.push(
                          `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    color="success"
                    size="small"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                      setBtnSaveText("Save");
                    }}
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="completeSiteVisit" />
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </FormProvider>
      </>
    </ThemeProvider>
  );
};

export default Index;
