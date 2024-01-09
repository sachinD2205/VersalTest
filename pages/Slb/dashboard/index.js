import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";

import { Box, Divider, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// import styles from "./dashboard.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import schema from "../../../containers/schema/SlbSchema/subParameterSchema";

import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";

import dynamic from "next/dynamic";
import DownloadIcon from "@mui/icons-material/Download";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// PDF DOWNLOAD IMPORT
import jsPDF from "jspdf";
import "jspdf-autotable";

// EXCEL DOWNLOAD IMPORT
// import XLSX from "sheetjs-style";
// import * as FileSaver from "file-saver";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleNames, setModuleName] = useState([]);
  const [allParameterNames, setAllParameterNames] = useState([]);
  const [parameterNames, setParameterNames] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const [dataModule1, setDataModule1] = useState([]);
  const [dataModule2, setDataModule2] = useState([]);
  const [dataModule3, setDataModule3] = useState([]);
  const [dataModule4, setDataModule4] = useState([]);
  const [dataModule5, setDataModule5] = useState([]);

  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [selectedZoneKey, setSelectedZoneKey] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedWardKey, setSelectedWardKey] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  let user = useSelector((state) => state.user.user);
  const deptName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.applications?.find(
      // @ts-ignore
      (dept) => dept.id == state?.user?.selectedApplicationId
    )
  );

  const reportName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find((menu) => menu.id == Number(localStorage.getItem("selectedMenuFromDrawer")))
  );

  // get Zone Keys
  const getZoneList = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        // Print r in console

        const d = r.data.zone.map((row) => ({
          id: row.id + 1,
          zoneKey: row.id,
          zoneName: row.zoneName,
        }));

        // add one record to d with id as 0 and zoneKey as 0 and zoneName as All
        d.unshift({ id: 0, zoneKey: 0, zoneName: "All" });

        setZoneList(d);

        setSelectedZoneKey(0);
        setSelectedZone({ id: 0, zoneKey: 0, zoneName: "All" });
      });
  };

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
    setSelectedWard({ wardKey: 0, wardName: "All" });
    //http://122.15.104.76:9090/cfc/cfc/api/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=3

    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        // Print r in console

        const d = r.data.map((row) => ({
          id: row.id + 1,
          wardKey: row.id,
          wardName: row.wardName,
        }));

        // add one record to d with id as 0 and wardKey as 0 and wardName as All
        d.unshift({ id: 0, wardKey: 0, wardName: "All" });

        setWardList(d);
      });
  };

  useEffect(() => {
    getWardList();
  }, [zoneList]);

  // get Parameter

  // get Parameter
  const getParameterModule1 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=1`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          // set lastActualBenchmarkValue to 0 if null
          //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
          // Convert lastActualBenchmarkValue to double with 2 decimal places

          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue == null ? 0 : r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        }));
        setDataModule1(data);
      });
    // iterate dataModule1 and copy the required parameters in series1
  };

  // get Parameter
  const getParameterModule2 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=2`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDataModule2(
          res?.data.parameterList.map((r, i) => ({
            id: r.id,
            srNo: "B" + (i + 1),
            // name: r.name,
            parameterName: r?.parameterName,
            lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
            benchmarkValue: r?.benchmarkValue == null ? 0 : r?.benchmarkValue,
            lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
          }))
        );
      });
  };

  // get Parameter
  const getParameterModule3 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=3`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDataModule3(
          res?.data.parameterList.map((r, i) => ({
            id: r.id,
            srNo: "B" + (i + 1),
            // name: r.name,

            // set paramatername equal to r?.parameterName | if length is more than 100, pick only 100 characters
            parameterName: r?.parameterName,

            lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
            benchmarkValue: r?.benchmarkValue == null ? 0 : r?.benchmarkValue,
            lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
          }))
        );
      });
  };

  // get Parameter
  const getParameterModule4 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=4`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDataModule4(
          res?.data.parameterList.map((r, i) => ({
            id: r.id,
            srNo: "B" + (i + 1),
            // name: r.name,
            parameterName: r?.parameterName,
            //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
            // Convert lastActualBenchmarkValue to double with 2 decimal places
            lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
            benchmarkValue: r?.benchmarkValue == null ? 0 : r?.benchmarkValue,
            lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
          }))
        );
      });
  };

  // get Parameter
  const getParameterModule5 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=5`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDataModule5(
          res?.data.parameterList.map((r, i) => ({
            id: r.id,
            srNo: "B" + (i + 1),
            // name: r.name,
            parameterName: r?.parameterName,
            //lastActualBenchmarkValue: r?.lastActualBenchmarkValue,
            // Convert lastActualBenchmarkValue to double with 2 decimal places
            lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
            benchmarkValue: r?.benchmarkValue == null ? 0 : r?.benchmarkValue,
            lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
          }))
        );
      });
  };

  // getParameterModule1ForZone
  const getParameterModule1ForZone = () => {
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=1&zoneKey=${selectedZoneKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule1(data);
      });
  };

  // getParameterModule2ForZone
  const getParameterModule2ForZone = () => {
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=2&zoneKey=${selectedZoneKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule2(data);
      });
  };

  // getParameterModule3ForZone
  const getParameterModule3ForZone = () => {
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=3&zoneKey=${selectedZoneKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule3(data);
      });
  };

  // getParameterModule4ForZone
  const getParameterModule4ForZone = () => {
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=4&zoneKey=${selectedZoneKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule4(data);
      });
  };

  // getParameterModule5ForZone
  const getParameterModule5ForZone = () => {
    axios
      .get(`${urls.SLB}/benchmarkLiveZone/getByModuleZone?moduleKey=5&zoneKey=${selectedZoneKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        setDataModule5(data);
      });
  };

  const getParameterModuleForZoneWard = (mdlKey) => {
    axios
      .get(
        `${urls.SLB}/benchmarkLiveZoneWard/getByModuleZoneWard?moduleKey=${mdlKey}&zoneKey=${selectedZoneKey}&wardKey=${selectedWardKey}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        const data = res?.data.benchmarkLiveZoneWardList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),

          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.benchmarkDate,
        }));
        if (mdlKey === 1) setDataModule1(data);
        else if (mdlKey === 2) setDataModule2(data);
        else if (mdlKey === 3) setDataModule3(data);
        else if (mdlKey === 4) setDataModule4(data);
        else if (mdlKey === 5) setDataModule5(data);
      });
  };

  // Exit Button
  const exitButton = () => {
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    moduleName: "",
    parameterName: "",
  };

  useEffect(() => {
    getZoneList();
    getWardList();
    getParameterModule1();
    getParameterModule2();
    getParameterModule3();
    getParameterModule4();
    getParameterModule5();
    // Set Zone and Ward to ALL value
    setSelectedZoneKey(0);
    setSelectedWardKey(0);
  }, []);

  const columnsModule1 = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr. No." : "क्र.",
      // flex:1
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: language == "en" ? "Parameter" : "पॅरामीटर",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "benchmarkValue",
      headerName: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastActualBenchmarkValue",
      headerName: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// CSV DOWNLOAD ////////////
  // function generateCSVFileV1(data, csvFileName) {
  // const csvHeaders = columnsModule1.map((c) => c.headerName).join(","); // Extract column headers
  // const csvData = data
  //   .map((d) => columnsModule1.map((c) => d[c.field]).join(",")) // Convert data rows to CSV format
  //   .join("\n");

  // const csv = [csvHeaders, csvData].join("\n"); // Combine headers and data

  // const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  // const url = URL.createObjectURL(blob);
  // const downloadLink = document.createElement("a");
  // downloadLink.href = url;
  // downloadLink.download = data ? csvFileName + `.csv` : "data.csv";
  // downloadLink.click();
  // URL.revokeObjectURL(url);
  // }

  function generateCSVFile(data, csvFileName) {
    const csvHeaders = columnsModule1.map((c) => c.headerName).join(","); // Extract column headers

    // Convert data rows to CSV format and handle data with commas
    const csvData = data
      .map((d) =>
        columnsModule1
          .map((c) => {
            const fieldValue = d[c.field] !== null && d[c.field] !== undefined ? String(d[c.field]) : "";
            return fieldValue.includes(",") ? `"${fieldValue}"` : fieldValue;
          })
          .join(",")
      )
      .join("\n");

    const csv = [csvHeaders, csvData].join("\n"); // Combine headers and data

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = data ? csvFileName + `.csv` : "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  ////////////////// PDF DOWNLOAD /////////////////////////
  function generatePDF(data, pdfFileName) {
    if (!columnsModule1 || columnsModule1.length === 0) {
      console.error("No columns specified or columns array is empty.");
      return;
    }

    const doc = new jsPDF("portrait");
    const deptName = "Service Level Benchmark"; // Replace with the actual department name
    const reportName = pdfFileName; // Replace with the actual report name

    // Define header and footer height
    const headerHeight = 95;
    const footerHeight = 20;

    const drawHeader = (startY) => {
      // Add the header content ...
      doc.setFontSize(16);
      doc.text("Pimpri-Chinchwad Municipal Corporation", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });

      doc.setFontSize(12);
      doc.text("Mumbai-Pune Road, Pimpri - 411018", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

      const leftImage = "/logo.png"; // Replace with the path to your left image
      doc.addImage(leftImage, "PNG", 10, 15, 30, 30);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Department Name:", 10, 55);
      doc.setFont("helvetica", "bold");
      doc.text(deptName, 40 + doc.getStringUnitWidth("Department Name:"), 55);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Report Name:", 10, 65);
      doc.setFont("helvetica", "bold");
      doc.text(reportName, 33 + doc.getStringUnitWidth("Report Name:"), 65);
      doc.setFont("helvetica", "normal");

      if (selectedZone.zoneName === "All" && selectedWard.wardName === "All") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PCMC Level", 1 + doc.getStringUnitWidth("Department Name:"), 75);
        doc.setFont("helvetica", "normal");
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Zone:", 10, 75);
        doc.setFont("helvetica", "bold");
        doc.text(selectedZone.zoneName, 15 + doc.getStringUnitWidth("Department Name:"), 75);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Ward:", 10, 85);
        doc.setFont("helvetica", "bold");
        doc.text(selectedWard.wardName, 15 + doc.getStringUnitWidth("Department Name:"), 85);
        doc.setFont("helvetica", "normal");
      }
      const rightImage = "/smartCityPCMC.png"; // Replace with the path to your right image
      doc.addImage(rightImage, "PNG", doc.internal.pageSize.getWidth() - 37, 15, 30, 30);
    };

    // Add footer text on each page
    const footerText = "Print Date and Time: " + new Date().toLocaleString(); // Replace with your desired footer text
    const footerX = doc.internal.pageSize.getWidth() - 80; // 10 units from the right
    const footerY = doc.internal.pageSize.getHeight() - 10; // 10 units from the bottom

    // Calculate the available space on the page for the table and footer
    const availableSpace = doc.internal.pageSize.getHeight() - footerHeight;

    // Combine the header and data and call autoTable for each page
    const columnsData = columnsModule1.map((c) => c.headerName);
    const rowsData = data.map((row) => columnsModule1.map((col) => row[col.field]));

    let currentPage = 1;
    let totalPages = 1;

    const autoTableConfig = {
      head: [columnsData],
      body: rowsData,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 12,
      },
      margin: { top: headerHeight, right: 10, bottom: footerHeight, left: 10 },
      autoSize: {
        tableWidth: "wrap",
        columnWidth: "wrap",
      },
      afterPageContent: function (data) {
        // Check if there is enough space for the footer on the current page
        if (data.cursor.y + footerHeight > doc.internal.pageSize.getHeight()) {
          doc.addPage(); // Move to the next page if there isn't enough space
          currentPage++;
        }

        // Draw the header on each page
        drawHeader(headerHeight);

        // Draw the footer on each page
        const footerY = doc.internal.pageSize.getHeight() - 10;
        doc.setFontSize(10);
        doc.text(footerText, footerX, footerY);

        // Update the total number of pages
        totalPages = currentPage;
      },
    };

    // Draw the header on the first page
    drawHeader(headerHeight);

    doc.autoTable(autoTableConfig);

    doc.save(pdfFileName + ".pdf");
  }

  ///////////////// EXCEL DOWNLOAD ///////////////////////
  function generateExcelFile(data, excelFileName) {
    const csv = [
      columnsModule1.map((c) => c.headerName).join(","),
      ...data.map((d) => columnsModule1.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const headerColumns = columnsModule1.map((c) => c.headerName);
    const fileName = language == "en" ? "Cast Wise List Of Benefeciaries" : "लाभार्थ्यांची जातनिहाय यादी";
    let col = () => {};
    col();
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A8" });
    // const ws = XLSX.utils.sheet_add_aoa(ws0,);
    const boldFont = { bold: true };
    const fontSize = 16;
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
      // alignment: { horizontal: "center", vertical: "center" },
    };
    const dataStyle = {
      font: { ...boldFont, size: fontSize },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const columnWidths = columnsModule1.map((column) => column.headerName.length);
    columnsModule1.forEach((column, index) => {
      const cell = XLSX.utils.encode_cell({ r: 7, c: index });
      ws[cell] = {
        t: "s",
        v: column.headerName,
        s: headerStyle,
      };

      const columnWidth = (columnWidths[index] + 2) * 10;
      if (!ws["!cols"]) ws["!cols"] = [];
      ws["!cols"][index] = { wpx: columnWidth };
    });
    ws.F1 = {
      t: "s",
      v: language == "en" ? "Pimpri-Chinchwad Municipal Corporation" : "पिंपरी-चिंचवड महानगरपालिका",
      s: dataStyle,
    };
    ws.F2 = {
      t: "s",
      v: language == "en" ? "Mumbai-Pune Road, Pimpri - 411018" : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८",
      s: dataStyle,
    };
    ws.F3 = {
      t: "s",
      v: language == "en" ? `Department Name: Samaj Vikas Department` : `विभागाचे नाव: समाज विकास विभाग`,
      s: dataStyle,
    };
    ws.F4 = {
      t: "s",
      v:
        language == "en" ? `Report Name: Cast Wise List Of Benefeciaries` : `अहवालाचे नाव: लाभार्थ्यांची जातनिहाय यादी`,
      s: dataStyle,
    };
    ws.F5 = {
      t: "s",
      v: language == "en" ? `From Date: ${dateObj?.from}` : `तारखेपासून: ${dateObj?.from}`,
      s: dataStyle,
    };
    ws.F6 = {
      t: "s",
      v: language == "en" ? `To Date: ${dateObj?.to}` : `तारखेपर्यंत: ${dateObj?.to}`,
      s: dataStyle,
    };

    // const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    // ws["!merges"] = merge;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>{language == "en" ? "SLB Dashboard - Live" : "SLB डॅशबोर्ड"}</h2>
      </Box>
      <Divider />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        {/* Add a dropdown to select from Zone list */}
        <FormControl variant="outlined" sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="zone-label">{language == "en" ? "Fetch" : "झोन"}</InputLabel>
          <Select
            defaultValue={selectedZone}
            labelId="zone-label"
            id="zone"
            label="Zone"
            value={selectedZone}
            onChange={(e) => {
              setSelectedZoneKey(e.target.value.zoneKey);
              setSelectedZone(e.target.value);

              getWardList(e.target.value.zoneKey);

              // Set value of this select to zonename

              setSelectedWardKey(0);
              setSelectedWard({ wardKey: 0, wardName: "All" });
            }}
          >
            {zoneList.map((r) => (
              <MenuItem value={r}>{r.zoneName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add a dropdown to select from ward list */}
        <FormControl variant="outlined" sx={{ minWidth: 120, m: 1 }}>
          <InputLabel id="ward-label">{language == "en" ? "Ward" : "प्रभाग"}</InputLabel>
          <Select
            labelId="ward-label"
            id="ward"
            label="Ward"
            value={selectedWard}
            onChange={(e) => {
              setSelectedWardKey(e.target.value.wardKey);
              setSelectedWard(e.target.value);
            }}
          >
            {wardList.map((r) => (
              <MenuItem value={r}>{r.wardName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add a button to refresh the graphs*/}
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 1 }}
          onClick={() => {
            if (selectedZoneKey === 0 && selectedWardKey === 0) {
              getParameterModule1();
              getParameterModule2();
              getParameterModule3();
              getParameterModule4();
              getParameterModule5();
            } else if (selectedZoneKey !== 0 && selectedWardKey === 0) {
              getParameterModule1ForZone();
              getParameterModule2ForZone();
              getParameterModule3ForZone();
              getParameterModule4ForZone();
              getParameterModule5ForZone();
            } else if (selectedZoneKey !== 0 && selectedWardKey !== 0) {
              getParameterModuleForZoneWard(1);
              getParameterModuleForZoneWard(2);
              getParameterModuleForZoneWard(3);
              getParameterModuleForZoneWard(4);
              getParameterModuleForZoneWard(5);
              //getParameterModule2ForZoneWard();
              //getParameterModule3ForZoneWard();
              //getParameterModule4ForZoneWard();
              //getParameterModule5ForZoneWard();
            }
          }}
        >
          {language == "en" ? "Fetch" : "शोधा"}
        </Button>
      </Box>

      <Divider />
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Water Supply Management System</h2>
      </Box>
      <Divider /> */}
      <Grid container spacing={2}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              title: {
                text: language == "en" ? "Water Supply Management System" : "पाणी पुरवठा व्यवस्थापन प्रणाली",
                align: "left",
                margin: 10,
                offsetX: 10,
                offsetY: 15,
                floating: false,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",

                  color: "#263238",
                },
              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -60,
                  rotateAlways: true,
                  minHeight: 240,
                  maxHeight: 540,

                  style: {
                    fontWeight: "bold",
                    fontSize: "9px",
                    wordWrap: "line-break",
                    wordBreak: "break-all",
                  },
                },
                tickPlacement: "on",
              },

              chart: {
                stacked: false,
                xaxis: { categories: dataModule1.map((r) => r.parameterName) },
                toolbar: {
                  show: true,
                  export: {
                    csv: {
                      filename: "Water Supply Management System",
                      columnDelimiter: ",",
                      headerCategory: "category",
                      headerValue: "value",
                      dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString();
                      },
                    },
                    svg: {
                      filename: "Water Supply Management System",
                    },
                    png: {
                      filename: "Water Supply Management System",
                    },
                  },
                },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val.toString().toLowerCase().trim() == "nan" ? "" : val + "%";
                },
                style: {
                  colors: ["#000000"],
                },

                textAnchor: "middle",
                offsetY: 0,
              },

              // tooltip: {
              //   enabled: true,
              //   shared: false,
              //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              //     const categoryName = w.globals.labels[dataPointIndex];
              //     const seriesName = w.globals.seriesNames[seriesIndex];
              //     const value = series[seriesIndex][dataPointIndex];
              //     // Get sr No from dataModule1 where parameterName = categoryName
              //     const srNo = dataModule1.find(
              //       (r) => r.srNo === categoryName
              //     ).parameterName;

              //     return `
              //       <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
              //         <strong>Code:</strong> ${categoryName}<br />
              //         <strong>Paramater Name:</strong> ${srNo}<br/>
              //         <strong>${seriesName}</strong>: ${value}<br/>
              //       </div>
              //     `;
              //   },
              // },
            }}
            series={[
              {
                name: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
                data: dataModule1.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
                data: dataModule1.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"500px"}
          />
        </Grid>
        <Grid
          style={{
            textAlign: "right",
            marginBottom: "-60px",
            background: "transparent",
            width: "100%",
          }}
        >
          <Paper elevation={4} style={{ margin: "30px", width: "auto", background: "transparent", boxShadow: "none" }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(dataModule1, "Water Supply Management System")}
            >
              CSV
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(dataModule1, "Water Supply Management System")}
            >
              PDF
            </Button>
            {/* <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generateExcelFile(dataModule1, "Water Supply Management System")}
            >
              EXCEL 
            </Button> */}
          </Paper>
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              rows={dataModule1}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      <Box style={{ marginTop: "5rem", borderTop: "1px solid grey" }}>
        <Divider />
      </Box>
      <Grid container spacing={2} style={{ marginTop: "3rem" }}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              title: {
                text: language == "en" ? "Solid Waste Management System" : "घनकचरा व्यवस्थापन प्रणाली",
                align: "left",
                margin: 10,
                offsetX: 10,
                offsetY: 15,
                floating: false,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",

                  color: "#263238",
                },
              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -60,
                  rotateAlways: true,
                  minHeight: 240,
                  maxHeight: 540,

                  style: {
                    fontWeight: "bold",
                    fontSize: "9px",
                    wordWrap: "line-break",
                    wordBreak: "break-all",
                  },
                },
                tickPlacement: "on",
              },
              chart: {
                stacked: false,
                toolbar: {
                  show: true,
                  export: {
                    csv: {
                      filename: "Solid Waste Management System",
                      columnDelimiter: ",",
                      headerCategory: "category",
                      headerValue: "value",
                      dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString();
                      },
                    },
                    svg: {
                      filename: "Solid Waste Management System",
                    },
                    png: {
                      filename: "Solid Waste Management System",
                    },
                  },
                },
                xaxis: { categories: dataModule2.map((r) => r.parameterName) },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val.toString().toLowerCase().trim() == "nan" ? "" : val + "%";
                },
                style: {
                  colors: ["#000000"],
                },
                textAnchor: "middle",
                offsetY: 0,
              },

              // tooltip: {
              //   enabled: true,
              //   shared: false,
              //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              //     const categoryName = w.globals.labels[dataPointIndex];
              //     const seriesName = w.globals.seriesNames[seriesIndex];
              //     const value = series[seriesIndex][dataPointIndex];
              //     // Get sr No from dataModule1 where parameterName = categoryName
              //     const srNo = dataModule1.find(
              //       (r) => r.srNo === categoryName
              //     ).parameterName;

              //     return `
              //       <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
              //         <strong>Code:</strong> ${categoryName}<br />
              //         <strong>Paramater Name:</strong> ${srNo}<br/>
              //         <strong>${seriesName}</strong>: ${value}<br/>
              //       </div>
              //     `;
              //   },
              // },
            }}
            series={[
              {
                name: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
                data: dataModule2.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
                data: dataModule2.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"500px"}
          />
        </Grid>
        <Grid
          style={{
            textAlign: "right",
            marginBottom: "-60px",
            background: "transparent",
            width: "100%",
          }}
        >
          <Paper elevation={4} style={{ margin: "30px", width: "auto", background: "transparent", boxShadow: "none" }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(dataModule2, "Solid Waste Management System")}
            >
              CSV
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(dataModule2, "Solid Waste Management System")}
            >
              PDF
            </Button>
            {/* <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generateExcelFile(dataModule2, "Table 2")}
            >
              EXCEL 
            </Button> */}
          </Paper>
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              rows={dataModule2}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Solid Waste Management System (MOHUA)</h2>
      </Box>
      <Divider /> */}
      <Box style={{ marginTop: "5rem", borderTop: "1px solid grey" }}>
        <Divider />
      </Box>
      <Grid container spacing={2} style={{ marginTop: "3rem" }}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              title: {
                text: language == "en" ? "Solid Waste Management System (MOHUA)" : "घनकचरा व्यवस्थापन प्रणाली (MOHUA)",
                align: "left",
                margin: 10,
                offsetX: 10,
                offsetY: 15,
                floating: false,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",

                  color: "#263238",
                },
              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -60,
                  rotateAlways: true,
                  minHeight: 240,
                  maxHeight: 540,

                  style: {
                    fontWeight: "bold",
                    fontSize: "9px",
                    wordWrap: "line-break",
                    wordBreak: "break-all",
                  },
                },
                tickPlacement: "on",
              },
              chart: {
                stacked: false,
                toolbar: {
                  show: true,
                  export: {
                    csv: {
                      filename: "Solid Waste Management System (MOHUA)",
                      columnDelimiter: ",",
                      headerCategory: "category",
                      headerValue: "value",
                      dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString();
                      },
                    },
                    svg: {
                      filename: "Solid Waste Management System (MOHUA)",
                    },
                    png: {
                      filename: "Solid Waste Management System (MOHUA)",
                    },
                  },
                },
                xaxis: { categories: dataModule5.map((r) => r.parameterName) },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val.toString().toLowerCase().trim() == "nan" ? "" : val + "%";
                },
                style: {
                  colors: ["#000000"],
                },
                textAnchor: "middle",
                offsetY: 0,
              },

              // tooltip: {
              //   enabled: true,
              //   shared: false,
              //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              //     const categoryName = w.globals.labels[dataPointIndex];
              //     const seriesName = w.globals.seriesNames[seriesIndex];
              //     const value = series[seriesIndex][dataPointIndex];
              //     // Get sr No from dataModule1 where parameterName = categoryName
              //     const srNo = dataModule1.find(
              //       (r) => r.srNo === categoryName
              //     ).parameterName;

              //     return `
              //       <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
              //         <strong>Code:</strong> ${categoryName}<br />
              //         <strong>Paramater Name:</strong> ${srNo}<br/>
              //         <strong>${seriesName}</strong>: ${value}<br/>
              //       </div>
              //     `;
              //   },
              // },
            }}
            series={[
              {
                name: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
                data: dataModule5.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
                data: dataModule5.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"500px"}
          />
        </Grid>
        <Grid
          style={{
            textAlign: "right",
            marginBottom: "-60px",
            background: "transparent",
            width: "100%",
          }}
        >
          <Paper elevation={4} style={{ margin: "30px", width: "auto", background: "transparent", boxShadow: "none" }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(dataModule5, "Solid Waste Management System (MOHUA)")}
            >
              CSV
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(dataModule5, "Solid Waste Management System (MOHUA)")}
            >
              PDF
            </Button>
            {/* <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generateExcelFile(dataModule1, "Water Supply Management System")}
            >
              EXCEL 
            </Button> */}
          </Paper>
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              rows={dataModule5}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Sewerage Management System</h2>
      </Box>
      <Divider /> */}
      <Box style={{ marginTop: "5rem", borderTop: "1px solid grey" }}>
        <Divider />
      </Box>
      <Grid container spacing={2} style={{ marginTop: "3rem" }}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              title: {
                text: language == "en" ? "Sewerage Management System" : "नाले व्यवस्थापन प्रणाली",
                align: "left",
                margin: 10,
                offsetX: 10,
                offsetY: 15,
                floating: false,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",

                  color: "#263238",
                },
              },
              chart: {
                stacked: false,
                toolbar: {
                  show: true,
                  export: {
                    csv: {
                      filename: "Sewerage Management System",
                      columnDelimiter: ",",
                      headerCategory: "category",
                      headerValue: "value",
                      dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString();
                      },
                    },
                    svg: {
                      filename: "Sewerage Management System",
                    },
                    png: {
                      filename: "Sewerage Management System",
                    },
                  },
                },
                xaxis: { categories: dataModule3.map((r) => r.parameterName) },
              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -60,
                  rotateAlways: true,
                  minHeight: 240,
                  maxHeight: 540,

                  style: {
                    fontWeight: "bold",
                    fontSize: "9px",
                    wordWrap: "line-break",
                    wordBreak: "break-all",
                  },
                },
                tickPlacement: "on",
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val.toString().toLowerCase().trim() == "nan" ? "" : val + "%";
                },
                style: {
                  colors: ["#000000"],
                },
                textAnchor: "middle",
                offsetY: 0,
              },

              // tooltip: {
              //   enabled: true,
              //   shared: false,
              //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              //     const categoryName = w.globals.labels[dataPointIndex];
              //     const seriesName = w.globals.seriesNames[seriesIndex];
              //     const value = series[seriesIndex][dataPointIndex];
              //     // Get sr No from dataModule1 where parameterName = categoryName
              //     const srNo = dataModule1.find(
              //       (r) => r.srNo === categoryName
              //     ).parameterName;

              //     return `
              //       <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
              //         <strong>Code:</strong> ${categoryName}<br />
              //         <strong>Paramater Name:</strong> ${srNo}<br/>
              //         <strong>${seriesName}</strong>: ${value}<br/>
              //       </div>
              //     `;
              //   },
              // },
            }}
            series={[
              {
                name: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
                data: dataModule3.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
                data: dataModule3.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"500px"}
          />
        </Grid>
        <Grid
          style={{
            textAlign: "right",
            marginBottom: "-60px",
            background: "transparent",
            width: "100%",
          }}
        >
          <Paper elevation={4} style={{ margin: "30px", width: "auto", background: "transparent", boxShadow: "none" }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(dataModule3, "Sewerage Management System")}
            >
              CSV
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(dataModule3, "Sewerage Management System")}
            >
              PDF
            </Button>
            {/* <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generateExcelFile(dataModule3, "Sewerage Management System")}
            >
              EXCEL 
            </Button> */}
          </Paper>
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              rows={dataModule3}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Storm Water Drainage Management System</h2>
      </Box>
      <Divider /> */}
      <Box style={{ marginTop: "5rem", borderTop: "1px solid grey" }}>
        <Divider />
      </Box>
      <Grid container spacing={2} style={{ marginTop: "3rem" }}>
        <Grid item sm={12} md={12}>
          <Chart
            options={{
              title: {
                text: language == "en" ? "Storm Water Drainage Management System" : "नाले व्यवस्थापन प्रणाली",
                align: "left",
                margin: 10,
                offsetX: 10,
                offsetY: 15,
                floating: false,
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",

                  color: "#263238",
                },
              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -60,
                  rotateAlways: true,
                  minHeight: 240,
                  maxHeight: 540,

                  style: {
                    fontWeight: "bold",
                    fontSize: "9px",
                    wordWrap: "line-break",
                    wordBreak: "break-all",
                  },
                },
                tickPlacement: "on",
              },
              chart: {
                stacked: false,
                toolbar: {
                  show: true,
                  export: {
                    csv: {
                      filename: "Storm Water Drainage Management System",
                      columnDelimiter: ",",
                      headerCategory: "category",
                      headerValue: "value",
                      dateFormatter(timestamp) {
                        return new Date(timestamp).toDateString();
                      },
                    },
                    svg: {
                      filename: "Storm Water Drainage Management System",
                    },
                    png: {
                      filename: "Storm Water Drainage Management System",
                    },
                  },
                },
                xaxis: { categories: dataModule4.map((r) => r.parameterName) },
              },
              legend: {
                position: "top", // Show the legend at the top of the chart
                horizontalAlign: "center", // Horizontally align the legend to the center
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val.toString().toLowerCase().trim() == "nan" ? "" : val + "%";
                },
                style: {
                  colors: ["#000000"],
                },
                textAnchor: "middle",
                offsetY: 0,
              },

              // tooltip: {
              //   enabled: true,
              //   shared: false,
              //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              //     const categoryName = w.globals.labels[dataPointIndex];
              //     const seriesName = w.globals.seriesNames[seriesIndex];
              //     const value = series[seriesIndex][dataPointIndex];
              //     // Get sr No from dataModule1 where parameterName = categoryName
              //     const srNo = dataModule1.find(
              //       (r) => r.srNo === categoryName
              //     ).parameterName;

              //     return `
              //       <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff;">
              //         <strong>Code:</strong> ${categoryName}<br />
              //         <strong>Paramater Name:</strong> ${srNo}<br/>
              //         <strong>${seriesName}</strong>: ${value}<br/>
              //       </div>
              //     `;
              //   },
              // },
            }}
            series={[
              {
                name: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
                data: dataModule4.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: language == "en" ? "Actual Value" : "वास्तविक मूल्य",
                data: dataModule4.map((r) => {
                  return {
                    x: r.parameterName,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"500px"}
          />
        </Grid>
        <Grid
          style={{
            textAlign: "right",
            marginBottom: "-60px",
            background: "transparent",
            width: "100%",
          }}
        >
          <Paper elevation={4} style={{ margin: "30px", width: "auto", background: "transparent", boxShadow: "none" }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              endIcon={<DownloadIcon />}
              onClick={() => generateCSVFile(dataModule4, "Storm Water Drainage Management System")}
            >
              CSV
            </Button>
            <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generatePDF(dataModule4, "Storm Water Drainage Management System")}
            >
              PDF
            </Button>
            {/* <Button
              type="button"
              variant="contained"
              color="warning"
              endIcon={<DownloadIcon />}
              style={{ marginLeft: "10px" }}
              onClick={() => generateExcelFile(dataModule3, "Sewerage Management System")}
            >
              EXCEL 
            </Button> */}
          </Paper>
        </Grid>
        <Grid item sm={12} md={12}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              rows={dataModule4}
              columns={columnsModule1}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Index;
