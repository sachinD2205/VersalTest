// Old Form

// First Ahawal Form

import { yupResolver } from "@hookform/resolvers/yup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/firstAhwal";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const resetValuesExit = {
  reasonOfFire: "",
  reasonOfFireMr: "",
};

const names = [
  { name: "Fire Extinguishers", id: 1 },
  { name: "Fire Alarm Systems", id: 2 },
  { name: "Smoke detector", id: 3 },
  { name: "Heat Detector", id: 4 },
];

const Form = (props) => {
  // const { applicationDataId, pageMode } = props;
  const userToken = useGetToken();

  // console.log("pageMode9090", pageMode);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  // Multiple Add for external support
  const [extperson, setExtPerson] = useState([
    { externalServiceId: null, esname: "", esconatact: "" },
  ]);

  const handleClick2 = () => {
    const rowsInput = {
      externalServiceId: null,
      esname: "",
      esconatact: "",
    };
    setExtPerson([...extperson, rowsInput]);
  };

  const removeUser = (index) => {
    const filteredUser = [...extperson];
    filteredUser.splice(index, 1);
    setExtPerson(filteredUser);
  };

  // Multiple Add for Fire Equipment With capacity

  const [fireEqipmentMulAdd, setFireEqipmentMulAdd] = useState([
    { fireEquipments: "", capacity: "" },
  ]);

  const handleClickForFireEquipment = () => {
    const rowsInput = {
      fireEquipments: "",
      capacity: "",
    };
    setFireEqipmentMulAdd([...fireEqipmentMulAdd, rowsInput]);
  };

  const removeFireEqipment = (index) => {
    const filteredUser = [...fireEqipmentMulAdd];
    filteredUser.splice(index, 1);
    setFireEqipmentMulAdd(filteredUser);
  };

  // Multiple Add for Vehicle
  const [vehicle, setVehicle] = React.useState([
    {
      vehicle: "",
      outTime: "",
      reachedTime: "",
      workDuration: "",
      leaveTime: "",
      inTime: "",
      firstAhawalId: "",
      distanceTravelledInKms: "",
    },
  ]);

  const handleClickVehicle = () => {
    const rowsInputs = {
      vehicle: "",
      outTime: "",
      reachedTime: "",
      workDuration: "",
      leaveTime: "",
      inTime: "",
      firstAhawalId: "",
      distanceTravelledInKms: "",
    };
    setVehicle([...vehicle, rowsInputs]);
  };

  const removeVehicle = (index) => {
    const filteredVehicle = [...vehicle];
    filteredVehicle.splice(index, 1);
    setVehicle(filteredVehicle);
  };

  // Multiple Add For External Employee
  const [externalEmp, setExternalEmp] = useState([
    {
      offDutyEmpName: "",
      offDutyEmpNameMr: "",
      offDutyEmpContactNo: "",
      offDutyEmpAddress: "",
      offDutyEmpAddressMr: "",
    },
  ]);

  const handleClickEmployee = () => {
    const addedRow = {
      offDutyEmpName: "",
      offDutyEmpNameMr: "",
      offDutyEmpContactNo: "",
      offDutyEmpAddress: "",
      offDutyEmpAddressMr: "",
    };
    setExternalEmp([...externalEmp, addedRow]);
  };

  const removeEmployee = (index) => {
    const filterEmployee = [...externalEmp];
    filterEmployee.splice(index, 1);
    setExternalEmp(filterEmployee);
  };

  useEffect(() => {
    console.log("kkkkkkkk", getValues("isLossInAmount"));
  }, []);

  // multiselect
  const theme = useTheme();

  const [slideChecked, setSlideChecked] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  // const [fetchData, setFetchData] = useState(null);

  // Fire Station
  const [fireStationName, setFireStationName] = React.useState([]);
  const handleChangeFireStation = (event) => {
    const {
      target: { value },
    } = event;
    setFireStationName(typeof value === "string" ? value.split(",") : value);
    setCrew(event.target.value);
  };

  // Fire Crew
  const [fireCrewsMul, setFireCrewsMul] = React.useState([]);
  const handleChangeFireCrewsMul = (event) => {
    const {
      target: { value },
    } = event;
    setFireCrewsMul(typeof value === "string" ? value.split(",") : value);
  };

  // crew - Employee Name
  const [crewEmployeeName, setCrewEmployeeName] = React.useState([]);
  const handleChangeCrewEmployeeName = (event) => {
    console.log("eevent", event.target);
    const {
      target: { value },
    } = event;
    setCrewEmployeeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // external Employee
  const [externalEmployee, setExternalEmployee] = React.useState([]);
  const handleChangeExternalEmployee = (event) => {
    const {
      target: { value },
    } = event;
    setExternalEmployee(typeof value === "string" ? value.split(",") : value);
  };

  // fire Equipment
  const [fireEquipmentMul, setFireEquipmentMul] = React.useState([]);
  const handleChangeFireEquipmentMul = (event) => {
    const {
      target: { value },
    } = event;
    setFireEquipmentMul(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log("fireEquipmentMul", fireEquipmentMul);
  const language = useSelector((state) => state?.labels.language);

  const token = useSelector((state) => state.user.user.token);

  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    console.log("event4", event, personName);
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
      // value
    );
  };

  const [subVardiType, setSubVardiType] = useState();

  // get Vardi Types
  const getSubVardiTypes = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/subTypeOfVardi/getSubTypeOfVardiMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("sub", res?.data);
        setSubVardiType(res?.data);
      });
  };

  const [fireCrew, setFireCrew] = useState();
  const [crew, setCrew] = useState();

  // get crew
  const getCrew = () => {
    axios
      .get(`${urls.FbsURL}/master/fireCrew/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("11sub", res?.data?.fireCrew);
        setFireCrew(res?.data?.fireCrew);
      });
  };

  console.log("personName", personName);
  // Exit button Routing
  const router = useRouter();

  // const userTemplate = { esname: "", esname: "", esconatact: "" };

  // const { reset } = useFormContext();

  // const {
  //   // control,
  //   // register,
  //   reset,

  //   formState: { errors },
  // } = useFormContext();

  // const [btnSaveText, setBtnSaveText] = useState("Update");

  const [businessTypes, setBusinessTypes] = useState([]);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [fireStation, setfireStation] = useState();
  const [showVardiOther, setShowVardiOther] = useState([]);
  const [showFireOther, setShowFireOther] = useState([]);
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [desg, setDesg] = useState();
  const [thirdCharge, setThirdCharge] = useState([]);

  const [value, setValue2] = React.useState(dayjs("2014-08-18T21:11:54"));
  const [OutsiteArea, setOutsiteArea] = useState([]);
  const [Payment, setPayment] = useState([]);

  const [open, setOpen] = React.useState(true);

  const [standByDuty, setStandByDuty] = React.useState();

  const [menus, subMenus] = React.useState();

  const [lossAmount, setLossAmount] = React.useState();
  const [insurrancePolicy, setInsurrancePolicy] = React.useState();
  const [fireEquipmentsAvailable, setFireEquipmentsAvailable] =
    React.useState();
  const [externalPerson, setExternalPerson] = React.useState();
  const [externalService, setExternalService] = useState();
  const [externalServiceProvided, setExternalServiceProvided] = useState();

  const [disabledFeild, setDisabledFeild] = useState();

  useEffect(() => {
    console.log("123345", router.query.pageMode);
    setDisabledFeild(router.query.pageMode);
  });

  //2-  get fire station name
  const getExternalServices = () => {
    axios
      .get(`${urls.FbsURL}/master/externalService/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("resss", res.data);
        setExternalServiceProvided(res?.data?.externalService);
      });
  };

  console.log("menus", menus);
  console.log("standByDuty", standByDuty);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    getDesg();
    getVardiTypes();
    getFireStation();
    getUser();
    getFireReason();
    getPinCode();
    getServices();
    getChargeRate();
    getCharge();
    getThirdCharge();
    getExternalServices();
    getSubVardiTypes();
    getCrew();
    getVehicleNumber();
  }, []);

  const [charge, setCharge] = useState();

  const getCharge = () => {
    axios
      .get(`${urls.FbsURL}/master/chargeType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("charge", res?.data?.chargeType);
        setCharge(res?.data?.chargeType);
      })
      .catch((err) => console.log(err));
  };

  const [chargeRate, setChargeRate] = useState();

  // Get Charge Rate
  const getChargeRate = () => {
    axios
      .get(`${urls.FbsURL}/chargeTypeRateEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("ch", res?.data?.chargeTypeRate);
        setChargeRate(res?.data?.chargeTypeRate);
      });
  };

  // Get Charge Rate
  const getThirdCharge = () => {
    axios
      .get(`${urls.FbsURL}/mstThirdCharge/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("ch", res?.data?.thirdCharge);
        setThirdCharge(res?.data?.thirdCharge);
      });
  };
  const [services, setServices] = useState();

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setServices(res?.data?.service))
      .catch((error) => console.log(error));
  };

  const [crPincodes, setCrPinCodes] = useState();

  // fetch pin code from cfc
  const getPinCode = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("pin", res?.data?.pinCode);
        setCrPinCodes(res?.data?.pinCode);
      })
      .catch((err) => console.log(err));
  };

  // get Designation from cfc
  const getDesg = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("userDesg", res?.data?.designation);
        setDesg(res?.data?.designation);
      });
  };

  // get employee from cfc
  const getUser = () => {
    axios

      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      // axios.get(`${urls.CFCURL}/auth/getAllUsers`)
      .then((res) => {
        console.log("userEmployee", res?.data?.user);
        setUserLst(res?.data?.user);
        // department: departmentList?.find((d)=>d.id===val.department)?.department,
        // setUserLst(
        //   res.data.map((r, index) => ({
        //     id: r.designation,
        //     // designation: desg?.find((d) => d.id === r.designation)?.r.designation,
        //     designation: desg?.find((d) => d.id === id)?.desg,
        //   }))
        // );
      });
  };

  const [vehicleNumber, setVehicleNumber] = useState();

  // get vehicle number
  const getVehicleNumber = () => {
    axios
      .get(
        `${urls.FbsURL}/VehicleDetailsMasterMaster/getVehicleDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("fi", res.data);

        setVehicleNumber(res?.data);
      });
  };

  // 1- get fire station name
  const getFireStation = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("fi", res.data);

        setfireStation(res?.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("resss", res.data);

        setVardiTypes(res?.data);
      });
  };

  const [reason, setReason] = useState();

  // get reason of fire
  const getFireReason = () => {
    axios
      .get(`${urls.FbsURL}/mstReasonOfFire/get`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setReason(res?.data);
      });
  };

  // setDataSource(
  //   res.data.firstAhawal.externalSupportLst.map((o, i) => {
  //     return {
  //       srNo: i + 1,
  //       ...o,
  //     };
  //   })
  // );
  // const getById = (appId) => {
  //   axios.get(`${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`).then((res) => {

  //     // setValue("firstAhawal.isLossInAmount", router.query?.isLossInAmount == false ? "No" : "Yes");
  //     // setValue("isExternalServiceProvide", router.query?.isExternalServiceProvide == "false" ? "No" : "Yes");
  //     // setValue(
  //     //   "isExternalPersonAddedInDuty",
  //     //   router.query?.isExternalPersonAddedInDuty == "false" ? "No" : "Yes",
  //     // );
  //     // setValue(
  //     //   "isFireEquipmentsAvailable",
  //     //   router.query?.isFireEquipmentsAvailable == "false" ? "No" : "Yes",
  //     // );
  //     // setValue("isLossInAmount", res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No");
  //     // setValue(
  //     //   "isLossInAmount",
  //     //   res.data.firstAhawal.isLossInAmount
  //     // ),
  //     //   setValue(
  //     //     "isExternalServiceProvide",
  //     //     res.data.firstAhawal.isExternalServiceProvide
  //     //   ),
  //     //   setValue(
  //     //     "isExternalPersonAddedInDuty",
  //     //     res.data.firstAhawal.isExternalPersonAddedInDuty
  //     //   ),
  //     //   setValue(
  //     //     "insurancePolicyApplicable",
  //     //     res.data.firstAhawal.insurancePolicyApplicable
  //     //   ),
  //     //   setValue(
  //     //     "isFireEquipmentsAvailable",
  //     //     res.data.firstAhawal.isFireEquipmentsAvailable
  //     //   ),

  //     reset(res.data);
  //     setValue(
  //       "firstAhawal.isLossInAmount",
  //       res?.data?.firstAhawal?.isLossInAmount !== null && res.data.firstAhawal.isLossInAmount == true
  //         ? "Yes"
  //         : "No",
  //     );
  //     setLossAmount(
  //       res?.data?.firstAhawal?.isLossInAmount && res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No",
  //     );

  //     setExternalService(res.data.firstAhawal.isExternalServiceProvide == true ? "Yes" : "No");
  //     setExternalPerson(res.data.firstAhawal.isExternalPersonAddedInDuty == true ? "Yes" : "No");
  //     setInsurrancePolicy(res.data.firstAhawal.insurancePolicyApplicable == true ? "Yes" : "No");
  //     setFireEquipmentsAvailable(res.data.firstAhawal.isFireEquipmentsAvailable == true ? "Yes" : "No");

  //     // fire stations
  //     setFireStationName(
  //       typeof res.data.firstAhawal.fireStations === "string"
  //         ? res.data.firstAhawal.fireStations.split(",")
  //         : value,
  //     );

  //     // fireStationCrews
  //     setFireCrewsMul(
  //       typeof res.data.firstAhawal.fireStationCrews === "string"
  //         ? res.data.firstAhawal.fireStationCrews.split(",")
  //         : value,
  //     );

  //     // // crew- employeeName
  //     setCrewEmployeeName(
  //       typeof res.data.firstAhawal.employeeName === "string"
  //         ? res.data.firstAhawal.employeeName.split(",")
  //         : value,
  //     );

  //     setValue("id", res.data.id);
  //     setValue("firstAhawal", res.data.firstAhawal);
  //     setValue("firstAhawalId", res.data.firstAhawal.id);

  //     // // external - offDutyEmployees
  //     // setExternalEmployee(
  //     //   typeof res.data.firstAhawal.offDutyEmployees === "string"
  //     //     ? res.data.firstAhawal.offDutyEmployees.split(",")
  //     //     : value
  //     // );

  //     // // Fire Equipments
  //     // setFireEquipmentMul(
  //     //   typeof res.data.firstAhawal.fireEquipments === "string"
  //     //     ? res.data.firstAhawal.fireEquipments.split(",")
  //     //     : value
  //     // );

  //     // setValue(
  //     //   "vardiDispatchTime",
  //     //   moment(res.data.firstAhawal.vardiDispatchTime, "HH:mm:ss").format(
  //     //     "HH:mm:ss"
  //     //   )
  //     // );
  //     console.log("666", moment(res.data.firstAhawal.vardiDispatchTime, "HH:mm:ss").format("HH:mm:ss"));
  //   });
  // };

  // const onSubmitForm2 = (formData) => {
  //   if (btnSaveText === "Save") {
  //     const tempData = axios
  //       .post(`${urls.FbsURL}/transaction/trnEmergencyServices/save`, {
  //         formData,
  //         id: null,
  //       })
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //           setFetchData(tempData);
  //           getData();
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(`${urls.FbsURL}/mstReasonOfFire/save`, formData)
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getData();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  // Delete By ID
  const deleteById2 = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(`${urls.FbsURL}/mstReasonOfFire/discard/${value}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };
  console.log("9999999999", getValues("firstAhawal.fireEquipments"));

  const answersString = JSON.stringify(getValues("firstAhawal.fireEquipments"));

  const onSubmitForm = (fromData) => {
    // e.preventDefault();
    // e.stopPropogation();
    console.log("fromData", fromData?.firs);

    let fireEquipmentIds = fireEquipmentMul.map(
      (fire) => names?.find((f) => f?.name == fire)?.id
    );

    console.log("fireEquipmentIds", fireEquipmentIds);

    const formattedData =
      fromData?.firstAhawal?.fireEquipments == ""
        ? ""
        : getValues("firstAhawal.fireEquipments")
            ?.map((item) => `${item.fireEquipments} - ${item.capacity}`)
            ?.join(", ");

    // fromData?.firstAhawal?.fireEquipments == ""
    //   ? []
    //   : getValues("firstAhawal.fireEquipments"),

    let applicationArray =
      fromData?.firstAhawal?.otherEmployeesLst &&
      fromData?.firstAhawal?.otherEmployeesLst?.map((val) => {
        return {
          id: val.id,
          offDutyEmpName: val.offDutyEmpName,
          offDutyEmpNameMr: val.offDutyEmpNameMr,
          offDutyEmpContactNo: val.offDutyEmpContactNo,
          offDutyEmpAddress: val.offDutyEmpAddress,
          offDutyEmpAddressMr: val.offDutyEmpAddressMr,
          firstAhawalId: val.firstAhawalId,
        };
      });
    console.log("applicationArray", getValues("firstAhawal.fireEquipments"));

    const finalBody = {
      role: "VERIFICATION",
      desg: "SUB_FIRE_OFFICER",
      id: router?.query?.id ? router.query.id : null,
      // firstAhawalId: router?.query?.firstAhawalId : null,

      // id: fromData.id,

      firstAhawal: {
        id: router?.query?.firstAhawalId ? router.query.firstAhawalId : null,
        ...fromData.firstAhawal,
        // subTypeOfVardiId: fromData.subTypeOfVardiId,
        // employeeName: ,
        // firstAhawal: "",
        // externalSupportLst: [],

        // vardiDispatchTime: null,
        vardiDispatchTime: moment(
          fromData?.firstAhawal?.vardiDispatchTime
        ).format("HH:mm:ss"),

        // externalSupportLst: extperson,
        // otherEmployeesLst: externalEmp,
        // vehicleEntryLst: vehicle,

        fireEquipments: formattedData,

        externalSupportLst:
          fromData?.firstAhawal?.externalSupportLst == ""
            ? []
            : getValues("firstAhawal.externalSupportLst"),
        // vehicleEntryLst: [],
        vehicleEntryLst: getValues("firstAhawal.vehicleEntryLst")?.map((r) => {
          return {
            inTime:
              r.inTime == ""
                ? null
                : moment(r.inTime, "HH:mm:ss").format("HH:mm:ss"),
            outTime: moment(r.outTime, "HH:mm:ss").format("HH:mm:ss"),
            reachedTime: moment(r.reachedTime, "HH:mm:ss").format("HH:mm:ss"),
            leaveTime: moment(r.leaveTime, "HH:mm:ss").format("HH:mm:ss"),
            distanceTravelledInKms: r.distanceTravelledInKms,
            workDuration: r.workDuration,
            vehicle: r.vehicle,
          };
        }),
        // otherEmployeesLst: [],
        // id: fromData.firstAhawal.id,
        // vardiDispatchTime: moment(fromData.firstAhawal.vardiDispatchTime, "HH:mm:ss").format("HH:mm:ss"),
        // vardiDispatchTime: fromData.vardiDispatchTime
        //   ? moment(fromData.vardiDispatchTime).format("HH:mm:ss")
        //   : null,

        // vardiDispatchTime: moment(fromData.vardiDispatchTime, "HH:mm:ss").format("HH:mm:ss"),
        otherEmployeesLst: applicationArray,
        // otherEmployeesLst: getValues("firstAhawal.otherEmployeesLst"),
        isLossInAmount:
          fromData.firstAhawal.isLossInAmount == "No" ? false : true,
        isExternalServiceProvide:
          fromData.firstAhawal.isExternalServiceProvide == "No" ? false : true,
        // isExternalPersonAddedInDuty: externalPerson == "No" ? false : true,
        isExternalPersonAddedInDuty:
          fromData.firstAhawal.isExternalPersonAddedInDuty == "No"
            ? false
            : true,
        insurancePolicyApplicable:
          fromData.firstAhawal.insurancePolicyApplicable == "No" ? false : true,

        isFireEquipmentsAvailable:
          fromData.firstAhawal.isFireEquipmentsAvailable == "No" ? false : true,

        // fireStations: fireStationName.toString(),

        // fireStations: fireStationName
        //   .map((r) => fireStation.find((fire) => fire.fireStationName == r)?.id)
        //   .toString(),

        // // fireStationCrews: fireCrewsMul.toString(),
        // fireStationCrews: fireCrewsMul.map((r) => fireCrew.find((crew) => crew.crewName == r)?.id).toString(),

        // // Crew - EmployeeName
        // // employeeName: crewEmployeeName.toString(),

        // employeeName: crewEmployeeName
        //   .map(
        //     (r) =>
        //       userLst.find((user) => user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn == r)
        //         ?.id,
        //   )
        //   .toString(),

        // external employee Name
        // offDutyEmployees: externalEmployee.toString(),

        offDutyEmployees: externalEmployee
          .map(
            (r) =>
              userLst.find(
                (user) =>
                  user.firstNameEn +
                    " " +
                    user.middleNameEn +
                    " " +
                    user.lastNameEn ==
                  r
              )?.id
          )
          .toString(),

        // fireEquipments: fireEquipmentIds.toString(),

        // fireEquipments:
        //   fromData?.finalAhawal?.fireEquipments +
        //   "-" +
        //   fromData?.finalAhawal?.capacity,
        // departureTime: null,
        dateAndTimeOfVardi: moment(fromData?.dateAndTimeOfVardi).format(
          "YYYY-MM-DDThh:mm:ss"
        ),
      },
      // rescueVardi: personName,

      // application date
      // dateAndTimeOfVardi: moment(
      //   r.dateAndTimeOfVardi,
      //   "YYYY-MM-DDTHH:mm:ss"
      // ).format("YYYY-MM-DDTHH:mm:ss"),

      // role: "VERIFICATION",
      // desg: "SUB_FIRE_OFFICER",
    };

    console.log("finalBody7777", finalBody);

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              fromData.id
                ? sweetAlert(
                    "Complete!",
                    "Action Completed successfully !",
                    "success"
                  )
                : sweetAlert(
                    "Saved!",
                    "Record Saved successfully !",
                    "success"
                  );
              router.back();
            }
          });
      }
    });
  };

  useEffect(() => {
    console.log("000000", props?.props?.pageMode);
    if (props?.props?.applicationDataId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${props?.props?.applicationDataId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            console.log("6666", res.data?.firstAhawal);
            reset(res?.data);

            // set Multiselect dropdown
            let offdutyemps = res.data.firstAhawal?.offDutyEmployees.split(",");
            let gg;
            console.log("offdutyemps", offdutyemps);
            if (offdutyemps?.length > 1) {
              gg = offdutyemps.map((r, i) => {
                userLst.filter((user) => {
                  if (user.id == r) {
                    // return user.firstNameEn;

                    console.log("user.firstNameEn", user);
                    (typeof user.firstNameEn === "string" && user.firstNameEn) +
                      " " +
                      (typeof user.middleNameEn === "string"
                        ? user.middleNameEn
                        : " ") +
                      " " +
                      (typeof user.lastNameEn === "string" && user.lastNameEn);
                  }
                });
              });
            } else {
              console.log("zero");
              gg = userLst
                .filter(
                  (user) =>
                    // {
                    // if(offdutyemps[0]==user.id){
                    offdutyemps[0] == user.id
                  // return user.firstNameEn;
                  // (typeof user.firstNameEn === "string" && user.firstNameEn) +
                  // " " +
                  // (typeof user.middleNameEn === "string" ? user.middleNameEn : " ") +
                  // " " +
                  // (typeof user.lastNameEn === "string" && user.lastNameEn)
                )
                .map((user) => user.firstNameEn);
            }
            console.log("extempsss", gg);
            setExternalEmployee(gg);
            // end- set Multiselect dropdown

            //New Added
            // res?.data?.firstAhawal?.offDutyEmployees?.forEach(
            //   (val, index) => {
            //     console.log("val3333", val)
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpName`,
            //       val?.equipmentKey
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpAddress`,
            //       val?.rate
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpContactNo`,
            //       val?.quantity
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpAddressMr`,
            //       val?.total
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpNameMr`,
            //       val?.total
            //     );
            //     if (
            //       !(
            //         index + 1 ===
            //         res?.data?.firstAhawal?.offDutyEmployees?.length
            //       )
            //     ) {
            //       appendUI();
            //     }
            //   }
            // );

            // // only number set
            // setFireEquipmentMul(
            //   typeof res.data.firstAhawal.fireEquipments === "string"
            //     ? res.data.firstAhawal.fireEquipments.split(",")
            //     : value
            // );

            // let fireEqi =
            //   typeof res.data.firstAhawal.fireEquipments === "string"
            //     ? res.data.firstAhawal.fireEquipments.split(",")
            //     : "-";

            // let fireEquipmentName = fireEqi.map(
            //   (fire) => names.find((f) => f.id == fire)?.name
            // );

            // console.log("fireEquipmentName", fireEquipmentName);

            // name set
            // setFireEquipmentMul(fireEquipmentName);

            console.log(
              "12345",
              typeof res.data.firstAhawal.fireEquipments === "string"
                ? res.data.firstAhawal.fireEquipments.split(",")
                : value
            );
            // set- Fire Equipment
            // let fireEquipmentsList = res?.data?.firstAhawal?.fireEquipments;
            // let List;
            // console.log("lst", List);
            // if (fireEquipmentsList?.length > 1) {
            //   console.log("non-zero", fireEquipmentsList);
            //   List = names.map((r, i) => {
            //     if (user.id == r) {
            //       return r.name;
            //     }
            //   });
            // } else {
            //   console.log("zero");
            // }
            // console.log("extempsss", List);
            // setValue("firstAhawal.externalSupportLst", List);
            // end - usefeild array

            setLossAmount(
              res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No"
            );
            setExternalService(
              res.data.firstAhawal.isExternalServiceProvide == true
                ? "Yes"
                : "No"
            );
            setExternalPerson(
              res.data.firstAhawal.isExternalPersonAddedInDuty == true
                ? "Yes"
                : "No"
            );
            setInsurrancePolicy(
              res.data.firstAhawal.insurancePolicyApplicable == true
                ? "Yes"
                : "No"
            );
            setFireEquipmentsAvailable(
              res.data.firstAhawal.isFireEquipmentsAvailable == true
                ? "Yes"
                : "No"
            );

            // setSelectedModuleName(r?.data?.applications);
            let otherEmployeesList =
              res?.data?.firstAhawal &&
              res?.data?.firstAhawal?.map((val, index) => {
                console.log("value33", val);
                return {
                  id: val.id,
                  offDutyEmpName: val.offDutyEmpName,
                  offDutyEmpNameMr: val.offDutyEmpNameMr,
                  offDutyEmpContactNo: val.offDutyEmpContactNo,
                  offDutyEmpAddress: val.offDutyEmpAddress,
                  offDutyEmpAddressMr: val.offDutyEmpAddressMr,
                  firstAhawalId: val.firstAhawalId,
                };
              });
            setValue("otherEmployeesLst", otherEmployeesList);

            console.log("otherEmployeesList", otherEmployeesList);

            // setFireEquipmentMul(r?.data?.firstAhawal?.fireEquipments);

            console.log(
              "officeDepartmentDesignationUserDaoLst43434",
              res?.data
            );

            setExternalEmployee(
              res?.data?.firstAhawal?.offDutyEmployees.map(
                (rec) => userLst?.find((user) => user.id == rec)?.firstNameEn
              )
            );

            setValue(
              "firstAhawal.vardiDispatchTime",
              res?.data?.firstAhawal?.vardiDispatchTime
              // moment(r?.data?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format("hh:mm:ss"),
              // moment(r?.data?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format("hh:mm:ss"),
            );

            setValue(
              "subTypeOfVardiId",
              res?.data?.firstAhawal?.subTypeOfVardiId
            );

            // getById
            // setValue(
            //   "firstAhawal.isLossInAmount",
            //   res?.data?.firstAhawal?.isLossInAmount !== null && res.data.firstAhawal.isLossInAmount == true
            //     ? "Yes"
            //     : "No",
            // );
            setLossAmount(
              res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No"
            );
            setExternalService(
              res.data.firstAhawal.isExternalServiceProvide == true
                ? "Yes"
                : "No"
            );
            setExternalPerson(
              res.data.firstAhawal.isExternalPersonAddedInDuty == true
                ? "Yes"
                : "No"
            );
            setInsurrancePolicy(
              res.data.firstAhawal.insurancePolicyApplicable == true
                ? "Yes"
                : "No"
            );
            setFireEquipmentsAvailable(
              res.data.firstAhawal.isFireEquipmentsAvailable == true
                ? "Yes"
                : "No"
            );

            // fire stations
            setFireStationName(
              typeof res.data.firstAhawal.fireStations === "string"
                ? res.data.firstAhawal.fireStations.split(",")
                : value
            );

            // fireStationCrews
            setFireCrewsMul(
              typeof res.data.firstAhawal.fireStationCrews === "string"
                ? res.data.firstAhawal.fireStationCrews.split(",")
                : value
            );

            // // crew- employeeName
            setCrewEmployeeName(
              typeof res.data.firstAhawal.employeeName === "string"
                ? res.data.firstAhawal.employeeName.split(",")
                : value
            );

            setValue("id", res.data.id);
            setValue("firstAhawal", res.data.firstAhawal);
            setValue("firstAhawalId", res.data.firstAhawal.id);

            // reset(r?.data);
          }
        })
        .catch((err) => {
          console.log("errApplication", err);
        });
    }

    console.log("router.query", props?.props?.applicationDataId);
    // if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
    //   console.log("hello", router.query?.isLossInAmount);
    // reset(router.query);
    // getById(router.query.id);

    // if (router.query.mode == "edit") {

    if (router?.query?.id) {
      axios
        .get(
          `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            console.log("6666", res.data?.firstAhawal);
            reset(res?.data);

            // set Multiselect dropdown
            let offdutyemps = res.data.firstAhawal?.offDutyEmployees.split(",");
            let gg;
            console.log("offdutyemps", offdutyemps);
            if (offdutyemps?.length > 1) {
              gg = offdutyemps.map((r, i) => {
                userLst.filter((user) => {
                  if (user.id == r) {
                    // return user.firstNameEn;

                    console.log("user.firstNameEn", user);
                    (typeof user.firstNameEn === "string" && user.firstNameEn) +
                      " " +
                      (typeof user.middleNameEn === "string"
                        ? user.middleNameEn
                        : " ") +
                      " " +
                      (typeof user.lastNameEn === "string" && user.lastNameEn);
                  }
                });
              });
            } else {
              console.log("zero");
              gg = userLst
                .filter(
                  (user) =>
                    // {
                    // if(offdutyemps[0]==user.id){
                    offdutyemps[0] == user.id
                  // return user.firstNameEn;
                  // (typeof user.firstNameEn === "string" && user.firstNameEn) +
                  // " " +
                  // (typeof user.middleNameEn === "string" ? user.middleNameEn : " ") +
                  // " " +
                  // (typeof user.lastNameEn === "string" && user.lastNameEn)
                )
                .map((user) => user.firstNameEn);
            }
            console.log("extempsss", gg);
            setExternalEmployee(gg);
            // end- set Multiselect dropdown

            //New Added
            // res?.data?.firstAhawal?.offDutyEmployees?.forEach(
            //   (val, index) => {
            //     console.log("val3333", val)
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpName`,
            //       val?.equipmentKey
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpAddress`,
            //       val?.rate
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpContactNo`,
            //       val?.quantity
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpAddressMr`,
            //       val?.total
            //     );
            //     setValue(
            //       `firstAhawal.otherEmployeesLst[${index}].offDutyEmpNameMr`,
            //       val?.total
            //     );
            //     if (
            //       !(
            //         index + 1 ===
            //         res?.data?.firstAhawal?.offDutyEmployees?.length
            //       )
            //     ) {
            //       appendUI();
            //     }
            //   }
            // );

            // // only number set
            // setFireEquipmentMul(
            //   typeof res.data.firstAhawal.fireEquipments === "string"
            //     ? res.data.firstAhawal.fireEquipments.split(",")
            //     : value
            // );

            let fireEqi =
              typeof res.data.firstAhawal.fireEquipments === "string"
                ? res.data.firstAhawal.fireEquipments.split(",")
                : "-";

            let fireEquipmentName = fireEqi.map(
              (fire) => names.find((f) => f.id == fire)?.name
            );

            console.log("fireEquipmentName", fireEquipmentName);

            // name set
            setFireEquipmentMul(fireEquipmentName);

            console.log(
              "12345",
              typeof res.data.firstAhawal.fireEquipments === "string"
                ? res.data.firstAhawal.fireEquipments.split(",")
                : value
            );
            // set- Fire Equipment
            // let fireEquipmentsList = res?.data?.firstAhawal?.fireEquipments;
            // let List;
            // console.log("lst", List);
            // if (fireEquipmentsList?.length > 1) {
            //   console.log("non-zero", fireEquipmentsList);
            //   List = names.map((r, i) => {
            //     if (user.id == r) {
            //       return r.name;
            //     }
            //   });
            // } else {
            //   console.log("zero");
            // }
            // console.log("extempsss", List);
            // setValue("firstAhawal.externalSupportLst", List);
            // end - usefeild array

            setLossAmount(
              res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No"
            );
            setExternalService(
              res.data.firstAhawal.isExternalServiceProvide == true
                ? "Yes"
                : "No"
            );
            setExternalPerson(
              res.data.firstAhawal.isExternalPersonAddedInDuty == true
                ? "Yes"
                : "No"
            );
            setInsurrancePolicy(
              res.data.firstAhawal.insurancePolicyApplicable == true
                ? "Yes"
                : "No"
            );
            setFireEquipmentsAvailable(
              res.data.firstAhawal.isFireEquipmentsAvailable == true
                ? "Yes"
                : "No"
            );

            // setSelectedModuleName(r?.data?.applications);
            let otherEmployeesList =
              res?.data?.firstAhawal &&
              res?.data?.firstAhawal?.map((val, index) => {
                console.log("value33", val);
                return {
                  id: val.id,
                  offDutyEmpName: val.offDutyEmpName,
                  offDutyEmpNameMr: val.offDutyEmpNameMr,
                  offDutyEmpContactNo: val.offDutyEmpContactNo,
                  offDutyEmpAddress: val.offDutyEmpAddress,
                  offDutyEmpAddressMr: val.offDutyEmpAddressMr,
                  firstAhawalId: val.firstAhawalId,
                };
              });
            setValue("otherEmployeesLst", otherEmployeesList);

            console.log("otherEmployeesList", otherEmployeesList);

            // setFireEquipmentMul(r?.data?.firstAhawal?.fireEquipments);

            console.log(
              "officeDepartmentDesignationUserDaoLst43434",
              res?.data
            );

            setExternalEmployee(
              res?.data?.firstAhawal?.offDutyEmployees.map(
                (rec) => userLst?.find((user) => user.id == rec)?.firstNameEn
              )
            );

            setValue(
              "firstAhawal.vardiDispatchTime",
              res?.data?.firstAhawal?.vardiDispatchTime
              // moment(r?.data?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format("hh:mm:ss"),
              // moment(r?.data?.firstAhawal?.vardiDispatchTime, "hh:mm:ss").format("hh:mm:ss"),
            );

            setValue(
              "subTypeOfVardiId",
              res?.data?.firstAhawal?.subTypeOfVardiId
            );

            // getById
            // setValue(
            //   "firstAhawal.isLossInAmount",
            //   res?.data?.firstAhawal?.isLossInAmount !== null && res.data.firstAhawal.isLossInAmount == true
            //     ? "Yes"
            //     : "No",
            // );
            setLossAmount(
              res.data.firstAhawal.isLossInAmount == true ? "Yes" : "No"
            );
            setExternalService(
              res.data.firstAhawal.isExternalServiceProvide == true
                ? "Yes"
                : "No"
            );
            setExternalPerson(
              res.data.firstAhawal.isExternalPersonAddedInDuty == true
                ? "Yes"
                : "No"
            );
            setInsurrancePolicy(
              res.data.firstAhawal.insurancePolicyApplicable == true
                ? "Yes"
                : "No"
            );
            setFireEquipmentsAvailable(
              res.data.firstAhawal.isFireEquipmentsAvailable == true
                ? "Yes"
                : "No"
            );

            // fire stations
            setFireStationName(
              typeof res.data.firstAhawal.fireStations === "string"
                ? res.data.firstAhawal.fireStations.split(",")
                : value
            );

            // fireStationCrews
            setFireCrewsMul(
              typeof res.data.firstAhawal.fireStationCrews === "string"
                ? res.data.firstAhawal.fireStationCrews.split(",")
                : value
            );

            // // crew- employeeName
            setCrewEmployeeName(
              typeof res.data.firstAhawal.employeeName === "string"
                ? res.data.firstAhawal.employeeName.split(",")
                : value
            );

            setValue("id", res.data.id);
            setValue("firstAhawal", res.data.firstAhawal);
            setValue("firstAhawalId", res.data.firstAhawal.id);

            // reset(r?.data);
          }
        })
        .catch((err) => {
          console.log("errApplication", err);
        });
    }
    // setValue("otherEmployeesLst");
    // typeOfVardiId(router.query.typeOfVardiId);

    // subTypeOfVardi(router.query.subTypeOfVardi);
    // }
  }, []);

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };
  // Reset Values Cancell
  const resetValuesCancell = {
    serviceName: "",
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    contactNumber: "",
    mailID: "",
    vardiPlace: "",
    vardiPlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
    employeeShiftID: "",
    reasonOfFire: "",
    firedThingsDuringAccuse: "",
    lossInAmount: "",
    insurancePolicyDetails: "",
    fireEquipments: "",
    manPowerLoss: "",
    employeeDetailsDuringFireWorks: "",
    chargesCollected: "",
    billPayerDetails: "",
    nameOfSubFireOfficer: "",
    nameOfMainFireOfficer: "",
    typeOfVardiOther: "",
    reasonOfFireOther: "",
  };

  // View
  return (
    <Box
      style={{
        margin: "4%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {router?.query?.pageMode == "display" ||
      router?.query?.pageMode == "Edit" ||
      router?.query?.pageMode == "View" ||
      props?.props?.pageMode == "Edit" ? (
        <></>
      ) : (
        <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
          <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  color: "#2980B9",
                }}
              >
                <ArrowBackIcon
                  onClick={() =>
                    router.push({
                      pathname: "/FireBrigadeSystem/transactions/firstAhawal",
                    })
                  }
                />
              </IconButton>

              <Typography
                sx={{
                  textAlignVertical: "center",
                  textAlign: "center",
                  color: "rgb(7 110 230 / 91%)",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  typography: {
                    xs: "body1",
                    sm: "h6",
                    md: "h5",
                    lg: "h4",
                    xl: "h3",
                  },
                }}
              >
                {<FormattedLabel id="emergencyServicesFirstVardiAhawal" />}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      )}

      <Paper
        sx={{
          margin: 1,
          padding: 2,
          backgroundColor: "#F5F5F5",
        }}
        elevation={5}
      >
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="informerDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <Transliteration
                      // disabled={disabledFeild == "View"}
                      sx={{ width: "90%" }}
                      variant={"outlined"}
                      _key={"vardiSlip.informerName"}
                      labelName={"vardiSlip.informerName"}
                      fieldName={"vardiSlip.informerName"}
                      updateFieldName={"vardiSlip.informerNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerName" required />}
                      error={errors?.vardiSlip?.informerName}
                      helperText={
                        errors?.vardiSlip?.informerName
                          ? errors?.vardiSlip?.informerName?.message
                          : null
                      }
                    />
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerName' />}
                      variant='standard'
                      {...register("informerName")}
                      error={errors.informerName}
                      helperText={
                        errors?.informerName
                          ? errors.informerName.message
                          : null
                      }
                    /> */}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerMiddleName' />}
                      variant='standard'
                      {...register("informerMiddleName")}
                      error={errors.informerMiddleName}
                      helperText={
                        errors?.informerMiddleName
                          ? errors.informerMiddleName.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.informerMiddleName"}
                      labelName={"vardiSlip.informerMiddleName"}
                      fieldName={"vardiSlip.informerMiddleName"}
                      updateFieldName={"vardiSlip.informerMiddleNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerMiddleName" required />
                      }
                      error={errors?.vardiSlip?.informerMiddleName}
                      helperText={
                        errors?.vardiSlip?.informerMiddleName
                          ? errors?.vardiSlip?.informerMiddleName?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerLastName' />}
                      variant='standard'
                      {...register("informerLastName")}
                      error={errors.informerLastName}
                      helperText={
                        errors?.informerLastName
                          ? errors.informerLastName.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.informerLastName"}
                      labelName={"vardiSlip.informerLastName"}
                      fieldName={"vardiSlip.informerLastName"}
                      updateFieldName={"vardiSlip.informerLastNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerLastName" required />}
                      error={errors?.vardiSlip?.informerLastName}
                      helperText={
                        errors?.vardiSlip?.informerLastName
                          ? errors?.vardiSlip?.informerLastName?.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerNameMr' />}
                      variant='standard'
                      {...register("informerNameMr")}
                      error={errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.informerNameMr"}
                      labelName={"vardiSlip.informerNameMr"}
                      fieldName={"vardiSlip.informerNameMr"}
                      updateFieldName={"informerName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerNameMr" required />}
                      error={errors?.vardiSlip?.informerNameMr}
                      helperText={
                        errors?.vardiSlip?.informerNameMr
                          ? errors?.vardiSlip?.informerNameMr?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerMiddleNameMr' />}
                      variant='standard'
                      {...register("informerMiddleNameMr")}
                      error={errors.informerMiddleNameMr}
                      helperText={
                        errors?.informerMiddleNameMr
                          ? errors.informerMiddleNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.informerMiddleNameMr"}
                      labelName={"vardiSlip.informerMiddleNameMr"}
                      fieldName={"vardiSlip.informerMiddleNameMr"}
                      updateFieldName={"vardiSlip.informerMiddleName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerMiddleNameMr" required />
                      }
                      error={errors?.vardiSlip?.informerMiddleNameMr}
                      helperText={
                        errors?.vardiSlip?.informerMiddleNameMr
                          ? errors?.vardiSlip?.informerMiddleNameMr?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerLastNameMr' />}
                      variant='standard'
                      {...register("informerLastNameMr")}
                      error={errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.informerLastNameMr"}
                      labelName={"vardiSlip.informerLastNameMr"}
                      fieldName={"vardiSlip.informerLastNameMr"}
                      updateFieldName={"vardiSlip.informerLastName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerLastNameMr" required />
                      }
                      error={errors?.vardiSlip?.informerLastNameMr}
                      helperText={
                        errors?.vardiSlip?.informerLastNameMr
                          ? errors?.vardiSlip?.informerLastNameMr?.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={3}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='area' />}
                      variant='standard'
                      {...register("area")}
                      error={errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.area"}
                      labelName={"vardiSlip.area"}
                      fieldName={"vardiSlip.area"}
                      updateFieldName={"vardiSlip.areaMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="area" required />}
                      error={errors?.vardiSlip?.area}
                      helperText={
                        errors?.vardiSlip?.area
                          ? errors?.vardiSlip?.area?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='city' />}
                      incode
                      variant='standard'
                      {...register("city")}
                      error={errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"vardiSlip.city"}
                      labelName={"vardiSlip.city"}
                      fieldName={"vardiSlip.city"}
                      updateFieldName={"vardiSlip.cityMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="city" required />}
                      error={errors?.vardiSlip?.city}
                      helperText={
                        errors?.vardiSlip?.city
                          ? errors?.vardiSlip?.city?.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: "true",
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" />}
                      variant="outlined"
                      {...register("vardiSlip.mailID")}
                      error={errors?.vardiSlip?.mailID}
                      helperText={
                        errors?.vardiSlip?.mailID
                          ? errors?.vardiSlip?.mailID?.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='areaMr' />}
                      variant='standard'
                      {...register("areaMr")}
                      error={errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"areaMr"}
                      labelName={"vardiSlip.areaMr"}
                      fieldName={"vardiSlip.areaMr"}
                      updateFieldName={"vardiSlip.area"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="areaMr" required />}
                      error={errors?.vardiSlip?.areaMr}
                      helperText={
                        errors?.vardiSlip?.areaMr
                          ? errors?.vardiSlip?.areaMr?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='cityMr' />}
                      variant='standard'
                      {...register("cityMr")}
                      error={errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"cityMr"}
                      labelName={"vardiSlip.cityMr"}
                      fieldName={"vardiSlip.cityMr"}
                      updateFieldName={"vardiSlip.city"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="cityMr" required />}
                      error={errors?.vardiSlip?.cityMr}
                      helperText={
                        errors?.vardiSlip?.cityMr
                          ? errors?.vardiSlip?.cityMr?.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="contactNumber" />}
                      variant="outlined"
                      {...register("vardiSlip.contactNumber")}
                      error={errors?.vardiSlip?.contactNumber}
                      helperText={
                        errors?.vardiSlip?.contactNumber
                          ? errors?.vardiSlip?.contactNumber?.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="vardiDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlace' />}
                      variant='standard'
                      {...register("vardiSlip.vardiPlace")}
                      error={errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    /> */}
                    <Transliteration
                      // sx={{ width: "90%" }}
                      variant={"outlined"}
                      _key={"vardiSlip.vardiPlace"}
                      labelName={"vardiSlip.vardiPlace"}
                      fieldName={"vardiSlip.vardiPlace"}
                      updateFieldName={"vardiSlip.vardiPlaceMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="occurancePlace" required />}
                      error={errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlaceMr' />}
                      variant='standard'
                      {...register("vardiSlip.vardiPlaceMr")}
                      error={errors.vardiPlaceMr}
                      helperText={
                        errors?.vardiPlaceMr
                          ? errors.vardiPlaceMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      sx={{ width: "90%" }}
                      variant={"outlined"}
                      _key={"vardiSlip.vardiPlaceMr"}
                      labelName={"vardiSlip.vardiPlaceMr"}
                      fieldName={"vardiSlip.vardiPlaceMr"}
                      updateFieldName={"vardiSlip.vardiPlace"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="occurancePlaceMr" required />}
                      error={errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    />
                  </Grid>
                  {console.log(
                    "router?.query?.pageMode",
                    router?.query?.pageMode
                  )}

                  <Grid item xs={4} className={styles.feildres}>
                    {router?.query?.pageMode == "display" ||
                    // router?.query?.pageMode == "Edit" ||
                    router?.query?.pageMode == "View" ||
                    props?.props?.pageMode == "Edit" ? (
                      <></>
                    ) : (
                      <>
                        <FormControl
                          error={errors?.firstAhawal?.vardiDispatchTime}
                          sx={{ width: "1000%" }}
                        >
                          <Controller
                            control={control}
                            defaultValue={null}
                            name="firstAhawal.vardiDispatchTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  ampm={false}
                                  openTo="hours"
                                  views={["hours", "minutes", "seconds"]}
                                  inputFormat="HH:mm:ss"
                                  mask="__:__:__"
                                  label="Vardi Dispatch Time"
                                  value={field.value}
                                  onChange={(time) => {
                                    field.onChange(time);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{
                                        width: "90%",
                                        backgroundColor: "white",
                                      }}
                                      size="small"
                                      {...params}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.firstAhawal?.vardiDispatchTime
                              ? errors.firstAhawal?.vardiDispatchTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}

                    {/* <FormControl style={{ marginTop: 10 }} error={errors.vardiDispatchTime}>
                      <Controller
                        format="HH:mm:ss"
                        control={control}
                        name="vardiDispatchTime"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              label={<span style={{ fontSize: 16 }}>From Time</span>}
                              value={field.value}
                              onChange={(time) => {
                                moment(field.onChange(time), "HH:mm:ss a").format("HH:mm:ss a");
                              }}
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
                        {errors?.vardiDispatchTime ? errors.vardiDispatchTime.message : null}
                      </FormHelperText>
                    </FormControl> */}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmark' />}
                      variant='standard'
                      {...register("vardiSlip.landmark")}
                      error={errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    /> */}
                    <Transliteration
                      sx={{ width: "90%" }}
                      variant={"outlined"}
                      _key={"vardiSlip.landmark"}
                      labelName={"vardiSlip.landmark"}
                      fieldName={"vardiSlip.landmark"}
                      updateFieldName={"vardiSlip.landmarkMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="landmark" required />}
                      error={errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmarkMr' />}
                      variant='standard'
                      {...register("vardiSlip.landmarkMr")}
                      error={errors.landmarkMr}
                      helperText={
                        errors?.landmarkMr ? errors.landmarkMr.message : null
                      }
                    /> */}
                    <Transliteration
                      sx={{ width: "90%" }}
                      variant={"outlined"}
                      _key={"vardiSlip.landmarkMr"}
                      labelName={"vardiSlip.landmarkMr"}
                      fieldName={"vardiSlip.landmarkMr"}
                      updateFieldName={"vardiSlip.landmark"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="landmarkMr" required />}
                      error={errors.landmarkMr}
                      helperText={
                        errors?.landmarkMr ? errors.landmarkMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{
                        marginTop: "6%",
                        minWidth: "100%",
                      }}
                      variant="outlined"
                      error={errors.typeOfVardiId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="typeOfVardiIdF" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "white",
                            }}
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setShowVardiOther(value.target.value);
                            }}
                            label="Type of Vardi"
                          >
                            {vardiTypes &&
                              vardiTypes.map((vardi, index) => (
                                <MenuItem key={index} value={vardi.id}>
                                  {language == "en"
                                    ? vardi.vardiName
                                    : vardi.vardiNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="vardiSlip.typeOfVardiId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId
                          ? errors.typeOfVardiId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{
                        marginTop: "6%",
                        minWidth: "100%",
                      }}
                      variant="outlined"
                      error={errors.typeOfVardiId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subTypesOfVardi" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "white",
                            }}
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                            label="Sub Type Of Vardi"
                          >
                            <MenuItem value="01">
                              <em>
                                {language == "en" ? "None" : "काहीही नाही"}
                              </em>
                            </MenuItem>
                            {subVardiType &&
                              subVardiType
                                // .filter((u) => u.vardiTypeId == showVardiOther)
                                .map((vardi, index) => (
                                  <MenuItem key={index} value={vardi.id}>
                                    {language == "en"
                                      ? vardi.subVardiName
                                      : vardi.subVardiNameMr}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="firstAhawal.subTypeOfVardiId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.firstAhawal?.subTypeOfVardiId
                          ? errors.firstAhawal?.subTypeOfVardiId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {showVardiOther == 14 && (
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        sx={{
                          marginTop: "5%",
                          width: "100%",
                          backgroundColor: "white",
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="otherVardiType" />}
                        {...register("vardiSlip.otherVardiType")}
                        error={errors.otherVardiType}
                        helperText={
                          errors?.otherVardiType
                            ? errors.otherVardiType.message
                            : null
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: "100%",
                      }}
                      variant="outlined"
                      error={errors.reasonOfFire}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="reasonOfFire" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "white",
                            }}
                            value={field.value}
                            // onChange={(value) => field.onChange(value)}
                            onChange={(value) => {
                              console.log("value9090", value.target.value);
                              field.onChange(value);
                              setShowFireOther(value.target.value);
                            }}
                            label={<FormattedLabel id="reasonOfFire" />}
                          >
                            {reason &&
                              reason.map((res, index) => (
                                <MenuItem key={index} value={res.id}>
                                  {language == "en"
                                    ? res.reasonOfFire
                                    : res.reasonOfFireMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="firstAhawal.reasonOfFire"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.reasonOfFire
                          ? errors.reasonOfFire.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {showFireOther == 9 && (
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        sx={{
                          width: "100%",
                          backgroundColor: "white",
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        defaultValue={null}
                        label={<FormattedLabel id="otherReasonOfFire" />}
                        {...register("firstAhawal.otherReasonOfFire")}
                        error={errors.otherReasonOfFire}
                        helperText={
                          errors?.otherReasonOfFire
                            ? errors.otherReasonOfFire.message
                            : null
                        }
                      />
                    )}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: "100%",
                        marginTop: "5%",
                      }}
                      variant="outlined"
                      error={errors.nameOfSubFireOfficer}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Name of Subfire Officer/Station Officer */}
                        {<FormattedLabel id="nameOfSubFireOfficer" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "white",
                            }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="nameOfSubFireOfficer" />}
                          >
                            {/* {userLst &&
                              userLst
                                .filter((u) => u.desg === "SFO")
                                .map((user, index) => (
                                  <MenuItem key={index} value={user.id}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName
                                        : " ") +
                                      " " +
                                      user.lastName}
                                  </MenuItem>
                                ))} */}
                            {userLst &&
                              userLst
                                // .filter((u) => u.designation == 39)
                                .filter(
                                  (u) => u.id == 40 || u.id == 41 || u.id == 42
                                )
                                .map((user, index) => (
                                  <MenuItem
                                    key={index}
                                    value={user.id}
                                    sx={{
                                      display:
                                        typeof user.firstNameEn === "string"
                                          ? "flex"
                                          : "none",
                                    }}
                                  >
                                    {(typeof user.firstNameEn === "string" &&
                                      user.firstNameEn) +
                                      " " +
                                      (typeof user.middleNameEn === "string"
                                        ? user.middleNameEn
                                        : " ") +
                                      " " +
                                      (typeof user.lastNameEn === "string" &&
                                        user.lastNameEn)}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="firstAhawal.nameOfSubFireOfficer"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.nameOfSubFireOfficer
                          ? errors.nameOfSubFireOfficer.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {" "}
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: "100%",
                        marginTop: "5%",
                      }}
                      variant="outlined"
                      error={errors.nameOfMainFireOfficer}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Name of main Fire Officer */}
                        {<FormattedLabel id="nameOfMainFireOfficer" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{
                              backgroundColor: "white",
                            }}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={
                              <FormattedLabel id="nameOfMainFireOfficer" />
                            }
                          >
                            {userLst &&
                              userLst
                                // .filter((u) => u.designation == 40)
                                .filter(
                                  (u) => u.id == 40 || u.id == 41 || u.id == 42
                                )
                                .map((user, index) => (
                                  <MenuItem
                                    key={index}
                                    value={user.id}
                                    sx={{
                                      display:
                                        typeof user.firstNameEn === "string"
                                          ? "flex"
                                          : "none",
                                    }}
                                  >
                                    {(typeof user.firstNameEn === "string" &&
                                      user.firstNameEn) +
                                      " " +
                                      (typeof user.middleNameEn === "string"
                                        ? user.middleNameEn
                                        : " ") +
                                      " " +
                                      (typeof user.lastNameEn === "string" &&
                                        user.lastNameEn)}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="firstAhawal.nameOfMainFireOfficer"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.nameOfMainFireOfficer
                          ? errors.nameOfMainFireOfficer.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="isTenantHaveAnyLoss" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isLossInAmount"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={<Radio checked={lossAmount == "Yes"} />}
                              label={<FormattedLabel id="yes" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setLossAmount(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio checked={lossAmount == "No"} />}
                              label={<FormattedLabel id="no" />}
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setLossAmount(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {lossAmount == "Yes" ? (
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        InputLabelProps={{
                          shrink: true,
                        }}
                        size="small"
                        sx={{
                          backgroundColor: "white",
                          minWidth: "100%",
                          marginTop: "5%",
                        }}
                        variant="outlined"
                        label={<FormattedLabel id="lossInAmount" />}
                        {...register("firstAhawal.lossInAmount")}
                        error={errors.lossInAmount}
                        helperText={
                          errors?.lossInAmount
                            ? errors.lossInAmount.message
                            : null
                        }
                      />
                    </Grid>
                  ) : (
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  )}

                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                {/* 
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id="paymentDetails" />}
                    </h3>
                  </div>
                </div>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerName" />}
                      variant="standard"
                      {...register("billPayerName")}
                      error={errors.billPayerName}
                      helperText={
                        errors?.billPayerName
                          ? errors.billPayerName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayeraddress" />}
                      variant="standard"
                      {...register("billPayeraddress")}
                      error={errors.billPayeraddress}
                      helperText={
                        errors?.billPayeraddress
                          ? errors.billPayeraddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerContact" />}
                      variant="standard"
                      {...register("billPayerContact")}
                      error={errors.billPayerContact}
                      helperText={
                        errors?.billPayerContact
                          ? errors.billPayerContact.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerNameMr" />}
                      variant="standard"
                      {...register("billPayerNameMr")}
                      error={errors.billPayerNameMr}
                      helperText={
                        errors?.billPayerNameMr
                          ? errors.billPayerNameMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayeraddressMr" />}
                      variant="standard"
                      {...register("billPayeraddressMr")}
                      error={errors.billPayeraddressMr}
                      helperText={
                        errors?.billPayeraddressMr
                          ? errors.billPayeraddressMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="collectedAmount" />}
                      variant="standard"
                      {...register("collectedAmount")}
                      error={errors.collectedAmount}
                      helperText={
                        errors?.collectedAmount
                          ? errors.collectedAmount.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="referenceNumber" />}
                      variant="standard"
                      {...register("referenceNumber")}
                      error={errors.referenceNumber}
                      helperText={
                        errors?.referenceNumber
                          ? errors.referenceNumber.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerDetails" />}
                      variant="standard"
                      {...register("billPayerDetails")}
                      error={errors.billPayerDetails}
                      helperText={
                        errors?.billPayerDetails
                          ? errors.billPayerDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      label={<FormattedLabel id="billPayerDetailsMr" />}
                      variant="standard"
                      {...register("billPayerDetailsMr")}
                      error={errors.billPayerDetailsMr}
                      helperText={
                        errors?.billPayerDetailsMr
                          ? errors.billPayerDetailsMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                         <TextField
InputLabelProps={{
shrink: true,
}}
                        sx={{ width: "80%" }}
                      fullWidth
                      multiline
                      maxRows={2}
                      id="standard-basic"
                      variant="standard"
                      label={<FormattedLabel id="chargesCollected" />}
                      {...register("chargesCollected")}
                      error={errors.chargesCollected}
                      helperText={
                        errors?.chargesCollected
                          ? errors.chargesCollected.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={11} className={styles.feildres}></Grid>
                </Grid> */}
                <br />
                <br />
                {/* Payment Detail Button */}
                {/* <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "70%" }}
                      variant="standard"
                      error={errors.outSidePcmcArea}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Citizen need to Payment
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setPayment(value.target.value);
                            }}
                            label="Citizen need to Payment"
                          >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={2}>No</MenuItem>
                          </Select>
                        )}
                        name=""
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    {Payment === 1 && (
                      <Button
                        variant="outlined"
                        onClick={() =>
                          router.push({
                            pathname:
                              "/FireBrigadeSystem/transactions/firstAhawal/loiGenerationComponent",
                          })
                        }
                      >
                        Get Payment Details
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid> */}
                {/* Multiline select */}
                {/* <Grid item xs={4} className={styles.feildres}>
                  <FormControl sx={{ m: 1, minWidth: 240 }}>
                    <InputLabel htmlFor="grouped-native-select">
                      Charges
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          variant="standard"
                          native
                          defaultValue=""
                          id="grouped-native-select"
                          label="Charges"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {chargeRate?.map((val) => {
                            console.log("1234", val);
                            return (
                              <>
                                <optgroup
                                  value={
                                    charge.find(
                                      (obj) => obj.id === val.chargeType
                                    )?.id
                                  }
                                  label={
                                    charge.find(
                                      (obj) => obj.id === val.chargeType
                                    )?.chargeType
                                  }
                                >
                                  <option
                                    value={val.id}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {val.subCharge}
                                  </option>
                                </optgroup>
                              </>
                            );
                          })}
                        </Select>
                      )}
                      name="chargesApply"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                </Grid> */}
                {/* citizen code */}
                {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "70%" }}
                      variant="standard"
                      error={errors.outSidePcmcArea}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        is citizen outside from pcmc area
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setOutsiteArea(value.target.value);
                            }}
                            label="is citizen outside from pcmc area"
                          >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={2}>No</MenuItem>
                          </Select>
                        )}
                        name="outSidePcmcArea"
                        control={control}
                        defaultValue=""
                      />
           
                    </FormControl>
                  </Grid>
                  {OutsiteArea === 1 && (
                    <Grid item xs={8} className={styles.feildres}>
                      <>
                        <Grid item xs={8} className={styles.feildres}>
                          <div
                            style={{
                              backgroundColor: "skyblue",
                              padding: 5,
                              width: "200",
                            }}
                          >
                            Citizen is outside from PCMC Area citizen has to pay
                            charges immediately
                          </div>
                        </Grid>
                        <Grid item xs={9} className={styles.feildres}>
                          <Button
                            variant="outlined"
                            onClick={() =>
                              router.push({
                                pathname:
                                  "/FireBrigadeSystem/transactions/firstAhawal/payScreen",
                              })
                            }
                          >
                            Get Payment Details
                          </Button>
                        </Grid>
                      </>
                    </Grid>
                  )} */}
                {/* end */}
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="vardiAndEmployeeDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        {<FormattedLabel id="vardiAndEmployeeDetails" />}
                      </InputLabel>
                      <Select
                        // labelId="demo-multiple-chip-label"
                        labelId="demo-multiple-checkbox-label"
                        // id="demo-multiple-chip"
                        id="demo-multiple-checkbox"
                        multiple
                        value={fireStationName}
                        onChange={handleChangeFireStation}
                        input={<OutlinedInput id="select-multiple-chip" label="Fire Station" />}
                        // input={<OutlinedInput label="Tag" />}
                        // renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected?.map((value) => (
                              <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        {fireStation?.map((fire, index) => (
                          <MenuItem
                            // key={name}
                            // value={name}
                            key={index}
                            value={
                              // fire.id
                              fire.fireStationName
                            }
                            // style={getStyles(fire, personName2, theme)}
                          >
                            <Checkbox checked={fireStationName.indexOf(fire.fireStationName) > -1} />
                            <ListItemText primary={fire.fireStationName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    {/* <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id='demo-multiple-chip-label'>
                        Fire Station
                      </InputLabel>
                      <Select
                        labelId='demo-multiple-chip-label'
                        id='demo-multiple-chip'
                        multiple
                        value={personName2}
                        onChange={handleChange2}
                        input={
                          <OutlinedInput
                            id='select-multiple-chip'
                            label='Fire Station'
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {fireStation &&
                          fireStation.map((name) => (
                            <MenuItem
                              key={name}
                              value={name.id}
                              style={getStyles(name, personName, theme)}
                            >
                              {name.fireStationName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl> */}
                  </Grid>
                  {crew == 2 || crew == "Pimpri" ? (
                    <>
                      {/* fire crew */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="demo-multiple-chip-label">
                            Fire Crew
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={fireCrewsMul}
                            onChange={handleChangeFireCrewsMul}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Fire Crew"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {fireCrew?.map((crew, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  crew.crewName
                                  // language === "en"
                                  //   ? crew.crewName
                                  //   : crew.crewNameMr
                                }
                                // style={getStyles(crew, personName3, theme)}
                              >
                                {/* {language == "en"
                                  ? crew.crewName
                                  : crew.crewNameMr} */}
                                <Checkbox
                                  checked={
                                    fireCrewsMul.indexOf(crew.crewName) > -1
                                  }
                                />
                                <ListItemText
                                  primary={
                                    language == "en"
                                      ? crew.crewName
                                      : crew.crewNameMr
                                  }
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  ) : (
                    <>
                      {/* crew - Employee Name */}
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <FormControl fullWidth sx={{ m: 1 }}>
                          <InputLabel id="demo-multiple-chip-label">Employee Name</InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            rows={2}
                            value={crewEmployeeName}
                            onChange={handleChangeCrewEmployeeName}
                            input={<OutlinedInput id="select-multiple-chip" label="Employee Name" />}
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected?.map((value) => (
                                  <Chip sx={{ backgroundColor: "#AFDBEE" }} key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {userLst.length > 0 &&
                              userLst.map((user, index) => (
                                <MenuItem
                                  // key={name}
                                  // value={name}
                                  key={index}
                                  value={
                                    // user.id
                                    // user.id
                                    user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn
                                  }
                                  // style={getStyles(user, personName5, theme)}
                                >
                                  <Checkbox
                                    checked={
                                      crewEmployeeName.indexOf(
                                        user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn,
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      (typeof user?.firstNameEn === "string" && user.firstNameEn) +
                                      " " +
                                      (typeof user?.middleNameEn === "string") +
                                      " " +
                                      (typeof user?.lastNameEn === "string" && user.lastNameEn)
                                    }
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl> */}
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="isExternalEmployeeAddedInDuty" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isExternalPersonAddedInDuty"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={
                                <Radio checked={externalPerson == "Yes"} />
                              }
                              label={<FormattedLabel id="yes" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalPerson(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={
                                <Radio checked={externalPerson == "No"} />
                              }
                              label={<FormattedLabel id="no" />}
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalPerson(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  {/* {isOpenCollapse && ( */}
                  {/* // )} */}
                  {externalPerson == "Yes" && (
                    <>
                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                        sx={{ marginBottom: "5%" }}
                      >
                        <Grid item xs={11} className={styles.feildres}>
                          {router?.query?.pageMode == "display" ||
                          router?.query?.pageMode == "Edit" ||
                          router?.query?.pageMode == "View" ||
                          props?.props?.pageMode == "Edit" ? (
                            <></>
                          ) : (
                            <FormControl
                              fullWidth
                              sx={{ m: 1, backgroundColor: "white" }}
                            >
                              <InputLabel id="demo-multiple-chip-label">
                                {<FormattedLabel id="otherExternalEmp" />}
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                rows={2}
                                value={externalEmployee}
                                onChange={handleChangeExternalEmployee}
                                input={
                                  <OutlinedInput
                                    id="select-multiple-chip"
                                    label="Other External Employee Who is Not on duty but
                present at the time of Vardi"
                                  />
                                }
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip
                                        sx={{ backgroundColor: "#AFDBEE" }}
                                        key={value}
                                        label={value}
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {userLst?.map((user, index) => (
                                  <MenuItem
                                    // key={name}
                                    // value={name}
                                    key={index}
                                    value={
                                      // user.id
                                      user.firstNameEn +
                                      " " +
                                      user.middleNameEn +
                                      " " +
                                      user.lastNameEn
                                    }
                                    // style={getStyles(user, personName5, theme)}
                                  >
                                    <Checkbox
                                      checked={
                                        externalEmployee.indexOf(
                                          user.firstNameEn +
                                            " " +
                                            user.middleNameEn +
                                            " " +
                                            user.lastNameEn
                                        ) > -1
                                      }
                                    />
                                    <ListItemText
                                      primary={
                                        (typeof user?.firstNameEn ===
                                          "string" && user.firstNameEn) +
                                        " " +
                                        (typeof user?.middleNameEn === "string"
                                          ? user.middleNameEn
                                          : " ") +
                                        " " +
                                        (typeof user?.lastNameEn === "string" &&
                                          user.lastNameEn)
                                      }
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                              {/* <Select
            multiple
            displayEmpty
            value={externalEmployee.firstNameEn}
            onChange={handleChangeExternalEmployee}
            input={<Input id='select-multiple-placeholder' />}
            renderValue={(selected) => {
              if (selected?.length === 0) {
                return <em>Placeholder</em>;
              }

              return selected?.join(", ");
            }}
            MenuProps={MenuProps}
          >
            <MenuItem disabled value=''>
              <em>Placeholder</em>
            </MenuItem>
            {userLst &&
              userLst?.map((name, index) => (
                <MenuItem
                  key={index}
                  value={name.id}
                  // style={getStyles(name, this)}
                >
                  {name.firstNameEn}
                </MenuItem>
              ))}
          </Select> */}
                            </FormControl>
                          )}
                        </Grid>

                        {/* <Grid item xs={1} className={styles.feildres}></Grid> */}
                        {/* <Grid item xs={4} className={styles.feildres}></Grid> */}
                      </Grid>

                      {/* <Box className={styles.tableHead}>
                        <Box
                        // className={styles.feildHead}
                        // sx={{ width: "400px" }}
                        >
                          {<FormattedLabel id='personDetailsNotOnDuty' />}
                        </Box>
                      </Box> */}
                      {console.log("externalEmp", externalEmp.length)}
                      <Container>
                        <Paper component={Box} p={1}>
                          {externalEmp &&
                            externalEmp.map((e, index) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    columns={{ xs: 4, sm: 8, md: 12 }}
                                    className={styles.feildres}
                                    spacing={3}
                                    key={index}
                                    p={1}
                                    sx={{
                                      // backgroundColor: "#E8F6F3",
                                      border: "7px solid #E8F6F3",
                                      paddingBottom: "49px",
                                      padding: "10px",
                                      margin: "5px",
                                      width: "99%",
                                    }}
                                  >
                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        variant="standard"
                                        label={
                                          <FormattedLabel id="personName" />
                                        }
                                        {...register(
                                          `firstAhawal.otherEmployeesLst.${index}.offDutyEmpName`
                                        )}
                                        error={errors.offDutyEmpName}
                                        helperText={
                                          errors?.offDutyEmpName
                                            ? errors.offDutyEmpName.message
                                            : null
                                        }
                                      />
                                    </Grid>

                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={
                                          <FormattedLabel id="personAddress" />
                                        }
                                        variant="standard"
                                        {...register(
                                          `firstAhawal.otherEmployeesLst.${index}.offDutyEmpAddress`
                                        )}
                                        error={errors.offDutyEmpAddress}
                                        helperText={
                                          errors?.offDutyEmpAddress
                                            ? errors.offDutyEmpAddress.message
                                            : null
                                        }
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={
                                          <FormattedLabel id="personContactno" />
                                        }
                                        variant="standard"
                                        {...register(
                                          `firstAhawal.otherEmployeesLst.${index}.offDutyEmpContactNo`
                                        )}
                                        error={errors.offDutyEmpContactNo}
                                        helperText={
                                          errors?.offDutyEmpContactNo
                                            ? errors.offDutyEmpContactNo.message
                                            : null
                                        }
                                      />
                                    </Grid>

                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        variant="standard"
                                        label={
                                          <FormattedLabel id="personNameMr" />
                                        }
                                        {...register(
                                          `firstAhawal.otherEmployeesLst.${index}.offDutyEmpNameMr`
                                        )}
                                        error={errors.offDutyEmpNameMr}
                                        helperText={
                                          errors?.offDutyEmpNameMr
                                            ? errors.offDutyEmpNameMr.message
                                            : null
                                        }
                                      />
                                    </Grid>
                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={
                                          <FormattedLabel id="addressMr" />
                                        }
                                        // label={
                                        //   <FormattedLabel id="personAddress" />
                                        // }
                                        variant="standard"
                                        {...register(
                                          `firstAhawal.otherEmployeesLst.${index}.offDutyEmpAddressMr`
                                        )}
                                        error={errors.offDutyEmpAddressMr}
                                        helperText={
                                          errors?.offDutyEmpAddressMr
                                            ? errors.offDutyEmpAddressMr.message
                                            : null
                                        }
                                      />
                                    </Grid>

                                    <Grid
                                      item
                                      xs={4}
                                      className={styles.feildres}
                                    >
                                      <IconButton
                                        color="error"
                                        onClick={() => removeEmployee(index)}
                                      >
                                        <DeleteIcon sx={{ fontSize: 35 }} />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                          <br />
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClickEmployee}
                          >
                            Add More <AddBoxOutlinedIcon />
                          </Button>
                        </Paper>
                      </Container>
                    </>
                  )}
                </Grid>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="externalAdditionalSupportService" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="isExternalSupportProvided" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isExternalServiceProvide"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={
                                <Radio checked={externalService == "Yes"} />
                              }
                              label={<FormattedLabel id="yes" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalService(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={
                                <Radio checked={externalService == "No"} />
                              }
                              label={<FormattedLabel id="no" />}
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setExternalService(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                {/* <Grid item xs={11} className={styles.feildres}>
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">
                        External Services
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName4}
                        onChange={handleChange4}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {fireStation?.map((name, index) => (
                          <MenuItem key={name.id} value={name.fireStationName}>
                            <Checkbox
                              checked={
                                personName4.indexOf(name.fireStationName) > -1
                              }
                              // checked={name.fireStationName }
                            />
                            <ListItemText primary={name.fireStationName} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> */}
                {/* <Grid container spacing={3}>
                  <Grid item md={3}>
                    <FormControl
                      variant="standard"
                      sx={{ minWidth: "80%" }}
                      error={errors.externalServiceProvided}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="externalServiceName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="externalServiceName" />}
                          >
                             {externalServiceProvided &&
                              externalServiceProvided.map((fire, index) => (
                                <MenuItem key={index} value={fire.id}>
                              
                                  {fire.serviceType}
                                </MenuItem>
                              ))} 
                         
                          </Select>
                        )}
                        name="externalServiceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.fireStationName
                          ? errors.fireStationName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item md={3}>
                    <TextField
InputLabelProps={{
shrink: true,
}}
                      sx={{ width: "80%" }}
                      // size="small">
                      id="standard-basic"
                      label={<FormattedLabel id="personName" />}
                      variant="standard"
                      {...register("esname")}
                      error={errors.esname}
                      helperText={errors?.esname ? errors.esname.message : null}
                    />
                  </Grid>
                  <Grid item md={3}>
                    <TextField
InputLabelProps={{
shrink: true,
}}
                      sx={{ width: "80%" }}
                      // size="small"
                      id="standard-basic"
                      label={<FormattedLabel id="personContactno" />}
                      variant="standard"
                      {...register("escontactNo")}
                      error={errors.escontactNo}
                      helperText={
                        errors?.escontactNo ? errors.escontactNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item md={3}>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid> */}
                <br />
                <br />
                {externalService == "Yes" ? (
                  <>
                    <Container>
                      <Paper component={Box} p={1} sx={{ paddingLeft: "20px" }}>
                        {extperson &&
                          extperson.map((u, index) => {
                            return (
                              <>
                                <Grid container spacing={3} key={index} p={1}>
                                  <Grid item md={4} sm={6} xs={8}>
                                    <FormControl
                                      variant="standard"
                                      sx={{ minWidth: "80%" }}
                                      error={errors.externalServiceId}
                                    >
                                      <InputLabel id="demo-simple-select-standard-label">
                                        {
                                          <FormattedLabel id="externalServiceName" />
                                        }
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            value={field.value}
                                            onChange={(value) =>
                                              field.onChange(value)
                                            }
                                            label={
                                              <FormattedLabel id="externalServiceName" />
                                            }
                                          >
                                            {externalServiceProvided &&
                                              externalServiceProvided.map(
                                                (fire, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    value={fire.id}
                                                  >
                                                    {language == "en"
                                                      ? fire.externalServiceName
                                                      : fire.externalServiceNameMr}
                                                  </MenuItem>
                                                )
                                              )}
                                          </Select>
                                        )}
                                        name={`firstAhawal.externalSupportLst.${index}.externalServiceId`}
                                        control={control}
                                        defaultValue={null}
                                      />
                                      <FormHelperText>
                                        {errors?.externalServiceId
                                          ? errors.externalServiceId.message
                                          : null}
                                      </FormHelperText>
                                    </FormControl>
                                  </Grid>
                                  <Grid item md={4}>
                                    <TextField
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{ width: "80%" }}
                                      // size="small"
                                      id="standard-basic"
                                      label={<FormattedLabel id="personName" />}
                                      variant="standard"
                                      {...register(
                                        `firstAhawal.externalSupportLst.${index}.esname`
                                      )}
                                      error={errors.esname}
                                      helperText={
                                        errors?.esname
                                          ? errors.esname.message
                                          : null
                                      }
                                    />
                                  </Grid>
                                  <Grid item md={3}>
                                    <TextField
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{ width: "80%" }}
                                      // size="small"
                                      id="standard-basic"
                                      label={
                                        <FormattedLabel id="personContactno" />
                                      }
                                      variant="standard"
                                      {...register(
                                        `firstAhawal.externalSupportLst.${index}.escontactNo`
                                      )}
                                      error={errors.escontactNo}
                                      helperText={
                                        errors?.escontactNo
                                          ? errors.escontactNo.message
                                          : null
                                      }
                                    />
                                  </Grid>
                                  <Grid item md={1}>
                                    <IconButton
                                      color="error"
                                      onClick={() => removeUser(index)}
                                    >
                                      <DeleteIcon sx={{ fontSize: 35 }} />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              </>
                            );
                          })}
                        <br />
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleClick2}
                        >
                          Add More <AddBoxOutlinedIcon />
                        </Button>
                      </Paper>
                    </Container>

                    <br />
                    <br />
                  </>
                ) : (
                  <></>
                )}
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="otherDetails" />}
                  </Box>
                </Box>
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={11} className={styles.feildres}>
                    {/* <TextField
                      multiline
                      rows={2}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size='small'
                      sx={{
                        backgroundColor: "white",
                      }}
                      label={<FormattedLabel id='firedThingsDuringAccuse' />}
                      {...register("firstAhawal.firedThingsDuringAccuse")}
                      error={errors.firedThingsDuringAccuse}
                      helperText={
                        errors?.firedThingsDuringAccuse
                          ? errors.firedThingsDuringAccuse.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      multiline
                      rows={2}
                      // InputLabelProps={{
                      //   shrink: true,
                      // }}
                      fullWidth
                      variant={"outlined"}
                      _key={"firedThingsDuringAccuse"}
                      labelName={"firedThingsDuringAccuse"}
                      fieldName={"firedThingsDuringAccuse"}
                      updateFieldName={"firedThingsDuringAccuseMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="firedThingsDuringAccuse" required />
                      }
                      error={!!errors.firedThingsDuringAccuse}
                      helperText={
                        errors?.firedThingsDuringAccuse
                          ? errors.firedThingsDuringAccuse.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={11} className={styles.feildres}>
                    {/* <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size='small'
                      sx={{
                        backgroundColor: "white",
                        // marginTop: "1%",
                      }}
                      label={<FormattedLabel id='firedThingsDuringAccuseMr' />}
                      multiline
                      rows={2}
                      {...register("firstAhawal.firedThingsDuringAccuseMr")}
                      error={errors.firedThingsDuringAccuseMr}
                      helperText={
                        errors?.firedThingsDuringAccuseMr
                          ? errors.firedThingsDuringAccuseMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"outlined"}
                      _key={"firedThingsDuringAccuseMr"}
                      labelName={"firedThingsDuringAccuseMr"}
                      fieldName={"firedThingsDuringAccuseMr"}
                      updateFieldName={"firedThingsDuringAccuse"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel
                          id="firedThingsDuringAccuseMr"
                          required
                        />
                      }
                      error={!!errors.firedThingsDuringAccuseMr}
                      helperText={
                        errors?.firedThingsDuringAccuseMr
                          ? errors.firedThingsDuringAccuseMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="haveInsurrancePolicy" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.insurancePolicyApplicable"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={
                                <Radio checked={insurrancePolicy == "Yes"} />
                              }
                              label={<FormattedLabel id="yes" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setInsurrancePolicy(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={
                                <Radio checked={insurrancePolicy == "No"} />
                              }
                              label={<FormattedLabel id="no" />}
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setInsurrancePolicy(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {insurrancePolicy == "Yes" ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          rows={3}
                          multiline
                          // maxRows={2}
                          size="small"
                          sx={{
                            backgroundColor: "white",
                            marginTop: "2%",
                            width: "100%",
                          }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="insurancePolicyDetails" />}
                          {...register("firstAhawal.insurancePolicyDetails")}
                          error={errors.insurancePolicyDetails}
                          helperText={
                            errors?.insurancePolicyDetails
                              ? errors.insurancePolicyDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline
                          rows={3}
                          // maxRows={2}
                          size="small"
                          sx={{
                            backgroundColor: "white",
                            marginTop: "2%",
                            width: "100%",
                          }}
                          id="outlined-basic"
                          variant="outlined"
                          label={
                            <FormattedLabel id="insurancePolicyDetailsMr" />
                          }
                          {...register("firstAhawal.insurancePolicyDetailsMr")}
                          error={errors.insurancePolicyDetailsMr}
                          helperText={
                            errors?.insurancePolicyDetailsMr
                              ? errors.insurancePolicyDetailsMr.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}

                  <Grid item xs={3.5} className={styles.feildres}>
                    {/* <FormControl component='fieldset' sx={{ marginTop: "8%" }}>
                      <FormLabel component='legend'>
                        Is Fire Equipments Available?
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name='isFireEquipmentsAvailable'
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value='Yes'
                              control={<Radio />}
                              label='Yes'
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value='No'
                              control={<Radio />}
                              label='No'
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl> */}
                    <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
                      <FormLabel component="legend">
                        <FormattedLabel id="isFireEquipmentIsAvailable" />
                      </FormLabel>
                      <Controller
                        rules={{ required: true }}
                        control={control}
                        name="firstAhawal.isFireEquipmentsAvailable"
                        render={({ field }) => (
                          <RadioGroup {...field}>
                            <FormControlLabel
                              value="Yes"
                              control={
                                <Radio
                                  checked={fireEquipmentsAvailable == "Yes"}
                                />
                              }
                              label={<FormattedLabel id="yes" />}
                              // setSlipHandedOverTo(value.target.value);
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                            <FormControlLabel
                              value="No"
                              control={
                                <Radio
                                  checked={fireEquipmentsAvailable == "No"}
                                />
                              }
                              label={<FormattedLabel id="no" />}
                              onChange={(value) => {
                                console.log("value", value.target.value);
                                // field.onChange(value);
                                setFireEquipmentsAvailable(value.target.value);
                              }}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={8.5} className={styles.feildres}>
                    {fireEquipmentsAvailable == "Yes" ? (
                      <>
                        <Container>
                          <Paper
                            component={Box}
                            p={1}
                            sx={{ paddingLeft: "20px", paddingTop: "5%" }}
                          >
                            {fireEqipmentMulAdd &&
                              fireEqipmentMulAdd.map((u, index) => {
                                return (
                                  <>
                                    <Grid
                                      container
                                      spacing={1}
                                      key={index}
                                      // p={1}
                                    >
                                      <Grid
                                        item
                                        xs={7}
                                        className={styles.feildres}
                                      >
                                        {/* <FormControl
                          sx={{ m: 1, width: 300, backgroundColor: "white" }}
                        >
                          <InputLabel id='demo-multiple-chip-label'>
                            <FormattedLabel id='fireEquipment' />
                          </InputLabel>
                          <Select
                            sx={{ backgroundColor: "white" }}
                            labelId='demo-multiple-chip-label'
                            id='demo-multiple-chip'
                            multiple
                            value={fireEquipmentMul}
                            onChange={handleChangeFireEquipmentMul}
                            input={
                              <OutlinedInput
                                id='select-multiple-chip'
                                label='Fire Equipment'
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {names.length > 0 &&
                              names.map((fire, index) => (
                                <MenuItem
                                  key={index}
                                  value={fire.name}
                                  // style={getStyles(personName6, theme)}
                                >
                                  {fire.name}
                                </MenuItem>
                              ))}
                            
                          </Select>
                        </FormControl> */}
                                        <FormControl
                                          size="small"
                                          variant="outlined"
                                          sx={{ minWidth: "100%" }}
                                          // size="small"
                                          error={errors.fireEquipments}
                                        >
                                          <InputLabel id="demo-simple-select-standard-label">
                                            <FormattedLabel id="fireEquipments" />
                                          </InputLabel>
                                          <Controller
                                            render={({ field }) => (
                                              <Select
                                                value={field.value}
                                                // onChange={(value) => field.onChange(value)}
                                                onChange={(value) => {
                                                  console.log(
                                                    "value9090",
                                                    value.target.value
                                                  );
                                                  field.onChange(value);
                                                  setShowFireOther(
                                                    value.target.value
                                                  );
                                                }}
                                                label={
                                                  <FormattedLabel id="fireEquipments" />
                                                }
                                              >
                                                {names.length > 0 &&
                                                  names.map((fire, index) => (
                                                    <MenuItem
                                                      key={index}
                                                      value={fire.name}
                                                      // style={getStyles(personName6, theme)}
                                                    >
                                                      {fire.name}
                                                    </MenuItem>
                                                  ))}
                                              </Select>
                                            )}
                                            name={`firstAhawal.fireEquipments.${index}.fireEquipments`}
                                            control={control}
                                            defaultValue=""
                                          />
                                          <FormHelperText>
                                            {errors?.firstAhawal?.fireEquipments
                                              ? errors?.firstAhawal
                                                  ?.fireEquipments.message
                                              : null}
                                          </FormHelperText>
                                        </FormControl>
                                      </Grid>

                                      <Grid
                                        item
                                        xs={3}
                                        className={styles.feildres}
                                      >
                                        <TextField
                                          size="small"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          sx={{ width: "80%" }}
                                          id="outlined-basic"
                                          variant="outlined"
                                          label={
                                            <FormattedLabel id="capacity" />
                                          }
                                          {...register(
                                            `firstAhawal.fireEquipments.${index}.capacity`
                                          )}
                                          error={errors?.finalAhawal?.capacity}
                                          helperText={
                                            errors?.finalAhawal?.capacity
                                              ? errors?.finalAhawal?.capacity
                                                  ?.message
                                              : null
                                          }
                                        />
                                      </Grid>
                                      <Grid item md={1} xs={1}>
                                        <IconButton
                                          color="error"
                                          onClick={() =>
                                            removeFireEqipment(index)
                                          }
                                        >
                                          <DeleteIcon sx={{ fontSize: 35 }} />
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  </>
                                );
                              })}
                            <br />
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleClickForFireEquipment}
                            >
                              Add More <AddBoxOutlinedIcon />
                            </Button>
                          </Paper>
                        </Container>
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                  {/* <Grid item xs={4} className={styles.feildres}></Grid> */}
                </Grid>
                <br />
                {router?.query?.pageMode == "display" ||
                router?.query?.pageMode == "Edit" ||
                router?.query?.pageMode == "View" ||
                props?.props?.pageMode == "Edit" ? (
                  <></>
                ) : (
                  <>
                    <br />
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {<FormattedLabel id="vehicleDetailsTitle" />}
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <>
                      <Container>
                        <Paper component={Box} p={1}>
                          {vehicle &&
                            vehicle.map((u, index) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    spacing={3}
                                    key={index}
                                    p={1}
                                    sx={{
                                      // backgroundColor: "#E8F6F3",
                                      border: "7px solid #E8F6F3",
                                      paddingBottom: "49px",
                                      padding: "10px",
                                      margin: "5px",
                                      width: "99%",
                                    }}
                                  >
                                    <Grid item md={3} sm={6} xs={8}>
                                      <FormControl
                                        variant="standard"
                                        sx={{ minWidth: "80%" }}
                                        error={errors.vehicle}
                                      >
                                        <InputLabel id="demo-simple-select-standard-label">
                                          {
                                            <FormattedLabel id="vehicleNumber" />
                                          }
                                        </InputLabel>
                                        <Controller
                                          render={({ field }) => (
                                            <Select
                                              value={field.value}
                                              onChange={(value) =>
                                                field.onChange(value)
                                              }
                                              label={
                                                <FormattedLabel id="vehicleNumber" />
                                              }
                                            >
                                              {vehicleNumber &&
                                                vehicleNumber.map(
                                                  (fire, index) => (
                                                    <MenuItem
                                                      key={index}
                                                      value={fire.id}
                                                    >
                                                      {fire.vehicleNumber}
                                                    </MenuItem>
                                                  )
                                                )}
                                            </Select>
                                          )}
                                          name={`firstAhawal.vehicleEntryLst.${index}.vehicle`}
                                          control={control}
                                          defaultValue=""
                                        />
                                        <FormHelperText>
                                          {errors?.vehicle
                                            ? errors.vehicle.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={4}>
                                      <FormControl
                                        error={errors.outTime}
                                        sx={{ width: "100%" }}
                                      >
                                        <Controller
                                          control={control}
                                          defaultValue={null}
                                          name={`firstAhawal.vehicleEntryLst.${index}.outTime`}
                                          render={({ field }) => (
                                            <LocalizationProvider
                                              dateAdapter={AdapterMoment}
                                            >
                                              <TimePicker
                                                ampm={false}
                                                openTo="hours"
                                                views={[
                                                  "hours",
                                                  "minutes",
                                                  "seconds",
                                                ]}
                                                inputFormat="HH:mm:ss"
                                                mask="__:__:__"
                                                label={
                                                  <FormattedLabel id="stationOutTime" />
                                                }
                                                value={field.value}
                                                onChange={(time) => {
                                                  field.onChange(time);
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                    size="small"
                                                    {...params}
                                                  />
                                                )}
                                              />
                                            </LocalizationProvider>
                                          )}
                                        />
                                        <FormHelperText>
                                          {errors?.outTime
                                            ? errors.outTime.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={5}>
                                      <FormControl
                                        error={errors.reachedTime}
                                        sx={{ width: "90%" }}
                                      >
                                        <Controller
                                          control={control}
                                          defaultValue={null}
                                          name={`firstAhawal.vehicleEntryLst.${index}.reachedTime`}
                                          render={({ field }) => (
                                            <LocalizationProvider
                                              dateAdapter={AdapterMoment}
                                            >
                                              <TimePicker
                                                ampm={false}
                                                openTo="hours"
                                                views={[
                                                  "hours",
                                                  "minutes",
                                                  "seconds",
                                                ]}
                                                inputFormat="HH:mm:ss"
                                                mask="__:__:__"
                                                label={
                                                  <FormattedLabel id="vehicleReachedAtLocationTime" />
                                                }
                                                value={field.value}
                                                onChange={(time) => {
                                                  field.onChange(time);
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                    size="small"
                                                    {...params}
                                                  />
                                                )}
                                              />
                                            </LocalizationProvider>
                                          )}
                                        />
                                        <FormHelperText>
                                          {errors?.reachedTime
                                            ? errors.reachedTime.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={3}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={
                                          <FormattedLabel id="pumpingTime" />
                                        }
                                        variant="standard"
                                        {...register(
                                          `firstAhawal.vehicleEntryLst.${index}.workDuration`
                                        )}
                                        error={errors.workDuration}
                                        helperText={
                                          errors?.workDuration
                                            ? errors.workDuration.message
                                            : null
                                        }
                                      />
                                    </Grid>
                                    <Grid item md={4}>
                                      <FormControl
                                        error={errors.leaveTime}
                                        sx={{ width: "100%" }}
                                      >
                                        <Controller
                                          control={control}
                                          defaultValue={null}
                                          name={`firstAhawal.vehicleEntryLst.${index}.leaveTime`}
                                          render={({ field }) => (
                                            <LocalizationProvider
                                              dateAdapter={AdapterMoment}
                                            >
                                              <TimePicker
                                                ampm={false}
                                                openTo="hours"
                                                views={[
                                                  "hours",
                                                  "minutes",
                                                  "seconds",
                                                ]}
                                                inputFormat="HH:mm:ss"
                                                mask="__:__:__"
                                                label={
                                                  <FormattedLabel id="vehicleLeaveAtLocationTime" />
                                                }
                                                value={field.value}
                                                onChange={(time) => {
                                                  field.onChange(time);
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                    // sx={{ width: "80%" }}
                                                    size="small"
                                                    {...params}
                                                  />
                                                )}
                                              />
                                            </LocalizationProvider>
                                          )}
                                        />
                                        <FormHelperText>
                                          {errors?.leaveTime
                                            ? errors.leaveTime.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={5}>
                                      <FormControl
                                        error={errors.reachedTime}
                                        sx={{ width: "90%" }}
                                      >
                                        <Controller
                                          control={control}
                                          defaultValue={null}
                                          name={`firstAhawal.vehicleEntryLst.${index}.inTime`}
                                          render={({ field }) => (
                                            <LocalizationProvider
                                              dateAdapter={AdapterMoment}
                                            >
                                              <TimePicker
                                                ampm={false}
                                                openTo="hours"
                                                views={[
                                                  "hours",
                                                  "minutes",
                                                  "seconds",
                                                ]}
                                                inputFormat="HH:mm:ss"
                                                mask="__:__:__"
                                                label={
                                                  <FormattedLabel id="vehicleInTimeAtFireStation" />
                                                }
                                                value={field.value}
                                                onChange={(time) => {
                                                  field.onChange(time);
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                    // sx={{ width: "80%" }}
                                                    size="small"
                                                    {...params}
                                                  />
                                                )}
                                              />
                                            </LocalizationProvider>
                                          )}
                                        />
                                        <FormHelperText>
                                          {errors?.inTime
                                            ? errors.inTime.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </Grid>
                                    <Grid item md={4}>
                                      <TextField
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        sx={{ width: "80%" }}
                                        id="standard-basic"
                                        label={
                                          <FormattedLabel id="vehicleKm" />
                                        }
                                        variant="standard"
                                        {...register(
                                          `firstAhawal.vehicleEntryLst
                                          .${index}.distanceTravelledInKms`
                                        )}
                                        error={errors.distanceTravelledInKms}
                                        helperText={
                                          errors?.distanceTravelledInKms
                                            ? errors.distanceTravelledInKms
                                                .message
                                            : null
                                        }
                                      />
                                    </Grid>
                                    <Grid item md={6}></Grid>
                                    <Grid item md={1}>
                                      <IconButton
                                        color="error"
                                        onClick={() => removeVehicle(index)}
                                      >
                                        <DeleteIcon sx={{ fontSize: 35 }} />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                          <br />
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClickVehicle}
                            sx={{ marginLeft: "800px" }}
                          >
                            <FormattedLabel id="addMore" />
                            <AddBoxOutlinedIcon
                              sx={{ paddingLeft: "7px", fontSize: 28 }}
                            />
                          </Button>
                        </Paper>
                      </Container>

                      <br />
                      <br />
                    </>
                    <br />
                    <br />
                  </>
                )}

                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="lifeLoss" />}
                  </Box>
                </Box>

                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={2} className={styles.feildres}>
                    <h3>{<FormattedLabel id="employeeKarmarchari" />} </h3>
                  </Grid>
                  <Grid item xs={3} spacing={2} className={styles.feildres}>
                    <TextField
                      // value={value4}
                      onChange={(e) => handleInputChange(e, setValue4)}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="totalEmployeeInjurred" />}
                      // multiline
                      // rows={2}
                      {...register("firstAhawal.selfEmployeeInjurred")}
                      error={errors?.firstAhawal?.selfEmployeeInjurred}
                      helperText={
                        errors?.firstAhawal?.selfEmployeeInjurred
                          ? errors?.firstAhawal?.selfEmployeeInjurred?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      fullWidth
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      {...register("firstAhawal.selfEmployeeDead")}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="totalEmployeeDead" />}
                      error={errors?.firstAhawal?.selfEmployeeDead}
                      helperText={
                        errors?.firstAhawal?.selfEmployeeDead
                          ? errors?.firstAhawal?.selfEmployeeDead?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ backgroundColor: "white" }}
                      fullWidth
                      variant="outlined"
                      id="outlined-multiline-static"
                      label={<FormattedLabel id="employeeDetails" />}
                      multiline
                      rows={2}
                      {...register("firstAhawal.selfLossDetails")}
                      error={errors?.firstAhawal?.selfLossDetails}
                      helperText={
                        errors?.firstAhawal?.selfLossDetails
                          ? errors?.firstAhawal?.selfLossDetails?.messagef
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                {/* New Add */}
                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={2} className={styles.feildres}>
                    <h3>{<FormattedLabel id="ownerOfProperty" />} </h3>
                  </Grid>
                  <Grid item xs={3} spacing={2} className={styles.feildres}>
                    <TextField
                      // value={value5}
                      onChange={(e) => handleInputChange(e, setValue5)}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={
                        <FormattedLabel id="ownerOfPropertyInjurredCount" />
                      }
                      {...register("firstAhawal.ownerOfPropertyInjurredCount")}
                      error={errors?.firstAhawal?.ownerOfPropertyInjurredCount}
                      helperText={
                        errors?.firstAhawal?.ownerOfPropertyInjurredCount
                          ? errors?.firstAhawal?.ownerOfPropertyInjurredCount
                              ?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="ownerOfPropertyDeadCount" />}
                      {...register("firstAhawal.ownerOfPropertyDeadCount")}
                      error={errors?.firstAhawal?.ownerOfPropertyDeadCount}
                      helperText={
                        errors?.firstAhawal?.ownerOfPropertyDeadCount
                          ? errors?.firstAhawal?.ownerOfPropertyDeadCount
                              ?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ backgroundColor: "white" }}
                      fullWidth
                      variant="outlined"
                      id="outlined-multiline-static"
                      label={
                        <FormattedLabel id="ownerOfPropertyOtherDetails" />
                      }
                      multiline
                      rows={2}
                      {...register("firstAhawal.ownerOfPropertyOtherDetails")}
                      error={errors?.firstAhawal?.ownerOfPropertyOtherDetails}
                      helperText={
                        errors?.firstAhawal?.ownerOfPropertyOtherDetails
                          ? errors?.firstAhawal?.ownerOfPropertyOtherDetails
                              ?.messagef
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  spacing={4}
                  className={styles.feildres}
                >
                  <Grid item xs={2} className={styles.feildres}>
                    <h3>
                      {" "}
                      <FormattedLabel id="other" />{" "}
                    </h3>
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      // value={value6}
                      onChange={(e) => handleInputChange(e, setValue6)}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="otherInjurredCount" />}
                      {...register("firstAhawal.otherInjurred")}
                      error={errors?.firstAhawal?.otherInjurred}
                      helperText={
                        errors?.firstAhawal?.otherInjurred
                          ? errors?.firstAhawal?.otherInjurred?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="otherDeadCount" />}
                      {...register("firstAhawal.otherDead")}
                      error={errors?.firstAhawal?.otherDead}
                      helperText={
                        errors?.firstAhawal?.otherDead
                          ? errors?.firstAhawal?.otherDead?.messagef
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ backgroundColor: "white" }}
                      fullWidth
                      variant="outlined"
                      id="outlined-multiline-static"
                      label={<FormattedLabel id="otherDetails" />}
                      multiline
                      rows={2}
                      {...register("firstAhawal.otherLossDetails")}
                      error={errors?.firstAhawal?.otherLossDetails}
                      helperText={
                        errors?.firstAhawal?.otherLossDetails
                          ? errors?.firstAhawal?.otherLossDetails?.messagef
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={2} className={styles.feildres}>
                    <h3> {<FormattedLabel id="totalCount" />}</h3>
                  </Grid>
                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={
                        Number(watch("firstAhawal.selfEmployeeInjurred")) +
                        Number(
                          watch("firstAhawal.ownerOfPropertyInjurredCount")
                        ) +
                        Number(watch("firstAhawal.otherInjurred"))
                      }
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="totalInjurred" />}
                      {...register("firstAhawal.injurred")}
                      error={errors.injurred}
                      helperText={
                        errors?.injurred ? errors.injurred.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={3} className={styles.feildres}>
                    <TextField
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={
                        Number(watch("firstAhawal.otherDead")) +
                        Number(watch("firstAhawal.ownerOfPropertyDeadCount")) +
                        Number(watch("firstAhawal.selfEmployeeDead"))
                      }
                      fullWidth
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        marginTop: "2%",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="manPowerLoss" />}
                      {...register("firstAhawal.manPowerLoss")}
                      error={errors.manPowerLoss}
                      helperText={
                        errors?.manPowerLoss
                          ? errors.manPowerLoss.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <br />
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="propertyLoss" />}
                  </Box>
                </Box>
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="totalVehicleLoss" />}
                      {...register("firstAhawal.totalVehicleLoss")}
                      error={errors.totalVehicleLoss}
                      helperText={
                        errors?.totalVehicleLoss
                          ? errors.totalVehicleLoss.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="totalBuildingLoss" />}
                      {...register("firstAhawal.totalBuildingLoss")}
                      error={errors.totalBuildingLoss}
                      helperText={
                        errors?.totalBuildingLoss
                          ? errors.totalBuildingLoss.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        width: "100%",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="fireDamages" />}
                      {...register("firstAhawal.fireDamages")}
                      error={errors.fireDamages}
                      helperText={
                        errors?.fireDamages ? errors.fireDamages.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <br />
                <br />
                <br />
                {console.log(
                  "router?.query?.pageMode",
                  router?.query?.pageMode
                )}
                {/* {
                  router?.query?.pageMode == "display" ||
                  router?.query?.pageMode == "Edit" ||
                  router?.query?.pageMode == "View" ||
                  props?.props?.pageMode == "Edit" ? (
                    <></>
                  ) : ( */}
                {/* // {router.query.pageMode == "Edit" && ( */}
                <Grid container className={styles.feildres} spacing={2}>
                  {router?.query?.pageMode == "display" ||
                  router?.query?.pageMode == "View" ||
                  props?.props?.pageMode == "Edit" ? (
                    <></>
                  ) : (
                    <>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="save" />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          // color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/transactions/firstAhawal",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
                {/* )
                  // )}
                } */}
              </div>
            </form>
          </FormProvider>
        </div>
      </Paper>
    </Box>
  );
};

export default Form;
