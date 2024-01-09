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
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import DownloadIcon from "@mui/icons-material/Download";
import Styles from "../oldGrievance/oldGrievance.module.css";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import XLSX from "sheetjs-style";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
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
  const [compalaintHistory, setCompalaintHistory] = useState([]);
  const language = useSelector((store) => store.labels.language);
  const [dataNotAvail, setDataNotAvail] = useState(false);
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [document, setDocument] = useState([]);
  const [tokenNo, setTokenNo] = useState(null);
  const [transData, setTransData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const headers = { Authorization: `Bearer ${user?.token}` };
  const componentRef = useRef(null)
  const [fitlerType, setFilterType] = useState([
    {
      id: 1,
      filterType: language == "en" ? "Date" : "तारीख",
    },
    {
      id: 2,
      filterType: language == "en" ? "Token No." : "टोकन क्र.",
    },
    {
      id: 3,
      filterType: language == "en" ? "Mobile No." : "मोबाइल नं.",
    },
    {
      id: 4,
      filterType: language == "en" ? "Event Type" : "कार्यक्रमाचा प्रकार",
    },
    {
      id: 5,
      filterType: language == "en" ? "Name" : "नाव",
    },
  ]);
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
  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      getGrievanceById(router.query.id);
    }
  }, [router.query.id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language === "en" ? "Old Grievance" : "जुनी तक्रार",
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
        oldFromDate: sendFromDate,
        oldToDate: sendToDate,
      };
      
      try {
        setIsLoading(true); // Set loading before sending API request
        const response = await axios.post(
          `${urls.GM}/archieveData/getByDate`,
          data,
          {
            headers: headers,
          }
        );
        let result = response?.data?.oldGrievance;
        let _res = response?.data?.oldGrievance?.map((val, i) => {
          return {
            id: val.grievanceKey,
            srNo: i + 1,
            applicantName:
              val.firstName === null &&
              val.middleName === null &&
              val.lastName === null
                ? "-"
                : val.firstName + " " + val.middleName + " " + val.lastName,
            grievanceDate: moment(val.entryDate).format("DD-MM-YYYY"),
            escDate: moment(val.expectedCompletionDate).format("DD-MM-YYYY"),
            mobileNo: val.mobileNo === null ? "-" : val.mobileNo,
            eventType: val.event === null ? "-" : val.event,
            complaintType: val.subject,
            complaintStatusText: val.stage,
            applicationNo: val.tokenNumber,
          };
        });
        setTransData(_res);
        setPageSize(10);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Token Number": r.tokenNumber,
            "Grievance Raised Date": moment(r.entryDate).format("DD-MM-YYYY"),
            "Applicant Name":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "Mobile No": r.mobileNo === null ? "-" : r.mobileNo,
            "Event Type": r.event === null ? "-" : r.event,
            Subject: r.subject,
            "Tentative Resolution Date": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            Status: r.stage,
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "टोकन क्रमांक": r.tokenNumber,
            "तक्रारीची तारीख": moment(r.entryDate).format("DD-MM-YYYY"),

            "अर्जदाराचे नाव":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "दूरध्वनी क्रमांक": r.mobileNo === null ? "-" : r.mobileNo,
            "कार्यक्रमाचा प्रकार": r.event === null ? "-" : r.event,
            विषय: r.subject,
            "तात्पुरत्या ठरावाची तारीख": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            स्थिती: r.stage,
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
        cfcErrorCatchMethod(error,false);
      }
    }
  };
  const historyColumns = [
    {
      field: "date",
      headerName: <FormattedLabel id="date" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "userName",
      headerName: <FormattedLabel id="userName" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "oldCondition",
      headerName: <FormattedLabel id="oldStatus" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "newCondition",
      headerName: <FormattedLabel id="newStatus" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
  ];

  const getGrievanceById = (tokenNo) => {
    setIsLoading(true);
    axios
      .get(
        `${urls.GM}/archieveData/getBytokenNo?tokenNo=${tokenNo
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
      .catch((error) => {
        setIsLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };

  const getGrievanceByName = () => {
    setIsLoading(true);
    const firstName = watch("firstName") === "" ? null : watch("firstName");
    const middleName = watch("middleName") === "" ? null : watch("middleName");
    const lastName = watch("lastName") === "" ? null : watch("lastName");

    axios
      .post(
        `${urls.GM}/archieveData/getByName?firstName=${firstName}&middleName=${middleName}&lastName=${lastName}`,
        {},
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.oldGrievance;
        let _res = res?.data?.oldGrievance?.map((val, i) => {
          return {
            id: val.grievanceKey,
            srNo: i + 1,
            applicantName:
              val.firstName === null &&
              val.middleName === null &&
              val.lastName === null
                ? "-"
                : val.firstName + " " + val.middleName + " " + val.lastName,
            grievanceDate: moment(val.entryDate).format("DD-MM-YYYY"),
            escDate: moment(val.expectedCompletionDate).format("DD-MM-YYYY"),
            mobileNo: val.mobileNo === null ? "-" : val.mobileNo,
            eventType: val.event === null ? "-" : val.event,
            complaintType: val.subject,
            complaintStatusText: val.stage,
            applicationNo: val.tokenNumber,
          };
        });
        setTransData(_res);
        setPageSize(10);
        setFetchData(null);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Token Number": r.tokenNumber,
            "Grievance Raised Date": moment(r.entryDate).format("DD-MM-YYYY"),
            "Applicant Name":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "Mobile No": r.mobileNo === null ? "-" : r.mobileNo,
            "Event Type": r.event === null ? "-" : r.event,
            Subject: r.subject,
            "Tentative Resolution Date": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            Status: r.stage,
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "टोकन क्रमांक": r.tokenNumber,
            "तक्रारीची तारीख": moment(r.entryDate).format("DD-MM-YYYY"),
            "अर्जदाराचे नाव":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "दूरध्वनी क्रमांक": r.mobileNo === null ? "-" : r.mobileNo,
            "कार्यक्रमाचा प्रकार": r.event === null ? "-" : r.event,
            विषय: r.subject,
            "तात्पुरत्या ठरावाची तारीख": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            स्थिती: r.stage,
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
        cfcErrorCatchMethod(err,false);
      });
  };
  const getGrievanceByEvent = (event) => {
    setIsLoading(true);
    axios
      .post(
        `${urls.GM}/archieveData/getByEvent?eventName=${event.trim()}`,
        {},
        { headers: headers }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.oldGrievance;
        let _res = res?.data?.oldGrievance?.map((val, i) => {
          return {
            id: val.grievanceKey,
            srNo: i + 1,
            applicantName:
              val.firstName === null &&
              val.middleName === null &&
              val.lastName === null
                ? "-"
                : val.firstName + " " + val.middleName + " " + val.lastName,
            grievanceDate: moment(val.entryDate).format("DD-MM-YYYY"),
            escDate: moment(val.expectedCompletionDate).format("DD-MM-YYYY"),
            mobileNo: val.mobileNo === null ? "-" : val.mobileNo,
            eventType: val.event === null ? "-" : val.event,
            complaintType: val.subject,
            complaintStatusText: val.stage,
            applicationNo: val.tokenNumber,
          };
        });
        setTransData(_res);
        setPageSize(10);
        setFetchData(null);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Token Number": r.tokenNumber,
            "Grievance Raised Date": moment(r.entryDate).format("DD-MM-YYYY"),
            "Applicant Name":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "Mobile No": r.mobileNo === null ? "-" : r.mobileNo,
            "Event Type": r.event === null ? "-" : r.event,
            Subject: r.subject,
            "Tentative Resolution Date": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            Status: r.stage,
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "टोकन क्रमांक": r.tokenNumber,
            "तक्रारीची तारीख": moment(r.entryDate).format("DD-MM-YYYY"),

            "अर्जदाराचे नाव":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "दूरध्वनी क्रमांक": r.mobileNo === null ? "-" : r.mobileNo,
            "कार्यक्रमाचा प्रकार": r.event === null ? "-" : r.event,
            विषय: r.subject,
            "तात्पुरत्या ठरावाची तारीख": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            स्थिती: r.stage,
          }))
        );
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };
  const getGrievanceByMobileNo = (mobileNo) => {
    setIsLoading(true);
    axios
      .post(
        `${urls.GM}/archieveData/getByMobileNumber?mobileNo=${mobileNo.trim()}`,
        {},
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.oldGrievance;
        let _res = res?.data?.oldGrievance?.map((val, i) => {
          return {
            id: val.grievanceKey,
            srNo: i + 1,
            applicantName:
              val.firstName === null &&
              val.middleName === null &&
              val.lastName === null
                ? "-"
                : val.firstName + " " + val.middleName + " " + val.lastName,
            grievanceDate: moment(val.entryDate).format("DD-MM-YYYY"),
            escDate: moment(val.expectedCompletionDate).format("DD-MM-YYYY"),
            mobileNo: val.mobileNo === null ? "-" : val.mobileNo,
            eventType: val.event === null ? "-" : val.event,
            complaintType: val.subject,
            complaintStatusText: val.stage,
            applicationNo: val.tokenNumber,
          };
        });
        setTransData(_res);
        setPageSize(10);
        setFetchData(null);
        setEngReportsData(
          result?.map((r, i) => ({
            "Sr.No": i + 1,
            "Token Number": r.tokenNumber,
            "Grievance Raised Date": r.tokenNumber,
            "Applicant Name":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "Mobile No": r.mobileNo === null ? "-" : r.mobileNo,
            "Event Type": r.event === null ? "-" : r.event,
            Subject: r.subject,
            "Tentative Resolution Date": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            Status: r.stage,
          }))
        );

        setMrReportsData(
          result?.map((r, i) => ({
            "अ.क्र.": i + 1,
            "टोकन क्रमांक": r.tokenNumber,
            "तक्रारीची तारीख": r.tokenNumber,
            "अर्जदाराचे नाव":
              r.firstName === null &&
              r.middleName === null &&
              r.lastName === null
                ? "-"
                : r.firstName + " " + r.middleName + " " + r.lastName,
            "दूरध्वनी क्रमांक": r.mobileNo === null ? "-" : r.mobileNo,
            "कार्यक्रमाचा प्रकार": r.event === null ? "-" : r.event,
            विषय: r.subject,
            "तात्पुरत्या ठरावाची तारीख": moment(
              r.expectedCompletionDate
            ).format("DD-MM-YYYY"),
            स्थिती: r.stage,
          }))
        );
        if (result.length != 0) {
          setDataNotAvail(false);
        } else {
          setDataNotAvail(true);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        cfcErrorCatchMethod(error,false);
      });
  };

  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en" ? "Old Grievance List" : "जुन्या तक्रारींची यादी";

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
      language == "en" ? "Old Grievance List" : "जुन्या तक्रारींची यादी";
    let col = () => {};
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

  const getFilePreview = (filePath) => {
    console.log("filePath", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        console.log("Shvani", r);
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
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
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
        }else if (r?.data?.extension === ".docx") {
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
        }  else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          console.log("dataUrl", dataUrl);
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
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
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

  useEffect(() => {
    if (fetchData != null) setDataImageonUi();
  }, [fetchData]);

  let setDataImageonUi = () => {
    const result = fetchData;
    let res = [];
    if (fetchData.newFilePath != null) {
      res.push({
        srNo: 1,
        id: "1",
        originalFileName: fetchData.newFilePath,
        filePath: fetchData.newFilePath,
        encryptFilePath:fetchData.encryptFilePath
      });
      setDocument(res);
    } else {
      setDocument([]);
    }
  };

  const setDataonUi = () => {
    let result = fetchData;
    if (result?.complaintHistoryDao?.length != 0) {
      let data = result.grievanceAuditTrailDaos;
      const comHistory = data?.map((item, index) => ({
        date: moment(item?.entryDate).format("DD-MM-YYYY"),
        userName:
          item.firstname === null &&
          item.middlename === null &&
          item.lastname === null
            ? "-"
            : item.firstname + " " + item.middlename + " " + item.lastname,
        id: index + 1,
        remark:
          item?.reason == null || item?.reason == undefined
            ? "-"
            : item?.reason,
        oldCondition: item?.stageFrom,
        newCondition: item?.stageTo,
      }));
      setCompalaintHistory(comHistory);
    } else {
      setCompalaintHistory([]);
    }

    setValue(
      "grievanceRaiseDate",
      result.entryDate != null ? result.entryDate : null
    );
    setValue(
      "grievanceId",
      result.tokenNumber != null ? result.tokenNumber : "-"
    );
    setTokenNo(result.tokenNumber);
    setValue("complaintStatusText", result.stage != null ? result.stage : "-");
    setValue("board", result.location != null ? result.location : "-");
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
    setValue("firstName", result.firstName != null ? result.firstName : "-");
    setValue("middleName", result.middleName != null ? result.middleName : "-");
    setValue("surname", result.middleName != null ? result.surname : "-");
    setValue(
      "fullName",
      result.firstName != null &&
        result.middleName != null &&
        result.lastName != null
        ? result.firstName + " " + result.middleName + " " + result.lastName
        : "-"
    );
    setValue("area", result.area != null ? result.area : "-");
    setValue("sourceType", result.sourceType != null ? result.sourceType : "-");
    setValue("event", result.event != null ? result.event : "-");
    setValue("category", result.category != null ? result.category : "-");
  };

 
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
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
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "eventType",
      headerName: language === "en" ? "Event Type" : "कार्यक्रमाचा प्रकार",
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "complaintType",
      headerName: <FormattedLabel id="subject" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },

    {
      field: "escDate",
      headerName:
        language === "en"
          ? "Tentative Resolution Date"
          : "तात्पुरत्या ठरावाची तारीख",
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "complaintStatusText",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ? (
              <div style={{ color: "orange" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            ) : (
              <div style={{ color: "green" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            )}
          </>
        );
      },
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
                    "/grievanceMonitoring/reports/oldGrievance/trackOldGrievance",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID ${params?.row?.id}`}
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
                  <FormattedLabel id="trackOldGrievance" />
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
                            setValue("grievanceId", "");

                            setValue("mobileNo", "");
                            setValue("event", "");
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
                                {application.filterType}
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
                        shrink: watch("grievanceId") ? true : false,
                      }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="outlined-basic"
                      label={
                        language === "en" ? "Token Number" : "टोकन क्रमांक"
                      }
                      placeholder="Search by Token Number"
                      variant="standard"
                      {...register("grievanceId")}
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
                      // gap: 15,
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
                        shrink: watch("event") ? true : false,
                      }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="outlined-basic"
                      label={
                        language === "en" ? "Event Type" : "कार्यक्रमाचा प्रकार"
                      }
                      placeholder="Search by Event Type"
                      variant="standard"
                      {...register("event")}
                    />
                  </Grid>
                )}
                {watch("application") === 5 && (
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
                        setPageSize(10);
                        setMrReportsData([]);
                        setEngReportsData([]);
                        getGrievanceById(watch("grievanceId"));
                      } else if (watch("application") === 3) {
                        setTransData([]);
                        setPageSize(10);
                        setMrReportsData([]);
                        setEngReportsData([]);
                        getGrievanceByMobileNo(watch("mobileNo"));
                      } else if (watch("application") === 4) {
                        setTransData([]);
                        setPageSize(10);
                        setMrReportsData([]);
                        setEngReportsData([]);
                        getGrievanceByEvent(watch("event"));
                      } else if (watch("application") === 5) {
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
                        ? !watch("grievanceId")
                          ? true
                          : false
                        : watch("application") === 3
                        ? !watch("mobileNo")
                          ? true
                          : false
                        : watch("application") === 4
                        ? !watch("event")
                          ? true
                          : false
                        : watch("application") === 5
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
                          ? "Token Number : "
                          : "टोकन क्रमांक :  "}{" "}
                        <strong>{tokenNo}</strong>
                      </div>
                    </Box>
                  </Box>
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
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        error={!!errors.grievanceRaiseDate}
                      >
                        <Controller
                          control={control}
                          name="grievanceRaiseDate"
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
                                    <FormattedLabel id="grievanceRaiseDate" />
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
                          {errors?.grievanceRaiseDate
                            ? errors.grievanceRaiseDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
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
                        label={<FormattedLabel id="complaintStatusText" />}
                        InputLabelProps={{
                          shrink: watch("complaintStatusText") ? true : false,
                        }}
                        {...register("complaintStatusText")}
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
                          shrink: watch("deptName") ? true : false,
                        }}
                        variant="standard"
                        {...register("deptName")}
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
                        label={<FormattedLabel id="subDepartmentName" />}
                        InputLabelProps={{
                          shrink: watch("subDepartmentText") ? true : false,
                        }}
                        variant="standard"
                        {...register("subDepartmentText")}
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
                        label={<FormattedLabel id="area" />}
                        InputLabelProps={{
                          shrink: watch("area") ? true : false,
                        }}
                        variant="standard"
                        {...register("area")}
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
                        label={<FormattedLabel id="grievanceCategory" />}
                        InputLabelProps={{
                          shrink: watch("category") ? true : false,
                        }}
                        variant="standard"
                        {...register("category")}
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
                        label={<FormattedLabel id="eventName" />}
                        InputLabelProps={{
                          shrink: watch("event") ? true : false,
                        }}
                        variant="standard"
                        {...register("event")}
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
                        label={<FormattedLabel id="sourceType" />}
                        InputLabelProps={{
                          shrink: watch("sourceType") ? true : false,
                        }}
                        variant="standard"
                        {...register("sourceType")}
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
                        multiline
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="subject" />}
                        InputLabelProps={{
                          shrink: watch("complaintType") ? true : false,
                        }}
                        variant="standard"
                        {...register("complaintType")}
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
                        label={<FormattedLabel id="complaintDescription" />}
                        multiline
                        InputLabelProps={{
                          shrink: watch("complaintDescription") ? true : false,
                        }}
                        id="standard-basic"
                        variant="standard"
                        {...register("complaintDescription")}
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
                              <FormattedLabel id="citizenUploaded" />
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
                          <FormattedLabel id="complaintHistory" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
                    autoHeight
                    sx={{
                      overflowY: "scroll",
                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },
                    }}
                    density="compact"
                    pagination
                    paginationMode="server"
                    rowsPerPageOptions={[5]}
                    rows={compalaintHistory || []}
                    columns={historyColumns}
                  />

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
                                  "/grievanceMonitoring/dashboards/deptUserDashboard",
                              });
                          }
                          {
                            logedInUser === "citizenUser" &&
                              router.push({
                                pathname:
                                  "/grievanceMonitoring/dashboards/citizenUserDashboard",
                              });
                          }
                          {
                            logedInUser === "cfcUser" &&
                              router.push({
                                pathname:
                                  "/grievanceMonitoring/dashboards/cfcUserDashboard",
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
            {transData.length != 0 && (
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

                    "& .MuiDataGrid-cell:hover": {
                    },
                    "& .MuiSvgIcon-root": {
                      color: "black", // change the color of the check mark here
                    },
                  }}
                 
                  paginationMode="client"
                  density="standard"
                  rows={transData || []}
                  rowCount={transData.length}
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
            en: "Grievance Monitoring System",
            mr: "तक्रार निवारण प्रणाली",
          }}
          reportName={{
            en: "Complete Details of the Complaint",
            mr: "तक्रारीचा संपूर्ण तपशील",
          }}
        >
          <ComponentToPrintNew
            dayWiseDataInDetails={fetchData}
            language={language}
          />
        </ReportLayout>
      </div>
    </ThemeProvider>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
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
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Token Number :"
                      : "टोकन क्र.:"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.tokenNumber}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Grievance Raised Date :"
                      : "तक्रारीची तारीख :"}
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
                      ? "Grievance Raised By :"
                      : "यांनी मांडलेली तक्रार :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.firstName != null &&
                    this?.props?.dayWiseDataInDetails?.middleName != null &&
                    this?.props?.dayWiseDataInDetails?.lastName != null
                      ? this?.props?.dayWiseDataInDetails?.firstName +
                        " " +
                        this?.props?.dayWiseDataInDetails?.middleName +
                        " " +
                        this?.props?.dayWiseDataInDetails?.lastName
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Status :" : "स्थिती :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.stage}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Mobile No. :"
                      : "संर्पक तपशील :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.mobileNo === null
                      ? "-"
                      : this?.props?.dayWiseDataInDetails?.mobileNo}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Address :" : " ठिकाण :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.location}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Department :" : "विभाग :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.department === null
                      ? "-"
                      : this?.props?.dayWiseDataInDetails?.department}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Sub Department :"
                      : "उप-विभाग :"}{" "}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.subDepartment === null
                      ? "-"
                      : this?.props?.dayWiseDataInDetails?.subDepartment}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Area  :" : "क्षेत्र :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.area != null
                      ? this?.props?.dayWiseDataInDetails?.area
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Category  :" : "श्रेणी :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.category != null
                      ? this?.props?.dayWiseDataInDetails?.category
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? "Event Name :"
                      : "कार्यक्रमाचे नाव :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.eventName != null
                      ? this?.props?.dayWiseDataInDetails?.eventName
                      : "-"}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {" "}
                    {this?.props?.language == "en"
                      ? "Source Type :"
                      : "स्रोत प्रकार :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.sourceType != null
                      ? this?.props?.dayWiseDataInDetails?.sourceType
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en" ? "Subject :" : " विषय :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.subject}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className={`${Styles.Table1Td}`}>
                    {this?.props?.language == "en"
                      ? " Description :"
                      : " वर्णन :"}
                  </td>
                  <td colSpan={3} className={`${Styles.Table12Td}`}>
                    {this?.props?.dayWiseDataInDetails?.description}
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
                {this?.props?.dayWiseDataInDetails?.grievanceAuditTrailDaos &&
                  this?.props?.dayWiseDataInDetails?.grievanceAuditTrailDaos?.map(
                    (data, index) => (
                      <tr>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {moment(data?.entryDate).format("DD-MM-YYYY") ==
                          "Invalid date"
                            ? " - "
                            : moment(data?.entryDate).format("DD-MM-YYYY")}
                        </td>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data.firstname === null &&
                          data.middlename === null &&
                          data.lastname === null
                            ? "-"
                            : data.firstname +
                              " " +
                              data.middlename +
                              " " +
                              data.lastname}
                        </td>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data?.stageFrom}
                        </td>
                        <td
                          colSpan={1}
                          className={`${Styles.TableComplaintInfo2Td}`}
                        >
                          {data?.stageTo}
                        </td>
                        <td colSpan={1} className={`${Styles.Table2Td}`}>
                          {data?.reason == "null" || data?.reason == undefined
                            ? "-"
                            : data?.reason}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
