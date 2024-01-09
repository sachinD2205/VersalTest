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
import schema from "../../../containers/schema/common/reports/totalApplicationsSchema";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [allData, setAllData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
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
      field: "cfcNumber",
      headerAlign: "center",
      formattedLabel: "cfcNumber",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumber",
      headerAlign: "center",
      formattedLabel: "applicationNumber",
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
      formattedLabel: "subject",
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
      formattedLabel: "completionDate",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "pendingWith",
      headerAlign: "center",
      formattedLabel: "pendingWith",
      width: 150,
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
      field: "CountOfReceivedApplicationsAt_CFC_Online",
      headerName:
        language == "en"
          ? "Count of received applications at CFC/Online"
          : "सीएफसी/ऑनलाइनवर प्राप्त झालेल्या अर्जांची संख्या",
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
              {params.row.CountOfReceivedApplicationsAt_CFC_Online}
            </Link>
          </>
        );
      },
    },
    {
      field: "CountOfPendingApplicationsAt_CFC_Online",
      headerName:
        language == "en"
          ? "Count of Pending applications at CFC/Online"
          : "सीएफसी/ऑनलाइन प्रलंबित अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.CountOfPendingApplicationsAt_CFC_Online}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfReceivedApplicationsAt_Ho_CFC",
      headerName:
        language == "en"
          ? "Count of received applications at HO-CFC"
          : "एचओ-सीएफसी वर प्राप्त झालेल्या अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfReceivedApplicationsAt_Ho_CFC}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfPendingApplicationsAtDepartment",
      headerName:
        language == "en"
          ? "Count of pending applications at the department"
          : "विभागातील प्रलंबित अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                getDataFromCount(allData?.pendingApplicationDetailsReports);
              }}
            >
              {params.row.countOfPendingApplicationsAtDepartment}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfPendingCertificatesAt_CFC_Online",
      headerName:
        language == "en"
          ? "Count of pending Certificates at the CFC/Online"
          : "सीएफसी/ऑनलाइन मध्ये प्रलंबित प्रमाणपत्रांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfPendingCertificatesAt_CFC_Online}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfIssueCertificatesBy_CFC_Online",
      headerName:
        language == "en"
          ? "Count of issue certificates by CFC/Online"
          : "सीएफसी/ऑनलाइनद्वारे जारी केलेल्या प्रमाणपत्रांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                getDataFromCount(allData?.complitedApplicationReportDaos);
              }}
            >
              {params.row.countOfIssueCertificatesBy_CFC_Online}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfApplicationsExceedTheStandardServicePeriod_CFC_Online",
      headerName:
        language == "en"
          ? "Count of applications exceed the standard service period (CFC/Online)"
          : "अर्जांची संख्या मानक सेवा कालावधीपेक्षा जास्त आहे (सीएफसी/ऑनलाइन)",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {
                params.row
                  .countOfApplicationsExceedTheStandardServicePeriod_CFC_Online
              }
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfRejectedApplications_CFC_Online",
      headerName:
        language == "en"
          ? "Count of Rejected Applications (CFC/Online)"
          : "नाकारलेल्या अर्जांची संख्या (सीएफसी/ऑनलाइन)",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.countOfRejectedApplications_CFC_Online}
            </Link>
          </>
        );
      },
    },
    {
      field: "countOfTotalApplications",
      headerName:
        language == "en"
          ? "Count of total Applications"
          : "एकूण अर्जांची संख्या",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                getDataFromCount(allData?.totalApplicationDetailsReports);
              }}
            >
              {params.row.countOfTotalApplications}
            </Link>
          </>
        );
      },
    },
  ];

  const getDataFromCount = (_data) => {
    setShowTable(true);
    setFetchedData(
      _data?.map((val, index) => {
        return {
          srNo: index + 1,
          cfcNumber: watch("selectedcfcName"),
          applicationNumber: val?.applicationNo ? val?.applicationNo : "-",
          applicantName: val?.applicantName ? val?.applicantName : "-",
          subjectName: val?.serviceId ? val?.serviceId : "-",
          applicationDate: val?.applicationDate
            ? moment(val?.applicationDate).format("DD/MM/YYYY")
            : "-",
          compDate: val?.appComplitedDate
            ? moment(val?.appComplitedDate).format("DD/MM/YYYY")
            : "-",
          pendingWith: val?.pendingWith ? val?.pendingWith : "-",
        };
      })
    );
  };

  const finalSubmit = (data) => {
    let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
    let toDate = moment(watch("toDate")).format("YYYY-MM-DD");
    setLoading(true);
    let _cfc = cfcs?.map((val) => {
      return val.id;
    });
    let selectedcfcName =
      watch("selectedcfcName") == "All"
        ? _cfc?.toString()
        : watch("selectedcfcName");
    axios
      .get(
        `${urls.CFCURL}/trasaction/report/getTotalApplication?cfcId=${selectedcfcName}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log(
          "post33",
          res?.data?.reportResponce,
          res?.data?.reportResponce?.totalApplications
        );

        setLoading(false);
        setAllData(res?.data?.reportResponce);
        setTable([
          {
            srNo: 1,
            CountOfReceivedApplicationsAt_CFC_Online: 0,
            CountOfPendingApplicationsAt_CFC_Online: 0,
            countOfReceivedApplicationsAt_Ho_CFC: 0,
            countOfPendingApplicationsAtDepartment:
              res?.data?.reportResponce?.pendingAtDepartment,
            countOfPendingCertificatesAt_CFC_Online: 0,
            countOfIssueCertificatesBy_CFC_Online:
              res?.data?.reportResponce?.complitedApplication,
            countOfApplicationsExceedTheStandardServicePeriod_CFC_Online: 0,
            countOfRejectedApplications_CFC_Online: 0,
            countOfTotalApplications:
              res?.data?.reportResponce?.totalApplications,
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
        res?.data?.reportResponce?.length == 0 &&
          sweetAlert("Info", "No records found", "info");
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

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
          <FormattedLabel id="totalApplications" />
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
                    xs={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      error={!!errors.departmentType}
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="cfcCenterName" />
                      </InputLabel>
                      {/* @ts-ignore */}
                      {/* <Controller
                render={({ field }) => ( */}
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label={<FormattedLabel id="cfcCenterName" />}
                        {...register("selectedcfcName")}
                        onChange={(e) => {
                          setValue("selectedcfcName", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        value={watch("selectedcfcName")}
                      >
                        <MenuItem value="All" key="none">
                          All
                        </MenuItem>
                        {cfcs &&
                          cfcs.map((department, index) => (
                            <MenuItem key={index} value={department.cfcId}>
                              {department.cfcName}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {errors?.selectedcfcName
                          ? errors.selectedcfcName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={4}
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
                    xs={4}
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
                      en: "Total Applications",
                      mr: "एकूण अर्ज",
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
