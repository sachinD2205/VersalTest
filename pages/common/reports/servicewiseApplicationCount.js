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
import schema from "../../../containers/schema/common/reports/servicewiseApplicationCountSchema";
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
  const [departments, setDepartments] = useState([]);
  const [loading, setloading] = useState(false);
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
    getDepartment();
  }, []);

  const getCfcs = () => {
    setloading(true);
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setloading(false);
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

  const getDepartment = () => {
    setloading(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)
      .then((res) => {
        setloading(false);
        setDepartments(
          res.data.application.map((r, i) => ({
            id: r.id,
            department: r.applicationNameEng,
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
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subjectName",
      headerAlign: "center",
      formattedLabel: "subject",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationDate",
      headerAlign: "center",
      formattedLabel: "applicationDate",
      width: 80,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "compDate",
      headerAlign: "center",
      formattedLabel: "completionDate",
      width: 80,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationStatus",
      headerAlign: "center",
      formattedLabel: "applicationStatus",
      width: 200,
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
      field: "applicationStatus",
      headerAlign: "center",
      formattedLabel: "applicationStatus",
      width: 200,
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
      field: "serviceId",
      headerName: language == "en" ? "Service Id" : "सेवा आयडी",
      flex: 1,
    },
    {
      field: "serviceName",
      headerName: language == "en" ? "Service Name" : "सेवेचे नाव",
      flex: 1,
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
              onClick={() => {
                console.log("first", params?.row?.serviceDetailsReportDaos);
                setShowTable(true);
                setFetchedData(
                  params?.row?.serviceDetailsReportDaos?.map((val, index) => {
                    return {
                      srNo: index + 1,
                      cfcNumber: 1,
                      applicationNumber: val?.applicationNo,
                      applicantName: val?.applicantName,
                      subjectName: val?.serviceName,
                      applicationDate: val?.applicationDate
                        ? moment(val?.applicationDate).format("DD/MM/YYYY")
                        : "-",
                      compDate: val?.applicationCompDate
                        ? moment(val?.applicationCompDate).format("DD/MM/YYYY")
                        : "-",
                      pendingWith: val?.pendingWith,
                      applicationStatus: val?.applicationStatus,
                    };
                  })
                );
              }}
            >
              {params.row.totalApplications}
            </Link>
          </>
        );
      },
    },
  ];

  const finalSubmit = (data) => {
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    setloading(true);
    let _cfc = cfcs?.map((val) => {
      return val.id;
    });
    let selectedcfcName =
      watch("selectedcfcName") == "All"
        ? _cfc?.toString()
        : watch("selectedcfcName");
    axios
      .get(
        `${
          urls.CFCURL
        }/trasaction/report/serviceWiseApplicationCount?dept=${watch(
          "departmentKey"
        )}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setloading(false);
        let _res = res?.data?.reportResponce;
        setTable(
          _res?.subjectWiseApplicationCount?.map((val, index) => {
            return {
              ...val,
              srNo: index + 1,
              serviceId: val?.service,
              serviceName: val?.serviceName,
              totalApplications: val?.totalApplications,
            };
          })
        );

        // setTable(
        //   res.data.department.length > 0
        //     ? res.data.department.map((j, i) => ({
        //         ...j,
        //         srNo: i + 1,
        //         departmentName: j.department,
        //       }))
        //     : []
        // );
        res.data.reportResponceList.length == 0 &&
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
        <title>Service Wise Application Count</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="serviceWiseApplicationCount" />
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
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="department" />
                      </InputLabel>
                      <Controller
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            label={<FormattedLabel id="department" />}
                          >
                            {departments?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.department}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.departmentKey
                          ? errors.departmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
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
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
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
                      en: "Service Wise Application Count",
                      mr: "सेवानिहाय अर्ज संख्या",
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
