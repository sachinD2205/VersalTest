import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ReportLayout from "../NewReportLayout";
import styles from "./report.module.css";
// import ReportLayout from "../ReportLayout";
const Index = () => {
  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const [dataSource, setDataSource] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  let router = useRouter();
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  let language = useSelector((state) => state.labels.language);
  const [route, setRoute] = useState(null);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  let user = useSelector((state) => state.user.user);
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    };
    setLoaderState(true);
    axios
      .post(
        `${urls.MR}/reports/getSlotInfo`,
        body,
        // , {
        // headers: {
        //   Authorization: `Bearer ${user.token}`,
        // },
        // }
      )
      .then((r) => {
        setLoaderState(false);
        setDataSource(
          r.data.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        setShowTable(true);
      });
  };
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
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
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
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
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
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "2vh" }}
                onClick={getApplicationDetail}
              >
                {language === "en" ? "Search" : "शोधा"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "2vh" }}
                onClick={handlePrint}
              >
                {language === "en" ? "Print" : "प्रत काढा"}
              </Button>
            </div>

            <br />
            {showTable && (
              <div style={{ marginLeft: "5%" }}>
                <ReportLayout
                  centerHeader
                  centerData
                  // rows={table}
                  // columns={columnsPetLicense}
                  // columnLength={18}
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
                  <ComponentToPrint
                    data={{ dataSource, language, ...menu, route }}
                  />
                </ReportLayout>
              </div>
            )}
          </Paper>
        </>
      )}
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={6}>
                      <h3>
                        {this?.props?.data?.language === "en"
                          ? "Slot Allocated Report"
                          : "स्लॉट वाटप अहवाल"}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant No."
                        : "अर्जदार क्रमांक"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant Name"
                        : "अर्जदाराचे नाव"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Allocated Date"
                        : "वाटप तारीख"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Allocated Time"
                        : "वाटप केलेला वेळ"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Token No"
                        : "टोकन क्र"}
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
                  </tr> */}
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>

                          <td>{r?.applicationNumber}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantNameMr}
                          </td>

                          <td>
                            {" "}
                            {" " +
                              moment(r?.appointmentDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>
                          <td>
                            {r?.appointmentFromTime} To {r?.appointmentToTime}{" "}
                          </td>
                          <td>{r?.tokenNo}</td>
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

export default Index;
