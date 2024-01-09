import {
  Grid,
  Link,
  IconButton,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import moment from "moment";
import styles from "../rtiApplicationDashboard/dashboard.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../containers/Layout/components/Loader";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const router1 = useRouter();
  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };
  const [dataSource, setDataSource] = useState([]);
  const [statusAll, setStatus] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [departments, setDepartments] = useState([]);
  let user = useSelector((state) => state.user.user);
  const [completeCount, setCompleteCount] = useState(0);
  const [hearingCount, setHearingCount] = useState(0);
  const [totalCount, setTotoalCount] = useState(0);
  const [statusId, setStatusId] = useState(0);
  const [appealDetails, setAppealAllDetails] = useState(null);
  const [inProgressCount, setInProgressCount] = useState(null);
  const language = useSelector((state) => state.labels.language);
  const user1 = useSelector((state) => {
    let userNamed =
      language === "en"
        ? state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameEn
        : state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameMr;
    return userNamed;
  });
  const [isLoading, setIsLoading] = useState(false);

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
    getDepartments();
    getAllStatus();
    getDashboardRtiCount();
  }, []);

  useEffect(() => {
    getApplicationListByDept();
  }, [departments]);

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDashboardRtiCount = () => {
    const data = {
      strFromDate: "2000-01-01 12:23:27.014",
      strToDate: "2080-12-31 12:23:27.014",
    };
    setIsLoading(true);
    axios
      .post(`${urls.RTI}/dashboard/getRtiCounts`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setIsLoading(false);
        for (var i = 0; i < r.data.length; i++) {
          if (r.data[i].trnType === "RAPL-Complete") {
            setCompleteCount(r.data[i].count);
          } else if (r.data[i].trnType === "RAPL-Inprogress") {
            setInProgressCount(r.data[i].count);
          } else if (r.data[i].trnType === "RAPL" && r.data[i].status === 7) {
            setHearingCount(r.data[i].count);
          } else if (r.data[i].trnType === "RAPL-Total") {
            setTotoalCount(r.data[i].count);
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.RTI}/trnRtiAppeal/getAllByDept`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setIsLoading(false);
        setAppealAllDetails(res.data);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDashboardCardWiseData = (status, _pageSize = 10, _pageNo = 0) => {
    if (status != 0) {
      setIsLoading(true);
      axios
        .post(
          `${urls.RTI}/trnRtiAppeal/getAllByStatus?status=${status}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          }
        )
        .then((res, j) => {
          setIsLoading(false);
          setAppealAllDetails(res.data);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      getApplicationListByDept(_pageSize, _pageNo);
    }
  };

  useEffect(() => {
    if (appealDetails != null) {
      getDatatable();
    }
  }, [appealDetails, language]);

  const getDatatable = () => {
    let data = appealDetails;
    let result = data.trnRtiAppealList;
    const _res = result.map((res, i) => {
      return {
        srNo: i + 1 + data.pageNo * data.pageSize,
        id: res.id,
        appealNo: res.appealNo,
        appealReason: res.appealReason,
        departmentName: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).department
          : "-",
        createdDate: res.createdDate,
        informationDescription: res.informationDescription,
        subject: res.subject,
        applicationNo: res.applicationNo,
        applicationDate:
          res.applicationDate === null
            ? "-"
            : moment(res.applicationDate).format("DD-MM-YYYY"),
        activeFlag: res.activeFlag,
        statusVal: res.status,
        status: manageStatus(res.status, language, statusAll),
      };
    });
    setDataSource([..._res]);
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="appealApplicationNo" />,
      flex: 1,
      minWidth: 350,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="appealFileDate" />,
      // flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "appealReason",
      headerName: <FormattedLabel id="reasonForAppeal" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.statusVal === 3 ? (
              <div style={{ color: "blue" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 6 ? (
              <div style={{ color: "blue" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 8 ||
              params?.row?.statusVal === 7 ||
              params?.row?.statusVal === 14 ||
              params?.row?.statusVal == 2 ? (
              <div style={{ color: "orange" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 11 ? (
              <div style={{ color: "green" }}>{params?.row?.status}</div>
            ) : (
              <div style={{ color: "black" }}>{params?.row?.status}</div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/RTIOnlineSystem/dashboard/rtiAppealDashboard/view",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </>
        );
      },
    },
  ];



  return (
    <>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              padding: "30px",

              flexDirection: "column",
            }}
          >
            {/* <Typography>
              <p className={styles.fancy_link}>
                <>
                  <FormattedLabel id="welcomeToTheDashboard" />{" "}
                  <strong>{user1}</strong>{" "}
                </>
              </p>
            </Typography> */}
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "RTI Appeal Dashboard"
                    : "माहिती अधिकार आवाहन डॅशबोर्ड"}
                </b>
              </h2>
            </Grid>

            {/* .......................CARDS............................ */}
            <Grid
              container
              style={{ display: "flex", justifyContent: "center" }}
            >
              {[
                {
                  id: 1,
                  icon: "Menu",
                  count: totalCount,
                  name: <FormattedLabel id="dashboardTotalAppealCount" />,
                  bg: "#FFC0CB",
                },
                {
                  id: 3,
                  icon: "Menu",
                  count: hearingCount,
                  name: <FormattedLabel id="dashboardHearingScheduled" />,
                  bg: "#FFA500",
                },
                ,
                {
                  id: 5,
                  icon: "Menu",
                  count: completeCount,
                  name: <FormattedLabel id="dashboardCompletedAppeal" />,
                  bg: "#00FF00",
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
                              color: "#556CD6",
                            }}
                          >
                            {val.count}
                          </Typography>
                          {val.id === 1 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(0);
                                setStatusId(0);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}
                          {val.id === 3 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(7);
                                setStatusId(8);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
                            </Link>
                          )}
                          {val.id === 5 && (
                            <Link
                              style={{ fontWeight: "600" }}
                              onClick={() => {
                                getDashboardCardWiseData(11);
                                setStatusId(11);
                              }}
                              tabIndex={0}
                              component="button"
                            >
                              {val.name}
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
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="rtiAppealList" />
          </h2>
        </Box> */}
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: {
                copyStyles: true,
                hideToolbar: true,
                hideFooter: true,
              },
            },
          }}
          autoHeight
          sx={{
            marginTop: "20px",
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={totalElements}
          pageSize={pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rows={dataSource}
          page={pageNo}
          columns={columns}
          onPageChange={(_data) => {
            getDashboardCardWiseData(statusId, pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getDashboardCardWiseData(statusId, _data, pageNo);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
