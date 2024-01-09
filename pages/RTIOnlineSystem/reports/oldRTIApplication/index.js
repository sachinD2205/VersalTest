import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  InputLabel,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  ThemeProvider,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import theme from "../../../../theme";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import * as FileSaver from "file-saver";
import { Visibility } from "@mui/icons-material";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import DownloadIcon from "@mui/icons-material/Download";
import Styles from "../oldRTIApplication/oldRTIApplication.module.css";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import XLSX from "sheetjs-style";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import {
  EncryptData,
  DecryptData,
} from "../../../../components/common/EncryptDecrypt";
const Index = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({});
  const logedInUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchData, setFetchData] = useState(null);
  const language = useSelector((store) => store.labels.language);
  const [dataNotAvail, setDataNotAvail] = useState(false);
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [appNo, setAppNo] = useState(null);
  const [transData, setTransData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const componentRef = useRef(null);
  const [auditData, setAuditData] = useState([]);
  const [document, setDocument] = useState([]);
  const [fitlerType, setFilterType] = useState([
    {
      id: 1,
      filterType: "Date",
      filterTypeMr: "तारीख",
    },
    {
      id: 2,
      filterType: "Application No.",
      filterTypeMr: "अर्ज क्र",
    },
    {
      id: 3,
      filterType: "Mobile No.",
      filterTypeMr: "मोबाईल क्र",
    },
    {
      id: 4,
      filterType: "Name",
      filterTypeMr: "नाव",
    },
  ]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en" ? "Old RTI Application" : "जुना आरटीआय अर्ज",
  });

  const getTransactions = async () => {
    if (!watch("fromDate") && !watch("toDate")) {
      sweetAlert(
        " ",
        language == "en"
          ? "Please Select From Date and To Date"
          : "कृपया निवडातारखेपासून आणि तारखेपर्यंत निवडा",
        "warning",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (!watch("fromDate") && watch("toDate")) {
      sweetAlert(
        " ",
        language == "en"
          ? "Please Select From Date"
          : "कृपया निवडातारखेपासून निवडा",
        "warning",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (watch("fromDate") && !watch("toDate")) {
      sweetAlert(
        " ",
        language == "en" ? "Please Select To Date" : "कृपया तारखेपर्यंत निवडा",
        "warning",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";
      const data = {
        fromDate: sendFromDate,
        toDate: sendToDate,
      };

      try {
        setIsLoading(true); // Set loading before sending API request
        const response = await axios.post(
          `${urls.RTI}/applicationDetails/getAllByCreatedDate`,
          data,
          {
            headers: headers,
          }
        );
        let result = response?.data?.applicationDetailsList;
        let _res = response?.data?.applicationDetailsList?.map((val, i) => {
          return {
            id: val.key,
            srNo: i + 1,
            applicantName:
              val.citizenFirstName != null &&
                val.citizenMiddleName != null &&
                val.citizenLastName != null
                ? val.citizenFirstName +
                " " +
                val.citizenMiddleName +
                " " +
                val.citizenLastName
                : "-",
            applicationDateOld:
              val.createDtTm === null
                ? "-"
                : moment(val.createDtTm).format("DD-MM-YYYY"),
            citizenMobileNumber:
              val.citizenMobileNumber != null &&
                val.citizenMobileNumber != "null"
                ? val.citizenMobileNumber
                : "-",
            applicationNo: val.applicationNo != null ? val.applicationNo : "-",
            subjectName: val.subjectName != null ? val.subjectName : "-",
            departmentName:
              val.departmentName != null ? val.departmentName : "-",
            finalRemark: val.finalRemark != null ? val.finalRemark : "-",
            status: val.status != null ? val.status : "-",
          };
        });
        setTransData(_res);
        setPageSize(10);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Application Number":
              r.applicationNo != null ? r.applicationNo : "-",
            "RTI Application Date":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),
            "Applicant Name":
              r.citizenFirstName != null &&
                r.citizenMiddleName != null &&
                r.citizenLastName != null
                ? r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName
                : "-",
            "Mobile No":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            "Subject Name": r.subjectName != null ? r.subjectName : "-",
            "Department Name":
              r.departmentName != null ? r.departmentName : "-",
            "Final Remark": r.finalRemark != null ? r.finalRemark : "-",

            Status: r.status != null ? r.status : "-",
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "अर्ज क्रमांक": r.applicationNo != null ? r.applicationNo : "-",
            "अर्जाची तारीख":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),

            "अर्जदाराचे नाव":
              r.citizenFirstName != null &&
                r.citizenMiddleName != null &&
                r.citizenLastName != null
                ? r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName
                : "-",
            "मोबाईल क्र":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            विषय: r.subjectName != null ? r.subjectName : "-",
            "विभागाचे नाव": r.departmentName != null ? r.departmentName : "-",
            "अंतिम टिप्पणी": r.finalRemark != null ? r.finalRemark : "-",
            स्थिती: r.status != null ? r.status : "-",
          }))
        );
        if (result.length === 0) {
          setDataNotAvail(true);
        } else {
          setDataNotAvail(false);
        }
        setFetchData(null);
        setIsLoading(false); // Stop loading
      } catch (error) {
        setIsLoading(false); // Stop loading in case of error
        cfcErrorCatchMethod(err, false);
      }
    }
  };

  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    console.log("DecryptPhoto", DecryptPhoto);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        console.log("r", r);
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        } else if (r?.data?.mimeType == "video/mp4") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <video width="100%" height="100%" controls>
                  <source src="${dataUrl}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              </body>
            </html>
          `);
        } else if (r?.data?.mimeType == "audio/mpeg") {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <audio controls>
                  <source src="${dataUrl}" type="audio/mpeg">
                  Your browser does not support the audio tag.
                </audio>
              </body>
            </html>
          `);
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else if (r?.data?.extension === ".docx") {
          console.log("");
          const data = base64ToArrayBuffer(r?.data?.fileName);
          const excelBlob = new Blob([data], {
            type: "application / vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          saveAs(excelBlob, "Document.docx");
        } else if (r?.data?.extension === ".xls") {
          const data = base64ToArrayBuffer(r?.data?.fileName);
          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(excelBlob, "Document.xlsx");
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
              </body>
            </html>
          `);
        }
      })
      .catch((error) => {
        console.log("error", error);
        cfcErrorCatchMethod(error, true);
      });
  };
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };

  const getByRTIApplication = (appNo) => {
    setIsLoading(true);
    axios
      .get(
        `${urls.RTI}/applicationDetails/getByApplicationNo?applicationNo=${appNo
          ?.replaceAll("+", "%2b")
          .trim()}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data;
        setFetchData(result);
        setTransData([]);
        setPageSize(10);
        setMrReportsData([]);
        setEngReportsData([]);
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getGrievanceByName = () => {
    setIsLoading(true);
    const firstName = watch("firstName") === "" ? null : watch("firstName");
    const middleName = watch("middleName") === "" ? null : watch("middleName");
    const lastName = watch("lastName") === "" ? null : watch("lastName");

    axios

      .get(
        `${urls.RTI}/applicationDetails/getByName?citizenFirstName=${firstName}&citizenMiddleName=${middleName}&citizenLastName=${lastName}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.applicationDetailsList;
        let _res = res?.data?.applicationDetailsList?.map((val, i) => {
          return {
            id: val.key,
            srNo: i + 1,
            applicantName:
              val.citizenFirstName != null &&
                val.citizenMiddleName != null &&
                val.citizenLastName != null
                ? val.citizenFirstName +
                " " +
                val.citizenMiddleName +
                " " +
                val.citizenLastName
                : "-",
            applicationDateOld:
              val.createDtTm === null
                ? "-"
                : moment(val.createDtTm).format("DD-MM-YYYY"),
            citizenMobileNumber:
              val.citizenMobileNumber == null &&
                val.citizenMobileNumber == "null"
                ? "-"
                : val.citizenMobileNumber,
            departmentName:
              val.departmentName != null ? val.departmentName : "-",
            subjectName: val.subjectName != null ? val.subjectName : "-",
            status: val.status != null ? val.status : "-",
            applicationNo: val.applicationNo != null ? val.applicationNo : "-",
          };
        });
        setPageSize(10);
        setTransData(_res);
        setFetchData(null);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Application Number":
              r.applicationNo != null ? r.applicationNo : "-",
            "RTI Application Date":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),
            "Applicant Name":
              r.citizenFirstName != null &&
                r.citizenMiddleName != null &&
                r.citizenLastName != null
                ? r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName
                : "-",
            "Mobile No":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            "Subject Name": r.subjectName != null ? r.subjectName : "-",
            "Department Name":
              r.departmentName != null ? r.departmentName : "-",
            "Final Remark": r.finalRemark != null ? r.finalRemark : "-",

            Status: r.status != null ? r.status : "-",
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "अर्ज क्रमांक": r.applicationNo != null ? r.applicationNo : "-",
            "अर्जाची तारीख":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),

            "अर्जदाराचे नाव":
              r.citizenFirstName === null &&
                r.citizenMiddleName === null &&
                r.citizenLastName === null
                ? "-"
                : r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName,
            "मोबाईल क्र":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            विषय: r.subjectName != null ? r.subjectName : "-",
            "विभागाचे नाव": r.departmentName != null ? r.departmentName : "-",
            "अंतिम टिप्पणी": r.finalRemark != null ? r.finalRemark : "-",
            स्थिती: r.status != null ? r.status : "-",
          }))
        );
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getRTIApplicationByMobileNo = (mobileNo) => {
    setIsLoading(true);
    axios
      .get(
        `${urls.RTI
        }/applicationDetails/getByCitizenMobileNumber?mobileNumber=${mobileNo
          ?.replaceAll("+", "%2b")
          .trim()}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.applicationDetailsList;
        let _res = res?.data?.applicationDetailsList?.map((val, i) => {
          return {
            id: val.key,
            srNo: i + 1,
            applicantName:
              val.citizenFirstName != null &&
                val.citizenMiddleName != null &&
                val.citizenLastName != null
                ? val.citizenFirstName +
                " " +
                val.citizenMiddleName +
                " " +
                val.citizenLastName
                : "-",
            applicationDateOld:
              val.createDtTm === null
                ? "-"
                : moment(val.createDtTm).format("DD-MM-YYYY"),
            citizenMobileNumber:
              val.citizenMobileNumber != null &&
                val.citizenMobileNumber != "null"
                ? val.citizenMobileNumber
                : "-",
            departmentName:
              val.departmentName != null ? val.departmentName : "-",
            subjectName: val.subjectName != null ? val.subjectName : "-",
            status: val.status != null ? val.status : "-",
            applicationNo: val.applicationNo != null ? val.applicationNo : "-",
          };
        });
        setTransData(_res);
        setFetchData(null);
        setPageSize(10);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Application Number":
              r.applicationNo != null ? r.applicationNo : "-",
            "RTI Application Date":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),
            "Applicant Name":
              r.citizenFirstName != null &&
                r.citizenMiddleName != null &&
                r.citizenLastName != null
                ? r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName
                : "-",
            "Mobile No":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            "Subject Name": r.subjectName != null ? r.subjectName : "-",
            "Department Name":
              r.departmentName != null ? r.departmentName : "-",
            "Final Remark": r.finalRemark != null ? r.finalRemark : "-",

            Status: r.status != null ? r.status : "-",
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "अर्ज क्रमांक": r.applicationNo != null ? r.applicationNo : "-",
            "अर्जाची तारीख":
              r.createDtTm == null
                ? "-"
                : moment(r.createDtTm).format("DD-MM-YYYY"),

            "अर्जदाराचे नाव":
              r.citizenFirstName != null &&
                r.citizenMiddleName != null &&
                r.citizenLastName != null
                ? r.citizenFirstName +
                " " +
                r.citizenMiddleName +
                " " +
                r.citizenLastName
                : "-",
            "मोबाईल क्र":
              r.citizenMobileNumber != null && r.citizenMobileNumber != "null"
                ? r.citizenMobileNumber
                : "-",
            विषय: r.subjectName != null ? r.subjectName : "-",
            "विभागाचे नाव": r.departmentName != null ? r.departmentName : "-",
            finalRemark: "-",
            स्थिती: r.status != null ? r.status : "-",
          }))
        );
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? "Old RTI Application List" : "जुनी आरटीआय अर्ज यादी";

    const date =
      language == "en"
        ? `DATE : From ${moment(watch("fromDate")).format(
          "Do-MMM-YYYY"
        )} To ${moment(watch("toDate")).format("Do-MMM-YYYY")}`
        : `दिनांक : ${moment(watch("fromDate")).format(
          "Do-MMM-YYYY"
        )} पासुन ते ${moment(watch("toDate")).format("Do-MMM-YYYY")} पर्यंत`;

    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const fileName =
      language == "en" ? "Old RTI Application List" : "जुनी आरटीआय अर्ज यादी";
    let col = () => { };
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A5" });
    ws.B1 = { t: "s", v: engHeading };
    ws.B2 = { t: "s", v: reportName };
    if (watch("fromDate") && watch("toDate")) {
      ws.B3 = { t: "s", v: date };
    }
    const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    ws["!merges"] = merge;

    const wb = { Sheets: { [fileName]: ws }, SheetNames: [fileName] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  const documentCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: "250",
    },
    {
      field: "originalFileName",
      headerName: language == "en" ? "Original File Name" : "मूळ फाइल नाव",
      headerAlign: "center",
      align: "left",
      flex: 3,
      width: "250",
    },
    {
      field: "Action",
      headerName: language == "en" ? "View" : "पहा",
      headerAlign: "center",
      align: "center",
      flex: 1,
      width: "50",
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                getFilePreview(record?.row?.encryptFilePath);
              }}
            >
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (fetchData != null) setDataonUi();
  }, [fetchData, language]);

  const setDataonUi = () => {
    let result = fetchData;
    let _res = result?.applicationTrackingDaos?.map((val, i) => {
      return {
        id: val.key,
        srNo: i + 1,
        userName:
          val.userName != null &&
            val.userMiddleName != null &&
            val.userLastName != null
            ? val.userName + " " + val.userMiddleName + " " + val.userLastName
            : "-",
        applicationDate:
          val.createDtTm === null
            ? "-"
            : moment(val.createDtTm).format("DD-MM-YYYY"),
        citizenMobileNumber:
          val.citizenMobileNumber != null && val.citizenMobileNumber != "null"
            ? val.citizenMobileNumber
            : "-",
        remark: val.reason != null ? val.reason : "-",
        subjectName: val.subjectName != null ? val.subjectName : "-",
        status: val.status != null ? val.status : "-",
        applicationNo: val.applicationNo != null ? val.applicationNo : "-",
      };
    });
    setAuditData(_res);
    setValue(
      "applicationDateOld",
      result.createDtTm != null ? result.createDtTm : "-"
    );
    setValue(
      "applicationNo",
      result.applicationNo != null ? result.applicationNo : "-"
    );
    setAppNo(result.applicationNo);
    setValue("status", result.status != null ? result.status : "-");
    setValue(
      "finalRemark",
      result.finalRemark != null ? result.finalRemark : "-"
    );
    setValue(
      "complaintDescription",
      result.description != null ? result.description : "-"
    );
    setValue("complaintType", result.subject != null ? result.subject : "-");
    setValue("deptName", result.department != null ? result.department : "-");
    setValue(
      "subDepartmentText",
      result.subDepartment != null ? result.subDepartment : "-"
    );
    setValue(
      "firstName",
      result.citizenFirstName != null ? result.citizenFirstName : "-"
    );
    setValue(
      "middleName",
      result.citizenMiddlename != null ? result.citizenMiddlename : "-"
    );
    setValue(
      "surname",
      result.citizenLastname != null ? result.citizenLastname : "-"
    );
    setValue(
      "citizenMobileNumber",
      result.citizenMobileNumber != null ? result.citizenMobileNumber : "-"
    );
    setValue(
      "rtiAdhikari",
      result.userName != null
        ? result.userName + " " + result.userLastName
        : "-"
    );
    setValue(
      "villageName",
      result.villageName != null ? result.villageName : "-"
    );
    setValue(
      "fullName",
      result.citizenFirstName != null &&
        result.citizenMiddleName != null &&
        result.citizenLastName != null
        ? result.citizenFirstName +
        " " +
        result.citizenMiddleName +
        " " +
        result.citizenLastName
        : "-"
    );
    setValue(
      "departmentName",
      result.departmentName != null ? result.departmentName : "-"
    );
    setValue(
      "subjectName",
      result.subjectName != null ? result.subjectName : "-"
    );
    setValue("event", result.event != null ? result.event : "-");
    setValue("category", result.category != null ? result.category : "-");
  };

  useEffect(() => {
    if (fetchData != null) setDataImageonUi();
  }, [fetchData]);

  let setDataImageonUi = () => {
    const result = fetchData;
    let res = [];
    if (result?.applicationAttachmentDaos?.length != 0) {
      result?.applicationAttachmentDaos?.map((temp, index) => {
        res.push({
          srNo: index + 1,
          id: temp.key,
          originalFileName: temp.filename,
          filePath: temp.newFilePath,
          encryptFilePath: temp.encryptFilePath,
        });
      });
      setDocument(res);
    } else {
      setDocument([]);
    }
  };

  const Auditcolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "userName",
      headerName:
        language === "en"
          ? "Name of department user "
          : "विभाग वापरकर्त्याचे नाव",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
  ];

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 300,
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationDateOld",
      headerName: <FormattedLabel id="applicationDateOld" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "citizenMobileNumber",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "subjectName",
      headerName: <FormattedLabel id="subjectName" />,

      flex: 3,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      align: "right",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/RTIOnlineSystem/reports/oldRTIApplication/trackOldRTIApplication",
                  query: { id: params.row.id },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW RTI APPLICATION AGAINST THIS ID ${params?.row?.id}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.id} या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <div>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: 1,
          }}
        >
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
                  <FormattedLabel id="trackOldRTIApplication" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          {(router.query.id === null || router.query.id === undefined) && (
            <div>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 15,
                  }}
                >
                  <FormControl
                    error={!!errors.application}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="searchFilter" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          variant="standard"
                          fullWidth
                          value={field.value}
                          onChange={(value) => {
                            setValue("fromDate", "");
                            setValue("toDate", "");
                            setValue("rtiApplicaationId", "");
                            setValue("mobileNo", "");
                            setValue("firstName", "");
                            setValue("lastName", "");
                            setValue("middleName", "");
                            if (
                              value.target.value === 1 ||
                              value.target.value === 3 ||
                              value.target.value === 4 ||
                              value.target.value === 5
                            ) {
                              setFetchData(null);
                              setTransData([]);
                              setPageSize(10);
                              setMrReportsData([]);
                              setEngReportsData([]);
                            }
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="applicationName" />}
                        >
                          {fitlerType &&
                            fitlerType.map((application, index) => (
                              <MenuItem
                                key={index}
                                value={application.id}
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                }}
                              >
                                {language === "en"
                                  ? application.filterType
                                  : application.filterTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="application"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.application ? errors.application.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {watch("application") === 1 && (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        gap: 15,
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", marginTop: "0px" }}
                        error={!!errors.fromDate}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                        gap: 15,
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white", marginTop: "0px" }}
                        error={!!errors.toDate}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                                minDate={watch("fromDate")}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {watch("application") === 2 && (
                  <Grid
                    item
                    xs={12}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <TextField
                      autoFocus
                      InputLabelProps={{
                        shrink: watch("applicationNo") ? true : false,
                      }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="outlined-basic"
                      label={
                        language === "en"
                          ? "Application Number"
                          : "अर्ज क्रमांक"
                      }
                      placeholder="Search by Application Number"
                      variant="standard"
                      {...register("applicationNo")}
                    />
                  </Grid>
                )}
                {watch("application") === 3 && (
                  <Grid
                    item
                    xs={12}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <TextField
                      autoFocus
                      InputLabelProps={{
                        shrink: watch("mobileNo") ? true : false,
                      }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="outlined-basic"
                      label={
                        language === "en" ? "Mobile Number" : "मोबाईल नंबर"
                      }
                      placeholder="Search by Mobile Number"
                      variant="standard"
                      {...register("mobileNo")}
                    />
                  </Grid>
                )}

                {watch("application") === 4 && (
                  <>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <TextField
                        autoFocus
                        InputLabelProps={{
                          shrink: watch("firstName") ? true : false,
                        }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        label={language === "en" ? "First Name" : "पहिले नाव"}
                        placeholder="Search by First Name"
                        variant="standard"
                        {...register("firstName")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <TextField
                        autoFocus
                        InputLabelProps={{
                          shrink: watch("middleName") ? true : false,
                        }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        label={language === "en" ? "Middle Name" : "मधले नाव"}
                        placeholder="Search by Middle Name"
                        variant="standard"
                        {...register("middleName")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      lg={3}
                      xl={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <TextField
                        autoFocus
                        InputLabelProps={{
                          shrink: watch("lastName") ? true : false,
                        }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="outlined-basic"
                        label={language === "en" ? "Last Name" : "आडनाव"}
                        placeholder="Search by Last Name"
                        variant="standard"
                        {...register("lastName")}
                      />
                    </Grid>
                  </>
                )}

                <Grid
                  item
                  xs={12}
                  md={2}
                  lg={2}
                  xl={2}
                  style={{
                    display: "flex",
                    alignItems: " flex-start",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    flexFlow: "column wrap",
                    placeContent: "stretch space-evenly",
                    alignContent: "space-around",
                  }}
                >
                  <Button
                    onClick={() => {
                      if (watch("application") === 1) {
                        setFetchData(null);
                        getTransactions();
                      } else if (watch("application") === 2) {
                        setTransData([]);
                        setMrReportsData([]);
                        setEngReportsData([]);
                        setPageSize(10);
                        getByRTIApplication(watch("applicationNo"));
                      } else if (watch("application") === 3) {
                        setTransData([]);
                        setMrReportsData([]);
                        setEngReportsData([]);
                        setPageSize(10);
                        getRTIApplicationByMobileNo(watch("mobileNo"));
                      } else if (watch("application") === 4) {
                        getGrievanceByName();
                        setTransData([]);
                        setPageSize(10);
                        setMrReportsData([]);
                        setEngReportsData([]);
                      }
                    }}
                    disabled={
                      watch("application") === 1
                        ? !watch("fromDate") && !watch("toDate")
                          ? true
                          : false
                        : watch("application") === 2
                          ? !watch("applicationNo")
                            ? true
                            : false
                          : watch("application") === 3
                            ? !watch("mobileNo")
                              ? true
                              : false
                            : watch("application") === 4
                              ? !watch("firstName") &&
                                !watch("middleName") &&
                                !watch("lastName")
                                ? true
                                : false
                              : false
                    }
                    size="small"
                  >
                    {language === "en" ? "get Details" : "तपशील मिळवा"}
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
          <div>
            {fetchData && (
              <>
                <hr
                  style={{
                    color: "black",
                    borderColor: "black",
                  }}
                />
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    endIcon={<DownloadIcon />}
                    size="small"
                    onClick={() => {
                      handlePrint();
                    }}
                  >
                    {language == "en" ? "Download PDF" : "पीडीएफ डाउनलोड करा"}
                  </Button>
                </Grid>
                <form>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        paddingTop: "20px",
                        paddingLeft: "10px",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ fontSize: "15px" }}>
                        {language === "en"
                          ? "Application Number : "
                          : "अर्ज क्रमांक :  "}{" "}
                        <strong>{appNo}</strong>
                      </div>
                    </Box>
                  </Box>
                  {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.grievanceRaiseDate}
                      >
                        <Controller
                          control={control}
                          name="applicationDateOld"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled
                                inputFormat={
                                  logedInUser === "departmentUser"
                                    ? "DD/MM/YYYY H:mm:ss"
                                    : "DD/MM/YYYY"
                                }
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="applicationDateOld" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      m: { xs: 0, md: 1 },
                                      minWidth: "100%",
                                    }}
                                    {...params}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.applicationDateOld
                            ? errors.applicationDateOld.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="fullName" />}
                        InputLabelProps={{
                          shrink: watch("fullName") ? true : false,
                        }}
                        {...register("fullName")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="mobileNo" />}
                        InputLabelProps={{
                          shrink: watch("citizenMobileNumber") ? true : false,
                        }}
                        variant="standard"
                        {...register("citizenMobileNumber")}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="villageName" />}
                        InputLabelProps={{
                          shrink: watch("villageName") ? true : false,
                        }}
                        variant="standard"
                        {...register("villageName")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="status" />}
                        InputLabelProps={{
                          shrink: watch("status") ? true : false,
                        }}
                        {...register("status")}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="subjectName" />}
                        InputLabelProps={{
                          shrink: watch("subjectName") ? true : false,
                        }}
                        variant="standard"
                        {...register("subjectName")}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="departmentName" />}
                        InputLabelProps={{
                          shrink: watch("departmentName") ? true : false,
                        }}
                        variant="standard"
                        {...register("departmentName")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="rtiAdhikariNm" />}
                        InputLabelProps={{
                          shrink: watch("rtiAdhikari") ? true : false,
                        }}
                        variant="standard"
                        {...register("rtiAdhikari")}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="finalRemark" />}
                        InputLabelProps={{
                          shrink: watch("finalRemark") ? true : false,
                        }}
                        variant="standard"
                        {...register("finalRemark")}
                      />
                    </Grid>
                  </Grid>

                  {document.length === 0 && (
                    <span
                      style={{
                        color: "red",
                        display: "flex",
                        textAlign: "center",
                        flexDirection: "column",
                      }}
                    >
                      {language == "en"
                        ? "NO DOCUMENTS TO SHOW HERE"
                        : "येथे दर्शविण्यासाठी कोणतेही दस्तऐवज नाहीत"}
                    </span>
                  )}
                  {document.length != 0 && (
                    <>
                      <Box>
                        <Grid
                          container
                          className={commonStyles.title}
                          style={{ marginBottom: "1rem", marginTop: "3rem" }}
                        >
                          <Grid item xs={12}>
                            <h3
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                marginRight: "2rem",
                              }}
                            >
                              <FormattedLabel id="documents" />
                            </h3>
                          </Grid>
                        </Grid>
                      </Box>
                      <div>
                        <DataGrid
                          sx={{
                            overflowY: "scroll",
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },
                          }}
                          autoHeight
                          disableSelectionOnClick
                          rows={document || []}
                          columns={documentCol}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </div>
                    </>
                  )}
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
                      <Grid item xs={12}>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            marginRight: "2rem",
                          }}
                        >
                          <FormattedLabel id="trackOldRTIApplicationHistory" />
                        </h3>
                      </Grid>
                    </Grid>
                    <DataGrid
                      autoHeight
                      sx={{
                        overflowY: "scroll",
                        marginTop: "10px",
                        backgroundColor: "white",
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          textOverflow: "unset !important",
                          whiteSpace: "break-spaces !important",
                          lineHeight: "1 !important",
                        },
                        "& .MuiDataGrid-cellContent": {
                          textOverflow: "unset !important",
                          whiteSpace: "break-spaces !important",
                          lineHeight: "1 !important",
                        },
                        "& .MuiDataGrid-cell:hover": {},
                        "& .MuiSvgIcon-root": {
                          color: "black", // change the color of the check mark here
                        },
                      }}
                      density="compact"
                      rows={auditData || []}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      columns={Auditcolumns}
                      disableSelectionOnClick
                    />
                  </Box>
                  {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        size="small"
                        onClick={() => {
                          {
                            logedInUser === "departmentUser" &&
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/dashboard/rtiDashboard",
                              });
                          }
                          {
                            logedInUser === "citizenUser" &&
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/dashboard/citizenUserDashboard",
                              });
                          }
                          {
                            logedInUser === "cfcUser" &&
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/dashboard/cfcUserDashboard",
                              });
                          }
                        }}
                      >
                        <FormattedLabel id="backToDashboard" />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </>
            )}
            {transData?.length != 0 && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    endIcon={<DownloadIcon />}
                    size="small"
                    onClick={() => {
                      language == "en"
                        ? generateCSVFile(engReportsData)
                        : generateCSVFile(mrReportsData);
                    }}
                  >
                    {language == "en" ? "Export Excel" : "एक्स्पोर्ट एक्सेल"}
                  </Button>
                </Grid>

                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {},
                    "& .MuiSvgIcon-root": {
                      color: "black", // change the color of the check mark here
                    },
                  }}
                  paginationMode="client"
                  density="standard"
                  rows={transData || []}
                  rowCount={transData?.length}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  columns={columns}
                  disableSelectionOnClick
                />
              </>
            )}

            {dataNotAvail && (
              <div>
                <p style={{ textAlign: "center" }}>Data Not Available</p>
              </div>
            )}
          </div>
        </Paper>
      </div>
      <div className={Styles.HideComponent}>
        <ReportLayout
          columnLength={5}
          componentRef={componentRef}
          deptName={{
            en: "RTI Online System",
            mr: "आरटीआय ऑनलाइन प्रणाली",
          }}
          reportName={{
            en: "Complete Details of the application",
            mr: "अर्जाचा संपूर्ण तपशील",
          }}
        >
          <ComponentToPrintNew
            dayWiseDataInDetails={fetchData}
            historyData={auditData}
            language={language}
          />
        </ReportLayout>
      </div>
    </ThemeProvider>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
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
                      ? "Complete Details of the application"
                      : "अर्जाचा संपूर्ण तपशील"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Application Number :"
                      : "अर्ज क्र.:"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.applicationNo}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "RTI Application Date :"
                      : "अर्जाची तारीख :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {moment(
                      this?.props?.dayWiseDataInDetails?.entryDate
                    ).format("DD-MM-YYYY")}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Applicant Name :"
                      : "अर्जदाराचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.citizenFirstName !=
                      null &&
                      this?.props?.dayWiseDataInDetails?.citizenMiddleName !=
                      null &&
                      this?.props?.dayWiseDataInDetails?.citizenLastName != null
                      ? this?.props?.dayWiseDataInDetails?.citizenFirstName +
                      " " +
                      this?.props?.dayWiseDataInDetails?.citizenMiddleName +
                      " " +
                      this?.props?.dayWiseDataInDetails?.citizenLastName
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Mobile No :"
                      : "मोबाईल क्र :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.citizenMobileNumber}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Village Name :"
                      : "गावाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.villageName != null
                      ? this?.props?.dayWiseDataInDetails?.villageName
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Status :" : "स्थिती :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.status}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Department Name :"
                      : " विभागाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.departmentName}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Subject Name :"
                      : "विषयाचे नाव :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.subjectName === null
                      ? "-"
                      : this?.props?.dayWiseDataInDetails?.subjectName}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Final Remark  :"
                      : "अंतिम टिप्पणी :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.finalRemark != null
                      ? this?.props?.dayWiseDataInDetails?.finalRemark
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "RTI Adhikari Name :"
                      : "आरटीआय अधिकारी नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.userName != null
                      ? this?.props?.dayWiseDataInDetails?.userName +
                      " " +
                      this?.props?.dayWiseDataInDetails?.userLastName
                      : "-"}
                  </td>
                </tr>

                <tr className={Styles.PageBreak}></tr>
                {/** second table header*/}
                <tr>
                  <td colSpan={5} className={Styles.Table2HEADER}>
                    {this?.props?.language == "en"
                      ? "History Of Track Old RTI Application"
                      : "जुन्या आरटीआय अर्जाचा इतिहास"}
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
                    {this?.props?.language == "en" ? "Status" : "स्थिती"}
                  </th>

                  <th colSpan={1} className={`${Styles.Table2Td}`}>
                    {this?.props?.language == "en" ? "Remark" : "शेरा"}
                  </th>
                </tr>
                {this?.props?.historyData &&
                  this?.props?.historyData?.map((data, index) => (
                    <>
                      <tr>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data.applicationDate}
                        </td>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data.userName === null ? "-" : data.userName}
                        </td>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data?.status}
                        </td>
                        <td colSpan={1} className={`${Styles.Table2Td}`}>
                          {data?.remark == "null" || data?.remark == undefined
                            ? "-"
                            : data?.remark}
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
