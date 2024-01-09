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
import schema from "../../../containers/schema/common/reports/departmentWiseApplicationSchema";
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
  const [fetchedData, setFetchedData] = useState([]);
  const [cfcs, setCfcs] = useState([]);
  const [departments, setDepartments] = useState([]);
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

  const getDepartment = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)
      .then((res) => {
        setLoading(false);
        console.log("res", res);
        setDepartments(
          res.data.application.map((r, i) => ({
            id: r.id,
            applicationNameEng: r.applicationNameEng,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      flex: 0.5,
    },
    {
      field: "departmentId",
      headerName: language == "en" ? "Department Id" : "विभाग आयडी",
      flex: 1,
    },
    {
      field: "departmentName",
      headerName: language == "en" ? "department Name" : "विभाग नाव",
      flex: 1,
    },
    {
      field: "totalApplication",
      headerName: language == "en" ? "Total Application" : "एकूण अर्ज",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                console.log("paras", params.row);
                setShowTable(true);
                setFetchedData(
                  params?.row?.subjectWiseApplicationCount?.map(
                    (val, index) => {
                      return {
                        srNo: index + 1,
                        cfcCenterId: val?.cfcId,
                        cfcCenterName: val?.cfcName,
                        workArea: "-",
                        applicationNumber: val?.applicationNo,
                        departmentName: val?.deptName,
                        subject: val?.serviceName,
                        outwardDate: "-",
                      };
                    }
                  )
                );
              }}
            >
              {params.row.totalApplication}
            </Link>
          </>
        );
      },
    },
  ];

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
      field: "cfcCenterId",
      headerAlign: "center",
      formattedLabel: "cfcCenterId",
      width: 50,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "cfcCenterName",
      headerAlign: "center",
      formattedLabel: "cfcCenterName",
      width: 250,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "workArea",
      headerAlign: "center",
      formattedLabel: "workArea",
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
      field: "departmentName",
      headerAlign: "center",
      formattedLabel: "departmentName",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subject",
      headerAlign: "center",
      formattedLabel: "subject",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "outwardDate",
      headerAlign: "center",
      formattedLabel: "outwardDate",
      width: 150,
      align: "center",
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
    let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
    let toDate = moment(watch("toDate")).format("YYYY-MM-DD");
    axios
      .get(
        `${
          urls.CFCURL
        }/trasaction/report/departmentWiseApplicationCount?deptId=${watch(
          "departmentKey"
        )}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("post", res);
        setFetchedData([]);
        setLoading(false);
        if (res.status == 200) {
          setTable([
            {
              ...res?.data?.reportResponce,
              srNo: 1,
              departmentId: watch("departmentKey"),
              departmentName: departments?.find(
                (obj) => obj.id == watch("departmentKey")
              )?.applicationNameEng,
              totalApplication: res?.data?.reportResponce?.totalApplications,
              // totalApplication: res?.data?.reportResponceList?.reduce(
              //   (accumulator, currentObject) =>
              //     accumulator + currentObject.totalApplications,
              //   0
              // ),
            },
          ]);
        }
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
        <title>CFC Wise Pending Application</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="departmentWiseApplicationCount" />
        </div>
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
                                {item.applicationNameEng}
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
                              field.onChange(moment(date).format("YYYY-MM-DD"))
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
                              field.onChange(moment(date).format("YYYY-MM-DD"))
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
                  {/* Search */}
                </Button>
                <Button
                  disabled={table.length == 0}
                  variant="contained"
                  onClick={handleToPrint}
                  endIcon={<Print />}
                  size="small"
                >
                  <FormattedLabel id="print" />
                  {/* Print */}
                </Button>
              </div>
            </form>
            <Box sx={{ padding: "10px" }}>
              {table.length > 0 && (
                <div className={styles.centerDiv}>
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        hideDensitySelector: true,
                        showQuickFilter: false,
                        hideRowCount: true,
                        hideShowColumnsButton: true,
                        hideSettings: true,
                        hideFilterIcon: true,
                        hideColumnSelector: true,
                        hideExportButton: true,
                      },
                    }}
                    getRowId={(row) => row.srNo}
                    autoHeight={true}
                    density="compact"
                    pagination={false}
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
                      "& .MuiDataGrid-toolbarContainer": {
                        display: "none",
                      },
                    }}
                    rows={table}
                    columns={columns}
                  />
                </div>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              {showTable && (
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
                    en: "CFC Wise Application Count",
                    mr: "सीएफसी नुसार अर्ज संख्या",
                  }}
                  columns={_columns}
                />
              )}
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default Index;
