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
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([
    {
      srNo: 1,
      applicationNumber: "103323240002329",
      bankName: "HDFC",
      branchName: "Pimpri Chinchwad	",
      chequeOrDDdate: "12/04/2023",
      chequeOrDDNo: "061332",
      paymentMode: "DD",
      amount: "4750.0",
    },
  ]);
  const [departments, setDepartments] = useState([]);
  const [custDeptName, setCustDeptName] = useState({});
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

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log("cfcs", r);
        setDepartments(
          r?.data?.department.map((row) => ({
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
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      width: 110,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "bankName",
      headerAlign: "center",
      headerName: language === "en" ? "Bank Name" : "बँकेचे नाव",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "branchName",
      headerAlign: "center",
      headerName: language === "en" ? "Branch Name" : "शाखेचे नाव",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "chequeOrDDdate",
      headerAlign: "center",
      headerName: language === "en" ? "Chq./D.D. Date" : "चेक/डी.डी. तारीख",
      width: 100,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "chequeOrDDNo",
      headerAlign: "center",
      headerName: language === "en" ? "Chq./D.D. No." : "चेक/डी.डी. क्र.",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "paymentMode",
      headerAlign: "center",
      headerName: language === "en" ? "Payment Mode" : "भरणा मोड",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "amount",
      headerAlign: "center",
      headerName: language === "en" ? "Amount" : "रक्कम",
      width: 150,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    console.log("formDataa", data);
    let _dptEn;
    let _dptMr;

    if (data?.selectedDepartment === "All") {
      _dptEn = "All Departments";
      _dptMr = "सर्व विभाग";
    } else {
      _dptEn = departments?.find(
        (i) => i.id === data?.selectedDepartment
      )?.department;
      _dptMr = departments?.find(
        (i) => i.id === data?.selectedDepartment
      )?.departmentMr;
      console.log("_dptEn", _dptEn);
    }

    if (fetchedData?.length > 0) {
      setShowTable(true);
      setCustDeptName({ _dptEn, _dptMr });
    } else {
      sweetAlert("Info", "No records found", "info");
    }
  };

  return (
    <>
      <Head>
        <title>
          {language === "en"
            ? "Daily DD/Cheque Reports"
            : "दैनिक डीडी/चेक अहवाल"}
        </title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language === "en"
            ? "Daily DD/Cheque Reports"
            : "दैनिक डीडी/चेक अहवाल"}
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <div className={styles.row}>
                  <FormControl
                    variant="outlined"
                    error={!!errors.departmentType}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      {language === "en" ? "Departments" : "विभाग"}
                    </InputLabel>
                    <Select
                      sx={{ width: "200px" }}
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="departmentType"
                      {...register("selectedDepartment")}
                      onChange={(e) => {
                        setValue("selectedDepartment", e.target.value, {
                          shouldValidate: true,
                        });
                      }}
                      value={watch("selectedDepartment")}
                    >
                      <MenuItem value="All" key="none">
                        {language === "en" ? "All" : "सर्व"}
                      </MenuItem>
                      {departments &&
                        departments.map((department, index) => (
                          <MenuItem key={index} value={department.id}>
                            {language === "en"
                              ? department.department
                              : department.departmentMr}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                      {errors?.selectedDepartment
                        ? errors.selectedDepartment.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  <FormControl style={{}} error={errors?.fromDate}>
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
                  <FormControl style={{}} error={!!errors?.fromDate}>
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
                </div>
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
                      en: "Daily DD/Cheque Reports",
                      mr: "चेक / डी डी भरणा माहिती",
                    }}
                    customDeptName={{
                      en: custDeptName?._dptEn,
                      mr: custDeptName?._dptMr,
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
