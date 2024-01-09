import React, { useState, useEffect } from "react";
import * as MuiIcons from "@mui/icons-material";
import moment from "moment";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  Link,
  Paper,
  Tooltip,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../../../../components/grievanceMonitoring/view.module.css";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DashboardHome = (props) => {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
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

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  // ............................................API CALSS................................
  const language = useSelector((state) => state.labels.language);
  const [transData, setTransData] = useState([]);
  const [resolvedGrievance, setResolvedGrievance] = useState([]);
  const [unResolvedGrievance, setUnResolvedGrievance] = useState([]);
  const [unVerified, setUnVerified] = useState([]);
  const [VerifiedD, setVerifiedD] = useState([]);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [isModalOpenForUnResolved, setIsModalOpenForUnResolved] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [uIData, setUIData] = useState([]);

  // user1
  const user = useSelector((state) => {
    return state?.user?.user.id;
  });

  // user1
  const user1 = useSelector((state) => {
    let userNamed =
      language === "en"
        ? state?.user?.user?.userDao?.firstNameEn
        : state?.user?.user?.userDao?.firstNameMr;
    return userNamed;
  });

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });

  // .............>>>>>>>>>>>>>>><<<<<<<<<<<<<<.................
  const {
    formState: { errors },
  } = useForm({});

  const getTransactions = async () => {
    try {
      setLoading(true); // Set loading before sending API request
      const response = await axios.get(
        `${urls.GM}/trnRegisterComplaint/getListByUser?id=${user}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      let result = response?.data?.trnRegisterComplaintList;
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
          complaintStatusTextMr:
            val.reopenCount > 0 && val.complaintStatusTextMr === "उघडा"
              ? "पुन्हा उघडले"
              : val.complaintStatusTextMr,

          complaintTypeMr: val.complaintTypeMr,
          email: val.email,
          mobileNumber: val.mobileNumber,
          subDepartment: val.subDepartment,
          subDepartmentText: val.subDepartmentText,
          complaintStatus: val.complaintStatus,
          grievanceDate: moment(val.createDtTm).format("DD-MM-YYYY"),
          escDate: moment(val.escDate).format("DD-MM-YYYY"),
          complaintType: val.complaintType,
          complaintStatusText:
            val.reopenCount > 0 && val.complaintStatusText === "Open"
              ? language === "en"
                ? "Reopen"
                : "पुन्हा उघडले"
              : val.complaintStatusText,
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
      setResolvedGrievance(
        resolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
            complaintSubType:
              obj.complaintSubType != null ? obj.complaintSubType : "-",
            complaintSubTypeMr:
              obj.complaintSubTypeMr != null ? obj.complaintSubTypeMr : "-",
            escDate: moment(obj.escDate).format("DD-MM-YYYY H:mm:ss"),
            grievanceDate: moment(obj.createDtTm).format("DD-MM-YYYY H:mm:ss"),
          };
        })
      );
      setUnResolvedGrievance(
        UnresolvedComplaints.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
            complaintSubType:
              obj.complaintSubType != null ? obj.complaintSubType : "-",
            complaintSubTypeMr:
              obj.complaintSubTypeMr != null ? obj.complaintSubTypeMr : "-",
            escDate: moment(obj.escDate).format("DD-MM-YYYY H:mm:ss"),
            grievanceDate: moment(obj.createDtTm).format("DD-MM-YYYY H:mm:ss"),
          };
        })
      );
      setUnVerified(UnresolvedComplaints);
      setVerifiedD(resolvedComplaints);
      setLoading(false); // Stop loading
    } catch (err) {
      setLoading(false); // Stop loading in case of error
      cfcErrorCatchMethod(err, false);
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
    if (user != undefined && user != null) {
      getTransactions();
    }
  }, [user]);

  const handleCancel = () => {
    setIsModalOpenForResolved(false);
    setIsModalOpenForUnResolved(false);
  };

  const columns = [
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1,
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
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      headerName: <FormattedLabel id="grievanceSubType" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
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
      field: "complaintStatusText",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 0.5,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ? (
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
      flex: 0.5,
      headerAlign: "center",
      align: "right",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router.push({
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

  return (
    <>
      {loading && <CommonLoader />}
      <>
        <Box>
          <Box
            sx={{
              display: "flex",
              padding: "30px",

              flexDirection: "column",
            }}
          >
            <Typography>
              <p className={styles.fancy_link}>
                {language === "en"
                  ? "Welcome to the dashboard : "
                  : "डॅशबोर्डवर आपले स्वागत आहे: "}{" "}
                <strong>{user1}</strong>
              </p>
            </Typography>
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <FormControl
                fullWidth
                size="small"
                style={{
                  backgroundColor: "white",
                }}
              ></FormControl>
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
                    <Grid
                      key={id}
                      item
                      xs={3}
                      style={{
                        paddingTop: "10px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingBottom: "0px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Grid
                        container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "15px",
                          backgroundColor: "white",
                          height: "100%",
                        }}
                        sx={{
                          ":hover": {
                            boxShadow: "0px 5px #556CD6",
                          },
                        }}
                        boxShadow={3}
                      >
                        <Grid
                          item
                          xs={2}
                          style={{
                            padding: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: val.bg,
                            color: "white",
                            borderRadius: "7px",
                          }}
                          boxShadow={2}
                        >
                          <ComponentWithIcon iconName={val.icon} />
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
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
                                    color: "darkblue",
                                    cursor: "default",
                                    letterSpacing: "1px",
                                  }}
                                  onClick={() => {
                                    setSelectedCard(null);
                                  }}
                                  tabIndex={0}
                                >
                                  {val.name}
                                </Link>
                              )
                            : val.nameMr === "एकूण तक्रारी" && (
                                <Link
                                  style={{
                                    fontWeight: "800",
                                    color: "darkblue",
                                    cursor: "default",
                                    letterSpacing: "1px",
                                  }}
                                  tabIndex={0}
                                  onClick={() => {
                                    setSelectedCard(null);
                                  }}
                                >
                                  {val.nameMr}
                                </Link>
                              )}
                        </Grid>
                      </Grid>
                    </Grid>
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

          <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={10}></Grid>
            <Grid
              item
              xs={2}
              style={{
                textAlign: "center",
              }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
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
                {language === "en" ? "Raise Grievance" : "तक्रार करा"}
              </Button>
            </Grid>
          </Grid>

          <DataGrid
            autoHeight
            sx={{
              overflowY: "scroll",

              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {},
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
            pageSize={10}
            rowsPerPageOptions={[10]}
            columns={columns}
            disableSelectionOnClick
          />
        </Paper>

        <Modal
          open={isModalOpenForResolved}
          onOk={true}
          footer=""
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
            }}
          >
            <Grid
              container
              style={{ padding: "10px" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={10}></Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  onClick={() =>
                    router.push({
                      pathname:
                        "/grievanceMonitoring/transactions/RegisterComplaint",
                    })
                  }
                >
                  {<FormattedLabel id="raiseGrievance" />}
                </Button>
              </Grid>
            </Grid>
            <>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
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
                density="compact"
                rows={resolvedGrievance || []}
                pageSize={5}
                rowsPerPageOptions={[5]}
                columns={columns}
                disableSelectionOnClick
              />
            </>
            {/* </Box> */}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 90,
              }}
            >
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToAppIcon />}
                style={{ borderRadius: "20px" }}
                size="small"
                onClick={handleCancel}
              >
                {<FormattedLabel id="closeModal" />}
              </Button>
            </div>
          </Box>
        </Modal>

        <Modal
          open={isModalOpenForUnResolved}
          onOk={true}
          footer=""
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "90%",
            }}
          >
            <Grid
              container
              style={{ padding: "10px" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={10}></Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  type="primary"
                  onClick={() =>
                    router.push({
                      pathname:
                        "/grievanceMonitoring/transactions/RegisterComplaint",
                    })
                  }
                >
                  {<FormattedLabel id="raiseGrievance" />}
                </Button>
              </Grid>
            </Grid>
            <>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
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
                density="compact"
                rows={unResolvedGrievance || []}
                pageSize={5}
                rowsPerPageOptions={[5]}
                columns={columns}
                disableSelectionOnClick
              />
            </>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 90,
              }}
            >
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToAppIcon />}
                style={{ borderRadius: "20px" }}
                size="small"
                onClick={handleCancel}
              >
                {<FormattedLabel id="closeModal" />}
              </Button>
            </div>
          </Box>
        </Modal>
      </>
    </>
  );
};

DashboardHome.propTypes = {
  window: PropTypes.func,
};

export default DashboardHome;
