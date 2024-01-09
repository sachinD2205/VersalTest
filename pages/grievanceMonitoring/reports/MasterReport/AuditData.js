import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { Button, IconButton, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import Styles from "../MasterReport/Master.module.css";
import AuditDataCSS from "./AuditData.module.css";
import sweetalert from "sweetalert";
import moment from "moment";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const AuditData = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const componentRef = useRef();
  const user = useSelector((state) => state?.user?.user);
  const [AuditedTableData, setAuditedTableData] = useState([]);
  const [engAuditedTableData, setEngAuditedTableData] = useState([]);
  const [mrAuditedTableData, setMrAuditedTableData] = useState([]);
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
  // handlePrint
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? watch("ClickFiledNameEn") : watch("ClickFiledNameMr"),
  });

  const [pageSize, setPageSize] = useState(10);
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // AuditDataDayTableColumns
  const AuditDataDayTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
     flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "department" : "departmentMr",
      headerName: language == "en" ? "Department Name" : "विभाग",
      description: language == "en" ? "Department Name" : "विभाग",
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: language == "en" ? "grivDate" : "grivDate",
      headerName: language == "en" ? "Grievance Date" : "तक्रार तारीख",
      description: language == "en" ? "Grievance Date" : "तक्रार तारीख",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "tokenNo",
      align: "center",
      headerName: language == "en" ? "Token Number" : "टोकन क्रमांक",
      description: language == "en" ? "Token Number" : "टोकन क्रमांक",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: language == "en" ? "NameOfCitizen" : "NameOfCitizenMr",
      headerAlign: "center",
      align: "left",
      headerName: language == "en" ? "Complainant's Name" : "तक्रारदाराचे नाव",
      description: language == "en" ? "Complainant's Name" : "तक्रारदाराचे नाव",
      flex: 1,
    },
    {
      field: language == "en" ? "emailId" : "emailId",
      align: "left",
      headerName: language == "en" ? "Email id" : "ई - मेल आयडी",
      description: language == "en" ? "Email id" : "ई - मेल आयडी",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: language == "en" ? "subject" : "subjectMr",
      align: "left",
      headerName: language == "en" ? "Subject" : "विषय",
      description: language == "en" ? "Subject" : "विषय",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: language == "en" ? "hodName" : "hodNameMr",
      align: "left",
      headerName:
        language == "en" ? "Head Of Department Name" : "विभाग प्रमुखाचे नाव",
      description:
        language == "en" ? "Head Of Department Name" : "विभाग प्रमुखाचे नाव",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: language == "en" ? "closeDate" : "closeDate",
      align: "center",
      headerName:
        language == "en" ? "Grievance Close Date" : "तक्रार बंद तारीख",
      description:
        language == "en" ? "Grievance Close Date" : "तक्रार बंद तारीख",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "left",
      flex: 2,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        console.log("DayWiseDataSelectedRow", record?.row);
        return (
          <>
            <IconButton
              onClick={() => {
                console.log("bhaispadalakatokennumber", record?.row);
                handleRowClickAuditDayWiseDetails(record?.row?.tokenNo);
              }}
            >
              <Button variant="contained" size="small">
               <FormattedLabel id='moreDetails'/>
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];


  function generateCSVFile(data) {

    const boldFont = { bold: true };
    const fontSize = 16;
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
      alignment: { horizontal: "center", vertical: "center" },
    };
    const dataStyle = {
      font: { ...boldFont, size: fontSize },
    };

    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? watch("ClickFiledNameEn") : watch("ClickFiledNameMr");
    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;
    const fileName =
      language == "en" ? watch("ClickFiledNameEn") : watch("ClickFiledNameMr");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtension = ".xlsx";

    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    const firstTableTitle = [
      [
        {
          v: engHeading,
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    const firstTableSubtitle = [
      [
        {
          v: reportName,
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    const fromDateToDate = [
      [
        {
          v: date,
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];

    let firstTableData;
    let firstTableHeaders;
    if (language === "en") {
      firstTableData = data;
      firstTableHeaders = [
        "Department Name",
        "Grievance Date",
        "Token Number",
        "Complainant's Name",
        "Address",
        "Email id",
        "Subject",
        "Head Of Department Name",
        "Grievance Close Date",
      ];
    } else {
      firstTableData = data;
      firstTableHeaders = [
        "विभाग",
        "तक्रार तारीख",
        "टोकन क्रमांक",
        "तक्रारदाराचे नाव",
        "पत्ता",
        "ई - मेल आयडी",
        "विषय",
        "विभाग प्रमुखाचे नाव",
        "तक्रार बंद तारीख",
      ];
    }
    const firstTableHeaderRow = firstTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));

    const firstTableDataRow = firstTableData.map((item) => [
      { v: item.department || item.departmentMr },
      { v: item.grivDate },
      { v: item.tokenNo },
      { v: item.NameOfCitizen || item.departmentMr },
      { v: item.address || item.addressMr },
      { v: item.emailId },
      { v: item.subject || item.subjectMr },
      { v: item.hodName || item.departmentMr },
      { v: item.closeDate },
    ]);

    XLSX.utils.sheet_add_aoa(ws, firstTableTitle, {
      origin: { r: 1, c: 5 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableSubtitle, {
      origin: { r: 2, c: 5 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, fromDateToDate, {
      origin: { r: 3, c: 5 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, [firstTableHeaderRow], {
      origin: { r: 5, c: 1 },
      style: dataStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableDataRow, {
      origin: { r: 6, c: 1 },
    });

    // Convert the worksheet to Excel format and save
    const excelBuffer = XLSX.write(
      { Sheets: { [fileName]: ws }, SheetNames: [fileName] },
      { bookType: "xlsx", type: "array" }
    );
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
  }

  // handleRowClickAuditDayWiseDetails
  const handleRowClickAuditDayWiseDetails = (tokenNo) => {
    setValue("dayWiseDataInDetails", []);
    setValue("loadderState", true);
    let body = {
      applicationNo: tokenNo,
    };
    let url = `${urls.GM}/report/getReportComplainDetails`;
    // DayWiseMoreDetails
    axios
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (res?.data.applicationNo != undefined) {
            console.log(`dayWiseDataInDetails`, res?.data);
            setValue("dayWiseDataInDetails", res?.data);
            setValue("loadderState", false);
          } else {
            sweetalert(
              language === "en" ? "Not Found !" : "सापडले नाही!",
              language === "en" ? "Record Not Found!" : "रेकॉर्ड सापडले नाही!",
              "warning"
            );
            setValue("loadderState", false);
          }
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        cfcErrorCatchMethod(error,false);
      });
  };

  // cancellButton
  const cancellButton = () => {
    // daywiseSelection
    setValue("AuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // dayWiseSelectionInDetail
    setValue("dayWiseDataInDetails", null);
  };

  // useEffects ===============>

  useEffect(() => {
    let AuditData = watch("AuditData");
    if (
      AuditData != null &&
      AuditData.length != "0" &&
      AuditData != undefined
    ) {
      // added srNo in array objects
      let withSrNoAuditData = AuditData?.map((data, index) => {
        return {
          srNo: index + 1,
          ...data,
          grivDate: moment(data?.grivDate).format("DD-MM-YYYY"),
          closeDate: moment(data?.closeDate).format("DD-MM-YYYY"),
        };
      });

      setAuditedTableData(withSrNoAuditData);

      const _enAuditD = AuditData.map((item) => ({
        NameOfCitizen: item.NameOfCitizen,
        address: item.address,
        closeDate: moment(item.closeDate).format("Do-MMM-YYYY"),
        department: item.department,
        emailId: item.emailId,
        grivDate: moment(item.grivDate).format("Do-MMM-YYYY"),
        hodName: item.hodName,
        subject: item.subject,
        tokenNo: item.tokenNo,
      }));

      const _mrAuditD = AuditData.map((item) => ({
        NameOfCitizenMr: item.NameOfCitizenMr,
        addressMr: item.addressMr,
        departmentMr: item.departmentMr,
        emailId: item.emailId,
        closeDate: moment(item.closeDate).format("Do-MMM-YYYY"),
        grivDate: moment(item.grivDate).format("Do-MMM-YYYY"),
        hodNameMr: item.hodNameMr,
        subjectMr: item.subjectMr,
        tokenNo: item.tokenNo,
      }));
      setEngAuditedTableData(_enAuditD);
      setMrAuditedTableData(_mrAuditD);
    }
  }, [watch("AuditData")]);



  // View
  return (
    <>
      {/** Header Name */}
      <hr className={Styles.DayWiseHeaderName}></hr>

      {/** Button End */}
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="right"
        alignItems="center"
        marginTop="5"
        marginRight="2vw"
        marginBottom="5vh"
      >
        <Button
          type="button"
          variant="contained"
          color="success"
          size="small"
          endIcon={<DownloadIcon />}
          onClick={() =>
            language == "en"
              ? generateCSVFile(engAuditedTableData)
              : generateCSVFile(mrAuditedTableData)
          }
        >
          {<FormattedLabel id="downloadEXCELL" />}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<PrintIcon />}
          onClick={() => handlePrint()}
        >
          <FormattedLabel id="print" />
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="back" />
        </Button>
      </Stack>
      {/** Buttons End */}

      {/** Pralabit Goshwara Start  */}
      <div className={Styles.GoshwaraPralabitHeaderName}>
        {language == "en"
          ? watch("ClickFiledNameEn")
          : watch("ClickFiledNameMr")}
      </div>

      <DataGrid
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
            printOptions: { disableToolbarButton: true },
            disableExport: false,
            disableToolbarButton: false,
            csvOptions: { disableToolbarButton: true },
          },
        }}
        sx={{
          backgroundColor: "white",
          m: 2,
          overflowY: "scroll",
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#556CD6",
            color: "white",
          },
          "& .MuiDataGrid-cell:hover": {
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            textOverflow: "unset !important",
            whiteSpace: "break-spaces !important",
            lineHeight: "1.2 !important",
          },
          "& .MuiDataGrid-cellContent": {
            textOverflow: "unset !important",
            whiteSpace: "break-spaces !important",
            lineHeight: "1 !important",
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          AuditedTableData != undefined && AuditedTableData != null
            ? AuditedTableData
            : []
        }
        columns={AuditDataDayTableColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        components={
          {
          }
        }
      />

      {/** Table Start */}
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={9}
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
            en: watch("ClickFiledNameEn"),
            mr: watch("ClickFiledNameMr"),
          }}
        >
          <ComponentToPrintNew
            language={language}
            AuditedTableData={AuditedTableData}
            ReportNameEnglish={watch("ClickFiledNameEn")}
            ReportNameMarathi={watch("ClickFiledNameMr")}
          />
        </ReportLayout>
      </div>
    </>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
    let language = this?.props?.language;
    let AuditedTableData = this?.props?.AuditedTableData;
    let ReportNameMarathi = this?.props?.ReportNameMarathi;
    let ReportNameEnglish = this?.props?.ReportNameEnglish;

    // view
    return (
      <>
        <table className={AuditDataCSS.table}>
          <tbody>
            <tr>
              <td className={AuditDataCSS.Table1Header} colSpan={9}>
                {language == "en" ? ReportNameEnglish : ReportNameMarathi}
              </td>
            </tr>
            <tr>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Department Name" : "विभाग"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Grievance Date" : "तक्रार तारीख"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Token Number" : "टोकन क्रमांक"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Complainant's Name" : "तक्रारदाराचे नाव"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Email id " : "ई - मेल आयडी"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Subject" : "विषय"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Head Of Department Name"
                  : "विभाग प्रमुखाचे नाव"}
              </td>
              <td
                className={`${AuditDataCSS.TableTd} ${AuditDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Grievance Close Date" : "तक्रार बंद तारीख"}
              </td>
            </tr>
            {AuditedTableData &&
              AuditedTableData.map((data, index) => (
                <tr>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.department : data?.departmentMr}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.grivDate : data?.grivDate}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.tokenNo : data?.tokenNo}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.NameOfCitizen
                      : data?.NameOfCitizenMr}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.emailId : data?.emailId}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.subject : data?.subjectMr}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.hodName : data?.hodNameMr}
                  </td>
                  <td className={AuditDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.closeDate : data?.closeDate}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default AuditData;
