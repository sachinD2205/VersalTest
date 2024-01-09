import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import ReplyIcon from "@mui/icons-material/Reply";
// import UploadButton from "../../../../components/fileUpload/UploadButton";
import UploadButton from "../../../../components/security/UploadButton";
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
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Divider, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/transactions/VehicleEntry";
import urls from "../../../../URLS/urls";
import styles from "../../visitorEntry.module.css";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PreviewIcon from "@mui/icons-material/Preview";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

import dynamic from "next/dynamic";
import UploadButtonThumbOP from "../../../../components/security/DocumentsUploadThumbOP";
import { toast } from "react-toastify";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import Fingerprint from "../../../../components/common/fingerPrintSM";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function VehicleEntry() {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema(language)),
    mode: "onChange",
    defaultValues: {
      driverPhoto: null,
      vehicle: "government_vehicle",
      vehicleInOrOut: "vehicleOut",
      isDriverAbsent: "No",
      authorityLetter: null,
    },
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  let appName = "SM";
  let serviceName = "SM-VEE";
  let pageMode = "VEHICLE ENTRY";

  const language = useSelector((state) => state.labels.language);
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [inRemark, setInRemark] = useState("");
  const [inMeterReading, setInMeterReading] = useState("");
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [disabledData, setDisabledData] = useState();
  const [openAuthority, setOpenAuthority] = useState(false);
  const [authorityData, setAuthorityData] = useState();
  const [paramsData, setParamsData] = useState(false);
  const [totalInOut, setTotalInOut] = useState();
  const [nextVehicleNumber, setNextVehicleNumber] = useState(0);
  const [tempData, setTempData] = useState();
  const [encryptedFileNameToSend, setEncryptedFileNameToSend] = useState();

  const [EmployeeId, setEmployeeId] = useState();
  const [base64String, setBase64String] = useState("");
  const [fingerPrintImg, setFingerPrintImg] = useState("");
  const [zoneKeys, setZoneKeys] = useState([]);
  const [isVehicleOut, setIsVehicleOut] = useState(false);
  const [vehicleTypes, setvehicleTypes] = useState([]);

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getAllVehiclesData();
    getVehicleTypes();
    getDepartment();
    // getWardKeys();
    getZoneKeys();
    getBuildings();
    getNextEntryNumber();
    getBuildings();
    getInOut();
    setValue("vehicle", "government_vehicle");
    setValue("vehicleInOrOut", "vehicleOut");
  }, []);

  useEffect(() => {
    getDepartment();
    // getWardKeys();
    getZoneKeys();
    getBuildings();
    getNextEntryNumber();
    getBuildings();
    getInOut();
  }, [window.location.reload]);

  useEffect(() => {
    getAllVehicle();
  }, [wardKeys, zoneKeys, departments, buildings]);

  //buildings
  const [buildings, setBuildings] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);

  const [selectedZoneKey, setSelectedZoneKey] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedWardKey, setSelectedWardKey] = useState([]);
  const [selectedWard, setSelectedWard] = useState([]);

  const [allData, setAllData] = useState([]);
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

  const getAllVehiclesData = () => {
    axios
      .get(`${urls.SMURL}/trnVehicleInOut/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let result = r.data.trnVehicleInOutList;
        console.log("all data", result);
        setAllData(result);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

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

  // get EmployeeDetails
  let empId = watch("employeeKey");
  let vehicleType = watch("vehicle");
  const getEmployeeDetails = () => {
    if (empId && vehicleType === "government_vehicle") {
      axios
        .get(
          `${urls.SMURL}/mstEmployeeVehicleMaster/getByEmployeeKey?employeeKey=${empId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("getEmployeeDetails", r);
          let result = r.data;

          setValue("driver_name", result?.employeeName),
            setValue("mobile_number", result?.employeeMobileNumber),
            setValue("licence_number", result?.licenseNo),
            setValue("vehicle_number", result?.vehicleNumber);
          // setBuildings(result);
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    if (empId == null || empId == "") {
      setValue("driver_name", "");
      setValue("licence_number", "");
      setValue("vehicle_number", "");
      setValue("mobile_number", "");
    } else if (vehicleType === "private_vehicle") setValue("employeeKey", "");
  };

  useEffect(() => {
    // getEmployeeDetails();
  }, [empId, vehicleType]);

  // zones
  // // get Zone Keys
  // const getZoneKeys = () => {
  //   axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
  //     setZoneKeys(
  //       r.data.zone.map((row) => ({
  //         id: row.id,
  //         zoneName: row.zoneName,
  //       })),
  //     );
  //   });
  // };

  // --------------------------------------------------------------------------------------
  // get Zone Keys
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // Print r in console
        console.log("zone", r);

        // const d = r.data.zone.map((row) => ({
        //   id: row.id + 1,
        //   zoneKey: row.id,
        //   zoneName: row.zoneName,
        // }));

        // add one record to d with id as 0 and zoneKey as 0 and zoneName as All
        // d.unshift({ id: 0, zoneKey: 0, zoneName: "All" });

        setZoneKeys(r.data.zone);

        // setSelectedZoneKey(0);
        // setSelectedZone({ id: 0, zoneKey: 0, zoneName: "All" });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };
  // --------------------------------------------------------------------------------------

  const getAllWards = () => {
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

  // get Ward Keys
  const getWardKeys = (selectedZoneId) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("ward2", r);

        // const d = r.data.map((row) => ({
        //   id: row.id + 1,
        //   wardKey: row.id,
        //   wardName: row.wardName,
        // }));

        // add one record to d with id as 0 and wardKey as 0 and wardName as All
        // d.unshift({ id: 0, wardKey: 0, wardName: "All" });

        setWardKeys(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  // --------------------------------------------------------------------------------------

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
        setWardKeys(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    clearErrors("authorityLetter");
  }, [watch("authorityLetter")]);

  const handleUploadDocument = (path) => {
    setValue("authorityLetter", path);
    clearErrors("authorityLetter");
  };

  const handleUploadDocument1 = (path) => {
    setValue("authorityLetter1", path);
  };

  const getAllVehicle = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/trnVehicleInOut/getAll`, {
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
        let result = r.data.trnVehicleInOutList;
        setTempData(result);
        console.log("TESTING", result);
        setLoading(false);
        let _res = result?.map((r, i) => {
          return {
            ...r,
            inTime: r.inTime,
            inMeterReading: r.inMeterReading,
            outMeterReading: r.outMeterReading,
            totalKm: r.totalKm,
            inTimeFormatted: r.inTime
              ? moment(r.inTime).format("DD-MM-YYYY hh:mm A")
              : "",
            outTime: r.outTime,
            outTimeFormatted: r.outTime
              ? moment(r.outTime).format("DD-MM-YYYY hh:mm A")
              : "",
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            inOutStatus: r.inOutStatus === "I" ? "In" : "Out",
            vehicalEntry: r.vehicalEntry,
            vehicalEntryMr: r.vehicalEntryMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            departmentKey: r.departmentKey
              ? departments?.find((obj) => obj?.id == r.departmentKey)
                  ?.department
              : "-",
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
            dept: r?.departmentKey,
            vehicleExitNumber: r?.vehicleExitNumber,
            _vehicleName: r?.vehicleName
              ? vehicleTypes?.find((obj) => obj?.id == Number(r?.vehicleName))
                  ?.vehicleType
              : "-",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleGetName = (e) => {
    console.log("e", e);
    setEncryptedFileNameToSend(e);
  };

  const getInOut = () => {
    axios
      .get(`${urls.SMURL}/trnVehicleInOut/getTotalInOut`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("all check in", r);
        setTotalInOut(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const searchVehicleDetails = async (vehicleNo) => {
    console.log("vehicleNo", vehicleNo);
    await axios
      .get(
        `${urls.SMURL}/trnVehicleInOut/findByVehicleNumber?vehicleNumber=${vehicleNo}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r.status == 200) {
          console.log("res emplo", r);
          if (r?.data?.mstEmployeeVehicleMaster?.activeFlag == "N") {
            toast(
              language == "en" ? "Data Not Found !!!" : "डेटा सापडला नाही!",
              {
                type: "error",
              }
            );
            return;
          }
          if (r?.data?.trnVehicleInOut?.inOutStatus == "O") {
            toast(
              language == "en"
                ? "Vehicle is already out !!!"
                : "वाहन आधीच बाहेर आहे!",
              {
                type: "error",
              }
            );
            setIsVehicleOut(true);
          }
          if (r?.data?.mstEmployeeVehicleMaster) {
            setValue(
              "employeeKey",
              r?.data?.mstEmployeeVehicleMaster?.employeeKey
            );
            setValue(
              "driver_name",
              r?.data?.mstEmployeeVehicleMaster?.employeeName
            );
            setValue(
              "vehicle_number",
              r?.data?.mstEmployeeVehicleMaster?.vehicleNumber
            );
            setValue(
              "vehicle_name",
              r?.data?.mstEmployeeVehicleMaster?.vehicleType
            );
            setValue(
              "mobile_number",
              r?.data?.mstEmployeeVehicleMaster?.employeeMobileNumber
            );
            // setValue("vehicleInDateTime", r?.data?.mstEmployeeVehicleMaster?.inTime);
            setValue(
              "licence_number",
              r?.data?.mstEmployeeVehicleMaster?.licenseNo
            );
            // setValue("inRemark", r?.data?.mstEmployeeVehicleMaster?.inRemark);
            setValue(
              "travel_destination",
              r?.data?.mstEmployeeVehicleMaster?.travelDestination
            );
            setValue(
              "substituteDriver",
              r?.data?.mstEmployeeVehicleMaster?.substituteDriver
            );
            setValue(
              "current_meter_reading",
              r?.data?.mstEmployeeVehicleMaster?.meterReading
            );
            setValue("zoneKey", r?.data?.mstEmployeeVehicleMaster?.zoneKey + 1);
            setSelectedZone(r?.data?.mstEmployeeVehicleMaster?.zoneKey + 1);
            setValue("wardKey", r?.data?.mstEmployeeVehicleMaster?.wardKey + 1);
            setValue(
              "buildingName",
              r?.data?.mstEmployeeVehicleMaster?.buildingName
            );
            setValue(
              "departmentKey",
              r?.data?.mstEmployeeVehicleMaster?.departmentKey
            );
            setValue(
              "officerName",
              r?.data?.mstEmployeeVehicleMaster?.officerName
            );
            setValue(
              "officeMobileNumber",
              r?.data?.mstEmployeeVehicleMaster?.officeMobileNumber
            );
            setValue("isDriverAbsent", "No");
          } else if (r?.data?.trnVehicleInOut) {
            setValue("employeeKey", r?.data?.trnVehicleInOut?.employeeKey);
            setValue("driver_name", r?.data?.trnVehicleInOut?.driverName);
            setValue("vehicle_number", r?.data?.trnVehicleInOut?.vehicleNumber);
            setValue("vehicle_name", r?.data?.trnVehicleInOut?.vehicleName);
            setValue("mobile_number", r?.data?.trnVehicleInOut?.driverNumber);
            // setValue("vehicleInDateTime", r?.data?.trnVehicleInOut?.inTime);
            setValue(
              "licence_number",
              r?.data?.trnVehicleInOut?.driverLicenceNumber
            );
            // setValue("inRemark", r?.data?.trnVehicleInOut?.inRemark);
            // setValue("travel_destination", r?.data?.trnVehicleInOut?.travelDestination);
            setValue(
              "substituteDriver",
              r?.data?.trnVehicleInOut?.substituteDriver
            );
            setValue(
              "current_meter_reading",
              r?.data?.trnVehicleInOut?.inMeterReading
            );
            setValue("zoneKey", r?.data?.trnVehicleInOut?.zoneKey + 1);
            setSelectedZone(r?.data?.trnVehicleInOut?.zoneKey + 1);
            setValue("wardKey", r?.data?.trnVehicleInOut?.wardKey + 1);
            setValue("buildingName", r?.data?.trnVehicleInOut?.buildingName);
            setValue("departmentKey", r?.data?.trnVehicleInOut?.departmentKey);
            setValue("officerName", r?.data?.trnVehicleInOut?.officerName);
            setValue(
              "officeMobileNumber",
              r?.data?.trnVehicleInOut?.officeMobileNumber
            );
            setValue("isDriverAbsent", "No");
          }
          if (!r.data.trnVehicleInOut && !r?.data?.mstEmployeeVehicleMaster) {
            toast(
              language == "en" ? "Data Not Found !!!" : "डेटा सापडला नाही!",
              {
                type: "error",
              }
            );
            setIsVehicleOut(false);
          }
        }
      })
      .catch((err) => {
        toast("Something went wrong !!!", {
          type: "error",
        });
        console.log("err", err);
      });
  };

  useEffect(() => {
    console.log(
      "zoneee",
      zoneKeys,
      zoneKeys.find((zone) => zone.id == watch("zoneKey"))?.zoneName,
      watch("wardKey")
    );
  }, [watch("zoneKey"), watch("wardKey"), selectedZone]);

  useEffect(() => {
    console.log("aala");
  }, [selectedZoneKey]);

  const getNextEntryNumber = () => {
    axios
      .get(`${urls.SMURL}/trnVehicleInOut/getNextEntryNumber`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Nex Entry Number", r);
        setValue("vehicleOutNumber", r.data);
        setNextVehicleNumber(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const handleUploadAuthority = () => {
    if (watch("authorityLetter1")) {
      let body;

      let tmepAuthorityData = tempData?.find(
        (item) => item.id == authorityData.id
      );
      body = {
        ...tmepAuthorityData,
        // authorityLetter: watch("authorityLetter1"),
        authorityLetter: encryptedFileNameToSend,
      };

      console.log("body123", body);
      axios
        .post(
          `${urls.SMURL}/trnVehicleInOut/save`,
          {
            ...body,
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
              language == "en" ? "Updated!" : "अपडेट केले!",

              language == "en"
                ? "The Authority Letter was Updated successfully "
                : "प्राधिकरण पत्र यशस्वीरित्या अपडेट केले गेले",

              "success"
            );
            setValue("authorityLetter1", null);
            handleCloseAuthority();
            getAllVehicle();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      console.log("erlse");
      toast(
        language == "en"
          ? "Please Upload Authority Letter First"
          : "कृपया प्रथम अधिकार पत्र अपलोड करा",
        {
          type: "error",
        }
      );
    }
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData, btnType, btnSaveText);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkin") {
      _body = {
        // inOutStatus: formData.vehicleInOrOut == "vehicleOut" ? "O" : "I",
        inOutStatus: "O",
        departmentKey: formData.departmentKey,
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        subDepartmentKey: 2,
        employeeVehicleKey: 1,
        tokenNumber: formData.vehicle_token_number,
        ownerStatus: "demo",
        vehicleNumber: formData.vehicle_number.toUpperCase(),
        vehicleType: formData.vehicle,
        // vehicleType: formData.vehicle_name,
        driverName: formData.driver_name,
        employeeKey: Number(formData.employeeKey),
        driverNumber: formData.mobile_number,
        vehicleName: formData.vehicle_name,
        travelDestination:
          formData.travelDestinationArea == "Other" ? "Other" : "PCMC Area",
        driverLicenceNumber: formData.licence_number,
        outMeterReading: formData.current_meter_reading,
        outTime: moment(formData?.vehicleOutDateTime).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        driverAuthorization: "demo",
        inRemark: formData.inRemark,
        zoneKey: Number(selectedZoneKey),
        wardKey: Number(selectedWardKey),
        buildingName: Number(formData?.buildingName),
        driverPhoto: formData?.driverPhoto,
        vehicleExitNumber: watch("vehicleOutNumber"),
        fingerPrint: fingerPrintImg,
        // authorityLetter: formData?.authorityLetter,
        authorityLetter: encryptedFileNameToSend,
        officeMobileNumber: formData?.officeMobileNumber,
        officerName: formData?.officerName,
        isDriverAbsent: formData?.isDriverAbsent,
        substituteDriver: formData?.substituteDriver,
      };
      console.log("1", _body);
    } else {
      _body = {
        id: formData.id,
        departmentKey: formData.dept,
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        subDepartmentKey: 2,
        employeeVehicleKey: 1,
        tokenNumber: formData.vehicle_token_number,
        ownerStatus: "demo",
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicle,
        driverName: formData.driverName,
        employeeKey: Number(formData.employeeKey),
        driverNumber: formData.driverNumber,
        vehicleName: formData.vehicle_name,
        travelDestination: formData.travelDestination,
        substituteDriver: formData?.substituteDriver,
        driverLicenceNumber: formData.driverLicenceNumber,
        meterReading: formData.meterReading,
        // inTime: formData.inTime,
        outTime: moment(formData?.outTime).format("YYYY-MM-DDTHH:mm:ss"),
        driverAuthorization: "demo",
        // outTime: outDate.toISOString(),
        // outTime: moment(formData?.outDate).format("YYYY-MM-DDTHH:mm:ss"),
        inTime: moment(watch("vehicleInDateTime")).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        // outTime: moment(outDate).format("YYYY-MM-DDThh:mm:ss"),
        inRemark: formData.inRemark,
        inRemark: inRemark,
        outMeterReading: formData.outMeterReading,
        inMeterReading: Number(inMeterReading),
        zoneKey: Number(selectedZoneKey),
        wardKey: Number(selectedWardKey),
        buildingName: Number(formData?.buildingName),
        driverPhoto: formData?.driverPhoto,
        // inOutStatus: formData.inOutStatus == "In" ? "O" : "I",
        inOutStatus: "I",
        vehicleExitNumber: formData.vehicleExitNumber,
        vehicleType: formData?.vehicleType,
        officeMobileNumber: formData?.officeMobileNumber,
        officerName: formData?.officerName,
        isDriverAbsent: formData?.isDriverAbsent,
        // authorityLetter: formData?.authorityLetter1,
        authorityLetter: encryptedFileNameToSend,
        vehicleName: Number(formData.vehicleName),
      };
      console.log("2", _body);
      //moment(formData?.inTime).format("YYYY-MM-DDThh:mm:ss")
    }
    if (btnSaveText === "Save" && btnType !== "Checkin") {
      console.log("hdjk", _body);
      if (
        formData?.vehicle_number ==
          allData?.find((val) => val?.vehicleNumber)?.vehicleNumber &&
        allData?.find((val) => val?.vehicleNumber)?.inOutStatus == "O"
      ) {
        toast(
          language == "en"
            ? "Vehicle is already out !!!"
            : "वाहन आधीच बाहेर आहे!",
          {
            type: "error",
          }
        );
        return;
      }
      const tempData = axios
        .post(
          `${urls.SMURL}/trnVehicleInOut/save`,
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
            reset();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            getAllVehicle();
            exitButton();
            getNextEntryNumber();
            getInOut();
            getAllVehiclesData();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkin" || btnType === "Checkin") {
      var d = new Date(); // for now
      const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/trnVehicleInOut/save`,
          {
            ..._body,
            // inOutStatus: "O",
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
                    ? "Record Updated successfully "
                    : "रेकॉर्ड यशस्वीरित्या अपडेट केले गेले",

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
            getAllVehicle();
            getInOut();
            getAllVehiclesData();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  const createColumn = () => {
    if (data?.rows[0]) {
      return Object?.keys(data?.rows[0]).map((row) => {
        return {
          field: row,
          headerName: row
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            }),
          flex: 1,
        };
      });
    } else {
      return [];
    }
  };

  const handleOpen = (data) => {
    console.log("data9", data);
    setOpen(true);
    setParamsData(data);
  };

  const handleOpenAuthority = (_data) => {
    setOpenAuthority(true);
    setAuthorityData(_data);
  };

  const handleClose = () => setOpen(false);
  const handleCloseAuthority = () => setOpenAuthority(false);

  const columns = [
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
      field: "departmentKey",
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
      field: "outTimeFormatted",
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
      field: "inTimeFormatted",
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

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // flex: 1,
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {(authority?.includes("HOD") || authority?.includes("ENTRY")) && (
              <>
                {/* <IconButton
            >
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton> */}
                {params.row.inOutStatus == "Out" && (
                  <Tooltip
                    title={language == "en" ? "Vehicle In" : "वाहन आगमन"}
                  >
                    <IconButton
                      onClick={() => {
                        handleOpen(params);
                      }}
                    >
                      <ExitToAppIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                )}
                {/* {params.row.inOutStatus == "In" && (
              <Tooltip title="Vehicle Out">
                <IconButton
                  onClick={() => {
                    handleOpen(params);
                  }}
                >
                  <ReplyIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )} */}

                {params?.row?.isAuthorityLetterPending == true ? (
                  <Tooltip
                    title={
                      language == "en"
                        ? "Upload Authority Letter"
                        : "अधिकार पत्र अपलोड करा"
                    }
                  >
                    <IconButton
                      onClick={() => {
                        handleOpenAuthority(params?.row);
                      }}
                    >
                      <UploadFileIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
                {params?.row?.authorityLetter ? (
                  <Tooltip
                    title={
                      language == "en"
                        ? "View Authority Letter"
                        : "अधिकार पत्र पहा"
                    }
                  >
                    {/* <a
                  href={`${urls.CFCURL}/file/preview?filePath=${params?.row?.authorityLetter}`}
                  target="__blank"
                > */}
                    <IconButton
                      onClick={async () => {
                        console.log(
                          "View Authority Letter",
                          params?.row?.authorityLetter,
                          authority
                        );
                        const DecryptPhoto = await DecryptData(
                          "passphraseaaaaaaaaupload",
                          params?.row?.authorityLetter
                        );

                        const ciphertext = await EncryptData(
                          "passphraseaaaaaaapreview",
                          DecryptPhoto
                        );

                        const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                        axios
                          .get(url, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((r) => {
                            console.log("r", r);
                            if (r?.data?.mimeType == "application/pdf") {
                              const byteCharacters = atob(r?.data?.fileName);
                              const byteNumbers = new Array(
                                byteCharacters.length
                              );
                              for (let i = 0; i < byteCharacters.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                              }
                              const byteArray = new Uint8Array(byteNumbers);
                              const blob = new Blob([byteArray], {
                                type: "application/pdf",
                              });
                              const url = URL.createObjectURL(blob);
                              const newTab = window.open();
                              newTab.location.href = url;
                            }
                            // for img
                            else if (r?.data?.mimeType == "image/jpeg") {
                              const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
                              const newTab = window.open();
                              newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
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
                            console.log("CatchPreviewApi", error);
                          });

                        // if (params?.row?.authorityLetter?.includes(".pdf")) {
                        //   const url = `${urls.CFCURL}/file/preview?filePath=${params?.row?.authorityLetter}`;

                        //   axios
                        //     .get(url, {
                        //       headers: {
                        //         Authorization: `Bearer ${token}`,
                        //       },
                        //       responseType: "arraybuffer",
                        //     })
                        //     .then((response) => {
                        //       if (
                        //         response &&
                        //         response.data instanceof ArrayBuffer
                        //       ) {
                        //         const pdfBlob = new Blob([response.data], {
                        //           type: "application/pdf",
                        //         });
                        //         const pdfUrl = URL.createObjectURL(pdfBlob);

                        //         const newTab = window.open();
                        //         newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
                        //       } else {
                        //         console.error(
                        //           "Invalid or missing data in the response"
                        //         );
                        //       }
                        //     })
                        //     .catch((error) => {
                        //       console.error(
                        //         "Error fetching or displaying PDF:",
                        //         error
                        //       );
                        //     });
                        // } else {
                        //   const url = ` ${urls.CFCURL}/file/previewNew?filePath=${params?.row?.authorityLetter}`;

                        //   axios
                        //     .get(url, {
                        //       headers: {
                        //         Authorization: `Bearer ${token}`,
                        //       },
                        //     })
                        //     .then((r) => {
                        //       console.log("ImageApi21312", r?.data);
                        //       const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
                        //       const newTab = window.open();
                        //       newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
                        //     })
                        //     .catch((error) => {
                        //       console.log("CatchPreviewApi", error);
                        //       callCatchMethod(error, language);
                        //     });
                        // }
                      }}
                    >
                      <PreviewIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                    {/* </a> */}
                  </Tooltip>
                ) : (
                  ""
                )}
                <Tooltip title={language == "en" ? "View Form" : "फॉर्म पहा"}>
                  <IconButton
                    onClick={() => {
                      // handleOpen(params);
                      console.log("openForm", params.row);
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

  const getRowClassName = (params) => {
    const row = params.row;

    // Define your condition here
    if (row.isAuthorityLetterPending == true) {
      console.log("aala re", row.isAuthorityLetterPending);

      return styles.rowBack;
    }

    return "";
  };

  const resetValuesCancell = {
    departmentKey: null,
    vehicle_number: "",
    driver_name: "",
    buildingName: null,
    zoneKey: null,
    wardKey: null,
    vehicle_name: null,
    mobile_number: "",
    licence_number: "",
    inRemark: "",
    enteredVehicleNum: null,
    employeeKey: null,
    officerName: null,
    officeMobileNumber: null,
    vehicleInDateTime: null,
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

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

  useEffect(() => {
    // getAllVehicle();
    getAllWards();
    getDepartment();
  }, []);

  const chartOptions = {
    chart: {
      id: "bar-chart",
    },
    xaxis: {
      categories: [
        language == "en" ? "OUT" : "निर्गमन",
        language == "en" ? "IN" : "आगमन",
      ],
    },
    yaxis: {
      title: {
        text: language == "en" ? "Values" : "मूल्ये",
      },
    },
  };

  const chartSeries = [
    {
      name: "Series 1",
      data: [
        totalInOut?.Values[0]["Total_out"]
          ? totalInOut?.Values[0]["Total_out"]
          : "0",
        totalInOut?.Values[0]["Total_in"]
          ? totalInOut?.Values[0]["Total_in"]
          : "0",
      ],
    },
  ];

  return (
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
            {isOpenCollapse ? (
              <Typography
                style={{
                  color: "white",
                  fontSize: "19px",
                }}
              >
                <strong>
                  {" "}
                  <FormattedLabel id="vehicleOutEntry" />
                </strong>
              </Typography>
            ) : (
              <Typography
                style={{
                  color: "white",
                  fontSize: "19px",
                }}
              >
                <strong>
                  {" "}
                  <FormattedLabel id="vehicleIn_OutEntry" />
                </strong>
              </Typography>
            )}
          </Box>
          <Head>
            <title>Vehicle In/Out Entry</title>
          </Head>
          {isOpenCollapse ? (
            <>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Controller
                      name="vehicle"
                      control={control}
                      defaultValue="government_vehicle"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          defaultValue="government_vehicle"
                        >
                          <FormControlLabel
                            value="government_vehicle"
                            control={<Radio />}
                            label={<FormattedLabel id="governmentVehicle" />}
                          /> 
                          <FormControlLabel
                            value="private_vehicle"
                            control={<Radio />}
                            label={<FormattedLabel id="privateVehicle" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </Grid>
                  */}

                  {/* {watch("vehicle") === "government_vehicle" && ( */}
                  <>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          sx={{ width: "45%" }}
                          fullWidth
                          id="outlined-basic"
                          // label="Vehicle No."
                          label={<FormattedLabel id="vehicleNumber" />}
                          size="small"
                          placeholder="MH12NN1234"
                          variant="outlined"
                          {...register("enteredVehicleNum")}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          disabled={!watch("enteredVehicleNum")}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            searchVehicleDetails(
                              watch("enteredVehicleNum")?.toUpperCase()
                            );
                          }}
                        >
                          <FormattedLabel id="searchVehicleDetails" />
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                  {/* )} */}

                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Controller
                        name="vehicleInOrOut"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="vehicleOut"
                          >
                            <FormControlLabel
                              value="vehicleIn"
                              control={<Radio />}
                              label={<FormattedLabel id="vehicleIn" />}
                            />
                            <FormControlLabel
                              value="vehicleOut"
                              control={<Radio />}
                              label={<FormattedLabel id="vehicleOut" />}
                            />
                          </RadioGroup>
                        )}
                      />
                    </Grid>
                  </Grid> */}
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        value={nextVehicleNumber}
                        // value={Number(totalInOut?.Values[0]["Total_in"]) + 1}
                        label={<FormattedLabel id="vehicleOutNumber" />}
                        size="small"
                        {...register("vehicleOutNumber")}
                        error={errors.vehicleOutNumber}
                        helperText={
                          errors.vehicleOutNumber
                            ? errors.vehicleOutNumber.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        disabled={
                          watch("vehicle") === "private_vehicle" ? true : false
                        }
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        label={<FormattedLabel id="employeeId" required />}
                        size="small"
                        onChange={(e) => {
                          // Set Employee Id
                          setEmployeeId(e.target.value);
                        }}
                        InputLabelProps={{
                          shrink: watch("employeeKey") ? true : false,
                        }}
                        {...register("employeeKey")}
                        error={errors.employeeKey}
                        helperText={
                          errors.employeeKey ? errors.employeeKey.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        label={<FormattedLabel id="vehicleNumber" required />}
                        size="small"
                        InputLabelProps={{
                          shrink: watch("vehicle_number") ? true : false,
                        }}
                        {...register("vehicle_number")}
                        error={errors.vehicle_number}
                        helperText={
                          errors.vehicle_number
                            ? errors.vehicle_number.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        id="standard-basic"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                          shrink: watch("driver_name") ? true : false,
                        }}
                        label={<FormattedLabel id="driverName" required />}
                        {...register("driver_name")}
                        error={errors.driver_name}
                        helperText={
                          errors.driver_name ? errors.driver_name.message : null
                        }
                      />
                    </Grid>
                  </Grid>
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
                            // <Select
                            //   // {...field}
                            //   value={field.value}
                            //   onChange={(value) => {
                            //     field.onChange(value);
                            //     getFilterWards(value);
                            //   }}
                            //   fullWidth
                            //   label="Zone Name"
                            // >
                            //   {zoneKeys.map((item, i) => {
                            //     return (
                            //       <MenuItem key={i} value={item.id}>
                            //         {item.zoneName}
                            //       </MenuItem>
                            //     );
                            //   })}
                            // </Select>
                            <Select
                              defaultValue={selectedZone}
                              labelId="zone-label"
                              id="zone"
                              value={selectedZone}
                              label={<FormattedLabel id="zoneName" />}
                              onChange={(e) => {
                                console.log("ZoneKey" + e.target.value);
                                setSelectedZoneKey(e.target.value);
                                setSelectedZone(e.target.value);

                                getWardKeys(e.target.value);

                                // Set value of this select to zonename

                                // setSelectedWardKey(0);
                                // setSelectedWard({ wardKey: 0, wardName: "All" });
                              }}
                            >
                              {zoneKeys.map((r) => (
                                <MenuItem value={r.id}>{r.zoneName}</MenuItem>
                              ))}
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
                            // <Select
                            //   // {...field}
                            //   onChange={(value) => field.onChange(value)}
                            //   value={field.value}
                            //   fullWidth
                            //   label={<FormattedLabel id="wardName" />}
                            // >
                            //   {wardKeys.map((item, i) => {
                            //     return (
                            //       <MenuItem key={i} value={item.wardId}>
                            //         {item.wardName}
                            //       </MenuItem>
                            //     );
                            //   })}
                            // </Select>
                            <Select
                              labelId="ward-label"
                              id="ward"
                              label={<FormattedLabel id="wardName" />}
                              value={selectedWard}
                              onChange={(e) => {
                                setSelectedWardKey(e.target.value);
                                setSelectedWard(e.target.value);
                              }}
                            >
                              {wardKeys.map((r) => {
                                return (
                                  <MenuItem value={r.id}>{r.wardName}</MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.buildingName}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={watch("buildingName") ? true : false}
                        >
                          <FormattedLabel id="buildingName" required />
                        </InputLabel>
                        <Controller
                          name="buildingName"
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
                          {errors?.buildingName
                            ? errors.buildingName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.departmentKey}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={watch("departmentKey") ? true : false}
                        >
                          {<FormattedLabel id="departmentName" required />}
                        </InputLabel>
                        <Controller
                          name="departmentKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
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
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.vehicle_name}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={watch("vehicle_name") ? true : false}
                        >
                          {<FormattedLabel id="vehicleName" required />}
                        </InputLabel>
                        <Controller
                          name="vehicle_name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              value={field.value}
                              label={
                                <FormattedLabel id="vehicleName" required />
                              }
                            >
                              {vehicleTypes?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.vehicleType}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.vehicle_name
                            ? errors.vehicle_name.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="mobile_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            // type="number"
                            {...field}
                            size="small"
                            label={
                              <FormattedLabel id="mobileNumber" required />
                            }
                            fullWidth
                            sx={{ width: "90%" }}
                            inputProps={{
                              maxLength: 10,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={errors.mobile_number}
                            helperText={
                              errors.mobile_number
                                ? errors.mobile_number.message
                                : null
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {console.log("watch", watch("vehicleInOrOut"))}
                    {watch("vehicleInOrOut") === "vehicleOut" ? (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Controller
                          control={control}
                          name="vehicleOutDateTime"
                          defaultValue={new Date()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DateTimePicker
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    fullWidth
                                    sx={{ width: "90%" }}
                                    size="small"
                                  />
                                )}
                                label={
                                  <FormattedLabel id="vehicleOutDateTime" />
                                }
                                // label="Vehicle Out Date Time"
                                value={field.value}
                                defaultValue={new Date()}
                                onChange={(date) => field.onChange(date)}
                                error={errors.vehicleOutDateTime}
                                helperText={
                                  errors.vehicleOutDateTime
                                    ? errors.vehicleOutDateTime.message
                                    : null
                                }
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Controller
                          control={control}
                          name="vehicleInDateTime"
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
                                    size="small"
                                  />
                                )}
                                label={
                                  <FormattedLabel
                                    id="vehicleInDateTime"
                                    required
                                  />
                                }
                                defaultValue={new Date()}
                                value={field.value}
                                minDateTime={moment(
                                  paramsData?.row?.vehicleOutDateTime
                                )}
                                onChange={(date) => field.onChange(date)}
                                error={errors.vehicleInDateTime}
                                helperText={
                                  errors.vehicleInDateTime
                                    ? errors.vehicleInDateTime.message
                                    : null
                                }
                                inputFormat="DD-MM-YYYY hh:mm:ss"
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="licence_number"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            label={
                              <FormattedLabel id="licenceNumber" required />
                            }
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: watch("licence_number") ? true : false,
                            }}
                            error={errors.licence_number}
                            helperText={
                              errors.licence_number
                                ? errors.licence_number.message
                                : null
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* <Grid
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
                        <FormattedLabel id="driverPhoto" />
                      </Typography>
                      <Box>
                        <UploadButtonThumbOP
                          appName={appName}
                          fileName={"driverPhoto.png"}
                          serviceName={serviceName}
                          fileDtl={getValues("driverPhoto")}
                          fileKey={"driverPhoto"}
                          showDel={pageMode != "VEHICLE ENTRY" ? false : true}
                        />
                      </Box>
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        fullWidth
                        sx={{ width: "90%" }}
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="outRemark" />}
                        InputLabelProps={{
                          shrink: watch("outRemark") ? true : false,
                        }}
                        variant="outlined"
                        {...register("outRemark")}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex" }}
                    >
                      <Controller
                        name="isDriverAbsent"
                        control={control}
                        defaultValue="No"
                        render={({ field }) => (
                          <>
                            <Typography sx={{ m: 1 }}>
                              <FormattedLabel id="isDriverAbsent" />
                            </Typography>

                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              defaultValue="No"
                            >
                              <FormControlLabel
                                value="Yes"
                                control={<Radio />}
                                label={<FormattedLabel id="yes" />}
                              />
                              <FormControlLabel
                                value="No"
                                control={<Radio />}
                                label={<FormattedLabel id="no" />}
                              />
                            </RadioGroup>
                          </>
                        )}
                      />
                    </Grid>
                  </Grid>
                  {watch("isDriverAbsent") == "Yes" ? (
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            border: errors?.authorityLetter
                              ? "1px solid red"
                              : "1px solid gray",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                        >
                          <Box sx={{ width: "50%", paddingRight: "5px" }}>
                            <Typography>
                              <FormattedLabel id="authorityLetter" />
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "auto",
                            }}
                          >
                            <UploadButton
                              appName={appName}
                              serviceName={serviceName}
                              filePath={(path) => {
                                handleUploadDocument(path);
                              }}
                              fileName={
                                getValues("authorityLetter.png") &&
                                "authorityLetter.png"
                              }
                              fileNameEncrypted={(path) => {
                                handleGetName(path);
                              }}
                            />
                          </Box>
                        </Box>
                        <Box>
                          <FormHelperText error={errors.authorityLetter}>
                            {errors?.authorityLetter
                              ? errors.authorityLetter.message
                              : null}
                          </FormHelperText>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{ paddingTop: "2vh" }}
                      >
                        <Controller
                          name="substituteDriver"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={<FormattedLabel id="substituteDriver" />}
                              fullWidth
                              sx={{ width: "90%" }}
                              InputLabelProps={{
                                shrink: watch("substituteDriver")
                                  ? true
                                  : false,
                              }}
                              size="small"
                              // error={!!errors.substituteDriver}
                              // helperText={errors?.substituteDriver ? errors.substituteDriver.message : null}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="travel_destination"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            label={<FormattedLabel id="travelDestinationDetails" required />}
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{ shrink: true }}
                            error={errors.travel_destination}
                            helperText={
                              errors.travel_destination ? errors.travel_destination.message : null
                            }
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            size="small"
                            label={<FormattedLabel id="location" />}
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{ shrink: true }}
                            error={errors.location}
                            helperText={
                              errors.location ? errors.location.message : null
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid> */}
                  <div></div>
                  <Grid container sx={{ padding: "2vh" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex" }}
                    >
                      <Controller
                        name="travelDestinationArea"
                        control={control}
                        defaultValue="PCMC Area"
                        render={({ field }) => (
                          <>
                            <Typography sx={{ m: 1 }}>
                              <FormattedLabel id="travelDestinationArea" />
                            </Typography>

                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              defaultValue="PCMC Area"
                            >
                              <FormControlLabel
                                value="PCMC Area"
                                control={<Radio />}
                                label={<FormattedLabel id="PCMCArea" />}
                              />
                              <FormControlLabel
                                value="other"
                                control={<Radio />}
                                label={<FormattedLabel id="other" />}
                              />
                            </RadioGroup>
                          </>
                        )}
                      />
                    </Grid>
                    {watch("travelDestinationArea") == "other" ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{ display: "flex" }}
                      >
                        <Controller
                          name="otherTravelDestinationArea"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={<FormattedLabel id="other" />}
                              fullWidth
                              sx={{ width: "90%" }}
                              InputLabelProps={{
                                shrink: watch("otherTravelDestinationAreatrue")
                                  ? true
                                  : false,
                              }}
                              size="small"
                            />
                          )}
                        />
                      </Grid>
                    ) : (
                      ""
                    )}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ paddingTop: "2vh" }}
                    >
                      <Controller
                        name="current_meter_reading"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={
                              <FormattedLabel
                                id="currentMeterReading"
                                required
                              />
                            }
                            size="small"
                            fullWidth
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: watch("current_meter_reading")
                                ? true
                                : false,
                            }}
                            error={!!errors.current_meter_reading}
                            helperText={
                              errors?.current_meter_reading
                                ? errors.current_meter_reading.message
                                : null
                            }
                          />
                        )}
                      />
                    </Grid>

                    {/* {
                      watch("vehicleInOrOut") === "vehicleIn" ? (
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ paddingTop: "2vh" }}>
                          <Controller
                            name="meterReading"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={<FormattedLabel id="meterReading" required />}
                                size="small"
                                fullWidth
                                sx={{ width: "90%" }}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.meterReading}
                                helperText={
                                  errors?.meterReading ? errors.meterReading.message : null
                                }
                              />
                            )}
                          />
                        </Grid>
                      ) : ""
                    } */}
                  </Grid>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      background:
                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    }}
                  >
                    <h2>
                      <FormattedLabel id="vehicleAssign" />
                    </h2>
                  </Box>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="officerName" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("officerName") ? true : false,
                        }}
                        {...register("officerName")}
                        sx={{ width: "90%" }}
                        error={!!errors.officerName}
                        helperText={
                          errors?.officerName
                            ? errors.officerName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="officeMobileNumber" required />
                        }
                        size="small"
                        fullWidth
                        inputProps={{
                          maxLength: 10,
                        }}
                        InputLabelProps={{
                          shrink: watch("officeMobileNumber") ? true : false,
                        }}
                        {...register("officeMobileNumber")}
                        sx={{ width: "90%" }}
                        error={!!errors.officeMobileNumber}
                        helperText={
                          errors?.officeMobileNumber
                            ? errors.officeMobileNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Box>
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // margin: ".5vh 0",
                  }}
                >
                  <Controller
                    name="vehicle_in_out"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        {...field}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="vehicle_in"
                      >
                        <FormControlLabel
                          value="vehicle_in"
                          control={<Radio />}
                          label="Vehicle IN"
                        />
                        <FormControlLabel
                          value="vehicle_out"
                          control={<Radio />}
                          label="Vehicle OUT"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box> */}
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Type
                  </Typography>
                  <Controller
                    name="vehicle_type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={vehicleTypes[0].label}>
                        {vehicleTypes.map((item) => {
                          return (
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box> */}
                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Driver Name
                  </Typography>
                  <Controller
                    name="vehicle_driver_name"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={vehicleDriverNames[0].label}>
                        {vehicleDriverNames.map((item) => {
                          return (
                            <MenuItem value={item.value}>{item.label}</MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box> */}

                      {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "1vh 0",
                  }}
                >
                  <Typography sx={{ margin: "0 20px" }}>
                    Vehicle Out Date & Time
                  </Typography>
                  <Controller
                    name="vehicle_out_date_time"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          disabled={data.rows.length !== 0 ? false : true}
                          label={
                            <span style={{ fontSize: 16 }}>
                              Vehicle Out Time
                            </span>
                          }
                          value={field.value || null}
                          onChange={(time) => field.onChange(time)}
                          selected={field.value}
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
                </Box> */}
                    </Box>
                  </Box>
                  {/* <Box className={styles.DriverThumb}>
                    <Typography sx={{ margin: "0 1vh" }}>
                      <FormattedLabel id="driverThumbSignature" />
                    </Typography>
                    <Button>
                      <FingerprintIcon />
                    </Button>
                  </Box> */}
                  <Box>
                    <Fingerprint
                      base64String={base64String}
                      setFingerPrintImg={setFingerPrintImg}
                      setBase64String={setBase64String}
                      appName={appName}
                      serviceName={serviceName}
                    />
                  </Box>
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
                        disabled={isVehicleOut}
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
                          setSelectedZone(null);
                          setIsVehicleOut(false);
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
            </>
          ) : (
            <>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  xs={3}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    {<FormattedLabel id="date" />}
                    {` : ${moment(new Date()).format("DD-MM-YYYY")}`}
                  </Typography>
                </Grid>
                <Grid
                  xs={6}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    height={350}
                    width={500}
                  />
                </Grid>

                <Grid
                  xs={3}
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography>
                    <div>
                      <div>
                        <FormattedLabel id="totalOut" /> :{" "}
                        {totalInOut?.Values[0]["Total_out"]}{" "}
                      </div>
                      <div>
                        <FormattedLabel id="totalIn" /> :{" "}
                        {totalInOut?.Values[0]["Total_in"]}{" "}
                      </div>
                      <div>
                        <FormattedLabel id="balanceVehicle" /> :{" "}
                        {totalInOut?.Values[0]["balance"]}
                      </div>
                    </div>
                  </Typography>
                </Grid>
                {(authority?.includes("HOD") ||
                  authority?.includes("ENTRY")) && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      sx={{ margin: "10px" }}
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
                  </Box>
                )}
              </Grid>
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
                autoHeight={data.pageSize}
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
                getRowClassName={(params) => getRowClassName(params)}
                density="compact"
                // autoHeight={true}
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
                  getAllVehicle(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  // updateData("page", 1);
                  getAllVehicle(_data, data.page);
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
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {paramsData?.row?.inOutStatus == "Out" ? (
                      <>
                        <FormControl fullWidth>
                          <Controller
                            control={control}
                            name="vehicleInDateTime"
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
                                      size="small"
                                    />
                                  )}
                                  label={
                                    <FormattedLabel id="vehicleInDateTime" />
                                  }
                                  minTime={moment(paramsData.row.outTime)}
                                  minDate={moment(paramsData.row.outTime)}
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  inputFormat="DD-MM-YYYY hh:mm:ss"
                                  defaultValue={new Date()}
                                  error={errors.vehicleInDateTime}
                                  helperText={
                                    errors.vehicleInDateTime
                                      ? errors.vehicleInDateTime.message
                                      : null
                                  }
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                        {/* <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "10px",
                          }}
                        > */}
                        {/* {paramsData?.row?.inOutStatus == "In" ? ( */}
                        <TextField
                          size="small"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="currentMeterReading" />}
                          variant="outlined"
                          {...register("inMeterReading")}
                          error={!!errors.inMeterReading}
                          onChange={(e) => {
                            setInMeterReading(e.target.value);
                            console.log("e.target.value", e.target.value);
                          }}
                          helperText={
                            errors?.inMeterReading
                              ? errors.inMeterReading.message
                              : null
                          }
                        />
                        {/* ) : (
                  <TextField
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="inRemark" />}
                    variant="outlined"
                    {...register("inRemark")}
                  />
                )} */}
                        {/* </Box> */}
                      </>
                    ) : (
                      //  (
                      // <FormControl fullWidth>
                      //   <Controller
                      //     control={control}
                      //     name="vehicleOutDateTime"
                      //     defaultValue={null}
                      //     render={({ field }) => (
                      //       <LocalizationProvider dateAdapter={AdapterMoment}>
                      //         <DateTimePicker
                      //           renderInput={(props) => <TextField {...props} fullWidth size="small" />}
                      //           label="Vehicle Out Date Time"
                      //           value={field.value}
                      //           onChange={(date) => field.onChange(date)}
                      //           error={errors.vehicleOutDateTime}
                      //           helperText={
                      //             errors.vehicleOutDateTime ? errors.vehicleOutDateTime.message : null
                      //           }
                      //           inputFormat="DD-MM-YYYY hh:mm:ss"
                      //         />
                      //       </LocalizationProvider>
                      //     )}
                      //   />
                      // </FormControl>
                      // )
                      ""
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                    }}
                  >
                    {/* {paramsData?.row?.inOutStatus == "In" ? ( */}
                    <TextField
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="inRemark" />}
                      variant="outlined"
                      {...register("inRemark")}
                      error={!!errors.inRemark}
                      onChange={(e) => {
                        setInRemark(e.target.value);
                        console.log("e.target.value", e.target.value);
                      }}
                      helperText={
                        errors?.inRemark ? errors.inRemark.message : null
                      }
                    />
                    {/* ) : (
                  <TextField
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="inRemark" />}
                    variant="outlined"
                    {...register("inRemark")}
                  />
                )} */}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        console.log("paramsData.row", paramsData);
                        setBtnSaveText("Checkin");
                        setRowId(paramsData.row.id);
                        onSubmitForm(paramsData.row, "Checkin");
                        setOpen(false);
                      }}
                    >
                      <FormattedLabel id="submit" />
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={handleClose}
                    >
                      <FormattedLabel id="close" />
                    </Button>
                  </Box>
                </Box>
              </Modal>
              <Box>
                <Modal
                  open={openAuthority}
                  onClose={handleCloseAuthority}
                  aria-labelledby="modal-modal-title1"
                  aria-describedby="modal-modal-description1"
                >
                  <Box sx={style}>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="authorityLetter" />
                        </Typography>
                        <Box>
                          <UploadButton
                            appName={appName}
                            serviceName={serviceName}
                            filePath={(path) => {
                              handleUploadDocument1(path);
                            }}
                            fileName={
                              getValues("authorityLetter1.png") &&
                              "authorityLetter1.png"
                            }
                            fileNameEncrypted={(path) => {
                              handleGetName(path);
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            // onSubmitForm(paramsData.row, "Checkout");
                            handleUploadAuthority();
                          }}
                        >
                          <FormattedLabel id="upload" />
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={handleCloseAuthority}
                        >
                          <FormattedLabel id="close" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              </Box>
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
                  <FormattedLabel id="vehicleOutEntry" />
                </DialogTitle>
                <Divider />
                <DialogContent>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        value={disabledData?.vehicleExitNumber}
                        label={<FormattedLabel id="vehicleOutNumber" />}
                        size="small"
                        // {...register("vehicleOutNumber")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        label={<FormattedLabel id="employeeId" />}
                        size="small"
                        disabled
                        value={disabledData?.employeeKey}
                        InputLabelProps={{
                          shrink: disabledData?.employeeKey ? true : false,
                        }}
                        // {...register("employeeKey")}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        variant="outlined"
                        id="standard-basic"
                        label={<FormattedLabel id="vehicleNumber" />}
                        size="small"
                        disabled
                        value={disabledData?.vehicleNumber}
                        InputLabelProps={{
                          shrink: disabledData?.vehicleNumber ? true : false,
                        }}
                        // {...register("vehicle_number")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        id="standard-basic"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                          shrink: disabledData?.driverName ? true : false,
                        }}
                        label={<FormattedLabel id="driverName" />}
                        // {...register("driver_name")}
                        disabled
                        value={disabledData?.driverName}
                      />
                    </Grid>
                  </Grid>
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
                              value={disabledData?.buildingName}
                              fullWidth
                              disabled
                              InputLabelProps={{
                                shrink: disabledData?.buildingName
                                  ? true
                                  : false,
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
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.vehicle_name}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          shrink={disabledData?.vehicleName ? true : false}
                        >
                          {<FormattedLabel id="vehicleName" />}
                        </InputLabel>
                        <Controller
                          name="vehicle_name"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              value={disabledData?.vehicleName}
                              disabled
                              label={
                                <FormattedLabel id="vehicleName" required />
                              }
                            >
                              {vehicleTypes?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.vehicleType}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        id="standard-basic"
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                          shrink: disabledData?.driverNumber ? true : false,
                        }}
                        label={<FormattedLabel id="mobileNumber" />}
                        // {...register("driver_name")}
                        disabled
                        value={disabledData?.driverNumber}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="vehicleOutDateTime" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: disabledData?.outTimeFormatted ? true : false,
                        }}
                        disabled
                        value={disabledData?.outTimeFormatted}
                        {...register("purpose")}
                        sx={{ width: "90%" }}
                      />
                    </Grid>

                    {disabledData?.inOutStatus == "In" && (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="vehicleInDateTime" />}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: disabledData?.inTimeFormatted
                              ? true
                              : false,
                          }}
                          disabled
                          value={disabledData?.inTimeFormatted}
                          {...register("purpose")}
                          sx={{ width: "90%" }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        label={<FormattedLabel id="licenceNumber" />}
                        value={disabledData?.driverLicenceNumber}
                        disabled
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.driverLicenceNumber
                            ? true
                            : false,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        label={<FormattedLabel id="outRemark" />}
                        value={disabledData?.outRemark}
                        disabled
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.outRemark ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex" }}
                    >
                      <Controller
                        name="isDriverAbsent"
                        control={control}
                        defaultValue="No"
                        render={({ field }) => (
                          <>
                            <Typography sx={{ m: 1 }}>
                              <FormattedLabel id="isDriverAbsent" />
                            </Typography>

                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              defaultValue="No"
                              value={disabledData?.isDriverAbsent}
                            >
                              <FormControlLabel
                                value="Yes"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="yes" />}
                              />
                              <FormControlLabel
                                value="No"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="no" />}
                              />
                            </RadioGroup>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      {disabledData?.isDriverAbsent == "Yes" && (
                        <TextField
                          size="small"
                          label={<FormattedLabel id="substituteDriver" />}
                          value={disabledData?.substituteDriver}
                          disabled
                          fullWidth
                          sx={{ width: "90%" }}
                          InputLabelProps={{
                            shrink: disabledData?.substituteDriver
                              ? true
                              : false,
                          }}
                        />
                      )}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex" }}
                    >
                      <Controller
                        name="travelDestinationArea"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Typography sx={{ m: 1 }}>
                              <FormattedLabel id="travelDestinationArea" />
                            </Typography>

                            <RadioGroup
                              {...field}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              defaultValue="PCMC Area"
                              value={disabledData?.travelDestination}
                            >
                              <FormControlLabel
                                value="PCMC Area"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="PCMCArea" />}
                              />
                              <FormControlLabel
                                value="other"
                                control={<Radio disabled />}
                                label={<FormattedLabel id="other" />}
                              />
                            </RadioGroup>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        label={<FormattedLabel id="substituteDriver" />}
                        value={disabledData?.outMeterReading}
                        disabled
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.outMeterReading ? true : false,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        label={<FormattedLabel id="officerName" />}
                        value={disabledData?.officerName}
                        disabled
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.officerName ? true : false,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                      <TextField
                        size="small"
                        label={<FormattedLabel id="officeMobileNumber" />}
                        value={disabledData?.officeMobileNumber}
                        disabled
                        fullWidth
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: disabledData?.officeMobileNumber
                            ? true
                            : false,
                        }}
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
    </Paper>
  );
}
export default VehicleEntry;
