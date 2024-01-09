import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Tooltip,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
// import styles from "./view.module.css";
import styles from "./view.module.css";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DetailsIcon from "@mui/icons-material/Details";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const schema = yup.object().shape({
    strToDate: yup
      .date()
      .nullable()
      .required(<FormattedLabel id="bachatgatToDate" />),
    strFromDate: yup
      .date()
      .nullable()
      .required(<FormattedLabel id="bachatgatFromDate" />),
    // mainSchemeKeyValidation: yup
    //   .string()
    //   .required(<FormattedLabel id="mainSchemeKeyValidation" />),
    // subSchemeKeyValidation: yup
    //   .string()
    //   .required(<FormattedLabel id="subSchemeKeyValidation" />),
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(schema),
    // mode: "onSubmit",
  });

  const router = useRouter();

  const [data, setData] = useState([]);
  const currDate = new Date();
  const [eventTypes, setEventTypes] = useState([]);
  // const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [castNames, setCastNames] = useState([]);
  const [religionNames, setReligionNames] = useState([]);
  const [selectedMainSchemeIds, setSelectedMainSchemeIds] = useState(""); // Added state for selected main scheme IDs

  const user = useSelector((state) => state.user.user);
  const language = useSelector((store) => store.labels.language);

  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  // const [religions, setReligions] = useState([]);
  const [dateObj, setDateObj] = useState();

  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
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

  const loggedUser = localStorage.getItem("loggedInUser");

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language == "en"
        ? "Cast Wise List Of Benefeciaries"
        : "लाभार्थ्यांची जातनिहाय यादी",
  });

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

  useEffect(() => {
    getAllMainSchemes();
    getReligionDetails();
  }, []);

  useEffect(() => {
    // if (watch("strReligions")) {
    //   getCastFromReligion();
    // }
    if (
      watch("strReligions") !== "all" &&
      watch("strReligions") != null &&
      watch("strReligions") != undefined&&watch("strReligions")!=''
    ) {
      getCastFromReligion();
    } else {
      getAllCastes();
    }
  }, [watch("strReligions")]);

  useEffect(() => {
    if (watch("strMainSchemeKeys") !== "all") {
      getSubSchemes();
    } else {
      getAllSubSchemes();
    }
    setValue("strSubSchemeKeys", "");
  }, [watch("strMainSchemeKeys")]);

  // get ALL Castes
  const getAllCastes = () => {
    axios
      .get(`${urls.SLUMURL}/master/cast/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setCastNames(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // cast from religion
  const getCastFromReligion = () => {
    axios
      .get(
        `${urls.SLUMURL}/master/cast/getCastFromReligion?id=${watch(
          "strReligions"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setCastNames(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  //load religion details
  const getReligionDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setReligionNames(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllMainSchemes = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then(async (r) => {
        let result = r.data.mstMainSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              schemeName: r.schemeName ? r.schemeName : "-",
            };
          });
        setMainNames([..._res]);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllSubSchemes = (_pageSize = 10, _pageNo = 0) => {
    // setLoad(true);
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then((r) => {
        // setSubSchemeNames(
        //   r.data.mstSubSchemesList.map((row) => ({
        //     id: row.id,
        //     subSchemeName: row.subSchemeName,
        //     subSchemeNameMr: row.subSchemeNameMr,
        //   }))
        // );
        setSubSchemeNames([
          { id: "all", subSchemeName: "All" }, // Add "All" option as the default value
          ...r.data.mstSubSchemesList.map((row) => ({
            id: row.id,
            subSchemeName: row.subSchemeName,
            subSchemeNameMr: row.subSchemeNameMr,
          })),
        ]);
        // setLoad(false);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSubSchemes = async (_pageSize = 10, _pageNo = 0) => {
    // setLoad(true);
    if (watch("strMainSchemeKeys")) {
      await axios
        .get(
          `${
            urls.BSUPURL
          }/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch(
            "strMainSchemeKeys"
          )}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setSubSchemeNames(
            r.data.mstSubSchemesList.map((row) => ({
              id: row.id,
              subSchemeName: row.subSchemeName,
              subSchemeNameMr: row.subSchemeNameMr,
            }))
          );
          // setLoad(false);
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  let resetValuesCancell = {
    strFromDate: null,
    strToDate: null,
    strMainSchemeKeys: null,
    strSubSchemeKeys: null,
    strCasts: null,
    strReligions: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setData([]);
  };

  ///////////// On submit method ////////////////////
  const onSubmitFunc = (formData) => {
    if (watch("strFromDate") && watch("strToDate")) {
      let sendFromDate = moment(watch("strFromDate")).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let sendToDate = moment(watch("strToDate")).format("YYYY-MM-DD HH:mm:ss");

      let apiBodyToSend = {
        ...formData,
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };

      setDateObj({
        from: moment(watch("strFromDate")).format("DD-MM-YYYY"),
        to: moment(watch("strToDate")).format("DD-MM-YYYY"),
      });

      if (formData.strMainSchemeKeys === "all") {
        // If "All" option is selected, send all main scheme IDs separated by commas
        const allMainSchemeIds = mainNames.map((r) => r.id).join(",");
        apiBodyToSend.strMainSchemeKeys = allMainSchemeIds;
        apiBodyToSend.strFromDate = sendFromDate;
        apiBodyToSend.strToDate = sendToDate;

        delete apiBodyToSend.strSubSchemeKeys;
      }

      if (formData.strReligions === "all") {
        // If "All" option is selected, send all Religion IDs separated by commas
        const allReligionIds = religionNames.map((r) => r.id).join(",");
        apiBodyToSend.strReligions = allReligionIds;
        apiBodyToSend.strFromDate = sendFromDate;
        apiBodyToSend.strToDate = sendToDate;

        delete apiBodyToSend.strCasts;
      }

      // if (formData.strSubSchemeKeys === "all") {
      //   // If "All" option is selected, send all sub scheme IDs separated by commas
      //   const allSubSchemeIds = subSchemeNames.map((r) => r.id).join(",");
      //   apiBodyToSend.strSubSchemeKeys = allSubSchemeIds;
      // } else {
      //   // Send the selected subSchemeKey
      //   // apiBodyToSend.strSubSchemeKeys = formData.strSubSchemeKeys !== "" ? formData.strSubSchemeKeys : null ;
      //   apiBodyToSend.strFromDate = formData.strFromDate;
      //   apiBodyToSend.strToDate = formData.strToDate;
      //   // apiBodyToSend.fromDate = formData.fromDate,
      //   // apiBodyToSend.fromDate = formData.fromDate,
      //   delete apiBodyToSend.strSubSchemeKeys;
      // }
      axios
        .post(
          `${urls.BSUPURL}/report/getCastWiseListOfBeneficiariesReport`,
          apiBodyToSend,
          { headers: headers }
        )
        .then((res) => {
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  zoneName: r.zoneName,
                  zoneNameMr: r.zoneNameMr,
                  areaName: r.areaName,
                  areaNameMr: r.areaNameMr,
                  wardName: r.wardName,
                  wardNameMr: r.wardNameMr,
                  schemeName: r.schemeName,
                  schemeNameMr: r.schemeNameMr,
                  // cfcApplicationNo: r.cfcApplicationNo,
                  cfcApplicationNo: r.onlineApplicationNo,
                  zoneOfficeApplicationNo: r.zoneOfficeApplicationNo,
                  beneficiaryName: r.beneficiaryName,
                  beneficiaryAddress: r.beneficiaryAddress,
                  mobileNo: r.mobileNo,
                  emailId: r.emailId,
                  aadharNo: r.aadharNo,

                  bankName: r.bankName,
                  bankNameMr: r.bankNameMr,
                  branchName: r.branchName,
                  branchNameMr: r.branchNameMr,
                  iFSCNo: r.ifscNo,
                  mICRNo: r.micrNo,
                  amount: r.amount,

                  castCategory: r.castCategory,
                  castCategoryMr: r.castCategoryMr,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Zone Name": r.zoneName,
                  "Area Name": r.areaName,
                  "Ward Name": r.wardName,
                  "Scheme Name": r.schemeName,
                  "Beneficiary Name": r.beneficiaryName,
                  "Beneficiary Address": r.beneficiaryAddress,
                  "Mobile No": r.mobileNo,
                  "Email Id": r.emailId,
                  "Cast Category": r.castCategory,
                  "CFC Application No": r.onlineApplicationNo,

                  "Aadhar No": r.aadharNo,
                  "Bank Name": r.bankName,
                  "Branch Name": r.branchName,
                  "IFSC No": r.ifscNo,
                  "MICR No": r.micrNo,
                  Amount: r.amount,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  झोन: r.zoneNameMr,
                  "क्षेत्राचे नाव": r.areaNameMr,
                  "प्रभागाचे नाव": r.wardNameMr,
                  "योजनेचे नाव": r.schemeNameMr,
                  "लाभार्थीचे नाव": r.beneficiaryName,
                  "लाभार्थीचा पत्ता": r.beneficiaryAddress,
                  "मोबाईल क्र": r.mobileNo,
                  "ई-मेल आयडी": r.emailId,
                  "जात प्रवर्ग": r.castCategoryMr,
                  "सी.एफ.सी. अर्ज क्र.": r.onlineApplicationNo,

                  "आधार क्र": r.aadharNo,
                  "बँकेचे नाव": r.bankNameMr,
                  "शाखेचे नाव": r.branchNameMr,
                  "आय.एफ.एस.सी क्र.": r.ifscNo,
                  "एम.आय.सी.आर क्र.": r.micrNo,
                  रक्कम: r.amount,
                }))
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: language == "en" ? "Oops!" : "क्षमस्व!",
                text:
                  language == "en"
                    ? "There is nothing to show you!"
                    : "तुम्हाला दाखवण्यासारखे काही नाही!",
                icon: "warning",
                button: language === "en" ? "Ok" : "ठीक आहे",
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
            sweetAlert(
              language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setLoading(false);
          }
        })
        .catch((err) => {
          setData([]);
          setEngReportsData([]);
          setMrReportsData([]);
          // sweetAlert(error);
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? "Both Dates Are Required!"
            : "दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
        button: language === "en" ? "Ok" : "ठीक आहे",
      });
      setData([]);
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  const columns = [
    {
      field: "id",
      // headerName: <FormattedLabel id="srNo" />,
      // headerName: (
      //   <Tooltip title={<FormattedLabel id="srNo" />}>
      //     <span>
      //       <FormattedLabel id="srNo" />
      //     </span>
      //   </Tooltip>
      // ),
      headerName: language == "en" ? "Sr.No" : "अ.क्र.",
      width: 40,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      // headerName: <FormattedLabel id="zoneName" />,
      headerName: language == "en" ? "Zone Name" : "झोन चे नाव",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "areaName" : "areaNameMr",
      // headerName: <FormattedLabel id="areaName" />,
      headerName: language == "en" ? "Area Name" : "क्षेत्राचे नाव",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr",
      // headerName: <FormattedLabel id="wardName" />,
      headerName: language == "en" ? "Ward Name" : "प्रभागाचे नाव",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "schemeName" : "schemeNameMr",
      // headerName: <FormattedLabel id="schemeName" />,
      headerName: language == "en" ? "Scheme Name" : "योजनेचे नाव",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "beneficiaryName",
      // headerName: <FormattedLabel id="beneficiaryName" />,
      headerName: language == "en" ? "Beneficiary Name" : "लाभार्थीचे नाव",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "beneficiaryAddress",
      // headerName: <FormattedLabel id="beneficiaryAddress" />,
      headerName: language == "en" ? "Beneficiary Address" : "लाभार्थीचा पत्ता",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobileNo",
      // headerName: <FormattedLabel id="mobileNo" />,
      headerName: language == "en" ? "Mobile No" : "मोबाईल क्र",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "emailId",
      // headerName: <FormattedLabel id="emailId" />,
      headerName: language == "en" ? "Email Id" : "ई-मेल आयडी",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "castCategory" : "castCategoryMr",
      // headerName: <FormattedLabel id="castCategory" />,
      headerName: language == "en" ? "Cast Category" : "जात प्रवर्ग",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cfcApplicationNo",
      // headerName: <FormattedLabel id="cfcApplicationNo" />,
      headerName:
        language == "en" ? "CFC Application No." : "सी.एफ.सी. अर्ज क्र.",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aadharNo",
      // headerName: <FormattedLabel id="aadharNo" />,
      headerName: language == "en" ? "Aadhar No" : "आधार क्रमांक",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "bankName" : "bankNameMr",
      // headerName: <FormattedLabel id="bankName" />,
      headerName: language == "en" ? "Bank Name" : "बँकेचे नाव",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "branchName",
      // headerName: <FormattedLabel id="branchName" />,
      headerName: language == "en" ? "Branch Name" : "शाखेचे नाव",
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "iFSCNo",
      // headerName: <FormattedLabel id="iFSCNo" />,
      headerName: language == "en" ? "IFSCNo" : "आय.एफ.एस.सी क्र.",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mICRNo",
      // headerName: <FormattedLabel id="mICRNo" />,
      headerName: language == "en" ? "MICR No" : "एम.आय.सी.आर क्र.",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount",
      // headerName: <FormattedLabel id="amount" />,
      headerName: language == "en" ? "Amount" : "रक्कम",
      width: 60,
      headerAlign: "center",
      align: "center",
    },
  ];
  // const classes = useStyles();

  function generateCSVFile(data) {
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    // const headerColumns = columns.map((c) => c.headerName);
    const fileName =
      language == "en"
        ? "Cast Wise List Of Benefeciaries"
        : "लाभार्थ्यांची जातनिहाय यादी";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
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

    const columnWidths = columns.map((column) => column.headerName.length);
    columns.forEach((column, index) => {
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
      v:
        language == "en"
          ? "Pimpri-Chinchwad Municipal Corporation"
          : "पिंपरी-चिंचवड महानगरपालिका",
      s: dataStyle,
    };
    ws.F2 = {
      t: "s",
      v:
        language == "en"
          ? "Mumbai-Pune Road, Pimpri - 411018"
          : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८",
      s: dataStyle,
    };
    ws.F3 = {
      t: "s",
      v:
        language == "en"
          ? `Department Name: Samaj Vikas Department`
          : `विभागाचे नाव: समाज विकास विभाग`,
      s: dataStyle,
    };
    ws.F4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name: Cast Wise List Of Benefeciaries`
          : `अहवालाचे नाव: लाभार्थ्यांची जातनिहाय यादी`,
      s: dataStyle,
    };
    ws.F5 = {
      t: "s",
      v:
        language == "en"
          ? `From Date: ${dateObj?.from}`
          : `तारखेपासून: ${dateObj?.from}`,
      s: dataStyle,
    };
    ws.F6 = {
      t: "s",
      v:
        language == "en"
          ? `To Date: ${dateObj?.to}`
          : `तारखेपर्यंत: ${dateObj?.to}`,
      s: dataStyle,
    };

    // const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    // ws["!merges"] = merge;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }

  ////////////////// PDF DOWNLOAD /////////////////////////
  function generatePDF(data) {
    const columnsData = columns.map((c) => c.headerName);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    const doc = new jsPDF();
    const autoTableConfig = {
      startY: 10,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 8,
      },
      columnStyles: {
        0: { columnWidth: 10 },
        1: { columnWidth: 15 },
        2: { columnWidth: 15 },
        3: { columnWidth: 15 },
        4: { columnWidth: 15 },
        5: { columnWidth: 15 },
        6: { columnWidth: 15 },
        7: { columnWidth: 15 },
        8: { columnWidth: 15 },
        9: { columnWidth: 15 },
        10: { columnWidth: 15 },
        11: { columnWidth: 15 },
        12: { columnWidth: 15 },
        13: { columnWidth: 15 },
        14: { columnWidth: 15 },
        15: { columnWidth: 15 },
        16: { columnWidth: 15 },
      },
      margin: { top: 20, right: 10, bottom: 10, left: 10 },
      autoSize: {
        tableWidth: "wrap",
      },
    };

    doc.autoTable(columnsData, rowsData, autoTableConfig);
    doc.save(
      language == "en"
        ? "Caste Wise List Of Beneficiaries.pdf"
        : "लाभार्थ्यांची जातनिहाय यादी.pdf"
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        {/* <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="castWiseListOfBeneficiariesHeading" />
            </strong>
          </Box> */}
        <Box style={{ padding: "8px" }}>
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
                <FormattedLabel id="castWiseListOfBeneficiariesHeading" />
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
          <Paper elevation={2} style={{ margin: "1rem", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                sx={{
                  padding: "2rem",
                }}
              >
                {/* ///////////////////// */}

                {/* main scheme dropdown */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <FormControl
                    // error={errors.mainSchemeKeyValidation}
                    variant="standard"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="mainScheme" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          selected={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                        >
                          <MenuItem id="all" value="all">
                            All
                          </MenuItem>
                          {mainNames &&
                            mainNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.schemeName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="strMainSchemeKeys"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText sx={{ color: "red" }}>
                        {errors?.mainSchemeKeyValidation
                          ? errors.mainSchemeKeyValidation.message
                          : null}
                      </FormHelperText> */}
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <FormControl
                    // error={errors.subSchemeKeyValidation}
                    variant="standard"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="subScheme" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                          // disabled={watch("strMainSchemeKeys") === "all"}
                        >
                          {/* {load ? (
                            <MenuItem disabled>Loading...</MenuItem>
                          ) : (
                            <> */}
                          {subSchemeNames &&
                            subSchemeNames.map((auditorium, index) => (
                              <MenuItem
                                key={index}
                                value={auditorium.id}
                                disabled={
                                  watch("strMainSchemeKeys") === "all" &&
                                  auditorium.id !== "all"
                                }
                              >
                                {auditorium.subSchemeName}
                              </MenuItem>
                            ))}
                          {/* </>
                          )} */}
                        </Select>
                      )}
                      name="strSubSchemeKeys"
                      control={control}
                      defaultValue=""
                    />
                    {/* <FormHelperText sx={{ color: "red" }}>
                        {errors?.subSchemeKeyValidation
                          ? errors.subSchemeKeyValidation.message
                          : null}
                      </FormHelperText> */}
                  </FormControl>
                </Grid>

                {/* Religion */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  // }}
                >
                  <FormControl
                    error={errors.religionKey}
                    variant="standard"
                    // sx={{ width: "90%" }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="religion" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          {...field}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Select Auditorium"
                        >
                          <MenuItem id="all" value="all">
                            All
                          </MenuItem>
                          {religionNames &&
                            religionNames.map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {language == "en"
                                  ? auditorium.religion
                                  : auditorium.religionMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="strReligions"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.religionKey ? errors.religionKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Caste Category */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  // }}
                >
                  <FormControl
                    error={errors.casteCategory}
                    variant="standard"
                    // sx={{ width: "90%" }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="castCategory" />
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={
                            watch("strReligions") === "all" ? "" : field.value
                          }
                          onChange={(value) => field.onChange(value)}
                          label="Select Auditorium"
                          disabled={watch("strReligions") === "all"}
                        >
                          {castNames.length > 0 &&
                            castNames.map((auditorium, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={auditorium.id}
                                  disabled={
                                    watch("strReligions") === "all" &&
                                    auditorium.id !== "all"
                                  }
                                >
                                  {language == "en"
                                    ? auditorium.cast
                                    : auditorium.castMr}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="strCasts"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.casteCategory
                        ? errors.casteCategory.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* From date */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  xl={6}
                  // style={{
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.strFromDate}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="strFromDate"
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
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                    <FormHelperText sx={{ color: "red" }}>
                      {errors?.strFromDate ? errors.strFromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* to date */}
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.strToDate}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <Controller
                      control={control}
                      name="strToDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            minDate={watch("strFromDate")}
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
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
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
                    <FormHelperText sx={{ color: "red" }}>
                      {errors?.strToDate ? errors.strToDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

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
                      // className={commonStyles.buttonSubmit}
                      variant="contained"
                      color="success"
                      endIcon={<ArrowUpwardIcon />}
                    >
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>

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
                    {/* <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => generateCSVFile(data)}
                    >
                      {<FormattedLabel id="downloadEXCELL" />}
                    </Button> */}
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
                      onClick={() => handlePrint()}
                    >
                      {<FormattedLabel id="downloadPDF" />}
                    </Button>
                  </Paper>
                </Grid>
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
                      // sx={{ marginRight: 8 }}
                      type="button"
                      variant="contained"
                      color="error"
                      // className={commonStyles.buttonBack}
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
            <CommonLoader />
          ) : data.length !== 0 ? (
            <div
              style={
                isLargeScreen
                  ? { width: "100%", display: "flex", justifyContent: "center" }
                  : { width: "100%", textAlign: "center" }
              }
            >
              {/* <DataGrid
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

                  "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
                    {
                      display: "none",
                    },
                }}
                // className={classes.dataGrid}
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
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
