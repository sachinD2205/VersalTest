import React, { useRef, useState } from "react";
import styles from "./report.module.css";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Print, Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import moment from "moment";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as yup from "yup";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import urls from "../../../../URLS/urls";
import ReportLayout from "../ReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
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
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const componentRef = useRef(null);

  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );

  const [table, setTable] = useState([]);
  const [loaderState, setLoaderState] = useState(false);

  const reportSchema = yup.object().shape({
    fromDate: yup
      .date()
      .typeError(`Please select a from Date`)
      .required(`Please select a from Date`),
    toDate: yup
      .date()
      .typeError(`Please select a to Date`)
      .required(`Please select a to Date`),
  });

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(reportSchema),
  });

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "Disabled Report",
  });
  let user = useSelector((state) => state.user.user);
  //have to add new api
  const finalSubmit = (data) => {
    const body = {
      fromDate: moment(data.fromDate).format("YYYY-MM-DD"),
      toDate: moment(data.toDate).format("YYYY-MM-DD"),
      type: ["groom", "bride"],
    };
    setLoaderState(true);
    axios
      .post(`${urls.MR}/reports/getDisabledReportDtl`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setLoaderState(false);
        console.log("resultttt", res.data);
        setTable(
          //have to add path
          res.data.length > 0
            ? res.data.map((r, i) => ({
                srNo: i + 1,
                registrationNumber: r.registrationNumber,
                registrationDate: moment(r.applicationDate).format(
                  "DD-MM-YYYY",
                ),
                gfullNameMr: `${r.gfNameMr} ${r.gmNameMr} ${r.glNameMr}`,
                gfullName: `${r.gfName} ${r.gmName} ${r.glName}`,
                bfullNameMr: `${r.bfNameMr} ${r.bmNameMr} ${r.blNameMr}`,
                bfullName: `${r.bfName} ${r.bmName} ${r.blName}`,
                mDate: moment(r.marriageDate).format("DD-MM-YYYY"),
                isGroomDisabled: r.gdisabled ? "Yes" : "No",
                isBrideDisabled: r.bdisabled ? "Yes" : "No",
                bdisabledType: r.bdisabilityType,
                gdisabledType: r.gdisabilityTypeTxt,
                gdisabledTypeMr: r.gdisabilityTypeMrTxt,
              }))
            : [],
        );
        res.data.length == 0 && sweetAlert("Info", "No records found", "info");
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const reportColumns = [
    {
      field: "srNo",
      formattedLabel: "srNo",
      width: 130,
    },
    {
      field: "registrationDate",
      formattedLabel: "registrationDate",
      width: 120,
    },
    {
      field: "registrationNumber",
      formattedLabel: "registrationNumber",
      width: 120,
    },
    {
      field: language == "en" ? "gfullName" : "gfullNameMr",
      formattedLabel: "gFullName",
      width: 120,
    },
    {
      field: language == "en" ? "bfullName" : "bfullNameMr",
      formattedLabel: "bFullName",
      width: 120,
    },
    {
      field: "mDate",
      formattedLabel: "mDate",
      width: 100,
    },
    {
      field: "isGroomDisabled",
      formattedLabel: "isGroomDisabled",
      width: 100,
    },
    {
      field: "isBrideDisabled",
      formattedLabel: "isBrideDisabled",
      width: 100,
    },
    {
      field: language == "en" ? "gdisabledType" : "gdisabledTypeMr",
      formattedLabel: "gdisabledType",
      width: 100,
    },
    {
      field: "bdisabledType",
      formattedLabel: "bdisabledType",
      width: 100,
    },
  ];
  console.log("ooooooooo", table);
  return (
    <>
      {/* <Head>
        <title>Application Report</title>
      </Head> */}
      {loaderState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper
            sx={{
              padding: "5vh",
              border: 1,
              borderColor: "grey.500",
            }}
            className={styles.main}
          >
            <div className={styles.detailsTABLE}>
              <div className={styles.h1TagTABLE}>
                <h2
                  style={{
                    fontSize: "20",
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {language === "en" ? menu.menuNameEng : menu.menuNameMr}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit(finalSubmit)}>
              <div className={styles.row}>
                <FormControl error={!!error.fromDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          maxDate={new Date()}
                          inputFormat="dd-MM-yyyy"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {language === "en" ? "From Date" : "तारखेपासून"}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "200px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.fromDate ? error.fromDate.message : null}
                  </FormHelperText>
                </FormControl>
                <FormControl error={!!error.toDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          maxDate={new Date()}
                          inputFormat="dd-MM-yyyy"
                          label={
                            <span style={{ fontSize: 14 }}>
                              {language === "en" ? "To Date" : "आजपर्यंत"}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "200px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.toDate ? error.toDate.message : null}
                  </FormHelperText>
                </FormControl>

                <div style={{ display: "flex", gap: 20 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Search />}
                  >
                    {/* <FormattedLabel id='search' /> */}
                    {language === "en" ? "Search" : "शोधा"}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                  >
                    {language === "en" ? "Print" : "प्रत काढा"}
                    {/* <FormattedLabel id='print' /> */}
                  </Button>
                </div>
              </div>
            </form>
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
                  // rows={[]}
                  columns={reportColumns}
                />
              </div>
            )}
          </Paper>
        </>
      )}
    </>
  );
};

export default Index;
