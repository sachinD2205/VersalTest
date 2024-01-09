import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import styles from "./report.module.css";
// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import ReportLayout from "../NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// Inter Cast Wise Report
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
  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  const [route, setRoute] = useState(null);
  const [dataSource, setDataSource] = useState();
  let user = useSelector((state) => state.user.user);
  const [religionType, setReligionType] = useState();
  const [showTable, setShowTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const {
    control,
    getValues,
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
  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
      religionType: getValues("religionType")?.includes(",")
        ? getValues("religionType").split(",")
        : [getValues("religionType")],
    };
    console.log("asdsaddsa", body);
    setLoaderState(true);
    axios
      .post(`${urls.MR}/reports/getReportOfInterCast`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("asdsaddsa", r);
        setLoaderState(false);
        setReligionType(getValues("religionType"));
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
  // view
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
              <FormControl sx={{ marginTop: "2vh" }}>
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
                            variant="standard"
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
              <FormControl sx={{ marginTop: "2vh", marginLeft: "5vh" }}>
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

              <FormControl
                variant="standard"
                sx={{ marginLeft: 3, marginRight: 2, marginTop: "10px" }}
                error={!!errors.religionType}
              >
                <InputLabel id="demo-simple-select-autowidth-label">
                  {language == "en" ? "Religion Type" : "धर्माचा प्रकार"}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      sx={{ width: 230 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <MenuItem value={"byBirth"}>
                        {language == "en"
                          ? "Religion By Birth"
                          : "जन्माने धर्म"}
                      </MenuItem>
                      <MenuItem value={"byAdoption"}>
                        {language == "en"
                          ? "Religion By Adoption"
                          : "दत्तक घेऊन धर्म"}
                      </MenuItem>
                      <MenuItem value={"byBirth,byAdoption"}>
                        {language == "en" ? "Both" : "दोन्ही"}
                      </MenuItem>
                    </Select>
                  )}
                  name="religionType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.religionType ? errors.religionType.message : null}
                </FormHelperText>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "4px", marginTop: "20px" }}
                onClick={getApplicationDetail}
              >
                {language === "en" ? "Search" : "शोधा"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "4px", marginTop: "20px" }}
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
                    data={{ dataSource, language, ...menu, route }}
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
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Card>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b></b>
                        {this?.props?.data?.language === "en"
                          ? "Inter Cast Wise Report"
                          : "अंतर जातीय विवाह अहवाल"}
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Registration Date"
                        : "नोंदणी तारीख"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Registration Number"
                        : "नोंदणी क्रमांक"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Groom Name"
                        : "वराचे नाव"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Bride Name"
                        : "वधूचे नाव"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Marriage Date"
                        : "लग्नाची तारीख"}
                    </th>
                    {/* {this?.props?.data?.religionType?.includes("byBirth") && (
                      <> */}
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Groom Cast Name by Birth"
                        : "वराची जात(जन्माने) "}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Bride Cast Name by Birth"
                        : "वधुची जात (जन्माने"}
                    </th>
                    {/* </>
                    )} */}
                    {/* {this?.props?.data?.religionType?.includes(
                      "byAdoption",
                    ) && (
                      <> */}
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Groom Cast Name by Adoption"
                        : "वराची जात (दत्तक घेऊन"}
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Bride Cast Name by Adoption"
                        : "वधुची जात (दत्तक घेऊन"}
                    </th>
                    {/* </>
                    )} */}
                  </tr>
                </thead>
                <tbody>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {" "}
                            {" " +
                              moment(
                                r?.serviceCompletionDate,
                                "YYYY-MM-DD",
                              ).format("DD-MM-YYYY")}
                          </td>
                          <td>{r?.registrationNumber}</td>
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
                          <td>
                            {" "}
                            {" " +
                              moment(r?.marriageDate, "YYYY-MM-DD").format(
                                "DD-MM-YYYY",
                              )}
                          </td>
                          {/* {this?.props?.data?.religionType?.includes(
                            "byBirth",
                          ) && (
                            <> */}
                          <td>{r?.greligionByBirthTxt}</td>
                          <td>{r?.breligionByBirthTxt}</td>
                          {/* </>
                          )} */}
                          {/* {this?.props?.data?.religionType?.includes(
                            "byAdoption",
                          ) && (
                            <> */}
                          <td>{r?.greligionByAdoptionTxt}</td>
                          <td>{r?.breligionByAdoptionTxt}</td>
                          {/* </>
                          )} */}
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    );
  }
}
export default Index;
