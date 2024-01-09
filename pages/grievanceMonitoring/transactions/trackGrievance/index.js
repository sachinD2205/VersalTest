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
import React, { useEffect, useState } from "react";
import moment from "moment";
import theme from "../../../../theme";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { Visibility } from "@mui/icons-material";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import DocumentUploadTableSachinCss from "../../../../containers/reuseableComponents/DocumentUploadTableSachin/DocumentUploadTableSachin.module.css";
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
  const [compalaintHistory, setCompalaintHistory] = useState([]);
  const language = useSelector((store) => store.labels.language);
  let user = useSelector((state) => state.user.user);
  const headers ={ Authorization: `Bearer ${user?.token}` };
  const router = useRouter();
  const [document, setDocument] = useState([]);
  const [deptDoc, setDeptDoc] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const getGrievanceById = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.GM
        }/trnRegisterComplaint/getByApplicationId?applicationNo=${watch(
          "grievanceId"
        )?.replaceAll("+", "%2b")}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data;
        setFetchData(result);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };
  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        console.log("Shvani", r);
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
        } else if (r?.data?.mimeType == "video/mp4") {
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
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          console.log("dataUrl", dataUrl);
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
  const documentCol = [
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "center",
      width: "250",
    },
    {
      field: "transactionType",
      headerName: language == "en" ? "Action" : "कृती",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "documentType",
      headerName: language == "en" ? "File Type" : "दस्तऐवजाचा प्रकार",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "250",
    },
    {
      field: "attachedDate1",
      headerName:
        language == "en" ? "Document Attached Date" : "दस्तऐवज संलग्न तारीख",
      headerAlign: "center",
      align: "center",
      flex: 1,
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
                getFilePreview(record?.row?.filePath)
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (fetchData != null) setDataonUi();
  }, [fetchData, language]);

  useEffect(() => {
    if (fetchData != null) setDataImageonUi();
  }, [fetchData]);

  let setDataImageonUi = () => {
    const result = fetchData;
    let res = [];
    if (result?.trnAttacheDocumentDtos != 0) {
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "ROC" || obj.transactionType === "RC") {
          return res.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType:
              obj.transactionType === "ROC" ? "Reopen" : "Register",
          });
        }
      });

      let res1 = [];
      result?.trnAttacheDocumentDtos?.map((obj, index) => {
        if (obj.transactionType === "CC") {
          return res1.push({
            id: index + 1,
            originalFileName: obj.originalFileName,
            documentType: obj.documentType,
            filePath: obj.filePath,
            attachedDate1:
              logedInUser === "departmentUser"
                ? moment(obj.attachedDate).format("DD-MM-YYYY HH:mm:ss")
                : moment(obj.attachedDate).format("DD-MM-YYYY"),
            transactionType: "Close",
          });
        }
      });
      setDeptDoc(res1);
      setDocument(res);
    } else {
      setDocument([]);
      setDeptDoc([]);
    }
  };

  const setDataonUi = () => {
    let result = fetchData;
    if (result?.complaintHistoryDao?.length != 0) {
      let data = result.complaintHistoryDao;
      const comHistory = data?.map((item,index) => ({
        id: index + 1,
        date:
          logedInUser === "departmentUser"
            ? moment(item?.date).format("DD-MM-YYYY HH:mm:ss")
            : moment(item?.date).format("DD-MM-YYYY"),
        userName: item?.userName,
        userNameMr: item?.userNameMr,
        remark:
          item?.remark == "null" || item?.remark == undefined
            ? "-"
            : item?.remark,
        oldCondition: item?.oldCondition,
        oldConditionMr: item?.oldConditionMr,
        newCondition: item?.newCondition,
        newConditionMr: item?.newConditionMr,
      }));
      setCompalaintHistory(comHistory);
    } else {
      setCompalaintHistory([]);
    }

    setValue("grievanceRaiseDate", result.createDtTm);
    setValue("grievanceId", result.applicationNo);
    setValue(
      "complaintStatusText",
      result.reopenCount > 0 && result.complaintStatusText === "Open"
        ? language === "en"
          ? "Reopen"
          : "पुन्हा उघडले"
        : language === "en"
        ? result.complaintStatusText
        : result.complaintStatusTextMr
    );
    setValue("board", result.location);
    setValue("complaintDescription", result.complaintDescription);
    setValue("complaintType", result.complaintType);
    setValue("deptName", result.deptName);
    setValue("subDepartmentText", result.subDepartmentText);
    setValue("firstName", result.firstName);
    setValue("middleName", result.middleName);
    setValue("surname", result.surname);
    setValue(
      "fullName",
      result.firstName + " " + result.middleName + " " + result.surname
    );
  };



  const columns = [
    {
      field: "date",
      headerName: <FormattedLabel id="date" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "userName" : "userNameMr",
      headerName: <FormattedLabel id="userName" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "remark" : "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "oldCondition" : "oldConditionMr",
      headerName: <FormattedLabel id="oldStatus" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "newCondition" : "newConditionMr",
      headerName: <FormattedLabel id="newStatus" />,
      flex: 1,
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
                  <FormattedLabel id="helpDeskAndInquiry" />
                </h3>
              </Grid>
            </Grid>
          </Box>

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
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="outlined-basic"
                  label={
                    language === "en" ? "Complaint Number" : "तक्रार क्रमांक"
                  }
                  placeholder="Search by Complaint Number"
                  variant="standard"
                  {...register("grievanceId")}
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
                      getGrievanceById();
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
          <div>
            {fetchData ? (
              <form>
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.grievanceRaiseDate}
                    >
                      <Controller
                        control={control}
                        name="grievanceRaiseDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              inputFormat= {logedInUser === "departmentUser"?"DD/MM/YYYY H:mm:ss":"DD/MM/YYYY"}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="grievanceRaiseDate" />
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
                                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                        {errors?.grievanceRaiseDate
                          ? errors.grievanceRaiseDate.message
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
                      label={<FormattedLabel id="complaintStatusText" />}
                      InputLabelProps={{
                        shrink: watch("complaintStatusText") ? true : false,
                      }}
                      {...register("complaintStatusText")}
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
                        shrink: watch("deptName") ? true : false,
                      }}
                      variant="standard"
                      {...register("deptName")}
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
                      label={<FormattedLabel id="subDepartmentName" />}
                      InputLabelProps={{
                        shrink: watch("subDepartmentText") ? true : false,
                      }}
                      variant="standard"
                      {...register("subDepartmentText")}
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
                      label={<FormattedLabel id="complaintType" />}
                      InputLabelProps={{
                        shrink: watch("complaintType") ? true : false,
                      }}
                      variant="standard"
                      {...register("complaintType")}
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
                      label={<FormattedLabel id="complaintDescription" />}
                      multiline
                      InputLabelProps={{
                        shrink: watch("complaintDescription") ? true : false,
                      }}
                      id="standard-basic"
                      variant="standard"
                      {...register("complaintDescription")}
                    />
                  </Grid>
                </Grid>

                <div className={DocumentUploadTableSachinCss.doctitle}>
                  <strong style={{ textDecorationColor: "red", fontSize:'20px' }}>
                    {language == "en"
                      ? "Uploaded Documents Section"
                      : "अपलोड केलेला दस्तऐवज विभाग"}
                  </strong>
                </div>
                {document.length === 0 && deptDoc.length === 0 && (
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
                        style={{ marginBottom: "1rem", marginTop: "1rem" }}
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
                            <FormattedLabel id="citizenUploaded" />
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
                {deptDoc.length != 0 && (
                  <>
                    <Box>
                      <Grid
                        container
                        className={commonStyles.title}
                        style={{ marginTop: "1rem" }}
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
                            <FormattedLabel id="deptUploaded" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                    <div>
                      <DataGrid
                        sx={{
                          overflowY: "scroll",
                          marginTop: 2,
                          "& .MuiDataGrid-columnHeadersInner": {
                            backgroundColor: "#556CD6",
                            color: "white",
                          },
                        }}
                        autoHeight
                        disableSelectionOnClick
                        rows={deptDoc || []}
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
                        className={commonStyles.title}
                        style={{ marginBottom: "1rem", marginTop: "1rem" }}
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
                            <FormattedLabel id="complaintHistory" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>
                <DataGrid
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                  }}
                  density="compact"
                  pagination
                  paginationMode="server"
                  rowsPerPageOptions={[5]}
                  rows={compalaintHistory || []}
                  columns={columns}
                  
                />

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
                      color="error"
                      startIcon={<ArrowBackIcon />}
                      size="small"
                      onClick={() => {
                        {
                          logedInUser === "departmentUser" &&
                            router.push({
                              pathname:
                                "/grievanceMonitoring/dashboards/deptUserDashboard",
                            });
                        }
                        {
                          logedInUser === "citizenUser" &&
                            router.push({
                              pathname:
                                "/grievanceMonitoring/dashboards/citizenUserDashboard",
                            });
                        }
                        {
                          logedInUser === "cfcUser" &&
                            router.push({
                              pathname:
                                "/grievanceMonitoring/dashboards/cfcUserDashboard",
                            });
                        }
                      }}
                    >
                      <FormattedLabel id="backToDashboard" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <div>
                <p style={{ textAlign: "center" }}>Data Not Available</p>
              </div>
            )}
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
