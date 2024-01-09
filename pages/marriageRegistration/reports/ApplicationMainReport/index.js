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
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import styles from "./goshwara.module.css";
// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import ReportLayout from "../NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ApplicationMain = () => {
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
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  const [route, setRoute] = useState(null);
  const [loaderState, setLoaderState] = useState(false);

  // console.log("menuLabel",menuLabel);

  useEffect(() => {
    console.log("selected menu", menu);

    if (menu?.id == 1100) {
      setRoute("ghoshwara1");
    } else if (menu?.id == 123) {
      setRoute("goshwara2");
    } else if (menu?.id == 51) {
      setRoute("marriageCertificateNew");
    }
    // console.log("selected menu",menus?.find((m)=>m?.id==selectedMenu));
  }, [menu, selectedMenu]);

  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const componentRef = useRef();

  const [dataSource, setDataSource] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    };
    setLoaderState(true);
    axios
      .post(`${urls.MR}/reports/getApplicationsBySearchFilter`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoaderState(false);
        setDataSource(
          r.data.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        setShowTable(true);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const backToHomeButton = () => {
    router.push("/marriageRegistration/dashboard");
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
              <div style={{ marginLeft: "4%" }}>
                <ReportLayout
                  centerHeader
                  centerData
                  // rows={table}
                  // columns={columnsPetLicense}
                  columnLength={8}
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
        <div>
          <div>
            <Paper>
              <table className={styles.report}>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={8}>
                      {
                        this?.props?.data?.language === "en"
                          ? this.props.data.menuNameEng
                          : // "Application Details Report"
                            this.props.data.menuNameMr
                        /* "अर्ज तपशील अहवाल" */
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Zone" : "झोन"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Ward" : "प्रभाग"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Marriage Registration No"
                        : "विवाह नोंदणी क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Marriage Date"
                        : "विवाह दिनांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant Name"
                        : "अर्जदाराच नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Groom Name"
                        : "वराचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Bride Name"
                        : "वधुचे नाव"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.zone?.zoneName
                              : r?.zone?.zoneNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.ward?.wardName
                              : r?.ward?.wardNameMr}
                          </td>
                          <td
                            onClick={() => {
                              localStorage.setItem("serviceId", r?.serviceId),
                                localStorage.setItem("applicationId", r?.id);
                            }}
                          >
                            <a href={this?.props?.data?.route}>
                              {r?.registrationNumber}
                            </a>
                          </td>
                          <td>
                            {" "}
                            {" " +
                              moment(r?.marriageDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.gfName + " " + r?.gmName + " " + r?.glName
                              : r?.gfNameMr +
                                " " +
                                r?.gmNameMr +
                                " " +
                                r?.glNameMr}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.bfName + " " + r?.bmName + " " + r?.blName
                              : r?.bfNameMr +
                                " " +
                                r?.bmNameMr +
                                " " +
                                r?.blNameMr}
                          </td>
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

export default ApplicationMain;
