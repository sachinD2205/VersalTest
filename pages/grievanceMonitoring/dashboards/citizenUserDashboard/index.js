import React, { useState, useEffect } from "react";
import * as MuiIcons from "@mui/icons-material";
import {
  Box,
  Typography,
  Grid,
  Link,
  Paper,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {cfcCatchMethod, moduleCatchMethod} from '../../../../util/commonErrorUtil'
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

const DashboardHome = (props) => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const language = useSelector((state) => state.labels.language);

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };
  const [transData, setTransData] = useState([]);
  const [uIData, setUIData] = useState([]);
  const [unVerified, setUnVerified] = useState([]);
  const [VerifiedD, setVerifiedD] = useState([]);

    const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.up("md"));
  const [loading, setLoading] = useState(false);
  const router1 = useRouter();
  const [pageSize, setPageSize] = useState(10);
  const user = useSelector((state) => {
    return state?.user?.user?.id;
  });
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });

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

  const {
    formState: { errors },
  } = useForm({});

  const getTransactions = async () => {
    try {
      setLoading(true); 
      const response = await axios.get(
        `${urls.GM}/trnRegisterComplaint/getListByUser?id=${user}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      let result = response?.data?.trnRegisterComplaintList;
      setLoading(false);
      let _res = result?.map((val, i) => {
        return {
          id: val.id,
          srNo: i + 1,
          firstName: val.firstName,
          complaintType: val.complaintType,
          citizenName: val.citizenName,
          city: val.city,
          complaintDescription: val.complaintDescription,
          complaintSubType:
            val.complaintSubType != null ? val.complaintSubType : "-",
          complaintSubTypeMr:
            val.complaintSubTypeMr != null ? val.complaintSubTypeMr : "-",
          deptName: val.deptName,
          deptNameMr: val.deptNameMr,
          complaintTypeMr: val.complaintTypeMr,
          email: val.email,
          mobileNumber: val.mobileNumber,
          subDepartment: val.subDepartment,
          subDepartmentText: val.subDepartmentText,
          complaintStatus: val.complaintStatus,
          grievanceDate: moment(val.createDtTm).format("DD-MM-YYYY"),
          escDate: moment(val.escDate).format("DD-MM-YYYY"),
          // complaintSubType: val.complaintSubType,
          complaintType: val.complaintType,
          complaintStatusText:
            val.reopenCount > 0 && val.complaintStatusText === "Open"
              ? "Reopen"
              : val.complaintStatusText,
          complaintStatusTextMr:
            val.reopenCount > 0 && val.complaintStatusTextMr === "उघडा"
              ? "पुन्हा उघडले"
              : val.complaintStatusTextMr,
          subject: val.subject,
          applicationNo: val.applicationNo,
        };
      });

      let UnresolvedComplaints = result?.filter(
        (obj) => obj.complaintStatusText === "Open"
      );
      let resolvedComplaints = result?.filter(
        (obj) => obj.complaintStatusText === "Close"
      );
      setTransData(_res);
      setUnVerified(UnresolvedComplaints);
      setVerifiedD(resolvedComplaints);
      setLoading(false); // Stop loading
    } catch (error) {
      setLoading(false); // Stop loading in case of error
      cfcErrorCatchMethod(error,false);
    }
  };

  
  useEffect(() => {
    if (selectedCard === null) {
      setUIData(transData);
    } else if (selectedCard === 1) {
      let resolvedComplaints = transData?.filter(
        (obj) => obj.complaintStatusText === "Close"
      );
      setUIData(
        resolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
          };
        })
      );
    } else if (selectedCard === 2) {
      let UnresolvedComplaints = transData?.filter(
        (obj) =>
          obj.complaintStatusText === "Open" ||
          obj.complaintStatusText === "Reopen"
      );

      setUIData(
        UnresolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
          };
        })
      );
    }
  }, [selectedCard, transData]);



  useEffect(() => {
    if (user != undefined && user != null) getTransactions();
  }, [user]);


  const columnsDesktopView = [
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1.25,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "complaintType" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 2,
      headerAlign: "left",
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      headerName: <FormattedLabel id="grievanceSubType" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 2,
      headerAlign: "left",
    },
    {
      field: "escDate",
      headerName:
        language === "en"
          ? "Tentative Resolution Date"
          : "तात्पुरत्या ठरावाची तारीख",
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field:
        language === "en" ? "complaintStatusText" : "complaintStatusTextMr",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 0.5,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ||
            params?.row?.complaintStatusText === "Reopen" ? (
              <div style={{ color: "orange" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            ) : (
              <div style={{ color: "green" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID ${params?.row?.id}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.id} या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];
  const columnsMobileView = [
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
      width: 250,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "complaintType" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      width: 300,
      headerAlign: "left",
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      headerName: <FormattedLabel id="grievanceSubType" />,
      width: 300,
      headerAlign: "left",
    },
    {
      field: "escDate",
      headerName:
        language === "en"
          ? "Tentative Resolution Date"
          : "तात्पुरत्या ठरावाची तारीख",
          width: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field:
        language === "en" ? "complaintStatusText" : "complaintStatusTextMr",
      headerName: <FormattedLabel id="complaintStatusText" />,
      width: 150,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ||
            params?.row?.complaintStatusText === "Reopen" ? (
              <div style={{ color: "orange" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            ) : (
              <div style={{ color: "green" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID ${params?.row?.id}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.id} या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];


  const desktopViewStyles = { 
    "& .MuiDataGrid-columnHeaderTitle": {
      textOverflow: "unset !important",
      whiteSpace: "break-spaces !important",
      lineHeight: "1 !important",
    },
  };
  return (
    <>
      <>
        <Box>
          <Box
            sx={{
              padding: "30px",
              flexDirection: "column",
            }}
          >
{loading && <CommonLoader/>}
            <Box>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "Grievance Monitoring Dashboard"
                    : "तक्रारींचा डॅशबोर्ड"}
                </b>
              </h2>
            </Box>
            <Grid
              container
              style={{ display: "flex", justifyContent: "center" }}
            >
              {[
                {
                  icon: "Menu",
                  count: `${VerifiedD?.length ? VerifiedD.length : 0}`,
                  name: "Resolved Grievances",
                  nameMr: "निरस्त तक्रारी",
                  bg: "green",
                },
                {
                  icon: "Menu",
                  count: `${unVerified?.length ? unVerified.length : 0}`,
                  name: "Unresolved Grievances",
                  nameMr: "प्रलंबित तक्रारी",
                  bg: "red",
                },
                {
                  icon: "Menu",
                  count:
                    VerifiedD?.length || unVerified?.length
                      ? unVerified?.length + VerifiedD?.length
                      : 0,
                  name: "Total Grievances",
                  nameMr: "एकूण तक्रारी",
                  bg: "darkblue",
                },
              ].map((val, id) => {
                return (
                  <Tooltip title={val.name}>
                    <Box
                      spacing={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        marginRight: "6px",
                        marginBottom: "6px",
                      }}
                      sx={{
                        ":hover": {
                          boxShadow: "0px 5px #556CD6",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                      boxShadow={3}
                    >
                      <Grid
                        item
                        xs={2}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: val.bg,
                          color: "white",
                          borderRadius: "7px",
                          width: "40%",
                          margin: "auto",
                        }}
                        boxShadow={2}
                      >
                        <ComponentWithIcon iconName={val.icon} />
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "6px",
                          marginBottom: "6px",
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: "500",
                            fontSize: "25px",
                            color: "darkblue",
                          }}
                        >
                          {val.count}
                        </Typography>
                        {language == "en"
                          ? val.name === "Resolved Grievances" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "green",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(1);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr == "निरस्त तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "green",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(1);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.nameMr}
                              </Link>
                            )}
                        {language == "en"
                          ? val.name === "Unresolved Grievances" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "red",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(2);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr === "प्रलंबित तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "red",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(2);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.nameMr}
                              </Link>
                            )}

                        {language == "en"
                          ? val.name === "Total Grievances" && (
                           
                              <Link
                                style={{
                                  fontWeight: "800",
                                  color: "green",
                                  cursor: "default",
                                  letterSpacing: "1px",
                                }}
                                onClick={() => {
                                  setSelectedCard(null);
                                }}
                                tabIndex={0}
                                component="button"
                              >
                                {val.name}
                              </Link>
                            )
                          : val.nameMr === "एकूण तक्रारी" && (
                              <Link
                                style={{
                                  fontWeight: "800",
                                  cursor: "default",
                                  letterSpacing: "1px",
                                }}
                                tabIndex={0}
                                component="button"
                                onClick={() => {
                                  setSelectedCard(null);
                                }}
                              >
                                {val.nameMr}
                              </Link>
                            )}
                      </Grid>
                    </Box>
                  </Tooltip>
                );
              })}
            </Grid>
          </Box>
        </Box>

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
                  <FormattedLabel id="myGrievance" />
                </h3>
              </Grid>
            </Grid>
          </Box>
          <>
            <Grid
              container
              style={{ padding: "1rem" }}
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <>
                <Button
                  variant="contained"
                  endIcon={<AddIcon style={{}} />}
                  type="primary"
                  onClick={() =>
                    router.push({
                      pathname:
                        "/grievanceMonitoring/transactions/RegisterComplaint",
                    })
                  }
                  size="small"
                  style={{
                    textAlign: "center",
                  }}
                >
                  {<FormattedLabel id="raiseGrievance" />}
                </Button>
              </>
            </Grid>

            <DataGrid
              autoHeight
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cellContent": {
                  textOverflow: "unset !important",
                  whiteSpace: "break-spaces !important",
                  lineHeight: "1 !important",
                },
                ...(!isMobileView ? {} : desktopViewStyles),

                "& .MuiDataGrid-cell:hover": {
                },
                "& .MuiSvgIcon-root": {
                  color: "black", // change the color of the check mark here
                },
              }}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 0 },
                  disableExport: true,
                  disableToolbarButton: false,
                  csvOptions: { disableToolbarButton: false },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="standard"
              rows={uIData || []}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 50, 100]}
              pagination
              columns={!isMobileView ? columnsMobileView : columnsDesktopView}
              disableSelectionOnClick
            />
          </>
        </Paper>
      </>
    </>
  );
};

DashboardHome.propTypes = {
  window: PropTypes.func,
};

export default DashboardHome;
