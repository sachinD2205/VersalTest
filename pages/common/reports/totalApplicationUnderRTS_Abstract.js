import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/reports/listOfDepartment.module.css";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../containers/reuseableComponents/ReportLayout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { Print, Search } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../URLS/urls";
import urls from "../../../URLS/urls";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import schema from "../../../containers/schema/common/reports/totalApplicationUnderRTS_AbstractSchema";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([
    {
      srNo: 1,
      cfcNumber: 1,
      applicationNumber: 1,
      applicantName: "aa",
      subjectName: "ff",
      applicationDate: "12/04/2023",
      compDate: "12/04/2023",
      pendingWith: "ABC",
    },
  ]);
  const [cfcs, setCfcs] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const {
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch("departmentType") + " Report",
  });

  useEffect(() => {
    getCfcs();
  }, []);

  const getCfcs = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("cfcs", r);
        setLoading(false);
        setCfcs(
          r.data.cfcCenters.map((row) => ({
            ...row,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getTableData = () => {};

  const _columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      formattedLabel: "srNo",
      width: 50,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumber",
      headerAlign: "center",
      headerName: "Application Number",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicantName",
      headerAlign: "center",
      formattedLabel: "applicantName",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subjectName",
      headerAlign: "center",
      headerName: "Service Name",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationDate",
      headerAlign: "center",
      formattedLabel: "applicationDate",
      width: 100,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "compDate",
      headerAlign: "center",
      headerName: "Comp Date",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationStatus",
      headerAlign: "center",
      headerName: "Application Status",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "pendingWith",
      headerAlign: "center",
      headerName: "Pending With",
      width: 150,
      align: "center",
    },
  ];

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      flex: 0.2,
    },
    {
      field: "departmentName",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      flex: 0.5,
    },
    {
      field: "rtsOnlineApplication",
      headerName:
        language == "en" ? "RTS Online Application" : "आरटीएस ऑनलाइन अर्ज",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setShowTable(true);
              }}
            >
              {params.row.rtsOnlineApplication}
            </Link>
          </>
        );
      },
    },
    {
      field: "aapleSarkarApplications",
      headerName:
        language == "en"
          ? "Aaple Sarkar Applications"
          : "आपल सरकार ऍप्लिकेशन्स",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.aapleSarkarApplications}
            </Link>
          </>
        );
      },
    },
    {
      field: "counterAcceptedApplications",
      headerName:
        language == "en"
          ? "Counter Accepted Applications"
          : "काउंटर स्वीकृत अर्ज",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.counterAcceptedApplications}
            </Link>
          </>
        );
      },
    },
    {
      field: "totalApplications",
      headerName: language == "en" ? "Total Applications" : "एकूण अर्ज",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.totalApplications}
            </Link>
          </>
        );
      },
    },
    {
      field: "completed",
      headerName: language == "en" ? "Completed" : "पूर्ण झाले",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.completed}
            </Link>
          </>
        );
      },
    },
    {
      field: "rejected",
      headerName: language == "en" ? "Rejected" : "नाकारले",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.rejected}
            </Link>
          </>
        );
      },
    },
    {
      field: "pendingWithApplicant",
      headerName:
        language == "en" ? "Pending With Applicant" : "अर्जदाराकडे प्रलंबित",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.pendingWithApplicant}
            </Link>
          </>
        );
      },
    },
    {
      field: "total_completed_rejected_pendingWithApplicant",
      headerName:
        language == "en"
          ? "Total (Completed/Rejected/Pending With Applicant)"
          : "एकूण (पूर्ण/नाकारलेले/अर्जदाराकडे प्रलंबित)",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.total_completed_rejected_pendingWithApplicant}
            </Link>
          </>
        );
      },
    },
    {
      field: "totalPendingWithPcmc",
      headerName:
        language == "en"
          ? "Total Pending With PCMC"
          : "पीसीएमसी कडे एकूण प्रलंबित",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.totalPendingWithPcmc}
            </Link>
          </>
        );
      },
    },
    {
      field: "pendingWithinTimeLimitAtPcmc",
      headerName:
        language == "en"
          ? "Pending Within Time Limit At PCMC"
          : "पीसीएमसी कडे वेळेच्या मर्यादेत प्रलंबित",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.pendingWithinTimeLimitAtPcmc}
            </Link>
          </>
        );
      },
    },
    {
      field: "overduePendingAtDepartment",
      headerName:
        language == "en"
          ? "Overdue Pending At Department"
          : "विभागाकडे प्रलंबित आहे",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.overduePendingAtDepartment}
            </Link>
          </>
        );
      },
    },
    {
      field: "pendingWithinTimelimtAtCFC",
      headerName:
        language == "en"
          ? "Pending Within Time limt At CFC"
          : "सीएफसी वर वेळेच्या मर्यादेत प्रलंबित",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.pendingWithinTimelimtAtCFC}
            </Link>
          </>
        );
      },
    },
    {
      field: "overduePendingAtCFC",
      headerName:
        language == "en" ? "Overdue Pending At CFC" : "सीएफसी वर थकीत आहे",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              //   onClick={() => setShowTable(true)}
            >
              {params.row.overduePendingAtCFC}
            </Link>
          </>
        );
      },
    },
  ];

  const finalSubmit = (data) => {
    setLoading(true);
    let _cfc = cfcs?.map((val) => {
      return val.id;
    });
    let selectedcfcName =
      watch("selectedcfcName") == "All"
        ? _cfc?.toString()
        : watch("selectedcfcName");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("post", res);
        setLoading(false);
        setTable([
          {
            srNo: 1,
            departmentName: "ABC",
            rtsOnlineApplication: 0,
            aapleSarkarApplications: 3,
            counterAcceptedApplications: 15,
            totalApplications: 0,
            completed: 0,
            rejected: 1,
            pendingWithApplicant: 12,
            total_completed_rejected_pendingWithApplicant: 23,
            totalPendingWithPcmc: 21,
            pendingWithinTimeLimitAtPcmc: 3,
            overduePendingAtDepartment: 5,
            pendingWithinTimelimtAtCFC: 12,
            overduePendingAtCFC: 11,
          },
        ]);
        // setTable(
        //   res.data.department.length > 0
        //     ? res.data.department.map((j, i) => ({
        //         ...j,
        //         srNo: i + 1,
        //         departmentName: j.department,
        //       }))
        //     : []
        // );
        res.data.department.length == 0 &&
          sweetAlert("Info", "No records found", "info");
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  console.log("table", table);

  return (
    <>
      <Head>
        <title>Total Applications</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="totalApplicationsUnderRTS_AbstractCount" />
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      style={{ width: "90%" }}
                      error={errors?.fromDate}
                    >
                      <Controller
                        name="fromDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  error={errors?.fromDate}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? errors?.fromDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      style={{ width: "90%" }}
                      error={!!errors?.fromDate}
                    >
                      <Controller
                        name="toDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors?.toDate}
                                  InputLabelProps={{
                                    style: {
                                      fontSize: 12,
                                      marginTop: 3,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? errors?.toDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <div
                  className={styles.centerDiv}
                  style={{ gap: 20, marginTop: 20 }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Search />}
                    size="small"
                  >
                    <FormattedLabel id="search" />
                  </Button>
                  <Button
                    disabled={table.length == 0}
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                    size="small"
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </div>
              </form>
              <Box sx={{ padding: "10px" }}>
                {table.length > 0 && (
                  <div className={styles.centerDiv}>
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.srNo}
                      components={{ Toolbar: GridToolbar }}
                      autoHeight={true}
                      density="compact"
                      sx={{
                        "& .super-app-theme--cell": {
                          backgroundColor: "#E3EAEA",
                          borderLeft: "10px solid white",
                          borderRight: "10px solid white",
                          borderTop: "4px solid white",
                        },
                        backgroundColor: "white",
                        boxShadow: 2,
                        border: 1,
                        borderColor: "primary.light",
                        "& .MuiDataGrid-cell:hover": {},
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#E3EAEA",
                        },
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },

                        "& .MuiDataGrid-column": {
                          backgroundColor: "red",
                        },
                      }}
                      rows={table}
                      columns={columns}
                      disableColumnMenu
                      disableColumnSort
                    />
                  </div>
                )}
              </Box>
              {showTable && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ReportLayout
                    centerHeader
                    showDates={watch("fromDate") && watch("toDate")}
                    date={{
                      from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                      to: moment(watch("toDate")).format("DD-MM-YYYY"),
                    }}
                    style={{
                      marginTop: "5vh",
                      boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.75)",
                    }}
                    componentRef={componentRef}
                    rows={fetchedData}
                    customReportName={{
                      en: "Total Applications under RTS (Abstract Count)",
                      mr: "आरटीएस अंतर्गत एकूण अर्ज (अमूर्त संख्या)",
                    }}
                    columns={_columns}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
