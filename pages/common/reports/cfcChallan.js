import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/reports/listOfDepartment.module.css";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Grid,
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
import schema from "../../../containers/schema/common/reports/cfcChallanSchema";
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
    getDepartments();
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

  const getDepartments = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("post", res);
        setLoading(false);
        setDepartments(
          res.data.department.length > 0
            ? res.data.department.map((j, i) => ({
                ...j,
                srNo: i + 1,
                departmentName: j.department,
              }))
            : []
        );
        res.data.department.length == 0 &&
          sweetAlert("Info", "No records found", "info");
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
      field: "cfcCenterId",
      headerAlign: "center",
      formattedLabel: "cfcCenterId",
      // headerName: "CFC Center ID",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "cfcCenterName",
      headerAlign: "center",
      formattedLabel: "cfcCenterName",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "departmentName",
      headerAlign: "center",
      formattedLabel: "department",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "serviceId",
      headerAlign: "center",
      formattedLabel: "serviceId",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "serviceName",
      headerAlign: "center",
      formattedLabel: "service",
      width: 100,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "totalApplications",
      headerAlign: "center",
      formattedLabel: "totalApplications",
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
    axios
      .get(
        `${urls.CFCURL}/trasaction/report/getDailyChallanReports?cfcId=${selectedcfcName}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("post", res);
        setLoading(false);
        let data = res?.data?.reportResponce;
        console.log("data", data);
        setTable([
          {
            srNo: 1,
            cfcCenterId: 10,
            cfcCenterName: 0,
            departmentName: "SSS",
            serviceId: 15,
            serviceName: "EFCDSX",
            totalApplications: 0,
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
        data?.length == 0 && sweetAlert("Info", "No records found", "info");
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
        <title>CFC Challans</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>

      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="cfcChallans" />
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
                    sx={{ display: "flex", justifyContent: "center" }}
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={3}
                  >
                    <FormControl
                      variant="outlined"
                      error={!!errors.departmentType}
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="department" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="department" />}
                          >
                            {departments?.map((department, index) => (
                              <MenuItem key={index} value={department.id}>
                                {department.departmentName}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="departmentType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.departmentType
                          ? errors.departmentType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    sx={{ display: "flex", justifyContent: "center" }}
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={3}
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
                    sx={{ display: "flex", justifyContent: "center" }}
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={3}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors?.fromDate}>
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
                    sx={{ display: "flex", justifyContent: "center" }}
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={3}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
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
                <div className={styles.row}></div>
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
                  rows={table}
                  customReportName={{
                    en: "CFC Challans",
                    mr: "CFC चालान",
                  }}
                  columns={_columns}
                />
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
