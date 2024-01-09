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
import { Controller, useForm } from "react-hook-form";
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
import Loader from "../../../../../containers/Layout/components/Loader";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const Index = (props) => {
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [btnSaveText, setBtnSaveText] = useState("Save");
  // multiple files attach
  const [attachedFile, setAttachedFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true);
  const [payloadImages, setPayloadImages] = useState({});
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
  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
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
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    if (router.query.id) {
      getNocDataById(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getHutData();
    let siteVisitObj =
      dataSource &&
      dataSource?.trnVisitScheduleList &&
      dataSource?.trnVisitScheduleList[0];
    let dateTime = siteVisitObj?.rescheduleDate
      ? siteVisitObj?.rescheduleDate
      : siteVisitObj?.scheduledTimeText;
    let scheduleDateTime = dateTime?.split(".");

    setValue("scheduledTime", scheduleDateTime && scheduleDateTime[0]);
  }, [dataSource]);

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;
        let res = result && result.find((obj) => obj.id == dataSource?.hutNo);
        setHutData(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getFilePreview = (filePath) => {
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

  const getNocDataById = (id) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnIssueNoc/getById?id=${id}`, {
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data;
        setDataSource(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let siteVisitObj = dataSource?.trnVisitScheduleList[0];
    let _body = {
      ...formData,
      ...payloadImages,
      referenceKey: router.query.id,
      scheduledDate: moment(siteVisitObj.scheduledDate).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      scheduledTime: moment(siteVisitObj.scheduledDate).format(
        "YYYY-MM-DDThh:mm:ss"
      ),
      rescheduleDate: null,
      rescheduleTime: null,
      scheduleTokenNo: "123456",
      slumKey: siteVisitObj.slumKey,
      hutNo: siteVisitObj.hutNo,
      length: siteVisitObj.length,
      id: siteVisitObj.id,
      trnType: siteVisitObj.trnType,
      breadth: siteVisitObj.breadth,
      height: siteVisitObj.height,
      constructionTypeKey: siteVisitObj.constructionTypeKey,
      usageTypeKey: siteVisitObj.usageTypeKey,
      area: siteVisitObj.area,
      employeeKey: "2",
      // visitDate: formData.visitTime,
      visitDate: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      visitTimeText: moment(formData.visitTime).format("YYYY-MM-DDThh:mm:ss"),
      status: dataSource?.status,
      isDraft: "",
      isComplete: true,
      activeFlag: dataSource?.activeFlag,
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/trnIssuesNoc/save`, _body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले!",
            text:
              language == "en"
                ? `Site visit against ${dataSource.applicationNo} Completed successfully !`
                : `विरुद्ध साइट भेट ${dataSource.applicationNo} यशस्वीरित्या पूर्ण झाली!`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
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

  const catchMethod = (err) => {
    if (err?.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err?.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
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
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
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
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
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
                  <FormattedLabel id="nocSiteDetails" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Schedule date & time */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <Controller
                control={control}
                name="scheduledTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      variant="standard"
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          variant="standard"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={errors.scheduledTime}
                          helperText={
                            errors?.scheduledTime
                              ? errors.scheduledTime.message
                              : null
                          }
                        />
                      )}
                      label={<FormattedLabel id="scheduleDateTime" required />}
                      // value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(
                      //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                      //   )
                      // }
                      // defaultValue={null}
                      // disabled
                      // inputFormat="YYYY-MM-DDThh:mm:ss"
                      onChange={(date) => {
                        const formattedDate = moment(date).format("YYYY-MM-DD");
                        const formattedTime = moment(date).format("hh:mm:ss A");
                        field.onChange(`${formattedDate} ${formattedTime}`);
                      }}
                      value={
                        field.value
                          ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                          : null
                      }
                      defaultValue={null}
                      inputFormat="YYYY-MM-DD hh:mm:ss A"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            {/* Visit Date & Time */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <Controller
                control={control}
                name="visitTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      variant="standard"
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          variant="standard"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={errors.visitTime}
                          helperText={
                            errors?.visitTime ? errors.visitTime.message : null
                          }
                        />
                      )}
                      label={<FormattedLabel id="visitDateTime" required />}
                      // value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(
                      //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                      //   )
                      // }
                      // defaultValue={null}
                      // inputFormat="YYYY-MM-DDThh:mm:ss"
                      onChange={(date) => {
                        const formattedDate = moment(date).format("YYYY-MM-DD");
                        const formattedTime = moment(date).format("hh:mm:ss A");
                        field.onChange(`${formattedDate} ${formattedTime}`);
                      }}
                      value={
                        field.value
                          ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                          : null
                      }
                      defaultValue={null}
                      inputFormat="YYYY-MM-DD hh:mm:ss A"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>

            {/* Lattitude */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="lattitude" required />}
                variant="standard"
                {...register("lattitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("lattitude") ? true : false,
                }}
                error={!!errors.lattitude}
                helperText={errors?.lattitude ? errors.lattitude.message : null}
              />
            </Grid>

            {/* Longitude */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="longitude" required />}
                variant="standard"
                {...register("longitude")}
                InputLabelProps={{
                  shrink: router.query.id || watch("longitude") ? true : false,
                }}
                error={!!errors.longitude}
                helperText={errors?.longitude ? errors.longitude.message : null}
              />
            </Grid>

            {/* geoCode */}
            <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="geocode" required />}
                variant="standard"
                {...register("geocode")}
                InputLabelProps={{
                  shrink: router.query.id || watch("geocode") ? true : false,
                }}
                error={!!errors.geocode}
                helperText={errors?.geocode ? errors.geocode.message : null}
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
                  <FormattedLabel id="attachImages" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Attachement */}
            <Grid item xs={12}>
              <FileTable
                appName="SLUM" //Module Name
                serviceName="SLUM-IssuanceNoc" //Transaction Name
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
                  <FormattedLabel id="generateReports" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            {/* Generate Inspection Report */}
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
                marginTop: "10px",
              }}
            >
              <Grid item xl={1} lg={6} md={6} sm={12} xs={12}></Grid>
              <Grid item xl={9} lg={9} md={6} sm={12} xs={12}>
                <label>
                  <b>
                    <FormattedLabel id="generateInspectionReport" />
                  </b>
                </label>
              </Grid>

              <Grid item xl={2} lg={6} md={6} sm={12} xs={12}>
                <Button color="primary" variant="contained" size="small">
                  <FormattedLabel id="generate" />
                </Button>
              </Grid>
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
                  disabled={router.query.pageMode == "view" ? true : false}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="remarks" />}
                  variant="standard"
                  {...register("remarks")}
                  InputLabelProps={{
                    shrink: router.query.id || watch("remarks") ? true : false,
                  }}
                  error={!!errors.remarks}
                  helperText={errors?.remarks ? errors.remarks.message : null}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xl={6}
              lg={6}
              md={6}
              sm={12}
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
                variant="contained"
                size="small"
                type="submit"
                onClick={() => {
                  setBtnSaveText("Save");
                }}
                disabled={!watch("remarks")}
                endIcon={<Save />}
              >
                <FormattedLabel id="completeSiteVisit" />
              </Button>
            </Grid>

            <Grid
              item
              xl={6}
              lg={6}
              md={6}
              sm={12}
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
                      `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                    );
                  }
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </Grid>
        </form>
      </ThemeProvider>
    </>
  );
};

export default Index;
