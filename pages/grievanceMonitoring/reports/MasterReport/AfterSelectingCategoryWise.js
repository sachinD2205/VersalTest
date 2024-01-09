import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
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
import PralabitStyle from "./AfterSelectPointwiseCategoryWise.module.css";
import sweetalert from "sweetalert";
import BarChartIcon from "@mui/icons-material/BarChart";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const CategoryWiseData = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [categoryWiseTableData, setCategoryWiseTableData] = useState([]);
  const [engCategoryWiseTableData, setEngCategoryWiseTableData] = useState([]);
  const [mrCategoryWiseTableData, setMrCategoryWiseTableData] = useState([]);
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

  // AfterSelectingCategoryWise
  const AfterSelectingCategoryWise = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department" : "विभाग",
      description: language == "en" ? "Department" : "विभाग",
      flex: 2,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field: "totalGrievance",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Received" : "प्राप्त",
      description: language == "en" ? "Received" : "प्राप्त",
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
      field: "totalCloseGriv",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Settled" : "निकाली",
      description: language == "en" ? "Settled" : "निकाली",
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
      field: "totalOpenGriv",
      align: "center",
      headerName: language == "en" ? "Pending" : "प्रलंबित",
      description: language == "en" ? "Pending" : "प्रलंबित",
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
      field: "percentage",
      align: "center",
      headerName:
        language == "en" ? "Completion Percentage (%)" : "पूर्तता टक्केवारी(%)",
      description:
        language == "en" ? "Completion Percentage (%)" : "पूर्तता टक्केवारी(%)",
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
      field: "actions",
      description: language == "en" ? "Actions" : "क्रिया",
      headerName: language == "en" ? "Actions" : "क्रिया",
      headerAlign: "center",
      align: "center",
      flex: 4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        console.log("allaekh", record?.row);
        return (
          <>
            <IconButton
              onClick={() => {
                handleCellClickPralabit("totalOpenGriv");
              }}
            >
              <Button variant="contained" size="small">
                {language == "en"
                  ? "Pending Report by Period"
                  : "कालावधीनुसार प्रलंबित अहवाल"}
              </Button>
            </IconButton>
            <IconButton
              onClick={() => {
                getCateogoryWiseChartData(record?.row);
              }}
            >
              <Button
                color="success"
                variant="contained"
                size="small"
                startIcon={<BarChartIcon />}
              >
                {language == "en" ? "View Chart" : "आलेख पहा"}
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];

  // cancellButton
  const cancellButton = () => {
    setValue("department", null);
    setValue("lstSubDepartment", []);
    setValue("splevent", []);
    setValue("fromDate", null);
    setValue("toDate", null);
    setValue("lastCommissionorDate", null);
    setValue("categoryWiseData", null);
    setValue("PralabitData", null);
    setValue("EscalationPralabitData", null);
    setValue("DayWiseSelectionData", null);
    setValue("dayWiseDataInDetails", null);
    setValue("searchButtonInputState", true);
    setValue("CategoryWiseChartData", null);
    setValue("selectedDepartmentForChart", "");
  };

  // handleCellClickPralabit
  const handleCellClickPralabit = (params) => {
    if (params == "totalOpenGriv") {
      setValue("loadderState", true);
      setValue("PralabitData", null);
      setValue("EscalationPralabitData", null);
      setValue("CategoryWiseChartData", null);
      setValue("selectedDepartmentForChart", "");
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DD");
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DD");
        let crrlastCommissionorDate = moment( watch("lastCommissionorDate")).format("YYYY-MM-DD");
      let body = {
        crrfromDate: sendFromDate,
        crrtoDate: sendToDate,
        crrlastCommissionorDate: crrlastCommissionorDate,
      };
      let sendFromDate1 =
      moment(watch("fromDate")).format("YYYY-MM-DDT")+'00:00:01';
    let sendToDate1 =
      moment(watch("toDate")).format("YYYY-MM-DDT")+'23:59:59';
      let crrlastCommissionorDate1 =  moment( watch("lastCommissionorDate")).format("YYYY-MM-DDT")+'00:00:01';
      let body1 = {
        fromDate: sendFromDate1,
        toDate: sendToDate1,
        lastCommissionorDate: crrlastCommissionorDate1,
      };


      let url;
      let url1;

      url = `${urls.GM}/report/getKalavadhiNusarPralmbitAahaval`;
      url1 = `${urls.GM}/report/getCommissionorReviewPralambitEscalationGhoshwara`;

      // GoshwaraInDetail
      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            console.log("PralabitData0909", res?.data);
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data.length != 0
            ) {
              setValue("PralabitData", res?.data);
              setValue("loadderState", false);
            } else {
              setValue("loadderState", false);
            }
          } else {
            setValue("loadderState", false);
          }
        })
        .catch((err) => {
          setValue("loadderState", false);
          cfcErrorCatchMethod(err,false);
        });

      setValue("loadderState", true);

      // EscalationReport
      axios
        .post(url1, body1, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              res?.data.length != 0
            ) {
              setValue("EscalationPralabitData", res?.data);
              setValue("loadderState", false);
            } else {
              setValue("loadderState", false);
            }
          } else {
            setValue("loadderState", false);
          }
        })
        .catch((err) => {
          setValue("loadderState", false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };


  // printTableFunction
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en" ? "Goshwara  Category Wise" : "गोश्‍वारा वर्गवार",
  });


  //  getCateogoryWiseChartData
  const getCateogoryWiseChartData = (params) => {
    if (params?.departmentId != null && params?.departmentId != undefined) {
      setValue("loadderState", true);
      setValue("PralabitData", null);
      setValue("EscalationPralabitData", null);
      //removeChartData
      setValue("CategoryWiseChartData", null);
      setValue("selectedDepartmentForChart", "");
      // finalBodyForChartApi
      let finalBodyForChartApi = {
        fromDate: watch("fromDate"),
        toDate: watch("toDate"),
        department: params?.departmentId,
      };

      // url
      let url = `${urls.GM}/report/getReportCategoryWiseChart`;

      // api
      axios
        .post(url, finalBodyForChartApi, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            if (res?.data.length > 0) {
              setValue("CategoryWiseChartData", res?.data);
              setValue("selectedDepartmentForChart", params?.departmentId);
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
    } else {
      setValue("loadderState", false);
      sweetalert("Not Found !", "Department Id Not Found!", "warning");
      sweetalert(
        language === "en" ? "Not Found !" : "सापडले नाही!",
        language === "en"
          ? "Department Id Not Found!"
          : "विभाग आयडी सापडला नाही!!",
        "warning"
      );
    }
  };


  // categoryWiseData
  useEffect(() => {
    let categoryWiseData = watch("categoryWiseData");
    if (
      categoryWiseData != null &&
      categoryWiseData.length != "0" &&
      categoryWiseData != undefined
    ) {
      // added srNo in array objects
      let withSrCategoryWiseData = categoryWiseData?.map((data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      });

      setCategoryWiseTableData(withSrCategoryWiseData);

      const _enAuditD = categoryWiseData.map((item) => ({
        departmentName: item.departmentName,
        percentage: item.percentage,
        totalCloseGriv: item.totalCloseGriv,
        totalGrievance: item.totalGrievance,
        totalOpenGriv: item.totalOpenGriv,
      }));

      const _mrAuditD = categoryWiseData.map((item) => ({
        departmentNameMr: item.departmentNameMr,
        percentage: item.percentage,
        totalCloseGriv: item.totalCloseGriv,
        totalGrievance: item.totalGrievance,
        totalOpenGriv: item.totalOpenGriv,
      }));
      setEngCategoryWiseTableData(_enAuditD);
      setMrCategoryWiseTableData(_mrAuditD);
    }
  }, [watch("categoryWiseData")]);


  function generateCSVFile(data) {
    console.log("GoshwaraTableData", data);

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
        ? "Department Wise Status Complaints"
        : "तक्रारींची विभागनिहाय स्थिती";

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
        ? "DeptWiseStatusComplaints"
        : "तक्रारींचीविभागनिहायस्थिती";
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
        "Department",
        "Received",
        "Settled",
        "Pending",
        "Completion Percentage (%)",
      ];
    } else {
      firstTableData = data;
      firstTableHeaders = [
        "विभाग",
        "प्राप्त",
        "निकाली",
        "प्रलंबित",
        "पूर्तता टक्केवारी(%)",
      ];
    }
    const firstTableHeaderRow = firstTableHeaders.map((header) => ({
      v: header,
      s: dataStyle,
    }));

    const firstTableDataRow = firstTableData.map((item) => [
      { v: item.departmentName || item.departmentNameMr },
      { v: item.totalGrievance },
      { v: item.totalCloseGriv },
      { v: item.totalOpenGriv },
      { v: item.percentage },
    ]);

    XLSX.utils.sheet_add_aoa(ws, firstTableTitle, {
      origin: { r: 1, c: 3 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableSubtitle, {
      origin: { r: 2, c: 3 },
      style: headerStyle,
    });
    XLSX.utils.sheet_add_aoa(ws, firstTableDate, {
      origin: { r: 3, c: 3 },
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

  // View
  return (
    <>
      <hr className={Styles.hrCategoryWise}></hr>

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
          color="success"
          size="small"
          endIcon={<DownloadIcon />}
          onClick={() =>
            language == "en"
              ? generateCSVFile(engCategoryWiseTableData)
              : generateCSVFile(mrCategoryWiseTableData)
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

      {/**Category Wise */}
      <div className={Styles.CategoryWiseHeaderName}>
        {language == "en"
          ? "Department wise status of complaints"
          : "विभागनुसार तक्रारींबाबतची स्थिती"}
      </div>

      <Grid container className={Styles.categoryWiseFormDateToDate}>
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
            lineHeight: "2 !important",
          },
          "& .MuiDataGrid-cellContent": {
            textOverflow: "unset !important",
            whiteSpace: "break-spaces !important",
            lineHeight: "1 !important",
          },
        }}
        density="density"
        getRowId={(row) => row.srNo}
        headerHeight={100}
        autoHeight
        rows={
          categoryWiseTableData != undefined && categoryWiseTableData != null
            ? categoryWiseTableData
            : []
        }
        columns={AfterSelectingCategoryWise}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageSizeChange={handlePageSizeChange}
        components={
          {
          }
        }
        title="Goshwara"
      />

      {/** New Table Report  */}
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={6}
          componentRef={componentRef}
          deptName={{
            en: "Grievance Monitoring System",
            mr: "तक्रार निवारण प्रणाली",
          }}
          reportName={{
            en: "Department wise status of complaints",
            mr: "विभागनुसार तक्रारींबाबतची स्थिती",
          }}
        >
          <ComponentToPrintNew
            language={language}
            categoryWiseTableData={categoryWiseTableData}
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
    let categoryWiseTableData = this?.props?.categoryWiseTableData;
    console.log("categoryWiseTableData", categoryWiseTableData);

    // view
    return (
      <>
        <table className={PralabitStyle.table}>
          <tbody>
            <tr>
              <td className={PralabitStyle.Table1Header} colSpan={6}>
                {language == "en"
                  ? "Department wise status of complaints"
                  : "विभागनुसार तक्रारींबाबतची स्थिती"}
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
                {language == "en" ? "Department" : "विभाग"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en" ? "Received" : "प्राप्त"}
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
                  ? "Completion Percentage (%)"
                  : "पूर्तता टक्केवारी(%)"}
              </td>
              <td
                className={`${PralabitStyle.TableTd} ${PralabitStyle.TableTh}`}
                colSpan={1}
              >
                {language == "en"
                  ? "Pending Report by Period"
                  : "कालावधीनुसार प्रलंबित अहवाल"}
              </td>
            </tr>

            {categoryWiseTableData &&
              categoryWiseTableData?.map((data, index) => (
                <tr>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en" ? data?.srNo : data?.srNo}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.departmentName
                      : data?.departmentNameMr}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.totalGrievance
                      : data?.totalGrievance}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {language == "en"
                      ? data?.totalCloseGriv
                      : data?.totalCloseGriv}
                  </td>

                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.percentage !== "NaN"
                      ? language == "en"
                        ? data?.totalOpenGriv
                        : data?.totalOpenGriv
                      : "-"}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.percentage !== "NaN"
                      ? language == "en"
                        ? data?.percentage
                        : data?.percentage
                      : "-"}
                  </td>
                  <td className={PralabitStyle.TableTd} colSpan={1}>
                    {data?.percentage !== "NaN"
                      ? language == "en"
                        ? data?.totalGrievance1
                        : data?.totalGrievance1
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
export default CategoryWiseData;
