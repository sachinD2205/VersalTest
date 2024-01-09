import { ThemeProvider } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,Paper,Grid,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ClearIcon from "@mui/icons-material/Clear";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import "jspdf-autotable";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import ReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import gmReportLayoutCss from "../commonCss/gmReportLayoutCss.module.css";
import XLSX from "sheetjs-style";
import FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [medias, setMedias] = useState([]);
  const [statuss, setStatuss] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [complaintSubTypes, setComplaintSubTypes] = useState([]);
  const [selectedValuesOfDepartments, setSelectedValuesOfDepartments] = useState([]);
  const [selectedValuesOfSpecialEvents, setSelectedValuesOfSpecialEvents] =useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDept, setLoadingDept] = useState(false);
  const [loadingSubDept, setLoadingSubDept] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingSpecialEvents, setLoadingSpecialEvents] = useState(false);
  const [loadingComplaintType, setLoadingComplaintType] = useState(false);
  const [loadingComplaintSubType, setLoadingComplaintSubType] = useState(false);
  const [subDepartments, setSubDepartment] = useState([]);
  const [selectedValuesOfSubDept, setSelectedValuesOfSubDept] = useState([]);
  const [statusValue, setStatusValue] = useState(null);
  const [eventValue, setEventValue] = useState(null);
  const [complaintTypeIdValue, setComplaintTypeIdValue] = useState(null);
  const [complaintSubTypeValue, setComplaintSubTypeValue] = useState(null);
  const language = useSelector((store) => store.labels.language);
  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
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

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const currDate = new Date();

  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);

  const getAllMedias = () => {
    setLoadingEvent(true);
    axios
      .get(`${urls.GM}/mediaMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.mediaMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            mediaTypeEn: r.mediaName,
            mediaTypeMr: r.mediaNameMr,
          }));
          data.sort(sortByProperty("mediaTypeEn"));
          setMedias(data);
          setLoadingEvent(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingEvent(false);
        }
      })
      .catch((error) => {
          setLoadingEvent(false);
          cfcErrorCatchMethod(error,false);
      });
  };

  const getAllDepartments = () => {
    setLoadingDept(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.department?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentEn: r.department,
            departmentMr: r.departmentMr,
          }));
          data.sort(sortByProperty("departmentEn"));
          setDepartments(data);
          setLoadingDept(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingDept(false);
        }
      })
      .catch((error) => {
          setLoadingDept(false);
          cfcErrorCatchMethod(error,true);
      });
  };

  ///////////////////////////////////////
  const getAllStatus = () => {
    setLoadingStatus(true);
    axios
      .get(`${urls.GM}/complaintStatusMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.complaintStatusMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintStatus: r.complaintStatus,
            complaintStatusMr: r.complaintStatusMr,
          }));
          data.sort(sortByProperty("complaintStatus"));
          setStatuss(data);
          setLoadingStatus(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingStatus(false);
        }
      })
      .catch((error) => {
          setLoadingStatus(false);
          cfcErrorCatchMethod(error,false);
      });
  };


  ///////////////////////////////////////
  const getAllEvents = () => {
    setLoadingSpecialEvents(true);
    axios
      .get(`${urls.GM}/eventTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.eventTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            eventTypeEn: r.eventType,
            eventTypeMr: r.eventTypeMr,
          }));
          data.sort(sortByProperty("eventTypeEn"));
          setEvents(data);
          setLoadingSpecialEvents(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingSpecialEvents(false);
        }
      })
      .catch((error) => {
          setLoadingSpecialEvents(false);
          cfcErrorCatchMethod(error,false);
      });
  };

  ///////////////////////////////////////
  const getAllComplaintsTypes = () => {
    setLoadingComplaintType(true);
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintTypeEn: r.complaintType,
            complaintTypeMr: r.complaintTypeMr,
          }));
          data.sort(sortByProperty("complaintTypeEn"));
          setComplaintTypes(data);
          setLoadingComplaintType(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingComplaintType(false);
        }
      })
      .catch((error) => {
          setLoadingComplaintType(false);
          cfcErrorCatchMethod(error,false);
      });
  };

  ///////////////////////////////////////
  const getAllComplaintsSubTypes = () => {
    setLoadingComplaintSubType(true);
    axios
      .get(
        `${urls.GM}/complaintSubTypeMaster/getAllByCmplId?id=${complaintTypeIdValue}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.complaintSubTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintSubType: r.complaintSubType,
            complaintSubTypeMr: r.complaintSubTypeMr,
          }));
          data.sort(sortByProperty("complaintSubType"));
          setComplaintSubTypes(data);
          setLoadingComplaintSubType(false);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!"
          );
          setLoadingComplaintSubType(false);
        }
      })
      .catch((error) => {
         setLoadingComplaintSubType(false);
         cfcErrorCatchMethod(error,false);
      });
  };

  useEffect(() => {
    getAllMedias(); //>>>>>>> EVENTS
    getAllDepartments();
    getAllStatus();
    getAllEvents(); //>>>>>>> SPECIAL EVENTS
    getAllComplaintsTypes();
    setValue("searchButtonInputState", true);
  }, []);

  const getSubDepartmentDetails = () => {
    if (selectedValuesOfDepartments.length != 0) {
      setLoading(true);
      setLoadingSubDept(true);
      axios
        .get(
          `${urls.GM}/master/subDepartment/getAllByDeptWise/${selectedValuesOfDepartments[0]}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            let data = res?.data?.subDepartment?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              departmentId: r.department,
              subDepartmentEn: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }));
            data.sort(sortByProperty("subDepartmentEn"));
            setSubDepartment(data);
            setLoading(false);
            setLoadingSubDept(false);
          } else {
            sweetAlert(
              language == "en"
                ? "Something Went To Wrong !"
                : "काहीतरी चूक झाली!"
            );
            setLoading(false);
            setLoadingSubDept(false);
          }
        })
        .catch((error) => {
            setLoading(false);
            setLoadingSubDept(false);
            cfcErrorCatchMethod(error,false);
        });
    }
  };

  useEffect(() => {
    if (selectedValuesOfDepartments?.length == 1) {
      getSubDepartmentDetails();
    } else {
      setSubDepartment([]);
      setSelectedValuesOfSubDept([]);
    }
  }, [selectedValuesOfDepartments]);

  useEffect(() => {
    if (complaintTypeIdValue != null) {
      getAllComplaintsSubTypes();
    } else {
      setComplaintSubTypes([]);
      setComplaintSubTypeValue(null);
    }
  }, [complaintTypeIdValue]);

  let resetValuesCancell = {
    mobileNo: "",
    email: "",
    firstName: "",
    lastName: "",
    mobileNo: "",
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setValue("searchButtonInputState", true);
    setLoading(false);
    setData([]);
  };

  const exitButton = () => {
    router.push(`/grievanceMonitoring/dashboards/deptUserDashboard`);
  };


  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let apiBodyToSend = {
        fromDate: sendFromDate,
        toDate: sendToDate,
        lstDepartment:
          selectedValuesOfDepartments?.length > 0
            ? selectedValuesOfDepartments
            : [],
        lstSubDepartment:
          selectedValuesOfSubDept?.length > 0 ? selectedValuesOfSubDept : [],
        splevent:
          selectedValuesOfSpecialEvents?.length > 0
            ? selectedValuesOfSpecialEvents
            : [],
        status: statusValue != null ? statusValue : null,
        mediaId: eventValue != null ? eventValue : null,
        complaintTypeId:
          complaintTypeIdValue != null ? complaintTypeIdValue : null,
        complaintSubTypeId:
          complaintSubTypeValue != null ? complaintSubTypeValue : null,
        mobileNo: watch("mobileNo") ? Number(watch("mobileNo")) : null,
        email: watch("email") ? watch("email") : null,
        firstName: watch("firstName") ? watch("firstName") : null,
        lastName: watch("lastName") ? watch("lastName") : null,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(
          `${urls.GM}/report/getReportSubjectAndContactWiseDetailsV3`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setValue("searchButtonInputState", false);
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  departmentName: newFunctionForNullValues("en", r.department),
                  departmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.departmentMr
                  ),
                  subDepartmentName: newFunctionForNullValues(
                    "en",
                    r.subDepartmentName
                  ),
                  subDepartmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.subDepartmentNameMr
                  ),
                  NameOfCitizen: r.NameOfCitizen,
                  NameOfCitizenMr: r.NameOfCitizenMr,

                  eventName: r.eventName,
                  eventNameMr: r.eventNameMr,

                  address: r.address,
                  addressMr: r.addressMr,

                  emailId: r.emailId,
                  mobileNo: r.mobileNo ? r.mobileNo : "Not Available",

                  subject: r.subject,
                  subjectMr: r.subjectMr,

                  stage:r.reopenCount > 0 && r.stage === "Open" ?'Reopen': r.stage,
                  stageMr:r.reopenCount > 0 && r.stage === "Open" ?'पुन्हा उघडले':  r.stageMr,

                  hodName: r.hodName,
                  hodNameMr: r.hodNameMr,

                  remark: r.remark,

                  splEvent: newFunctionForNullValues("en", r.splEvent),
                  splEventMr: newFunctionForNullValues("mr", r.splEventMr),

                  closeDate: r.closeDate
                    ? moment(r.closeDate)?.format("DD-MM-YYYY")
                    : "-",
                  grivDate: moment(r.grivDate)?.format("DD-MM-YYYY"),
                }))
              );

              let _enData = res?.data?.map((r, i) => {
                return {
                  "Sr No": i + 1,
                  "Citizen Name": r?.NameOfCitizen,
                  "Mobile / Phone No ": r?.mobileNo,
                  "Email-Id": r?.emailId,
                  "Citizen Address": r?.address,
                  Subject: r?.subject,
                  "Department Name": r?.department,
                  "Sub-Department Name": r?.subDepartmentName,
                  "Event Name": r?.eventName,
                  "Special Event": r?.splEvent,
                  "HOD Name": r?.hodName,
                  "Grievance Date": r?.grivDate,
                  "Grievance Close Date": r?.closeDate,
                  Remark: r?.remark,
                  Status:r.reopenCount > 0 && r.stage === "Open" ?'Reopen':  r?.stage,
                };
              });
              let _mrData = res?.data?.map((r, i) => {
                return {
                  "अ.क्र. ": i + 1,
                  "नागरिकाचे नाव": r?.NameOfCitizenMr,
                  "दूरध्वनी क्रमांक": r?.mobileNo,
                  "ई-मेल आयडी": r?.emailId,
                  "नागरिकांचा पत्ता": r?.addressMr,
                  विषय: r?.subjectMr,
                  "विभाग": r?.departmentMr,
                  "उप-विभाग": r?.subDepartmentNameMr,
                  "कार्यक्रमाचे नाव": r?.eventName,
                  "विशेष कार्यक्रम": r?.splEventMr,
                  "एचओडीचे नाव": r?.hodNameMr,
                  "तक्रार तारीख": r?.grivDate,
                  "तक्रार बंद तारीख": r?.closeDate,
                  शेरा: r?.remark,
                  स्थिती:r.reopenCount > 0 && r.stage === "Open" ?'पुन्हा उघडले':  r?.stageMr,
                };
              });
              setEngReportsData(_enData);
              setMrReportsData(_mrData);

              setLoading(false);
              setSubDepartment([]);
              setComplaintSubTypes([]);
            } else {
              setLoading(false);
              sweetAlert({
                title: language === "en" ? "OOPS!" : "क्षमस्व!",
                text:
                  language === "en"
                    ? "There is nothing to show you!"
                    : "माहिती उपलब्ध नाही",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              }).then((will)=>{
                if(will){
                  setData([]);
                  setEngReportsData([]);
                  setMrReportsData([]);
                }
              });
              
            }
          } else {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            sweetAlert(language == "en"
            ? "Something Went To Wrong !"
            : "काहीतरी चूक झाली!");
            setLoading(false);
            /////////////////NEW///////////
            setSelectedValuesOfDepartments([]);
            setSelectedValuesOfSpecialEvents([]);
            setStatusValue([]);
            setEventValue([]);
            setSubDepartment([]);
            setComplaintSubTypes([]);
          }
        })
        .catch((error) => {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            setLoading(false);
            setSubDepartment([]);
            setComplaintSubTypes([]);
            cfcErrorCatchMethod(error,false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? "From and To Both Dates Are Required!"
            : "पासून आणि पर्यंत दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  ///////////////////////////
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };

  const columns = [
    {
      field: "id",
      headerName: labels.srNo,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "NameOfCitizen" : "NameOfCitizenMr",
      headerName: labels.citizenName,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: "mobileNo",
      headerName: labels.mobileNo,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      headerName: labels.emailIds,
      minWidth: 270,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "address" : "addressMr",
      headerName: labels.citizenAddress,
      minWidth: 400,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subject" : "subjectMr",
      headerName: labels.subject,
      minWidth: 400,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: labels.departmentName,
      minWidth: 350,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "subDepartmentName" : "subDepartmentNameMr",
      headerName: labels.subDepartmentName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "eventName" : "eventName",
      headerName: labels.eventName,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "splEvent" : "splEventMr",
      headerName: labels.splEvent,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "hodName" : "hodNameMr",
      headerName: labels.hodName,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: "grivDate",
      headerName: labels.grivDate,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "closeDate",
      headerName: labels.closeDate,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remark",
      headerName: labels.remark,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "stage" : "stageMr",
      headerName: labels.statuss,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    const engHeading =
      language == "en"
        ? "PIMPRI CHINCHWAD MUNICIPAL CORPORATION 411018"
        : "पिंपरी चिंचवड महानगरपालिका  पिंपरी  ४११०१८";
    const reportName =
      language == "en"
        ? "Subject And Contact Wise Report"
        : "विषय आणि संपर्कनिहाय अहवाल";

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
      language === "en" ? "Subject and contact wise" : "विषय आणि संपर्कनिहाय";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A5" });
    ws.B1 = { t: "s", v: engHeading };
    ws.B2 = { t: "s", v: reportName };
    ws.B3 = { t: "s", v: date };
    const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    ws["!merges"] = merge;

    const wb = { Sheets: { [fileName]: ws }, SheetNames: [fileName] };

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }



  const handleSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfDepartments(selectedIds);
  };

  const handleSelectForSubDept = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedValuesOfSubDept(selectedIds);
  };

  const handleSelectSpecialEvents = (evt, value) => {
    const selectedIds = value.map((val) => val.id);
    setSelectedValuesOfSpecialEvents(selectedIds);
  };
  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
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
                  {language == "en"
                    ? "Subject And Contact Wise Report"
                    : "विषय आणि संपर्कनिहाय अहवाल"}
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Box
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
              <form onSubmit={handleSubmit(onSubmitFunc)} autoComplete="off">
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
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
                    <FormControl style={{ backgroundColor: "white" }}>
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
                                  <FormattedLabel id="fromDate" required />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
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
                    <FormControl style={{ backgroundColor: "white" }}>
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={currDate}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disableFuture
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" required />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
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
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
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
                      marginTop: "20px",
                    }}
                  >
                    {loadingDept ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="departmentName" />
                          </InputLabel>
                          <Select
                            autoFocus
                            variant="standard"
                            sx={{ width: "230px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>

                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={departments}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                          language === "en"
                            ? option.departmentEn
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.departmentMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        onChange={handleSelect}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.departmentEn
                              : option.departmentMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: "230px", margin: 0 }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="departmentName" />}
                          />
                        )}
                      />
                    )}
                  </Grid>
                  {selectedValuesOfDepartments?.length == 1 &&
                    subDepartments?.length !== 0 && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        {loadingSubDept ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <FormControl>
                              <InputLabel>
                                <FormattedLabel id="subDepartmentName" />
                              </InputLabel>
                              <Select
                                autoFocus
                                variant="standard"
                                sx={{ width: "230px" }}
                                multiple
                              ></Select>
                            </FormControl>

                            <CircularProgress size={15} color="error" />
                          </div>
                        ) : (
                          <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={subDepartments ? subDepartments : []}
                            disableCloseOnSelect
                            getOptionLabel={(option) =>
                              language === "en"
                                ? option.subDepartmentEn
                                    ?.split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                : option.subDepartmentMr
                                    ?.split(" ")
                                    .map((word) => word.charAt(0))
                                    .join(" ")
                            }
                            onChange={handleSelectForSubDept}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  checked={selected}
                                />
                                {language === "en"
                                  ? option.subDepartmentEn
                                  : option.subDepartmentMr}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "230px", margin: 0 }}
                                variant="standard"
                                {...params}
                                label={
                                  <FormattedLabel id="subDepartmentName" />
                                }
                              />
                            )}
                          />
                        )}
                      </Grid>
                    )}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      marginTop: "20px",
                    }}
                  >
                    {loadingSpecialEvents ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="event" />
                          </InputLabel>
                          <Select
                            autoFocus
                            variant="standard"
                            sx={{ width: "230px" }}
                            multiple
                            fullWidth
                            value={selectedValuesOfSpecialEvents}
                            onChange={handleSelectSpecialEvents}
                          ></Select>
                        </FormControl>

                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={events}
                        disableCloseOnSelect
                        getOptionLabel={(option) =>
                          language === "en"
                            ? option.eventTypeEn
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : option.eventTypeMr
                                ?.split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        onChange={handleSelectSpecialEvents}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.eventTypeEn
                              : option.eventTypeMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: "230px", margin: 0 }}
                            variant="standard"
                            {...params}
                            label={<FormattedLabel id="event" />}
                          />
                        )}
                      />
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      marginTop: "20px",
                    }}
                  >
                    {loadingStatus ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="statuss" />
                          </InputLabel>
                          <Select
                            variant="standard"
                            sx={{ width: "230px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        id="disable-close-on-select"
                        disableCloseOnSelect
                        options={statuss ? statuss : []}
                        getOptionLabel={(option) =>
                          language == "en"
                            ? option.complaintStatus
                            : option.complaintStatusMr
                        }
                        onChange={(event, newValue) => {
                          setStatusValue(newValue?.id ? newValue?.id : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: "230px", margin: 0 }}
                            label={<FormattedLabel id="statuss" />}
                            variant="standard"
                          />
                        )}
                      />
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      marginTop: "20px",
                    }}
                  >
                    {loadingEvent ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="eventNames" />
                          </InputLabel>
                          <Select
                            variant="standard"
                            sx={{ width: "230px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        id="disable-close-on-select"
                        disableCloseOnSelect
                        options={medias ? medias : []}
                        getOptionLabel={(option) =>
                          language == "en"
                            ? option.mediaTypeEn
                            : option.mediaTypeMr
                        }
                        onChange={(event, newValue) => {
                          setEventValue(newValue?.id ? newValue?.id : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: "230px", margin: 0 }}
                            label={<FormattedLabel id="eventNames" />}
                            variant="standard"
                          />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      marginTop: "20px",
                    }}
                  >
                    {loadingComplaintType ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="complaintTypes" />
                          </InputLabel>
                          <Select
                            variant="standard"
                            sx={{ width: "230px" }}
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <Autocomplete
                        id="disable-close-on-select"
                        disableCloseOnSelect
                        options={complaintTypes ? complaintTypes : []}
                        getOptionLabel={(option) =>
                          language == "en"
                            ? option.complaintTypeEn
                            : option.complaintTypeEnMr
                        }
                        onChange={(event, newValue) => {
                          setComplaintTypeIdValue(
                            newValue?.id ? newValue?.id : null
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            sx={{ width: "230px", margin: 0 }}
                            label={<FormattedLabel id="complaintTypes" />}
                            variant="standard"
                          />
                        )}
                      />
                    )}
                  </Grid>

                  {complaintTypeIdValue != null &&
                    complaintSubTypes?.length !== 0 && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                          marginTop: "20px",
                        }}
                      >
                        {loadingComplaintSubType ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <FormControl>
                              <InputLabel>
                                <FormattedLabel id="complaintSubTypes" />
                              </InputLabel>
                              <Select
                                variant="standard"
                                sx={{ width: "230px" }}
                                multiple
                                fullWidth
                              ></Select>
                            </FormControl>
                            <CircularProgress size={15} color="error" />
                          </div>
                        ) : (
                          <Autocomplete
                            id="disable-close-on-select"
                            disableCloseOnSelect
                            options={complaintSubTypes ? complaintSubTypes : []}
                            getOptionLabel={(option) =>
                              language == "en"
                                ? option.complaintSubType
                                : option.complaintSubTypeMr
                            }
                            onChange={(event, newValue) => {
                              setComplaintSubTypeValue(
                                newValue?.id ? newValue?.id : null
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{ width: "230px", margin: 0 }}
                                label={
                                  <FormattedLabel id="complaintSubTypes" />
                                }
                                variant="standard"
                              />
                            )}
                          />
                        )}
                      </Grid>
                    )}
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
                      id="standard-basic"
                      label={<FormattedLabel id="firstNames" />}
                      variant="standard"
                      {...register("firstName")}
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
                      id="standard-basic"
                      label={<FormattedLabel id="lastNameV" />}
                      variant="standard"
                      {...register("lastName")}
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
                      id="standard-basic"
                      label={<FormattedLabel id="mobileNo" />}
                      variant="standard"
                      {...register("mobileNo")}
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
                      id="standard-basic"
                      label={<FormattedLabel id="emailIds" />}
                      variant="standard"
                      {...register("email")}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  {watch("searchButtonInputState") == true ? (
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
                      <Button
                        size="small"
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SearchIcon />}
                      >
                        {language == "en" ? "Search" : "शोधा"}
                      </Button>
                    </Grid>
                  ) : (
                    <>
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
                        <Button
                          size="small"
                          disabled={data?.length > 0 ? false : true}
                          type="button"
                          variant="contained"
                          color="success"
                          endIcon={<ListAltIcon />}
                          onClick={() =>
                            language == "en"
                              ? generateCSVFile(engReportsData)
                              : generateCSVFile(mrReportsData)
                          }
                        >
                          {language == "en"
                            ? "Download Excel"
                            : "एक्सेल डाउनलोड करा"}
                        </Button>
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

                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          onClick={handlePrint}
                          size="small"
                        >
                          <FormattedLabel id="print" />
                        </Button>
                      </Grid>
                    </>
                  )}

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
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => onCancel()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
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
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            {loading ? (
              <>
                <CommonLoader />
              </>
            ) : data.length !== 0 ? (
              <div style={{ width: "100%" }}>
                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    backgroundColor: "white",
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      // color: "primary.main",
                    },
                    "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                      marginTop: "17px",
                    },

                    "& .MuiSvgIcon-root": {
                      color: "black", // change the color of the check mark here
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 0 },
                      disableExport: true,
                      disableToolbarButton: false,
                      csvOptions: { disableToolbarButton: true },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  rows={data ? data : []}
                  columns={columns}
                  density="compact"
                  pageSize={pageSize}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  onPageSizeChange={handlePageSizeChange}
                  disableSelectionOnClick
                />
              </div>
            ) : (
              ""
            )}
          </Box>
        </Paper>
      </ThemeProvider>
      {/** New Table Report  */}
      <div className={gmReportLayoutCss.HideReportLayout}>
        <ReportLayout
          columnLength={5}
          componentRef={componentRef}
          deptName={{
            en: "Department Name In English",
            mr: "Department Name In Marathi",
          }}
          reportName={{
            en: "Report Name IN English",
            mr: "Report Name In Marathi",
          }}
        >
          <ComponentToPrintNew reportData={data} language={language} />
        </ReportLayout>
      </div>
    </>
  );
};

class ComponentToPrintNew extends React.Component {
  render() {
    const reportData = this?.props?.reportData;

    const { language } = this?.props?.language;

    return (
      <>
        <table className={gmReportLayoutCss.table}>
          <tr>
            <td colSpan={15} className={gmReportLayoutCss.TableTitle}>
              {this?.props.language == "en"
                ? "Subject And Contact Wise"
                : "विषय आणि संपर्कानुसार"}
            </td>
          </tr>
          <tr>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Serial Number" : "अ.क्र."}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Citizen Name" : "नागरिकाचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Mobile / Phone No"
                : "दूरध्वनी क्रमांक"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Email-Id" : "ई-मेल आयडी"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Citizen Address"
                : "नागरिकांचा पत्ता"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Subject" : "विषय"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Department Name"
                : "विभाग"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Sub Department Name"
                : "उप विभाग"}
            </td>

            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Event Name" : "कार्यक्रमाचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Special Event"
                : "विशेष कार्यक्रम"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "HOD Name" : "एचओडीचे नाव"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Grievance Date" : "तक्रार तारीख"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en"
                ? "Grievance Close Date"
                : "तक्रार बंद तारीख"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Remark" : "शेरा"}
            </td>
            <td className={gmReportLayoutCss.TableHeader}>
              {this?.props.language == "en" ? "Status" : "स्थिती"}
            </td>
          </tr>
          {reportData &&
            reportData?.map((reportData, index) => (
              <tr>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en" ? index + 1 : index + 1}
                </td>

                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.NameOfCitizen
                    : reportData?.NameOfCitizenMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.mobileNo}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.emailId}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.address
                    : reportData?.addressMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.subject
                    : reportData?.subjectMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.departmentName
                    : reportData?.departmentNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.subDepartmentName
                    : reportData?.subDepartmentNameMr}
                </td>

                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.eventName
                    : reportData?.eventNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.splEvent
                    : reportData?.splEventMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.hodName
                    : reportData?.hodNameMr}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.grivDate}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.closeDate}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {reportData?.remark}
                </td>
                <td className={gmReportLayoutCss.TableRows}>
                  {this?.props.language == "en"
                    ? reportData?.stage
                    : reportData?.stageMr}
                </td>
              </tr>
            ))}
        </table>
      </>
    );
  }
}

export default Index;
