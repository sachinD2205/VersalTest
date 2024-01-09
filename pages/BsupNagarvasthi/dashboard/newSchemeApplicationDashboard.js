import {
  Link,
  Grid,
  Tooltip,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import * as MuiIcons from "@mui/icons-material";
import styles from "../dashboard/dashboard.module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const NewSchemeApplicationDashboard = () => {
  const { control, setValue } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const [mainsubSchemeData, setMainSubSchemeData] = useState([]);
  const [mainSchemeData, setMainSchemeData] = useState([]);
  const [mainSchemeFromDate, setMainSchemeFromDate] = useState(null);
  const [mainSchemeToDate, setMainSchemeToDate] = useState(null);
  const [subSchemeFromDate, setSubSchemeFromDate] = useState(null);
  const [subSchemeToDate, setSubSchemeToDate] = useState(null);
  const [mainSubSchemeFromDate, setMainSubSchemeFromDate] = useState(null);
  const [mainSubSchemeToDate, setMainSubSchemeToDate] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [todayTotalCount, setTodayTotalCount] = useState(0);
  const [todayPendingCount, setTodayPendingCount] = useState(0);
  const [todayCompletedCount, setTodayCompletedCount] = useState(0);
  const [yearWiseArray, setYearwiseArray] = useState([]);

  //for bar chart
  const [totalApplications, setTotalApplications] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
  const [benefitedApplications, setBenefitedApplications] = useState(0);

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

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const user1 = useSelector((state) => {
    let userNamed =
      state?.user?.user?.userDao && language === "en"
        ? state?.user?.user?.userDao.firstNameEn
        : state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameMr;
    return userNamed;
  });

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  useEffect(() => {
    getMainSchemeDetails();
  }, [mainSchemeFromDate && mainSchemeToDate]);

  useEffect(() => {
    getSubSchemeDetails();
  }, [subSchemeFromDate && subSchemeToDate]);

  useEffect(() => {
    getMainAndSubSchemeDetails();
  }, [mainSubSchemeFromDate && mainSubSchemeToDate]);

  useEffect(() => {
    getApplicationSchemeCount();
    const currentYear = new Date().getFullYear();
    const array = [];
    if (new Date().getMonth() + 1 >= 4) {
      array.push(currentYear + 1);
      for (var i = 0; i < 5; i++) {
        array.push(currentYear - i);
      }
    } else {
      for (var i = 0; i <= 5; i++) {
        array.push(currentYear - i);
      }
    }

    let res = array?.map((r, i, array) => {
      if (array[i + 1] != undefined) {
        return {
          id: i + 1,
          value: array[i + 1] + "-" + r,
        };
      }
    });

    var filtered = res.filter(function (x) {
      return x !== undefined;
    });

    setYearwiseArray([...filtered]);
    setMainSchemeFromDate(
      filtered[0].value.split("-")[0] + "-04-01" + " 00:00:00"
    );
    setMainSchemeToDate(
      filtered[0].value.split("-")[1] + "-03-31" + " 23:59:59"
    );
    setValue("mainSchemeYearKey", 1);

    setSubSchemeFromDate(
      filtered[0].value.split("-")[0] + "-04-01" + " 00:00:00"
    );
    setSubSchemeToDate(
      filtered[0].value.split("-")[1] + "-03-31" + " 23:59:59"
    );
    setValue("subSchemeYearKey", 1);

    setMainSubSchemeFromDate(
      filtered[0].value.split("-")[0] + "-04-01" + " 00:00:00"
    );
    setMainSubSchemeToDate(
      filtered[0].value.split("-")[1] + "-03-31" + " 23:59:59"
    );
    setValue("mainsubSchemeYearKey", 1);
  }, []);

  // get scheme application count
  const getApplicationSchemeCount = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getNewSchemeApplicationCounts`, {
        headers: headers,
      })
      .then((r) => {
        setTotalCount(r.data.totalApplicationsCount);
        setPendingCount(r.data.pendingApplicationsCount);
        setCompletedCount(r.data.completedApplicationsCount);
        setTodayTotalCount(r.data.todaysTotalApplicationsCount);
        setTodayPendingCount(r.data.todaysPendingApplicationsCount);
        setTodayCompletedCount(r.data.todaysCompletedApplicationsCount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get sub scheme details
  const getSubSchemeDetails = () => {
    if (subSchemeFromDate && subSchemeToDate) {
      const body = {
        strFromDate: subSchemeFromDate,
        strToDate: subSchemeToDate,
      };
      axios
        .post(`${urls.BSUPURL}/dashboard/getAllSubSchemeWiseSummary`, body, {
          headers: headers,
        })
        .then((r) => {
          const result = r.data;
          let _res = result?.map((r, i) => {
            setTotalApplications(r.totalApplications);
            setApprovedApplications(r.approvedApplications);
            setRejectedApplications(r.benefitRejectedApplications);
            setBenefitedApplications(r.benefitedApplications);

            return {
              id: i,
              srNo: i + 1,
              mainSchemeName: r.mainSchemeName,
              subSchemeName: r.subSchemeName,
              zoneOfficeName: r.zoneOfficeName,
              mainSchemeNameMr: r.mainSchemeNameMr,
              subSchemeNameMr: r.subSchemeNameMr,
              zoneOfficeNameMr: r.zoneOfficeNameMr,
              totalApplications: r.totalApplications,
              approvedApplications: r.approvedApplications,
              rejectedApplications: r.rejectedApplications,
              benefitedApplications: r.benefitedApplications,
              benefitRejectedApplications: r.benefitRejectedApplications,
            };
          });
          setDataSource([..._res]);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get main and sub scheme details
  const getMainAndSubSchemeDetails = () => {
    if (mainSubSchemeToDate && mainSubSchemeFromDate) {
      const body = {
        strFromDate: mainSubSchemeFromDate,
        strToDate: mainSubSchemeToDate,
      };
      axios
        .post(
          `${urls.BSUPURL}/dashboard/getAllZoneMainSchemeAndSubSchemeWiseSummary`,
          body,
          { headers: headers }
        )
        .then((r) => {
          const result = r.data;
          let _res = result?.map((r, i) => {
            return {
              srNo: i + 1,
              id: i,
              mainSchemeName: r.mainSchemeName,
              subSchemeName: r.subSchemeName,
              zoneOfficeName: r.zoneOfficeName,
              mainSchemeNameMr: r.mainSchemeNameMr,
              subSchemeNameMr: r.subSchemeNameMr,
              zoneOfficeNameMr: r.zoneOfficeNameMr,
              totalApplications: r.totalApplications,
              approvedApplications: r.approvedApplications,
              rejectedApplications: r.approvedApplications,
              benefitedApplications: r.benefitedApplications,
              benefitRejectedApplications: r.benefitRejectedApplications,
            };
          });
          setMainSubSchemeData([..._res]);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get main scheme year wise
  const callMainSchemeList = (e, index) => {
    if (index === 1) {
      setMainSchemeFromDate(
        yearWiseArray[e - 1].value.split("-")[0] + "-04-01" + " 00:00:00"
      );
      setMainSchemeToDate(
        yearWiseArray[e - 1].value.split("-")[1] + "-03-31" + " 23:59:59"
      );
    } else if (index == 2) {
      setSubSchemeFromDate(
        yearWiseArray[e - 1].value.split("-")[0] + "-04-01" + " 00:00:00"
      );
      setSubSchemeToDate(
        yearWiseArray[e - 1].value.split("-")[1] + "-03-31" + " 23:59:59"
      );
    } else {
      setMainSubSchemeFromDate(
        yearWiseArray[e - 1].value.split("-")[0] + "-04-01" + " 00:00:00"
      );
      setMainSubSchemeToDate(
        yearWiseArray[e - 1].value.split("-")[1] + "-03-31" + " 23:59:59"
      );
    }
  };

  // main scheme details
  const getMainSchemeDetails = () => {
    if (mainSchemeFromDate && mainSchemeToDate) {
      const body = {
        strFromDate: mainSchemeFromDate,
        strToDate: mainSchemeToDate,
      };
      axios
        .post(`${urls.BSUPURL}/dashboard/getAllMainSchemeWiseSummary`, body, {
          headers: headers,
        })
        .then((r) => {
          const result = r.data;
          let _res = result?.map((r, i) => {
            return {
              srNo: i + 1,
              id: i,
              mainSchemeName: r.mainSchemeName,
              subSchemeName: r.subSchemeName,
              zoneOfficeName: r.zoneOfficeName,
              mainSchemeNameMr: r.mainSchemeNameMr,
              subSchemeNameMr: r.subSchemeNameMr,
              zoneOfficeNameMr: r.zoneOfficeNameMr,
              totalApplications: r.totalApplications,
              approvedApplications: r.approvedApplications,
              rejectedApplications: r.approvedApplications,
              benefitedApplications: r.benefitedApplications,
              benefitRejectedApplications: r.benefitRejectedApplications,
            };
          });
          setMainSchemeData([..._res]);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // datatable columns
  const subSchemeColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "subSchemeName" : "subSchemeNameMr",
      headerName: <FormattedLabel id="subScheme" />,
      flex: 1,
      minWidth: 400,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "totalApplications",
      headerName: <FormattedLabel id="totalApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "approvedApplications",
      headerName: <FormattedLabel id="approvedApplications" />,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectedApplications",
      headerName: <FormattedLabel id="rejectedApplications" />,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitedApplications",
      headerName: <FormattedLabel id="benefiteApplications" />,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitRejectedApplications",
      headerName: <FormattedLabel id="benefiteRejectedApplications" />,
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      align: "left",
    },
  ];

  // main scheme datatable columns
  const mainSchemeColums = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "zoneOfficeName" : "zoneOfficeNameMr",
      flex: 1,
      minWidth: 150,
      headerName: <FormattedLabel id="zoneOffice" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "mainSchemeName" : "mainSchemeNameMr",
      headerName: <FormattedLabel id="mainScheme" />,
      flex: 1,
      minWidth: 400,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "totalApplications",
      headerName: <FormattedLabel id="totalApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "approvedApplications",
      headerName: <FormattedLabel id="approvedApplications" />,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectedApplications",
      headerName: <FormattedLabel id="rejectedApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitedApplications",
      headerName: <FormattedLabel id="benefiteApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitRejectedApplications",
      headerName: <FormattedLabel id="benefiteRejectedApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
  ];

  // main and sub scheme columns
  const mainSchemeAndsubSchemeColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "zoneOfficeName" : "zoneOfficeNameMr",
      headerName: <FormattedLabel id="zoneOffice" />,
      headerAlign: "center",
      flex: 1,
      minWidth: 200,
      align: "left",
    },
    {
      field: language == "en" ? "mainSchemeName" : "mainSchemeNameMr",
      headerName: <FormattedLabel id="mainScheme" />,
      flex: 1,
      minWidth: 400,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "subSchemeName" : "subSchemeNameMr",
      headerName: <FormattedLabel id="subScheme" />,
      flex: 1,
      minWidth: 400,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "totalApplications",
      headerName: <FormattedLabel id="totalApplications" />,
      flex: 1,
      minWidth: 280,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "approvedApplications",
      headerName: <FormattedLabel id="approvedApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectedApplications",
      headerName: <FormattedLabel id="rejectedApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitedApplications",
      headerName: <FormattedLabel id="benefiteApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benefitRejectedApplications",
      headerName: <FormattedLabel id="benefiteRejectedApplications" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
  ];

  // ui
  return (
    <>
      {/* <Paper
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
      > */}
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
          {/* .......................CARDS............................ */}
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            {[
              {
                id: 1,
                icon: "Menu",
                count: todayTotalCount,
                name: <FormattedLabel id="totalTodaysCount" />,
                bg: "#7F00FF",
              },
              {
                id: 2,
                icon: "Menu",
                count: todayPendingCount,
                name: <FormattedLabel id="totalPendingCount" />,
                bg: "#00FF00",
              },
              {
                id: 3,
                icon: "Menu",
                count: todayCompletedCount,
                name: <FormattedLabel id="totalCompletedCount" />,
                bg: "#dc143c",
              },
              {
                id: 4,
                icon: "Menu",
                count: totalCount,
                name: <FormattedLabel id="newSchemeApplicationCount" />,
                bg: "#FFC0CB",
              },
              {
                id: 5,
                icon: "Menu",
                count: pendingCount,
                name: <FormattedLabel id="pendingCount" />,
                bg: "red",
              },
              {
                id: 6,
                icon: "Menu",
                count: completedCount,
                name: <FormattedLabel id="completedCount" />,
                bg: "#FFA500",
              },
            ]?.map((val, id) => {
              return (
                <Tooltip title={val.name}>
                  <Grid
                    key={id}
                    item
                    xs={4}
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
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
                        )}
                        {val.id === 2 && (
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
                        )}

                        {val.id === 3 && (
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
                        )}
                        {val.id === 4 && (
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
                        )}
                        {val.id === 5 && (
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
                        )}
                        {val.id === 6 && (
                          <h3
                            style={{ fontWeight: "600" }}
                            // onClick={() => {}}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </h3>
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

      {/* Charts Section */}
      <Box
        sx={{
          display: "flex",
          padding: "30px",
          flexDirection: ["column", "row"],
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <Chart
          options={{
            chart: {
              id: "basic-pie-1", // Use a unique id for each chart
            },
            labels: ["Pending Applications", "Completed Applications"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          }}
          series={[pendingCount, completedCount]}
          type="pie"
          // width={400}
          // height={300}
          width={600}
          height={500}
        />

        <Chart
          options={{
            chart: {
              id: "basic-bar-1", // Use a unique id for the bar chart
            },
            xaxis: {
              categories: [
                "Total Applications",
                "Pending Applications",
                "Completed Applications",
                "new column",
              ],
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 300, // Adjust the width for better responsiveness
                  },
                },
              },
            ],
          }}
          series={[
            {
              name: "Applications",
              data: [
                totalApplications,
                approvedApplications,
                rejectedApplications,
                benefitedApplications,
              ],
            },
          ]}
          type="bar"
          // width={400}
          // height={300}
          width={600}
          height={500}
        />
      </Box>

      <Box
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
          <FormattedLabel id="mainSchemeSummary" />
        </h2>
      </Box>

      <Grid item xs={4}>
        <FormControl sx={{ width: "280px", margin: "2%" }} variant="standard">
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="financialYear" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  callMainSchemeList(value.target.value, 1);
                }}
                label="mainSchemeYearKey"
              >
                {yearWiseArray &&
                  yearWiseArray.map((value, index) => (
                    <MenuItem key={index} value={value?.id}>
                      {value?.value}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="mainSchemeYearKey"
            control={control}
            defaultValue=""
          />
        </FormControl>
      </Grid>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
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
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            {
              display: "none",
            },
        }}
        density="standard"
        pagination
        rowCount={totalElements}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rows={mainSchemeData}
        columns={mainSchemeColums}
        onPageChange={(_data) => {}}
        onPageSizeChange={(_data) => {}}
      />
      <Box
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
          <FormattedLabel id="subSchemeSummary" />
        </h2>
      </Box>
      <Grid item xs={4}>
        <FormControl sx={{ width: "280px", margin: "2%" }} variant="standard">
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="financialYear" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  callMainSchemeList(value.target.value, 2);
                }}
                label="subSchemeYearKey"
              >
                {yearWiseArray &&
                  yearWiseArray.map((value, index) => (
                    <MenuItem key={index} value={value?.id}>
                      {value?.value}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="subSchemeYearKey"
            control={control}
            defaultValue=""
          />
        </FormControl>
      </Grid>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
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
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            {
              display: "none",
            },
        }}
        density="standard"
        pagination
        rowCount={totalElements}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rows={dataSource}
        columns={subSchemeColumns}
        onPageChange={(_data) => {}}
        onPageSizeChange={(_data) => {}}
      />
      <Box
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
          <FormattedLabel id="mainSubSchemeSummary" />
        </h2>
      </Box>
      <Grid item xs={4}>
        <FormControl sx={{ width: "280px", margin: "2%" }} variant="standard">
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="financialYear" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  callMainSchemeList(value.target.value, 3);
                }}
                label="mainsubSchemeYearKey"
              >
                {yearWiseArray &&
                  yearWiseArray.map((value, index) => (
                    <MenuItem key={index} value={value?.id}>
                      {value?.value}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="mainsubSchemeYearKey"
            control={control}
            defaultValue=""
          />
        </FormControl>
      </Grid>
      <DataGrid
        components={{ Toolbar: GridToolbar }}
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
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            {
              display: "none",
            },
        }}
        density="standard"
        pagination
        rowCount={totalElements}
        pageSize={5}
        rowsPerPageOptions={[5]}
        rows={mainsubSchemeData}
        columns={mainSchemeAndsubSchemeColumns}
        onPageChange={(_data) => {}}
        onPageSizeChange={(_data) => {}}
      />
      {/* </Paper> */}
    </>
  );
};

export default NewSchemeApplicationDashboard;
