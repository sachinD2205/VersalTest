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
import schema from "../../../containers/schema/common/reports/rtsAapleSarkarMahaonlineSchema";
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
      applicationNumber: 1,
      applicantName: "aa",
      subjectName: "ff",
      applicationDate: "12/04/2023",
      compDate: "12/04/2023",
      applicationStatus: "XYZ",
      pendingWith: "ABC",
      village: "PQR",
      prabhag: "QWE",
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
        setLoading(false);
        console.log("cfcs", r);
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
      formattedLabel: "applicationNumber",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicantName",
      headerAlign: "center",
      formattedLabel: "applicantName",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subjectName",
      headerAlign: "center",
      formattedLabel: "subject",
      width: 150,
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
      formattedLabel: "completionDate",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationStatus",
      headerAlign: "center",
      formattedLabel: "applicationStatus",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "pendingWith",
      headerAlign: "center",
      formattedLabel: "pendingWith",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "village",
      headerAlign: "center",
      formattedLabel: "village",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "prabhag",
      headerAlign: "center",
      formattedLabel: "prabhag",
      width: 100,
      align: "center",
    },
  ];

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      flex: 0.5,
    },
    {
      field: "serviceName",
      headerName: language == "en" ? "Service Name" : "सेवेचे नाव",
      flex: 1,
    },
    {
      field: "onlineApplicationsCount",
      headerName:
        language == "en"
          ? "Online Applications Count"
          : "ऑनलाइन अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.onlineApplicationsCount}
            </Link>
          </>
        );
      },
    },
    {
      field: "offlineApplicationCount",
      headerName:
        language == "en"
          ? "Offline Application Count"
          : "ऑफलाइन अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.offlineApplicationCount}
            </Link>
          </>
        );
      },
    },
    {
      field: "totalApplicationCount",
      headerName:
        language == "en" ? "Total Application Count" : "एकूण अर्ज संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.totalApplicationCount}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfServiceProvideApplicationsWithInTimePeriod",
      headerName:
        language == "en"
          ? "Count Of Service Provide Applications With In Time Period"
          : "सेवांची संख्या वेळेत अर्ज प्रदान करा",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfServiceProvideApplicationsWithInTimePeriod}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfApplicationsOverDue",
      headerName:
        language == "en"
          ? "Count of Applications OverDue"
          : "थकीत अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfApplicationsOverDue}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfRejectedApplicationsWithShowCauseNotice",
      headerName:
        language == "en"
          ? "Count Of Rejected Applications With Show Cause Notice"
          : "कारणे दाखवा नोटीससह नाकारलेल्या अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfRejectedApplicationsWithShowCauseNotice}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfRejectedApplicationsWithoutNotice",
      headerName:
        language == "en"
          ? "Count of Rejected Applications Without Notice"
          : "सूचनेशिवाय नाकारलेल्या अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfRejectedApplicationsWithoutNotice}
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
            serviceName: "AAA",
            onlineApplicationsCount: 10,
            offlineApplicationCount: 3,
            totalApplicationCount: 15,
            countOfServiceProvideApplicationsWithInTimePeriod: 0,
            countOfApplicationsOverDue: 0,
            countOfRejectedApplicationsWithShowCauseNotice: 1,
            countOfRejectedApplicationsWithoutNotice: 12,
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
        <title>RTS Aaple Sarkar Mahaonline</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="rtsAapleSarkarMahaonline" />
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
                      en: "RTS Aaple Sarkar Mahaonline",
                      mr: "आरटीएस आपल सरकार महाऑनलाइन",
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
