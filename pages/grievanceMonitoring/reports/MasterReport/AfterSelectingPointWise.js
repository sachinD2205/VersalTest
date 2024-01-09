import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Styles from "../MasterReport/Master.module.css";
import PralabitStyle from "./AfterSelectPointwiseCategoryWise.module.css";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import moment from "moment";
import sweetalert from "sweetalert";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const AfterSelectingPointWise = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [GoshwaraTableData, setGoshwaraTableData] = useState([]);
  const [AuditedTableData, setAuditedTableData] = useState([]);
  const [SarathiAuditedTableData, setSarathiAuditedTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  const componentRef = useRef();
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

  // GoshwaraColumns
  const GoshwaraColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalGhoshwara",
      headerName:
        language == "en" ? "Total Received Complaints" : "एकूण प्राप्त तक्रारी",
      description:
        language == "en" ? "Total Received Complaints" : "एकूण प्राप्त तक्रारी",
      headerAlign: "center",
      align: "center",

      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "totalCloseGhoshwara",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Settled" : "निकाली",
      description: language == "en" ? "Settled" : "निकाली",
      // width: 120,
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "totalOpenGhoshwara",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Pending" : "प्रलंबित",
      description: language == "en" ? "Pending" : "प्रलंबित",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "percentage",
      align: "center",
      headerName:
        language == "en" ? "Completion Percentage" : "पूर्तता टक्केवारी",
      description:
        language == "en" ? "Completion Percentage" : "पूर्तता टक्केवारी",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  // AuditColumns
  const AuditColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "audited",
      headerName: language == "en" ? "Audited" : "ऑडिट केले",
      description: language == "en" ? "Audited" : "ऑडिट केले",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "satisfactory",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Satisfactory" : "समाधानकारक",
      description: language == "en" ? "Satisfactory" : "समाधानकारक",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "nonSatisfactory",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Not Satisfactory" : "असमाधानकारक",
      description: language == "en" ? "Not Satisfactory" : "असमाधानकारक",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "canNotAudited",
      align: "center",
      headerName: language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही",
      description: language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  // SarathiAuditColumns
  const SarathiAuditColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "audited",
      headerName: language == "en" ? "Audited" : "ऑडिट केले",
      description: language == "en" ? "Audited" : "ऑडिट केले",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "satisfactory",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Satisfactory" : "समाधानकारक",
      description: language == "en" ? "Satisfactory" : "समाधानकारक",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "nonSatisfactory",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Not Satisfactory" : "असमाधानकारक",
      description: language == "en" ? "Not Satisfactory" : "असमाधानकारक",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "canNotAudited",
      align: "center",
      headerName: language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही",
      description: language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  //cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lastCommissionorDate", null);
    // pointwise
    setValue("pointWise", null);
    // pralabit
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    // daywiseSelection
    setValue("DayWiseSelectionData", null);
    // dayWiseSelectionInDetail
    setValue("dayWiseDataInDetails", null);
    // searchButtons
    setValue("searchButtonInputState", true);
    // Audited
    setValue("AuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
    // SarathiAudited
    setValue("SarathiAuditData", null);
    setValue("ClickFiledNameEn", "");
    setValue("ClickFiledNameMr", "");
  };

  // handleCellClickGoshwara
  const handleCellClickGoshwara = (params) => {
    if (params?.field == "totalOpenGhoshwara") {
      setValue("loadderState", true);
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DD");
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DD");
        let lastCommissionorDate =
        moment(watch("lastCommissionorDate")).format("YYYY-MM-DD");
      let finalBodyForGoshwara = {
        crrfromDate: sendFromDate,
        crrtoDate: sendToDate,
        crrlastCommissionorDate:lastCommissionorDate,
      };

      let url;
      let url1;

      // url = `${urls.GM}/report/getCommissionorReviewPralambitGhoshwara`;
      url = `${urls.GM}/report/getCommissionorReviewPralambitGhoshwaraV3`;
      url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;

      // GoshwaraInDetail
      axios
        .post(url, finalBodyForGoshwara, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data?.length != 0
            ) {
              console.log("PralabitData", res?.data);
              setValue("PralabitData", res?.data);
              setValue("loadderState", false);
            } else {
              sweetalert(
                language === "en" ? "Not Found !" : "सापडले नाही!",
                language === "en"
                  ? "Record Not Found!"
                  : "रेकॉर्ड सापडला नाही!",
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

      setValue("loadderState", true);

      // EscalationReport

      axios
        .post(url1, finalBodyForGoshwara, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data?.length != "0"
            ) {
              console.log("EscalationPralabitData", res?.data);
              setValue("EscalationPralabitData", res?.data);
              setValue("loadderState", false);
            } else {
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
    }
  };

  // handleCellClickAudit
  const handleCellClickAudit = (params) => {

      setValue("loadderState", true);
      // finalBodyForAudit
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let finalBodyForAudit = {
        fromDate: sendFromDate,
        toDate: sendToDate,
        department: watch("department"),
        splevent: watch("splevent"),
        lstSubDepartment: watch("lstSubDepartment"),
        lastCommissionorDate: watch("lastCommissionorDate"),
        isSatisfactory: params?.field == "satisfactory" ? true : false,
        isNonSatisfactory: params?.field == "nonSatisfactory" ? true : false,
        isCallNotDone: params?.field == "canNotAudited" ? true : false,
      };

      // url
      let url = `${urls.GM}/report/getInternalAuditList`;

      // api
      axios
        .post(url, finalBodyForAudit, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            console.log("Audit23223", res?.data);

            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data?.length != 0
            ) {
              setValue("AuditData", res?.data);
              // nameSet
              if (params?.field == "satisfactory") {
                setValue("ClickFiledNameEn", "Internal Audit Satisfactory");
                setValue("ClickFiledNameMr", "लेखापरीक्षण समाधानकारक");
              } else if (params?.field == "nonSatisfactory") {
                setValue("ClickFiledNameEn", "Not Satisfactory ");
                setValue("ClickFiledNameMr", "लेखापरीक्षण असमाधानकारक");
              } else if (params?.field == "canNotAudited") {
                setValue("ClickFiledNameEn", "Can not Audited");
                setValue("ClickFiledNameMr", "ऑडिट करता येत नाही");
              }
              // loadder
              setValue("loadderState", false);
            } else {
              sweetalert(
                language === "en" ? "Not Found !" : "सापडले नाही!",
                language === "en"
                  ? "Record Not Found!"
                  : "रेकॉर्ड सापडला नाही!",
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

  function generateCSVFile(data, AuditedTableData, SarathiAuditedTableData) {
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
      language == "en"
        ? "Ghoshwara Point Wise Report"
        : "गोषवारा पॉइंट निहाय अहवाल";

    const date =
      language == "en"
        ? `DATE: From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक: ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const fileName =
      language == "en"
        ? "Ghoshwara Point Wise Report"
        : "गोषवारा पॉइंट निहाय अहवाल";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtension = ".xlsx";

    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Add titles and headers for the first table
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
    const firstTableDate = [
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
        "Total Received Complaints",
        "settled",
        "Pending",
        "Completion Percentage",
      ];
    } else {
      firstTableData = data;
      firstTableHeaders = [
        "एकूण प्राप्त तक्रारी",
        "निकाली",
        "प्रलंबित",
        "पूर्तता टक्केवारी",
      ];
    }

    const firstTableHeaderRow = firstTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));
    const firstTableDataRow = firstTableData.map((item) => [
      { v: item.totalGhoshwara },
      { v: item.totalCloseGhoshwara },
      { v: item.totalOpenGhoshwara },
      { v: item.percentage },
    ]);

    XLSX.utils.sheet_add_aoa(ws, firstTableTitle, {
      origin: { r: 1, c: 2 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableSubtitle, {
      origin: { r: 2, c: 2 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableDate, {
      origin: { r: 3, c: 2 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: { r: 4, c: 1 } });

    XLSX.utils.sheet_add_aoa(ws, [firstTableHeaderRow], {
      origin: { r: 6, c: 1 },
      style: dataStyle,
    });

    const firstTableTitle1 = [
      [
        {
          v: language === "en" ? "Goshwara" : "गोषवारा",
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(ws, firstTableTitle1, { origin: { r: 5, c: 2 } });
    XLSX.utils.sheet_add_aoa(ws, firstTableDataRow, {
      origin: { r: 7, c: 1 },
    });

    // Add a separator row
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: { r: 8, c: 1 } });

    // Add title for the second table
    const secondTableTitle = [
      [
        {
          v: language === "en" ? "Internal Audit" : "अंतर्गत लेखापरीक्षा",
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(ws, secondTableTitle, { origin: { r: 9, c: 2 } });

    let secondTableData;
    let secondTableHeaders;

    if (language === "en") {
      secondTableData = AuditedTableData;
      secondTableHeaders = [
        "Audited",
        "Can Not Audited",
        "Not Satisfactory",
        "Satisfactory",
      ];
    } else {
      secondTableData = AuditedTableData;
      secondTableHeaders = [
        "ऑडिट केले",
        "ऑडिट करता येत नाही",
        "असमाधानकारक",
        "समाधानकारक",
      ];
    }

  

    const secondTableHeaderRow = secondTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));

    const secondTableDataRow = secondTableData.map((item) => [
      { v: item.audited },
      { v: item.canNotAudited },
      { v: item.nonSatisfactory },
      { v: item.satisfactory },
    ]);

    XLSX.utils.sheet_add_aoa(ws, [secondTableHeaderRow], {
      origin: { r: 10, c: 1 },
      style: dataStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, secondTableDataRow, {
      origin: { r: 11, c: 1 },
    });

    // Add a separator row
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: { r: 12, c: 1 } });

    // Add title for the third table
    const thirdTableTitle = [
      [
        {
          v: language === "en" ? "Sarathi Audit" : "सारथी लेखापरीक्षा",
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(ws, thirdTableTitle, { origin: { r: 13, c: 2 } });

    // Add headers and data for the third table
    let thirdTableData;
    let thirdTableHeaders;

    if (language === "en") {
      thirdTableData = SarathiAuditedTableData;
      thirdTableHeaders = [
        "Audited",
        "Can Not Audited",
        "Not Satisfactory",
        "Satisfactory",
      ];
    } else {
      thirdTableData = SarathiAuditedTableData;
      thirdTableHeaders = [
        "ऑडिट केले",
        "ऑडिट करता येत नाही",
        "असमाधानकारक",
        "समाधानकारक",
      ];
    }
    const thirdTableHeaderRow = thirdTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));

    const thirdTableDataRow = thirdTableData.map((item) => [
      { v: item.audited },
      { v: item.canNotAudited },
      { v: item.nonSatisfactory },
      { v: item.satisfactory },
    ]);

    XLSX.utils.sheet_add_aoa(ws, [thirdTableHeaderRow], {
      origin: { r: 14, c: 1 },
      style: dataStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, thirdTableDataRow, {
      origin: { r: 15, c: 1 },
    });

    // Convert the worksheet to Excel format and save
    const excelBuffer = XLSX.write(
      { Sheets: { [fileName]: ws }, SheetNames: [fileName] },
      { bookType: "xlsx", type: "array" }
    );
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
  }

  // handleCellClickSarathiAudit
  const handleCellClickSarathiAudit = (params) => {
      setValue("loadderState", true);
      // finalBodyForAudit
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let finalBodyForAudit = {
        fromDate: sendFromDate,
        toDate: sendToDate,
        department: watch("department"),
        splevent: watch("splevent"),
        lstSubDepartment: watch("lstSubDepartment"),
        lastCommissionorDate: watch("lastCommissionorDate"),
        isSatisfactory: params?.field == "satisfactory" ? true : false,
        isNonSatisfactory: params?.field == "nonSatisfactory" ? true : false,
        isCallNotDone: params?.field == "canNotAudited" ? true : false,
      };

      // url
      let url = `${urls.GM}/report/getSarthiAuditList`;

      // api
      axios
        .post(url, finalBodyForAudit, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            console.log("Audit23223", res?.data);
            if (res?.data.length > 0) {
              setValue("SarathiAuditData", res?.data);
              // nameSet
              if (params?.field == "satisfactory") {
                setValue("ClickFiledNameEn", "Sarathi Audit Satisfactory");
                setValue("ClickFiledNameMr", "सारथी ऑडिट समाधानकारक");
              } else if (params?.field == "nonSatisfactory") {
                setValue("ClickFiledNameEn", "Not Satisfactory ");
                setValue("ClickFiledNameMr", "लेखापरीक्षण असमाधानकारक");
              } else if (params?.field == "canNotAudited") {
                setValue("ClickFiledNameEn", "Can not Audited");
                setValue("ClickFiledNameMr", "ऑडिट करता येत नाही");
              }
              // loadder
              setValue("loadderState", false);
            } else {
              sweetalert(
                language === "en" ? "Not Found !" : "सापडले नाही!",
                language === "en"
                  ? "Record Not Found!"
                  : "रेकॉर्ड सापडले नाही!",
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

  // printTableFunction
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en"
        ? "Goshwara Point Wise Report"
        : "गोषवारा पॉइंट वाईज अहवाल",
  });



  useEffect(() => {
    let pointWiseData = watch("pointWise");

    // ghoshwara
    if (
      pointWiseData?.ghoshwara != null &&
      pointWiseData?.ghoshwara.length != "0" &&
      pointWiseData?.ghoshwara != undefined
    ) {
      // added srNo in array objects
      let withSrNoGoshwaraTableData = pointWiseData?.ghoshwara?.map(
        (data, index) => {
          return {
            srNo: index + 1,
            ...data,
            percentage: data?.percentage != "NaN" ? data?.percentage : "-",
          };
        }
      );
      setGoshwaraTableData(withSrNoGoshwaraTableData);
    }

    // audited
    if (
      pointWiseData?.audited != null &&
      pointWiseData?.audited.length != "0" &&
      pointWiseData?.audited != undefined
    ) {
      // added srNo in array objects
      let withSrNoAuditedTableData = pointWiseData?.audited?.map(
        (data, index) => {
          return {
            srNo: index + 1,
            ...data,
          };
        }
      );
      setAuditedTableData(withSrNoAuditedTableData);
    }

    // sarthiAudited
    if (
      pointWiseData?.sarthiAudited != null &&
      pointWiseData?.sarthiAudited.length != "0" &&
      pointWiseData?.sarthiAudited != undefined
    ) {
      // added srNo in array objects
      let withSrNoSarathiAuditedTableData = pointWiseData?.sarthiAudited?.map(
        (data, index) => {
          return {
            srNo: index + 1,
            ...data,
          };
        }
      );
      setSarathiAuditedTableData(withSrNoSarathiAuditedTableData);
    }
  }, [watch("pointWise")]);



  // View
  return (
    <>
      {/** Buttons  */}
      <hr className={Styles.hrPoitWise}></hr>
      <Stack
        direction={{ xs: "column", sm: "row", md: "row", lg: "row", xl: "row" }}
        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
        justifyContent="right"
        alignItems="center"
        marginTop="5"
        marginRight="2vw"
      >
        <Button
          type="button"
          variant="contained"
          size="small"
          color="success"
          endIcon={<DownloadIcon />}
          onClick={() =>
            language == "en"
              ? generateCSVFile(
                  GoshwaraTableData,
                  AuditedTableData,
                  SarathiAuditedTableData
                )
              : generateCSVFile(
                  GoshwaraTableData,
                  AuditedTableData,
                  SarathiAuditedTableData
                )
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

      {/** Ghoshwara Start */}
      <div className={Styles.GoshwaraName}>
        {" "}
        {language == "en" ? "Goshwara" : "गोषवारा"}{" "}
      </div>
      <DataGrid
        componentsProps={{
          toolbar: {
            showQuickFilter: false,
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
            cursor:'pointer'
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          GoshwaraTableData != undefined && GoshwaraTableData != null
            ? GoshwaraTableData
            : []
        }
        columns={GoshwaraColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellClick={handleCellClickGoshwara}
      />
      {/** Ghoshwara End */}

      {/** Audit Start */}
      <div className={Styles.GoshwaraName}>
        {language == "en" ? "Internal Audit" : "अंतर्गत लेखापरीक्षण"}
      </div>
      <DataGrid
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
            printOptions: { disableToolbarButton: true },
            disableExport: false,
            disableToolbarButton: true,
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
            cursor:"pointer"
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
        columns={AuditColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onCellClick={handleCellClickAudit}
      />
      {/** Audit End */}

      {/** Sarathi Audit Start */}
      <div className={Styles.GoshwaraName}>
        {language == "en" ? "Sarathi Audit" : "सारथी लेखापरीक्षण"}
      </div>
      <DataGrid
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 100 },
            printOptions: { disableToolbarButton: true },
            disableExport: false,
            disableToolbarButton: true,
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
            cursor:'pointer'
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          SarathiAuditedTableData != undefined &&
          SarathiAuditedTableData != null
            ? SarathiAuditedTableData
            : []
        }
        columns={SarathiAuditColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={handlePageSizeChange}
        onCellClick={handleCellClickSarathiAudit}
      />
      {/** Sarathi Audit End */}

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
            en: "Goshwara",
            mr: "गोषवारा",
          }}
        >
          <ComponentToPrintNew
            language={language}
            GoshwaraTableData={GoshwaraTableData}
            AuditedTableData={AuditedTableData}
            SarathiAuditedTableData={SarathiAuditedTableData}
          />
        </ReportLayout>
      </div>
    </>
  );
};

// componentToPrintNew
class ComponentToPrintNew extends React.Component {
  render() {
    let language = this?.props?.language;
    let GoshwaraTableData = this?.props?.GoshwaraTableData;
    let AuditedTableData = this?.props?.AuditedTableData;
    let SarathiAuditedTableData = this?.props?.SarathiAuditedTableData;

    // view
    return (
      <>
        <table className={PralabitStyle.table}>
          <tbody>
            {/** GoshwaraTable */}
            <tr>
              <td className={PralabitStyle.Table1Header} colSpan={5}>
                {language == "en" ? "Goshwara" : "गोषवारा"}
              </td>
            </tr>
            <tr>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Total Received Complaints"
                  : "एकूण प्राप्त तक्रारी"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Settled" : "निकाली"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Pending" : "प्रलंबित"}
              </td>

              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Completion Percentage"
                  : "पूर्तता टक्केवारी"}
              </td>
            </tr>

            {GoshwaraTableData &&
              GoshwaraTableData?.map((data, index) => (
                <tr>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.totalGhoshwara
                      : data?.totalGhoshwara}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.totalCloseGhoshwara
                      : data?.totalCloseGhoshwara}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.totalOpenGhoshwara
                      : data?.totalOpenGhoshwara}
                  </td>

                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.percentage !== "NaN"
                      ? language == "en"
                        ? data?.percentage
                        : data?.percentage
                      : "-"}
                  </td>
                </tr>
              ))}

            {/** AuditTable */}
            <tr>
              <td className={PralabitStyle.Table1Header} colSpan={5}>
                {language == "en" ? "Internal Audit" : "अंतर्गत लेखापरीक्षा"}
              </td>
            </tr>
            <tr>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Audited" : "ऑडिट केले"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Satisfactory" : "समाधानकारक"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Not Satisfactory" : "असमाधानकारक"}
              </td>

              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही"}
              </td>
            </tr>

            {AuditedTableData &&
              AuditedTableData?.map((data, index) => (
                <tr>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.audited : data?.audited}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.satisfactory : data?.satisfactory}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.nonSatisfactory
                      : data?.nonSatisfactory}
                  </td>

                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.canNotAudited !== "NaN"
                      ? language == "en"
                        ? data?.canNotAudited
                        : data?.canNotAudited
                      : "-"}
                  </td>
                </tr>
              ))}

            {/** SarathiAuditTable */}
            <tr>
              <td className={PralabitStyle.Table1Header} colSpan={5}>
                {language == "en" ? "Sarathi Audit" : "सारथी ऑडिट"}
              </td>
            </tr>
            <tr>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Audited" : "ऑडिट केले"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Satisfactory" : "समाधानकारक"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Not Satisfactory" : "असमाधानकारक"}
              </td>

              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Can Not Audited" : "ऑडिट करता येत नाही"}
              </td>
            </tr>

            {SarathiAuditedTableData &&
              SarathiAuditedTableData?.map((data, index) => (
                <tr>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.audited : data?.audited}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.satisfactory : data?.satisfactory}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.nonSatisfactory
                      : data?.nonSatisfactory}
                  </td>

                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.canNotAudited !== "NaN"
                      ? language == "en"
                        ? data?.canNotAudited
                        : data?.canNotAudited
                      : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default AfterSelectingPointWise;
