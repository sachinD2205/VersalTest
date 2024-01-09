import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import Styles from "../MasterReport/Master.module.css";
import PralabitModuleStyle from "./Pralabit.module.css";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const PralabitDetails = () => {
  const {
    control,setValue,watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [PralabitTableData, setPralabitTableData] = useState();
  const [PralabitDataTotal, setPralabitDataTotal] = useState({});
  const [EscalationTableData, setEscalationTableData] = useState();
  const [EscalationDataTotal, setEscalationDataTotal] = useState({});
  const [engPralabitDataTotal, setEngPralabitTableData] = useState([]);
  const [mrPralabitDataTotal, setMrPralabitTableData] = useState([]);
  const [engEscalationDataTotal, setEngEscalationTableData] = useState([]);
  const [mrEscalationDataTotal, setMrEscalationTableData] = useState([]);
  const user = useSelector((state) => state?.user?.user);
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

  // GoshwaraPralabitTableColumns
  const PralabitTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      flex:0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "department" : "departmentMr",
      headerName: language == "en" ? "Department Name" : "विभाग",
      description: language == "en" ? "Department Name" : "विभाग",
      flex: 3,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field: "oneToSeven",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "1 to 7 Days" : "1 ते 7 दिवस",
      description: language == "en" ? "1 to 7 Days" : "1 ते 7 दिवस",
      flex: 0.9,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "sevenToFifteen",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "8 to 15 Days" : "8 ते 15 दिवस",
      description: language == "en" ? "8 to 15 Days" : "8 ते 15 दिवस",
      flex:1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "fifteenToTweentyOne",
      align: "center",
      headerName: language == "en" ? "16 to 21 Days" : "16 ते 21 दिवस",
      description: language == "en" ? "16 to 21 Days" : "16 ते 21 दिवस",
      headerAlign: "center",
      backgroundColor: "#008000",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          backgroundColor: "#008000",
          color: "white",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "tweentyOneThirty",
      align: "center",
      headerName: language == "en" ? "22 to 30 Days" : "22 ते 30 दिवस",
      description: language == "en" ? "22 to 30 Days" : "22 ते 30 दिवस",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          backgroundColor: "yellow",
          width: "200px",
          color: "black",
          fontWeight: "800",
          textAlign: "center",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "greaterThanThirty",
      align: "center",
      headerName:
        language == "en" ? "More than 30 days" : "30 दिवसांपेक्षा जास्त",
      description:
        language == "en" ? "More than 30 days" : "30 दिवसांपेक्षा जास्त",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          backgroundColor: "red",
          width: "200px",
          color: "white",
          fontWeight: "800",
          textAlign: "center",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "totalPending",
      align: "center",
      headerName:
        language == "en"
          ? "Total Pending ( A-B+C-D)"
          : "एकूण प्रलंबित ( A-B+C-D)",
      description:
        language == "en"
          ? "Total Pending ( A-B+C-D)"
          : "एकूण प्रलंबित ( A-B+C-D)",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "magilBaitakitilPralambit",
      align: "center",
      headerName:
        language == "en"
          ? "Grievances pending from previous meeting (A)"
          : "मागील बैठकीतील प्रलंबित तक्रारी (अ)",
      description:
        language == "en"
          ? "Grievances pending from previous meeting (A)"
          : "मागील बैठकीतील प्रलंबित तक्रारी (अ)",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "magilBaitakitilNikaliTakari",
      align: "center",
      headerName:
        language == "en"
          ? "Grievances outstanding from previous meeting (B)"
          : "मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी (ब)",
      description:
        language == "en"
          ? "Grievances outstanding from previous meeting (B)"
          : "मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी (ब)",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "baithakinaterAlelaTakrari",
      align: "center",
      headerName:
        language == "en"
          ? "Fresh complaints received after the meeting (C)"
          : "बैठकी नंतर नवीन आलेल्या तक्रारी (क)",
      description:
        language == "en"
          ? "Fresh complaints received after the meeting (C)"
          : "बैठकी नंतर नवीन आलेल्या तक्रारी (क)",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "baithakinaterNikaliTakari",
      align: "center",
      headerName:
        language == "en"
          ? "Disposed of new complaints (D)"
          : "नवीन तक्रारींपैकी निकाली काढलेल्या तक्रारी (ड)",
      description:
        language == "en"
          ? "Disposed of new complaints (D)"
          : "नवीन तक्रारी पैकी निकाली काढलेल्या तक्रारी (ड)",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },

    {
      field: "admc",
      align: "center",
      headerName:
        language == "en"
          ? " Additional Commissioner Exclated Complaints"
          : " Additional Commissioner Exclated Complaints",
      description:
        language == "en"
          ? " Additional Commissioner Exclated Complaints"
          : " Additional Commissioner Exclated Complaints",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  // EscalationTableColumns
  const EscalationTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
      fontWeight: "800",
    },
    {
      field: language === "en" ? "ayukta" : "ayukta",
      headerName:
        language == "en" ? "Additional Commisioner" : "अतिरिक्त आयुक्त",
      description:
        language == "en" ? "Additional Commisioner" : "अतिरिक्त आयुक्त",
      headerAlign: "center",
      align: "left",
      fontWeight: "800",
      flex: 1,
    },
    {
      field: language === "en" ? "ayuktaDesignation" : "ayuktaDesignation",
      headerName:
        language == "en" ? "Designation" : "पदनाम",
      description:
        language == "en" ? "Designation" : "पदनाम",
      headerAlign: "center",
      align: "left",
      fontWeight: "800",
      flex: 1,
    },
    {
      field: "totalCount",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Total Complaints" : "एकूण तक्रारी",
      description: language == "en" ? "Total Complaints" : "एकूण तक्रारी",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },

    {
      field: "totalClose",
      headerAlign: "center",
      align: "center",
      headerName:
        language == "en" ? "Resolved Complaints" : "निकाली काढलेल्या तक्रारी",
      description:
        language == "en" ? "Resolved Complaints" : "निकाली काढलेल्या तक्रारी",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },

    {
      field: "totalOpen",
      align: "center",
      headerName: language == "en" ? "Pending Complaints" : "प्रलंबित तक्रारी",
      description: language == "en" ? "Pending Complaints" : "प्रलंबित तक्रारी",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: "800",
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  // handleCellClickPralabit
  const handleCellClickPralabit = (params) => {
    setValue("loadderState", true);
    let url;

    let temp = params?.field;
    let departmentId = params?.row?.departmentId;

    url = `${urls.GM}/report/getCommissionorReviewReportDaysWiseV2`;

    if (temp == "oneToSeven") {
      setValue("DayValueEn", "1 to 7 Days");
      setValue("DayValueMr", "1 ते 7 दिवस");
    } else if (temp == "sevenToFifteen") {
      setValue("DayValueEn", "8 to 15 Days");
      setValue("DayValueMr", "8 ते 15 दिवस");
    } else if (temp == "fifteenToTweentyOne") {
      setValue("DayValueEn", "16 to 21 Days");
      setValue("DayValueMr", "16 ते 21 दिवस");
    } else if (temp == "tweentyOneThirty") {
      setValue("DayValueEn", "22 to 30 Days");
      setValue("DayValueMr", "22 ते 30 दिवस");
    } else if (temp == "greaterThanThirty") {
      setValue("DayValueEn", "More than 30 days");
      setValue("DayValueMr", "30 दिवसांपेक्षा जास्त");
    } else if (temp == "totalPending") {
      setValue("DayValueEn", "Total Pending");
      setValue("DayValueMr", "एकूण प्रलंबित");
    } else if (temp == "magilBaitakitilPralambit") {
      setValue("DayValueEn", "Grievances pending from previous meeting");
      setValue("DayValueMr", "मागील बैठकीतील प्रलंबित तक्रारी");
    } else if (temp == "magilBaitakitilNikaliTakari") {
      setValue("DayValueEn", "Grievances outstanding from previous meeting");
      setValue(
        "DayValueMr",
        "मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी"
      );
    } else if (temp == "baithakinaterAlelaTakrari") {
      setValue("DayValueEn", "Fresh complaints received after the meeting");
      setValue("DayValueMr", "बैठकी नंतर नवीन आलेल्या तक्रारी");
    } else if (temp == "baithakinaterNikaliTakari") {
      setValue("DayValueEn", "Disposed of new complaints");
      setValue("DayValueMr", "नवीन तक्रारी पैकी निकाली काढलेल्या तक्रारी");
    }else if (temp == "admc") {
      setValue("DayValueEn", " Additional Commissioner Exclated Complaints");
      setValue("DayValueMr", " Additional Commissioner Exclated Complaints");
    }


    let crrfromDate =
    moment(watch("fromDate")).format("YYYY-MM-DD");
  let crrtoDate =
    moment(watch("toDate")).format("YYYY-MM-DD") ;
    let crrlastCommissionorDate =
    moment(watch("lastCommissionorDate")).format("YYYY-MM-DD") ;
    // body
    let body = {
      crrfromDate: crrfromDate,
      crrtoDate:crrtoDate,
      crrlastCommissionorDate:crrlastCommissionorDate,
      department: departmentId,
      // 1 to 7
      oneToSeven: temp == "oneToSeven" ? true : false,

      // 7 to 15
      seventoFifteen: temp == "sevenToFifteen" ? true : false,

      // 15 to 21
      fifteentoTweentyOne: temp == "fifteenToTweentyOne" ? true : false,

      // 21 to 30
      tweentyoneToThirty: temp == "tweentyOneThirty" ? true : false,

      // greterThanThirty
      greaterThanThirty: temp == "greaterThanThirty" ? true : false,

      // total pending - एकूण प्रलंबित
      totalPending: temp == "totalPending" ? true : false,

      // मागील बैठकीतील प्रलंबित तक्रारी (A) -
      magilBithakitilPralambitTakrari:
        temp == "magilBaitakitilPralambit" ? true : false,

      // मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी
      magilBithakitilNikaliTakrari:
        temp == "magilBaitakitilNikaliTakari" ? true : false,

      // बैठकी नंतर नवीन आलेल्या तक्रारी
      magilBithakiNaterNavin:
        temp == "baithakinaterAlelaTakrari" ? true : false,

      // नवीन तक्रारी पैकी निकाली काढलेल्या तक्रारी
      navinTakrariNikali: temp == "baithakinaterNikaliTakari" ? true : false,
    admc:temp=='admc'?true:false
    };



    // Day Wise Deatils
    axios
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if(res.data.length!=0){
            setValue("DayWiseSelectionData", res?.data);
          }else{
            setValue("DayWiseSelectionData", []);
          }
          setValue("loadderState", false);
        } else {
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        cfcErrorCatchMethod(error,false);
      });
  };
 
  // handleCellClickEscalation
  const handleCellClickEscalation = (params) => {
    // console.log("cell value ", params?.value, params?.field);
  };

  // cancellButton
  const cancellButton = () => {
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    // daywiseSelection
    setValue("DayWiseSelectionData", null);
    // dayWiseSelectionInDetail
    setValue("dayWiseDataInDetails", null);
  };

  // printTableFunction
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language == "en" ? "Pending Goshwara" : "प्रलंबित गोषवारा",
  });



  function generateCSVFile(Pralabitdata, EscaTableData) {
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
      language == "en" ? "Ghoshwara and Escalation" : "गोषवारा आणि एस्केलेशन";

    const date =
      language == "en"
        ? `DATE: From ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक: ${moment(watch("fromDate")).format(
            "Do-MMM-YYYY"
          )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const fileName =
      language == "en" ? "Ghoshwara and Escalation" : "गोषवारा आणि एस्केलेशन";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtension = ".xlsx";

    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    const fromDateCell = [
      [
        {
          v:
            language === "en"
              ? `From: ${moment(watch("fromDate")).format("Do-MMM-YYYY")}`
              : `पासुन: ${moment(watch("fromDate")).format("Do-MMM-YYYY")}`,
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    const toDateCell = [
      [
        {
          v:
            language === "en"
              ? `To: ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
              : `पर्यंत: ${moment(watch("toDate")).format("Do-MMM-YYYY")}`,
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
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
      firstTableData = Pralabitdata;
      firstTableHeaders = [
        "Department Name",
        "1 to 7 Days",
        "8 to 15 Days",
        "16 to 21 Days",
        "22 to 30 Days",
        "More than 30 days",
        "Total Pending ( A-B+C-D)",
        "",

        "Grievances pending from previous meeting (A)",
        "Grievances outstanding from previous meeting (B)",
        "Fresh complaints received after the meeting (c)",
        "Disposed of new complaints (D)",
        "Additional Commissioner Exclated Complaints"
      ];
    } else {
      firstTableData = Pralabitdata;
      firstTableHeaders = [
        "विभाग",
        "1 ते 7 दिवस",
        "8 ते 15 दिवस",
        "16 ते 21 दिवस",
        "22 ते 30 दिवस",
        "30 दिवसांपेक्षा जास्त",
        "एकूण प्रलंबित ( A-B+C-D)",
        "",
        "मागील बैठकीतील प्रलंबित तक्रारी (अ)",
        "मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी (ब)",
        "बैठकी नंतर नवीन आलेल्या तक्रारी (क)",
        "नवीन तक्रारींपैकी निकाली काढलेल्या तक्रारी (ड)",
        "Additional Commissioner Exclated Complaints"
      ];
    }
    const firstTableHeaderRow = firstTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));

    const firstTableDataRow = firstTableData?.map((item) => [
      { v: item?.department || item?.departmentMr },
      { v: item?.oneToSeven },
      { v: item?.sevenToFifteen },
      { v: item?.fifteenToTweentyOne },
      { v: item?.tweentyOneThirty },
      { v: item?.greaterThanThirty },
      { v: item?.totalPending },
      "", // Empty cell for the new column after "More than 30 days"

      { v: item?.magilBaitakitilPralambit },
      { v: item?.magilBaitakitilNikaliTakari },
      { v: item?.baithakinaterAlelaTakrari },
      { v: item?.baithakinaterNikaliTakari },
      { v: item?.admc },
    ]);

    XLSX.utils.sheet_add_aoa(ws, firstTableTitle, {
      origin: { r: 1, c: 6 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableSubtitle, {
      origin: { r: 2, c: 6 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, [firstTableHeaderRow], {
      origin: { r: 5, c: 1 },
      style: dataStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableDataRow, {
      origin: { r: 6, c: 1 },
    });

    const sumOfTable = [
     language==='en'? "Total":"एकूण",
      PralabitDataTotal.oneToSeven,
      PralabitDataTotal?.sevenToFifteen,
      PralabitDataTotal?.fifteenToTweentyOne,
      PralabitDataTotal?.tweentyOneThirty,
      PralabitDataTotal?.greaterThanThirty,
      PralabitDataTotal?.totalPending,
      "", // Empty cell for the new column after "More than 30 days"

      PralabitDataTotal?.magilBaitakitilPralambit,
      PralabitDataTotal?.magilBaitakitilNikaliTakari,
      PralabitDataTotal?.baithakinaterAlelaTakrari,
      PralabitDataTotal?.baithakinaterNikaliTakari,
      PralabitDataTotal?.admc,
    ];
    const sumOfTableRow = sumOfTable.map((header) => ({
      v: header,
      s: dataStyle,
    }));
    const sumTableStartRow = 6 + firstTableData.length;
    XLSX.utils.sheet_add_aoa(ws, [sumOfTableRow], {
      origin: { r: sumTableStartRow, c: 1 },
      style: dataStyle,
    });

    XLSX.utils.sheet_add_aoa(ws, fromDateCell, {
      origin: { r: 4, c: 2 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, toDateCell, {
      origin: { r: 4, c: 8 },
      style: headerStyle,
    });

    // Merge cells in columns 2 to 6 and 8 to 12 display the "from date" value
    ws["!merges"] = [
      { s: { r: 4, c: 2 }, e: { r: 4, c: 6 } }, // Merge cells for the first date range
      { s: { r: 4, c: 8 }, e: { r: 4, c: 12 } }, // Merge cells for the second date range
    ];

    const secondTableStartRow = 6 + firstTableData.length + 1;

    // Add a separator row
    XLSX.utils.sheet_add_aoa(ws, [[]], {
      origin: { r: secondTableStartRow, c: 1 },
    });

    const secondTableTitle = [
      [
        {
          v:
            language === "en"
              ? "Escaltion To Additional Municipal Commissioner"
              : "अतिरिक्त महापालिका आयुक्तांकडे वाढ",
          s: {
            font: { ...boldFont },
            alignment: { horizontal: "center", vertical: "center" },
          },
        },
      ],
    ];
    XLSX.utils.sheet_add_aoa(ws, secondTableTitle, {
      origin: { r: secondTableStartRow + 1, c: 2 },
    });

    // Add headers and data for the second table
    let tableData;
    let tableHeaders;

    if (language === "en") {
      tableData = EscaTableData;
      tableHeaders = [
        "Additional Commisioner",
        "Designation",
        "Total Complaints",
        "Resolved Complaints",
        "Pending Complaints",
      ];
    } else {
      tableData = EscaTableData;
      tableHeaders = [
        "अतिरिक्त आयुक्त",
        'पदनाम',
        "एकूण तक्रारी",
        "निकाली काढलेल्या तक्रारी",
        "प्रलंबित तक्रारी",
      ];
    }

    const secondTableHeaderRow = tableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));
    const secondTableDataRows = tableData?.map((item) => [
      { v: item?.ayukta || item?.ayukta },
      {v:item.ayuktaDesignation},
      { v: item?.totalCount },
      { v: item?.totalClose },
      { v: item?.totalOpen },
    ]);

    XLSX.utils.sheet_add_aoa(ws, [secondTableHeaderRow], {
      origin: { r: secondTableStartRow + 2, c: 1 },
      style: dataStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, secondTableDataRows, {
      origin: { r: secondTableStartRow + 3, c: 1 },
    });

    const sumEscOfTable = [
      language==='en'? "Total":"एकूण",
      "",
      EscalationDataTotal.totalCount,
      EscalationDataTotal?.totalClose,
      EscalationDataTotal?.totalOpen,
    ];
    const sumEscTableRow = sumEscOfTable.map((header) => ({
      v: header,
      s: dataStyle,
    }));
    const sumEscTableStartRow =
      secondTableStartRow + 3 + secondTableDataRows.length;
      ws["!merges"] = [
        { s: { r: sumEscTableStartRow, c: 1 }, e: { r: sumEscTableStartRow, c: 2 } }, // Merge cells for the first date range
      ];
      
    XLSX.utils.sheet_add_aoa(ws, [sumEscTableRow], {
      origin: { r: sumEscTableStartRow, c: 1 },
      style: dataStyle,
    });

    // Convert the worksheet to Excel format and save
    const excelBuffer = XLSX.write(
      { Sheets: { [fileName]: ws }, SheetNames: [fileName] },
      { bookType: "xlsx", type: "array" }
    );
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
  }


  // Escalation
  useEffect(() => {
    let PralabitData = watch("PralabitData");
    if (
      PralabitData != null &&
      PralabitData.length != "0" &&
      PralabitData != undefined
    ) {
      // added srNo in array objects
      let withSrPralabitData = PralabitData?.map((data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      });

      setPralabitTableData(withSrPralabitData);

      let engPralbitData = PralabitData.map((item) => ({
        baithakinaterAlelaTakrari: item.baithakinaterAlelaTakrari,
        baithakinaterNikaliTakari: item.baithakinaterNikaliTakari,
        department: item.department,
        departmentId: item.departmentId,
        fifteenToTweentyOne: item.fifteenToTweentyOne,
        greaterThanThirty: item.greaterThanThirty,
        magilBaitakitilNikaliTakari: item.magilBaitakitilNikaliTakari,
        magilBaitakitilPralambit: item.magilBaitakitilPralambit,
        oneToSeven: item.oneToSeven,
        sevenToFifteen: item.sevenToFifteen,
        totalPending: item.totalPending,
        tweentyOneThirty: item.tweentyOneThirty,
        admc:item.admc
      }));
      let mrPralbitData = PralabitData.map((item) => ({
        baithakinaterAlelaTakrari: item.baithakinaterAlelaTakrari,
        baithakinaterNikaliTakari: item.baithakinaterNikaliTakari,
        departmentId: item.departmentId,
        departmentMr: item.departmentMr,
        fifteenToTweentyOne: item.fifteenToTweentyOne,
        greaterThanThirty: item.greaterThanThirty,
        magilBaitakitilNikaliTakari: item.magilBaitakitilNikaliTakari,
        magilBaitakitilPralambit: item.magilBaitakitilPralambit,
        oneToSeven: item.oneToSeven,
        sevenToFifteen: item.sevenToFifteen,
        totalPending: item.totalPending,
        tweentyOneThirty: item.tweentyOneThirty,
        admc:item.admc
      }));
      setEngPralabitTableData(engPralbitData);
      setMrPralabitTableData(mrPralbitData);
    }
  }, [watch("PralabitData")]);

  useEffect(() => {

    let oneToSeven = 0;
    let sevenToFifteen = 0;
    let fifteenToTweentyOne = 0;
    let tweentyOneThirty = 0;
    let greaterThanThirty = 0;
    let totalPending = 0;
    let magilBaitakitilPralambit = 0;
    let magilBaitakitilNikaliTakari = 0;
    let baithakinaterAlelaTakrari = 0;
    let baithakinaterNikaliTakari = 0;
    let admc=0

    PralabitTableData?.map((data, index) => {
      oneToSeven += data?.oneToSeven;
      sevenToFifteen += data?.sevenToFifteen;
      fifteenToTweentyOne += data?.fifteenToTweentyOne;
      tweentyOneThirty += data?.tweentyOneThirty;
      greaterThanThirty += data?.greaterThanThirty;
      totalPending += data?.totalPending;
      magilBaitakitilPralambit += data?.magilBaitakitilPralambit;
      magilBaitakitilNikaliTakari += data?.magilBaitakitilNikaliTakari;
      baithakinaterAlelaTakrari += data?.baithakinaterAlelaTakrari;
      baithakinaterNikaliTakari += data?.baithakinaterNikaliTakari;
      admc+=data?.admc;
    });

    let TotalPralabit = {
      oneToSeven,
      sevenToFifteen,
      fifteenToTweentyOne,
      tweentyOneThirty,
      greaterThanThirty,
      totalPending,
      magilBaitakitilPralambit,
      magilBaitakitilNikaliTakari,
      baithakinaterAlelaTakrari,
      baithakinaterNikaliTakari,
      admc
    };

    setPralabitDataTotal(TotalPralabit);
  }, [PralabitTableData]);

  // Escalation
  useEffect(() => {
    let EsclationData = watch("EscalationPralabitData");
    if (
      EsclationData != null &&
      EsclationData.length != "0" &&
      EsclationData != undefined
    ) {
      // added srNo in array objects
      let withSrEscalationPralabitData = EsclationData?.map((data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      });

      setEscalationTableData(withSrEscalationPralabitData);
      const _enEscalationData = EsclationData.map((item) => ({
        ayukta: item.ayukta,
        ayuktaDesignation:item.ayuktaDesignation,
        totalCount: item.totalCount,
        totalOpen: item.totalOpen,
        totalClose: item.totalClose,
      }));
      const _mrEscalationData = EsclationData.map((item) => ({
        ayuktaMr: item.ayukta,
        ayuktaDesignation:item.ayuktaDesignation,
        totalCount: item.totalCount,
        totalOpen: item.totalOpen,
        totalClose: item.totalClose,
      }));
      setEngEscalationTableData(_enEscalationData);
      setMrEscalationTableData(_mrEscalationData);
    }
  }, [watch("EscalationPralabitData")]);

  useEffect(() => {

    let totalCount = 0;
    let totalClose = 0;
    let totalOpen = 0;

    EscalationTableData?.map((data, index) => {
      totalCount += data?.totalCount;
      totalClose += data?.totalClose;
      totalOpen += data?.totalOpen;
    });

    let TotalEscalation = {
      totalCount,
      totalClose,
      totalOpen,
    };

    setEscalationDataTotal(TotalEscalation);
  }, [EscalationTableData]);

  // View
  return (
    <>
      <hr className={Styles.hrGoshwara}></hr>

      {/** Button */}
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
          size="small"
          color="success"
          endIcon={<DownloadIcon />}
          onClick={() =>
            language == "en"
              ? generateCSVFile(engPralabitDataTotal, engEscalationDataTotal)
              : generateCSVFile(mrPralabitDataTotal, mrEscalationDataTotal)
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

      {/** Pralabit Goshwara Start  */}
      <div className={Styles.GoshwaraPralabitHeaderName}>
        {language == "en" ? "Pending Goshwara" : "प्रलंबित गोषवारा"}
      </div>

      <Grid container className={Styles.goshwaraFormDateToDate}>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
            <Controller
              name="fromDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" />
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
            <FormHelperText>
              {errors?.fromDate ? errors?.fromDate?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
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
            <FormHelperText>
              {errors?.toDate ? errors?.toDate?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

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
          "& .MuiDataGrid-cell[data-field='fifteenToTweentyOne']": {
            backgroundColor: "green", // Custom background color for this column
            color: "white",
            textAlign: "center",
          },
          "& .MuiDataGrid-cell[data-field='tweentyOneThirty']": {
            backgroundColor: "yellow", // Custom background color for this column
            color: "white",
            textAlign: "center",
          },
          "& .MuiDataGrid-cell[data-field='greaterThanThirty']": {
            backgroundColor: "red", // Custom background color for this column
            color: "white",
            textAlign: "center",
          },
        }}
        density="density"
        headerHeight={150}
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          PralabitTableData != undefined && PralabitTableData != null
            ? PralabitTableData
            : []
        }
        columns={PralabitTableColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={
          {
          }
        }
        title="Goshwara"
        onCellClick={handleCellClickPralabit}
      />

      {/** Pralabit Goshwara End   */}

      {/**Escalation Report To AMC Start */}

      <div className={Styles.EscalationHeaderName}>
        {language == "en"
          ? "Escaltion To Additional Municipal Commissioner"
          : "अतिरिक्त महापालिका आयुक्तांकडे वाढ"}
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
            cursor: "pointer",
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        autoHeight
        rows={
          EscalationTableData != undefined && EscalationTableData != null
            ? EscalationTableData
            : []
        }
        columns={EscalationTableColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[5]}
        onPageSizeChange={handlePageSizeChange}
        components={
          {
          }
        }
        title="Goshwara"
        onCellClick={handleCellClickEscalation}
      />


      <div className={Styles.HideComponent}>
        <ReportLayout
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
            en: "Pending Goshwara",
            mr: "प्रलंबित गोषवारा",
          }}
        >
          <ComponentToPrintNew
            language={language}
            PralabitTableData={PralabitTableData}
            PralabitDataTotal={PralabitDataTotal}
            EscalationTableData={EscalationTableData}
            EscalationDataTotal={EscalationDataTotal}
            fromDate={moment(watch("fromDate")).format("DD-MM-YYYY")}
            toDate={moment(watch("toDate")).format("DD-MM-YYYY")}
          />
        </ReportLayout>
      </div>
      {/** New Table Report End*/}
    </>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
    let language = this?.props?.language;
    let PralabitTableData = this?.props?.PralabitTableData;
    let formDate = this?.props?.fromDate;
    let toDate = this?.props?.fromDate;
    let EscalationTableData = this?.props?.EscalationTableData;
    let PralabitDataTotal = this?.props?.PralabitDataTotal;
    let EscalationDataTotal = this?.props?.EscalationDataTotal;

    return (
      <div className={PralabitModuleStyle.divhaitokayhay}>
        <table className={PralabitModuleStyle.table}>
          <tbody>
            <tr>
              <td className={PralabitModuleStyle.Table1Header} colSpan={15}>
                {language == "en" ? "Pending Goshwara" : "प्रलंबित गोषवारा"}
              </td>
            </tr>
            <tr>
              <td className={PralabitModuleStyle.Table3Header} colSpan={10}>
                {formDate} &nbsp; पर्यंत तक्रारीचा गोषवारा
              </td>
              <td
                className={PralabitModuleStyle.Table3HeaderMiddle}
                colSpan={1}
              ></td>
              <td className={PralabitModuleStyle.Table3Header} colSpan={7}>
                {toDate} &nbsp; बैठकीतील तक्रारीचा गोषवारा
              </td>
            </tr>
            <tr>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {language == "en" ? "Department Name" : "विभाग"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "1 to 7 Days" : "1 ते 7 दिवस"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "8 to 15 Days" : "8 ते 15 दिवस"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "16 to 21 Days" : "16 ते 21 दिवस"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "22 to 30 Days" : "22 ते 30 दिवस"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "More than 30 days"
                  : "30 दिवसांपेक्षा जास्त"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Total Pending ( A-B+C-D)"
                  : "एकूण प्रलंबित ( A-B+C-D)"}
              </td>
              <td colSpan={1}></td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Grievances pending from previous meeting (A)"
                  : "मागील बैठकीतील प्रलंबित तक्रारी (अ)"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Grievances outstanding from previous meeting (B)"
                  : "मागील बैठकीतील तक्रारींपैकी निकाली काढलेल्या तक्रारी (ब)"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Fresh complaints received after the meeting (c)"
                  : "बैठकी नंतर नवीन आलेल्या तक्रारी (क)"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Disposed of new complaints (D)"
                  : "नवीन तक्रारींपैकी निकाली काढलेल्या तक्रारी (ड)"}
              </td>

              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? " Additional Commissioner Exclated Complaints"
                  : " Additional Commissioner Exclated Complaints"}
              </td>
            </tr>
            {PralabitTableData &&
              PralabitTableData.map((data, index) => (
                <tr>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={3}>
                    {language == "en" ? data?.department : data?.department}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.oneToSeven,
                          "oneToSeven",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en" ? data?.oneToSeven : data?.oneToSeven}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.sevenToFifteen,
                          "sevenToFifteen",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.sevenToFifteen
                        : data?.sevenToFifteen}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.fifteenToTweentyOne,
                          "fifteenToTweentyOne",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.fifteenToTweentyOne
                        : data?.fifteenToTweentyOne}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.tweentyOneThirty,
                          "tweentyOneThirty",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.tweentyOneThirty
                        : data?.tweentyOneThirty}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.greaterThanThirty,
                          "greaterThanThirty",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.greaterThanThirty
                        : data?.greaterThanThirty}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.totalPending,
                          "totalPending",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.totalPending
                        : data?.totalPending}
                    </Button>
                  </td>
                  <td colSpan={1}></td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.magilBaitakitilPralambit,
                          "magilBaitakitilPralambit",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.magilBaitakitilPralambit
                        : data?.magilBaitakitilPralambit}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.magilBaitakitilNikaliTakari,
                          "magilBaitakitilNikaliTakari",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.magilBaitakitilNikaliTakari
                        : data?.magilBaitakitilNikaliTakari}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.baithakinaterAlelaTakrari,
                          "baithakinaterAlelaTakrari",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.baithakinaterAlelaTakrari
                        : data?.baithakinaterAlelaTakrari}
                    </Button>
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                      onClick={() => {
                        this?.props?.handleCellClickPralabitGoshwara(
                          data?.baithakinaterNikaliTakari,
                          "baithakinaterNikaliTakari",
                          data?.departmentId
                        );
                      }}
                    >
                      {language == "en"
                        ? data?.baithakinaterNikaliTakari
                        : data?.baithakinaterNikaliTakari}
                    </Button>
                  </td>

                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    <Button
                      variant="text"
                      size="small"
                      className={PralabitModuleStyle?.ButtonStyle}
                    >
                      {language == "en"
                        ? data?.admc
                        : data?.admc}
                    </Button>
                  </td>
                </tr>
              ))}

            <tr>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={4}
              >
                {language == "en" ? "Total" : "एकूण"}
              </td>

              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {PralabitDataTotal?.oneToSeven}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.sevenToFifteen}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.fifteenToTweentyOne}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.tweentyOneThirty}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.greaterThanThirty}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.totalPending}
              </td>
              <td
                className={PralabitModuleStyle.SumTableTdBottom}
                colSpan={1}
              ></td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.magilBaitakitilPralambit}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.magilBaitakitilNikaliTakari}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.baithakinaterAlelaTakrari}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.baithakinaterNikaliTakari}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {" "}
                {PralabitDataTotal?.admc}
              </td>
            </tr>

            {/** Second Table */}

            {/** Table 1 Header Start */}
            <tr>
              <td className={PralabitModuleStyle.Table2Header} colSpan={15}>
                {language == "en"
                  ? "Escaltion To Additional Municipal Commissioner"
                  : "अतिरिक्त महापालिका आयुक्तांकडे वाढ"}
              </td>
            </tr>
            {/** Table 1 Header End */}

            {/** Table2 Start  */}
            <tr>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Sr.No" : "अ.क्र."}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={5}
              >
                {language == "en"
                  ? "Additional Commisioner"
                  : "अतिरिक्त आयुक्त"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {language == "en"
                  ? "Designation"
                  : "पदनाम"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {language == "en" ? "Total Complaints" : "एकूण तक्रारी"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {language == "en"
                  ? "Resolved Complaints"
                  : "निकाली काढलेल्या तक्रारी"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {language == "en" ? "Pending Complaints" : "प्रलंबित तक्रारी"}
              </td>
            </tr>
            {EscalationTableData &&
              EscalationTableData.map((data, index) => (
                <tr>
                  <td className={PralabitModuleStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={5}>
                    {language == "en" ? data?.ayukta : data?.ayukta}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={3}>
                    {language == "en" ? data?.ayuktaDesignation : data?.ayuktaDesignation}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={3}>
                    {language == "en" ? data?.totalCount : data?.totalCount}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={3}>
                    {language == "en" ? data?.totalClose : data?.totalClose}
                  </td>
                  <td className={PralabitModuleStyle.TableTd} colSpan={3}>
                    {language == "en" ? data?.totalOpen : data?.totalOpen}
                  </td>
                </tr>
              ))}
            <tr>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={9}
              >
                {language == "en" ? "Total" : "एकूण"}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {EscalationDataTotal?.totalCount}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {EscalationDataTotal?.totalClose}
              </td>
              <td
                className={`${PralabitModuleStyle.TableTd}  ${PralabitModuleStyle.TableTh}`}
                colSpan={3}
              >
                {EscalationDataTotal?.totalOpen}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PralabitDetails;
