import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Grid,
  Paper,
  Box,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import theme from "../../../../theme.js";
import styles from "./ComplaintStatusReport.module.css";
import Styles from "../MasterReport/Master.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import ComplaintStatusReportSchema from "../../../../components/grievanceMonitoring/schema/ComplaintStatusReportSchema";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil.js";

const Index = () => {
  const {
    register,
    setValue,
    watch,
    methods,
    handleSubmit,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(ComplaintStatusReportSchema),
  });
  const language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [dayWiseDataInDetails, setDayWiseDataInDetails] = useState([]);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [engDayWiseReportsData, setEngDayWiseReportsData] = useState([]);
  const [mrDayWiseReportsData, setMrDayWiseReportsData] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  // findcomplaintStatusReportData
  const findcomplaintStatusReportData = (data) => {
    setValue("loadderState", true);
    let { applicationNo } = data;
    let FinalBodyForApi;

    if (applicationNo != null && applicationNo != undefined) {
      FinalBodyForApi = {
        applicationNo,
      };

      let url = `${urls.GM}/report/getReportComplainDetails`;

      axios
        .post(url, FinalBodyForApi, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            console.log(
              `DayWiseReportData`,
              res.reopenCount > 0,
              res.complaintStatus
            );
            if (res?.data.applicationNo != undefined) {
              setValue("loadderState", false);

              setDayWiseDataInDetails(res?.data);
              setValue("searchButtonInputState", false);
              let _enData = {
                "Token Number :": res?.data.applicationNo,
                "Complaint Date :": moment(res?.data?.grivDate)?.format(
                  "DD-MM-YYYY"
                ),
                "Complainee Name :": res?.data?.complaineeName,
                // "Contact Details": res?.data?.mobileNo,
                "Mobile No. :": res?.data?.mobileNo,
                // Subject: res?.data?.complaintType,
                "Subject :": res?.data?.complaintType,
                // "Complaint Details": res?.data?.complaintSubType,
                "Complaint Details :":
                  res?.data?.complaintSubType == null
                    ? "-"
                    : res?.data?.complaintSubType,
                "Complaint Description :": res?.data?.complaintDescription,
                "Complaint Place :": res?.data?.address,
                "Department Name :": res?.data?.departmentName,
                "Complaint Status :":
                  res.data.reopenCount > 0 &&
                  res.data.complaintStatus === "Open"
                    ? "Reopen"
                    : res?.data?.complaintStatus,
                "Event Name :": !res?.data?.eventName
                  ? "-"
                  : res?.data?.eventName,
                "Media Name :": !res?.data?.mediaName
                  ? "-"
                  : res?.data?.mediaName,
                "Department User :": res?.data?.complaintDeptUser,
              };
              let _mrData = {
                "टोकन क्र.:": res?.data?.applicationNo,
                "तक्रार दिनांक :": moment(res?.data?.grivDate)?.format(
                  "DD-MM-YYYY"
                ),
                "तक्रारदाराचे नाव :": res?.data?.complaineeNameMr,
                // "संर्पक तपशील": res?.data?.mobileNo,
                "संर्पक तपशील :": res?.data?.mobileNo,
                "तक्रारीचे वर्णन": res?.data?.complaintDescriptionMr,
                "विषय :": res?.data?.complaintTypeMr,
                "तक्रार तपशील :":
                  res?.data?.complaintSubTypeMr == null
                    ? "-"
                    : res?.data?.complaintSubTypeMr,
                "तक्रार ठिकाण :": res?.data.addressMr,
                "विभाग :": res?.data?.departmentNameMr,
                "स्थिती :":
                  res.data.reopenCount > 0 &&
                  res.data.complaintStatus === "Open"
                    ? "पुन्हा उघडले"
                    : res?.data?.complaintStatusMr,
                "कार्यक्रमाचे नाव :": !res?.data?.eventNameMr
                  ? "-"
                  : res?.data?.eventNameMr,
                "तक्रार माध्यम :": !res?.data?.mediaNameMr
                  ? "-"
                  : res?.data?.mediaNameMr,
                "विभाग अधिकारी :": res?.data?.complaintDeptUser,
              };
              const responseData = res?.data?.reportComplaintDeatilsListDao;

              // Process the response data and set the state variables
              const _enDayWiseData = responseData.map((item) => ({
                Date: moment(item.date).format("DD-MM-YYYY"),
                "User Name": item.userName,
                Remark:
                  item?.remark == "null" || item?.remark == undefined
                    ? "-"
                    : item?.remark,
                "Old Status": item.oldCondition,
                "New Status": item.newCondition,
              }));

              const _mrDayWiseData = responseData.map((item) => ({
                दिनांक: moment(item.date).format("DD-MM-YYYY"),
                "वापरकर्ता नाव": item.userNameMr,
                शेरा:
                  item?.remark == "null" || item?.remark == undefined
                    ? "-"
                    : item?.remark,
                "जुनी स्थिती": item.oldConditionMr,
                "नवीन स्थिती": item.newConditionMr,
              }));

              // Assuming you have functions to set state variables
              setEngDayWiseReportsData(_enDayWiseData);
              setMrDayWiseReportsData(_mrDayWiseData);

              setEngReportsData(_enData);
              setMrReportsData(_mrData);
            } else {
              setValue("loadderState", false);
              cancellButton();
              setValue("searchButtonInputState", true);
              sweetAlert({
                title: language === "en" ? "OOPS!" : "क्षमस्व!",
                text:
                  language === "en"
                    ? "There is nothing to show you!"
                    : "माहिती उपलब्ध नाही",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
            }
          }
        }).catch((err) => {
          setValue("loadderState", false);
          cfcErrorCatchMethod(err,false);
        })
    } else {
      setValue("loadderState", false);
    }
  };


  // cancellButton
  const cancellButton = () => {
    setValue("loadderState", true);
    setValue("applicationNo");
    setValue("searchButtonInputState", true);
    setDayWiseDataInDetails([]);
    setEngReportsData([]);
    setMrReportsData([]);
    setValue("loadderState", false);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };

  useEffect(() => {
    setValue("loadderState", false);
    setValue("applicationNo");
    setValue("searchButtonInputState", true);
  }, []);


  function generateCSVFile(data, complaintData) {
    console.log("complaintData", complaintData);
    console.log("complaintData data", data);

    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? "Complaint Status Report" : "तक्रार स्थिती अहवाल";

    const date =
      language == "en"
        ? `DATE: From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक: ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const boldFont = { bold: true };
    const fontSize = 16;
    const dataStyle = {
      font: { ...boldFont, size: fontSize },
    };
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const fileName =
      language == "en" ? "Complaint Status Report" : "तक्रार स्थिती अहवाल";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtension = ".xlsx";
    const rows = Object.keys(data).map((key) => ({
      a: { v: key, s: dataStyle },
      b: data[key],
    }));

    const ws = XLSX.utils.json_to_sheet(rows, {
      skipHeader: true,
      origin: "C5",
    });

    ws.D1 = { t: "s", v: engHeading, s: headerStyle };
    ws.D2 = { t: "s", v: reportName, s: headerStyle };
    ws.D3 = { t: "s", v: date, s: headerStyle };

    ws["!cols"] = [{ wch: 25 }, { wch: 25 }];
    let tableData;
    let tableHeaders;

    if (language === "en") {
      tableData = complaintData;
      tableHeaders = [
        "Date",
        "User Name",
        "Remark",
        "Old Status",
        "New Status",
      ];
    } else {
      tableData = complaintData;
      tableHeaders = [
        "दिनांक",
        "वापरकर्ता नाव",
        "जुनी स्थिती",
        "नवीन स्थिती",
        "शेरा",
      ];
    }
    const tableRows = tableData.map((item) => [
      item[tableHeaders[0]], // Date
      item[tableHeaders[1]], // User Name
      item[tableHeaders[2]], // Remark
      item[tableHeaders[3]], // Old Condition
      item[tableHeaders[4]], // New Condition
    ]);
    XLSX.utils.sheet_add_json(ws, rows, { skipHeader: true, origin: "C5" });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: "C" + (rows.length + 8) });
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          {
            v: language === "en" ? "Complaint Information" : "तक्रार माहिती",
            s: { font: { bold: true }, alignment: { horizontal: "center" } },
          },
        ],
      ],
      { origin: "D" + (rows.length + 9) }
    );
    // Add the second table header in bold
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        tableHeaders.map((header) => ({
          v: header,
          s: { font: { bold: true } },
        })),
      ],
      { origin: "B" + (rows.length + 10) }
    );
    // Add the second table data to the existing sheet
    XLSX.utils.sheet_add_aoa(ws, tableRows, {
      origin: { r: rows.length + 10, c: 1 },
    });
    // Convert the workbook to Excel format and save
    const excelBuffer = XLSX.write(
      { Sheets: { [fileName]: ws }, SheetNames: [fileName] },
      { bookType: "xlsx", type: "array" }
    );
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
  }


  // view
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper className={styles.PaperMain}>
        {watch("loadderState") && <CommonLoader />}
        <>
          <ThemeProvider theme={theme}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(findcomplaintStatusReportData)}>
                <Box>
                  <Grid
                    container
                    style={{
                      display: "flex",
                      alignItems: "center", // Center vertically
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      color: "white",
                      fontSize: "18.72px",
                      borderRadius: 100,
                      fontWeight: 500,
                      background:
                        "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
                    }}
                  >
                    <Grid item xs={1}>
                      <IconButton
                        style={{
                          color: "white",
                        }}
                        onClick={() => {
                          router.back();
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={10}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        {language == "en"
                          ? "Complaint Status Report "
                          : "तक्रार स्थिती अहवाल"}
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid
                  container
                  sx={{
                    marginTop: 1,
                    marginBottom: 5,
                    paddingLeft: "50px",
                    align: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    xl={12}
                    className={styles.GridItem}
                  >
                    <TextField
                      variant="outlined"
                      disabled={!watch("searchButtonInputState")}
                      style={{ width: "400px" }}
                      id="standard-basic"
                      label={
                        language == "en" ? "Token Number *" : "टोकन क्रमांक *"
                      }
                      {...register("applicationNo")}
                      error={!!errors?.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors?.applicationNo?.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                {/** Buttons  */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                  }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  justifyContent="center"
                  alignItems="center"
                  paddingBottom="7"
                  marginTop="5"
                  marginBottom="8vh"
                >
                  {watch("searchButtonInputState") == true ? (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SearchIcon />}
                      >
                        {language == "en" ? "Search" : "शोधा"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        type="primary"
                        size="small"
                        endIcon={<PrintIcon />}
                        onClick={handlePrint}
                      >
                        {language == "en" ? "Print" : "प्रिंट"}
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<DownloadIcon />}
                        onClick={() =>
                          language == "en"
                            ? generateCSVFile(
                                engReportsData,
                                engDayWiseReportsData
                              )
                            : generateCSVFile(
                                mrReportsData,
                                mrDayWiseReportsData
                              )
                        }
                      >
                        {<FormattedLabel id="downloadEXCELL" />}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Stack>
              </form>
            </FormProvider>
          </ThemeProvider>

          {/** New Table Report  */}
          <div className={Styles.HideComponent}>
            <ReportLayout
              columnLength={5}
              componentRef={componentRef}
              deptName={{
                en: "Grievance Monitoring System",
                mr: "तक्रार निवारण प्रणाली",
              }}
              reportName={{
                en: "Complete Details of the Complaint",
                mr: "तक्रारीचा संपूर्ण तपशील",
              }}
            >
              <ComponentToPrintNew
                dayWiseDataInDetails={dayWiseDataInDetails}
                language={language}
              />
            </ReportLayout>
          </div>

          {dayWiseDataInDetails != null &&
            dayWiseDataInDetails != undefined &&
            dayWiseDataInDetails.length != 0 && (
              <>
                <div>
                  <ComponentToPrintNew1
                    dayWiseDataInDetails={dayWiseDataInDetails}
                    language={language}
                  />
                </div>
              </>
            )}
        </>
      </Paper>
    </>
  );
};
// ComponentToPrint
class ComponentToPrintNew extends React.Component {
  render() {
    const {
      applicationNo,
      grivDate,
      complaineeName,
      complaineeNameMr,
      address,
      addressMr,
      complaintType,
      complaintTypeMr,
      complaintDescription,
      complaintDescriptionMr,
      complaintSubType,
      complaintSubTypeMr,
      departmentName,
      departmentNameMr,
      complaintStatus,
      complaintStatusMr,
      eventName,
      eventNameMr,
      complaintDeptUser,
      mediaNameMr,
      mediaName,
      mobileNo,
      reportComplaintDeatilsListDao,
    } = this?.props?.dayWiseDataInDetails;


    return (
      <>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table>
              <tbody>
                <tr>
                  <td colSpan={5} className={Styles.Table1HEADER}>
                    {this?.props?.language == "en"
                      ? "Complete Details of the Complaint"
                      : "तक्रारीची संपुर्ण माहिती"}
                  </td>
                </tr>
                {/** First Table*/}
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Token Number :"
                      : "टोकन क्र.:"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {applicationNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Date :" : "दिनांक :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {moment(grivDate).format("DD-MM-YYYY")}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complainee Name :"
                      : "तक्रारदाराचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaineeName
                      : complaineeNameMr}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Mobile No. :"
                      : "संर्पक तपशील :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {mobileNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Subject :" : " विषय :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintType
                      : complaintTypeMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Details :"
                      : " तक्रार तपशील :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintSubType
                        ? complaintSubType
                        : "-"
                      : complaintSubTypeMr
                      ? complaintSubTypeMr
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Description :"
                      : " तक्रारीचे वर्णन :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintDescription
                      : complaintDescriptionMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Place :"
                      : "तक्रार ठिकाण :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en" ? address : addressMr}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department Name :"
                      : "विभाग :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? departmentName
                      : departmentNameMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Status :"
                      : "स्थिती :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? this?.props?.dayWiseDataInDetails.reopenCount > 0 &&
                        this?.props?.dayWiseDataInDetails.complaintStatus ===
                          "Open"
                        ? "Reopen"
                        : complaintStatus
                      : this?.props?.dayWiseDataInDetails.reopenCount > 0 &&
                        this?.props?.dayWiseDataInDetails.complaintStatus ===
                          "Open"
                      ? "पुन्हा उघडले"
                      : complaintStatusMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Event Name :"
                      : "कार्यक्रमाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? eventName
                        ? eventName
                        : "-"
                      : eventNameMr
                      ? eventNameMr
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {" "}
                    {this?.props?.language == "en"
                      ? "Media Name :"
                      : "तक्रार माध्यम :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? mediaName
                        ? mediaName
                        : "-"
                      : mediaNameMr
                      ? mediaNameMr
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department User:"
                      : "विभाग अधिकारी :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintDeptUser
                      : complaintDeptUser}
                  </td>
                </tr>
                {/** First Table End*/}

                <tr className={Styles.PageBreak}></tr>

                {/** second table header*/}

                <tr>
                  <td colSpan={5} className={Styles.Table2HEADER}>
                    {this?.props?.language == "en"
                      ? "Complaint Information"
                      : "तक्रार माहिती"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <tbody>
                {" "}
                <tr>
                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en" ? "Date" : "दिनांक"}
                  </th>
                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en" ? "User Name" : "कर्ता"}
                  </th>

                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en"
                      ? "Old Status"
                      : "जुनी स्थिती"}
                  </th>

                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en"
                      ? "New Status"
                      : "नविन स्थिती"}
                  </th>

                  <th colSpan={1} className={`${Styles.Table2Td}`}>
                    {this?.props?.language == "en" ? "Remark" : "शेरा"}
                  </th>
                </tr>
                {/** TableBody */}
                {reportComplaintDeatilsListDao &&
                  reportComplaintDeatilsListDao?.map((data, index) => (
                    <tr>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {moment(data?.date).format("DD-MM-YYYY") ==
                        "Invalid date"
                          ? " - "
                          : moment(data?.date).format("DD-MM-YYYY")}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.userName
                          : data?.userNameMr}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.oldCondition
                          : data?.oldConditionMr}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.newCondition
                          : data?.newConditionMr}
                      </td>
                      <td colSpan={1} className={`${Styles.Table2Td}`}>
                        {data?.remark == "null" || data?.remark == undefined
                          ? "-"
                          : data?.remark}
                      </td>
                    </tr>
                  ))}
                {/** second table end*/}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

class ComponentToPrintNew1 extends React.Component {
  render() {
    const {
      applicationNo,
      grivDate,
      complaineeName,
      complaineeNameMr,
      address,
      addressMr,
      complaintType,
      complaintTypeMr,
      complaintSubType,
      complaintSubTypeMr,
      complaintSubject,
      complaintSubjectMr,
      complaintDescription,
      complaintDescriptionMr,
      departmentName,
      departmentNameMr,
      complaintStatus,
      complaintStatusMr,
      eventName,
      eventNameMr,
      complaintDeptUser,
      mediaNameMr,
      mediaName,
      mobileNo,
      reportComplaintDeatilsListDao,
    } = this?.props?.dayWiseDataInDetails;

    const { language } = this?.props?.language;

    return (
      <>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table>
              <tbody>
                <tr>
                  <td colSpan={5} className={Styles.Table1HEADER}>
                    {this?.props?.language == "en"
                      ? "Complete Details of the Complaint"
                      : "तक्रारीची संपुर्ण माहिती"}
                  </td>
                </tr>

                {/** First Table*/}

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Token Number :"
                      : "टोकन क्र.:"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {applicationNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Date :"
                      : "तक्रार दिनांक :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {moment(grivDate).format("DD-MM-YYYY")}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complainee Name :"
                      : "तक्रारदाराचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaineeName
                      : complaineeNameMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Mobile No. :"
                      : "संर्पक तपशील :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {mobileNo}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Subject :" : " विषय :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintType
                      : complaintTypeMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Details :"
                      : " तक्रार तपशील :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintSubType
                        ? complaintSubType
                        : "-"
                      : complaintSubTypeMr
                      ? complaintSubTypeMr
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Description :"
                      : " तक्रारीचे वर्णन :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintDescription
                      : complaintDescriptionMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Place :"
                      : "तक्रार ठिकाण :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en" ? address : addressMr}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department Name :"
                      : "विभाग :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? departmentName
                      : departmentNameMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Complaint Status :"
                      : "स्थिती :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? this?.props?.dayWiseDataInDetails.reopenCount > 0 &&
                        this?.props?.dayWiseDataInDetails.complaintStatus ===
                          "Open"
                        ? "Reopen"
                        : complaintStatus
                      : this?.props?.dayWiseDataInDetails.reopenCount > 0 &&
                        this?.props?.dayWiseDataInDetails.complaintStatus ===
                          "Open"
                      ? "पुन्हा उघडले"
                      : complaintStatusMr}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Event :"
                      : "कार्यक्रमाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? eventName
                        ? eventName
                        : "-"
                      : eventNameMr
                      ? eventNameMr
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {" "}
                    {this?.props?.language == "en"
                      ? "Media Name :"
                      : "तक्रार माध्यम :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? mediaName
                        ? mediaName
                        : "-"
                      : mediaNameMr
                      ? mediaNameMr
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department User :"
                      : "विभाग अधिकारी :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en"
                      ? complaintDeptUser
                      : complaintDeptUser}
                  </td>
                </tr>
                {/** First Table End*/}

                <tr className={Styles.PageBreak}></tr>

                {/** second table header*/}

                <tr>
                  <td colSpan={5} className={Styles.Table2HEADER}>
                    {this?.props?.language == "en"
                      ? "Complaint Information"
                      : "तक्रार माहिती"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {/** second table headerEnd*/}
            {/** second table start*/}
            <table>
              <tbody>
                <tr>
                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en" ? "Date" : "दिनांक"}
                  </th>
                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en" ? "User Name" : "कर्ता"}
                  </th>

                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en"
                      ? "Old Status"
                      : "जुनी स्थिती"}
                  </th>

                  <th colSpan={1} className={`${Styles.TableComplaintInfo2Td}`}>
                    {this?.props?.language == "en"
                      ? "New Status"
                      : "नविन स्थिती"}
                  </th>

                  <th colSpan={1} className={`${Styles.Table2Td}`}>
                    {this?.props?.language == "en" ? "Remark" : "शेरा"}
                  </th>
                </tr>
                {/** TableBody */}

                {reportComplaintDeatilsListDao &&
                  reportComplaintDeatilsListDao?.map((data, index) => (
                    <tr>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {moment(data?.date).format("DD-MM-YYYY") ==
                        "Invalid date"
                          ? " - "
                          : moment(data?.date).format("DD-MM-YYYY")}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.userName
                          : data?.userNameMr}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.oldCondition
                          : data?.oldConditionMr}
                      </td>
                      <td
                        colSpan={1}
                        className={`${Styles.TableComplaintInfo2Td}`}
                      >
                        {this?.props?.language == "en"
                          ? data?.newCondition
                          : data?.newConditionMr}
                      </td>
                      <td colSpan={1} className={`${Styles.Table2Td}`}>
                        {data?.remark == "null" || data?.remark == undefined
                          ? "-"
                          : data?.remark}
                      </td>
                    </tr>
                  ))}
                {/** second table end*/}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
