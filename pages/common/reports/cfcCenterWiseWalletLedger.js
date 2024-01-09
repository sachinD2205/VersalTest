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
      field: "date",
      headerAlign: "center",
      headerName: language === "en" ? "Date" : "तारीख",
      width: 110,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "center",
      headerAlign: "center",
      headerName: language === "en" ? "Center Name" : "केंद्राचे नाव",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "department",
      headerAlign: "center",
      headerName: language === "en" ? "Service Name" : " नाव",
      width: 210,
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
    {
      headerClassName: "cellColor",
      field: "cumBalance",
      headerAlign: "center",
      headerName: language === "en" ? "Cum Balance" : "सह शिल्लक",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "openingBalance",
      headerAlign: "center",
      headerName: language === "en" ? "Opening Balance" : "ओपनिंग बॅलन्स",
      width: 150,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    console.log("formDataa", data);
    let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
    let toDate = moment(watch("toDate")).format("YYYY-MM-DD");
    setLoading(true);
    let _cfc = cfcs?.map((val) => {
      return val.id;
    });
    let selectedcfcName =
      watch("cfcCenter") == "All" ? _cfc?.toString() : watch("cfcCenter");

    axios
      .post(
        `${urls.CFCURL}/trasaction/cfcPaymentDetails/cfcCenterWiseWalletLedger?cfcId=${selectedcfcName}&fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res, index) => {
        setLoading(false);
        console.log("post", res?.data?.walletLedgerDaos);
        if (res.status == 200) {
          let data = res?.data?.walletLedgerDaos;
          setTable(
            data?.map((val, index) => {
              return {
                srNo: index + 1,
                date: moment(val?.createDtTm).format("DD/MM/YYYY"),
                center: val?.cfcName,
                department: val?.serviceName,
                amount: val?.paymentAmount,
                cumBalance: val?.currentBalance,
                openingBalance: val?.openingBalance,
              };
            })
          );
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
          {language === "en"
            ? "CFC Center Wise Wallet Ledger Report"
            : "सीएफसी सेंटर वाईज वॉलेट लेजर अहवाल"}
        </title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language === "en"
            ? "CFC Center Wise Wallet Ledger Report"
            : "सीएफसी सेंटर वाईज वॉलेट लेजर अहवाल"}
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
                              <MenuItem key={mode.id} value={mode.cfcId}>
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
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                    size="small"
                  >
                    {language === "en" ? "Print" : "छापा"}
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
                    en: "CFC Center Wise Wallet Ledger Report",
                    mr: "सीएफसी सेंटर वाईज वॉलेट लेजर अहवाल",
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
