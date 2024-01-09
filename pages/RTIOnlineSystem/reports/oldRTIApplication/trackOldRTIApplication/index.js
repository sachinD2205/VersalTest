import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import theme from "../../../../../theme";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useRouter } from "next/router";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import { useReactToPrint } from "react-to-print";
import DownloadIcon from "@mui/icons-material/Download";
import { Visibility } from "@mui/icons-material";
import Styles from "../oldRTIApplication.module.css";
import { EncryptData,DecryptData } from "../../../../../components/common/EncryptDecrypt";
import ReportLayout from "../../../../../containers/reuseableComponents/NewReportLayout";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({});
  const logedInUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState(null);
  const language = useSelector((store) => store.labels.language);
  const [dataNotAvail, setDataNotAvail] = useState(false);
  let user = useSelector((state) => state.user.user);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const router = useRouter();
  const [appNo, setAppNo] = useState(null);
  const componentRef = useRef(null);
  const [auditData, setAuditData] = useState([]);
  const [document, setDocument] = useState([]);
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
        } else if (r?.data?.extension === ".docx") {
          console.log("");
          const data = base64ToArrayBuffer(r?.data?.fileName);
          const excelBlob = new Blob([data], {
            type: "application / vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(excelBlob, "Document.docx");
        } else if (r?.data?.extension === ".xls") {
          const data = base64ToArrayBuffer(r?.data?.fileName);
          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(excelBlob, "Document.xlsx");
        }  else if (r?.data?.mimeType == "video/mp4") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <video width="100%" height="100%" controls>
                  <source src="${dataUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </body>
            </html>
          `);
        } else if (r?.data?.mimeType == "audio/mpeg") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <audio controls>
                  <source src="${dataUrl}" type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>
              </body>
            </html>
          `);
        }else {
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
      .catch((error) => {
        cfcErrorCatchMethod(error,true)
      });
  };
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getRTIApplicationById(router.query.id);
    }
  }, [router.query.id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en" ? "Old RTI Application" : "जुना आरटीआय अर्ज",
  });
  useEffect(() => {
    if (fetchData != null) setDataImageonUi();
  }, [fetchData]);

  let setDataImageonUi = () => {
    const result = fetchData;
    let res = [];
    if (result?.applicationAttachmentDaos?.length != 0) {
      result?.applicationAttachmentDaos?.map((temp, index) => {
        res.push({
          srNo: index + 1,
          id: temp.key,
          originalFileName: temp.filename,
          filePath: temp.newFilePath,
          encryptFilePath:temp.encryptFilePath
        });
      });
      setDocument(res);
    } else {
      setDocument([]);
    }
  };
  const documentCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: "250",
    },
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "left",
      flex: 3,
      width: "250",
    },
    {
      field: "Action",
      headerName: language == "en" ? "View" : "पहा",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "50",
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
                getFilePreview(record?.row?.encryptFilePath);
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

 

  const getRTIApplicationById = (rtiApplicaationId) => {
    setIsLoading(true);
    axios

      .get(
        `${urls.RTI}/applicationDetails/getById?id=${rtiApplicaationId
          ?.replaceAll("+", "%2b")
          .trim()}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data;
        setFetchData(result);
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (fetchData != null) setDataonUi();
  }, [fetchData, language]);

  const setDataonUi = () => {
    let result = fetchData;
    setValue(
      "applicationDateOld",
      result.createDtTm != null ? result.createDtTm : "-"
    );
    setValue(
      "applicationNo",
      result.applicationNo != null ? result.applicationNo : "-"
    );
    setAppNo(result.applicationNo);
    setValue("status", result.status != null ? result.status : "-");
    setValue(
      "finalRemark",
      result.finalRemark != null ? result.finalRemark : "-"
    );
    setValue(
      "citizenMobileNumber",
      result.citizenMobileNumber != null && result.citizenMobileNumber != "null"
        ? result.citizenMobileNumber
        : "-"
    );
    setValue("deptName", result.department != null ? result.department : "-");
    setValue(
      "rtiAdhikari",
      result.userName != null
        ? result.userName + " " + result.userLastName
        : "-"
    );
    setValue(
      "villageName",
      result.villageName != null ? result.villageName : "-"
    );
    setValue(
      "fullName",
      result.citizenFirstName != null &&
        result.citizenMiddleName != null &&
        result.citizenLastName != null
        ? result.citizenFirstName +
            " " +
            result.citizenMiddleName +
            " " +
            result.citizenLastName
        : "-"
    );
    setValue(
      "departmentName",
      result.departmentName != null ? result.departmentName : "-"
    );
    setValue(
      "subjectName",
      result.subjectName != null ? result.subjectName : "-"
    );
    let _res = result?.applicationTrackingDaos?.map((val, i) => {
      return {
        id: val.key,
        srNo: i + 1,
        userName:
          val.userName != null &&
          val.userMiddleName != null &&
          val.userLastName != null
            ? val.userName + " " + val.userMiddleName + " " + val.userLastName
            : "-",
        applicationDate:
          val.createDtTm === null
            ? "-"
            : moment(val.createDtTm).format("DD-MM-YYYY"),
        citizenMobileNumber:
          val.citizenMobileNumber != null && val.citizenMobileNumber != "null"
            ? val.citizenMobileNumber
            : "-",
        remark: val.reason != null ? val.reason : "-",
        subjectName: val.subjectName != null ? val.subjectName : "-",
        status: val.status != null ? val.status : "-",
        applicationNo: val.applicationNo != null ? val.applicationNo : "-",
      };
    });
    setAuditData(_res);
  };
  const Auditcolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "userName",
      headerName:
        language === "en"
          ? "Name of department user "
          : "विभाग वापरकर्त्याचे नाव",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
  ];



  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <div>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
          <Box>
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center", // Center vertically
                alignItems: "center",
                width: "100%",
                height: "auto",
                overflow: "auto",
                color: "white",
                fontSize: "18.72px",
                borderRadius: 100,
                fontWeight: 500,
                background:
                  "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
              }}
            >
              <Grid item xs={1}>
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginRight: "2rem",
                  }}
                >
                  <FormattedLabel id="trackOldRTIApplication" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          {(router.query.id === null || router.query.id === undefined) && (
            <div>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "1rem",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={10}
                  lg={10}
                  xl={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 15,
                  }}
                >
                  <TextField
                    autoFocus
                    InputLabelProps={{
                      shrink: watch("applicationNo") ? true : false,
                    }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="outlined-basic"
                    label={
                      language === "en" ? "Application Number" : "अर्ज क्रमांक"
                    }
                    placeholder="Search by Application Number"
                    variant="standard"
                    {...register("applicationNo")}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={2}
                  lg={2}
                  xl={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: " flex-start",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    onClick={() => {
                      if (watch("grievanceId")) {
                        getRTIApplicationById(watch("grievanceId"));
                      } else {
                        sweetAlert({
                          title: language === "en" ? "OOPS!" : "क्षमस्व!",
                          text:
                            language === "en"
                              ? "Please Enter The Complaint Number First"
                              : "कृपया प्रथम तक्रार क्रमांक प्रविष्ट करा",
                          icon: "warning",
                          dangerMode: true,
                          closeOnClickOutside: false,
                          button: language == "en" ? "Ok" : "ठीक आहे",
                        });
                      }
                    }}
                    size="small"
                  >
                    {language === "en" ? "get Details" : "तपशील मिळवा"}
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          <div>
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  endIcon={<DownloadIcon />}
                  size="small"
                  onClick={() => {
                    handlePrint();
                  }}
                >
                  {language == "en" ? "Download PDF" : "पीडीएफ डाउनलोड करा"}
                </Button>
              </Grid>
              <form>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      paddingTop: "20px",
                      paddingLeft: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: "15px" }}>
                      {language === "en"
                        ? "Application Number : "
                        : "अर्ज क्रमांक :  "}{" "}
                      <strong>{appNo}</strong>
                    </div>
                  </Box>
                </Box>
                {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="fullName" />}
                      InputLabelProps={{
                        shrink: watch("fullName") ? true : false,
                      }}
                      {...register("fullName")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="mobileNo" />}
                      InputLabelProps={{
                        shrink: watch("citizenMobileNumber") ? true : false,
                      }}
                      variant="standard"
                      {...register("citizenMobileNumber")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="villageName" />}
                      InputLabelProps={{
                        shrink: watch("villageName") ? true : false,
                      }}
                      variant="standard"
                      {...register("villageName")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.grievanceRaiseDate}
                    >
                      <Controller
                        control={control}
                        name="applicationDateOld"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              inputFormat={
                                logedInUser === "departmentUser"
                                  ? "DD/MM/YYYY H:mm:ss"
                                  : "DD/MM/YYYY"
                              }
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="applicationDateOld" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    m: { xs: 0, md: 1 },
                                    minWidth: "100%",
                                  }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.applicationDateOld
                          ? errors.applicationDateOld.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="status" />}
                      InputLabelProps={{
                        shrink: watch("status") ? true : false,
                      }}
                      {...register("status")}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="subjectName" />}
                      InputLabelProps={{
                        shrink: watch("subjectName") ? true : false,
                      }}
                      variant="standard"
                      {...register("subjectName")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="departmentName" />}
                      InputLabelProps={{
                        shrink: watch("departmentName") ? true : false,
                      }}
                      variant="standard"
                      {...register("departmentName")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="rtiAdhikariNm" />}
                      InputLabelProps={{
                        shrink: watch("rtiAdhikari") ? true : false,
                      }}
                      variant="standard"
                      {...register("rtiAdhikari")}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="finalRemark" />}
                      InputLabelProps={{
                        shrink: watch("finalRemark") ? true : false,
                      }}
                      variant="standard"
                      {...register("finalRemark")}
                    />
                  </Grid>
                </Grid>
                {document.length === 0 && (
                  <span
                    style={{
                      color: "red",
                      display: "flex",
                      textAlign: "center",
                      flexDirection: "column",
                    }}
                  >
                    {language == "en"
                      ? "NO DOCUMENTS TO SHOW HERE"
                      : "येथे दर्शविण्यासाठी कोणतेही दस्तऐवज नाहीत"}
                  </span>
                )}
                {document.length != 0 && (
                  <>
                    <Box>
                      <Grid
                        container
                        className={commonStyles.title}
                        style={{ marginBottom: "1rem", marginTop: "3rem" }}
                      >
                        <Grid item xs={12}>
                          <h3
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              marginRight: "2rem",
                            }}
                          >
                            <FormattedLabel id="documents" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                    <div>
                      <DataGrid
                        sx={{
                          overflowY: "scroll",
                          "& .MuiDataGrid-columnHeadersInner": {
                            backgroundColor: "#556CD6",
                            color: "white",
                          },
                        }}
                        autoHeight
                        disableSelectionOnClick
                        rows={document || []}
                        columns={documentCol}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                      />
                    </div>
                  </>
                )}
                <Box>
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center", // Center vertically
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      color: "white",
                      fontSize: "18.72px",
                      borderRadius: 100,
                      fontWeight: 500,
                      background:
                        "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                    }}
                  >
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="trackOldRTIApplicationHistory" />
                      </h3>
                    </Grid>
                  </Grid>
                  <DataGrid
                    autoHeight
                    sx={{
                      overflowY: "scroll",
                      marginTop: "10px",
                      backgroundColor: "white",
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        textOverflow: "unset !important",
                        whiteSpace: "break-spaces !important",
                        lineHeight: "1 !important",
                      },
                      "& .MuiDataGrid-cellContent": {
                        textOverflow: "unset !important",
                        whiteSpace: "break-spaces !important",
                        lineHeight: "1 !important",
                      },
                      "& .MuiDataGrid-cell:hover": {},
                      "& .MuiSvgIcon-root": {
                        color: "black", // change the color of the check mark here
                      },
                    }}
                    density="compact"
                    rows={auditData || []}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    columns={Auditcolumns}
                    disableSelectionOnClick
                  />
                </Box>

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      startIcon={<ArrowBackIcon />}
                      size="small"
                      onClick={() => {
                        {
                          router.push({
                            pathname:
                              "/RTIOnlineSystem/reports/oldRTIApplication",
                          });
                        }
                      }}
                    >
                      <FormattedLabel id="backToDashboard" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>

            {dataNotAvail && (
              <div>
                <p style={{ textAlign: "center" }}>
                  <FormattedLabel id="dataNotAvail" />
                </p>
              </div>
            )}
          </div>
        </Paper>
      </div>
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={5}
          componentRef={componentRef}
          deptName={{
            en: "RTI Online System",
            mr: "आरटीआय ऑनलाइन प्रणाली",
          }}
          reportName={{
            en: "Complete Details of the application",
            mr: "अर्जाचा संपूर्ण तपशील",
          }}
        >
          <ComponentToPrintNew
            dayWiseDataInDetails={fetchData}
            historyData={auditData}
            language={language}
          />
        </ReportLayout>
      </div>
    </ThemeProvider>
  );
};
class ComponentToPrintNew extends React.Component {
  render() {
    const { language } = this?.props?.language;
    return (
      <>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table>
              <tbody>
                <tr>
                  <td colSpan={5} className={Styles.Table1HEADER}>
                    {this?.props?.language == "en"
                      ? "Complete Details of the application"
                      : "अर्जाचा संपूर्ण तपशील"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Application Number :"
                      : "अर्ज क्र.:"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.applicationNo}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "RTI Application Date :"
                      : "अर्जाची तारीख :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {moment(
                      this?.props?.dayWiseDataInDetails?.entryDate
                    ).format("DD-MM-YYYY")}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Applicant Name :"
                      : "अर्जदाराचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.citizenFirstName !=
                      null &&
                    this?.props?.dayWiseDataInDetails?.citizenMiddleName !=
                      null &&
                    this?.props?.dayWiseDataInDetails?.citizenLastName != null
                      ? this?.props?.dayWiseDataInDetails?.citizenFirstName +
                        " " +
                        this?.props?.dayWiseDataInDetails?.citizenMiddleName +
                        " " +
                        this?.props?.dayWiseDataInDetails?.citizenLastName
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Mobile No :"
                      : "मोबाईल क्र :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.citizenMobileNumber}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Village Name :"
                      : "गावाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.villageName != null
                      ? this?.props?.dayWiseDataInDetails?.villageName
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Status :" : "स्थिती :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.status}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department Name :"
                      : " विभागाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.departmentName}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Subject Name :"
                      : "विषयाचे नाव :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.subjectName === null
                      ? "-"
                      : this?.props?.dayWiseDataInDetails?.subjectName}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Final Remark  :"
                      : "अंतिम टिप्पणी :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.finalRemark != null
                      ? this?.props?.dayWiseDataInDetails?.finalRemark
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "RTI Adhikari Name :"
                      : "आरटीआय अधिकारी नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.userName != null
                      ? this?.props?.dayWiseDataInDetails?.userName +
                        " " +
                        this?.props?.dayWiseDataInDetails?.userLastName
                      : "-"}
                  </td>
                </tr>
                <tr className={Styles.PageBreak}></tr>

                {/** second table header*/}
                <tr>
                  <td colSpan={5} className={Styles.Table2HEADER}>
                    {this?.props?.language == "en"
                      ? "History Of Track Old RTI Application"
                      : "जुन्या आरटीआय अर्जाचा इतिहास"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <table>
            <tbody>
              {" "}
              <tr>
                <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                  {this?.props?.language == "en" ? "Date" : "दिनांक"}
                </th>
                <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                  {this?.props?.language == "en" ? "User Name" : "कर्ता"}
                </th>

                <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                  {this?.props?.language == "en" ? "Status" : "स्थिती"}
                </th>

                <th colSpan={1} className={`${Styles.Table2Td}`}>
                  {this?.props?.language == "en" ? "Remark" : "शेरा"}
                </th>
              </tr>
              {this?.props?.historyData &&
                this?.props?.historyData?.map((data, index) => (
                  <>
                    <tr>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {data.applicationDate}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {data.userName === null ? "-" : data.userName}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {data?.status}
                      </td>
                      <td colSpan={1} className={`${Styles.Table2Td}`}>
                        {data?.remark == "null" || data?.remark == undefined
                          ? "-"
                          : data?.remark}
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
export default Index;
