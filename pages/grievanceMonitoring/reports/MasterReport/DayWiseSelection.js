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
import moment from "moment";
import Styles from "../MasterReport/Master.module.css";
import DayWiseDataCSS from "./DayWiseData.module.css";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const DayWiseSelection = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const componentRef = useRef();
  const user = useSelector((state) => state?.user?.user);
  const [DayWiseSelectionTableData, setDayWiseSelectionTableData] = useState([]);
  const [engDayWiseTableData, setEngDayWiseTableData] = useState([]);
  const [mrDayWiseTableData, setMrDayWiseTableData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
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
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  // handlePrint
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language == "en" ? watch("DayValueEn") : watch("DayValueMr")
  });

  // DayWiseSelectionTableColumns
  const DayWiseSelectionTableColumns = [
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
      field: language == "en" ? "address" : "addressMr",
      align: "left",
      headerName: language == "en" ? "Address" : "पत्ता",
      description: language == "en" ? "Address" : "पत्ता",
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
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
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
                handleRowClickDaywiseDetails(record?.row);
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
      language == "en" ? watch("DayValueEn") : watch("DayValueMr");

    const fileName =
      language == "en" ? watch("DayValueEn").substring(0, 30) : watch("DayValueMr").substring(0, 30);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtension = ".xlsx";
    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
          "Do-MMM-YYYY"
        )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
          "Do-MMM-YYYY"
        )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;
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
      { v: item.NameOfCitizen || item.NameOfCitizenMr },
      { v: item.address || item.addressMr },
      { v: item.emailId },
      { v: item.subject || item.subjectMr },
      { v: item.hodName || item.departmentMr },
      { v: item.closeDate },
    ]);

    XLSX.utils.sheet_add_aoa(ws, firstTableTitle, {
      origin: { r: 1, c: 6 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableSubtitle, {
      origin: { r: 2, c: 6 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, fromDateToDate, {
      origin: { r: 3, c: 6 },
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

  // handleRowClickDaywiseDetails
  const handleRowClickDaywiseDetails = (params) => {
    setValue("loadderState", true);

    let body = {
      applicationNo: params?.tokenNo,
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
          console.log(`dayWiseDataInDetails`, res?.data);
          setValue("dayWiseDataInDetails", res?.data);
          setValue("loadderState", false);
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
    setValue("DayWiseSelectionData", null);
    setValue("dayWiseDataInDetails", null);
  };


  useEffect(() => {
    let DayWiseData = watch("DayWiseSelectionData");
    if (
      DayWiseData != null &&
      DayWiseData.length != "0" &&
      DayWiseData != undefined
    ) {
      // added srNo in array objects
      let withSrDaywiseData = DayWiseData?.map((data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      });

      setDayWiseSelectionTableData(withSrDaywiseData);

      const _enDayWiseData = DayWiseData.map((item) => ({
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

      const _mrDayWiseData = DayWiseData.map((item) => ({
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
      setEngDayWiseTableData(_enDayWiseData);
      setMrDayWiseTableData(_mrDayWiseData);
    }else{
      setDayWiseSelectionTableData([])
      setEngDayWiseTableData([]);
      setMrDayWiseTableData([]);
    }
  }, [watch("DayWiseSelectionData")]);


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
              ? generateCSVFile(engDayWiseTableData)
              : generateCSVFile(mrDayWiseTableData)
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
        {language == "en" ? watch("DayValueEn") : watch("DayValueMr")}
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
          DayWiseSelectionTableData != undefined &&
            DayWiseSelectionTableData != null
            ? DayWiseSelectionTableData
            : []
        }
        columns={DayWiseSelectionTableColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={handlePageSizeChange}
        components={
          {
          }
        }
        title="Goshwara"
      />

      {/** Table Start */}
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={8}
          componentRef={componentRef}
          showDates
          date={{ from: moment(watch("fromDate")).format("DD-MM-YYYY"), to: moment(watch("toDate")).format("DD-MM-YYYY") }}
          deptName={{
            en: "Grievance Monitoring System",
            mr: "तक्रार निवारण प्रणाली",
          }}
          reportName={{
            en: "Day Wise Data",
            mr: "Day Wise Data",
          }}
        >
          <ComponentToPrintNew
            language={language}
            DayWiseSelectionTableData={DayWiseSelectionTableData}
            DayValueEn={watch("DayValueEn")}
            DayValueMr={watch("DayValueMr")}
          />
        </ReportLayout>
      </div>
    </>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
    let language = this?.props?.language;
    let DayWiseSelectionTableData = this?.props?.DayWiseSelectionTableData;

    // view
    return (
      <>
        <table className={DayWiseDataCSS.table}>
          <tbody>
            <tr>
              <td className={DayWiseDataCSS.Table1Header} colSpan={8}>
                {language == "en"
                  ? this.props.DayValueEn : this.props.DayValueMr
                }
              </td>
            </tr>
            <tr>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Department Name" : "विभाग"}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Token Number" : "टोकन क्रमांक"}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Complainant's Name" : "तक्रारदाराचे नाव"}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Address" : "पत्ता"}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Subject" : "विषय"}
              </td>
              <td
                className={`${DayWiseDataCSS.TableTd} ${DayWiseDataCSS.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Head Of Department Name"
                  : "विभाग प्रमुखाचे नाव"}
              </td>
            </tr>
            {DayWiseSelectionTableData &&
              DayWiseSelectionTableData.map((data, index) => (
                <tr>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.department : data?.departmentMr}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.tokenNo : data?.tokenNo}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.NameOfCitizen
                      : data?.NameOfCitizen}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.address : data?.addressMr}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.subject : data?.subjectMr}
                  </td>
                  <td className={DayWiseDataCSS.TableTd} colSpan={1}>
                    {language == "en" ? data?.hodName : data?.hodNameMr}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default DayWiseSelection;
