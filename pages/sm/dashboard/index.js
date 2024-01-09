import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import {
  Box,
  Divider,
  Grid,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import urls from "../../../URLS/urls";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DomainIcon from "@mui/icons-material/Domain";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Loader from "../../../containers/Layout/components/Loader";
import moment from "moment";

// Main Component - Clerk
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    //resolver: yupResolver(schema),
    mode: "onChange",
  });

  // let user = useSelector((state) => state.user.user)
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  const [dashboardData, setDashboardData] = useState();
  const [openTable, setOpenTable] = useState(false);
  const [columnForTable, setColumnForTable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDashboardDetails();
    getZoneKeys();
    getWardKeys();
    getDepartment();
    getVehicleTypes();
  }, []);

  const getDashboardDetails = async () => {
    setLoading(true);
    await axios
      .get(`${urls.SMURL}/dashboard/getDashboardDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setDashboardData(res?.data?.Values);
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [zoneKeys, setZoneKeys] = useState([]);
  const getZoneKeys = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        );
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const [wardKeys, setWardKeys] = useState([]);
  const getWardKeys = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          }))
        );
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const [departments, setDepartments] = useState([]);
  const getDepartment = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("dept", res);
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const [vehicleTypes, setvehicleTypes] = useState([]);
  const getVehicleTypes = () => {
    axios
      .get(`${urls.SMURL}/mstVehicleType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setvehicleTypes(
          res?.data?.mstVehicleTypeList.map((r, i) => {
            return {
              id: r?.id,
              vehicleTypePrefix: r?.vehicleTypePrefix,
              vehicleType: r?.vehicleType,
              vehicleTypeMr: r?.vehicleTypeMr,
              remark: r?.remark,
            };
          })
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const visitorColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 0.6,
      headerAlign: "center",
      width: 60,
    },
    {
      hide: true,
      field: "visitorPhoto",
      headerName: <FormattedLabel id="visitorPhoto" />,
      // flex: 1,
      headerAlign: "center",
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorName",
      headerName: <FormattedLabel id="visitorName" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorEntryNumber",
      headerName: <FormattedLabel id="visitorEntryNumber" />,
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="deptName" />,
      // flex: 1,
      // minWidth: 150,
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "toWhomWantToMeet",
      headerName: <FormattedLabel id="toWhomWantToMeet" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "purpose",
      headerName: <FormattedLabel id="purpose" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "priority",
      headerName: <FormattedLabel id="priority" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobileNumber" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "inTime",
      headerName: <FormattedLabel id="inTime" />,
      // flex: 2,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "outTime",
      headerName: <FormattedLabel id="outTime" />,
      // flex: 2,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Tooltip title={params.value}>
      //     <span className="csutable-cell-trucate">{params.value}</span>
      //   </Tooltip>
      // ),
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "notoriousEntry",
      headerName: <FormattedLabel id="notoriousEntry" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "visitorStatus",
      headerName: <FormattedLabel id="visitorStatus" />,
      // flex: 0.5,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "documentType",
      headerName: "Document Type",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      hide: true,
      field: "personalEquipments",
      headerName: <FormattedLabel id="personalEquipments" />,
      // flex: 0.5,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const vehicleColumns = [
    // ...createColumn(),
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 0.6,
      width: 60,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "ownerStatus",
      headerName: language == "en" ? "Owner Status" : "मालकाची स्थिती",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      // flex: 1,
      headerAlign: "center",
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      // flex: 1,
      headerAlign: "center",
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "vehicleExitNumber",
      headerName:
        language == "en" ? "Vehicle Exit Number" : "वाहन निर्गमन क्रमांक",
      // flex: 0.4,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: false,
      field: "vehicleType",
      headerName: language == "en" ? "Vehicle Type" : "वाहनाचा प्रकार",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "_vehicleName",
      headerName: language == "en" ? "Vehicle Name" : "वाहनाचे नाव",
      headerAlign: "center",
      width: 150,
    },
    {
      field: "driverName",
      headerName: <FormattedLabel id="driverName" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "driverNumber",
      headerName: <FormattedLabel id="driverNumber" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "vehicleName",
      headerName: language == "en" ? "Vehicle" : "वाहन",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "inMeterReading",
      headerName: <FormattedLabel id="inMeterReading" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "outMeterReading",
      headerName: <FormattedLabel id="outMeterReading" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "totalKm",
      headerName: <FormattedLabel id="totalKm" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "travelDestination",
      headerName: language == "en" ? "Travel Destination" : "प्रवास गंतव्य",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "substituteDriver",
      headerName: <FormattedLabel id="substituteDriver" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "driverLicenceNumber",
      headerName: <FormattedLabel id="driverLicenceNumber" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "meterReading",
      headerName: language == "en" ? "Meter Reading" : "मीटर रीडिंग",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: "outTime",
      headerName: <FormattedLabel id="outTime" />,
      // type: "number",
      // flex: 2,
      align: "center",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "inTime",
      headerName: <FormattedLabel id="inTime" />,
      // type: "number",
      // flex: 2,
      align: "center",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "driverAuthorization",
      headerName: language == "en" ? "Driver Authorization" : "चालक अधिकृतता",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "inOutStatus",
      headerName: <FormattedLabel id="inOutStatus" />,
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const nightDeptColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 1,
      // maxWidth: 60,
      width: 60,
      // align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneKey",
      headerName: <FormattedLabel id="zoneName" />,
      // type: "number",
      // flex: 1,
      width: 100,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "wardKey",
      headerName: <FormattedLabel id="wardName" />,
      // type: "number",
      // flex: 1,
      width: 100,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "buildingName",
      headerName: <FormattedLabel id="buildingName" />,
      // flex: 1,
      minWidth: 200,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      // flex: 1,
      minWidth: 200,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      hide: false,
      field: "checkupDateAndTime",
      headerName: <FormattedLabel id="checkupDateAndTime" />,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "floor",
      headerName: <FormattedLabel id="floor" />,
      // type: "number",
      // flex: 1,
      width: 100,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "departmentOnOffStatus",
      headerName: <FormattedLabel id="DepartmentOpen_Close" />,
      // type: "number",
      // flex: 1,
      width: 200,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "fanOnOffStatus",
      headerName: <FormattedLabel id="FanOn_Off" />,
      // type: "number",
      // flex: 1,
      width: 150,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },

    {
      field: "lightOnOffStatus",
      headerName: <FormattedLabel id="LightOn_Off" />,
      // type: "number",
      // flex: 1,
      width: 150,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "presentEmployeeCount",
      headerName: "Present Employee Count",
      // type: "number",
      // flex: 1,
      width: 200,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "presentEmployeeName",
      headerName: "Present Employee Name",
      // type: "number",
      // flex: 1,
      width: 200,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      // type: "number",
      // flex: 1,
      width: 150,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      hide: true,
      field: "subDepartmentName",
      headerName: "Sub Department Key",
      // type: "number",
      flex: 1,
      // align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const deptKeyColumns = [
    {
      field: "srNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "issueNo",
      // headerName: "Sr No",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 0.4,
      headerAlign: "center",
    },

    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentName",
      headerName: <FormattedLabel id="deptName" />,
      minWidth: 220,
      headerAlign: "center",
    },
    // {
    //   hide: false,
    //   field: "employeeKey",
    //   headerName: "Employee Key",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1.3,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyIssueAt",
      headerName: <FormattedLabel id="keyIssueAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyReceivedAt",
      headerName: <FormattedLabel id="keyReceivedAt" />,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "keyStatus",
      headerName: <FormattedLabel id="keyStatus" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "mobileNumber",
      headerName: <FormattedLabel id="mobile" />,
      flex: 1,
      maxWidth: 100,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "subDepartmentName",
      headerName: "Sub Department Key",
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: true,
      field: "departmentOfEmployee",
      headerName: <FormattedLabel id="employeeDepartment" />,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const getDataAccordingToSelection = async (id) => {
    setLoading(true);
    await axios
      .get(
        // `${urls.SMURL}/dashboard/getDashDetailsInOutDetails?whichOne=${id}`,
        `${urls.SMURL}/dashboard/getDashboardInOutDetails?whichOne=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("res selection", res);
        let result;
        setOpenTable(true);
        if (id == "VI" || id == "VO" || id == "RV") {
          result = res?.data?.trnVisitorEntryPassList;
          setColumnForTable(visitorColumns);
        } else if (id == "VEI" || id == "VEO" || id == "RVE") {
          result = res?.data?.trnVehicleInOutList;
          setColumnForTable(vehicleColumns);
        } else if (id == "KI" || id == "KR" || id == "RK") {
          result = res?.data?.trnDepartmentKeyInOutList;
          setColumnForTable(deptKeyColumns);
        } else if (id == "CE") {
          result = res?.data?.trnNightDepartmentCheckUpEntryList;
          setColumnForTable(nightDeptColumns);
        }

        let _res = result?.map((r, i) => {
          return {
            ...r,
            srNo: i + 1,
            inTime: r?.inTime
              ? moment(r?.inTime).format("DD-MM-YYYY HH:mm:ss")
              : "-",
            outTime: r?.outTime
              ? moment(r?.outTime).format("DD-MM-YYYY HH:mm:ss")
              : "-",
            departmentKey: r?.departmentKeysList
              ? JSON.parse(r?.departmentKeysList)
                  ?.map((val) => {
                    return departments?.find((obj) => {
                      return obj?.id == val && obj;
                    })?.department;
                  })
                  ?.toString()
              : "-",
            departmentName: r?.departmentKey
              ? departments?.find((obj) => {
                  return obj?.id == r?.departmentKey;
                })?.department
              : "-",
            wardKey: r.wardKey
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: r.zoneKey
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            _vehicleName: r?.vehicleName
              ? vehicleTypes?.find((obj) => obj?.id == Number(r?.vehicleName))
                  ?.vehicleType
              : "-",
            keyIssueAt: r?.keyIssueAt
              ? moment(r?.keyIssueAt).format("DD-MM-YYYY HH:mm:ss")
              : "-",
            keyReceivedAt: r?.keyReceivedAt
              ? moment(r?.keyReceivedAt).format("DD-MM-YYYY HH:mm:ss")
              : "-",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Approved Application
  const clerkTabClick = (props) => {};

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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper component={Box} squar="true" p={1} elevation={5}>
            {/* <Box>
          <BreadcrumbComponent />
        </Box> */}
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Paper component={Box} p={2} squar="true" elevation={5}>
                  <Typography variant="h6">
                    <strong>
                      {language === "en" ? "WELCOME" : "स्वागत आहे"}
                    </strong>
                  </Typography>

                  {/* <br /> */}
                  <Typography
                    variant="subtitle1"
                    style={{ justifyContent: "center" }}
                  >
                    <strong>
                      {language === "en"
                        ? user?.userDao?.firstNameEn
                        : user?.userDao?.firstNameMr}{" "}
                      {language === "en"
                        ? user?.userDao?.middleNameEn
                        : user?.userDao?.middleNameMr}{" "}
                      {language === "en"
                        ? user?.userDao?.lastNameEn
                        : user?.userDao?.lastNameMr}
                    </strong>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* <Paper component={Box} elevation={5} sx={{ padding: "10px" }}> */}
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DirectionsWalkIcon
                      color="secondary"
                      sx={{ color: "blue" }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="visitorIn" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("VI");
                        }}
                      >
                        {dashboardData?.trnVisitorEntryPassIn
                          ? dashboardData?.trnVisitorEntryPassIn
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DomainIcon sx={{ color: "blue" }} />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="visitorInside" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("RV");
                        }}
                      >
                        {dashboardData?.remainingVisitor
                          ? dashboardData?.remainingVisitor
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LogoutIcon sx={{ color: "blue" }} />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="visitorOut" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("VO");
                        }}
                      >
                        {dashboardData?.trnVisitorEntryPassOut
                          ? dashboardData?.trnVisitorEntryPassOut
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DirectionsCarIcon
                      color="secondary"
                      sx={{ color: "blue" }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="vehicleOut" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("VEO");
                        }}
                      >
                        {dashboardData?.trnVehicleOut
                          ? dashboardData?.trnVehicleOut
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CarCrashIcon color="secondary" sx={{ color: "blue" }} />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="vehiclesNotIn" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("RVE");
                        }}
                      >
                        {dashboardData?.remainingVehicle
                          ? dashboardData?.remainingVehicle
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DirectionsCarIcon color="secondary" />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="vehicleIn" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("VEI");
                        }}
                      >
                        {dashboardData?.trnVehicleIn
                          ? dashboardData?.trnVehicleIn
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <KeyIcon color="warning" />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="deptKeyIssued" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("KI");
                        }}
                      >
                        {dashboardData?.trnDepartmentKeyIn
                          ? dashboardData?.trnDepartmentKeyIn
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <KeyOffIcon color="warning" />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="deptKeyNotReceived" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("RK");
                        }}
                      >
                        {dashboardData?.remainingDeptKey
                          ? dashboardData?.remainingDeptKey
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <KeyIcon color="warning" />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="deptKeyReceived" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("KR");
                        }}
                      >
                        {dashboardData?.trnDepartmentKeyOut
                          ? dashboardData?.trnDepartmentKeyOut
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid item xs={5} sm={2.3} md={2.3} lg={2.3} xl={2.3}>
                <Grid container direction="column">
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Brightness4Icon color="error" />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <strong align="center">
                      <FormattedLabel id="nightDeptCheckupEntry" />
                    </strong>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" align="center" color="secondary">
                      <Link
                        component="span"
                        underline="hover"
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => {
                          getDataAccordingToSelection("CE");
                        }}
                      >
                        {dashboardData?.trnNightDepartmentCheckUpEntryIn
                          ? dashboardData?.trnNightDepartmentCheckUpEntryIn
                          : 0}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              {openTable && (
                <DataGrid
                  components={{ Toolbar: GridToolbar }}
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
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="compact"
                  pagination
                  paginationMode="server"
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columnForTable}
                  onPageChange={(_data) => {
                    // getVehicleMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    // getVehicleMaster(_data, data.page);
                  }}
                />
              )}
            </Grid>
            {/* </Paper> */}
            {/* <Grid container sx={{ border: "solid red" }}>
         
          <Grid item xs={12}>
            <Paper
              sx={{ height: "160px" }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            >
              <div className={styles.test}>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsWalkIcon color="secondary" sx={{ color: "blue" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="visitorIn" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassIn ? dashboardData?.trnVisitorEntryPassIn : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <LogoutIcon sx={{ color: "blue" }} />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="visitorOut" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVisitorEntryPassOut ? dashboardData?.trnVisitorEntryPassOut : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsCarIcon color="secondary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      <FormattedLabel id="vehicleIn" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleIn ? dashboardData?.trnVehicleIn : "-"}
                  </Typography>
                </div>
                <div className={styles.jugaad}></div>
                <div className={styles.one} onClick={() => clerkTabClick("TotalApplications")}>
                  <div className={styles.icono}>
                    <DirectionsCarIcon color="secondary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="vehicleOut" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="secondary">
                    {dashboardData?.trnVehicleOut ? dashboardData?.trnVehicleOut : "-"}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("APPROVED")}>
                  <div className={styles.icono}>
                    <KeyIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="deptKeyIssued" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="green">
                    {dashboardData?.trnDepartmentKeyIn ? dashboardData?.trnDepartmentKeyIn : "-"}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("PENDING")}>
                  <div className={styles.icono}>
                    <KeyIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="deptKeyReceived" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="orange">
                    {dashboardData?.trnDepartmentKeyOut}
                  </Typography>
                </div>

                <div className={styles.jugaad}></div>

                <div className={styles.one} onClick={() => clerkTabClick("REJECTED")}>
                  <div className={styles.icono}>
                    <Brightness4Icon color="error" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">
                      {" "}
                      <FormattedLabel id="nightDeptCheckupEntry" />
                    </strong>
                  </div>
                  <Typography variant="h6" align="center" color="error">
                    {dashboardData?.trnNightDepartmentCheckUpEntryIn}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid> */}
          </Paper>
        </>
      )}
    </div>
  );
};

export default Index;
