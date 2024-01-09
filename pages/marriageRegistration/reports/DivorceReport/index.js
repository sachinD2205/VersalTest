import React, { useEffect, useState } from "react";
import styles from "./report.module.css";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Paper,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import moment from "moment";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ReportLayout from "../NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const DivorceReport = () => {
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
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  const [dataSource, setDataSource] = useState();
  const [route, setRoute] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  let user = useSelector((state) => state.user.user);
  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    };
    setLoaderState(true);
    axios
      .get(
        `${urls.MR}/reports/getDivorcereport?fromDate=${getValues(
          "fromDate",
        )}&toDate=${getValues("toDate")}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setLoaderState(false);
        console.log("pppppppp", r);
        setDataSource(
          r?.data?.applicant.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        setShowTable(true);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [gStatusAtTimeMarriageKeys, setgStatusAtTimeMarriageKeys] = useState(
    [],
  );

  const getgStatusAtTimeMarriageKeys = () => {
    axios
      .get(`${urls.MR}/master/maritalstatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgStatusAtTimeMarriageKeys(
          r.data.maritalStatus.map((row) => ({
            id: row.id,
            statusDetails: row.statusDetails,
            statusDetailsMar: row.statusDetailsMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getgStatusAtTimeMarriageKeys();
  }, []);
  console.log("sdfsdf", dataSource);
  return (
    <>
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

            <div className={styles.searchFilter}>
              <FormControl sx={{ marginTop: "2vh" }}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        maxDate={new Date()}
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
                            {...params}
                            size="small"
                            variant="standard"
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
              <FormControl sx={{ marginTop: "2vh", marginLeft: "5vh" }}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        maxDate={new Date()}
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
                            {...params}
                            size="small"
                            variant="standard"
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
                  // size="small"
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "20px", marginTop: "20px" }}
                  onClick={getApplicationDetail}
                >
                  {language === "en" ? "Search" : "शोधा"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "20px", marginTop: "20px" }}
                  onClick={handlePrint}
                >
                  {language === "en" ? "Print" : "प्रत काढा"}
                </Button>
              </div>
            </div>

            <br />

            {showTable && (
              <div style={{ marginLeft: "5%" }}>
                <ReportLayout
                  centerHeader
                  centerData
                  // rows={table}
                  // columns={columnsPetLicense}
                  columnLength={5}
                  componentRef={componentRef}
                  showDates
                  date={{
                    from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                    to: moment(watch("toDate")).format("DD-MM-YYYY"),
                  }}
                  deptName={{
                    en: "Marriage Registration",
                    mr: "विवाह नोंदणी प्रणाली",
                  }}
                  reportName={{
                    en: "Inter Cast Wise Report",
                    mr: "अंतर जातीय विवाह अहवाल",
                  }}
                >
                  <ComponentToPrint
                    data={{
                      dataSource,
                      language,
                      ...menu,
                      route,
                      gStatusAtTimeMarriageKeys,
                    }}
                  />
                </ReportLayout>

                {/* <ComponentToPrint
            data={{ dataSource, language, ...menu, route, religionType }}
            ref={componentRef}
          /> */}
              </div>
            )}
          </Paper>
        </>
      )}

      {/* <div>
    
        <Paper>
          <div>
            <center>
              <h1>घटस्पोटीत व विधुर विधवा रिपोर्ट</h1>
            </center>
          </div>

          <div style={{ padding: 10 }}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: 'right' }}
              onClick={handlePrint}
            >
              print
            </Button>
            <Button
              onClick={backToHomeButton}
              variant="contained"
              color="primary"
            >
              back To home
            </Button>
          </div>
        </Paper>
        <ComponentToPrint ref={componentRef} />
     
      </div> */}
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        {console.log("sdfsdzf", this.props)}
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>
                          {this?.props?.data?.language === "en"
                            ? "Report on marriage registration of widows and widowers"
                            : "घटस्पोटीत विधुर-विधवा यांच्या झालेल्या विवाह नोंदणी बाबतचा रिपोर्ट"}
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {" "}
                        {this?.props?.data?.language === "en"
                          ? "Sr.No"
                          : "अ.क्र"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Registration Date"
                          : "नोंदणी दिनांक"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Registration Number"
                          : "नोंदणी क्रमांक"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Husband Name"
                          : "पतीचे नाव"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Wife Name"
                          : "पत्नीचे नाव"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Marriage Date"
                          : "लग्नाची तारीख"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Husband Marital Status"
                          : "पतीची वैवाहिक स्थिती"}
                      </b>
                    </th>

                    <th colSpan={3}>
                      <b>
                        {this?.props?.data?.language === "en"
                          ? "Wife Marital Status"
                          : "पत्नी वैवाहिक स्थिती"}
                      </b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                  </tr> */}
                  {this.props.data.dataSource &&
                    this.props.data.dataSource.map((r, i) => (
                      <>
                        {/* {console.log("sdsddas",r)} */}
                        <tr>
                          <td>{i + 1}</td>

                          <td>
                            {" " +
                              moment(r?.applicationDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>

                          <td>{r?.registrationNumber}</td>

                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.gfName + " " + r?.gmName + " " + r?.glName
                              : r?.gfNameMr +
                                " " +
                                r?.gmNameMr +
                                " " +
                                r?.glNameMr}
                          </td>

                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.bfName + " " + r?.bmName + " " + r?.blName
                              : r?.bfNameMr +
                                " " +
                                r?.bmNameMr +
                                " " +
                                r?.blNameMr}
                          </td>

                          <td>
                            {" "}
                            {" " +
                              moment(r?.marriageDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>
                          {this.props.data.language == "en" ? (
                            <td>
                              {this.props.data.gStatusAtTimeMarriageKeys &&
                                this.props.data.gStatusAtTimeMarriageKeys.find(
                                  (item) =>
                                    item.id == r.gstatusAtTimeMarriageKey,
                                ).statusDetails}
                            </td>
                          ) : (
                            <td>
                              {this.props.data.gStatusAtTimeMarriageKeys &&
                                this.props.data.gStatusAtTimeMarriageKeys.find(
                                  (item) =>
                                    item.id == r.gstatusAtTimeMarriageKey,
                                ).statusDetailsMar}
                            </td>
                          )}
                          {this.props.data.language == "en" ? (
                            <td>
                              {this.props.data.gStatusAtTimeMarriageKeys &&
                                this.props.data.gStatusAtTimeMarriageKeys.find(
                                  (item) =>
                                    item.id == r.bstatusAtTimeMarriageKey,
                                ).statusDetails}
                            </td>
                          ) : (
                            <td>
                              {this.props.data.gStatusAtTimeMarriageKeys &&
                                this.props.data.gStatusAtTimeMarriageKeys.find(
                                  (item) =>
                                    item.id == r.bstatusAtTimeMarriageKey,
                                ).statusDetailsMar}
                            </td>
                          )}
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default DivorceReport;
