import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "../dateWiseBillReport/view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadCrumb from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });
  const [data, setData] = useState([]);
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [dateObj, setDateObj] = useState({
    from: "",
    to: "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);
  const [departmentDropDown, setDepartmentDropDown] = useState([]);
  const [divisionDetails, setDivisionDetails] = useState([]);
  const user = useSelector((state) => state.user.user);
  const headers = {
    Authorization: `Bearer ${user.token}`,
  };
  const [subDivisionDetails, setSubDivisionDetails] = useState([]);
  const language = useSelector((store) => store.labels.language);
  const [phaseType, setPhaseType] = useState([]);
  const [meterStatusDetails, setMeterStatus] = useState([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };

    // Add event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    handleResize();

    // Remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Analytics Consumtion Report",
  });

  useEffect(() => {
    getZoneData();
    getDepartmentData();
    getSubDivision();
    getDivision();
    getPhaseType();
    getMeterStatus();
  }, []);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
      );
    }
  };

  const getZoneData = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setZoneDropDown(res.data.zone);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Ward Name
  const getZoneWiseWard = (deptId, zone_id) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: {
            departmentId: deptId,
            zoneId: zone_id.target.value,
          },
          headers: headers,
        }
      )
      .then((res) => {
        setWardDropDown(res.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // validation on department and zone on selection of ward

  const validateWard = () => {
    if (!watch("departmentKey") && !watch("zone")) {
      setError("departmentKey", {
        type: "manual",
        message: "Please select Department",
      });
      setError("zone", { type: "manual", message: "Please select Zone" });
    } else {
      clearErrors("departmentKey");
      clearErrors("zone");
    }
  };

  const getDepartmentData = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartmentDropDown(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
        console.log("res.data", r.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const getDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstDivision/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDivisionDetails(r.data.mstDivisionDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((r) => {
        console.log(";r", r);
        setSubDivisionDetails(r.data.mstSubDivisionList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getPhaseType = () => {
    axios
      .get(`${urls.EBPSURL}/mstPhaseType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        console.log(";r", r);
        setPhaseType(r.data.mstPhaseTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getMeterStatus = () => {
    axios
      .get(`${urls.EBPSURL}/mstMeterStatus/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setMeterStatus(r.data.mstMeterStatusList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      // alert("onSubmitFunc");
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      setDateObj({
        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });

      let apiBodyToSend = {
        strFromDate: sendFromDate,
        strToDate: sendToDate,
        zone: watch("zone") ? watch("zone") : null,
        ward: watch("ward") ? watch("ward") : null,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(`${urls.EBPSURL}/report/analyticsConsumption`, apiBodyToSend, {
          headers: headers,
        })
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  consumerNo: r.consumerNo,
                  consumerName: r.consumerName,
                  consumerNameMr: r.consumerNameMr,

                  zoneName: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneName,

                  zoneNameMr: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneNameMr,

                  wardName: !wardDropDown?.find((obj) => {
                    return obj.id == r?.wardKey;
                  })
                    ? "-"
                    : wardDropDown.find((obj) => {
                        return obj.id == r?.wardKey;
                      }).wardName,

                  wardNameMr: !wardDropDown?.find((obj) => {
                    return obj.id == r?.wardKey;
                  })
                    ? "-"
                    : wardDropDown.find((obj) => {
                        return obj.id == r?.wardKey;
                      }).wardNameMr,

                  divisionName: !divisionDetails?.find((obj) => {
                    return obj.id === r.divisionKey;
                  })
                    ? "-"
                    : divisionDetails.find((obj) => {
                        return obj.id == r.divisionKey;
                      }).division,

                  divisionNameMr: !divisionDetails?.find((obj) => {
                    return obj.id === r.divisionKey;
                  })
                    ? "-"
                    : divisionDetails.find((obj) => {
                        return obj.id == r.divisionKey;
                      }).divisionMr,

                  subDivisionName: !subDivisionDetails?.find((obj) => {
                    return obj.id === r.subDivisionKey;
                  })
                    ? "-"
                    : subDivisionDetails.find((obj) => {
                        return obj.id == r.subDivisionKey;
                      }).subDivision,

                  subDivisionNameMr: !subDivisionDetails?.find((obj) => {
                    return obj.id === r.subDivisionKey;
                  })
                    ? "-"
                    : subDivisionDetails.find((obj) => {
                        return obj.id == r.subDivisionKey;
                      }).subDivisionMr,

                  phaseType: !phaseType?.find((obj) => {
                    return obj.id === r.phaseTypeKey;
                  })
                    ? "-"
                    : phaseType.find((obj) => {
                        return obj.id == r.phaseTypeKey;
                      }).phaseType,

                  phaseTypeMr: !phaseType?.find((obj) => {
                    return obj.id === r.phaseTypeKey;
                  })
                    ? "-"
                    : phaseType.find((obj) => {
                        return obj.id == r.phaseTypeKey;
                      }).phaseTypeMr,

                  meterStatus: !meterStatusDetails?.find((obj) => {
                    return obj.id === r.meterStatusKey;
                  })
                    ? "-"
                    : meterStatusDetails.find((obj) => {
                        return obj.id == r.meterStatusKey;
                      }).meterStatus,

                  meterStatusMr: !meterStatusDetails?.find((obj) => {
                    return obj.id === r.meterStatusKey;
                  })
                    ? "-"
                    : meterStatusDetails.find((obj) => {
                        return obj.id == r.meterStatusKey;
                      }).meterStatusMr,

                  currMeterReading: r.currentReading,
                  arrears: r.arrears,
                  allocatedLoad: r.allocatedLoad,
                  billDueDate: moment(r.billDueDate).format("DD-MM-YYYY"),
                  prevReading: r.prevReading,
                  consumedUnit: r.consumedUnit,
                  meterNo: r.meterNo,
                  billDate: moment(r.billDate).format("DD-MM-YYYY"),
                  billAmount: r.billAmount,
                  billingUnits: res.billingUnits,
                  currentReading: res.currentReading,
                  paymentDate: moment(res.paymentDate).format("DD-MM-YYYY"),
                  paidAmount: res.paidAmount,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  // srNo: i + 1,
                  "Consumer Number": r.consumerNo,
                  "Consumer Name": r.consumerName,

                  "Zone Name": !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneName,

                  "Ward Name": !wardDropDown?.find((obj) => {
                    return obj.id == r?.wardKey;
                  })
                    ? "-"
                    : wardDropDown.find((obj) => {
                        return obj.id == r?.wardKey;
                      }).wardName,

                  "Division Name": !divisionDetails?.find((obj) => {
                    return obj.id === r.divisionKey;
                  })
                    ? "-"
                    : divisionDetails.find((obj) => {
                        return obj.id == r.divisionKey;
                      }).division,

                  "Sub Division": !subDivisionDetails?.find((obj) => {
                    return obj.id === r.subDivisionKey;
                  })
                    ? "-"
                    : subDivisionDetails.find((obj) => {
                        return obj.id == r.subDivisionKey;
                      }).subDivision,

                  "Phase Type": !phaseType?.find((obj) => {
                    return obj.id === r.phaseTypeKey;
                  })
                    ? "-"
                    : phaseType.find((obj) => {
                        return obj.id == r.phaseTypeKey;
                      }).phaseType,

                  "Meter Status": !meterStatusDetails?.find((obj) => {
                    return obj.id === r.meterStatusKey;
                  })
                    ? "-"
                    : meterStatusDetails.find((obj) => {
                        return obj.id == r.meterStatusKey;
                      }).meterStatus,

                  "Current Meter Reading": r.currentReading,
                  Arrears: r.arrears,
                  "Allocated Load": r.allocatedLoad,
                  "Bill Due Date": moment(r.billDueDate).format("DD-MM-YYYY"),
                  "Previous Reading": r.prevReading,
                  "Consumed Unit": r.consumedUnit,
                  "Meter Number": r.meterNo,
                  "Bill Date": moment(r.billDate).format("DD-MM-YYYY"),
                  "Bill Amount": r.billAmount,
                  "Billing Units": res.billingUnits,
                  "Current Reading": res.currentReading,
                  "Payment Date": moment(res.paymentDate).format("DD-MM-YYYY"),
                  "Paid Amount": res.paidAmount,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  // srNo: i + 1,
                  "ग्राहक क्रमांक": r.consumerNo,
                  "ग्राहकाचे नाव": r.consumerNameMr,

                  झोन: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneNameMr,

                  प्रभाग: !wardDropDown?.find((obj) => {
                    return obj.id == r?.wardKey;
                  })
                    ? "-"
                    : wardDropDown.find((obj) => {
                        return obj.id == r?.wardKey;
                      }).wardNameMr,

                  "विभागाचे नाव": !divisionDetails?.find((obj) => {
                    return obj.id === r.divisionKey;
                  })
                    ? "-"
                    : divisionDetails.find((obj) => {
                        return obj.id == r.divisionKey;
                      }).divisionMr,

                  उपविभाग: !subDivisionDetails?.find((obj) => {
                    return obj.id === r.subDivisionKey;
                  })
                    ? "-"
                    : subDivisionDetails.find((obj) => {
                        return obj.id == r.subDivisionKey;
                      }).subDivisionMr,

                  "फेज प्रकार": !phaseType?.find((obj) => {
                    return obj.id === r.phaseTypeKey;
                  })
                    ? "-"
                    : phaseType.find((obj) => {
                        return obj.id == r.phaseTypeKey;
                      }).phaseTypeMr,

                  "मीटर स्थिती": !meterStatusDetails?.find((obj) => {
                    return obj.id === r.meterStatusKey;
                  })
                    ? "-"
                    : meterStatusDetails.find((obj) => {
                        return obj.id == r.meterStatusKey;
                      }).meterStatusMr,

                  "वर्तमान मीटर रीडिंग": r.currentReading,
                  थकबाकी: r.arrears,
                  "वाटप केलेले लोड": r.allocatedLoad,
                  "बिल देय तारीख": moment(r.billDueDate).format("DD-MM-YYYY"),
                  "मागील वाचन": r.prevReading,
                  "खपत युनिट": r.consumedUnit,
                  "मीटर क्रमांक": r.meterNo,
                  "बिल तारीख": moment(r.billDate).format("DD-MM-YYYY"),
                  "बिलाची रक्कम": r.billAmount,
                  "बिलिंग युनिट्स": res.billingUnits,
                  "वर्तमान वाचन": res.currentReading,
                  "पगाराची तारीख": moment(res.paymentDate).format("DD-MM-YYYY"),
                  "भरलेली रक्कम": res.paidAmount,
                }))
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: "Oops!",
                text: "There is nothing to show you!",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
              setData([]);
              setEngReportsData([]);
              setMrReportsData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
          setData([]);
          setEngReportsData([]);
          setMrReportsData([]);
          sweetAlert(err);
          catchMethod(err);
          setLoading(false);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "All Three Values Are Required!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      width: 40,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "consumerNo",
      headerName: <FormattedLabel id="consumerNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "consumerName" : "consumerNameMr",
      headerName: <FormattedLabel id="consumerName" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zone" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="ward" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "divisionName" : "divisionNameMr",
      headerName: <FormattedLabel id="division" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "subDivisionName" : "subDivisionNameMr",
      headerName: <FormattedLabel id="subDivision" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "phaseType" : "phaseTypeMr",
      headerName: <FormattedLabel id="phaseType" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "meterStatus" : "meterStatusMr",
      headerName: <FormattedLabel id="meterStatus" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "meterNo",
      headerName: <FormattedLabel id="meterNo" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "allocatedLoad",
      headerName: <FormattedLabel id="allocatedLoad" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "arrears",
      headerName: <FormattedLabel id="arrears" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "prevReading",
      headerName: <FormattedLabel id="prevReading" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "currMeterReading",
      headerName: <FormattedLabel id="currMeterReading" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "consumedUnit",
      headerName: <FormattedLabel id="consumedUnit" />,
      width: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "billDate",
      headerName: <FormattedLabel id="billDate" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "billDueDate",
      headerName: <FormattedLabel id="billDueDate" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "billAmount",
      headerName: <FormattedLabel id="billedAmount" />,
      width: 80,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log("data", data);
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    // const headerColumns = columns.map((c) => c.headerName);
    console.log("data__", csv);
    const fileName = "Excel";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A8" });
    // const ws = XLSX.utils.sheet_add_aoa(ws0,);
    ws.B1 = {
      t: "s",
      v:
        language == "en"
          ? "Pimpri-Chinchwad Municipal Corporation"
          : "पिंपरी-चिंचवड महानगरपालिका",
    };
    ws.B2 = {
      t: "s",
      v:
        language == "en"
          ? "Mumbai-Pune Road, Pimpri - 411018"
          : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८",
    };
    ws.B3 = {
      t: "s",
      v:
        language == "en"
          ? `Department Name: Electric Billing Payment System`
          : `विभागाचे नाव: इलेक्ट्रिक बिलिंग पेमेंट सिस्टम`,
    };
    ws.B4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name: Analytical Consumption`
          : `अहवालाचे नाव: विश्लेषणात्मक उपभोग`,
    };
    ws.B5 = {
      t: "s",
      v:
        language == "en"
          ? `From Date:${dateObj?.from}`
          : `तारखेपासून:${dateObj?.from}`,
    };
    ws.B6 = {
      t: "s",
      v:
        language == "en"
          ? `To Date:${dateObj?.to}`
          : `तारखेपर्यंत:${dateObj?.to}`,
    };

    const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    ws["!merges"] = merge;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    console.log("wb", wb);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    console.log("wb__", excelBuffer);
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  ///////////////// PDF Download //////////////////////////

  function generatePDF(data) {
    const columnsData = columns
      .map((c) => c.headerName)
      .map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj)
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <Box>
          <div>
            <BreadCrumb />
          </div>
        </Box>
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
            <Grid container className={commonStyles.title}>
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
                  <FormattedLabel id="analyticsConsumption" />
                </h3>
              </Grid>
            </Grid>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <Box
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
              <form onSubmit={handleSubmit(onSubmitFunc)}>
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "baseline",
                  }}
                >
                  {/* From Date */}

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
                      style={{ backgroundColor: "white" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" required />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              disableFuture
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
                      <FormHelperText>
                        {errors?.fromDate ? errors.fromDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* To Date */}

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
                      style={{ backgroundColor: "white" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
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
                              disableFuture
                              minDate={watch("fromDate")}
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
                      <FormHelperText>
                        {errors?.toDate ? errors.toDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Department Name */}

                  <Grid
                    item
                    xl={4}
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
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "90%" }}
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {<FormattedLabel id="deptName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            // value={departmentName}
                            value={field.value}
                            {...register("departmentKey")}
                            label={<FormattedLabel id="deptName" required />}
                            // InputLabelProps={{
                            //   shrink: watch("departmentKey") ? true : false,
                            // }}
                          >
                            {departmentDropDown &&
                              departmentDropDown.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.departmentKey
                          ? errors.departmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Zone */}

                  <Grid
                    item
                    xl={4}
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
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "90%" }}
                      error={!!errors.zone}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {<FormattedLabel id="zone" />}
                      </InputLabel>
                      <Controller
                        name="zone"
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            // {...field}
                            onChange={(value) => {
                              field.onChange(value);
                              getZoneWiseWard(watch("departmentKey"), value);
                            }}
                            // {...register("zone")}

                            label={<FormattedLabel id="zone" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {zoneDropDown &&
                              zoneDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.zoneName
                                    : each.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zone ? errors.zone.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Ward Name */}

                  <Grid
                    item
                    xl={4}
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
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "90%" }}
                      error={!!errors.ward}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="ward" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            onClick={() => {
                              validateWard();
                            }}
                            // {...register("ward")}
                            label={<FormattedLabel id="ward" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {wardDropDown &&
                              wardDropDown.map((wa, index) => (
                                <MenuItem key={index} value={wa.id}>
                                  {language == "en"
                                    ? wa.wardName
                                    : wa.wardNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="ward"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.ward ? errors.ward.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* ////////////////////////////// */}

                <Grid
                  container
                  // spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  {/* ///////////////////// */}
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
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={
                          watch("fromDate") == null || watch("toDate") == null
                        }
                        color="success"
                        endIcon={<ArrowUpwardIcon />}
                      >
                        {<FormattedLabel id="submit" />}
                      </Button>
                    </Paper>
                  </Grid>

                  {console.log("mrReportsData", mrReportsData)}

                  {/* ///////////////////////////////////////////// */}
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
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        disabled={engReportsData?.length > 0 ? false : true}
                        type="button"
                        variant="contained"
                        color="success"
                        endIcon={<DownloadIcon />}
                        onClick={() =>
                          language == "en"
                            ? generateCSVFile(engReportsData)
                            : generateCSVFile(mrReportsData)
                        }
                      >
                        {<FormattedLabel id="downloadEXCELL" />}
                      </Button>
                    </Paper>
                  </Grid>
                  {/* ////////////////////////////// */}
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
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        disabled={data?.length > 0 ? false : true}
                        type="button"
                        variant="contained"
                        color="success"
                        endIcon={<DownloadIcon />}
                        // onClick={() => generatePDF(data)}
                        onClick={() => handlePrint()}
                      >
                        {<FormattedLabel id="print" />}
                      </Button>
                    </Paper>
                  </Grid>

                  {/* //////////////////////////////////// */}

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
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        // sx={{ marginRight: 8 }}
                        type="button"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={onCancel}
                      >
                        {<FormattedLabel id="cancel" />}
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            {loading ? (
              <CircularProgress color="success" />
            ) : data.length !== 0 ? (
              <div
                style={
                  isLargeScreen
                    ? {
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : { width: "100%", textAlign: "center" }
                }
              >
                {/* <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                rows={data ? data : []}
                columns={columns}
                density="standard"
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              /> */}

                <ReportLayout
                  componentRef={componentRef}
                  rows={data ? data : []}
                  columns={columns}
                  showDates={true}
                  date={dateObj}
                />
              </div>
            ) : (
              ""
            )}
          </Box>
        </Paper>
      </>
    </ThemeProvider>
  );
};

export default Index;
