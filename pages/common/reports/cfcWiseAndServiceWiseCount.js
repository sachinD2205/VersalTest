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
import schema from "../../../containers/schema/common/reports/cfcWiseAndServiceWiseCountSchema";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch("departmentType") + " Report",
  });

  useEffect(() => {
    getService();
  }, []);

  const getService = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log("serviceservice", r);
        setServices(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
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
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "cfcCenterName",
      headerAlign: "center",
      formattedLabel: "cfcCenterName",
      //   headerName: "CFC Number",
      width: 410,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "totalCount",
      headerAlign: "center",
      formattedLabel: "totalCount",
      width: 310,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    setLoading(true);
    axios
      .get(
        `${
          urls.CFCURL
        }/trasaction/report/serviceWiseCfcApplicationCount?serviceId=${watch(
          "selectedServiceName"
        )}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("post", res);

        if (res.status == 200) {
          let data = res?.data?.reportResponceList;
          setTable(
            data?.map((val, index) => {
              return {
                srNo: index + 1,
                cfcCenterName: val?.cfcCenterName,
                totalCount: val?.totalApplications,
              };
            })
          );
        }

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
        <title>CFC Wise And Service Wise Count</title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="cfcWiseAndServiceWiseCount" />
        </div>
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
                    variant="outlined"
                    error={!!errors.departmentType}
                    size="small"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      <FormattedLabel id="serviceName" />
                    </InputLabel>
                    {/* @ts-ignore */}
                    {/* <Controller
                render={({ field }) => ( */}
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Servive Name"
                      {...register("selectedServiceName")}
                      onChange={(e) => {
                        setValue("selectedServiceName", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                      value={watch("selectedServiceName")}
                    >
                      {/* <MenuItem value="All" key="none">
                    All
                  </MenuItem> */}
                      {services &&
                        services.map((department, index) => (
                          <MenuItem key={index} value={department.id}>
                            {department.serviceName}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                      {errors?.selectedServiceName
                        ? errors.selectedServiceName.message
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
                  en: "CFC Wise And Service Wise Count",
                  mr: "सीएफसी वाइज आणि सर्व्हिस वाईज काउंट",
                }}
                columns={_columns}
              />
            </Box>
          </>
        )}
      </Paper>
    </>
  );
};

export default Index;
