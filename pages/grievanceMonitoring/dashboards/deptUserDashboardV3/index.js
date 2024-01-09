import React, { useState, useEffect } from "react";
import * as MuiIcons from "@mui/icons-material";
import {
  Box,
  Typography,
  Grid,
  Link,
  Paper,
  Tooltip,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import {  useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../../../../components/grievanceMonitoring/view.module.css";
import { useForm } from "react-hook-form";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

const DashboardHome = (props) => {
  const router = useRouter();
  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  useEffect(() => {
    if (props?.data?.length != 0) {
      let result = props?.data?.trnRegisterComplaintList;
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
          complaintSubType: val.complaintSubType,
          deptName: val.deptName,
          email: val.email,
          mobileNumber: val.mobileNumber,
          subDepartment: val.subDepartment,
          subDepartmentText: val.subDepartmentText,
          complaintStatus: val.complaintStatus,
          grievanceDate: moment(val.grievanceDate).format("DD-MM-YYYY"),
          complaintSubType: val.complaintSubType,
          complaintType: val.complaintType,
          complaintStatusText: val.complaintStatusText,
          createdBy: val.createdBy,
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
        resolvedComplaints?.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
            complaintSubType:
              obj.complaintSubType != null ? obj.complaintSubType : "-",
          };
        })
      );
      setUnResolvedGrievance(
        UnresolvedComplaints?.map((obj, index) => {
          return {
            ...obj,
            srNo: index + 1,
            complaintSubType:
              obj.complaintSubType != null ? obj.complaintSubType : "-",
          };
        })
      );
      setUnVerified(UnresolvedComplaints);
      setVerifiedD(resolvedComplaints);
    }
  }, [props]);
  // ............................................API CALSS................................
  const [transData, setTransData] = useState([]);
  const [resolvedGrievance, setResolvedGrievance] = useState([]);
  const [unResolvedGrievance, setUnResolvedGrievance] = useState([]);
  const [unVerified, setUnVerified] = useState([]);
  const [VerifiedD, setVerifiedD] = useState([]);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [isModalOpenForUnResolved, setIsModalOpenForUnResolved] =
    useState(false);
  const [myGrievances, setMyGrievances] = useState(false);
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.labels.language);
  const router1 = useRouter();
  const user = useSelector((state) => {
    return state?.user?.user?.userDao?.id;
  });


  const handleCancel = () => {
    setIsModalOpenForResolved(false);
    setIsModalOpenForUnResolved(false);
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 50,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      minWidth: 250,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
      minWidth: 161,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "deptName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "complaintType",
      headerName: <FormattedLabel id="complaintType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "complaintStatusText",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: 130,
      maxWidth: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ? (
              <div style={{ color: "orange" }}>
                {params?.row?.complaintStatusText}
              </div>
            ) : (
              <div style={{ color: "green" }}>
                {params?.row?.complaintStatusText}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 200,
      maxWidth: 250,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 20,
              paddingLeft: 50,
            }}
          >
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                  query: { id: params?.row?.applicationNo },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID : ${params?.row?.applicationNo}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.applicationNo} : या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>

            {params?.row?.complaintStatusText === "Open" && (
              <IconButton
                onClick={() => {
                  router1.push({
                    pathname:
                      "/grievanceMonitoring/transactions/forwardComplaint",
                    query: { id: params?.row?.applicationNo },
                  });
                }}
              >
                {language === "en" ? (
                  <Tooltip
                    title={`FORWARD GRIEVANCE AGAINST THIS ID : ${params?.row?.applicationNo}`}
                  >
                    <ArrowForwardIosIcon style={{ color: "green" }} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={`${params?.row?.applicationNo} : या आयडी विरुद्ध तक्रार पाठवा `}
                  >
                    <ArrowForwardIosIcon style={{ color: "green" }} />
                  </Tooltip>
                )}
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {loading && <CommonLoader />}
      <>
        <BreadcrumbComponent />
        <Box>
          <Box
            sx={{
              display: "flex",
              padding: "30px",
              flexDirection: "column",
            }}
          >
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
                  nameMr: "प्रलंबित तक्रारी ",
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
                                    setSelectedCard(true);
                                    setIsModalOpenForResolved(true);
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
                                    setSelectedCard(true);
                                    setIsModalOpenForResolved(true);
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
                                    setSelectedCard(true);
                                    setIsModalOpenForUnResolved(true);
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
                                    setSelectedCard(true);
                                    setIsModalOpenForUnResolved(true);
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

        <Box
          component={Paper}
          style={{
            width: "100%",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "99%",
                height: "auto",
                overflow: "auto",
                padding: "0.4%",
                color: "black",
                fontSize: 18,
                fontWeight: 500,
                borderRadius: 100,
              }}
            >
              <strong>
                <FormattedLabel id="myGrievance" />
              </strong>
            </Box>
          </Box>

          <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {myGrievances === false && (
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AccountCircleIcon />}
                  type="primary"
                  onClick={() => setMyGrievances(!myGrievances)}
                  size="small"
                >
                  {myGrievances === false && (
                    <FormattedLabel id="myGrievance" />
                  )}
                </Button>
              </Grid>
            )}

            {myGrievances !== false && (
              <Grid
                item
                xs={3.5}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  endIcon={<AccountCircleIcon />}
                  type="primary"
                  onClick={() => setMyGrievances(!myGrievances)}
                  size="small"
                >
                  {<FormattedLabel id="grievancesBehalfOfMyDepartment" />}
                </Button>
              </Grid>
            )}

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
                {<FormattedLabel id="raiseGrievance" />}
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
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
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
            rows={transData || []}
            pageSize={10}
            rowsPerPageOptions={[10]}
            columns={columns}
            disableSelectionOnClick
          />
        </Box>
        <Modal
          title="Modal For Resolved Grievance"
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

            <DataGrid
              autoHeight
              sx={{
                overflowY: "scroll",
                backgroundColor: "white",
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
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
              density="compact"
              rows={resolvedGrievance || []}
              pageSize={5}
              rowsPerPageOptions={[5]}
              columns={columns}
              disableSelectionOnClick
            />

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

        {/* /////////////////////////////MODALS/////////////////////////////// */}
        <Modal
          title="Modal For UnResolved Grievance"
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

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
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
