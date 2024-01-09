import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  IconButton,
  Stack,
  Modal,
  TextareaAutosize,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

const AuditList = () => {
  const {
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [GrivanceAuditListTableData, setGrievanceAuditListTableData] = useState(
    []
  );
  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const [tokenHistoryDailog, setTokenHistoryDailog] = useState(false);
  const TokenHistoryDailogOpen = () => setTokenHistoryDailog(true);
  const TokenHistoryDailogClose = () => setTokenHistoryDailog(false);
  const [isLoading, setIsLoading] = useState(false);
  const [RemarkModalState, setRemarkModalState] = useState();
  const RemarkModalOpen = () => setRemarkModalState(true);
  const RemarkModalClose = () => setRemarkModalState(false);
  const [auditRemarkId1, setAuditRemarkId1] = useState();
  const [auditId1, setAuditId1] = useState();
  const [reportTitle1, setReportTitle1] = useState();
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

  //exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  // GrivanceAuditListColumns
  const GrivanceAuditListColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language == "en" ? "Token Number" : "टोकन क्रमांक",
      description: language == "en" ? "Token Number" : "टोकन क्रमांक",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      field: language == "en" ? "citizenName" : "citizenNameMr",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      description: language == "en" ? "Citizen Name" : "नागरिकाचे नाव",
      width: 270,
    },
    {
      field: "mobileNumber",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Contact No." : "संपर्क क्र.",
      description: language == "en" ? "Contact No." : "संपर्क क्र.",
      width: 270,
    },
    {
      field: "email",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Email" : "ईमेल",
      description: language == "en" ? "Email" : "ईमेल",
      width: 270,
    },
    {
      field: language == "en" ? "complaintType" : "complaintTypeMr",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Subject" : "विषय",
      description: language == "en" ? "Subject" : "विषय",
      width: 300,
    },
    {
      field: "grievanceDate",
      align: "left",
      headerName: language == "en" ? "Date" : "तारीख",
      description: language == "en" ? "Date" : "तारीख",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "closedDate",
      align: "left",
      headerName: language == "en" ? "Due Date" : "देय तारीख",
      description: language == "en" ? "Due Date" : "देय तारीख",
      headerAlign: "center",
      width: 200,
    },
    {
      field: language == "en" ? "complaintStatusText" : "complaintStatusTextMr",
      align: "left",
      headerName: language == "en" ? "Status" : "स्थिती",
      description: language == "en" ? "Status" : "स्थिती",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "actions",
      description: "Actions",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="actions" />,
      width: 500,
      sortable: false,
      disableColumnMenu: true,

      renderCell: (record) => {
        return (
          <>
            {record?.row?.auditRemarkId == null &&
              record?.row?.auditRemarkId == undefined && (
                <>
                  <IconButton
                    onClick={() => {
                      updateAuditList(
                        1,
                        record?.row?.id,
                        record?.row?.auditName
                      );
                    }}
                  >
                    <Button variant="contained" size="small" color="success">
                      {language == "en" ? "satisfactory" : "समाधानकारक"}
                    </Button>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      updateAuditList(
                        2,
                        record?.row?.id,
                        record?.row?.auditName
                      );
                    }}
                  >
                    <Button variant="contained" size="small" color="error">
                      {language == "en"
                        ? "Not Satisfactory"
                        : "समाधानकारक नाही"}
                    </Button>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setValue("auditRemarkText", "");
                      setAuditRemarkId1(3);
                      setAuditId1(record?.row?.id);
                      setReportTitle1(record?.row?.auditName);
                      RemarkModalOpen();
                    }}
                  >
                    <Button variant="contained" size="small" color="secondary">
                      {language == "en" ? "can not call" : "कॉल करू शकत नाही"}
                    </Button>
                  </IconButton>
                </>
              )}
            {record?.row?.auditRemarkId != null &&
              record?.row?.auditRemarkId != undefined && (
                <>
                  <Typography variant="subtitle2">
                    <strong>
                      {`${record?.row?.auditRemarkName} /${record?.row?.auditRemarkNameMr}`}
                    </strong>
                  </Typography>
                </>
              )}
          </>
        );
      },
    },
  ];

  //cancellButton
  const cancellButton = () => {
    setValue("reportTitle", null);
    setValue("AuditList", []);
    setValue("GrivanceAuditListTableData", []);
    setValue("searchInputState", true);
    clearErrors();
  };

  // updateAuditList
  const updateAuditList = (auditRemarkId, auditId, reportTitle) => {
    setIsLoading(true);
    // url
    let url = `${urls.GM}/internalAuditMaster/updateAudit`;

    let finalBodyForUpdateAuditList = {
      auditId: auditId,
      auditRemarkId: auditRemarkId,
      auditRemarkText:
        watch("auditRemarkText") != null &&
        watch("auditRemarkText") != undefined
          ? watch("auditRemarkText")
          : "",
    };

    axios
      .post(url, finalBodyForUpdateAuditList, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          sweetAlert(
            language === "en" ? "Success!!" : "यशस्वी!!",
            language === "en"
              ? "Response Successfully Submitted"
              : "प्रतिसाद यशस्वीरित्या सबमिट केला",
            "success"
          );
          getByAuditName(reportTitle);
          RemarkModalClose();
        } else {
          sweetAlert(
            language === "en" ? "Error" : "त्रुटी",
            language === "en" ? "Please Try Again" : "कृपया पुन्हा प्रयत्न करा",
            "error"
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };



  //  getByAuditName
  const getByAuditName = (reportTitle) => {
    let url = `${urls.GM}/internalAuditMaster/getByAuditName`;
    let finalBodyForApiForGetByAuditName = {
      reportTitle: reportTitle,
    };
    setIsLoading(true);
    axios
      .post(url, finalBodyForApiForGetByAuditName, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data != null &&
            res?.data != undefined &&
            res?.data?.length != 0
          ) {
            setValue("AuditList", res?.data);
            setValue("searchInputState", false);
          } else {
            sweetAlert(
              language === "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही",
              language === "en"
                ? "Record Not Found Against This Report Name"
                : "या अहवालाच्या नावाबाबत रेकॉर्ड आढळले नाही",
              "error"
            );
          }
        } else {
          sweetAlert(
            language === "en" ? "Error" : "त्रुटी",
            language === "en" ? "Please Try Again" : "कृपया पुन्हा प्रयत्न करा",
            "error"
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // getHistoryByTokenNumber
  const getHistoryByTokenNumber = (props) => {
    setValue("TokenHistoryDetails", []);
    setValue("tokenNo", "");
    if (props?.field == "applicationNo") {
      let body = {
        applicationNo: props?.value,
      };
      setIsLoading(true);
      let url = `${urls.GM}/report/getReportComplainDetails`;
      // api
      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data?.reportComplaintDeatilsListDao != null &&
              res?.data?.reportComplaintDeatilsListDao != undefined &&
              res?.data?.reportComplaintDeatilsListDao.length != "0"
            ) {
              let withsrNo = res?.data?.reportComplaintDeatilsListDao?.map(
                (data, index) => {
                  return {
                    ...data,
                    srNo: index + 1,
                    date: moment(data?.date).format("DD-MM-YYYY"),
                  };
                }
              );
              setValue("tokenNo", props?.value);
              setValue("TokenHistoryDetails", withsrNo);
            } else {
              sweetAlert(
                language === "en" ? "History !" : "इतिहास!",
                language === "en"
                  ? "History Not Found Aginst This Report"
                  : "या अहवालाबाबत इतिहास सापडला नाही",
                "error"
              );
            }
          } else {
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };

  // TokenHistoryAuditListColumns
  const TokenHistoryAuditListColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date",
      headerName: language == "en" ? "Date" : "दिनांक",
      description: language == "en" ? "दिनांक" : "दिनांक",
      headerAlign: "center",
      align: "center",
      width: 300,
    },
    {
      field: language == "en" ? "userName" : "userName",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "User" : "कर्ता",
      description: language == "en" ? "कर्ता" : "कर्ता",
      width: 270,
    },
    {
      field: language == "en" ? "oldCondition" : "oldCondition",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Old Status" : "जुनी स्थिती",
      description: language == "en" ? "Old Status" : "जुनी स्थिती",
      width: 300,
    },
    {
      field: "newCondition",
      align: "center",
      headerName: language == "en" ? "New Status" : "नविन स्थिती",
      description: language == "en" ? "New Status" : "नविन स्थिती",
      headerAlign: "center",
      width: 200,
    },
    {
      field: "remark",
      align: "center",
      headerName: language == "en" ? "Remark" : "शेरा",
      description: language == "en" ? "Remark" : "शेरा",
      headerAlign: "center",
      width: 200,
    },
  ];

  useEffect(() => {
    let AuditList = watch("AuditList");

    if (
      AuditList != null &&
      AuditList?.length != "0" &&
      AuditList != undefined
    ) {
      let withSrNoGrivanceAuditListData = AuditList?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
          applicationNo: data?.trnRegisterComplaintDao?.applicationNo,
          citizenName: data?.trnRegisterComplaintDao?.citizenName,
          citizenNameMr: data?.trnRegisterComplaintDao?.citizenNameMr,
          complaintType: data?.trnRegisterComplaintDao?.complaintType,
          complaintTypeMr: data?.trnRegisterComplaintDao?.complaintTypeMr,
          complaintTypeMr: data?.trnRegisterComplaintDao?.complaintTypeMr,
          grievanceDate: moment(data?.grievanceDate).format("DD-MM-YYYY"),
          closedDate: moment(data?.closedDate).format("DD-MM-YYYY"),
          complaintStatusText:  (data?.trnRegisterComplaintDao?.reopenCount>0 &&  data?.trnRegisterComplaintDao?.complaintStatusText ==='Open')?"Reopen":
            data?.trnRegisterComplaintDao?.complaintStatusText,
          complaintStatusTextMr:(data?.trnRegisterComplaintDao?.reopenCount>0 &&  data?.trnRegisterComplaintDao?.complaintStatusTextMr ==='उघडा')?"पुन्हा उघडले":
            data?.trnRegisterComplaintDao?.complaintStatusTextMr,
          mobileNumber: data?.trnRegisterComplaintDao?.mobileNumber,
          email: data?.trnRegisterComplaintDao?.email,
        };
      });
      setGrievanceAuditListTableData(withSrNoGrivanceAuditListData);
    }
  }, [watch("AuditList")]);

  useEffect(() => {
    let TokenTableDataOK = watch("TokenHistoryDetails");
    if (
      TokenTableDataOK != null &&
      TokenTableDataOK != undefined &&
      TokenTableDataOK.length != "0"
    ) {
      TokenHistoryDailogOpen();
    } else {
      TokenHistoryDailogClose();
    }
  }, [watch("TokenHistoryDetails")]);

  // View
  return (
    <>
      {isLoading && <CommonLoader />}
      <DataGrid
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
            printOptions: { disableToolbarButton: true },
            disableExport: true,
            disableToolbarButton: true,
            csvOptions: { disableToolbarButton: true },
          },
        }}
        density="compact"
        sx={{
          overflowY: "scroll",

          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#556CD6",
            color: "white",
          },

          "& .MuiDataGrid-cell:hover": {
          },
          "& .MuiSvgIcon-root": {
            color: "black", // change the color of the check mark here
          },
        }}
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          GrivanceAuditListTableData != undefined &&
          GrivanceAuditListTableData != null
            ? GrivanceAuditListTableData
            : []
        }
        columns={GrivanceAuditListColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellClick={getHistoryByTokenNumber}
        components={{ Toolbar: GridToolbar }}
      />
      {/** Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="center"
        alignItems="center"
        paddingBottom="5"
        marginTop="15"
      >
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<ClearIcon />}
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="clear" />
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          endIcon={<ExitToAppIcon />}
          onClick={() => exitButton()}
        >
          <FormattedLabel id="exit" />
        </Button>
      </Stack>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={tokenHistoryDailog}
        onClose={() => TokenHistoryDailogClose()}
      >
        <CssBaseline />
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Box>
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center", // Center vertically
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
                  {language == "en"
                    ? `History of Token No : ${watch("tokenNo")} `
                    : `टोकन क्रमांकाचा इतिहास : ${watch("tokenNo")}`}
                </h3>
              </Grid>
            </Grid>
          </Box>
          <div>
            <DataGrid
              getRowId={(row) => row.srNo}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 100 },
                  printOptions: { disableToolbarButton: true },
                  disableExport: false,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              sx={{
                backgroundColor: "white",
                m: 2,
                overflowY: "scroll",
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                },
              }}
              density="density"
              autoHeight
              columns={TokenHistoryAuditListColumns}
              rows={
                watch("TokenHistoryDetails") != undefined &&
                watch("TokenHistoryDetails") != null
                  ? watch("TokenHistoryDetails")
                  : []
              }
              pageSize={5}
              rowsPerPageOptions={[5]}
              title={<FormattedLabel id="goshwaraT" />}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        </DialogContent>
        <DialogTitle>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Stack
              style={{
                display: "flex",
                justifyContent: "center",
              }}
              spacing={3}
              direction={"row"}
            >
              <Button
                style={{ backgroundColor: "red" }}
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  setValue("tokenNo", "");
                  setValue("TokenHistoryDetails", []);
                  TokenHistoryDailogClose();
                }}
              >
                {<FormattedLabel id="exit" />}
              </Button>
            </Stack>
          </Grid>
        </DialogTitle>
      </Dialog>

      <>
        <Modal
          open={RemarkModalState}
          onClose={() => RemarkModalClose()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
          }}
        >
          <Paper
            sx={{
              padding: 2,
              height: "400px",
              width: "600px",
            }}
            elevation={5}
            component={Box}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    marginBottom: "30px",
                    marginTop: "20px",
                  }}
                  variant="h6"
                >
                  {language == "en" ? "Enter Remark" : "टिप्पणी प्रविष्ट करा"}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextareaAutosize
                  style={{
                    width: "550px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "30px",
                  }}
                  {...register("auditRemarkText")}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={5} direction="row">
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() =>
                      updateAuditList(auditRemarkId1, auditId1, reportTitle1)
                    }
                  >
                    {language == "en" ? "Submit" : "प्रस्तुत करणे"}
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => RemarkModalClose()}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      </>
    </>
  );
};

export default AuditList;
