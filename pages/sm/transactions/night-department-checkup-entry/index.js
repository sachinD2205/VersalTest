import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/nightDepartmentCheckupEntry";
import styles from "../../visitorEntry.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function NightDepartmentCheckupEntry() {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   defaultValues: {
  //     departmentOnOffStatus: "N",
  //     fanOnOffStatus: "N",
  //     lightOnOffStatus: "N",
  //   },
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    defaultValues: {
      departmentOnOffStatus: "N",
      fanOnOffStatus: "N",
      lightOnOffStatus: "N",
    },
    resolver: yupResolver(schema(language)),
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  console.log("444", watch("fanOnOffStatus"));

  let appName = "SM";
  let serviceName = "SM-NCE";
  // let pageMode = router?.query?.pageMode;
  let pageMode = "NIGHT CHECKUP ENTRY";

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  // const { control, handleSubmit } = useForm({});
  // const onSubmit = (data) => console.log(data);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  // const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");

  const [employeeId, setEmployeeId] = useState();
  const [entryEmployeeId, setEntryEmployeeId] = useState();

  const [imageSrc, setImageSrc] = useState("");

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [disabledData, setDisabledData] = useState();
  const [paramsData, setParamsData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [empDetails, setEmpDetails] = useState(false);
  const [entryByempDetails, setEntryByempDetails] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [hasMountedTwo, setHasMountedTwo] = useState(false);
  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();
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

  const getEmployee = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let _res = res.data.user;

        setEmployee(
          _res.map((val) => {
            return {
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
              empCode: val.empCode,
              phoneNo: val.phoneNo,
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

  const getBasicUserDetails = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("getBasicUserDetails", res);
        let _res = res.data.userList;
        setEmployee(
          _res.map((val) => {
            return {
              id: val.id,
              firstNameEn: val.firstNameEn,
              lastNameEn: val.lastNameEn,
              empCode: val.empCode,
              phoneNo: val.phoneNo,
            };
          })
        );
        setLoading(false);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (hasMountedTwo) {
      // Conditionally call getEntryByEmployeeDetails only if the component has already mounted
      getEmployeeDetails();
    } else {
      setHasMountedTwo(true);
    }
  }, [empDetails]);

  useEffect(() => {
    if (hasMounted) {
      // Conditionally call getEntryByEmployeeDetails only if the component has already mounted
      getEntryByEmployeeDetails();
    } else {
      setHasMounted(true);
    }
  }, [entryByempDetails]);

  useEffect(() => {
    console.log("1");
    // getEmployee();
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
    getBasicUserDetails();
  }, []);

  useEffect(() => {
    console.log("1");
    getDepartment();
    getWardKeys();
    getZoneKeys();
    getBuildings();
  }, [window.location.reload]);

  useEffect(() => {
    // getAllNightEntry();
    if (
      employee?.length > 0 &&
      wardKeys?.length > 0 &&
      zoneKeys?.length > 0 &&
      departments?.length > 0 &&
      buildings?.length > 0
    ) {
      getAllNightEntry();
    }
  }, [employee, wardKeys, zoneKeys, departments, buildings]);

  const handleGetName = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSend(e);
  };

  const getEmployeeDetails = () => {
    console.log("selectedEmployee EI", employeeId);
    // Filter through employee list to get the selected employee details based on employee id
    let selectedEmployee = employee.filter(
      (item) => item.empCode === employeeId
    );
    console.log("selectedEmployee", selectedEmployee);

    if (hasMounted) {
      if (selectedEmployee[0]?.firstNameEn && selectedEmployee[0]?.lastNameEn) {
        setValue("mobileNumber", selectedEmployee[0]?.phoneNo);
        setValue(
          "employeeKey",
          selectedEmployee[0]?.firstNameEn +
            " " +
            selectedEmployee[0]?.lastNameEn
        );
      } else if (
        !selectedEmployee[0]?.firstNameEn &&
        !selectedEmployee[0]?.lastNameEn
      ) {
        sweetAlert(
          language == "en" ? "Error ?" : "त्रुटी!",

          language == "en" ? "Employee Not found!" : "कर्मचारी स्थापन नाही!",
          "error"
        );
        setValue("employeeKey", "");
        setValue("mobileNumber", "");
      }
    }
  };
  const getEntryByEmployeeDetails = () => {
    console.log("calld");
    // Filter through employee list to get the selected employee details based on employee id
    let selectedEmployee = employee?.filter(
      (item) => item.empCode == entryEmployeeId
    );

    if (hasMounted) {
      if (selectedEmployee[0]?.firstNameEn && selectedEmployee[0]?.lastNameEn) {
        setValue(
          "entryBy",
          selectedEmployee[0]?.firstNameEn +
            " " +
            selectedEmployee[0]?.lastNameEn
        );
      } else if (
        !selectedEmployee[0]?.firstNameEn &&
        !selectedEmployee[0]?.lastNameEn
      ) {
        sweetAlert(
          language == "en" ? "Error ?" : "त्रुटी!",

          language == "en" ? "Employee Not found!" : "कर्मचारी स्थापन नाही!",
          "error"
        );
        setValue("entryBy", "");
      }
    }
  };

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
        presentEmployeeCount: Number(formData?.presentEmployeeCount),
        buildingKey: Number(formData?.buildingKey),
        departmentKey: Number(formData?.departmentKey),
        wardKey: Number(formData?.wardKey),
        zoneKey: Number(formData?.zoneKey),
        checkupDateTime: moment(formData?.checkupDateTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        departmentPhoto: encryptedFileNameToSend,
        // departmentPhoto: formData?.nightCheckupPhoto,
        empId: Number(employeeId),
        empName: formData?.employeeKey,
        empPhoneNo: formData?.mobileNumber,
        remark: formData?.remark ? formData?.remark : null,
        entryByEmpName: formData?.entryBy,
        entryByEmpId: Number(entryEmployeeId),
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
        remark: formData?.remark ? formData?.remark : null,
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(
          `${urls.SMURL}/trnNightDepartmentCheckUpEntry/save`,
          {
            ..._body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",

              language == "en"
                ? "Record Saved successfully! "
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",

              "success"
            );
            getAllNightEntry();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            exitButton();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/trnNightDepartmentCheckUpEntry/save`,
          {
            ...formData,
            remark: formData?.remark ? formData?.remark : null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले!",

                  language == "en"
                    ? "The Authority Letter was Updated successfully "
                    : "प्राधिकरण पत्र यशस्वीरित्या अपडेट केले गेले",

                  "success"
                )
              : sweetAlert(
                  language == "en" ? "Saved!" : "जतन केले!",

                  language == "en"
                    ? "Record Saved successfully! "
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",

                  "success"
                );
            setFetchData(tempData);
            setIsOpenCollapse(false);
            exitButton();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  const handleOpen = (data) => {
    console.log("data9", data);
    setOpen(true);
    setParamsData(data);
  };

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  //buildings
  const [buildings, setBuildings] = useState([]);
  // get buildings
  const getBuildings = () => {
    axios
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("building master", r);
        let result = r.data.mstBuildingMasterList;
        setBuildings(result);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
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
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  const [updatedWardKeys, setUpdatedWardKeys] = useState([]);
  // get Ward Keys
  const getWardKeys = () => {
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
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleClose = () => setOpen(false);

  const getAllNightEntry = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnNightDepartmentCheckUpEntry/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnNightDepartmentCheckUpEntryList;
        console.log("result43", result);
        if (wardKeys && zoneKeys && departments) {
          console.log(
            "wardKeys && zoneKeys && departments",
            wardKeys,
            zoneKeys,
            departments
          );
          let _res = result?.map((r, i) => {
            return {
              // ...r,
              buildingKey: r.buildingKey
                ? buildings?.find((obj) => {
                    console.log("obj2", obj);
                    return obj?.id == r.buildingKey;
                  })?.buildingName
                : "-",
              checkupDateAndTime: r.checkupDateTime
                ? moment(r.checkupDateTime).format("DD-MM-YYYY hh:mm A")
                : "-",
              departmentKey: r.departmentKey
                ? departments?.find((obj) => obj?.id == r.departmentKey)
                    ?.department
                : "-",
              departmentOnOffStatus: r.departmentOnOffStatus
                ? r.departmentOnOffStatus == "Y"
                  ? "Open"
                  : "Close"
                : "-",
              fanOnOffStatus: r.fanOnOffStatus
                ? r.fanOnOffStatus == "N"
                  ? "Off"
                  : "On"
                : "-",
              floor: r.floor,
              id: r.id,
              lightOnOffStatus: r.lightOnOffStatus
                ? r.lightOnOffStatus == "N"
                  ? "Off"
                  : "On"
                : "-",
              presentEmployeeCount: r.presentEmployeeCount,
              presentEmployeeName: r.presentEmployeeName,
              remark: r.remark,
              subDepartmentKey: r.subDepartmentKey,
              wardKey: r.wardKey
                ? wardKeys?.find((obj) => {
                    return obj?.id == r.wardKey;
                  })?.wardName
                : "-",
              zoneKey: r.zoneKey
                ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
                : "-",
              zone: r?.zoneKey,
              ward: r?.wardKey,
              srNo: _pageSize * _pageNo + i + 1,
              building: r?.buildingKey,
              departmentPhoto: r?.departmentPhoto,
              empId: r?.empId,
              empName: r?.empName,
              empPhoneNo: r?.empPhoneNo,
              entryByEmpId: r?.entryByEmpId,
              entryByEmpName: r?.entryByEmpName,
            };
          });
          console.log("resonse night entry", _res);
          setDataSource(_res);
          setData({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getFilterWards = (value) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { moduleId: 21, zoneId: value.target.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const exitButton = () => {
    setEmployeeId("");
    setEntryEmployeeId("");
    reset({
      ...resetValuesCancell,
    });
  };

  const resetValuesCancell = {
    employeeKey: null,
    mobileNumber: "",
    remark: "",
    presentEmployeeCount: "",
    floor: null,
    // checkupDateTime: new Date(),
    checkupDateTime: null,
    buildingKey: null,
    departmentName: null,
    zoneKey: null,
    wardKey: null,
    entryBy: null,
  };

  const columns = [
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
      field: "buildingKey",
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
      field: "departmentKey",
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
      field: "subDepartmentKey",
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
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // flex: 1,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box>
            {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
              <>
                <Tooltip title={language == "en" ? "View Form" : "फॉर्म पहा"}>
                  <IconButton
                    onClick={async () => {
                      // handleOpen(params);
                      console.log("openForm", params.row);
                      if (params?.row?.departmentPhoto != null) {
                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.departmentPhoto
                        );

                        const ciphertext = await EncryptData(
                          "passphraseaaaaaaapreview",
                          DecryptPhoto
                        );

                        const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                        const response = await axios.get(url, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        });

                        const imageUrl = `data:image/png;base64,${response?.data?.fileName}`;
                        setImageSrc(imageUrl);
                      } else {
                        setImageSrc("");
                      }
                      setDisabledData(params.row);
                      setOpenForm(true);
                    }}
                  >
                    <VisibilityIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>

          <Box
            sx={{
              backgroundColor: "#556CD6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 30,
              padding: "5px",
              // background:
              //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Typography
              style={{
                color: "white",
                fontSize: "19px",
              }}
            >
              <strong>
                {" "}
                <FormattedLabel id="nightDepartmentCheckupEntry" />
              </strong>
            </Typography>
          </Box>
          <Head>
            <title>Night Department Checkup Entry</title>
          </Head>
          {isOpenCollapse ? (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      // required
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneName" />
                      </InputLabel>
                      <Controller
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              getFilterWards(value);
                            }}
                            fullWidth
                            label="Zone Name"
                          >
                            {zoneKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.zoneName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      {/* <FormHelperText style={{ color: "red" }}>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.wardKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="wardName" />
                      </InputLabel>
                      <Controller
                        name="wardKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            fullWidth
                            label={<FormattedLabel id="wardName" required />}
                          >
                            {wardKeys.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.wardId}>
                                  {item.wardName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      {/* <FormHelperText style={{ color: "red" }}>
                        {errors?.wardKey ? errors.wardKey.message : null}
                      </FormHelperText> */}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.buildingKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="buildingName" required />
                      </InputLabel>
                      <Controller
                        name="buildingKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={
                              <FormattedLabel id="buildingName" required />
                            }
                          >
                            {buildings?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.buildingName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.buildingKey
                          ? errors.buildingKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                    {/* <TextField
                size="small"
                fullWidth
                style={{ width: "90%" }}
                id="outlined-basic"
                label="Building Name"
                variant="outlined"
                required
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
              /> */}
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentName" required />
                      </InputLabel>
                      <Controller
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={
                              <FormattedLabel id="departmentName" required />
                            }
                          >
                            {departments?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.department}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.departmentKey
                          ? errors.departmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      <FormattedLabel id="DepartmentOpen_Close" required />
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.departmentOnOffStatus}
                    >
                      <Controller
                        name="departmentOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="N"
                            sx={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio required={true} />}
                              label={<FormattedLabel id="open" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio required={true} />}
                              label={<FormattedLabel id="close" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.departmentOnOffStatus
                    ? errors.departmentOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      {<FormattedLabel id="LightOn_Off" required />}{" "}
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.lightOnOffStatus}
                    >
                      <Controller
                        name="lightOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            defaultValue="N"
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio />}
                              label={<FormattedLabel id="on" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio />}
                              label={<FormattedLabel id="off" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.lightOnOffStatus
                    ? errors.lightOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ fontWeight: 900 }}>
                      {<FormattedLabel id="FanOn_Off" required />}
                    </Typography>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      sx={{ width: "90%" }}
                      // error={errors.fanOnOffStatus}
                    >
                      <Controller
                        name="fanOnOffStatus"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            sx={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <FormControlLabel
                              value="Y"
                              control={<Radio />}
                              label={<FormattedLabel id="on" />}
                            />
                            <FormControlLabel
                              value="N"
                              control={<Radio />}
                              label={<FormattedLabel id="off" />}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {/* {errors?.fanOnOffStatus
                    ? errors.fanOnOffStatus.message
                    : null} */}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      {<FormattedLabel id="departmentPhoto" />}
                    </Typography>
                    <Box>
                      <UploadButtonThumbOP
                        appName={appName}
                        fileName={"nightCheckupPhoto.png"}
                        serviceName={serviceName}
                        fileDtl={getValues("nightCheckupPhoto")}
                        fileKey={"nightCheckupPhoto"}
                        showDel={
                          pageMode != "NIGHT CHECKUP ENTRY" ? false : true
                        }
                        fileNameEncrypted={(path) => {
                          handleGetName(path);
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl
                      fullWidth
                      required
                      size="small"
                      error={errors.checkupDateTime}
                    >
                      <Controller
                        control={control}
                        name="checkupDateTime"
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              {...field}
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  fullWidth
                                  sx={{ width: "90%" }}
                                  error={errors.checkupDateTime}
                                  size="small"
                                />
                              )}
                              label={
                                <FormattedLabel
                                  id="checkupDateAndTime"
                                  required
                                />
                              }
                              value={field.value}
                              defaultValue={new Date()}
                              onChange={(date) => field.onChange(date)}
                              error={errors.checkupDateTime}
                              helperText={
                                errors.checkupDateTime
                                  ? errors.checkupDateTime.message
                                  : null
                              }
                              inputFormat="DD-MM-YYYY hh:mm:ss"
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.checkupDateTime
                          ? errors.checkupDateTime.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    item
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.floor}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="floor" required />
                      </InputLabel>
                      <Controller
                        name="floor"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            fullWidth
                            label={<FormattedLabel id="floor" required />}
                          >
                            {[
                              "Basement",
                              "Underground",
                              "Ground",
                              "First",
                              "Second",
                              "Third",
                              "Fourth",
                              "Fifth",
                              "Sixth",
                              "Seventh",
                              "Eight",
                              "Ninth",
                              "Tenth",
                              "Terrace",
                            ].map((item, i) => {
                              return (
                                <MenuItem key={i} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText>
                        {errors.floor ? errors.floor.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Controller
                      name="presentEmployeeCount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          // label="Present Employee/Person Count"
                          label={
                            <FormattedLabel
                              id="presentEmployeeCount"
                              required
                            />
                          }
                          InputLabelProps={{
                            shrink: watch("presentEmployeeCount")
                              ? true
                              : false,
                          }}
                          size="small"
                          error={errors.presentEmployeeCount}
                          helperText={
                            errors.presentEmployeeCount
                              ? errors.presentEmployeeCount.message
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                    <Typography sx={{ margin: "0 20px" }}></Typography>
                    <Controller
                      name="remark"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={<FormattedLabel id="remark" />}
                          size="small"
                          InputLabelProps={{
                            shrink: watch("remark") ? true : false,
                          }}
                          sx={{ width: "90%" }}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Divider />

                {/* Employee Id */}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <TextField
                      sx={{ width: "90%" }}
                      fullWidth
                      id="outlined-basic"
                      label={<FormattedLabel id="presentEmployeeId" />}
                      size="small"
                      value={employeeId}
                      variant="outlined"
                      onChange={(e) => {
                        if (e.target.value.length == 0) {
                          setValue("employeeKey", "");
                        }
                        // Set Employee Id
                        setEmployeeId(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* add a button and call function to get employee details */}
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!employeeId}
                      onClick={() => {
                        setEmpDetails(!empDetails);
                      }}
                    >
                      <FormattedLabel id="getEmployeeDetails" />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {employeeId ? (
                    <Grid item xs={6}>
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        id="outlined-basic"
                        label={<FormattedLabel id="presentEmployeeName" />}
                        size="small"
                        {...register("employeeKey")}
                        InputLabelProps={{
                          shrink: watch("employeeKey") ? true : false,
                        }}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.employeeKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="presentEmployeeName" required />
                        </InputLabel>
                        <Controller
                          name="employeeKey"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              InputLabelProps={{
                                // style: { fontSize: 15 },
                                //true
                                shrink: watch("employeeKey") ? true : false,
                              }}
                              fullWidth
                              label={
                                <FormattedLabel
                                  id="presentEmployeeName"
                                  required
                                />
                              }
                              size="small"
                            >
                              {employee.map((item, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={
                                      item.firstNameEn + " " + item.lastNameEn
                                    }
                                  >
                                    {item.firstNameEn + " " + item.lastNameEn}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors.employeeKey
                            ? errors.employeeKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Controller
                      name="mobileNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={
                            <FormattedLabel
                              id="presentEmployeeMobile"
                              required
                            />
                          }
                          InputLabelProps={{
                            shrink: watch("mobileNumber") ? true : false,
                          }}
                          inputProps={{
                            maxLength: 10,
                          }}
                          size="small"
                          fullWidth
                          sx={{
                            width: "90%",
                          }}
                          error={errors.mobileNumber}
                          helperText={
                            errors.mobileNumber
                              ? errors.mobileNumber.message
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  {/* <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box> */}
                </Grid>

                <Divider />

                {/* Get Entry EmployeeId Employee Id */}
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={6}>
                    <TextField
                      sx={{ width: "90%" }}
                      fullWidth
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                      id="outlined-basic"
                      label={<FormattedLabel id="entryByEmployeeId" />}
                      size="small"
                      value={entryEmployeeId}
                      InputLabelProps={{
                        shrink: entryEmployeeId ? true : false,
                      }}
                      variant="outlined"
                      onChange={(e) => {
                        // Set Employee Id
                        if (e.target.value.length == 0) {
                          setValue("entryBy", "");
                        }
                        setEntryEmployeeId(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* add a button and call function to get employee details */}
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!entryEmployeeId}
                      onClick={() => {
                        setEntryByempDetails(!entryByempDetails);
                      }}
                    >
                      <FormattedLabel id="getEmployeeDetails" />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  {entryEmployeeId ? (
                    <Grid item xs={6}>
                      <TextField
                        sx={{ width: "90%" }}
                        fullWidth
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        id="outlined-basic"
                        label={<FormattedLabel id="EntryBy" />}
                        size="small"
                        {...register("entryBy")}
                        InputLabelProps={{
                          shrink: watch("entryBy") ? true : false,
                        }}
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.entryBy}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="EntryBy" required />
                        </InputLabel>
                        <Controller
                          name="entryBy"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              InputLabelProps={{
                                // style: { fontSize: 15 },
                                //true
                                shrink: watch("entryBy") ? true : false,
                              }}
                              fullWidth
                              label={<FormattedLabel id="entryBy" required />}
                              size="small"
                            >
                              {employee.map((item, i) => {
                                return (
                                  <MenuItem
                                    key={i}
                                    value={
                                      item.firstNameEn + " " + item.lastNameEn
                                    }
                                  >
                                    {item.firstNameEn + " " + item.lastNameEn}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors.entryBy ? errors.entryBy.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

                <Divider />

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "end" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      type="submit"
                      color="success"
                    >
                      <FormattedLabel id="save" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => {
                        setEmployeeId("");
                        setEntryEmployeeId("");
                        reset({
                          ...resetValuesCancell,
                        });
                      }}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => {
                        setIsOpenCollapse(!isOpenCollapse);
                        exitButton();
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          ) : (
            <>
              {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={11}></Grid>
                  <Grid xs={1}>
                    <Button
                      variant="contained"
                      endIcon={<AddIcon />}
                      // type='primary'
                      // disabled={buttonInputState}
                      onClick={() => {
                        // reset({
                        //   ...resetValuesExit,
                        // });
                        setEditButtonInputState(true);
                        setDeleteButtonState(true);
                        setBtnSaveText("Save");
                        // setButtonInputState(true);
                        // setSlideChecked(true);
                        setIsOpenCollapse(!isOpenCollapse);
                      }}
                    >
                      <FormattedLabel id="add" />
                    </Button>
                  </Grid>
                </Grid>
              )}
              <div className={styles.addbtn} style={{ padding: "10px" }}></div>
              <DataGrid
                // disableColumnFilter
                // disableColumnSelector
                // disableToolbarButton
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
                  },
                }}
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
                // rows={dataSource}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                //checkboxSelection

                density="compact"
                autoHeight={data.pageSize}
                // rowHeight={50}
                pagination
                paginationMode="server"
                // loading={data.loading}
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getAllNightEntry(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAllNightEntry(_data, data.page);
                }}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box
                    sx={{
                      padding: "10px",
                    }}
                  >
                    <Controller
                      control={control}
                      name="outDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DateTimePicker
                            renderInput={(props) => (
                              <TextField {...props} size="small" fullWidth />
                            )}
                            label="Vehicle Out Date Time"
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            inputFormat="DD-MM-YYYY hh:mm:ss"
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label="Remark"
                      variant="outlined"
                      {...register("outRemark")}
                      error={!!errors.outRemark}
                      helperText={
                        errors?.outRemark ? errors.outRemark.message : null
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        console.log("paramsData.row", paramsData.row);
                        setBtnSaveText("Checkout");
                        setRowId(paramsData.row.id);
                        onSubmitForm(paramsData.row, "Checkout");
                        // setRowId(params.row.id);
                        // onSubmitForm(params?.row, "Checkout");
                      }}
                    >
                      <FormattedLabel id="submit" />
                    </Button>
                  </Box>
                </Box>
              </Modal>
              <Dialog
                fullWidth
                open={openForm}
                onClose={() => setOpenForm(false)}
              >
                <DialogTitle
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  <FormattedLabel id="nightDepartmentCheckupEntry" />
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="zoneName" />}
                        size="small"
                        disabled
                        value={disabledData?.zoneKey}
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.zoneKey ? true : false,
                        }}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="wardName" />}
                        size="small"
                        disabled
                        value={disabledData?.wardKey}
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.wardKey ? true : false,
                        }}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl fullWidth size="small" sx={{ width: "90%" }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="buildingName" />
                        </InputLabel>
                        <Controller
                          name="buildingName"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              value={disabledData?.building}
                              fullWidth
                              disabled
                              InputLabelProps={{
                                shrink: disabledData?.building ? true : false,
                              }}
                              label={<FormattedLabel id="buildingName" />}
                            >
                              {buildings?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.buildingName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="departmentName" />}
                        size="small"
                        disabled
                        value={disabledData?.departmentKey}
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.departmentKey ? true : false,
                        }}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <Typography sx={{ fontWeight: 900 }}>
                        <FormattedLabel id="DepartmentOpen_Close" required />
                      </Typography>
                      <FormControl
                        fullWidth
                        required
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          name="departmentOnOffStatus"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              value={
                                disabledData?.departmentOnOffStatus == "Open"
                                  ? "Y"
                                  : "N"
                              }
                              sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                              }}
                            >
                              <FormControlLabel
                                value="Y"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="open" />}
                              />
                              <FormControlLabel
                                value="N"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="close" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <Typography sx={{ fontWeight: 900 }}>
                        {<FormattedLabel id="LightOn_Off" required />}{" "}
                      </Typography>
                      <FormControl
                        fullWidth
                        required
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          name="lightOnOffStatus"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              defaultValue="N"
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                              }}
                              value={
                                disabledData?.lightOnOffStatus == "off"
                                  ? "N"
                                  : "Y"
                              }
                            >
                              <FormControlLabel
                                value="Y"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="on" />}
                              />
                              <FormControlLabel
                                value="N"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="off" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <Typography sx={{ fontWeight: 900 }}>
                        {<FormattedLabel id="FanOn_Off" required />}
                      </Typography>
                      <FormControl
                        fullWidth
                        required
                        size="small"
                        sx={{ width: "90%" }}
                        // error={errors.fanOnOffStatus}
                      >
                        <Controller
                          name="fanOnOffStatus"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                              }}
                              value={
                                disabledData?.fanOnOffStatus == "off"
                                  ? "N"
                                  : "Y"
                              }
                            >
                              <FormControlLabel
                                value="Y"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="on" />}
                              />
                              <FormControlLabel
                                value="N"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="off" />}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Image"
                          height="100vh"
                          width="150vw"
                        />
                      )}
                      {/* <img
                        src={`${urls.CFCURL}/file/preview?filePath=${disabledData?.departmentPhoto}`}
                        alt="123"
                        height="100vh"
                        width="100vw"
                      /> */}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="checkupDateAndTime" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.checkupDateAndTime
                            ? true
                            : false,
                        }}
                        disabled
                        value={disabledData?.checkupDateAndTime}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="floor" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.floor ? true : false,
                        }}
                        disabled
                        value={disabledData?.floor}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="presentEmployeeCount" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.presentEmployeeCount
                            ? true
                            : false,
                        }}
                        disabled
                        value={disabledData?.presentEmployeeCount}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="remark" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.remark ? true : false,
                        }}
                        disabled
                        value={disabledData?.remark}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="presentEmployeeName" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.empName ? true : false,
                        }}
                        disabled
                        value={disabledData?.empName}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="presentEmployeeMobile" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.empPhoneNo ? true : false,
                        }}
                        disabled
                        value={disabledData?.empPhoneNo}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="entryByEmployeeId" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.entryByEmpId ? true : false,
                        }}
                        disabled
                        value={disabledData?.entryByEmpId}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="EntryBy" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.entryByEmpName ? true : false,
                        }}
                        disabled
                        value={disabledData?.entryByEmpName}
                        sx={{ width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                          setOpenForm(false);
                        }}
                      >
                        {<FormattedLabel id="close" />}
                      </Button>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      )}
    </>
  );
}
export default NightDepartmentCheckupEntry;
