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
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    getDepartment();
    getServices();
  }, []);

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
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
        callCatchMethod(err, language);
      });
  };

  const getDepartment = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setLoading(false);
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

  const {
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(
      yup.object().shape({
        // departmentType: yup
        //   .string()
        //   .required("Please select a department")
        //   .typeError("Please select a department"),
        // petAnimalKey: yup
        //   .number()
        //   .required("Please select an animal")
        //   .typeError("Please select an animal"),
        fromDate: yup
          .date()
          .typeError(`Please select a from Date`)
          .required(`Please select a from Date`),
        toDate: yup
          .date()
          .typeError(`Please select a to Date`)
          .required(`Please select a to Date`),
      })
    ),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "New Document",
  });

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
      field: "applicationNo",
      headerAlign: "center",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "challanNo",
      headerAlign: "center",
      headerName: language === "en" ? "Challan Number" : "चलन क्रमांक",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "recieptNo",
      headerAlign: "center",
      headerName: language === "en" ? "Reciept Number" : "पावती क्रमांक",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "recieptDate",
      headerAlign: "center",
      headerName: language === "en" ? "Reciept Date" : "पावतीची तारीख",
      width: 100,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "name",
      headerAlign: "center",
      headerName: language === "en" ? "Name" : "नाव",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "mobileNo",
      headerAlign: "center",
      headerName: language === "en" ? "Mobile Number" : "मोबाईल क्रमांक",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subjectName",
      headerAlign: "center",
      headerName: language === "en" ? "Subject Name" : "विषयाचे नाव",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "departmentName",
      headerAlign: "center",
      headerName: language === "en" ? "Department Name" : "विभागाचे नाव",
      width: 110,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "village",
      headerAlign: "center",
      headerName: language === "en" ? "Village" : "गाव",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "collectionAmount",
      headerAlign: "center",
      headerName: language === "en" ? "Collection Amount" : "संकलन रक्कम",
      width: 100,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    setLoading(true);
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    axios
      .get(
        `${
          urls.CFCURL
        }/trasaction/report/applicationWisePaymentCollection?deptId=${watch(
          "departmentKey"
        )}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res, index) => {
        setLoading(false);
        console.log("post", res);
        if (res.status == 200) {
          let data = res?.data?.reportResponceList;
          setFetchedData(
            data?.map((val, index) => {
              return {
                srNo: index + 1,
                applicationNo: val?.applicationNo,
                challanNo: val?.challanNumber,
                recieptNo: val?.receiptNo,
                recieptDate: val?.receiptDate,
                name: val?.name,
                mobileNo: val?.mobileNo,
                subjectName: services?.find((obj) => obj.id == val?.service)
                  ?.serviceName,
                departmentName: departments?.find(
                  (obj) => obj.id == watch("departmentKey")
                )?.applicationNameEng,
                village: val?.payCity,
                collectionAmount: val?.collectionAmount,
              };
            })
          );

          if (data?.length > 0) {
            setShowTable(true);
          } else {
            sweetAlert("Info", "No records found", "info");
          }
        }
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
        <title>
          {" "}
          {language === "en"
            ? "Application Wise Collection"
            : "अर्जानुसार संकलन"}{" "}
        </title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language === "en"
            ? "Application Wise Collection"
            : "अर्जानुसार संकलन"}{" "}
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
                    {language === "en" ? "Search" : "शोधा"}
                  </Button>
                  <Button
                    disabled={!showTable}
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                    size="small"
                  >
                    {language === "en" ? "Print" : "छापा"}
                  </Button>
                </div>
              </form>

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
                      en: "Application Wise Collection",
                      mr: "अर्जानुसार संकलन",
                    }}
                    columns={_columns}
                    extraRows={
                      <>
                        {console.log("w23", fetchedData)}
                        <tr
                          style={{
                            border: "1px solid black",
                            padding: "10px",
                          }}
                        >
                          <td
                            style={{ textAlign: "end", fontWeight: "900" }}
                            colSpan={10}
                          >
                            {" "}
                            {language === "en" ? "Total -" : "एकूण - "}
                          </td>
                          <td
                            style={{
                              padding: "5px",
                              textAlign: "center",
                              fontWeight: "900",
                            }}
                          >
                            {fetchedData?.reduce(
                              (accumulator, expense) =>
                                accumulator + +expense?.collectionAmount,
                              0
                            )}
                          </td>
                        </tr>
                      </>
                    }
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
