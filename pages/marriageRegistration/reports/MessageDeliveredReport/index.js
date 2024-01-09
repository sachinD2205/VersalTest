import { Box, Button, FormControl, Paper, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import ReportLayout from "../NewReportLayout";
import styles from "./report.module.css";

const MessageDeliveredReport = () => {
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
  let router = useRouter();
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  let language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState();
  const {
    control,
    register,
    methods,
    getValues,
    setValue,
    watch,

    formState: { errors },
  } = useForm();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.BaseURL}/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneKey: row.zoneName,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  let user = useSelector((state) => state.user.user);
  // wardKeys
  const [wardKeys, setWardKeys] = useState([]);
  // const [showTable, setShowTable] = useState(false);

  // getWardKeys
  const getWardKeys = () => {
    axios
      .get(`${urls.BaseURL}/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardKey: row.wardName,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect
  useEffect(() => {
    getZoneKeys();
    getWardKeys();
  }, []);
  return (
    <>
      {/* <BasicLayout titleProp={'none'}> */}
      {/* <ThemeProvider theme={theme}> */}
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          padding: "5vh",
          border: 1,
          borderColor: "grey.500",
        }}
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

        <div className={styles.searchFilter} styles={{ marginTop: "50px" }}>
          <FormControl sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "From Date" : "तारखेपासून"}
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
                        variant="standard"
                        {...params}
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
          </FormControl>
          <FormControl sx={{ marginTop: 0, marginLeft: "5vh" }}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "To Date" : "आजपर्यंत"}
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
                        variant="standard"
                        {...params}
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
          </FormControl>
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "20px", marginTop: "10px" }}
              // onClick={getApplicationDetail}
            >
              {language === "en" ? "Search" : "शोधा"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "20px", marginTop: "10px" }}
              onClick={handlePrint}
            >
              {language === "en" ? "Print" : "प्रत काढा"}
            </Button>
          </div>
        </div>

        <div style={{ marginLeft: "5%" }}>
          <ReportLayout
            centerHeader
            centerData
            // rows={table}
            // columns={columnsPetLicense}
            columnLength={18}
            componentRef={componentRef}
            showDates
            date={{
              from: moment(watch("fromDate")).format("DD-MM-YYYY"),
              to: moment(watch("toDate")).format("DD-MM-YYYY"),
            }}
            deptName={{
              en: "Library Management System",
              mr: "पशुवैद्यकीय व्यवस्थापन प्रणाली",
            }}
            reportName={{
              en: "गोषवारा भाग १",
              mr: "गोषवारा भाग १",
            }}
          >
            <ComponentToPrint dataToMap={{ dataSource, language }} />
          </ReportLayout>
        </div>
      </Paper>
      {/* </ThemeProvider> */}
      {/* <ComponentToPrint ref={componentRef} /> */}
      {/* </BasicLayout> */}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ marginTop: "13px", marginBottom: "13px" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>Message Delivered Report</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Name</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Mobile Number</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Address</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Message</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Date</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                  </tr>
                  {/* {this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td></td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default MessageDeliveredReport;
