import { Button, Stack } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import DownloadIcon from "@mui/icons-material/Download";
import Styles from "../MasterReport/Master.module.css";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";


const DayWiseInDetails = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en"
        ? "Complete details of complaint"
        : "तक्रारीची संपुर्ण माहिती",
  });
  const [dayWiseDataInDetails, setDayWiseDataInDetails] = useState([]);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [engDayWiseReportsData, setEngDayWiseReportsData] = useState([]);
  const [mrDayWiseReportsData, setMrDayWiseReportsData] = useState([]);

  // cancellButton
  const cancellButton = () => {
    setValue("dayWiseDataInDetails", null);
  };

  useEffect(() => {
    setDayWiseDataInDetails(watch("dayWiseDataInDetails"));
    let res = watch("dayWiseDataInDetails");
  }, [watch("dayWiseDataInDetails")]);

  // DayWiseDataInDetails
  useEffect(() => {
    setDataOnExcel();
  }, [dayWiseDataInDetails]);

  const setDataOnExcel = () => {
    let res = dayWiseDataInDetails;
    console.log("res", res);
    let _enData = {
      "Token Number :": res?.applicationNo,
      "Complaint Date :": moment(res.grivDate)?.format("DD-MM-YYYY"),
      "Complainee Name :": res?.complaineeName,
      "Mobile No. :": res?.mobileNo,
      "Subject :": res?.complaintType,
      "Complaint Details :": res?.complaintSubType,
      "Complaint Place :": res?.address,
      "Department Name :": res?.departmentName,
      "Complaint Status :":
        res?.reopenCount > 0 && res?.complaintStatus === "Open"
          ? "Reopen"
          : res?.complaintStatus,
      "Event Name :": !res?.data?.eventName ? "-" : res?.data?.eventName,
      "Department User :": res?.complaintDeptUser,
    };
    let _mrData = {
      "टोकन क्र. :": res?.applicationNo,
      "तक्रार दिनांक :": moment(res.grivDate)?.format("DD-MM-YYYY"),
      "तक्रारदाराचे नाव :": res?.complaineeNameMr,
      "संर्पक तपशील :": res?.mobileNo,
      "विषय :": res?.data?.complaintTypeMr,
      "तक्रार तपशील :": res?.data?.complaintSubTypeMr,
      "तक्रार ठिकाण :": res?.addressMr,
      "विभाग :": res?.departmentNameMr,
      "स्थिती :":
        res?.reopenCount > 0 && res?.complaintStatus === "Open"
          ? "पुन्हा उघडले"
          : res?.complaintStatusMr,
      "कार्यक्रमाचे नाव :": !res?.data?.eventNameMr
        ? "-"
        : res?.data?.eventNameMr,
      "विभाग अधिकारी :": res?.complaintDeptUser,
    };
    const responseData = res?.reportComplaintDeatilsListDao;
    const _enDayWiseData = responseData?.map((item) => ({
      Date: moment(item?.date).format("Do-MMM-YYYY"),
      "User Name": item?.userName,
      Remark:
        item?.remark == "null" || item?.remark == undefined
          ? "-"
          : item?.remark,
      "Old Status": item?.oldCondition,
      "New Status": item?.newCondition,
    }));

    const _mrDayWiseData = responseData?.map((item) => ({
      दिनांक: moment(item?.date).format("Do-MMM-YYYY"),
      "वापरकर्ता नाव": item?.userNameMr,
      शेरा:
        item?.remark == "null" || item?.remark == undefined
          ? "-"
          : item?.remark,
      "जुनी स्थिती": item?.oldConditionMr,
      "नवीन स्थिती": item?.newConditionMr,
    }));

    // Assuming you have functions to set state variables
    setEngDayWiseReportsData(_enDayWiseData);
    setMrDayWiseReportsData(_mrDayWiseData);
    setEngReportsData(_enData);
    setMrReportsData(_mrData);
  };

  function generateCSVFile(data, complaintData) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en"
        ? "Complete details of complaint report"
        : "तक्रारीची संपुर्ण माहिती अहवाल";

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
      language == "en"
        ? "Complete details of complaint"
        : "तक्रारीची संपुर्ण माहिती";
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

    // Map the table rows based on the selected language
    const tableRows = tableData.map((item) => [
      item[tableHeaders[0]], // Date
      item[tableHeaders[1]], // User Name
      item[tableHeaders[2]], // Remark
      item[tableHeaders[3]], // Old Condition
      item[tableHeaders[4]], // New Condition
    ]);

    // Add the first table's data to the existing sheet
    XLSX.utils.sheet_add_json(ws, rows, { skipHeader: true, origin: "C5" });

    // Add an empty row for separation
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: "C" + (rows.length + 8) });

    // Add the second table title in bold and centered
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

  // View
  return (
    <>
      {/** Header Name */}
      <hr className={Styles.DayWiseMoreDetailsHeaderName}></hr>

      {/** Buttons Start */}
      <Stack
        spacing={5}
        direction="row"
        style={{
          display: "flex",
          justifyContent: "right",
          marginRight: "50px",
          marginTop: "25px",
          marginBottom: "20px",
        }}
      >
        <Button
          type="button"
          size="small"
          variant="contained"
          color="success"
          endIcon={<DownloadIcon />}
          onClick={() =>
            language == "en"
              ? generateCSVFile(engReportsData, engDayWiseReportsData)
              : generateCSVFile(mrReportsData, mrDayWiseReportsData)
          }
        >
          {<FormattedLabel id="downloadEXCELL" />}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ float: "right" }}
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="back" />
        </Button>
      </Stack>
      {/** Buttons End */}
      {/** New Table Report  */}
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={5}
          componentRef={componentRef}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
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

      <div>
        <ComponentToPrintNew1
          dayWiseDataInDetails={dayWiseDataInDetails}
          language={language}
        />
      </div>
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
      complaintSubTypeMr,
      complaintSubType,
      departmentName,
      departmentNameMr,
      complaintStatus,
      complaintStatusMr,
      eventName,
      eventNameMr,
      complaintDeptUser,
      mobileNo,
      reportComplaintDeatilsListDao,
    } = this?.props?.dayWiseDataInDetails;


    return (
      <>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table>
              {/* className={Styles.table} */}
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
                      ? "Complaint Place :"
                      : "तक्रार ठिकाण :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en" ? address : addressMr}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {" "}
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
            <table>
              <tbody>
                {/** second table start*/}
                <tr Details of the Complaint>
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
                          : data?.userName}
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
      mobileNo,
      complaintSubTypeMr,
      complaintSubType,
      departmentName,
      departmentNameMr,
      complaintStatus,
      complaintStatusMr,
      eventName,
      eventNameMr,
      complaintDeptUser,
      reportComplaintDeatilsListDao,
    } = this?.props?.dayWiseDataInDetails;


    return (
      <>
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table>
              {/* className={Styles.table1} */}
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
                      ? "Complaint Place :"
                      : "तक्रार ठिकाण :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.language == "en" ? address : addressMr}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {" "}
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

                <tr className={Styles.PageBreak}></tr>

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
          {/** second table headerEnd*/}
          <div>
            <table>
              <tbody>
                {/** second table start*/}
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
                          : data?.userName}
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
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default DayWiseInDetails;
