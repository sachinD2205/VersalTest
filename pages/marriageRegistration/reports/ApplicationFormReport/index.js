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
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
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
  let user = useSelector((state) => state.user.user);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );

  const [table, setTable] = useState([]);

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
    documentTitle: "Marriage Application Report",
  });
  const [loaderState, setLoaderState] = useState(false);

  //have to add new api
  const finalSubmit = (data) => {
    const body = {
      fromDate: moment(data.fromDate).format("YYYY-MM-DD"),
      toDate: moment(data.toDate).format("YYYY-MM-DD"),
      // type: ["groom", "bride"],
    };
    setLoaderState(true);
    axios
      .post(`${urls.MR}/reports/getApplicationsBySearchFilter`, body, {
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
                applicationDate: moment(r.applicationDate).format("DD-MM-YYYY"),
                gfullNameMr: `${r.gfNameMr} ${r.gmNameMr} ${r.glNameMr}`,
                gfullName: `${r.gfName} ${r.gmName} ${r.glName}`,
                bfullNameMr: `${r.bfNameMr} ${r.bmNameMr} ${r.blNameMr}`,
                bfullName: `${r.bfName} ${r.bmName} ${r.blName}`,
                mDate: moment(r.marriageDate).format("DD-MM-YYYY"),
                bAddress: `${r?.bbuildinbNo} ${r?.bbuildingName} ${r?.broadName} ${r?.blandmark} ${r?.bcityName} ${r?.bstate} ${r?.bpincode}`,
                gAddress: `${r?.gbuildinbNo} ${r?.gbuildingName} ${r?.groadName} ${r?.glandmark} ${r?.gcityName} ${r?.gstate} ${r?.gpincode}`,
                gage: r.gage,
                bage: r.bage,
                greligionByBirthTxt: r.greligionByBirthTxt,
                greligionByBirthTxtMr: r.greligionByBirthTxtMr,
                breligionByBirthTxt: r.breligionByBirthTxt,
                breligionByBirthTxtMr: r.breligionByBirthTxtMr,
                serviceCharge: r.serviceCharge,
                bstatusAtTimeMarriageKey: r.bstatusAtTimeMarriageKey,
                gstatusAtTimeMarriageKey: r.gstatusAtTimeMarriageKey,
                gmobileNo: r.gmobileNo,
                bmobileNo: r.bmobileNo,
                pplaceOfMarriage: r.pplaceOfMarriage,
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
      width: 30,
    },
    {
      field: "mDate",
      formattedLabel: "mDate",
      width: 60,
    },
    {
      field: language == "en" ? "pplaceOfMarriage" : "pplaceOfMarriageMr",
      formattedLabel: "pplaceofMarriage",
      width: 50,
    },
    //Groom
    {
      field: language == "en" ? "gfullName" : "gfullNameMr",
      formattedLabel: "gFullName",
      width: 100,
    },
    {
      field: language == "en" ? "gAddress" : "gAddressMr",
      formattedLabel: "gAddress",
      width: 80,
    },
    {
      field: "gage",
      formattedLabel: "gAge",
      width: 50,
    },
    {
      field: language == "en" ? "greligionByBirthTxt" : "greligionByBirthTxtMr",
      formattedLabel: "gReligion",
      width: 50,
    },
    {
      field: "gstatusAtTimeMarriageKey",
      formattedLabel: "gstatusAtTimeMarriageKey",
      width: 50,
    },
    {
      field: "gmobileNo",
      formattedLabel: "gmobileNo",
      width: 50,
    },
    //Bride
    {
      field: language == "en" ? "bfullName" : "bfullNameMr",
      formattedLabel: "bFullName",
      width: 100,
    },
    {
      field: language == "en" ? "bAddress" : "bAddressMr",
      formattedLabel: "bAddress",
      width: 80,
    },
    {
      field: "bage",
      formattedLabel: "bAge",
      width: 50,
    },
    {
      field: language == "en" ? "breligionByBirthTxt" : "breligionByBirthTxtMr",
      formattedLabel: "bReligion",
      width: 50,
    },
    {
      field: "bstatusAtTimeMarriageKey",
      formattedLabel: "bstatusAtTimeMarriageKey",
      width: 50,
    },
    {
      field: "bmobileNo",
      formattedLabel: "bmobileNo",
      width: 50,
    },
    //************************* */

    {
      field: "registrationNumber",
      formattedLabel: "registrationNumber",
      width: 50,
    },
    {
      field: "applicationDate",
      formattedLabel: "applicationDate",
      width: 50,
    },

    {
      field: "serviceCharge",
      formattedLabel: "registrationFees",
      width: 50,
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
          </Paper>{" "}
        </>
      )}
    </>
  );
};

export default Index;
