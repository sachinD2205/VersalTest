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
import Loader from "../../../containers/Layout/components/Loader";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import schema from "../../../containers/schema/common/reports/cfcTopupDetailsSchema";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [petAnimal, setPetAnimal] = useState([
    { id: 1, nameEn: "", nameMr: "" },
  ]);
  const [petBreeds, setPetBreeds] = useState([
    { id: 1, breedNameEn: "", breedNameMr: "" },
  ]);
  const [departments, setDepartments] = useState([]);
  const [zones, setZones] = useState([]);
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

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      width: 50,
    },
    {
      field: "cfcCenterId",
      headerName: language == "en" ? "CFC Center Id" : "सीएफसी केंद्र आयडी",
      width: 120,
    },
    {
      field: "cfcCenterName",
      headerName: language == "en" ? "CFC Center Name" : "सीएफसी केंद्राचे नाव",
      width: 200,
    },
    {
      field: "cfcOwnerName",
      headerName: language == "en" ? "CFC Owner Name" : "सीएफसी मालकाचे नाव",
      width: 200,
    },
    {
      field: "lastTopupDate",
      headerName: language == "en" ? "Last Topup Date" : "शेवटची टॉपअप तारीख",
      width: 200,
    },
    {
      field: "lastTopupAmount",
      headerName: language == "en" ? "Last Topup Amount" : "शेवटची टॉपअप रक्कम",
      width: 120,
    },
    {
      field: "prevBalance",
      headerName: language == "en" ? "Previous Balance" : "मागील शिल्लक",
      width: 120,
    },
    {
      field: "currentBalance",
      headerName: language == "en" ? "Current Balance" : "चालू शिल्लक",
      width: 120,
    },

    // {
    //   field: "fromDate",
    //   headerName: language == "en" ? "From Date" : "या तारखेपासून",
    //   width: 120,
    // },
    // {
    //   field: "toDate",
    //   headerName: language == "en" ? "To Date" : "या तारखेपर्यंत",
    //   width: 120,
    // },
  ];

  const finalSubmit = (data) => {
    setLoading(true);
    let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
    let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
    console.log("finalSubmit");
    axios
      .get(
        `${urls.CFCURL}/trasaction/topUpProcess/topUpDetailsHistory?fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("post", res);
        setTable(
          res.data.topUpProcess.length > 0
            ? res.data.topUpProcess.map((j, i) => ({
                ...j,
                srNo: i + 1,
                cfcCenterId: j.cfcCentersDao.cfcId,
                cfcCenterName: j.cfcCentersDao.cfcName,
                cfcOwnerName: j.cfcCentersDao.cfcOwnerName
                  ? j.cfcCentersDao.cfcOwnerName
                  : "-",
                lastTopupDate: moment(j.createDtTm).format("DD/MM/YYYY"),
                lastTopupAmount: j.rechargeAmount,
                currentBalance: j.cfcCentersDao.balanceAvailableRs
                  ? j.cfcCentersDao.balanceAvailableRs
                  : "-",
                prevBalance:
                  j.cfcCentersDao.balanceAvailableRs - j.rechargeAmount,
              }))
            : []
        );
        res.data.topUpProcess.length == 0 &&
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
        <title>CFC Topup Details</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="cfcTopupDetails" />
        </div>

        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <Box>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={6}
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
                      xs={6}
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
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      endIcon={<Search />}
                      size="small"
                    >
                      <FormattedLabel id="search" />
                    </Button>
                  </Grid>
                </Box>
              </form>
              <>
                {table.length > 0 && (
                  <div className={styles.centerDiv}>
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
                        en: "CFC TOPUP DETAILS",
                        mr: "सीएफसी टॉपअप तपशील",
                      }}
                      columns={columns}
                      extraRows={
                        <>
                          <tr
                            style={{
                              border: "1px solid black",
                              padding: "10px",
                            }}
                          >
                            <td
                              style={{ textAlign: "end", fontWeight: "900" }}
                              colSpan={5}
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
                              {table[0]?.cfcCentersDao.balanceAvailableRs}
                            </td>
                          </tr>
                        </>
                      }
                    />
                  </div>
                )}
                <div
                  className={styles.centerDiv}
                  style={{ gap: 20, marginTop: 20 }}
                >
                  <Button
                    disabled={table.length == 0}
                    variant="contained"
                    size="small"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                  >
                    {/* <FormattedLabel id="print" /> */}
                    Print
                  </Button>
                </div>
              </>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
