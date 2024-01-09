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
import schema from "../../../containers/schema/common/reports/cfcWiseTopupCollectionSchema";
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
  const [modeOfPayments, setModeOfPayments] = useState([
    {
      name: "Online Top Up",
      value: "Online_Top_Up",
      id: 1,
    },
    {
      name: "Bank Top Up",
      value: "Bank_Top_Up",
      id: 2,
    },
  ]);

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
    setValue("paymentMode", 1);
  }, []);

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
      field: "cfcId",
      headerAlign: "center",
      headerName: language === "en" ? "CFC Id" : "सीएफसी आयडी",
      width: 100,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "cfcCenterName",
      headerAlign: "center",
      headerName:
        language === "en" ? "CFC Center Name" : "सीएफसी केंद्राचे नाव",
      width: 210,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "cfcOwnerName",
      headerAlign: "center",
      headerName: language === "en" ? "CFC Owner Name" : "सीएफसी मालकाचे नाव",
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
  ];

  const finalSubmit = (data) => {
    setLoading(true);
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    console.log("formDataa", data);
    axios
      .get(
        `${urls.CFCURL}/trasaction/report/cfcWiseTopUpCollection?fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("post2", res);
        if (res.status == 200) {
          setFetchedData(
            res?.data?.reportResponceList?.map((val, index) => {
              return {
                srNo: index + 1,
                cfcId: val?.cfcId,
                cfcCenterName: val?.cfcCenterName,
                cfcOwnerName: val?.cfcOwnerName,
                amount: val?.amount,
              };
            })
          );
          if (res?.data?.reportResponceList?.length > 0) {
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
            ? "CFC Wise Top Up Collection"
            : "सीएफसी वाईज टॉप अप कलेक्शन"}{" "}
        </title>
      </Head>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language === "en"
            ? "CFC Wise Top Up Collection"
            : "सीएफसी वाईज टॉप अप कलेक्शन"}
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <div className={styles.row}>
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

                  <FormControl
                    variant="outlined"
                    error={!!errors.paymentMode}
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      {language === "en" ? "Mode Of Payment" : "पेमेंट मोड"}
                    </InputLabel>
                    <Controller
                      control={control}
                      name="paymentMode"
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          disabled
                          sx={{ width: "200px" }}
                          label={
                            language === "en" ? "Mode Of Payment" : "पेमेंट मोड"
                          }
                          // variant="standard"
                          {...field}
                          error={!!errors.paymentMode}
                        >
                          {modeOfPayments &&
                            modeOfPayments.map((mode) => (
                              <MenuItem key={mode.id} value={mode.id}>
                                {mode?.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    <FormHelperText>
                      {errors?.paymentMode ? errors.paymentMode.message : null}
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
                      en: "CFC Wise Top Up Collection",
                      mr: "सीएफसी वाईज टॉप अप कलेक्शन",
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
