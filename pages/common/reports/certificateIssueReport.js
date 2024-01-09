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
  const [fetchedData, setFetchedData] = useState([]);
  const [cfcs, setCfcs] = useState([]);
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
    getCfcS();
  }, []);

  const getCfcS = () => {
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
          r?.data?.cfcCenters.map((row) => ({
            ...row,
          }))
        );
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
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
      field: "date",
      headerAlign: "center",
      headerName: language === "en" ? "Date" : "तारीख",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "cfcCenterId",
      headerAlign: "center",
      headerName: language === "en" ? "CFC Center Id" : "सीएफसी सेंटर आयडी",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumber",
      headerAlign: "center",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicantName",
      headerAlign: "center",
      headerName: language === "en" ? "Applicant Name" : "अर्जदाराचे नाव",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "department",
      headerAlign: "center",
      headerName: language === "en" ? "Department Name" : "विभागाचे नाव",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "sign",
      headerAlign: "center",
      headerName: language === "en" ? "Sign" : "स्वाक्षरी",
      width: 110,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    console.log("formDataa", data);
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    setLoading(true);
    axios
      .get(
        `${urls.CFCURL}/trasaction/report/certificateIssuedReport?fromDate=${fromDate}&toDate=${toDate}`,
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
                date: val?.applicationDate,
                cfcCenterId: val?.cfcId,
                applicationNumber: val?.applicationNo,
                applicantName: val?.name,
                department: val?.departmentName,
                sign: "",
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
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <Head>
        <title>
          {language === "en"
            ? "Certificate Issue Report"
            : "प्रमाणपत्र जारी अहवाल"}
        </title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language === "en"
            ? "Certificate Issue Report"
            : "प्रमाणपत्र जारी अहवाल"}
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
                    error={!!errors.cfcCenter}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      {language === "en" ? "CFC Center" : "सीएफसी केंद्र"}
                    </InputLabel>
                    <Controller
                      control={control}
                      name="cfcCenter"
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          sx={{ width: "200px" }}
                          label={
                            language === "en" ? "CFC Center" : "सीएफसी केंद्र"
                          }
                          // variant="standard"
                          {...field}
                          error={!!errors.cfcCenter}
                        >
                          {cfcs &&
                            cfcs.map((mode) => (
                              <MenuItem key={mode.id} value={mode.id}>
                                {mode?.cfcName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors?.cfcCenter ? errors.cfcCenter.message : null}
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
                      en: "Certificate Issue Report",
                      mr: "प्रमाणपत्र जारी अहवाल",
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
