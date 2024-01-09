import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
  Tooltip,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";
import schema from "../../../containers/schema/SlbSchema/entryFormSchema";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid, GridToolbar, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";

//DateRangePicker

// entryFormSchema
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../features/labelSlice";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import theme from "../../../theme.js";
import { ContactPageSharp } from "@mui/icons-material";

import dynamic from "next/dynamic";
//import { StaticDateRangePicker } from "@material-ui/pickers";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
// import { InputLabel } from '@mui/material';

// PDF DOWNLOAD IMPORT
import jsPDF from "jspdf";
import "jspdf-autotable";

const HistoryDashboardV2 = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const [moduleName, setModuleName] = useState([]);
  const [selectParameterKey, setSelectParameterKey] = useState();
  const [selectedZoneKey, setSelectedZoneKey] = useState();
  const [selectedWardKey, setSelectedWardKey] = useState();
  const [selectParameter, setSelectParameter] = useState();
  let user = useSelector((state) => state.user.user);
  const [selectStartDate, setSelectStartDate] = useState();
  const [selectEndDate, setSelectEndDate] = useState();
  const [id, setID] = useState();

  const [parameterNameList, setParameterNameList] = useState([]);
  const [subParameterName, setSubParameterName] = useState([]);
  const [filteredSubParameterName, setFilteredSubParameterName] = useState([]);
  const [trnEntry, setTrnEntry] = useState([]);
  const [finalEntry, setFinalEntry] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState([]);

  const [dataModule1, setDataModule1] = useState([]);
  const [benchmarkHistory1, setBenchmarkHistory1] = useState([]);

  const [dateRange, setDateRange] = useState([null, null]);
  const language = useSelector((state) => state.labels.language);
  const shortcutsItems = [
    { label: "Today", startDate: new Date(), endDate: new Date() },
    {
      label: "Last 7 Days",
      startDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
    {
      label: "Last 30 Days",
      startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    },
  ];

  const handleDateChange = (dateRange) => {
    setDateRange(dateRange);
  };

  useEffect(() => {
    getModuleName();
    getZoneList();
    getWardList();
  }, []);

  // get Parameter
  const getBenchmarkHistoryByParameter = (selectedZoneKey, selectedWardKey, pmkey) => {
    if (pmkey === null) {
      return;
    }
    let url = "";

    let mode = -1;

    if (selectedZoneKey === 0 && selectedWardKey === 0) {
      url = `${urls.SLB}/benchmarkHistoryPcmc/getAllByParameterId?parameterId=${pmkey}&startDate=${selectStartDate}&endDate=${selectEndDate}`;
      mode = 1;
    } else if (selectedZoneKey !== 0 && selectedWardKey === 0) {
      mode = 2;
      url = `${urls.SLB}/benchmarkHistoryZone/getAllByParameterIdZoneId?parameterId=${pmkey}&zoneId=${selectedZoneKey}&startDate=${selectStartDate}&endDate=${selectEndDate}`;
    } else if (selectedZoneKey !== 0 && selectedWardKey !== 0) {
      mode = 3;
      url = `${urls.SLB}/benchmarkHistory/getAllByParameterIdZoneIdWardId?parameterId=${pmkey}&zoneId=${selectedZoneKey}&wardId=${selectedWardKey}&startDate=${selectStartDate}&endDate=${selectEndDate}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        // assign maindata depending on mode (1,2,3)

        let mainData =
          mode == 1
            ? res?.data.benchmarkHistoryPcmcList
            : mode == 2
            ? res?.data.benchmarkHistoryZoneList
            : res?.data.benchmarkHistoryList;

        const data = mainData.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          moduleKey: r?.moduleKey,
          parameterKey: r?.parameterKey,
          parameterName: r?.parameterName,
          benchmarkValue: r?.benchmarkValue,
          calculatedBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),
          benchmarkDate: moment(r?.benchmarkDate).format("YYYY-MM-DD, h:mm:ss a"),

          // convert bemchmarkDate to dd/mm/yyyy HH:mm:ss format
          benchmarkDateFormatted: new Date(r?.benchmarkDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),

          entryUniqueIdentifier: r?.entryUniqueIdentifier,
        }));

        //sort data by benchmarkDate
        data.sort((a, b) => {
          return new Date(a.benchmarkDate) - new Date(b.benchmarkDate);
        });

        setBenchmarkHistory1(data);

        // Get list of unqiue parameterKey from data
        const parameterKeys = [...new Set(data.map((item) => item.parameterKey))];

        // Create separate lists for each paramaterKey from data by filtering by iterating through parameterKeys
        const series1 = parameterKeys.map((parameterKey) => {
          return {
            parameterKey: parameterKey,
            data: data
              .filter((item) => item.parameterKey === parameterKey)
              .map((item) => item.calculatedBenchmarkValue),
          };
        });
      });
    // iterate dataModule1 and copy the required parameters in series1
  };

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

        let list = r.data.zone.map((row) => ({
          id: row.id,
          zoneKey: row.zoneId,
          zoneName: row.zoneName,
        }));

        // Add "All" option to the list
        list.unshift({ id: 0, zoneKey: 0, zoneName: "All" });

        setZoneList(list);
      });
  };

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
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

        let list = r.data.map((row) => ({
          id: row.id,
          wardKey: row.wardId,
          wardName: row.wardName,
        }));

        // Add "All" option to the list
        list.unshift({ id: 0, wardKey: 0, wardName: "All" });

        setWardList(list);
      });
  };

  // get Module Name
  const getModuleName = () => {
    axios
      .get(`${urls.SLB}/module/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setModuleName(
          res?.data?.moduleList?.map((r, i) => ({
            id: r.id,
            // name: r.name,
            moduleName: r.moduleName,
          }))
        );
      });
  };

  // get Parameter Name
  const getParameterName = (moduleId) => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=${moduleId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setParameterNameList(
          res?.data?.parameterList?.map((r, i) => ({
            id: r.id,

            parameterName: r.parameterName,
            calculationMethod: r.calculationMethod,
            benchmarkType: r.benchmarkType,
          }))
        );
      });
  };

  const columnsBenchMarkHistory = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
      //tooltip
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top">
          <div>{params.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "calculatedBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkDate",
      headerName: "Entry Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "entryUniqueIdentifier",
    //   headerName: "UDID",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ];

  const columnsModule1 = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastActualBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // add action column
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={() => {
                setParamaterKey(params.row.id);

                // load next set of Data
                getBenchmarkHistoryByParameter(params.row.id);
              }}
            >
              Show History
            </Button>
          </div>
        );
      },
    },
  ];

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    parameterName: "",
    moduleName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    parameterName: "",
    moduleName: "",
    id: null,
  };

  useEffect(() => {
    // getParameterName();
    setSelectParameter(null);
  }, [watch("moduleKey")]);

  const onSubmitForm = (Data) => {
    getBenchmarkHistoryByParameter(selectedZoneKey, selectedWardKey, selectParameterKey);
    // // show alert
    // sweetAlert({
    //   title: "Are you sure?",
    //   text: "Once submitted, you will not be able to edit this entry!",
    //   icon: "warning",
    // });
  };

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
    const csvHeaders = columnsBenchMarkHistory.map((c) => c.headerName).join(","); // Extract column headers

    // Convert data rows to CSV format and handle data with commas
    const csvData = data
      .map((d) =>
        columnsBenchMarkHistory
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
    if (!columnsBenchMarkHistory || columnsBenchMarkHistory.length === 0) {
      console.error("No columns specified or columns array is empty.");
      return;
    }
    // rows={benchmarkHistory1}
    // columns={columnsBenchMarkHistory}
    const doc = new jsPDF("portrait");
    const deptName = "Service Level Benchmark"; // Replace with the actual department name
    const reportName = pdfFileName; // Replace with the actual report name

    // Define header and footer height
    const headerHeight = 105;
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

      // doc.setFont("helvetica", "normal");
      // doc.setFontSize(12);
      // doc.text("Report Name:", 10, 65);
      // doc.setFont("helvetica", "bold");
      // doc.text(reportName, 33 + doc.getStringUnitWidth("Report Name:"), 65);
      // doc.setFont("helvetica", "normal");

      if (selectedZone.zoneName === "All" && selectedWard.wardName === "All") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("PCMC Level", 4 + doc.getStringUnitWidth("PCMC Level:"), 65);
        doc.setFont("helvetica", "normal");
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Zone:", 10, 65);
        doc.setFont("helvetica", "bold");
        doc.text(selectedZone.zoneName, 20 + doc.getStringUnitWidth("Zone:"), 65);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Ward:", 170, 65);
        doc.setFont("helvetica", "bold");
        doc.text(selectedWard.wardName, 180 + doc.getStringUnitWidth("Ward:"), 65);
        doc.setFont("helvetica", "normal");
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Module:", 10, 75);
      doc.setFont("helvetica", "bold");
      doc.text(selectedModule.moduleName, 22 + doc.getStringUnitWidth("Module:"), 75);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Parameter:", 10, 85);
      doc.setFont("helvetica", "bold");
      // Use splitTextToSize to handle longer text and break it into multiple lines
      const parameterNameLines = doc.splitTextToSize(selectedParameter.parameterName, 170);
      // Calculate the total height required for the text based on the number of lines
      const lineHeight = doc.getLineHeight();
      const totalHeight = lineHeight * parameterNameLines.length;
      doc.text(parameterNameLines, 27 + doc.getStringUnitWidth("Parameter:"), 85);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("From:", 10, 97);
      doc.setFont("helvetica", "bold");
      doc.text(moment(selectStartDate).format("YYYY-MM-DD"), 20 + doc.getStringUnitWidth("From:"), 97);
      doc.setFont("helvetica", "normal");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("To:", 170, 97);
      doc.setFont("helvetica", "bold");
      doc.text(moment(selectEndDate).format("YYYY-MM-DD"), 176 + doc.getStringUnitWidth("To:"), 97);
      doc.setFont("helvetica", "normal");

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
    const columnsData = columnsBenchMarkHistory.map((c) => c.headerName);
    const rowsData = data.map((row) => columnsBenchMarkHistory.map((col) => row[col.field]));

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

  // View
  return (
    <>
      {/* <BasicLayout> */}
      {/* <Box display="inkenline-block"> */}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            // marginTop: "10px",
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
            <h2>
              {" "}
              {language == "en" ? "History Dashboard" : "इतिहास डॅशबोर्ड"}
              {/* <FormattedLabel id="opinion" /> */}
            </h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginLeft: 5,
              marginRight: 5,
              // marginTop: 2,
              marginBottom: 5,
              padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }}
          >
            <Box p={4}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* Firts Row */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* Zone Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Zone *" : "झोन *"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            // <Select
                            //   defaultValue={zoneList && zoneList.length > 0 ? zoneList[0].id : ""}
                            //   disabled={router?.query?.pageMode === "View"}
                            //   value={field.value}
                            //   onChange={(value) => {
                            //     field.onChange(value);
                            //     getWardList(value.target.value);
                            //     setSelectedZoneKey(value.target.value);
                            //   }}
                            //   label={<FormattedLabel id="locationName" />}
                            // >
                            //   {zoneList &&
                            //     zoneList.map((zone, index) => (
                            //       <MenuItem key={index} value={zone.id}>
                            //         {zone.zoneName}

                            //         {/* {language == "en"
                            //             ? name?.name
                            //             : name?.name} */}
                            //       </MenuItem>
                            //     ))}
                            // </Select>
                            <Select
                              defaultValue={selectedZone}
                              labelId="zone-label"
                              id="zone"
                              label="Zone"
                              value={selectedZone}
                              onChange={(e) => {
                                setSelectedZoneKey(e.target.value.id);
                                setSelectedZone(e.target.value);
                                getWardList(e.target.value.id);
                                setSelectedWardKey(0);
                              }}
                            >
                              {zoneList.map((r) => (
                                <MenuItem value={r}>{r.zoneName}</MenuItem>
                              ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Ward Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl variant="standard" size="medium" error={!!errors.wardKey}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Ward" : "वार्ड"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            // <Select
                            //   disabled={router?.query?.pageMode === "View"}
                            //   value={field.value}
                            //   onChange={(value) => {
                            //     field.onChange(value);
                            //     setSelectedWardKey(value.target.value);
                            //   }}
                            //   label={<FormattedLabel id="locationName" />}
                            // >
                            //   {wardList &&
                            //     wardList.map((ward, index) => (
                            //       <MenuItem key={index} value={ward.id}>
                            //         {ward.wardName}
                            //       </MenuItem>
                            //     ))}
                            // </Select>
                            <Select
                              defaultValue={selectedWard}
                              labelId="ward-label"
                              id="ward"
                              label="Ward"
                              value={selectedWard}
                              onChange={(e) => {
                                setSelectedWard(e.target.value);
                                setSelectedWardKey(e.target.value.id);
                              }}
                            >
                              {wardList.map((r) => (
                                <MenuItem value={r}>{r.wardName}</MenuItem>
                              ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Module Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.moduleName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Module" : "मॉड्यूल"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            // <Select
                            //   disabled={router?.query?.pageMode === "View"}
                            //   // sx={{ width: 200 }}
                            //   value={field.value}
                            //   onChange={(value) => {
                            //     field.onChange(value);
                            //   }}
                            //   label={<FormattedLabel id="locationName" />}
                            //   // InputLabelProps={{
                            //   //   //true
                            //   //   shrink:
                            //   //     (watch("officeLocation") ? true : false) ||
                            //   //     (router.query.officeLocation ? true : false),
                            //   // }}
                            // >
                            //   {moduleName &&
                            //     moduleName.map((moduleName, index) => (
                            //       <MenuItem key={index} value={moduleName.id}>
                            //         {moduleName.moduleName}

                            //         {/* {language == "en"
                            //             ? name?.name
                            //             : name?.name} */}
                            //       </MenuItem>
                            //     ))}
                            // </Select>
                            <Select
                              defaultValue={selectedModule}
                              labelId="module-label"
                              id="module"
                              label="Module"
                              value={selectedModule}
                              onChange={(e) => {
                                setSelectedModule(e.target.value);
                                getParameterName(e.target.value.id);
                              }}
                            >
                              {moduleName.map((r) => (
                                <MenuItem value={r}>{r.moduleName}</MenuItem>
                              ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="moduleKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.moduleName ? errors.moduleName.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Parameter Name */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.parameterName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                          {/* {<FormattedLabel id="locationName" />} */}
                          {language == "en" ? "Parameter" : "पॅरामीटर"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            // <Select
                            //   disabled={router?.query?.pageMode === "View"}
                            //   // sx={{ width: 200 }}
                            //   value={field.value}
                            //   // onChange={(value) => field.onChange(value)}

                            //   onChange={(value) => {
                            //     //getSubParameter(field, value);
                            //     field.onChange(value);
                            //     setSelectParameterKey(value.target.value);

                            //     // get parameter from paremeterlList
                            //     const param = parameterNameList.find(
                            //       (parameterName) => parameterName.id === value.target.value
                            //     );
                            //     setSelectParameter(param);
                            //     //setParameterName("SAgar");
                            //     //getSubParameterName(value.target.value);
                            //   }}
                            //   // label={<FormattedLabel id="locationName" />}
                            //   // InputLabelProps={{
                            //   //   //true
                            //   //   shrink:
                            //   //     (watch("officeLocation") ? true : false) ||
                            //   //     (router.query.officeLocation ? true : false),
                            //   // }}
                            // >
                            //   {parameterNameList &&
                            //     parameterNameList.map((parameterName, index) => (
                            //       <MenuItem key={index} value={parameterName.id}>
                            //         {parameterName.parameterName}

                            //         {/* {language == "en"
                            //             ? officeLocationName?.officeLocationName
                            //             : officeLocationName?.officeLocationNameMar} */}
                            //       </MenuItem>
                            //     ))}
                            // </Select>
                            <Select
                              defaultValue={selectedParameter}
                              labelId="parameter-label"
                              id="parameter"
                              label="Parameter"
                              value={selectedParameter}
                              onChange={(e) => {
                                setSelectedParameter(e.target.value);
                                setSelectParameterKey(e.target.value.id);
                              }}
                            >
                              {parameterNameList.map((r) => (
                                <MenuItem value={r}>{r.parameterName}</MenuItem>
                              ))}
                            </Select>
                          )}
                          name="parameterName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.parameterName ? errors.parameterName.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Datepicker */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        name="startDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  {language == "en" ? "Start Date" : "प्रारंभ तारीख"}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(moment(date).format("YYYY-MM-DD"));
                                setSelectStartDate(moment(date).format("YYYY-MM-DD 00:00:00"));
                              }}
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
                      <Grid item xl={6} lg={4} md={3} sm={3} xs={3} />
                      <Controller
                        name="endDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16, marginTop: 2 }}>
                                  {language == "en" ? "End Date" : "शेवटची तारीख"}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(moment(date).format("YYYY-MM-DD"));
                                setSelectEndDate(moment(date).format("YYYY-MM-DD 23:59:59"));
                              }}
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
                    </Grid>
                  </Grid>

                  <Divider />

                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectParameter && "Benchmark Type : "}
                    {selectParameter && selectParameter.benchmarkType}
                    {selectParameter && " | Calculation Method : "}
                    {selectParameter && selectParameter.calculationMethod}
                  </InputLabel>

                  <Divider />

                  {/* Second Row */}
                  {/* Button Row */}
                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={5}></Grid>

                    {/* Save ad Draft */}
                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("saveAsDraft")}
                        type="Submit"
                        variant="contained"
                      >
                        {language == "en" ? "Submit" : "प्रस्तुत करणे"}
                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>

            {/* show graph */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // flexDirection: "column",
              }}
            >
              <Grid container spacing={2}>
                <Grid item sm={12} md={12}>
                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        paddingTop: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <h2>Historical Records - Graphical</h2>
                    </Box>
                  )}

                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <Chart
                      options={{
                        chart: {
                          stacked: false,
                          toolbar: {
                            show: true,
                            export: {
                              csv: {
                                filename: "SLB: History Report",
                                columnDelimiter: ",",
                                headerCategory: "category",
                                headerValue: "value",
                                dateFormatter(timestamp) {
                                  return new Date(timestamp).toDateString();
                                },
                              },
                              svg: {
                                filename: "SLB: History Report",
                              },
                              png: {
                                filename: "SLB: History Report",
                              },
                            },
                          },
                          xaxis: {
                            type: "category",
                            categories: benchmarkHistory1.map((r) => (r.benchmarkDate ? r.benchmarkDate : r.id)),
                          },
                        },
                      }}
                      series={[
                        {
                          name: "Benchmark Value",
                          data: benchmarkHistory1.map((r) => {
                            return {
                              x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                              y: r.benchmarkValue,
                            };
                          }),
                        },
                        {
                          name: "Actual Benchmark Value",
                          data: benchmarkHistory1.map((r) => {
                            return {
                              x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                              y: r.calculatedBenchmarkValue ? r.calculatedBenchmarkValue : 0,
                            };
                          }),
                        },
                      ]}
                      type="line"
                      width={"100%"}
                      height={"500px"}
                    />
                  )}
                </Grid>
                <Grid item sm={12} md={12}>
                  <Divider />

                  <Grid sm={12} md={12} lg={6}>
                    {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                      <Box
                        style={{
                          textAlign: "left",
                          background: "transparent",
                        }}
                      >
                        <h2>Historical Records - Tabular</h2>
                      </Box>
                    )}
                  </Grid>

                  <Grid
                    sm={12}
                    md={12}
                    lg={6}
                    style={{
                      textAlign: "right",
                      background: "transparent",
                      float: "right",
                      marginTop: "-43.5px",
                    }}
                  >
                    {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                      <Paper style={{ width: "auto", background: "transparent", boxShadow: "none" }}>
                        <Button
                          type="button"
                          variant="contained"
                          color="success"
                          endIcon={<DownloadIcon />}
                          onClick={() => generateCSVFile(benchmarkHistory1, "SLB: History Report")}
                        >
                          CSV {<FormattedLabel id="download" />}
                        </Button>
                        <Button
                          type="button"
                          variant="contained"
                          color="warning"
                          endIcon={<DownloadIcon />}
                          style={{ marginLeft: "10px" }}
                          onClick={() => generatePDF(benchmarkHistory1, "SLB: History Report")}
                        >
                          PDF {<FormattedLabel id="download" />}
                        </Button>
                      </Paper>
                    )}
                  </Grid>
                  <Divider />
                  {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
                    <div style={{ paddingTop: "1rem" }}>
                      <DataGrid
                        componentsProps={{
                          toolbar: {
                            sx: {
                              backgroundColor: "#556CD6",
                              color: "white",

                              // change style of button
                              "& .MuiButton-root": {
                                color: "white",
                                backgroundColor: "#556CD6",
                                "&:hover": {
                                  backgroundColor: "#556CD6",
                                },
                              },
                            },
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },

                            printOptions: { disableToolbarButton: true },
                            // disableExport: true,
                            // disableToolbarButton: true,
                            // csvOptions: { disableToolbarButton: true },
                          },
                        }}
                        headerName="Water"
                        getRowId={(row) => row.srNo}
                        autoHeight
                        sx={{
                          // marginLeft: 5,
                          // marginRight: 5,
                          // marginTop: 5,
                          // marginBottom: 5,

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
                        rows={benchmarkHistory1}
                        columns={columnsBenchMarkHistory}
                      />
                    </div>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default HistoryDashboardV2;
