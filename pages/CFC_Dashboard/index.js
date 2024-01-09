import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DraftsIcon from "@mui/icons-material/Drafts";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Link,
  Typography,
  Card,
  CardHeader,
  Grid,
  FormHelperText,
  FormControl,
  Paper,
  Avatar,
  InputLabel,
  IconButton,
  TextField,
  Select,
  MenuItem,
  CardContent,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Stack,
  Button,
  Divider,
  AppBar,
  Modal,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Payment from "@mui/icons-material/Payment";
import { Pets } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import URLs from "../../URLS/urls";
import * as MuiIcons from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setApplicationName } from "../../features/userSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import urls from "../../URLS/urls";
import moment from "moment";
import PropTypes from "prop-types";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import Loader from "../../containers/Layout/components/Loader";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
// import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import cfcDashBoardStyles from "../../styles/marrigeRegistration/[dashboard].module.css";
import dynamic from "next/dynamic";
import schema from "../../containers/schema/CFC/CFC_DashboardSchema";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CancelIcon from "@mui/icons-material/Cancel";
// import { Link } from 'react-router-dom';
import { catchExceptionHandlingMethod } from "../../util/util";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{ fontSize: "0.9rem", border: "1px solid red" }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(-90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ backgroundColor: "white" }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const CFC_Dashboard = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    // setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [isCardClick, setCardClick] = useState(false);
  const [clickedTitle, setClickTitle] = useState("");

  const [clickedIcon, setClickIcon] = useState("false");
  const modalStyles = {
    overlay: {
      backgroundColor: "#ffffff",
    },
  };
  const [dataTotable, setDataToTable] = useState(null);
  const [rtiStatus, setRTIStatus] = useState([]);
  const [slumStatus, setSlumStatus] = useState([]);
  const [gmStatus, setGmStatus] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const handleCancel1 = () => {
    setCardClick(false);
    // setValue("isApplicationMultiDept", "false");
  };
  const [tabsValue, setTabsValue] = useState(2);
  const theme = useTheme();

  const isBelow600 = useMediaQuery("(max-width: 600px)");
  const isBetweenSMAndMD = useMediaQuery(
    "(min-width: 600px) and (max-width: 959px)",
  );
  const isBetweenMDAndLG = useMediaQuery(
    "(min-width: 960px) and (max-width: 1279px)",
  );

  const paddingTopValue = isBelow600
    ? "15%"
    : isBetweenSMAndMD
    ? "12%"
    : isBetweenMDAndLG
    ? "4%"
    : undefined;

  const handleTabsValueChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countData, setCountData] = useState([]);
  const [showSearchTable, setShowSearchTable] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  // const [services, setServices] = useState([]);
  const [modeTypes, setModeTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [wards, setWards] = useState([]);

  const [applications, setApplications] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [filteredServices, setFilteredServices] = useState([]);

  let [servicesAPI, setServicesAPI] = useState([]);
  let [services, setServices] = useState(null);

  const [_expanded, set_Expanded] = React.useState();
  const [accordionOpen, setAccordionOpen] = React.useState(false);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [table, setTable] = useState([
    {
      srNo: 1,
      applicationNumber: 1,
      applicationDate: "12/12/2023",
      applicantName: "ABC",
      moduleName: "PABBM",
      serviceName: "Auditorium Booking",
      pendingWith: "HOD",
    },
  ]);
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
  const headers = { Authorization: `Bearer ${token}` };

  const removeLocalStorageItems = () => {
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("DepartSideEditApplication");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("sportsBookingAddMemberKey");
    localStorage.removeItem("sportsBookingKey");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("disablityNameYNA");
    localStorage.removeItem("GroundBookingId");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("propertyRegistractionId");
  };
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    removeLocalStorageItems();
  }, []);

  useEffect(() => {
    getApplication();
    getServices();
    getZoneKeys();
    getCFCWiseCount();
    // getServiceName();
    getRTIStatus();
    getSlumStatus();
    getGMStatus();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, []);

  const setStausFilter = (statusId, applicationUniqueId) => {
    console.log("service id ", applicationUniqueId);
    if (applicationUniqueId === 17) {
      return language === "en"
        ? rtiStatus &&
            rtiStatus.find((obj) => obj.status === Number(statusId))?.statusTxt
        : rtiStatus &&
            rtiStatus.find((obj) => obj.status === Number(statusId))
              ?.statusTxtMr;
    } else if (applicationUniqueId === 18) {
      return language === "en"
        ? slumStatus &&
            slumStatus.find((obj) => obj.status === Number(statusId))?.statusTxt
        : slumStatus &&
            slumStatus.find((obj) => obj.status === Number(statusId))
              ?.statusTxtMr;
    } else if (applicationUniqueId == 9) {
      return language === "en"
        ? gmStatus &&
            gmStatus.find((obj) => obj.id === Number(statusId))?.statusTxt
        : gmStatus &&
            gmStatus.find((obj) => obj.id === Number(statusId))?.statusTxtMr;
    } else {
      return statusId;
    }
  };

  const getRTIStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setRTIStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          })),
        );
      });
  };

  const getSlumStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSlumStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          })),
        );
      });
  };

  const getGMStatus = () => {
    axios
      .get(`${urls.GM}/complaintStatusMaster/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setGmStatus(
          res.data?.complaintStatusMasterList?.map((r, i) => ({
            id: r.id,
            statusTxt: r.complaintStatus,
            statusTxtMr: r.complaintStatusMr,
            status: r.status,
          })),
        );
      });
  };

  const getCFCWiseCount = () => {
    let selectedcfcName = user?.userDao?.cfc;
    axios
      .get(
        `${urls.CFCURL}/trasaction/report/getTotalApplication?cfcId=${selectedcfcName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(
          "post33",
          typeof res?.data?.reportResponce,
          res?.data?.reportResponce,
        );
        setCountData({
          totalApplications: res?.data?.reportResponce.totalApplications
            ? res?.data?.reportResponce.totalApplications
            : 0,
          complitedApplication: res?.data?.reportResponce.complitedApplication
            ? res?.data?.reportResponce.complitedApplication
            : 0,
          pendingAtDepartment: res?.data?.reportResponce.pendingAtDepartment
            ? res?.data?.reportResponce.pendingAtDepartment
            : 0,
          rejectedApplication: res?.data?.reportResponce.rejectedApplication
            ? res?.data?.reportResponce.rejectedApplication
            : 0,
        });

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
        setCountData({
          totalApplications: 0,
          complitedApplication: 0,
          pendingAtDepartment: 0,
          rejectedApplication: 0,
        });
      });
  };

  const getMyApplications = async (
    _pageNo = 0,
    _pageSize = 10,
    _sortBy = "applicationDate",
    _sortDir = "Desc",
  ) => {
    setLoading(true);
    let loggedInUser = localStorage.getItem("loggedInUser");
    let url =
      loggedInUser == "departmentUser"
        ? `${urls.CFCURL}/transaction/citizen/cfcMyApplications?citizenId=${
            user?.id
          }&applicantType=${3}`
        : `${urls.CFCURL}/transaction/citizen/cfcMyApplications?citizenId=${
            user?.id
          }&applicantType=${2}`;

    axios
      .get(
        // `${urls.CFCURL}/transaction/citizen/myApplications?citizenId=${user?.id}`
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log("res", res);
        // setData({
        //   rows: res.data.map((r, i) => ({
        //     srNo: i + 1,
        //     ...r,
        //     id: r.applicationId,
        //     applicationDate:
        //       r.applicationDate === null ? "-" : r.applicationDate,
        //     serviceName: serviceList?.find((s) => s.id == r.serviceId)
        //       ?.serviceName,
        //     serviceNameMr: serviceList?.find((s) => s.id == r.serviceId)
        //       ?.serviceNameMr,
        //     clickTo: serviceList?.find((s) => s.id == r.serviceId)?.clickTo,
        //   })),

        //   totalRows: res?.data?.length,
        //   rowsPerPageOptions: [10, 20, 50, 100],
        //   pageSize: 10,
        // });
        setLoading(false);
        setDataToTable(res.data);
      })
      .catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (dataTotable != null)
      setDataSource(
        dataTotable.map((r, i) => ({
          srNo: i + 1,
          ...r,
          id: r.applicationId,
          applicationDate: r.applicationDate === null ? "-" : r.applicationDate,
          serviceName: servicesAPI?.find((s) => s.id == r.serviceId)
            ?.serviceName,
          serviceNameMr: servicesAPI?.find((s) => s.id == r.serviceId)
            ?.serviceNameMr,
          statusId: r.applicationStatus,
          applicationStatus: setStausFilter(
            r.applicationStatus,
            r.applicationUniqueId,
          ),
          clickTo: servicesAPI?.find((s) => s.id == r.serviceId)?.clickTo,
        })),
      );
  }, [dataTotable, language, servicesAPI]);

  const user = useSelector((state) => {
    console.log("user", state.user.user);
    return state.user.user;
  });

  // let [services, setServices] = useState(getServicesByAppId(getAppId(0)));

  useEffect(() => {
    if (servicesAPI.length != 0) {
      setServices(getServicesByAppId(getAppId(0)));
    }
  }, [servicesAPI]);

  const handleChange = (panel, accordionOpen, val) => {
    set_Expanded(accordionOpen ? panel : false);
    let vh = [];
    let arr = [];

    setFilteredServices([]);
    applications?.map((_val) => {
      vh = services?.filter((txt) => {
        return val.id === txt.application && txt;
      });
      arr = [];
      arr.push(...vh);
      setFilteredServices(arr);
    });
  };

  const handleChangeApplication = (e, val) => {
    setValue(val);
    let appId = getAppId(val);
    console.log("val", appId);
    setServices(getServicesByAppId(appId));
  };

  function getServicesByAppId(appId) {
    return servicesAPI?.filter((v) => appId === v.application)?.map((r) => r);
  }

  function getAppId(index) {
    let filteredApplications = applications?.filter((val) => val.id != 23);
    return filteredApplications[index]?.id;
    // return usersCitizenDashboardData?.applications[index]?.id;
  }

  const getServices = () => {
    setLoading(true);
    axios
      .get(`${URLs.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setLoading(false);
          setServicesAPI(r.data.service);
        } else {
          setLoading(false);
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
        console.log(err);
      });
  };

  // get zones
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZones(
          r?.data?.zone?.map((zone) => ({
            id: zone.id,
            zoneName: zone?.zoneName,
            zoneNameMr: zone?.zoneNameMr,
          })),
        );
      })
      .catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  let zoneKey = watch("zoneKey");
  const getWardKeys = () => {
    if (zoneKey) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zoneKey}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((r) => {
          setWards(
            r?.data?.map((ward) => ({
              id: ward.id,
              wardName: ward.wardName,
              wardNameMr: ward.wardNameMr,
            })),
          );
        })
        .catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };
  useEffect(() => {
    getWardKeys();
  }, [watch("zoneKey")]);

  const getApplication = () => {
    setLoading(true);
    axios
      // .get('http://localhost:8090/cfc/api/master/application/getAll')
      .get(`${URLs.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          setLoading(false);

          setApplications(
            r.data.application
              ?.sort(function (a, b) {
                return a.displayOrder - b.displayOrder;
              })
              .filter((val) => {
                return val.module === 1;
              }),
          );
        } else {
          setLoading(false);
          message.error("Login Failed ! Please Try Again !");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        callCatchMethod(err, language);
      });
  };

  const handleModuleClick = (val) => {
    let vh = [];
    let arr = [];

    setFilteredServices([]);
    applications.map((_val) => {
      vh = services.filter((txt) => {
        return val.id === txt.application && txt;
      });
      arr = [];
      arr.push(...vh);
      setFilteredServices(arr);
    });
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDrawerOpen = () => {
    console.log("drawer opem");
    setOpen(true);
  };
  const handleDrawerClose = () => {
    console.log("drawer opem");
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    router.push("/login");
  };

  const isSearchButtonDisabled = () => {
    if (
      // (watch("fromDate") === null || watch("fromDate") === "") &&
      // (watch("toDate") === null || watch("toDate") === "")
      (watch("zoneKey") === "" || watch("zoneKey" === undefined)) &&
      (watch("wardKey") === "" || watch("wardKey" === undefined))
    )
      return true;
    else {
      return false;
    }
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    console.log("formData", formData);
    let _body = {
      ...formData,
      fromDate: moment(formData.fromDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
      toDate: moment(formData.toDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };
    let selectedcfcName = user?.userDao?.cfc;

    axios
      .get(
        `${urls.CFCURL}/trasaction/report/getByCfcIdAndApplicationNo?cfcId=${selectedcfcName}&applicationNo=${formData?.applicationNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r, index) => {
        console.log("By id", r);
        if (r?.data?.httpStatus == "NOT_FOUND") {
          toast(r?.data?.message, {
            type: "error",
          });
          setLoading(false);
        } else {
          setTable([
            {
              srNo: 1,
              applicationNumber: r?.data?.applicationNo,
              applicationDate: r?.data?.applicationDate
                ? moment(r?.data?.applicationDate).format("DD/MM/YYYY")
                : "-",
              applicantName: r?.data?.applicantName,
              // moduleName: "PABBM",
              serviceName: servicesAPI?.find((s) => s.id == r?.data?.service)
                ?.serviceName,
              pendingWith: r?.data?.pendingWith,
            },
          ]);
          setLoading(false);
          setShowSearchTable(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });

    console.log("FormData", _body);
  };
  const [iconColor, seticonColor] = useState("grey");
  const changeIconColor = (color) => {
    console.log(`icon color ${color}`);
    const icons = document.querySelectorAll(".icon-element");
    icons.forEach((icons) => {
      icons.style.color = color;
    });
    seticonColor(color);
    const elements = document.querySelectorAll(".background-element");

    elements.forEach((element) => {
      element.style.borderRight = `thick double ${color}`;
    });
  };

  const [tempColor, setTempColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(15);
  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: fontSize + 40 }} />;
  };
  const changeFontColor = (color) => {
    const textElements = document.querySelectorAll(".text-element");
    textElements.forEach((textElement) => {
      textElement.style.color = color;
    });
    setTempColor(color);
  };
  const _columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      flex: 0.5,
    },
    {
      field: "applicationNumber",
      headerName: language == "en" ? "Applications Number" : "अर्ज क्रमांक",
      flex: 1,
    },
    {
      field: "applicationDate",
      headerName: language == "en" ? "Applications Date" : "अर्जाची तारीख",
      flex: 1,
    },
    {
      field: "applicantName",
      headerName: language == "en" ? "Applicant Name" : "अर्जदाराचे नाव",
      flex: 1,
    },
    // {
    //   field: "moduleName",
    //   headerName: language == "en" ? "Module Name" : "मॉड्यूलचे नाव",
    //   flex: 1,
    // },
    {
      field: "serviceName",
      headerName: language == "en" ? "Service Name" : "सेवेचे नाव",
      flex: 1,
    },
    {
      field: "pendingWith",
      headerName: language == "en" ? "Pending With" : "सह प्रलंबित",
      flex: 1,
    },
  ];

  const columns = [
    {
      field: "srNo",
      headerName: language === "en" ? "Sr.No" : "अ.क्र",
      // flex: 1,
      pinnable: false,
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: language === "en" ? "Service Name" : "सेवेचे नाव",
      // headerName: "Service Name",
      // flex: 4,
      width: 300,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: language === "en" ? "Application Number" : "अर्ज क्रमांक",
      // headerName: "Application Number",
      // flex: 6,
      width: 300,
      align: "left",
      headerAlign: "center",
    },

    // {
    //   field: moment('applicationDate', 'YYYY-MM-DD').format('DD-MM-YYYY'),
    //   headerName: language === 'en' ? 'Application Date' : 'अर्जाचा दिनांक',
    //   // type: "number",
    // // flex: 2,
    //   // minWidth: 250,
    // width: 120,
    //   align: 'center',
    //   headerAlign: 'center',
    // },

    {
      field: "applicationDate",
      headerName: language === "en" ? "Application Date" : "अर्जाचा दिनांक",
      // type: "number",
      // flex: 2,
      // minWidth: 250,
      width: 120,
      align: "center",
      headerAlign: "center",

      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "applicationStatus",
      headerName: language === "en" ? "Status" : "स्थिती",
      // type: "number",
      width: 300,
      // flex: 6,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: language === "en" ? "Actions" : "कृती",
      // headerName: "Actions",
      // width: 225,
      minWidth: 900,
      // flex: 4,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params?.row?.applicationUniqueId == 8 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 76) {
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/transactions/provisionalBuildingNoc/form",
                              query: {
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/prints/acknowledgmentReceiptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "View ACKNOWLEDGMENT"
                            : "पोच पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW LOI"
                            : "स्वीकृती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                // ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/Receipts/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/marriageCertificateNew",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 12) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 11) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/marriageCertificate",
                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                          else if (
                            [14, 15, 67].includes(params.row.serviceId)
                          ) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",

                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                // ...params.row,
                              },
                            });
                          }
                          // else if (params.row.serviceId == 15) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // } else if (params.row.serviceId == 14) {
                          //   router.push({
                          //     pathname: "/marriageRegistration/reports/boardcertificateui",

                          //     query: {
                          //       serviceId: params.row.serviceId,
                          //       applicationId: params.row.applicationId,
                          //       // ...params.row,
                          //     },
                          //   });
                          // }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {[
                    "SR_CLERK_SENT_BACK_TO_CITIZEN",
                    "APPLICATION_SENT_BACK_CITIZEN",
                  ].includes(params?.row?.applicationStatus) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                            query: {
                              ...params.row,
                              pageMode: "Edit",
                              // disabled: true,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}

            {/* Marriage Registration Start */}
            {params?.row?.applicationUniqueId == 2 && (
              <>
                <Stack direction="row">
                  <div
                    style={{ display: "flex", flexDirection: "row", gap: 10 }}
                  >
                    {params.row.serviceId == 10 && (
                      <>
                        {/** Draft*/}
                        {/* {params.row.applicationStatus == "DRAFT" && (
                          <>
                            <Button
                              style={{
                                height: "30px",
                                width: "100px",
                              }}
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                let url;

                                // issuance
                                if (params?.row?.serviceId == 10) {
                                  localStorage.setItem(
                                    "issuanceOfHawkerLicenseId",
                                    params?.row?.id,
                                  );
                                  url = `/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration`;
                                }

                                localStorage.setItem("Draft", "Draft");
                                router.push(url);
                              }}
                            >
                              Draft
                            </Button>
                          </>
                        )} */}

                        {params.row.applicationStatus == "DRAFT" ? (
                          <Button
                            style={{
                              height: "30px",
                              width: "90px",
                            }}
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              router.push({
                                pathname: `/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration`,
                                query: {
                                  // disabled: false,
                                  ...params.row,
                                  pageMode: "Edit",
                                  draftId: params?.row?.id,
                                },
                              });
                            }}
                          >
                            Draft
                          </Button>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </div>
                  {![
                    "CERTIFICATE_ISSUED",
                    "CERTIFICATE_GENERATED",
                    "PAYEMENT_SUCCESSFULL",
                  ].includes(params?.row?.applicationStatus) && (
                    // {params?.row?.applicationStatus != "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            //  new marriage registration
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            //  marriage board registration
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                // pageMode: "View",
                                disabled: true,
                                // role: 'DOCUMENT_CHECKLIST',
                                pageHeader: "View Application",
                                pageMode: "Check",
                                pageHeaderMr: "अर्ज पहा",
                              },
                            });
                          } else if (params.row.serviceId == 11) {
                            // reissuance of marriage certificate

                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            // renewal of marriage board certificate

                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            // modification of marriage certificate
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            // modification of marriage certificate
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                                viewDocs: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button
                            style={
                              {
                                // height: "30px",
                                // width: "200px",
                              }
                            }
                            // variant="contained"
                            color="primary"
                          >
                            <RemoveRedEyeIcon />
                            {/* {language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"} */}
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus !== "DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/Receipts/acknowledgmentReceiptmarathi",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "View ACKNOWLEDGMENT"
                            : "पोच पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params.row.serviceId == 14 &&
                    params?.row?.applicationStatus ===
                      "APPLICATION_CREATED" && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Pay" : "पैसे भरा"}
                        </Button>
                      </IconButton>
                    )}

                  {params.row.serviceId == 11 &&
                    params?.row?.applicationStatus ===
                      "APPLICATION_CREATED" && (
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Pay" : "पैसे भरा"}
                        </Button>
                      </IconButton>
                    )}
                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "220px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/citizen/printForm",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "130px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "PRINT FORM" : "प्रत काढा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {["APPLICATION_CREATED"].includes(
                    params?.row?.applicationStatus &&
                      (params.row.serviceId == 67 ||
                        params.row.serviceId == 15 ||
                        params.row.serviceId == 14),
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardForm",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "Print Form" : "प्रिंट फॉर्म"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["APPLICATION_REJECTED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/BoardRejectionNote",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Rejection Note"
                            : "नकार देणारा आदेश"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["LOI_GENERATED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                    <>
                      <>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() => {
                              if (params.row.serviceId == 10) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 67) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 15) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 12) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW LOI"
                                : "स्वीकृती पत्र पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                      </>

                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == 10) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 67) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 15) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 12) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 11) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            } else if (params.row.serviceId == 14) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                                query: {
                                  // ...record.row,
                                  ...params.row,
                                  id: params.row.id,
                                  role: "CASHIER",
                                  applicationSide: "Citizen",
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "Pay" : "पैसे भरा"}
                          </Button>
                        </IconButton>
                      </div>
                    </>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                // ...params.row,
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["CERTIFICATE_ISSUED", "CERTIFICATE_GENERATED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/marriageCertificateNew",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          } else if ([15, 67].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          } else if ([14].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                                certiMode: "renew",
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {((![11, 14].includes(params?.row?.serviceId) &&
                    params?.row?.applicationStatus ===
                      "SR_CLERK_SENT_BACK_TO_CITIZEN") ||
                    params?.row?.applicationStatus ===
                      "APPLICATION_SENT_BACK_CITIZEN") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                draftId: Number(params.row.id),
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus != "DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./common/masters/feedbackAndRating",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "Citizen",
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Feedback & Rating"
                            : "अभिप्राय आणि मानांकन श्रेणी"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}
            {/* Marriage Registration End */}

            {params?.row?.applicationUniqueId == 12 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 112 && (
                  <>
                    {/* <Button
                      variant='contained'
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: 'view' },
                        })
                      }}
                    >
                      View Application
                    </Button> */}

                    {params.row.applicationStatus === "Reassigned by Clerk" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                            query: { id: params.row.id, pageMode: "edit" },
                          });
                        }}
                      >
                        Edit Application
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/application/view`,
                            // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                            query: { id: params.row.id, pageMode: "view" },
                          });
                        }}
                      >
                        View Application
                      </Button>
                    )}

                    {params.row.applicationStatus == "License Generated" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/petLicense`,
                            query: { id: params.row.id },
                          });
                        }}
                        endIcon={<Pets />}
                      >
                        View License
                      </Button>
                    )}
                    {params.row.applicationStatus == "Approved by HOD" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/petLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 75 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 115 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/application/view`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          query: { id: params.row.id, pageMode: "view" },
                        });
                      }}
                    >
                      View Application
                    </Button>

                    {params.row.applicationStatus == "License Generated" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/petLicense`,
                            query: { id: params.row.id },
                          });
                        }}
                        endIcon={<Pets />}
                      >
                        View License
                      </Button>
                    )}

                    {params.row.applicationStatus == "Approved by HOD" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/veterinaryManagementSystem/transactions/renewalPetLicense/paymentGateway`,
                            query: { id: params.row.id, amount: 50 },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 128 && (
                  <>
                    {params.row.applicationStatus ==
                      "Application Submitted" && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/veterinaryManagementSystem/transactions/petIncinerator/paymentGateway",
                            query: { id: params.row.id },
                          })
                        }
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {params?.row?.applicationUniqueId == 13 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 85 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration`,
                          // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                          // query: { id: params.row.id, pageMode: "view" },
                          query: {
                            disabled: true,
                            // ...record.row,
                            ...params.row,
                            // role: 'DOCUMENT_CHECKLIST',
                            // pageHeader: 'DOCUMENT CHECKLIST',
                            pageMode: "Check",
                            // pageHeaderMr: 'कागदपत्र तपासणी',
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                    {params.row.applicationStatus == "I_CARD_ISSUE" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/scrutiny/IdCardOfLibraryMember",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* <FormattedLabel id="makePayment" /> */}
                        Library Card
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "APPLICATION_SEND_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/newMembershipRegistration/citizen/newMembershipRegistration",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              pageMode: "Edit",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                        {/* Library Card */}
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 90 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push({
                          pathname: `/lms/transactions/renewMembership/scrutiny/viewMembership`,
                          query: {
                            disabled: true,
                            // ...record.row,
                            // ...params.row,
                            id: params.row.id,
                            // role: 'DOCUMENT_CHECKLIST',
                            // pageHeader: 'DOCUMENT CHECKLIST',
                            // pageMode: "Check",
                            // pageHeaderMr: 'कागदपत्र तपासणी',
                            side: true,
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )}
                    {params.row.applicationStatus == "I_CARD_ISSUE" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/scrutiny/IdCardOfLibraryMember",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {/* <FormattedLabel id="makePayment" /> */}
                        Library Card
                      </Button>
                    )}
                    {params.row.applicationStatus ==
                      "APPLICATION_SEND_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/lms/transactions/renewMembership/citizen/",

                            query: {
                              // ...record.row,
                              // ...params.row,
                              id: params.row.id,
                              // role: "CASHIER",
                              pageMode: "Edit",
                              applicationSide: "Citizen",
                              side: true,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language === "en" ? "EDIT APPLICATION" : "त्रुटी करा"}
                        {/* Library Card */}
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {/** Sport */}

            {params?.row?.applicationUniqueId == 6 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 68 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false",
                        );

                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/groundBookingNew/citizen",
                          query: {
                            // id: params.row.id,
                            applicationNumber: params.row.applicationNumber,
                            pageMode: "Add",
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/groundBookingNew/Pay`,
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        Pay
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        //   localStorage.setItem("id", params?.row?.id);
                        //   router.push(`/sportsPortal/transaction/groundBookingNew/Pay`);

                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false",
                          );
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/groundBookingNew/scrutiny/SanctionLetter/sanctionLetterc",
                            query: {
                              // ...body,
                              role: "LICENSE_ISSUANCE",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        Sanction Letter ISSUANCE
                      </Button>
                    )}
                  </>
                )}
                {params.row.serviceId == 35 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false",
                        );
                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/swimmingPoolM/citizen",
                          query: {
                            // id: params.row.id,
                            pageMode: "Add",
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false",
                          );
                          router.push(
                            `/sportsPortal/transaction/swimmingPoolM/card`,
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View I-Card
                      </Button>
                    )}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false",
                          );
                          router.push(
                            `/sportsPortal/transaction/swimmingPoolM/Pay`,
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        Pay
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("675675", params.row.id);
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem("applicationRevertedToCititizen", "false");

                          router.push({
                            pathname: "/sportsPortal/transaction/swimmingPoolM/LoiReceipt",
                            query: {
                              id: params.row.id,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        LOI Receipt
                      </Button>
                    )} */}

                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 36 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        console.log("675675", params.row.id);
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false",
                        );

                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/gymBooking/citizenView",
                          query: {
                            // id: params.row.id,
                            pageMode: "View",
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      // <Button
                      //   variant="contained"
                      //   onClick={() => {
                      //     router.push({
                      //       pathname: "/sportsPortal/transaction/swimmingPoolM/sanction",
                      //       query: {
                      //         // id: id,
                      //         // middleName: record?.row?.middleName,
                      //         // lastName: record?.row?.lastName,
                      //         // bookingRegistrationId: record?.row?.bookingRegistrationId,
                      //         // amount: record?.row?.amount,
                      //         // mobileNo: record?.row?.mobileNo,
                      //         // applicationDate: record?.row?.applicationDate,
                      //         // receiptNo: record?.row?.receiptNo,
                      //       },
                      //     });
                      //   }}
                      //   endIcon={<Payment />}
                      // >
                      //   I-CARD
                      // </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("675675", params.row.id);
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "false",
                          );
                          router.push(
                            `/sportsPortal/transaction/gymBooking/card`,
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View I-Card
                      </Button>
                    )}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/gymBooking/Pay`,
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        Pay
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          console.log("675675", params.row.id);
                          localStorage.setItem("id", params?.row?.id);
                          localStorage.setItem("applicationRevertedToCititizen", "false");

                          router.push({
                            pathname: "/sportsPortal/transaction/swimmingPoolM/LoiReceipt",
                            query: {
                              id: params.row.id,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        LOI Receipt
                      </Button>
                    )} */}

                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 29 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        console.log("675675", params.row.id);
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false",
                        );

                        // router.push(`/sportsPortal/transaction/swimmingPoolM/citizen`);
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/sportBooking/citizen",
                          query: {
                            // id: params.row.id,
                            pageMode: "Add",
                          },
                        });
                      }}
                    >
                      View Application
                    </Button>

                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/sportBooking/PaymentCollection`,
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        Pay
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);

                          router.push(
                            `/sportsPortal/transaction/sportBooking/SanctionLetter/sanctionLetterc`,
                          );
                          // router.push(`/sportsPortal/transaction/sportBooking/Pay`);
                        }}
                        endIcon={<Payment />}
                      >
                        View Sanction Letter
                      </Button>
                    )}
                    {/* {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: "/sportsPortal/transaction/groundBookingNew/scrutiny/PaymentCollection",

                            query: {
                              // ...record.row,
                              ...params.row,
                              id: params.row.id,
                              role: "CASHIER",
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        <FormattedLabel id="makePayment" />
                      </Button>
                    )} */}
                  </>
                )}

                {params.row.serviceId == 32 && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        console.log("675675", params.row.id);
                        localStorage.setItem("id", params?.row?.id);
                        localStorage.setItem(
                          "applicationRevertedToCititizen",
                          "false",
                        );
                        router.push({
                          pathname:
                            "/sportsPortal/transaction/swimmingPool/citizenView",
                          query: {
                            // id: params.row.id,
                            pageMode: "Add",
                          },
                        });

                        // router.push(`/sportsPortal/transaction/swimmingPool/citizenView`);
                      }}
                    >
                      View Application
                    </Button>
                    {params.row.applicationStatus == "APPLICATION_CREATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          console.log("9887676546", params?.row?.id);
                          router.push(
                            `/sportsPortal/transaction/swimmingPool/PaymentCollection2`,
                          );
                        }}
                        endIcon={<Payment />}
                      >
                        PAY
                      </Button>
                    )}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.setItem("id", params?.row?.id);
                          router.push({
                            pathname:
                              "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt",
                            query: {
                              applicationId: params.row.id,
                              // pageMode: "Add",
                            },
                          });

                          // router.push(
                          //   "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt"
                          // );
                          // router.push(`/sportsPortal/transaction/sportBooking/Pay`);
                        }}
                        // onClick={() => {
                        //   router.push({
                        //     pathname:
                        //       "/sportsPortal/transaction/swimmingPool/ServiceChargeRecipt",

                        //   });
                        // }}
                        endIcon={<Payment />}
                      >
                        RECEIPT
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
            {/** Sport End */}

            {/** Hawker */}
            {params?.row?.applicationUniqueId == 4 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {(params?.row?.serviceId == 24 ||
                  params?.row?.serviceId == 25 ||
                  params?.row?.serviceId == 26 ||
                  params?.row?.serviceId == 27) && (
                  <>
                    {/** Draft*/}
                    {params.row.applicationStatus == "DRAFT" && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            let url = ``;

                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense`;
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }

                            localStorage.setItem("Draft", "Draft");
                            router.push(url);
                          }}
                        >
                          {language == "en" ? "Draft" : "ड्राफ्ट"}
                        </Button>
                      </>
                    )}

                    {/** View Application */}
                    {(params.row.applicationStatus == "APPLICATION_CREATED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_BACK_TO_DEPT_CLERK" ||
                      params.row.applicationStatus == "SITE_VISIT_COMPLETED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER" ||
                      params.row.applicationStatus ==
                        "APPLICATION_SENT_TO_WARD_OFFICER" ||
                      params.row.applicationStatus ==
                        "DEPT_CLERK_VERIFICATION_COMPLETED" ||
                      params.row.applicationStatus == "SITE_VISIT_SCHEDULED" ||
                      params.row.applicationStatus ==
                        "APPLICATION_VERIFICATION_COMPLETED") && (
                      <>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            let url = ``;

                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense`;
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id,
                              );
                              url = `/streetVendorManagementSystem/transactions/transferOfStreetVendorLicense`;
                            }

                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "true",
                            );
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseInputState",
                              "true",
                            );
                            router.push(url);
                          }}
                        >
                          {language == "en" ? "View Application" : "अर्ज पहा"}
                        </Button>

                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            // cancellation
                            else if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }

                            localStorage.setItem(
                              "applicationRevertedToCititizen",
                              "false",
                            );

                            router.push(
                              `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/AcknowledgementReceipt`,
                            );
                          }}
                        >
                          {language == "en"
                            ? "Acknowledgement Receipt"
                            : "अर्जाची पावती"}
                        </Button>
                      </>
                    )}

                    {/** Edit Application */}
                    {params.row.applicationStatus ==
                      "APPLICATION_SENT_BACK_TO_CITIZEN" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          let url = ``;

                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id,
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id,
                            );
                            url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id,
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id,
                            );
                            url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                          }

                          localStorage.setItem(
                            "applicationRevertedToCititizen",
                            "true",
                          );

                          router.push(url);
                        }}
                      >
                        {language == "en"
                          ? " Edit Application"
                          : "अर्ज संपादित करा"}
                      </Button>
                    )}

                    {/** LOI Recipte  */}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }

                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGenerationRecipt`,
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language == "en"
                          ? "Service Acceptance Letter"
                          : "सेवा स्वीकृती पत्र"}
                      </Button>
                    )}

                    {/** Payment Collection */}
                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }

                          router.push({
                            pathname:
                              "/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollection",

                            query: {
                              applicationSide: "Citizen",
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        {language == "en"
                          ? "Payment Collection"
                          : "पेमेंट संकलन"}
                      </Button>
                    )}

                    {/** Payment Recipt */}
                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          // issuance
                          if (params?.row?.serviceId == 24) {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // renewal
                          else if (params?.row?.serviceId == 25) {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // cancellation
                          else if (params?.row?.serviceId == 27) {
                            localStorage.setItem(
                              "cancellationOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }
                          // transfer
                          else if (params?.row?.serviceId == 26) {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              params?.row?.id,
                            );
                          }

                          router.push(
                            `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollectionRecipt`,
                          );
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        {language == "en"
                          ? "Payment Receipt"
                          : "पैसे भरल्याची पावती"}
                      </Button>
                    )}

                    {/** View Certificate */}
                    {(params.row.applicationStatus == "I_CARD_ISSUED" ||
                      params.row.applicationStatus == "CERTIFICATE_GENERATED" ||
                      params.row.applicationStatus == "I_CARD_GENERATED" ||
                      params.row.applicationStatus == "LICENSE_ISSUED") &&
                      (params?.row?.serviceId == 24 ||
                        params?.row?.serviceId == 25 ||
                        params?.row?.serviceId == 26) && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }

                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }

                            router.push(
                              `/streetVendorManagementSystem/components/Certificate`,
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {language == "en"
                            ? "View Certificate"
                            : "प्रमाणपत्र पहा"}
                        </Button>
                      )}

                    {/** View I Card */}
                    {(params.row.applicationStatus == "I_CARD_ISSUED" ||
                      params.row.applicationStatus == "I_CARD_GENERATED" ||
                      params.row.applicationStatus == "LICENSE_ISSUED") &&
                      (params?.row?.serviceId == 24 ||
                        params?.row?.serviceId == 25 ||
                        params?.row?.serviceId == 26) && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // issuance
                            if (params?.row?.serviceId == 24) {
                              localStorage.setItem(
                                "issuanceOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            // renewal
                            else if (params?.row?.serviceId == 25) {
                              localStorage.setItem(
                                "renewalOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }

                            // transfer
                            else if (params?.row?.serviceId == 26) {
                              localStorage.setItem(
                                "transferOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }

                            router.push(
                              `/streetVendorManagementSystem/components/IdentityCard`,
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {language == "en" ? "View ID Card" : "ओळखपत्र पहा"}
                        </Button>
                      )}

                    {/** view cancellation Letter */}
                    {params.row.applicationStatus == "LICENSE_CANCELLED" &&
                      params?.row?.serviceId == 27 && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            // cancellation
                            if (params?.row?.serviceId == 27) {
                              localStorage.setItem(
                                "cancellationOfHawkerLicenseId",
                                params?.row?.id,
                              );
                            }
                            router.push(
                              `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense/LetterCancellationofHawkerLicense`,
                            );
                          }}
                          endIcon={<VisibilityIcon />}
                        >
                          {" "}
                          {language == "en"
                            ? "cancel certificate"
                            : "प्रमाणपत्र रद्द करा"}
                        </Button>
                      )}
                    {params.row.applicationStatus != "DRAFT" && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname: "./common/masters/feedbackAndRating",
                              query: {
                                showData: JSON.stringify(params.row),
                                user: "Citizen",
                              },
                            });
                          }}
                        >
                          <Button variant="contained" color="primary">
                            {language === "en"
                              ? "Feedback & Rating"
                              : "अभिप्राय आणि मानांकन श्रेणी"}
                          </Button>
                        </IconButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            {/** Hawker End */}

            {params?.row?.applicationUniqueId == 7 && (
              <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                {params.row.serviceId == 7 && (
                  <>
                    {params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                    params.row.applicationStatus == "APPROVE_BY_LI" ||
                    params.row.applicationStatus == "APPROVE_BY_OS" ||
                    params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                    params.row.applicationStatus == "SITE_VISITED" ||
                    params.row.applicationStatus == "APPROVE_BY_HOD" ||
                    params.row.applicationStatus == "LOI_GENERATED" ||
                    params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/transactions/components/ViewForm`,
                              // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                              // query: { id: params.row.id, pageMode: "view" },
                              query: {
                                disabled: true,
                                ...params.row,
                                pageMode: "Check",
                              },
                            });
                          }}
                        >
                          View Application
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/report/acknowledgmentReceipt1`,
                              query: {
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          Acknowledgement Receipt
                        </Button>
                      </>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/LoiGenerationReciptmarathi`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 7,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Loi Receipt View
                      </Button>
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/PaymentCollection`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              role: "LOI_COLLECTION",
                              serviceId: 7,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        Make Payment
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/ServiceChargeRecipt`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 7,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {params.row.applicationStatus == "LICENSE_GENRATED" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/report/businessCertificateReport`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "DRAFT" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfBusinessOrIndustry/`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                            },
                          });
                        }}
                      >
                        Draft
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
                {params.row.serviceId == 8 && (
                  <>
                    {params.row.applicationStatus == "APPLICATION_SUBMITTED" ||
                    params.row.applicationStatus == "APPROVE_BY_LI" ||
                    params.row.applicationStatus == "APPROVE_BY_OS" ||
                    params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                    params.row.applicationStatus == "SITE_VISITED" ||
                    params.row.applicationStatus == "APPROVE_BY_HOD" ||
                    params.row.applicationStatus == "LOI_GENERATED" ||
                    params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/transactions/components/ViewForm`,
                              // query: { id: params.row.id, petAnimal: params.row.petAnimal, pageMode: "view" },
                              // query: { id: params.row.id, pageMode: "view" },
                              query: {
                                disabled: true,
                                ...params.row,
                                pageMode: "Check",
                              },
                            });
                          }}
                        >
                          View Application
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<VisibilityIcon />}
                          onClick={() => {
                            router.push({
                              pathname: `/skySignLicense/report/acknowledgmentReceipt`,
                              query: {
                                id: params.row.id,
                              },
                            });
                          }}
                        >
                          Acknowledgement Receipt
                        </Button>
                      </>
                    ) : (
                      ""
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/LoiGenerationReciptmarathi`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 8,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Loi Receipt View
                      </Button>
                    )}

                    {params.row.applicationStatus == "LOI_GENERATED" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/PaymentCollection`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              role: "LOI_COLLECTION",
                              serviceId: 8,
                            },
                          });
                        }}
                        endIcon={<Payment />}
                      >
                        Make Payment
                      </Button>
                    )}

                    {params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/ServiceChargeRecipt`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                              serviceId: 8,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        Payment Receipt
                      </Button>
                    )}

                    {params.row.applicationStatus == "LICENSE_GENRATED" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/report/industryCertificateReport`,
                            query: {
                              id: params.row.id,
                              citizenView: true,
                            },
                          });
                        }}
                        endIcon={<VisibilityIcon />}
                      >
                        View Certificate
                      </Button>
                    ) : (
                      ""
                    )}
                    {params.row.applicationStatus == "DRAFT" ? (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname: `/skySignLicense/transactions/issuanceOfIndustry/`,
                            query: {
                              // disabled: false,
                              ...params.row,
                              pageMode: "Edit",
                            },
                          });
                        }}
                      >
                        Draft
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </div>
            )}

            {/* Public Auditorium */}
            {params?.row?.applicationUniqueId == 16 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "APPLICATION_DRAFT" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          console.log("params", params.row);
                          router.push({
                            pathname:
                              "./PublicAuditorium/CFC/cfcPaymentCollection",
                            query: {
                              data: JSON.stringify(params.row),
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "PAY DEPOSIT"
                            : "अनामत रक्कम भरा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname: "./CFC_Payment",
                            query: {
                              data: JSON.stringify(params.row),
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "PAY" : "पेमेंट करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "PAYMENT_SUCCESSFUL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          console.log("first33", params.row);
                          router.push({
                            pathname:
                              "./PublicAuditorium/transaction/auditoriumBooking/bookedAcknowledgmentReceipt",
                            query: {
                              showData: JSON.stringify(params.row),
                              user: "CFC_USER",
                              // ...params.row,
                            },
                          });
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Booking Order Copy"
                            : "बुकिंग आदेश प्रत"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "BILL_GENERATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          router.push({
                            pathname:
                              "./PublicAuditorium/CFC/cfcAuditoriumBillPaymentCollection",
                            query: {
                              data: JSON.stringify(params.row),
                            },
                          });
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Pay Extra Equipment Amount"
                            : "अतिरिक्त उपकरणे शुल्क भरा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}

            {/* Town Planning Start */}
            {params?.row?.applicationUniqueId == 3 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "APPLICATION_CREATED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 17) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/partPlan/citizen/partPlan",
                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 18) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/zoneCertificate/citizen/",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,

                                disabled: true,

                                pageHeader: "View Application",
                                pageMode: "View",
                                pageHeaderMr: "अर्ज पहा",
                              },
                            });
                          } else if (params.row.serviceId == 19) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/developmentPlanOpinion/citizen/developmentPlan",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          } else if (params.row.serviceId == 20) {
                            router.push({
                              pathname:
                                "/townPlanning/transactions/setBackCertificate/citizen",

                              query: {
                                ...params.row,
                                applicationId: params.row.applicationId,
                                serviceId: params.row.serviceId,
                                pageMode: "View",
                                disabled: true,
                              },
                            });
                          }
                        }}
                      >
                        <Tooltip
                          title={
                            language === "en" ? "VIEW APPLICATION" : "अर्ज पाहा"
                          }
                        >
                          <Button style={{}} color="primary">
                            <RemoveRedEyeIcon />
                          </Button>
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                  <div className={styles.buttonRow}>
                    <IconButton
                      onClick={() =>
                        router.push({
                          pathname:
                            "/townPlanning/Receipts/acknowledgmentReceiptmarathi",
                          query: {
                            ...params.row,
                          },
                        })
                      }
                    >
                      <Button
                        style={{
                          height: "30px",
                          width: "200px",
                        }}
                        variant="contained"
                        color="primary"
                      >
                        {language === "en"
                          ? "View ACKNOWLEDGMENT"
                          : "पोच पावती पाहा"}
                      </Button>
                    </IconButton>
                  </div>

                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/AppointmentScheduledRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW APPOINTMENT LETTER"
                            : "नियुक्ती पत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["LOI_GENERATED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                    <>
                      <>
                        <div className={styles.buttonRow}>
                          <IconButton
                            onClick={() => {
                              if (params.row.serviceId == 10) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 67) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 15) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              } else if (params.row.serviceId == 12) {
                                router.push({
                                  pathname:
                                    "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
                                  query: {
                                    ...params.row,
                                  },
                                });
                              }
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW LOI"
                                : "स्वीकृती पत्र पाहा"}
                            </Button>
                          </IconButton>
                        </div>
                      </>

                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            if (params.row.serviceId == 10) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 67) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 15) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 12) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 11) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            } else if (params.row.serviceId == 14) {
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/PaymentCollection",
                                query: {
                                  ...params.row,
                                },
                              });
                            }
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "Pay" : "पैसे भरा"}
                          </Button>
                        </IconButton>
                      </div>
                    </>
                  )}

                  {params?.row?.applicationStatus ===
                    "PAYEMENT_SUCCESSFULL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 11) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/ServiceChargeRecipt",
                              query: {
                                serviceId: params.row.serviceId,
                                id: params.row.id,
                              },
                            });
                          } else if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/Receipts/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          } else if (params.row.serviceId == 14) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/RenewalOfMarriageBoardRegisteration/ServiceChargeRecipt",
                              query: {
                                ...params.row,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {["CERTIFICATE_ISSUED", "CERTIFICATE_GENERATED"].includes(
                    params?.row?.applicationStatus,
                  ) && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if ([10, 11, 12].includes(params.row.serviceId)) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/marriageCertificateNew",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          } else if (
                            [14, 15, 67].includes(params.row.serviceId)
                          ) {
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: params.row.serviceId,
                                applicationId: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "VIEW CERTIFICATE"
                            : "प्रमाणपत्र पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}

                  {((![11, 14].includes(params?.row?.serviceId) &&
                    params?.row?.applicationStatus ===
                      "SR_CLERK_SENT_BACK_TO_CITIZEN") ||
                    params?.row?.applicationStatus ===
                      "APPLICATION_SENT_BACK_CITIZEN") && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() => {
                          if (params.row.serviceId == 10) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/newMarriageRegistration/citizen/newRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                              },
                            });
                          } else if (params.row.serviceId == 67) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 12) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          } else if (params.row.serviceId == 15) {
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration",
                              query: {
                                ...params.row,
                                pageMode: "Edit",
                                id: params.row.applicationId,
                              },
                            });
                          }
                        }}
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "180px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "EDIT APPLICATION"
                            : "त्रुटी करा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}
            {/* Town Planning End */}
            {/* Road Excavation start */}
            {params?.row?.applicationUniqueId == 15 && (
              <>
                <Stack direction="row">
                  {params?.row?.applicationStatus === "NOC_GENRATED" ||
                    (params?.row?.applicationStatus ===
                      "PAYEMENT_SUCCESSFUL" && (
                      <div className={styles.buttonRow}>
                        <IconButton
                          onClick={() => {
                            router.push(
                              "/roadExcavation/transaction/documenstGeneration/NOC",
                            );
                          }}
                        >
                          <Button
                            style={{
                              height: "30px",
                              width: "200px",
                            }}
                            variant="contained"
                            color="primary"
                          >
                            {language === "en" ? "NOC" : "एनओसी"}
                          </Button>
                        </IconButton>
                      </div>
                    ))}

                  {params?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push(
                            "/roadExcavation/transaction/documenstGeneration/receipt",
                          )
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en" ? "VIEW RECEIPT" : "पावती पाहा"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus ===
                    "APPOINTMENT_SCHEDULED" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/documenstGeneration/appointmentRecipt",
                            query: {
                              ...params.row,
                            },
                          })
                        }
                      >
                        <Button
                          style={{
                            height: "30px",
                            width: "200px",
                          }}
                          variant="contained"
                          color="primary"
                        >
                          {language === "en"
                            ? "Appointment RECEIPT"
                            : " साइट भेट पावती"}
                        </Button>
                      </IconButton>
                    </div>
                  )}
                  {params?.row?.applicationStatus === "LOI_GENERATED" && (
                    <div className={styles.buttonRow}>
                      {/* <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              '/roadExcavation/transaction/roadExcevationForms/Fees',
                            // query: {
                            //   id: params.Row.id,
                            // },
                          })
                        }
                      > */}
                      {/* {console.log("params.Row.id",params?.row)}, */}
                      <Button
                        style={{
                          height: "30px",
                          width: "200px",
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/roadExcevationForms/Fees",
                            query: {
                              id: params.row.id,
                            },
                          })
                        }
                      >
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                      {/* </IconButton> */}
                    </div>
                  )}

                  {params?.row?.applicationStatus ===
                    "REVERT_BY_JUNIOR_ENGINEER" && (
                    <div className={styles.buttonRow}>
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/roadExcavation/transaction/roadExcevationForms/editForm",
                            query: {
                              id: params.Row.id,
                            },
                          })
                        }
                      >
                        <EditIcon style={{ color: "#556CD6" }} />
                      </IconButton>
                    </div>
                  )}
                </Stack>
              </>
            )}

            {/* Road Excavation end */}

            {/* { RTI applications} */}
            {params?.row?.applicationUniqueId === 17 && (
              <>
                {params?.row?.serviceId === 103 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                "/RTIOnlineSystem/transactions/rtiApplication/ViewRTIApplication",
                              query: { id: params.row.id },
                            });
                          }}
                        >
                          <Tooltip
                            title={
                              language === "en"
                                ? "VIEW APPLICATION"
                                : "अर्ज पहा"
                            }
                          >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                          </Tooltip>
                        </IconButton>
                      )}

                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/rtiApplication",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            {/* <Tooltip
                              title={
                                language == "en"
                                  ? `GO TO APPLICATION FORM`
                                  : "अर्ज फॉर्मवर जा"
                              }
                            > */}
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language == "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                            {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                            {/* </Tooltip> */}
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "2" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                                  query: { id: params.row.applicationNumber },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language == "en"
                                    ? `Download Acknowldgement`
                                    : "पावती डाउनलोड करा"
                                }
                              >
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "200px",
                                  }}
                                  variant="contained"
                                  color="primary"
                                >
                                  {language === "en"
                                    ? "VIEW ACKNOWLDGEMENT"
                                    : "पावती डाउनलोड करा"}
                                </Button>
                              </Tooltip>
                            </IconButton>
                            {params?.row?.col1 === false && (
                              <IconButton
                                onClick={() => {
                                  router.push({
                                    pathname:
                                      "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                    query: { id: params.row.id, trnType: "ap" },
                                  });
                                }}
                              >
                                <Tooltip
                                  title={
                                    language == "en"
                                      ? `Download Payment Receipt`
                                      : "पेमेंट पावती डाउनलोड करा"
                                  }
                                >
                                  <Button
                                    style={{
                                      height: "30px",
                                      width: "230px",
                                    }}
                                    variant="contained"
                                    color="primary"
                                  >
                                    {language === "en"
                                      ? "DOWNLOAD PAYMENT RECEIPT"
                                      : "पेमेंट पावती डाउनलोड करा"}
                                  </Button>
                                </Tooltip>
                              </IconButton>
                            )}
                          </>
                        )}

                      {params?.row?.statusId === "4" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                                query: { id: params.row.applicationNumber },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `View LOI` : "पावती पहा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en" ? `View LOI` : "पावती पहा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                      {params?.row?.statusId === "2" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                                query: {
                                  id: params.row.applicationNumber,
                                  trnType: "ap",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `Make Payment` : "पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make Payment`
                                  : "पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.col2 && params?.row?.statusId != "4" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                query: { id: params.row.id, trnType: "loi" },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `View LOI Receipt`
                                  : "LOI पावती पहा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `View LOI Receipt`
                                  : "LOI पावती पहा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Stack>
                  </>
                )}
                {params?.row?.serviceId === 104 && (
                  <>
                    <Stack direction="row">
                      {params?.row?.statusId != "0" && (
                        <IconButton
                          onClick={() => {
                            router.push({
                              pathname:
                                "/RTIOnlineSystem/transactions/rtiAppeal/ViewRTIAppeal",
                              query: { id: params.row.applicationNumber },
                            });
                          }}
                        >
                          <Tooltip
                            title={
                              language === "en" ? "VIEW APPEAL" : "अर्ज पाहा"
                              // params?.row?.applicationUniqueId
                            }
                          >
                            <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                          </Tooltip>
                        </IconButton>
                      )}
                      {params?.row?.statusId === "0" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/rtiAppeal",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language == "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId === "2" && (
                        <>
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                                query: {
                                  id: params.row.applicationNumber,
                                  trnType: "apl",
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `Make Payment` : "पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make Payment`
                                  : "पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        </>
                      )}

                      {params?.row?.statusId != "0" &&
                        params?.row?.statusId != "2" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                                  query: { id: params.row.applicationNumber },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language == "en"
                                    ? `Download Acknowldgement`
                                    : "पावती डाउनलोड करा"
                                }
                              >
                                <Button
                                  style={{
                                    height: "30px",
                                    width: "200px",
                                  }}
                                  variant="contained"
                                  color="primary"
                                >
                                  {language === "en"
                                    ? "VIEW ACKNOWLDGEMENT"
                                    : "पावती डाउनलोड करा"}
                                </Button>
                              </Tooltip>
                            </IconButton>

                            {params?.row?.col1 === false && (
                              <IconButton
                                onClick={() => {
                                  router.push({
                                    pathname:
                                      "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                                    query: {
                                      id: params.row.id,
                                      trnType: "apl",
                                    },
                                  });
                                }}
                              >
                                <Tooltip
                                  title={
                                    language == "en"
                                      ? `Download Payment Receipt`
                                      : "पेमेंट पावती डाउनलोड करा"
                                  }
                                >
                                  <Button
                                    style={{
                                      height: "30px",
                                      width: "230px",
                                    }}
                                    variant="contained"
                                    color="primary"
                                  >
                                    {language === "en"
                                      ? "DOWNLOAD PAYMENT RECEIPT"
                                      : "पेमेंट पावती डाउनलोड करा"}
                                  </Button>
                                </Tooltip>
                              </IconButton>
                            )}
                          </>
                        )}
                    </Stack>
                  </>
                )}
              </>
            )}

            {/* GM start */}
            {params?.row?.applicationUniqueId === 9 && (
              <>
                <Stack direction="row">
                  {
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                          query: { id: params.row.applicationNumber },
                        });
                      }}
                    >
                      <Tooltip
                        title={
                          language === "en" ? "VIEW APPLICATION" : "अर्ज पहा"
                        }
                      >
                        <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                      </Tooltip>
                    </IconButton>
                  }
                </Stack>
              </>
            )}
            {/* Gm End */}

            {/* Slum start */}
            {params?.row?.applicationUniqueId === 18 && (
              <>
                {/* hut transfer */}
                {params?.row?.serviceId === 123 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "0" &&
                          params?.row?.statusId != "23" &&
                          params.row.statusId != "1" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {/* {params?.row?.statusId === "0" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <DraftsIcon style={{ color: "#556CD6" }} />
                            </IconButton>
                          </>
                        )} */}
                        {params.row.statusId === "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                query: {
                                  id: params.row.id,
                                  isDraft: "f",
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? `GO TO APPLICATION FORM`
                                : "अर्ज फॉर्मवर जा"}
                            </Button>
                          </IconButton>
                        )}
                        {(params?.row?.statusId === "0" ||
                          params?.row?.statusId === "23") && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                                query: {
                                  id: params.row.id,
                                  isDraft:
                                    params?.row?.statusId === "23" ? "f" : "t",
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en" ? "GO TO FORM" : "फॉर्म वर जा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}
                {/* NOC */}
                {params?.row?.serviceId === 129 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "1" &&
                          params?.row?.statusId != "0" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {params?.row?.statusId === "0" && (
                          <>
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/addApplicantDetails",
                                  query: { id: params.row.id },
                                });
                              }}
                            >
                              <DraftsIcon style={{ color: "#556CD6" }} />
                            </IconButton>
                          </>
                        )}

                        {params?.row?.statusId === "1" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/issuanceOfNoc/editAddApplicantNoc",
                                query: { id: params.row.id },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en" ? "GO TO NOC" : "NOC वर जा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en" ? "GO TO NOC" : "NOC वर जा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfNoc",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForNoc",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}

                {/* Photopass */}
                {params?.row?.serviceId === 120 && (
                  <Stack direction="row">
                    {
                      <>
                        {params?.row?.statusId != "0" &&
                          params.row.statusId != 24 &&
                          params.row.statusId != "23" &&
                          params.row.statusId != "1" && (
                            <IconButton
                              onClick={() => {
                                router.push({
                                  pathname:
                                    "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
                                  query: {
                                    id: params.row.id,
                                  },
                                });
                              }}
                            >
                              <Tooltip
                                title={
                                  language === "en"
                                    ? "VIEW APPLICATION"
                                    : "अर्ज पहा"
                                }
                              >
                                <RemoveRedEyeIcon
                                  style={{ color: "#556CD6" }}
                                />
                              </Tooltip>
                            </IconButton>
                          )}

                        {(params?.row?.statusId === "0" ||
                          params?.row?.statusId === "1" ||
                          params.row.statusId === "24") && (
                          <>
                            <IconButton
                              onClick={() => {
                                if (
                                  params.row.statusId === "1" ||
                                  params.row.statusId === "23" ||
                                  params.row.statusId === "24"
                                ) {
                                  router.push({
                                    pathname:
                                      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/editApplicantDetails",
                                    query: {
                                      id: params.row.id,
                                    },
                                  });
                                } else {
                                  router.push({
                                    pathname:
                                      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails",
                                    query: { id: params.row.id },
                                  });
                                }
                              }}
                            >
                              {/* <DraftsIcon style={{ color: "#556CD6" }} /> */}
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language === "en"
                                  ? "GO TO FORM"
                                  : "फॉर्म वर जा"}
                              </Button>
                            </IconButton>
                          </>
                        )}
                        {params.row.statusId != "0" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Button
                              style={{
                                height: "30px",
                                width: "200px",
                              }}
                              variant="contained"
                              color="primary"
                            >
                              {language === "en"
                                ? "VIEW ACKNOWLDGEMENT"
                                : "पावती डाउनलोड करा"}
                            </Button>
                          </IconButton>
                        )}

                        {params.row.statusId === "13" && (
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                                {language == "en"
                                  ? `Make LOI Payment`
                                  : "LOI पेमेंट करा"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )}

                        {/*loi  receipt */}
                        {/* {params.row.statusId==='13' &&(
                          <IconButton
                            onClick={() => {
                              router.push({
                                pathname:
                                  "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                                query: {
                                  id: params.row.applicationNumber,
                                },
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                language == "en" ? `LOI Receipt` : "LOI पावती"
                              }
                            >
                              <Button
                                style={{
                                  height: "30px",
                                  width: "200px",
                                }}
                                variant="contained"
                                color="primary"
                              >
                               {language == "en" ? `LOI Receipt` : "LOI पावती"}
                              </Button>
                            </Tooltip>
                          </IconButton>
                        )} */}
                      </>
                    }
                  </Stack>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Box>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              paddingTop: paddingTopValue,
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <AppBar position="static">
                <Tabs
                  value={tabsValue}
                  onChange={handleTabsValueChange}
                  aria-label="basic tabs example"
                  variant="fullWidth"
                  // indicatorColor="white"
                  TabIndicatorProps={{
                    style: { backgroundColor: "white" },
                  }}
                  textColor="inherit"
                  sx={{
                    display: "flex",
                    // backgroundColor: "#62E641",
                  }}
                >
                  <Tab
                    label={language == "en" ? "My Applications" : "माझे अर्ज"}
                    {...a11yProps(0)}
                    sx={{
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      language == "en" ? "CFC Dashboard" : "सीएफसी डॅशबोर्ड"
                    }
                    {...a11yProps(1)}
                    sx={{
                      flex: 1,
                    }}
                  />
                  <Tab
                    label={
                      language == "en"
                        ? "Apply for services"
                        : "सेवांसाठी अर्ज करा"
                    }
                    {...a11yProps(2)}
                    sx={{
                      flex: 1,
                    }}
                  />
                </Tabs>
              </AppBar>
            </Box>
            <CustomTabPanel value={tabsValue} index={0}>
              <Box
                style={{
                  backgroundColor: "white",
                  /* height: "auto" */ overflowY: "auto",
                  overflowX: "auto",
                  /* width: "auto" */ overflowY: "auto",
                  overflowX: "auto",
                  // overflow: "auto",
                }}
              >
                <DataGrid
                  getRowId={(row) => row.srNo}
                  rowHeight={100}
                  sx={{
                    overflowY: "scroll",
                    overflowX: "scroll",
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
                  autoHeight
                  rows={dataSource}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={tabsValue} index={1}>
              <Box
                style={{
                  backgroundColor: "white",
                  /* height: "auto" */ overflowY: "auto",
                  overflowX: "auto",
                  /* width: "auto" */ overflowY: "auto",
                  overflowX: "auto",
                  // overflow: "auto",
                }}
              >
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* search */}
                    <Grid item xs={9}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        label={
                          language === "en"
                            ? "Search By Application Number"
                            : "अर्ज क्रमांकाद्वारे शोधा"
                        }
                        placeholder="2314075018"
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        {...register("applicationNumber")}
                        error={errors.applicationNumber}
                        helperText={errors.applicationNumber?.message}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        endIcon={<MuiIcons.SavedSearch />}
                      >
                        {language === "en" ? "SEARCH" : "शोधा"}
                      </Button>
                    </Grid>
                    {/* <Grid
                    item
                    xl={2}
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    p={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      style={{ height: "40px", width: "110px" }}
                      variant="contained"
                      size="small"
                      endIcon={<MuiIcons.Clear />}
                      onClick={() => {}}
                    >
                      Clear
                    </Button>
                  </Grid> */}
                  </Grid>
                </form>
                <Box sx={{ padding: "10px" }}>
                  {showSearchTable && (
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      getRowId={(row) => row.srNo}
                      // components={{ Toolbar: GridToolbar }}
                      autoHeight={true}
                      density="compact"
                      sx={{
                        "& .super-app-theme--cell": {
                          backgroundColor: "#E3EAEA",
                          borderLeft: "10px solid white",
                          borderRight: "10px solid white",
                          borderTop: "4px solid white",
                        },
                        backgroundColor: "white",
                        boxShadow: 2,
                        border: 1,
                        borderColor: "primary.light",
                        "& .MuiDataGrid-cell:hover": {},
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#E3EAEA",
                        },
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },

                        "& .MuiDataGrid-column": {
                          backgroundColor: "red",
                        },
                      }}
                      rows={table}
                      columns={_columns}
                      pageSize={1}
                      page={1}
                    />
                  )}
                </Box>
                <Divider />

                <Grid item xs={12}>
                  <Paper
                    sx={{ height: "160px" }}
                    component={Box}
                    p={2}
                    m={2}
                    squar="true"
                    elevation={5}
                  >
                    <div className={cfcDashBoardStyles.test}>
                      <div className={cfcDashBoardStyles.one}>
                        <div className={cfcDashBoardStyles.icono}>
                          <WcIcon color="secondary" />
                        </div>
                        <br />
                        <div className={cfcDashBoardStyles.icono}>
                          <strong>
                            {language == "en"
                              ? "Total Application"
                              : "एकूण अर्ज"}
                          </strong>
                        </div>
                        <Typography
                          variant="h6"
                          align="center"
                          color="secondary"
                        >
                          {countData?.totalApplications}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={cfcDashBoardStyles.jugaad}></div>

                      {/** Approved Application */}
                      <div
                        className={cfcDashBoardStyles.one}
                        // onClick={() => setDataSource(approvedApplication)}
                      >
                        <div className={cfcDashBoardStyles.icono}>
                          <ThumbUpAltIcon color="success" />
                        </div>
                        <br />
                        <div className={cfcDashBoardStyles.icono}>
                          <strong>
                            {language == "en"
                              ? "Approved Application"
                              : "मंजूर अर्ज"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="green">
                          {countData?.complitedApplication}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={cfcDashBoardStyles.jugaad}></div>

                      {/** Pending Applications */}
                      <div
                        className={cfcDashBoardStyles.one}
                        // onClick={() => setDataSource(pendingApplication)}4
                      >
                        <div className={cfcDashBoardStyles.icono}>
                          <PendingActionsIcon color="warning" />
                        </div>
                        <br />
                        <div className={cfcDashBoardStyles.icono}>
                          <strong>
                            {language == "en"
                              ? "Pending Application"
                              : "प्रलंबित अर्ज"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="orange">
                          {countData?.pendingAtDepartment}
                        </Typography>
                      </div>

                      {/** Vertical Line */}
                      <div className={cfcDashBoardStyles.jugaad}></div>

                      {/** Rejected Application */}
                      <div
                        className={cfcDashBoardStyles.one}
                        // onClick={() => setDataSource(rejectedApplication)}
                      >
                        <div className={cfcDashBoardStyles.icono}>
                          {/* <CancelIcon color="error" /> */}
                          <WcIcon color="secondary" />
                        </div>
                        <br />
                        <div className={cfcDashBoardStyles.icono}>
                          <strong>
                            {language == "en"
                              ? "Rejected Application"
                              : "नाकारलेले अर्ज"}
                          </strong>
                        </div>
                        <Typography variant="h6" align="center" color="error">
                          {countData?.rejectedApplication}
                        </Typography>
                      </div>
                    </div>
                  </Paper>
                </Grid>

                <Paper component={Box} sx={{ padding: "10px" }}>
                  {/* Chart Code */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        padding: "10px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <Grid
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          margin: "5px !Important",
                        }}
                      >
                        {/* pie chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                id: "basic-pie",
                              },
                              labels: [
                                `${
                                  language === "en"
                                    ? "Approved Application"
                                    : "मंजूर अर्ज"
                                }`,
                                `${
                                  language == "en"
                                    ? "Pending Application"
                                    : "प्रलंबित अर्ज"
                                }`,
                                `${
                                  language == "en"
                                    ? "Rejected Application"
                                    : "नाकारलेले अर्ज"
                                }`,
                                `${
                                  language == "en"
                                    ? "Total Application"
                                    : "एकूण अर्ज"
                                }`,
                              ],
                              responsive: [
                                {
                                  breakpoint: 480,
                                  options: {
                                    chart: {
                                      width: 200,
                                    },
                                    legend: {
                                      position: "bottom",
                                    },
                                  },
                                },
                              ],
                            }}
                            series={[
                              countData?.complitedApplication
                                ? countData?.complitedApplication
                                : 0,
                              countData?.pendingAtDepartment
                                ? countData?.pendingAtDepartment
                                : 0,
                              countData?.rejectedApplication
                                ? countData?.rejectedApplication
                                : 0,
                              countData?.totalApplications
                                ? countData?.totalApplications
                                : 0,
                            ]}
                            type="pie"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                        {/*bar chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                stacked: false,
                                xaxis: {
                                  categories: ["Count"],
                                },
                                toolbar: {
                                  show: false,
                                },
                              },
                            }}
                            series={[
                              {
                                name: "Count",
                                data: [
                                  {
                                    x: `${
                                      language == "en"
                                        ? "Approved Application"
                                        : "मंजूर अर्ज"
                                    }`,
                                    y: countData?.complitedApplication
                                      ? countData?.complitedApplication
                                      : 0,
                                  },
                                  {
                                    x: `${
                                      language == "en"
                                        ? "Pending Application"
                                        : "प्रलंबित अर्ज"
                                    }`,
                                    y: countData?.pendingAtDepartment
                                      ? countData?.pendingAtDepartment
                                      : 0,
                                  },
                                  {
                                    x: `${
                                      language == "en"
                                        ? "Rejected Application"
                                        : "नाकारलेले अर्ज"
                                    }`,
                                    y: countData?.rejectedApplication
                                      ? countData?.rejectedApplication
                                      : 0,
                                  },
                                  {
                                    x: `${
                                      language == "en"
                                        ? "Total Application"
                                        : "एकूण अर्ज"
                                    }`,
                                    y: countData?.totalApplications
                                      ? countData?.totalApplications
                                      : 0,
                                  },
                                ],
                              },
                            ]}
                            yaxis={[
                              {
                                tickAmount: 1,
                                title: {
                                  text: "Count",
                                },
                              },
                            ]}
                            type="bar"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                      </Grid>
                      {console.log("00", countData.rejectedApplication)}
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={tabsValue} index={2}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  backgroundImage: `url('/pcmcDashboardV1BG.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minwidth: "105%",
                  backgroundSize: "100% 100%",
                  // overflow: "scroll"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    padding: "10px",
                    float: "right",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      margin: "5px",
                      placeItems: "center",
                    }}
                  >
                    {[
                      { label: "A+", fontSize: 15 },
                      { label: "A", fontSize: 12 },
                      { label: "A-", fontSize: 10 },
                    ].map((fontButton) => (
                      <span
                        key={fontButton.label}
                        className={styles.fontButtons}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "30px",
                          height: "30px",
                          border: "1px solid white",
                          color: "black",
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "5px",
                          cursor: "pointer",
                          userSelect: "none",
                          fontSize: "15px",
                        }}
                        onClick={() => setFontSize(fontButton.fontSize)}
                      >
                        {fontButton.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginRight: "20px" }}>
                    <h3>
                      {language === "en" ? "Icon Color" : "आयकॉन रंग"}{" "}
                      <input
                        type="color"
                        defaultValue="#0b669e"
                        onChange={(e) => changeIconColor(e.target.value)}
                      />
                    </h3>
                  </div>

                  <div style={{ marginRight: "20px" }}>
                    <h3>
                      {language === "en" ? "Font Color" : "फॉन्टचा रंग"}{" "}
                      <input
                        type="color"
                        onChange={(e) => changeFontColor(e.target.value)}
                      />
                    </h3>
                  </div>
                </div>
                <Grid
                  container
                  style={{
                    display: "flex",
                    //   justifyContent: "center",
                    marginBottom: "10px",
                    // backgroundImage: `url('/pcmcDashboardV1BG.jpg')`,
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    // minwidth: '105%',
                    // backgroundSize: '100% 100%',
                  }}
                >
                  {applications
                    ?.filter((val) => val.id !== 23)
                    ?.map((tab, id) => {
                      // {usersCitizenDashboardData?.applications?.map((val, id) => {
                      //
                      return (
                        <>
                          <Tooltip
                            title={
                              language === "en"
                                ? tab.applicationNameEng
                                : tab.applicationNameMr
                            }
                          >
                            <Grid
                              key={id}
                              item
                              xs={2}
                              style={{
                                paddingTop: "10px",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                paddingBottom: "0px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Grid
                                container
                                // className={styles.dashCardFrontSide}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "10px",
                                  borderRadius: "15px",
                                  backgroundColor: "white",
                                  backgroundImage: `url("/orange-shadow.svg")`,

                                  // height: "100vh",
                                  backgroundSize: "contain",
                                  backgroundRepeat: "no-repeat",
                                  height: "90%",
                                  width: "90%",
                                }}
                                sx={{
                                  ":hover": {
                                    boxShadow:
                                      "grey 0px 5px 0px 0px, #e6680a 0px 0px 0px 0px, grey 0px 0px 0px 0px",
                                  },
                                }}
                                boxShadow={3}
                              >
                                <Grid
                                  item
                                  xs={2}
                                  className="icon-element"
                                  // style={{ color: 'orange' }}
                                  style={{
                                    padding: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // backgroundColor: val.bg,
                                    color: "grey",
                                    size: "20px",
                                    borderRadius: "7px",
                                    maxWidth: "unset",
                                    width: "30%",
                                  }}
                                  boxShadow={2}
                                >
                                  <ComponentWithIcon iconName={tab.icon} />
                                </Grid>
                                <Grid
                                  item
                                  xs={10}
                                  style={{
                                    padding: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    maxWidth: "unset",
                                    width: "60%",
                                    // fontSize: fontSize,
                                  }}
                                >
                                  <Link
                                    className="text-element"
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      letterSpacing: "1px",
                                      textAlign: "center",
                                      // fontSize: '15px',
                                      fontSize: fontSize,
                                    }}
                                    onClick={() => {
                                      setCardClick(true);
                                      setClickIcon(tab.icon);
                                      setClickTitle(
                                        language === "en"
                                          ? tab.applicationNameEng
                                          : tab.applicationNameMr,
                                      );
                                      setServices(getServicesByAppId(tab.id));
                                      // setIsModalOpenForResolved(true)
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {language === "en"
                                      ? tab.applicationNameEng
                                      : tab.applicationNameMr}
                                  </Link>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Tooltip>
                        </>
                      );
                    })}
                </Grid>
              </Box>
              <Modal
                // title="Modal For Multi Department"
                open={isCardClick}
                closeTimeoutMS={500}
                //  className={styles.overlay}
                style={modalStyles}
                // onOk={true}
                // onCancel
                onClose={handleCancel1} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
                footer=""
                sx={{
                  padding: 5,
                  display: "flex",
                  justifyContent: "center",
                  placeContent: "center",
                  zIndex: "1300",
                  top: "0px",
                  left: "0px",
                  position: "fixed",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    borderRadius: "30px",
                    backgroundColor: "white",
                    minHeight: "45%",
                    height: "fit-content",
                    animation: "popup 0.7s",
                    // visibility: 'hidden',
                    // transform: 'scale(1.1)',
                    // transition: 'opacity 0.2s 0s ease-in-out , transform 0.2s 0s ease-in-out'
                    // transition: 'all 5s ease-in-out'            // border:'1px solid'
                  }}
                >
                  <Box>
                    <Grid
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        borderTopLeftRadius: "30px",
                        backgroundColor: "#fcecdb",
                        borderTopRightRadius: "30px",
                        display: "flex",
                        backgroundImage: `url("/orange-shadow.svg")`,
                        backgroundSize: "100% 100%",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <Grid
                        container
                        // className={styles.dashCardFrontSide}
                        style={{
                          padding: "10px",
                          width: "90%",
                          flexWrap: "nowrap",

                          boxShadow: "none",
                        }}
                        sx={{
                          ":hover": {
                            boxShadow: "0px 5px #556CD6",
                          },
                        }}
                        boxShadow={3}
                      >
                        <Grid
                          item
                          xs={2}
                          className="icon-element"
                          style={{
                            padding: "5px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // backgroundColor: 'white',
                            // color: 'grey',
                            color: iconColor,
                            size: "20px",
                            borderRadius: "7px",
                            maxWidth: "unset",
                            width: "30%",
                          }}
                          boxShadow={2}
                        >
                          <ComponentWithIcon iconName={clickedIcon} />
                        </Grid>
                        <Grid
                          item
                          xs={10}
                          style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            maxWidth: "unset",
                            // width: "70%",
                          }}
                        >
                          {/* {( */}
                          <div
                            style={{
                              fontWeight: "700",
                              color: "#383636",
                              fontSize: "15px",
                              textAlign: "left",
                              width: "100%",
                            }}
                            onClick={() => {
                              console.log("sssssss", true);
                              setCardClick(true);
                            }}
                            tabIndex={0}
                            // component="button"
                          >
                            {clickedTitle}
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      {services?.length > 0 ? (
                        services.map((tab, id) => {
                          return (
                            <Grid
                              item
                              xs={4}
                              key={id}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0px",
                                alignItems: "center",
                              }}
                            >
                              <Card
                                sx={{
                                  display: "flex",
                                  width: "85%",
                                  height: "90%",
                                  cursor: "pointer",
                                  boxShadow:
                                    "0px 0px 1px 1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                                  ":hover": {
                                    boxShadow:
                                      "0px 1px 5px 1px grey, 0px 1px 1px 0px grey, 0px 1px 3px 0px grey",
                                  },
                                }}
                                onClick={() => {
                                  console.log("tab", tab);
                                  dispatch(setApplicationName(tab));
                                  // user.isProfileComleted === "Y"
                                  //   ? tab.clickTo && tab.application == 6
                                  //     ? router.push({
                                  //         pathname: tab.clickTo,
                                  //         query: { pageMode: "Add" },
                                  //       })
                                  //     : router.push({ pathname: tab.clickTo })
                                  //   : router.push("/CompleteProfile");
                                  dispatch(setApplicationName(tab));
                                  tab.clickTo && tab.application == 6
                                    ? router.push({
                                        pathname: tab.clickTo,
                                        query: { pageMode: "Add" },
                                      })
                                    : router.push({ pathname: tab.clickTo });
                                }}
                              >
                                {/* <CardHeader
                          titleTypographyProps={{
                            variant: "body2",
                            textAlign: "center",
                            padding: "6px",
                            fontWeight: 500,
                            fontSize: '0.8rem'
                          }}
                          title={
                            language === "en"
                              ? tab.serviceName
                              : tab.serviceNameMr
                          }
                        /> */}
                                <div
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignContent: "center",
                                  }}
                                >
                                  <p
                                    // className="text-element"
                                    style={{
                                      alignSelf: "center",
                                      color: tempColor,
                                      padding: "0px 5px",
                                      textAlign: "-webkit-center",
                                      fontSize: "12px",
                                      margin: "1em 0px",
                                    }}
                                  >
                                    {language === "en"
                                      ? tab.serviceName
                                      : tab.serviceNameMr}
                                  </p>
                                </div>
                              </Card>
                              {/* </Tooltip> */}
                            </Grid>
                          );
                        })
                      ) : (
                        <Box>
                          <Card>
                            <CardHeader
                              titleTypographyProps={{
                                variant: "body2",
                                textAlign: "center",
                                fontWeight: 700,
                                color: "red",
                              }}
                              title={
                                language === "en"
                                  ? "Services Not Available"
                                  : "सेवा उपलब्ध नाही"
                              }
                            />
                          </Card>
                        </Box>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Modal>
              {/* <Box>
                <Tabs
                  variant="scrollable"
                  scrollButtons={true}
                  style={{ width: "100%" }}
                  value={value}
                  onChange={handleChangeApplication}
                  aria-label="scrollable force tabs example"
                  sx={{
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                    "& .MuiTabs-scrollButtons": {
                      backgroundColor: "#EDE7F6",
                      margin: "10px",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      "&.Mui-disabled": {
                        opacity: 0.5,
                      },
                    },
                  }}
                >
                  {applications
                    ?.filter((val) => val.id !== 23)
                    ?.map((tab, id) => {
                      console.log(applications)
                      return (
                        <Tab
                          key={tab.applicationNameEng}
                          style={{
                            height: "180px",
                            width: "175px",
                            margin: "10px",
                            border: "1px solid gray",
                          }}
                          sx={{
                            color: "black",
                            "&.Mui-selected": {
                              color: "white",
                              backgroundColor: "#555555",
                            },
                            "&.MuiTab-root": {
                              padding: "0",
                            },
                          }}
                          label={
                            <Badge
                              variant="dot"
                              color="success"
                              sx={{
                                "& .MuiBadge-badge": { height: 18, width: 18 },
                              }}
                              style={{ width: "100%", height: "100%" }}
                            >
                              <Box style={{ width: "100%", height: "100%" }}>
                                <Box
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                  }}
                                >
                                  <Card
                                    sx={{
                                      width: "100%",
                                      height: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "0%",
                                      backgroundColor: "#23A9F4",
                                    }}
                                  >
                                    <IconButton
                                      color="inherit"
                                      aria-label="open drawer"
                                      sx={{
                                        width: "30px",
                                        height: "50px",
                                        borderRadius: 0,
                                      }}
                                    >
                                      <ComponentWithIcon iconName={tab.icon} />
                                    </IconButton>
                                  </Card>
                                  <Box
                                    boxShadow={3}
                                    style={{
                                      width: "100%",
                                      height: "50%",
                                      padding: "5px",
                                    }}
                                  >
                                    <Box style={{ height: "55%" }}>
                                      <Typography
                                        sx={{ fontWeight: "bold" }}
                                        style={{
                                          fontSize: "14px",
                                        }}
                                      >
                                        {language === "en"
                                          ? tab.applicationNameEng
                                          : tab.applicationNameMr}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Badge>
                          }
                          {...a11yProps(value)}
                        />
                      );
                    })}
                </Tabs>
                <Box>
                  <Grid container sx={{ padding: "10px" }}>
                    {services?.length > 0 ? (
                      services.map((tab, id) => {
                        return (
                          <Grid
                            item
                            xs={4}
                            key={id}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Tooltip
                              title={
                                language === "en"
                                  ? tab.serviceName
                                  : tab.serviceNameMr
                              }
                            >
                              <Card
                                sx={{
                                  width: "80%",
                                  height: "90%",
                                  cursor: "pointer",
                                  backgroundColor: "#CDCDCD",
                                }}
                                onClick={() => {
                                  dispatch(setApplicationName(tab));
                                  tab.clickTo && tab.application == 6
                                    ? router.push({
                                      pathname: tab.clickTo,
                                      query: { pageMode: "Add" },
                                    })
                                    : router.push({ pathname: tab.clickTo });
                                }}
                              >
                                <CardHeader
                                  titleTypographyProps={{
                                    variant: "body2",
                                    textAlign: "center",
                                    padding: "6px",
                                  }}
                                  title={
                                    language === "en"
                                      ? tab.serviceName
                                      : tab.serviceNameMr
                                  }
                                />
                              </Card>
                            </Tooltip>
                          </Grid>
                        );
                      })
                    ) : (
                      <Box>
                        <Card>
                          <CardHeader
                            titleTypographyProps={{
                              variant: "body2",
                              textAlign: "center",
                              fontWeight: 700,
                              color: "red",
                            }}
                            title={
                              language === "en"
                                ? "Services Not Available"
                                : "सेवा उपलब्ध नाही"
                            }
                          />
                        </Card>
                      </Box>
                    )}
                  </Grid>
                </Box>
              </Box> */}
            </CustomTabPanel>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CFC_Dashboard;
