import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import schema from "../../../../../containers/schema/fireBrigadeSystem/businessNocTransaction";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import DocumentsUpload from "./documentUpload";
let drawerWidth;
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import {
  defaultSchema,
  hotelSchema,
  companySchema,
  cinemaHallSchema,
  petrolPumpSchema,
} from "../../../../../containers/schema/fireBrigadeSystem/businessNocTransaction";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

function getStyles(name, personName2, theme) {
  return {
    fontWeight:
      personName2.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

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

const values = [
  { id: 1, name: "Yes", nameMr: "होय" },
  { id: 2, name: "No", nameMr: "नाही" },
];

const wireTypes = [
  { id: 1, type: "Open", typeMr: "बाह्य वायरिंग" },
  { id: 2, type: "Close", typeMr: "आतील वायरिंग" },
];

const Form = (props) => {
  console.log(":a1", props);
  const userToken = useGetToken();

  const [personName2, setPersonName2] = React.useState([]);
  const [personName3, setPersonName3] = React.useState([]);

  const logedInUser = localStorage.getItem("loggedInUser");

  const [disableButtonInputState, setDisableButtonInputState] = useState(false);

  const [zoneNames, setZoneNames] = useState([]);

  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((errors) => {
        console.log("errors", errors);
      });
  };

  useEffect(() => {
    getZoneName();
  }, []);
  const [nocTypeState, setNocTypeState] = useState("");

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;

    // fireStationName: personName3.toString(),
    // .toString(),
    // console.log("value222", value2);

    setPersonName3(
      // typeof value === "string"
      //   ? value.map((r) => fireStation.forEach((fire) => fire.fireStationName == r)?.id)
      //   : "-",
      // value2,
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log("personName3", personName3);

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName2(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const theme = useTheme();

  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);

  // Exit button Routing
  const router = useRouter();

  // const methods = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  // const {
  //   register,
  //   control,
  //   watch,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  // } = methods;

  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(dataValidation),
    resolver: yupResolver(defaultSchema),
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

  const [daoName, setDaoName] = useState();

  const idLocal = localStorage.getItem("idState");
  const formName = localStorage.getItem("typeOfBusiness");
  const formNameMr = localStorage.getItem("typeOfBusinessMr");
  const daoNameLocal = localStorage.getItem("key");

  const [dataValidation, setDataValidation] = useState(defaultSchema);

  useEffect(() => {
    console.log("12345", idLocal);
    if (props?.props?.typeOfBusiness == 4 || idLocal == 4) {
      setDataValidation(hotelSchema);
    } else if (props?.props?.typeOfBusiness == 12 || idLocal == 12) {
      setDataValidation(companySchema);
    } else if (props?.props?.typeOfBusiness == 8 || idLocal == 8) {
      setDataValidation(petrolPumpSchema);
    } else if (props?.props?.typeOfBusiness == 11 || idLocal == 11) {
      setDataValidation(cinemaHallSchema);
    }

    // let mergedSchema;
    // let newDataValidation;

    // if (props?.props?.typeOfBusiness == 4 || idLocal == 4) {
    //   newDataValidation = hotelSchema;
    //   // setDataValidation(hotelSchema && defaultSchema);
    // } else if (props?.props?.typeOfBusiness == 12 || idLocal == 12) {
    //   newDataValidation = companySchema;
    //   // setDataValidation(defaultSchema && companySchema);
    // } else if (props?.props?.typeOfBusiness == 8 || idLocal == 8) {
    //   newDataValidation = petrolPumpSchema;
    //   // setDataValidation(defaultSchema && petrolPumpSchema);
    // } else if (props?.props?.typeOfBusiness == 11 || idLocal == 11) {
    //   newDataValidation = cinemaHallSchema;
    //   // setDataValidation(defaultSchema && cinemaHallSchema);
    // }

    // mergedSchema = {
    //   defaultSchema,
    //   newDataValidation,
    // };
    // console.log("rr33", mergedSchema, dataValidation);
    // setDataValidation(mergedSchema);
  }, [props?.props?.typeOfBusiness, idLocal]);

  console.log("daoNameLocal", daoNameLocal);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState(null);
  const [showVardiOther, setShowVardiOther] = useState([]);
  const user = useSelector((state) => state.user.user);

  console.log("user", user);

  const [villages, setVillages] = useState();

  // getVillages
  const getVillages = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setVillages(
          res?.data?.village?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            villageNameEn: r.villageName,
            villageNameMr: r.villageNameMr,
          }))
        );
      });
  };

  useEffect(() => {
    if (user) {
      setValue("applicantName", user?.firstName);
      setValue("applicantNameMr", user?.firstNamemr);
      setValue("applicantMiddleName", user?.middleName);
      setValue("applicantMiddleNameMr", user?.middleNamemr);
      setValue("applicantLastName", user?.surname);
      setValue("applicantLastNameMr", user?.surnamemr);
      setValue("emailId", user?.emailID);
      setValue("mobileNo", user?.mobile);
      setValue(
        "applicantAddress",
        "Building No: " +
          user?.cflatBuildingNo +
          ", " +
          user?.cbuildingName +
          user?.clandmark +
          " " +
          ", " +
          user?.ccity +
          "-" +
          user?.cpinCode
      );
      setValue(
        "applicantAddressMr",
        "इमारत क्रमांक: " +
          user?.cflatBuildingNo +
          ", " +
          user?.cbuildingNameMr +
          user?.clandmarkMr +
          " " +
          ", " +
          user?.ccityMr +
          "-" +
          user?.cpinCode
      );
    }
  }, [user]);

  // Fetch User From cfc User (Optional)

  // fire station multiselect
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);

  const [IsRentalApplicant, setIsApplicantIsRental] = useState(false);

  // For Checked and UnCheck Checkbox
  const handlePaddressCheck = (e) => {
    console.log("e.target.checked", e.target.checked);
    setIsApplicantIsRental(e.target.checked);
  };

  const [shifts, setShift] = useState();

  const [stateName, setStateName] = useState();

  const [shrinkState, setShrinkState] = useState(false);

  const [formEditId, setFormEditId] = useState();

  console.log("nocNumber", watch("nocNumber"));

  const [renewData, setRenewData] = useState();

  const [nocNumberValue, setNocNumberValue] = useState();

  // console.log(nocNumberValue, )

  // Renew Data Load

  const handleTableData = () => {
    setDisableButtonInputState(true);
    axios
      .get(
        // `${urls.FbsURL}/master/userRoleMenu/getByUserIdAndApplicationId?userId=${selectedUser}&applicationId=${selectedApplicationR}`
        // `http://192.168.29.122:10090/cfc/api/master/userRoleMenu/getByUserIdAndApplicationId?userId=${selectedUser}&applicationId=${selectedApplicationR}`
        `${urls.FbsURL}/transaction/trnBussinessNOC/getByNocNo?nocNo=${watch(
          "nocNumber"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setDisableButtonInputState(true);

        if (r.status == 200) {
          console.log("menjus", r?.data);
          reset(r?.data);
          // reset({ ...r?.data, exclude: ["nocType"] });
          setRenewData(r?.data);
          getDocuments();
        }
      })
      .catch((err) => {
        setDisableButtonInputState(true);

        console.log("err", err);
      });
  };

  const [isStarHotel, setIsStarHotel] = useState();

  useEffect(() => {
    console.log("router.query", typeof +router.query.idState);
    console.log("gggggg", getValues());
    let appId = getValues("id");
    console.log("getValues", getValues("id"));
    // reset(router.query);
    if (appId) {
      axios
        .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getById?id=${appId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log(
            "res?.data?.IsRentalApplicant",
            res?.data?.IsRentalApplicant
          );
          reset(res?.data);

          setIsStarHotel(res?.data?.hotelDTLDao?.isStarHotel);
          console.log(
            "res?.data?.hotelDTLDao?.isStarHotel",
            res?.data?.hotelDTLDao?.isStarHotel
          );

          setIsApplicantIsRental(
            // res?.data?.IsRentalApplicant == "Y" ? true : false
            res?.data?.isRentalApplicant == true ? true : false
          );

          setValue(
            "IsRentalApplicant",
            res?.data?.IsRentalApplicant == true ? true : false
          );

          console.log("res?.data?.45", res?.data?.IsRentalApplicant);

          setShrinkState(true);

          Object.keys(res?.data)
            .filter((d, i) => d)
            .forEach((k) => {
              if (k == "companyDTLDao") {
                console.log(
                  "pratikshak",
                  res?.data?.companyDTLDao?.typeOfCompany
                );
                setFormEditId(k);
              }
              return console.log("33333", k);
            });
        });
    }
  }, []);

  useEffect(() => {
    console.log("121212", props?.props);
    if (watch("attachments") == null || watch("attachments")?.lenght == 0) {
      getDocuments();
    }
  }, [watch("attachments")]);

  useEffect(() => {
    setValue("daoName", daoNameLocal);
    setDaoName("daoName", daoNameLocal);

    setValue("typeOfBusiness", idLocal);

    console.log(
      "router.query.IsRentalApplicant",
      router.query.IsRentalApplicant
    );
  }, []);

  console.log("daoName", daoName);

  const getShiftData = () => {
    axios
      .get(`${urls.FbsURL}/employeeShiftMaster/getEmployeeShiftMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setShift(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  {
    console.log("idLocal", idLocal);
  }
  const getDocuments = () => {
    axios
      .get(
        `${urls.FbsURL}/businessAndServiceMapping/getAllServiceWiseCheckList?typeOfBusinessId=${idLocal}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(
          "res?.data?.serviceWiseChecklist",
          res?.data?.serviceWiseChecklist
        );
        setValue(
          "attachmentss",
          res?.data?.serviceWiseChecklist?.map((r, ind) => {
            return {
              ...r,
              docKey: r.id,
              id: null,
              status: r.isDocumentMandetory ? "Mandatory" : "Not Mandatory",
              srNo: ind + 1,
              filePath: null,
              documentChecklistEn: r?.documentChecklistEn,
              documentChecklistMr: r?.documentChecklistMr,

              // id: null,
              // isDocumentMandetory: r?.isDocumentMandetory
              //   ? "Mandatory"
              //   : "Not Mandatory",
              // department: r?.department,
              // service: r?.service,
              // document: r?.document,
              // documentChecklistEn: r?.documentChecklistEn,
              // documentChecklistMr: r?.documentChecklistMr,
              // documentType: r?.documentType,
              // usageType: r?.usageType,
              activeFlag: r?.activeFlag,
            };
          })
        );
        // setAttachment("attachments", res?.data?.serviceWiseChecklist);
      })
      .catch((err) => console.log("1234", err));
  };

  const _handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedModuleName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const _handleChangeEmp = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setSelectedEmployeeName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getVillages();
    getBusinessData();
    getNocNumber();
    // getApplicationDataByNocNumber();
  }, []);
  // }, [watch("nocType" && "nocType" == "Renew")]);

  const [dataSource, setDataSource] = useState();

  const getBusinessData = () => {
    axios
      .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("FBS Data(PROVISIONAL DATA)", res.data.bussiness);
        setDataSource(res?.data?.bussiness);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const [nocNumberGet, setNocNumberGet] = useState();

  const getNocNumber = () => {
    setOpen(true);

    axios
      .get(
        `${urls.FbsURL}/transaction/trnBussinessNOC/getByTypeOfBusiness?typeOfBusiness=${idLocal}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setOpen(false);

        console.log("NOC Number", res.data);
        setNocNumberGet(res?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getShiftData();
    getUser();
    getVardiTypes();
    getFireStationName();
    getPinCode();
    getSubVardiTypes();
    getEmpFire();
    getBusinessType();
    getDocuments();
    getTypesOfComapany();
  }, []);

  const [fireStation, setfireStation] = useState();

  // get fire station name
  const getFireStationName = () => {
    setOpen(true);
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
        setOpen(false);
        // const filData = res?.data.find((f) => f.fireStation == empFire);
        // console.log("resss", filData);
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
        console.log("vardi", res?.data);
        setVardiTypes(res?.data);
      });
  };

  const [documentShow, setDocumentShow] = useState(false);

  useEffect(() => {
    console.log(
      "props.typeOfBusiness",
      props?.props?.idState && props?.idState
    );

    setValue("stateName", idLocal);
    setStateName(idLocal);

    if (props?.props?.docPriview) {
      setDocumentShow(true);
      reset(props?.props);

      setIsApplicantIsRental(
        props?.props?.isRentalApplicant == true ? true : false
      );
      setValue(
        "IsRentalApplicant",
        props?.props?.isRentalApplicant == true ? true : false
      );

      console.log("ttttttt", getValues());
      setValue(
        `shaleyPoshanAaharDTLDao?.requireNocAreaInSqMtrs`,
        props?.props?.shaleyPoshanAaharDTLDao?.requireNocAreaInSqMtrs
      );
      console.log(
        "props45",
        props?.props?.shaleyPoshanAaharDTLDao?.requireNocAreaInSqMtrs
      );
    }
  }, []);

  const [bussinessTypes, setBussinessTypes] = useState();

  // Get Table - Data
  const getBusinessType = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBussinessTypes(res.data);
        console.log("res.data", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [subVardiType, setSubVardiType] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get NOC Number
  // const [applicationData, setApplicationData] = useState();

  // const getApplicationDataByNocNumber = () => {
  //   axios
  //     .get
  //     // `${urls.FbsURL}/transaction/trnBussinessNOC/getByNocNo?nocNo=${nocNumber}`
  //     ()
  //     .then((res) => {
  //       console.log("FBS Data(PROVISIONAL DATA)", res.data);
  //       setApplicationData(res?.data);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });
  // };

  // Employee and fire station mapping
  const [typeOfCompanyS, setTypeOfCompanyS] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
  // get Vardi Types
  const getTypesOfComapany = () => {
    axios
      .get(`${urls.FbsURL}/master/typeOfCompany/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("sub6666", res?.data?.typeOfCompany);
        setTypeOfCompanyS(res?.data?.typeOfCompany);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Employee and fire station mapping
  const [empFire, setEmpFire] = useState();

  // transaction/subTypeOfVardi/getSubTypeOfVardiMasterData
  // get Vardi Types
  const getEmpFire = () => {
    axios
      .get(
        `${urls.FbsURL}/master/fireStationAndEmployeeDetailsMapping/getAll`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("sub6666", res?.data?.stationAndEmployeeDetailsMapping);
        setEmpFire(res?.data?.stationAndEmployeeDetailsMapping);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("showVardiOther", router?.query);

  const onSubmitForm = (fromData) => {
    console.log("idLocal000 && idLocal000", fromData?.nocType);

    console.log("fromData", fromData, watch("nocNumber"));

    const finalBody = {
      attachments:
        watch("attachmentss") == undefined
          ? []
          : [...watch("attachmentss")?.filter((r) => r.filePath)],

      nocType: nocTypeState == "Renew" ? "Renew" : "New",

      nocNumber: fromData?.nocNo,

      emergencyPersonContactNo: fromData?.emergencyPersonContactNo,
      businessAddressMr: fromData?.businessAddressMr,
      isFireEquipmentAvailable: fromData?.isFireEquipmentAvailable,
      listOfFireEquipments: fromData?.listOfFireEquipments,

      id: router?.query?.idState ? +router?.query?.idState : null,

      applicantName: fromData?.applicantName,

      applicantNameMr: fromData?.applicantNameMr,

      applicantMiddleName: fromData?.applicantMiddleName,

      //   nOCFor: fromData?.nOCFor,

      applicantMiddleNameMr: fromData?.applicantMiddleNameMr,

      applicantLastName: fromData?.applicantLastName,

      applicantLastNameMr: fromData?.applicantLastNameMr,

      applicantAddress: fromData?.applicantAddress,

      applicantAddressMr: fromData?.applicantAddressMr,

      mobileNo: fromData?.mobileNo,

      emailId: fromData?.emailId,

      IsRentalApplicant: fromData?.IsRentalApplicant == true ? true : false,

      // Owner Details

      ownerName: fromData?.ownerName,

      ownerNameMr: fromData?.ownerNameMr,

      ownerMiddleName: fromData?.ownerMiddleName,

      ownerMiddleNameMr: fromData?.ownerMiddleNameMr,

      ownerLastName: fromData?.ownerLastName,

      ownerLastNameMr: fromData?.ownerLastNameMr,

      ownerAddress: fromData?.ownerAddress,

      ownerAddressMr: fromData?.ownerAddressMr,

      ownerMobileNo: fromData?.ownerMobileNo,

      ownerEmailId: fromData?.ownerEmailId,

      // Business Detailss

      firmName: fromData?.firmName,

      zoneKey: fromData?.zoneKey,

      firmNameMr: fromData?.firmNameMr,

      // zone List

      propertyNo: fromData?.propertyNo,

      shopNo: fromData?.shopNo,

      plotNo: fromData?.plotNo,

      buildingName: fromData?.buildingName,

      buildingNameMr: fromData?.buildingNameMr,

      gatNo: fromData?.gatNo,

      citySurveyNo: fromData?.citySurveyNo,

      roadName: fromData?.roadName,

      landmark: fromData?.landmark,

      area: fromData?.area,

      //   roadNameMr: fromData?.roadNameMr,

      //   landmarkMr: fromData?.landmarkMr,

      //   areaMr: fromData?.areaMr,

      village: fromData?.village,

      pincode: fromData?.pincode,

      officeContactNo: fromData?.officeContactNo,

      workingOnsitePersonMobileNo: fromData?.workingOnsitePersonMobileNo,

      officeMailId: fromData?.officeMailId,

      lattitude: fromData?.lattitude,

      longitude: fromData?.longitude,

      typeOfBusiness: fromData?.typeOfBusiness,

      unit: fromData?.unit,
      capacity: fromData?.capacity,
      height: fromData?.height,
      businessAddress: fromData?.businessAddress,

      typeOfCompany: fromData?.companyDTLDao?.typeOfCompany,

      // shaleyPoshanAaharDTLDao : {
      //   requireNocAreaInSqMtrs: fromData?.shaleyPoshanAaharDTLDao?.requireNocAreaInSqMtrs
      // }

      // onSubmitForm

      [daoNameLocal]: {
        id: router?.query?.idState ? +router?.query?.idState : null,

        // Newly Added

        isStarHotel: fromData?.[daoNameLocal]?.isStarHotel,
        carpetArea: fromData?.[daoNameLocal]?.carpetArea,
        chargebalArea: fromData?.[daoNameLocal]?.chargebalArea,

        firmOwnerName: fromData?.[daoNameLocal]?.firmOwnerName,
        mobNo: fromData?.[daoNameLocal]?.mobNo,
        aadharNo: fromData?.[daoNameLocal]?.aadharNo,
        waterConnectionNo: fromData?.[daoNameLocal]?.waterConnectionNo,
        meterConnectionNo: fromData?.[daoNameLocal]?.meterConnectionNo,
        shopActNo: fromData?.[daoNameLocal]?.shopActNo,
        waterTaxReceipt: fromData?.[daoNameLocal]?.waterTaxReceipt,
        lightBillCopy: fromData?.[daoNameLocal]?.lightBillCopy,
        sactionPlanNo: fromData?.[daoNameLocal]?.sactionPlanNo,
        sactionPlanDate: moment(
          fromData?.[daoNameLocal]?.sactionPlanDate
        ).format("YYYY-MM-DD"),
        occupancyCertificateNo:
          fromData?.[daoNameLocal]?.occupancyCertificateNo,
        occupancyCertificateDate: moment(
          fromData?.[daoNameLocal]?.occupancyCertificateDate
        ).format("YYYY-MM-DD"),
        finalFireNocNo: fromData?.[daoNameLocal]?.finalFireNocNo,
        finalFireNocDate: moment(
          fromData?.[daoNameLocal]?.finalFireNocDate
        ).format("YYYY-MM-DD"),

        // end

        // shaley poshan aahar
        sittingCapacity: fromData?.[daoNameLocal]?.sittingCapacity,
        requireNocAreaInSqMtrs:
          fromData?.[daoNameLocal]?.requireNocAreaInSqMtrs,

        // company
        typeOfCompany: fromData?.[daoNameLocal]?.typeOfCompany,
        // typeOfCompany: fromData?.companyDTLDao?.typeOfCompany,

        businessDetails: fromData?.[daoNameLocal]?.businessDetails,
        rawMaterialDetails: fromData?.[daoNameLocal]?.rawMaterialDetails,
        finalMaterialDetails: fromData?.[daoNameLocal]?.finalMaterialDetails,
        listOfHazardousMaterial:
          fromData?.[daoNameLocal]?.listOfHazardousMaterial,
        emergencyContactPersonDetails:
          fromData?.[daoNameLocal]?.emergencyContactPersonDetails,
        securityArrangement: fromData?.[daoNameLocal]?.securityArrangement,

        // hospital
        noOfBeds: fromData?.[daoNameLocal]?.noOfBeds,
        requireNocForHospitalInSqMtrs:
          fromData?.[daoNameLocal]?.requireNocForHospitalInSqMtrs,

        // petrol
        requireNocAreaForPetrolDieselCngPumpInSqMtrs:
          fromData?.[daoNameLocal]
            ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs,
        noOfDispensingUnits: fromData?.[daoNameLocal]?.noOfDispensingUnits,
        fuelTankCapacity: fromData?.[daoNameLocal]?.fuelTankCapacity,
        lengthAndWidthOfCascadeForCng:
          fromData?.[daoNameLocal]?.lengthAndWidthOfCascadeForCng,
        noOfFireFightingTrainedPerson:
          fromData?.[daoNameLocal]?.noOfFireFightingTrainedPerson,
        detailsOfFireFightingEquipments:
          fromData?.[daoNameLocal]?.detailsOfFireFightingEquipments,
        fireFightingWaterTankCapacity:
          fromData?.[daoNameLocal]?.fireFightingWaterTankCapacity,
        usageOfDryGrassCottonOrInflatable:
          fromData?.[daoNameLocal]?.usageOfDryGrassCottonOrInflatable,
        listOfEmergencyContactNumberNoSmokingSignBoards:
          fromData?.[daoNameLocal]
            ?.listOfEmergencyContactNumberNoSmokingSignBoards,
        typesOfWiringOpenClose:
          fromData?.[daoNameLocal]?.typesOfWiringOpenClose,
        lengthOfCascadeForCng: fromData?.[daoNameLocal]?.lengthOfCascadeForCng,
        widthOfCascadeForCng: fromData?.[daoNameLocal]?.widthOfCascadeForCng,
        batteryChargingStationUnit:
          fromData?.[daoNameLocal]?.batteryChargingStationUnit,
        noOfCasCade: fromData?.[daoNameLocal]?.noOfCasCade,
        capForCng: fromData?.[daoNameLocal]?.capForCng,

        // Hotel
        requireNOCAreainSqMtrs:
          fromData?.[daoNameLocal]?.requireNOCAreainSqMtrs,
        noOfEmployees: fromData?.[daoNameLocal]?.noOfEmployees,
        detailsOfFireFightingEquipments:
          fromData?.[daoNameLocal]?.detailsOfFireFightingEquipments,
        fireFightingWaterTankCapacity:
          fromData?.[daoNameLocal]?.fireFightingWaterTankCapacity,
        widthOfApproachRoad: fromData?.[daoNameLocal]?.widthOfApproachRoad,
        numberOfExit: fromData?.[daoNameLocal]?.numberOfExit,
        seatingCapacity: fromData?.[daoNameLocal]?.seatingCapacity,
        starHotel: fromData?.[daoNameLocal]?.starHotel,
        usageOfDryGrass: fromData?.[daoNameLocal]?.usageOfDryGrass,
        // securityArrangement: fromData?.[daoNameLocal]?.securityArrangement,
        parkingArrangement: fromData?.[daoNameLocal]?.parkingArrangement,
        listOfEmergencyContactNumber:
          fromData?.[daoNameLocal]?.listOfEmergencyContactNumber,
        typesOfWiring: fromData?.[daoNameLocal]?.typesOfWiring,
        arrangementOfLightingArrester:
          fromData?.[daoNameLocal]?.arrangementOfLightingArrester,
        emergencyContactPersonDetails:
          fromData?.[daoNameLocal]?.emergencyContactPersonDetails,
        area: fromData?.[daoNameLocal]?.area,

        // hotel lodgging.[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?..[daoNameLocal]?.
        noOfRooms: fromData?.[daoNameLocal]?.noOfRooms,

        // cinema
        eachScreenSeatingCapacity:
          fromData?.[daoNameLocal]?.eachScreenSeatingCapacity,
        noOfScreens: fromData?.[daoNameLocal]?.noOfScreens,
        // Logging - same as hotel lodgging

        // .fromData,
        foodAndDrugSafetyLicenseCopy:
          fromData?.[daoNameLocal]?.foodAndDrugSafetyLicenseCopy,
        nocAreaForPetrolPumpInSqMtrs:
          fromData?.[daoNameLocal]?.nocAreaForPetrolPumpInSqMtrs,
        noOfDespesingUnit: fromData?.[daoNameLocal]?.noOfDespesingUnit,
        lengthOfCascadeForCNG: fromData?.[daoNameLocal]?.lengthOfCascadeForCNG,
        widthOfCascadeForCNG: fromData?.[daoNameLocal]?.widthOfCascadeForCNG,

        // businessNocId: router?.query?.businessNocId
        //   ? router?.query?.businessNocId
        //   : null,
        //   id: router?.query?.vardiTypeId ? router.query.vardiTypeId : null,
      },
      createdUserId: user?.id,
    };

    console.log("finalBody", finalBody);

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${urls.FbsURL}/transaction/trnBussinessNOC/save`, finalBody, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (
              res?.data?.attachments == null ||
              res?.data?.attachments.length == 0
            ) {
              getDocuments();
            }
            if (res.status == 200) {
              fromData.id
                ? // sweetAlert("Application Updated")
                  swal({
                    title: "Application Updated Successfully",
                    text: "Record updated....!!",
                    icon: "success",
                    button: "Ok",
                  })
                : // : swal("Application Created Successfully !",  icon: "success",);
                  swal({
                    title: "Application Created Successfully",
                    text: "application send to the sub fire officer",
                    icon: "success",
                    button: "Ok",
                  });

              //   router.back();
              router.push({
                pathname: "/dashboard",
              });
              localStorage.removeItem("key");
              localStorage.removeItem("idState");
              localStorage.removeItem("typeOfBusiness");
              localStorage.removeItem("typeOfBusinessMr");
            }
          });
      }
    });
  };

  const [crPincodes, setCrPinCodes] = useState();

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    drawerWidth = 0;
  };

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

  const [filUser, setFilUser] = useState([]);

  let temp2 = [];
  useEffect(() => {
    console.log("values", values);

    // let temp = personName3.split(",").join();

    personName3.map((fStation) => {
      console.log("1fStation", fStation);
      empFire.forEach((mapping) => {
        console.log("1mapping", mapping.fireStation);
        let iddd = fireStation?.find(
          (fff) => fff?.fireStationName == fStation
        )?.id;
        console.log("iddd", iddd);
        console.log("2mapping", iddd == mapping.fireStation);
        if (iddd == mapping.fireStation) {
          console.log("mapping.user", mapping.user);
          temp2.push(mapping.user);
        }
      });
    });
    console.log("temp2222", temp2);
    let aa = [];
    console.log("userLst", userLst);
    temp2.map((fireEmp) => {
      userLst.forEach((user) => {
        console.log("fireEmp == user.id", fireEmp == user.id);
        if (fireEmp == user.id) {
          let a = {
            id: user.id,
            uname:
              user.firstNameEn +
              " " +
              user.middleNameEn +
              " " +
              user.lastNameEn,
          };
          aa.push(a);
          console.log("aala", a, fireEmp, user.id, user.firstNameEn);
        }
      });
    });
    setFilUser(aa);
    console.log("temp2", temp2, aa);
  }, [personName3]);

  console.log("filUser", filUser);

  const [userLst, setUserLst] = useState([]);

  // get employee from cfc
  const getUser = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setOpen(false);
        // const filData = empFire.find((f) => f.fireStation == fireStation);
        // res?.data?.user?.filter((f) => f.id == empFire);
        // console.log("filData", empFire);
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  // Filter User
  // const getFilter = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/user/getAll`)
  //     .then((res) => {
  //       console.log("pin", res?.data);
  //       setFilUser(res?.data?.user);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    informerName: "",
    informerNameMr: "",
    informerMiddleName: "",
    informerMiddleNameMr: "",
    informerLastName: "",
    informerLastNameMr: "",
    roadName: "",
    area: "",
    areaMr: "",
    city: "",
    cityMr: "",
    mailID: "",
    contactNumber: "",
    vardiPlace: "",
    vardiPlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    landmarkMr: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    fireStationName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    informerName: "",
    informerMiddleName: "",
    informerLastName: "",
    roadName: "",
    area: "",
    city: "",
    contactNumber: "",
    vardiPlace: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    landmark: "",
    vardiReceivedName: "",
    // dateAndTimeOfVardi: "",
    documentsUpload: "",
    mailID: "",
    fireStationName: "",
  };

  let documentsUpload = null;

  const shrinkFunction = (x) => {
    if (watch(`${x}`)) {
      return true;
    } else {
      return false;
    }
  };

  // View
  return (
    <>
      <Box
        style={{
          marginLeft: "4%",
          marginRight: "4%",
          marginTop: "-2.5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          Loading....
          <CircularProgress color="inherit" />
        </Backdrop>
        {!documentShow && (
          <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA" }}>
            <AppBar position="static" sx={{ backgroundColor: "#FBFCFC" }}>
              <Toolbar variant="dense">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{
                    mr: 2,
                    color: "#29100B9",
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      border: "1px solid blue",
                      color: "blue",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      localStorage.removeItem("key");
                      localStorage.removeItem("idState");
                      localStorage.removeItem("typeOfBusiness");
                      localStorage.removeItem("typeOfBusinessMr");
                      router.push({
                        pathname:
                          "/FireBrigadeSystem/transactions/businessNoc/citizen/nocTypes",
                      });
                    }}
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
                  {language == "en" ? (
                    <>
                      <FormattedLabel id="businessNocOf" />
                      <nspb /> {formName}
                    </>
                  ) : (
                    <>
                      {formNameMr}
                      <nspb />
                      <FormattedLabel id="businessNocOf" />
                    </>
                  )}
                </Typography>

                {/* <Typography
            sx={{
              textAlignVertical: "center",
              textAlign: "center",
              color: "red",
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              typography: {
                xs: "body1",
                sm: "h6",
                md: "h6",
                lg: "h6",
                xl: "h6",
              },
            }}
          >
            {language == "en"
              ? router.query.typeOfBusiness
              : router.query.typeOfBusinessMr}
          </Typography> */}
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
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        error={errors.nocType}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="nocType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              // label="Ward Number"
                              label={<FormattedLabel id="nocType" />}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                setNocTypeState(value.target.value);
                              }}
                              sx={{ backgroundColor: "white" }}
                            >
                              <MenuItem value="New">New</MenuItem>
                              <MenuItem value="Renew">Renew</MenuItem>
                            </Select>
                          )}
                          name="nocType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.nocType ? errors.nocType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      {nocTypeState == "Renew" && (
                        <>
                          <FormControl size="small" sx={{ width: "90%" }}>
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="nocNumber" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  style={{ backgroundColor: "white" }}
                                  error={errors?.nocNumber ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Ward Number"
                                  label={<FormattedLabel id="nocNumber" />}
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    setNocNumberValue(value.target.value);
                                  }}
                                  sx={{ backgroundColor: "white" }}
                                >
                                  {nocNumberGet == null
                                    ? setOpen(true)
                                    : nocNumberGet?.map((d, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={d.nocNo}
                                            sx={{
                                              display: d.nocNo
                                                ? "flex"
                                                : "none",
                                            }}
                                          >
                                            {d.nocNo}
                                          </MenuItem>
                                        );
                                      })}
                                </Select>
                              )}
                              name="nocNumber"
                              control={control}
                              // defaultValue=''
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.nocNumber
                                ? errors?.nocNumber?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={1} className={styles.feildres}>
                      {nocTypeState == "Renew" && (
                        <>
                          <Button
                            // disabled={disableButtonInputState}
                            disabled={!watch("nocNumber")}
                            onClick={() => {
                              handleTableData();
                              // handleApplicationNameChange();
                              // setButtonShow(true);
                            }}
                            // disabled={load}
                            // disabled={!watch("applicationName")}
                            variant="contained"
                            sx={{
                              backgroundColor: "#2E86C1",
                              "&:hover": {
                                backgroundColor: "#498FD5",
                                fontSize: "14px",
                                padding: "6px 9px 6px 9px",
                              },
                              textTransform: "capitalize",
                            }}
                            size="small"
                          >
                            Search
                            <SearchIcon
                              style={{ fontSize: "28px", paddingLeft: "3px" }}
                            />
                          </Button>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={3} className={styles.feildres}></Grid>
                  </Grid>
                  <br />
                  <br />
                  <br />

                  <Box className={styles.tableHead}>
                    <Box className={styles.feildHead}>
                      {<FormattedLabel id="applicantDetails" />}
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
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantName"}
                        labelName={
                          <FormattedLabel id="applicantName" required />
                        }
                        fieldName={"applicantName"}
                        updateFieldName={"applicantNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={true}
                        label={<FormattedLabel id="applicantName" required />}
                        error={!!errors.applicantName}
                        helperText={
                          errors?.applicantName
                            ? errors.applicantName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantMiddleName"}
                        labelName={
                          <FormattedLabel id="applicantMiddleName" required />
                        }
                        fieldName={"applicantMiddleName"}
                        updateFieldName={"applicantMiddleNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantMiddleName" required />
                        }
                        error={!!errors.applicantMiddleName}
                        helperText={
                          errors?.applicantMiddleName
                            ? errors.applicantMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantLastName"}
                        labelName={
                          <FormattedLabel id="applicantLastName" required />
                        }
                        fieldName={"applicantLastName"}
                        updateFieldName={"applicantLastNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantLastName" required />
                        }
                        error={!!errors.applicantLastName}
                        helperText={
                          errors?.applicantLastName
                            ? errors.applicantLastName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantNameMr"}
                        labelName={
                          <FormattedLabel id="applicantNameMr" required />
                        }
                        fieldName={"applicantNameMr"}
                        updateFieldName={"applicantName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={true}
                        label={<FormattedLabel id="applicantNameMr" required />}
                        error={!!errors.applicantNameMr}
                        helperText={
                          errors?.applicantNameMr
                            ? errors.applicantNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantMiddleNameMr"}
                        labelName={
                          <FormattedLabel id="applicantMiddleNameMr" required />
                        }
                        fieldName={"applicantMiddleNameMr"}
                        updateFieldName={"applicantName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantMiddleNameMr" required />
                        }
                        error={!!errors.applicantMiddleNameMr}
                        helperText={
                          errors?.applicantMiddleNameMr
                            ? errors.applicantMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantLastNameMr"}
                        labelName={
                          <FormattedLabel id="applicantLastNameMr" required />
                        }
                        fieldName={"applicantLastNameMr"}
                        updateFieldName={"applicantName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantLastNameMr" required />
                        }
                        error={!!errors.applicantLastNameMr}
                        helperText={
                          errors?.applicantLastNameMr
                            ? errors.applicantLastNameMr.message
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        InputLabelProps={{
                          shrink: { shrinkState },
                        }}
                        // InputLabelProps={watch("finalAhawal.finacialLossMr") ? true : false}
                        size="small"
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="mobileNo" />}
                        {...register("mobileNo")}
                        disabled={true}
                        error={!!errors.mobileNo}
                        helperText={
                          errors?.mobileNo ? errors.mobileNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="emailId" />}
                        {...register("emailId")}
                        disabled={true}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                  <br />

                  <Grid
                    container
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    className={styles.feildres}
                    spacing={4}
                  >
                    <Grid item xs={12} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantAddress"}
                        labelName={
                          <FormattedLabel id="applicantAddress" required />
                        }
                        fieldName={"applicantAddress"}
                        updateFieldName={"applicantAddressMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantAddress" required />
                        }
                        error={!!errors.applicantAddress}
                        helperText={
                          errors?.applicantAddress
                            ? errors.applicantAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} className={styles.feildres}>
                      <Transliteration
                        variant={"outlined"}
                        _key={"applicantAddressMr"}
                        labelName={
                          <FormattedLabel id="applicantAddressMr" required />
                        }
                        fieldName={"applicantAddressMr"}
                        updateFieldName={"applicantAddress"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        disabled={true}
                        label={
                          <FormattedLabel id="applicantAddressMr" required />
                        }
                        error={!!errors.applicantAddressMr}
                        helperText={
                          errors?.applicantAddressMr
                            ? errors.applicantAddressMr.message
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
                    spacing={4}
                  >
                    <Grid item xs={3} className={styles.feildres}>
                      <FormControlLabel
                        sx={{ marginLeft: 1 }}
                        control={
                          <Controller
                            name="IsRentalApplicant"
                            //permanentAddress
                            control={control}
                            render={({ field: props }) => (
                              <Checkbox
                                {...props}
                                checked={IsRentalApplicant}
                                onChange={(e) => {
                                  handlePaddressCheck(e);
                                  console.log("000", e.target.checked);
                                  // setCheckBoxValue(e.target.checked);
                                  props.onChange(e.target.checked);
                                }}
                              />
                            )}
                          />
                        }
                        label={<FormattedLabel id="IfApplicantIsRental" />}
                      />
                    </Grid>
                    <Grid item xs={9} className={styles.feildres}></Grid>
                  </Grid>
                </>
                <br />
                {IsRentalApplicant == true && (
                  <>
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {<FormattedLabel id="ownerDetails" />}
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
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerName"}
                          labelName={<FormattedLabel id="ownerName" required />}
                          fieldName={"ownerName"}
                          updateFieldName={"ownerNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="ownerName" required />}
                          error={!!errors.ownerName}
                          helperText={
                            errors?.ownerName ? errors.ownerName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerMiddleName"}
                          labelName={
                            <FormattedLabel id="ownerMiddleName" required />
                          }
                          fieldName={"ownerMiddleName"}
                          updateFieldName={"ownerMiddleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="ownerMiddleName" required />
                          }
                          error={!!errors.ownerMiddleName}
                          helperText={
                            errors?.ownerMiddleName
                              ? errors.ownerMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerLastName"}
                          labelName={
                            <FormattedLabel id="ownerLastName" required />
                          }
                          fieldName={"ownerLastName"}
                          updateFieldName={"ownerLastNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="ownerLastName" required />}
                          error={!!errors.ownerLastName}
                          helperText={
                            errors?.ownerLastName
                              ? errors.ownerLastName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerNameMr"}
                          labelName={
                            <FormattedLabel id="ownerNameMr" required />
                          }
                          fieldName={"ownerNameMr"}
                          updateFieldName={"ownerName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="ownerNameMr" required />}
                          error={!!errors.ownerNameMr}
                          helperText={
                            errors?.ownerNameMr
                              ? errors.ownerNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerMiddleNameMr"}
                          labelName={
                            <FormattedLabel id="ownerMiddleNameMr" required />
                          }
                          fieldName={"ownerMiddleNameMr"}
                          updateFieldName={"ownerName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="ownerMiddleNameMr" required />
                          }
                          error={!!errors.ownerMiddleNameMr}
                          helperText={
                            errors?.ownerMiddleNameMr
                              ? errors.ownerMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerLastNameMr"}
                          labelName={
                            <FormattedLabel id="ownerLastNameMr" required />
                          }
                          fieldName={"ownerLastNameMr"}
                          updateFieldName={"ownerName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="ownerLastNameMr" required />
                          }
                          error={!!errors.ownerLastNameMr}
                          helperText={
                            errors?.ownerLastNameMr
                              ? errors.ownerLastNameMr.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerAddress"}
                          labelName={
                            <FormattedLabel id="ownerAddresss" required />
                          }
                          fieldName={"ownerAddress"}
                          updateFieldName={"ownerAddressMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="ownerAddresss" required />}
                          error={!!errors.ownerAddress}
                          helperText={
                            errors?.ownerAddress
                              ? errors.ownerAddress.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"ownerAddressMr"}
                          labelName={
                            <FormattedLabel id="ownerAddresssMr" required />
                          }
                          fieldName={"ownerAddressMr"}
                          updateFieldName={"ownerAddress"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="ownerAddresssMr" required />
                          }
                          error={!!errors.ownerAddressMr}
                          helperText={
                            errors?.ownerAddressMr
                              ? errors.ownerAddressMr.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          size="small"
                          sx={{ width: "100%" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="ownerMobileNo" />}
                          {...register("ownerMobileNo")}
                          error={!!errors.ownerMobileNo}
                          helperText={
                            errors?.ownerMobileNo
                              ? errors.ownerMobileNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          size="small"
                          sx={{ width: "100%" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="ownerEmailId" />}
                          {...register("ownerEmailId")}
                          error={!!errors.ownerEmailId}
                          helperText={
                            errors?.ownerEmailId
                              ? errors.ownerEmailId.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                    <br />
                  </>
                )}
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="businessDetails" />}
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
                    <Transliteration
                      variant={"outlined"}
                      _key={"firmName"}
                      labelName={<FormattedLabel id="firmName" required />}
                      fieldName={"firmName"}
                      updateFieldName={"firmNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="firmName" required />}
                      error={errors.firmName}
                      helperText={
                        errors?.firmName ? errors.firmName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <Transliteration
                      variant={"outlined"}
                      _key={"firmNameMr"}
                      labelName={<FormattedLabel id="firmNameMr" required />}
                      fieldName={"firmNameMr"}
                      updateFieldName={"firmName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="firmNameMr" required />}
                      error={!!errors.firmNameMr}
                      helperText={
                        errors?.firmNameMr ? errors.firmNameMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: "100%",
                      }}
                      variant="outlined"
                      error={!!errors.zoneKey}
                    >
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-outlined-label"
                      >
                        <FormattedLabel id="zone" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ backgroundColor: "white" }}
                            label={<FormattedLabel id="zone" />}
                            size="small"
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                          >
                            {zoneNames &&
                              zoneNames?.map((val, index) => (
                                <MenuItem key={index} value={val.id}>
                                  {language == "en"
                                    ? val.zoneName
                                    : val.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneKey ? errors?.zoneKey?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("propertyNo") ? true : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="propertyNo" />}
                      {...register("propertyNo")}
                      error={!!errors.propertyNo}
                      helperText={
                        errors?.propertyNo ? errors.propertyNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("shopNo") ? true : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="shopNo" />}
                      {...register("shopNo")}
                      error={!!errors.shopNo}
                      helperText={errors?.shopNo ? errors.shopNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("plotNo") ? true : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="plotNo" />}
                      {...register("plotNo")}
                      error={!!errors.plotNo}
                      helperText={errors?.plotNo ? errors.plotNo.message : null}
                    />
                  </Grid>
                </Grid>
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
                        shrink: watch("buildingName") ? true : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="buildingName" />}
                      {...register("buildingName")}
                      error={!!errors.buildingName}
                      helperText={
                        errors?.buildingName
                          ? errors.buildingName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("gatNo") ? true : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="gatNo" />}
                      {...register("gatNo")}
                      error={!!errors.gatNo}
                      helperText={errors?.gatNo ? errors.gatNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("citySurveyNo") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="citySurveyNo" />}
                      {...register("citySurveyNo")}
                      error={!!errors.citySurveyNo}
                      helperText={
                        errors?.citySurveyNo
                          ? errors.citySurveyNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("roadName") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="roadName" />}
                      {...register("roadName")}
                      error={!!errors.roadName}
                      helperText={
                        errors?.roadName ? errors.roadName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("landmark") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="landMark" />}
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("area") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="areaEn" />}
                      {...register("area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                </Grid>
                <br />
                {/* Village */}
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
                      }}
                      variant="outlined"
                      error={!!errors.village}
                    >
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-outlined-label"
                      >
                        <FormattedLabel id="village" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ backgroundColor: "white" }}
                            label={<FormattedLabel id="village" />}
                            size="small"
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                          >
                            {villages &&
                              villages?.map((val, index) => (
                                <MenuItem key={index} value={val.id}>
                                  {language == "en"
                                    ? val.villageNameEn
                                    : val.villageNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneKey ? errors?.zoneKey?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("pincode") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="pinCode" />}
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={
                        errors?.pincode ? errors.pincode.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("officeContactNo") ? true : false,
                      }}
                      sx={{
                        width: "100%",
                        backgroundColor: "white",
                      }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="officeContactNo" />}
                      {...register("officeContactNo")}
                      error={!!errors.officeContactNo}
                      helperText={
                        errors?.officeContactNo
                          ? errors.officeContactNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("unit") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="unit" />}
                      {...register("unit")}
                      error={!!errors.unit}
                      helperText={errors?.unit ? errors.unit.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("height") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="height" />}
                      {...register("height")}
                      error={!!errors.height}
                      helperText={errors?.height ? errors.height.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("officeMailId") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="officeMailId" />}
                      {...register("officeMailId")}
                      error={!!errors.officeMailId}
                      helperText={
                        errors?.officeMailId
                          ? errors.officeMailId.message
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
                  spacing={4}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("workingOnsitePersonMobileNo")
                          ? true
                          : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={
                        <FormattedLabel id="workingOnSitePersonMobileNo" />
                      }
                      {...register("workingOnsitePersonMobileNo")}
                      error={!!errors.workingOnsitePersonMobileNo}
                      helperText={
                        errors?.workingOnsitePersonMobileNo
                          ? errors.workingOnsitePersonMobileNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("capacity") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="capacity" />}
                      {...register("capacity")}
                      error={!!errors.capacity}
                      helperText={
                        errors?.capacity ? errors.capacity.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <Transliteration
                      variant={"outlined"}
                      _key={"businessAddress"}
                      labelName={
                        <FormattedLabel id="businessAddress" required />
                      }
                      fieldName={"businessAddress"}
                      updateFieldName={"businessAddressMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="businessAddress" required />}
                      error={!!errors.businessAddress}
                      helperText={
                        errors?.businessAddress
                          ? errors.businessAddress.message
                          : null
                      }
                    />
                  </Grid>
                  {/* new */}
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl size="small" sx={{ width: "100%" }}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="isFireEquipmentAvailable" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            style={{ backgroundColor: "white" }}
                            error={
                              errors?.isFireEquipmentAvailable ? true : false
                            }
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // label="Ward Number"
                            label={
                              <FormattedLabel id="isFireEquipmentAvailable" />
                            }
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            sx={{ backgroundColor: "white" }}
                          >
                            {values &&
                              values?.map((val, index) => (
                                <MenuItem key={index} value={val.name}>
                                  {language == "en" ? val.name : val.nameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="isFireEquipmentAvailable"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.isFireEquipmentAvailable
                          ? errors.isFireEquipmentAvailable.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("listOfFireEquipments") ? true : false,
                      }}
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      size="small"
                      label={<FormattedLabel id="listOfFireEquipments" />}
                      {...register("listOfFireEquipments")}
                      error={!!errors.listOfFireEquipments}
                      helperText={
                        errors?.listOfFireEquipments
                          ? errors.listOfFireEquipments.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <Transliteration
                      variant={"outlined"}
                      _key={"businessAddressMr"}
                      labelName={
                        <FormattedLabel id="businessAddressMr" required />
                      }
                      fieldName={"businessAddressMr"}
                      updateFieldName={"businessAddress"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      targetError={"businessAddress"}
                      // disabled={disabled}
                      label={<FormattedLabel id="businessAddressMr" required />}
                      error={!!errors.businessAddressMr}
                      helperText={
                        errors?.businessAddressMr
                          ? errors.businessAddressMr.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      InputLabelProps={{
                        shrink: watch("emergencyPersonContactNo")
                          ? true
                          : false,
                      }}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="outlined-basic"
                      variant="outlined"
                      label={<FormattedLabel id="emergencyPersonContactNo" />}
                      {...register("emergencyPersonContactNo")}
                      error={!!errors?.emergencyPersonContactNo}
                      helperText={
                        errors?.emergencyPersonContactNo
                          ? errors?.emergencyPersonContactNo.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <Button
                      sx={{
                        // marginTop: "5vh",
                        // margin: "normal",
                        width: 260,
                        // height: "40px",
                        color: "blue",
                        boxShadow: "5px 5px 3px gray",
                        backgroundColor: "white",
                        ":hover": {
                          boxShadow: "5px 5px 3px gray",
                          backgroundColor: "white",
                          color: "blue",
                          cursor: "pointer",
                          transition: "width 2s, height 2s, transform 2s",
                        },
                      }}
                      variant="contained"
                      // color='primary'
                      fullWidth
                      onClick={() => {
                        handleDrawerOpen();
                      }}
                    >
                      {/* <FormattedLabel id="viewLocationOnMap" /> */}
                      view Location On Map
                      <img
                        src="https://i.gadgets360cdn.com/large/google_maps_logo_1508317882579.jpg"
                        //hegiht='300px'
                        width="50px"
                        alt="Map Not Found"
                        // style={{ width: "100%", height: "100%" }}
                      />
                    </Button>
                    <Drawer
                      sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                          width: drawerWidth,
                        },
                      }}
                      variant="persistent"
                      anchor="right"
                      open={openDrawer}
                    >
                      <Box
                        style={{
                          left: 0,
                          position: "absolute",
                          top: "50%",
                          backgroundColor: "#bdbdbd",
                        }}
                      >
                        <IconButton
                          color="primary"
                          aria-label="open drawer"
                          // edge="end"
                          onClick={() => handleDrawerClose()}
                          sx={{
                            width: "30px",
                            height: "75px",
                            borderRadius: 0,
                          }}
                        >
                          <ArrowRightIcon />
                        </IconButton>
                      </Box>
                      <img
                        src="/map.png"
                        //hegiht='300px'
                        width="100px"
                        alt="Map Not Found"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Drawer>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                  <Grid item xs={4} className={styles.feildres}></Grid>
                </Grid>
                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="applicationDetails" />}
                  </Box>
                </Box>
                <br />

                {(props?.props?.typeOfBusiness == 4 ||
                  (idLocal && idLocal == 4)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.requireNOCAreainSqMtrs")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          {...register("hotelDTLDao.requireNOCAreainSqMtrs")}
                          error={!!errors?.hotelDTLDao?.requireNOCAreainSqMtrs}
                          helperText={
                            errors?.hotelDTLDao?.requireNOCAreainSqMtrs
                              ? errors?.hotelDTLDao?.requireNOCAreainSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.noOfEmployees")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="noOfEmployees" />}
                          {...register("hotelDTLDao.noOfEmployees")}
                          error={!!errors?.hotelDTLDao?.noOfEmployees}
                          helperText={
                            errors?.hotelDTLDao?.noOfEmployees
                              ? errors?.hotelDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "hotelDTLDao.detailsOfFireFightingEquipments"
                            )
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          {...register(
                            "hotelDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.hotelDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.hotelDTLDao?.detailsOfFireFightingEquipments
                              ? errors?.hotelDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "hotelDTLDao.fireFightingWaterTankCapacity"
                            )
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          {...register(
                            "hotelDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.hotelDTLDao?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.hotelDTLDao?.fireFightingWaterTankCapacity
                              ? errors?.hotelDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.widthOfApproachRoad")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          {...register("hotelDTLDao.widthOfApproachRoad")}
                          error={!!errors?.hotelDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.hotelDTLDao?.widthOfApproachRoad
                              ? errors?.hotelDTLDao?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.numberOfExit")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="numberOfExit" />}
                          {...register("hotelDTLDao.numberOfExit")}
                          error={!!errors?.hotelDTLDao?.numberOfExit}
                          helperText={
                            errors?.hotelDTLDao?.numberOfExit
                              ? errors?.hotelDTLDao?.numberOfExit.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.carpetArea")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="carpetArea" />}
                          {...register("hotelDTLDao.carpetArea")}
                          error={!!errors?.hotelDTLDao?.carpetArea}
                          helperText={
                            errors?.hotelDTLDao?.carpetArea
                              ? errors?.hotelDTLDao?.carpetArea.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("hotelDTLDao.chargebalArea")
                              ? true
                              : false,
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="chargebalArea" />}
                          {...register("hotelDTLDao.chargebalArea")}
                          error={!!errors?.hotelDTLDao?.chargebalArea}
                          helperText={
                            errors?.hotelDTLDao?.chargebalArea
                              ? errors?.hotelDTLDao?.chargebalArea.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10, width: "100%" }}
                          error={!!errors?.hotelDTLDao?.finalFireNocDate}
                        >
                          <Controller
                            control={control}
                            name="hotelDTLDao.finalFireNocDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Final Fire Noc Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      error={
                                        errors?.hotelDTLDao?.finalFireNocDate
                                          ? true
                                          : false
                                      }
                                      sx={{ backgroundColor: "white" }}
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
                            {errors?.hotelDTLDao?.finalFireNocDate ? (
                              <span style={{ color: "red" }}>
                                {errors?.hotelDTLDao?.finalFireNocDate.message}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            shrink: { shrinkState },
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={<FormattedLabel id="seatingCapacity" />}
                          {...register("hotelDTLDao.seatingCapacity")}
                          error={!!errors?.hotelDTLDao?.seatingCapacity}
                          helperText={
                            errors?.hotelDTLDao?.seatingCapacity
                              ? errors?.hotelDTLDao?.seatingCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={!!errors?.hotelDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.hotelDTLDao?.usageOfDryGrass
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hotelDTLDao?.usageOfDryGrass
                              ? errors?.hotelDTLDao?.usageOfDryGrass.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={!!errors?.hotelDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.hotelDTLDao?.securityArrangement
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hotelDTLDao?.securityArrangement
                              ? errors?.hotelDTLDao?.securityArrangement.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={!!errors?.hotelDTLDao?.parkingArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.hotelDTLDao?.parkingArrangement
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hotelDTLDao?.parkingArrangement
                              ? errors?.hotelDTLDao?.parkingArrangement.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={
                            !!errors?.hotelDTLDao?.listOfEmergencyContactNumber
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.hotelDTLDao
                                    ?.listOfEmergencyContactNumber
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.listOfEmergencyContactNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hotelDTLDao?.listOfEmergencyContactNumber
                              ? errors?.hotelDTLDao
                                  ?.listOfEmergencyContactNumber.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={
                            !!errors?.hotelDTLDao?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.hotelDTLDao
                                    ?.arrangementOfLightingArrester
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hotelDTLDao?.arrangementOfLightingArrester
                              ? errors?.hotelDTLDao
                                  ?.arrangementOfLightingArrester.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          {...register(
                            "hotelDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            !!errors?.hotelDTLDao?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.hotelDTLDao?.emergencyContactPersonDetails
                              ? errors?.hotelDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="hotelArea" />}
                          {...register("hotelDTLDao.area")}
                          error={errors?.hotelDTLDao?.area}
                          helperText={
                            errors?.hotelDTLDao?.area
                              ? errors.hotelDTLDao.area.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10, width: "100%" }}
                          error={
                            !!errors?.hotelDTLDao?.occupancyCertificateDate
                          }
                        >
                          <Controller
                            control={control}
                            name="hotelDTLDao.occupancyCertificateDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Occupancy Certificate Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{ backgroundColor: "white" }}
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
                            {errors?.hotelDTLDao?.occupancyCertificateDate
                              ? errors?.hotelDTLDao?.occupancyCertificateDate
                                  .message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="firmOwnerName" />}
                          {...register("hotelDTLDao.firmOwnerName")}
                          error={!!errors?.hotelDTLDao?.firmOwnerName}
                          helperText={
                            errors?.hotelDTLDao?.firmOwnerName
                              ? errors?.hotelDTLDao?.firmOwnerName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="mobileNo" />}
                          {...register("hotelDTLDao.mobNo")}
                          error={!!errors?.hotelDTLDao?.mobNo}
                          helperText={
                            errors?.hotelDTLDao?.mobNo
                              ? errors?.hotelDTLDao?.mobNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="aadharNo" />}
                          {...register("hotelDTLDao.aadharNo")}
                          error={!!errors?.hotelDTLDao?.aadharNo}
                          helperText={
                            errors?.hotelDTLDao?.aadharNo
                              ? errors?.hotelDTLDao?.aadharNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="waterConnectionNo" />}
                          {...register("hotelDTLDao.waterConnectionNo")}
                          error={!!errors?.hotelDTLDao?.waterConnectionNo}
                          helperText={
                            errors?.hotelDTLDao?.waterConnectionNo
                              ? errors?.hotelDTLDao?.waterConnectionNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="meterConnectionNo" />}
                          {...register("hotelDTLDao.meterConnectionNo")}
                          error={!!errors?.hotelDTLDao?.meterConnectionNo}
                          helperText={
                            errors?.hotelDTLDao?.meterConnectionNo
                              ? errors?.hotelDTLDao?.meterConnectionNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="shopActNo" />}
                          {...register("hotelDTLDao.shopActNo")}
                          error={!!errors?.hotelDTLDao?.shopActNo}
                          helperText={
                            errors?.hotelDTLDao?.shopActNo
                              ? errors?.hotelDTLDao?.shopActNo.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="sactionPlanNo" />}
                          {...register("hotelDTLDao.sactionPlanNo")}
                          error={!!errors?.hotelDTLDao?.sactionPlanNo}
                          helperText={
                            errors?.hotelDTLDao?.sactionPlanNo
                              ? errors?.hotelDTLDao?.sactionPlanNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="occupancyCertificateNo" />}
                          {...register("hotelDTLDao.occupancyCertificateNo")}
                          error={!!errors?.hotelDTLDao?.occupancyCertificateNo}
                          helperText={
                            errors?.hotelDTLDao?.occupancyCertificateNo
                              ? errors?.hotelDTLDao?.occupancyCertificateNo
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="finalFireNocNo" />}
                          {...register("hotelDTLDao.finalFireNocNo")}
                          error={!!errors?.hotelDTLDao?.finalFireNocNo}
                          helperText={
                            errors?.hotelDTLDao?.finalFireNocNo
                              ? errors?.hotelDTLDao?.finalFireNocNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10, width: "100%" }}
                          error={errors?.hotelDTLDao?.sactionPlanDate}
                        >
                          <Controller
                            control={control}
                            name="hotelDTLDao.sactionPlanDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      Sanction Plan Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{ backgroundColor: "white" }}
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
                            {errors?.hotelDTLDao?.sactionPlanDate
                              ? errors?.hotelDTLDao?.sactionPlanDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Add here */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          error={errors?.hotelDTLDao?.isStarHotel}
                        >
                          <InputLabel
                            variant="outlined"
                            id="demo-simple-select-outlined-label"
                          >
                            <FormattedLabel id="isStarHotel" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="isStarHotel" />}
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                  setIsStarHotel(value.target.value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelDTLDao.isStarHotel"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneKey ? errors?.zoneKey?.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        {console.log("isStarHotel", isStarHotel)}
                        {isStarHotel == 1 && (
                          <TextField
                            InputLabelProps={{
                              shrink: { shrinkState },
                            }}
                            sx={{ width: "100%", backgroundColor: "white" }}
                            id="outlined-basic"
                            variant="outlined"
                            size="small"
                            label={<FormattedLabel id="starHotel" />}
                            {...register("hotelDTLDao.starHotel")}
                            error={errors?.hotelDTLDao?.starHotel}
                            helperText={
                              errors?.hotelDTLDao?.starHotel
                                ? errors?.hotelDTLDao?.starHotel.message
                                : null
                            }
                          />
                        )}
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* Hotel Lodging */}
                {(props?.props?.typeOfBusiness == 5 ||
                  (idLocal && idLocal == 5)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{
                            width: "100%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "hoteLodggingDTLDao.requireNOCAreainSqMtrs"
                          )}
                          error={
                            !!errors?.hoteLodggingDTLDao?.requireNOCAreainSqMtrs
                          }
                          helperText={
                            errors?.hoteLodggingDTLDao?.requireNOCAreainSqMtrs
                              ? errors?.hoteLodggingDTLDao
                                  ?.requireNOCAreainSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("hoteLodggingDTLDao.noOfEmployees")}
                          error={errors?.hoteLodggingDTLDao?.noOfEmployees}
                          helperText={
                            errors?.hoteLodggingDTLDao?.noOfEmployees
                              ? errors?.hoteLodggingDTLDao?.noOfEmployees
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{
                            width: "100%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "hoteLodggingDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.hoteLodggingDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.hoteLodggingDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.hoteLodggingDTLDao
                                  ?.detailsOfFireFightingEquipments?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "hoteLodggingDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.hoteLodggingDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.hoteLodggingDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.hoteLodggingDTLDao
                                  ?.fireFightingWaterTankCapacity?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "hoteLodggingDTLDao.widthOfApproachRoad"
                          )}
                          error={
                            errors?.hoteLodggingDTLDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.hoteLodggingDTLDao?.widthOfApproachRoad
                              ? errors?.hoteLodggingDTLDao?.widthOfApproachRoad
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("hoteLodggingDTLDao.numberOfExit")}
                          error={errors?.hoteLodggingDTLDao?.numberOfExit}
                          helperText={
                            errors?.hoteLodggingDTLDao?.numberOfExit
                              ? errors?.hoteLodggingDTLDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="seatingCapacity" />}
                          variant="outlined"
                          {...register("hoteLodggingDTLDao.seatingCapacity")}
                          error={errors?.hoteLodggingDTLDao?.seatingCapacity}
                          helperText={
                            errors?.hoteLodggingDTLDao?.seatingCapacity
                              ? errors?.hoteLodggingDTLDao?.seatingCapacity
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        {/* <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors.usageOfDryGrass}
                        >
                          <InputLabel id='demo-simple-select-outlined-label'>
                            <FormattedLabel id='usageOfDryGrass' />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId='demo-simple-select-label'
                                id='demo-simple-select'
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id='usageOfDryGrass' />}
                                size='small'
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name='usageOfDryGrass'
                            control={control}
                            defaultValue=''
                          />
                          <FormHelperText>
                            {errors?.usageOfDryGrass
                              ? errors?.usageOfDryGrass?.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}
                        <FormControl size="small" sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={errors?.usageOfDryGrass ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.hoteLodggingDTLDao?.usageOfDryGrass
                              ? errors?.hoteLodggingDTLDao?.usageOfDryGrass
                                  .message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hoteLodggingDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hoteLodggingDTLDao?.securityArrangement
                              ? errors?.hoteLodggingDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.hoteLodggingDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hoteLodggingDTLDao?.parkingArrangement
                              ? errors?.hoteLodggingDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hoteLodggingDTLDao
                              ?.listOfEmergencyContactNumber
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.listOfEmergencyContactNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hoteLodggingDTLDao
                              ?.listOfEmergencyContactNumber
                              ? errors?.hoteLodggingDTLDao
                                  ?.listOfEmergencyContactNumber?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.hoteLodggingDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.typesOfWiring"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hoteLodggingDTLDao?.typesOfWiring
                              ? errors?.hoteLodggingDTLDao?.typesOfWiring
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hoteLodggingDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hoteLodggingDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hoteLodggingDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.hoteLodggingDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "hoteLodggingDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.hoteLodggingDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.hoteLodggingDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.hoteLodggingDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfRooms" />}
                          variant="outlined"
                          {...register("hoteLodggingDTLDao.noOfRooms")}
                          error={errors?.hoteLodggingDTLDao?.noOfRooms}
                          helperText={
                            errors?.hoteLodggingDTLDao?.noOfRooms
                              ? errors?.hoteLodggingDTLDao?.noOfRooms.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* Hotel Permit - hotelPermitroomDTLDao */}
                {(props?.props?.typeOfBusiness == 6 ||
                  (idLocal && idLocal == 6)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "governmentOfficesDao.requireNOCAreainSqMtrs"
                            )
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "hotelPermitroomDTLDao.requireNOCAreainSqMtrs"
                          )}
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.requireNOCAreainSqMtrs
                          }
                          helperText={
                            errors?.hotelPermitroomDTLDao
                              ?.requireNOCAreainSqMtrs
                              ? errors?.hotelPermitroomDTLDao
                                  ?.requireNOCAreainSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("governmentOfficesDao.noOfEmployees")
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("hotelPermitroomDTLDao.noOfEmployees")}
                          error={errors?.hotelPermitroomDTLDao?.noOfEmployees}
                          helperText={
                            errors?.hotelPermitroomDTLDao?.noOfEmployees
                              ? errors?.hotelPermitroomDTLDao?.noOfEmployees
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "hotelPermitroomDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.hotelPermitroomDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.hotelPermitroomDTLDao
                                  ?.detailsOfFireFightingEquipments?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "hotelPermitroomDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.hotelPermitroomDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.hotelPermitroomDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "hotelPermitroomDTLDao.widthOfApproachRoad"
                          )}
                          error={
                            errors?.hotelPermitroomDTLDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.hotelPermitroomDTLDao?.widthOfApproachRoad
                              ? errors?.hotelPermitroomDTLDao
                                  ?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("hotelPermitroomDTLDao.numberOfExit")}
                          error={errors?.hotelPermitroomDTLDao?.numberOfExit}
                          helperText={
                            errors?.hotelPermitroomDTLDao?.numberOfExit
                              ? errors?.hotelPermitroomDTLDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="seatingCapacity" />}
                          variant="outlined"
                          {...register("hotelPermitroomDTLDao.seatingCapacity")}
                          error={errors?.hotelPermitroomDTLDao?.seatingCapacity}
                          helperText={
                            errors?.hotelPermitroomDTLDao?.seatingCapacity
                              ? errors?.hotelPermitroomDTLDao?.seatingCapacity
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.hotelPermitroomDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao?.usageOfDryGrass
                              ? errors?.hotelPermitroomDTLDao?.usageOfDryGrass
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hotelPermitroomDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao?.securityArrangement
                              ? errors?.hotelPermitroomDTLDao
                                  ?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.hotelPermitroomDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao?.parkingArrangement
                              ? errors?.hotelPermitroomDTLDao
                                  ?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.listOfEmergencyContactNumber
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.listOfEmergencyContactNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao
                              ?.listOfEmergencyContactNumber
                              ? errors?.hotelPermitroomDTLDao
                                  ?.listOfEmergencyContactNumber?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.hotelPermitroomDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.typesOfWiring"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao?.typesOfWiring
                              ? errors?.hotelPermitroomDTLDao?.typesOfWiring
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hotelPermitroomDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hotelPermitroomDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.hotelPermitroomDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "hotelPermitroomDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.hotelPermitroomDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.hotelPermitroomDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.hotelPermitroomDTLDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="area" />}
                          variant="outlined"
                          {...register("hotelPermitroomDTLDao.area")}
                          error={!!errors?.hotelPermitroomDTLDao?.area}
                          helperText={
                            errors?.hotelPermitroomDTLDao?.area
                              ? errors?.hotelPermitroomDTLDao?.area.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* lodggingDTLDao */}
                {(props?.props?.typeOfBusiness == 7 ||
                  (idLocal && idLocal == 7)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.requireNOCAreainSqMtrs")}
                          error={
                            !!errors?.lodggingDTLDao?.requireNOCAreainSqMtrs
                          }
                          helperText={
                            errors?.lodggingDTLDao?.requireNOCAreainSqMtrs
                              ? errors?.lodggingDTLDao?.requireNOCAreainSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.noOfEmployees")}
                          error={!!errors?.lodggingDTLDao?.noOfEmployees}
                          helperText={
                            errors?.lodggingDTLDao?.noOfEmployees
                              ? errors?.lodggingDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "lodggingDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={!!errors?.detailsOfFireFightingEquipments}
                          helperText={
                            errors?.lodggingDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.lodggingDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "lodggingDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.lodggingDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.lodggingDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.lodggingDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.widthOfApproachRoad")}
                          error={!!errors?.lodggingDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.lodggingDTLDao?.widthOfApproachRoad
                              ? errors?.lodggingDTLDao?.widthOfApproachRoad
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.numberOfExit")}
                          error={!!errors?.lodggingDTLDao?.numberOfExit}
                          helperText={
                            errors?.lodggingDTLDao?.numberOfExit
                              ? errors?.lodggingDTLDao?.numberOfExit.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="seatingCapacity" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.seatingCapacity")}
                          error={!!errors?.lodggingDTLDao?.seatingCapacity}
                          helperText={
                            errors?.lodggingDTLDao?.seatingCapacity
                              ? errors?.lodggingDTLDao?.seatingCapacity.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors?.lodggingDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao?.usageOfDryGrass
                              ? errors?.lodggingDTLDao?.usageOfDryGrass?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors?.lodggingDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao?.securityArrangement
                              ? errors?.lodggingDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors?.lodggingDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao?.parkingArrangement
                              ? errors?.lodggingDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.lodggingDTLDao
                              ?.listOfEmergencyContactNumber
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.listOfEmergencyContactNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao
                              ?.listOfEmergencyContactNumber
                              ? errors?.lodggingDTLDao
                                  ?.listOfEmergencyContactNumber?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors?.lodggingDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.typesOfWiring"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao?.typesOfWiring
                              ? errors?.lodggingDTLDao?.typesOfWiring?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.lodggingDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lodggingDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lodggingDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.lodggingDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "lodggingDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            !!errors?.lodggingDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.lodggingDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.lodggingDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfRooms" />}
                          variant="outlined"
                          {...register("lodggingDTLDao.noOfRooms")}
                          error={errors?.lodggingDTLDao?.noOfRooms}
                          helperText={
                            errors?.lodggingDTLDao?.noOfRooms
                              ? errors?.lodggingDTLDao?.noOfRooms.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
                <br />
                {/* petrolPumpDTLDao */}
                {(props?.props?.typeOfBusiness == 8 ||
                  // formEditId == "petrolPumpDTLDao" ||
                  (idLocal && idLocal == 8)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="requireNocAreaForPetrolDieselCngPumpInSqMtrs" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.requireNocAreaForPetrolDieselCngPumpInSqMtrs"
                          )}
                          error={
                            !!errors?.petrolPumpDTLDao
                              ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                          }
                          helperText={
                            errors?.petrolPumpDTLDao
                              ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                              ? errors.petrolPumpDTLDao
                                  ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfDispensingUnits" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.noOfDispensingUnits")}
                          error={
                            !!errors?.petrolPumpDTLDao?.noOfDispensingUnits
                          }
                          helperText={
                            errors?.petrolPumpDTLDao?.noOfDispensingUnits
                              ? errors?.petrolPumpDTLDao?.noOfDispensingUnits
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="fuelTankCapacity" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.fuelTankCapacity")}
                          error={!!errors?.petrolPumpDTLDao?.fuelTankCapacity}
                          helperText={
                            errors?.petrolPumpDTLDao?.fuelTankCapacity
                              ? errors?.petrolPumpDTLDao?.fuelTankCapacity
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="lengthOfCascadeForCNG" />}
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.lengthOfCascadeForCng"
                          )}
                          error={
                            errors?.petrolPumpDTLDao?.lengthOfCascadeForCng
                          }
                          helperText={
                            errors?.petrolPumpDTLDao?.lengthOfCascadeForCng
                              ? errors?.petrolPumpDTLDao?.lengthOfCascadeForCng
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfCascadeForCNG" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.widthOfCascadeForCng")}
                          error={errors?.petrolPumpDTLDao?.widthOfCascadeForCng}
                          helperText={
                            errors?.petrolPumpDTLDao?.widthOfCascadeForCng
                              ? errors?.petrolPumpDTLDao?.widthOfCascadeForCng
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="noOfFireFightingTrainedPerson" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.noOfFireFightingTrainedPerson"
                          )}
                          error={
                            errors?.petrolPumpDTLDao
                              ?.noOfFireFightingTrainedPerson
                          }
                          helperText={
                            errors?.petrolPumpDTLDao
                              ?.noOfFireFightingTrainedPerson
                              ? errors?.petrolPumpDTLDao
                                  ?.noOfFireFightingTrainedPerson.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="batteryChargingStationUnit" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.batteryChargingStationUnit"
                          )}
                          error={
                            errors?.petrolPumpDTLDao?.batteryChargingStationUnit
                          }
                          helperText={
                            errors?.petrolPumpDTLDao?.batteryChargingStationUnit
                              ? errors?.petrolPumpDTLDao
                                  ?.batteryChargingStationUnit.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.noOfEmployees")}
                          error={errors?.petrolPumpDTLDao?.noOfEmployees}
                          helperText={
                            errors?.petrolPumpDTLDao?.noOfEmployees
                              ? errors?.petrolPumpDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.petrolPumpDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.petrolPumpDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.petrolPumpDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.petrolPumpDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.petrolPumpDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.petrolPumpDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.widthOfApproachRoad")}
                          error={errors?.petrolPumpDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.petrolPumpDTLDao?.widthOfApproachRoad
                              ? errors?.petrolPumpDTLDao?.widthOfApproachRoad
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.numberOfExit")}
                          error={errors?.petrolPumpDTLDao?.numberOfExit}
                          helperText={
                            errors?.petrolPumpDTLDao?.numberOfExit
                              ? errors?.petrolPumpDTLDao?.numberOfExit.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          variant="outlined"
                          size="small"
                          label={<FormattedLabel id="securityArrangement" />}
                          {...register("petrolPumpDTLDao.securityArrangement")}
                          error={errors?.petrolPumpDTLDao?.securityArrangement}
                          helperText={
                            errors?.petrolPumpDTLDao?.securityArrangement
                              ? errors?.petrolPumpDTLDao?.securityArrangement
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%" }}
                          error={errors?.petrolPumpDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                error={
                                  errors?.petrolPumpDTLDao?.usageOfDryGrass
                                    ? true
                                    : false
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // setusageOfDryGrassState(value.target.value);
                                }}
                                sx={{ backgroundColor: "white" }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.petrolPumpDTLDao?.usageOfDryGrass
                              ? errors?.petrolPumpDTLDao?.usageOfDryGrass
                                  .message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.petrolPumpDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.petrolPumpDTLDao?.securityArrangement
                              ? errors?.petrolPumpDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.petrolPumpDTLDao?.parkingArrangement}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.petrolPumpDTLDao?.parkingArrangement
                              ? errors?.petrolPumpDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.petrolPumpDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.petrolPumpDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.petrolPumpDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.petrolPumpDTLDao?.typesOfWiringOpenClose
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.petrolPumpDTLDao?.typesOfWiringOpenClose
                              ? errors?.petrolPumpDTLDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.petrolPumpDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="petrolPumpDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.petrolPumpDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.petrolPumpDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "petrolPumpDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.petrolPumpDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.petrolPumpDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors.petrolPumpDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfCasCade" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.noOfCasCade")}
                          error={errors?.petrolPumpDTLDao?.noOfCasCade}
                          helperText={
                            errors?.petrolPumpDTLDao?.noOfCasCade
                              ? errors?.petrolPumpDTLDao?.noOfCasCade.message
                              : null
                          }
                        />
                      </Grid>
                      {/* New added */}

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="capForCng" />}
                          variant="outlined"
                          {...register("petrolPumpDTLDao.capForCng")}
                          error={errors?.petrolPumpDTLDao?.capForCng}
                          helperText={
                            errors?.petrolPumpDTLDao?.capForCng
                              ? errors?.petrolPumpDTLDao?.capForCng.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}
                {/* hospitalDTLDao */}
                {(props?.props?.typeOfBusiness == 9 ||
                  (idLocal && idLocal == 9)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="requireNocForHospitalInSqMtrs" />
                          }
                          variant="outlined"
                          {...register(
                            "hospitalDTLDao.requireNocForHospitalInSqMtrs"
                          )}
                          error={
                            errors?.hospitalDTLDao
                              ?.requireNocForHospitalInSqMtrs
                          }
                          helperText={
                            errors?.hospitalDTLDao
                              ?.requireNocForHospitalInSqMtrs
                              ? errors?.hospitalDTLDao
                                  ?.requireNocForHospitalInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          variant="outlined"
                          label={<FormattedLabel id="noOfBeds" />}
                          {...register("hospitalDTLDao.noOfBeds")}
                          error={errors?.hospitalDTLDao?.noOfBeds}
                          helperText={
                            errors?.hospitalDTLDao?.noOfBeds
                              ? errors?.hospitalDTLDao?.noOfBeds?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="noOfFireFightingTrainedPerson" />
                          }
                          variant="outlined"
                          {...register(
                            "hospitalDTLDao.noOfFireFightingTrainedPerson"
                          )}
                          error={
                            errors?.hospitalDTLDao
                              ?.noOfFireFightingTrainedPerson
                          }
                          helperText={
                            errors?.hospitalDTLDao
                              ?.noOfFireFightingTrainedPerson
                              ? errors?.hospitalDTLDao
                                  ?.noOfFireFightingTrainedPerson.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("hospitalDTLDao.requireNocAreaInSqMtrs")}
                          error={errors?.hospitalDTLDao?.requireNocAreaInSqMtrs}
                          helperText={
                            errors?.hospitalDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.hospitalDTLDao?.requireNocAreaInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("hospitalDTLDao.noOfEmployees")}
                          error={errors?.hospitalDTLDao?.noOfEmployees}
                          helperText={
                            errors?.hospitalDTLDao?.noOfEmployees
                              ? errors?.hospitalDTLDao?.noOfEmployees?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "hospitalDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.hospitalDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.hospitalDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.hospitalDTLDao
                                  ?.detailsOfFireFightingEquipments?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "hospitalDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.hospitalDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.hospitalDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.hospitalDTLDao
                                  ?.fireFightingWaterTankCapacity?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("hospitalDTLDao.widthOfApproachRoad")}
                          error={errors?.hospitalDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.hospitalDTLDao?.widthOfApproachRoad
                              ? errors?.hospitalDTLDao?.widthOfApproachRoad
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("hospitalDTLDao.numberOfExit")}
                          error={errors?.hospitalDTLDao?.numberOfExit}
                          helperText={
                            errors?.hospitalDTLDao?.numberOfExit
                              ? errors?.hospitalDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="seatingCapacity" />}
                          variant="outlined"
                          {...register("hospitalDTLDao.sittingCapacity")}
                          error={errors?.hospitalDTLDao?.sittingCapacity}
                          helperText={
                            errors?.hospitalDTLDao?.sittingCapacity
                              ? errors?.hospitalDTLDao?.sittingCapacity?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.hospitalDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hospitalDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hospitalDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.hospitalDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={errors?.hospitalDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hospitalDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hospitalDTLDao?.securityArrangement
                              ? errors?.hospitalDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.hospitalDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hospitalDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hospitalDTLDao?.parkingArrangement
                              ? errors?.hospitalDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hospitalDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hospitalDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hospitalDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.hospitalDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "hospitalDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.hospitalDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.hospitalDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.hospitalDTLDao
                                  ?.emergencyContactPersonDetails.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.hospitalDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="hospitalDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.hospitalDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.hospitalDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>

                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}
                {/* dmartDTLDao */}
                {(props?.props?.typeOfBusiness == 10 ||
                  (idLocal && idLocal == 10)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("dmartDTLDao.requireNocAreaInSqMtrs")}
                          error={errors?.dmartDTLDao?.requireNocAreaInSqMtrs}
                          helperText={
                            errors?.dmartDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.dmartDTLDao?.requireNocAreaInSqMtrs
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("dmartDTLDao.noOfEmployees")}
                          error={errors?.dmartDTLDao?.noOfEmployees}
                          helperText={
                            errors?.dmartDTLDao?.noOfEmployees
                              ? errors?.dmartDTLDao?.noOfEmployees?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "dmartDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.dmartDTLDao?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.dmartDTLDao?.detailsOfFireFightingEquipments
                              ? errors?.dmartDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "dmartDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.dmartDTLDao?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.dmartDTLDao?.fireFightingWaterTankCapacity
                              ? errors?.dmartDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("dmartDTLDao.widthOfApproachRoad")}
                          error={errors?.dmartDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.dmartDTLDao?.widthOfApproachRoad
                              ? errors?.dmartDTLDao?.widthOfApproachRoad
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("dmartDTLDao.numberOfExit")}
                          error={errors?.dmartDTLDao?.numberOfExit}
                          helperText={
                            errors?.dmartDTLDao?.numberOfExit
                              ? errors?.dmartDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "dmartDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.dmartDTLDao?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.dmartDTLDao?.emergencyContactPersonDetails
                              ? errors?.dmartDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.dmartDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.dmartDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={errors?.dmartDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao?.securityArrangement
                              ? errors?.dmartDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.dmartDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao?.parkingArrangement
                              ? errors?.dmartDTLDao?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.dmartDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.dmartDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao?.typesOfWiringOpenClose
                              ? errors?.dmartDTLDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.dmartDTLDao?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dmartDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dmartDTLDao?.arrangementOfLightingArrester
                              ? errors?.dmartDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}

                {/* Mall Complex */}
                {(props?.props?.typeOfBusiness == 2 ||
                  (idLocal && idLocal == 2)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "mallComplexDTLDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            errors?.mallComplexDTLDao?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.mallComplexDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.mallComplexDTLDao
                                  ?.requireNocAreaInSqMtrs?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("mallComplexDTLDao.noOfEmployees")}
                          error={errors?.mallComplexDTLDao?.noOfEmployees}
                          helperText={
                            errors?.mallComplexDTLDao?.noOfEmployees
                              ? errors?.mallComplexDTLDao?.noOfEmployees
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "mallComplexDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.mallComplexDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.mallComplexDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.mallComplexDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "mallComplexDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.mallComplexDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.mallComplexDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.mallComplexDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("mallComplexDTLDao.widthOfApproachRoad")}
                          error={errors?.mallComplexDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.mallComplexDTLDao?.widthOfApproachRoad
                              ? errors?.mallComplexDTLDao?.widthOfApproachRoad
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("mallComplexDTLDao.numberOfExit")}
                          error={errors?.mallComplexDTLDao?.numberOfExit}
                          helperText={
                            errors?.mallComplexDTLDao?.numberOfExit
                              ? errors?.mallComplexDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "mallComplexDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.mallComplexDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.mallComplexDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.mallComplexDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.mallComplexDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.mallComplexDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={errors?.mallComplexDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao?.securityArrangement
                              ? errors?.mallComplexDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.mallComplexDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao?.parkingArrangement
                              ? errors?.mallComplexDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.mallComplexDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          error={errors?.mallComplexDTLDao?.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao?.typesOfWiringOpenClose
                              ? errors?.mallComplexDTLDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.mallComplexDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="mallComplexDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.mallComplexDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.mallComplexDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}

                {/* cinemaHallDTLDao */}
                {(props?.props?.typeOfBusiness == 11 ||
                  (idLocal && idLocal == 11)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "cinemaHallDTLDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            !!errors?.cinemaHallDTLDao?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.cinemaHallDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.cinemaHallDTLDao?.requireNocAreaInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("cinemaHallDTLDao.noOfEmployees")}
                          error={!!errors?.cinemaHallDTLDao?.noOfEmployees}
                          helperText={
                            errors?.cinemaHallDTLDao?.noOfEmployees
                              ? errors?.cinemaHallDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "cinemaHallDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.cinemaHallDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.cinemaHallDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.cinemaHallDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "cinemaHallDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.cinemaHallDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.cinemaHallDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.cinemaHallDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("cinemaHallDTLDao.widthOfApproachRoad")}
                          error={
                            !!errors?.cinemaHallDTLDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.cinemaHallDTLDao?.widthOfApproachRoad
                              ? errors?.cinemaHallDTLDao?.widthOfApproachRoad
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("cinemaHallDTLDao.numberOfExit")}
                          error={!!errors?.cinemaHallDTLDao?.numberOfExit}
                          helperText={
                            errors?.cinemaHallDTLDao?.numberOfExit
                              ? errors?.cinemaHallDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("cinemaHallDTLDao.noOfScreens")}
                          error={errors?.cinemaHallDTLDao?.noOfScreens}
                          helperText={
                            errors?.cinemaHallDTLDao?.noOfScreens
                              ? errors?.cinemaHallDTLDao?.noOfScreens?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.cinemaHallDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.cinemaHallDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao?.securityArrangement
                              ? errors?.cinemaHallDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.cinemaHallDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao?.parkingArrangement
                              ? errors?.cinemaHallDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.cinemaHallDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.cinemaHallDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.cinemaHallDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao?.typesOfWiringOpenClose
                              ? errors?.cinemaHallDTLDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.cinemaHallDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cinemaHallDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cinemaHallDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.cinemaHallDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "cinemaHallDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.cinemaHallDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.cinemaHallDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.cinemaHallDTLDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="eachScreenSeatingCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "cinemaHallDTLDao.eachScreenSeatingCapacity"
                          )}
                          error={
                            errors?.cinemaHallDTLDao?.eachScreenSeatingCapacity
                          }
                          helperText={
                            errors?.cinemaHallDTLDao?.eachScreenSeatingCapacity
                              ? errors?.cinemaHallDTLDao
                                  ?.eachScreenSeatingCapacity?.message
                              : null
                          }
                        />
                      </Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/* 20 - batteryChargingStationDao - add cinema feild */}
                {(props?.props?.typeOfBusiness == 20 ||
                  (idLocal && idLocal == 20)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao
                              ?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.batteryChargingStationDao
                              ?.requireNocAreaInSqMtrs
                              ? errors?.batteryChargingStationDao
                                  ?.requireNocAreaInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.noOfEmployees"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.noOfEmployees"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao?.noOfEmployees
                          }
                          helperText={
                            errors?.batteryChargingStationDao?.noOfEmployees
                              ? errors?.batteryChargingStationDao?.noOfEmployees
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.detailsOfFireFightingEquipments"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.batteryChargingStationDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.batteryChargingStationDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.fireFightingWaterTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.batteryChargingStationDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.batteryChargingStationDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.widthOfApproachRoad"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.widthOfApproachRoad"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao
                              ?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.batteryChargingStationDao
                              ?.widthOfApproachRoad
                              ? errors?.batteryChargingStationDao
                                  ?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.numberOfExit"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.numberOfExit"
                          )}
                          error={
                            !!errors?.batteryChargingStationDao?.numberOfExit
                          }
                          helperText={
                            errors?.batteryChargingStationDao?.numberOfExit
                              ? errors?.batteryChargingStationDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.noOfScreens"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("batteryChargingStationDao.noOfScreens")}
                          error={errors?.batteryChargingStationDao?.noOfScreens}
                          helperText={
                            errors?.batteryChargingStationDao?.noOfScreens
                              ? errors?.batteryChargingStationDao?.noOfScreens
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.batteryChargingStationDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.batteryChargingStationDao
                              ?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.securityArrangement
                              ? errors?.batteryChargingStationDao
                                  ?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.batteryChargingStationDao?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.parkingArrangement
                              ? errors?.batteryChargingStationDao
                                  ?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.batteryChargingStationDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.batteryChargingStationDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.batteryChargingStationDao?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.typesOfWiringOpenClose
                              ? errors?.batteryChargingStationDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.batteryChargingStationDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="batteryChargingStationDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.batteryChargingStationDao
                              ?.arrangementOfLightingArrester
                              ? errors?.batteryChargingStationDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "batteryChargingStationDao.emergencyContactPersonDetails"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "batteryChargingStationDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.batteryChargingStationDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.batteryChargingStationDao
                              ?.emergencyContactPersonDetails
                              ? errors?.batteryChargingStationDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/* governmentOfficesDao- add cinemaHall */}
                {(props?.props?.typeOfBusiness == 19 ||
                  (idLocal && idLocal == 19)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "governmentOfficesDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "governmentOfficesDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            !!errors?.governmentOfficesDao
                              ?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.governmentOfficesDao?.requireNocAreaInSqMtrs
                              ? errors?.governmentOfficesDao
                                  ?.requireNocAreaInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("governmentOfficesDao.noOfEmployees")
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("governmentOfficesDao.noOfEmployees")}
                          error={!!errors?.governmentOfficesDao?.noOfEmployees}
                          helperText={
                            errors?.governmentOfficesDao?.noOfEmployees
                              ? errors?.governmentOfficesDao?.noOfEmployees
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "governmentOfficesDao.detailsOfFireFightingEquipments"
                            )
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "governmentOfficesDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.governmentOfficesDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.governmentOfficesDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.governmentOfficesDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "governmentOfficesDao.fireFightingWaterTankCapacity"
                            )
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "governmentOfficesDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.governmentOfficesDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.governmentOfficesDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.governmentOfficesDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "governmentOfficesDao.widthOfApproachRoad"
                            )
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "governmentOfficesDao.widthOfApproachRoad"
                          )}
                          error={
                            !!errors?.governmentOfficesDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.governmentOfficesDao?.widthOfApproachRoad
                              ? errors?.governmentOfficesDao
                                  ?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("governmentOfficesDao.numberOfExit")
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("governmentOfficesDao.numberOfExit")}
                          error={!!errors?.governmentOfficesDao?.numberOfExit}
                          helperText={
                            errors?.governmentOfficesDao?.numberOfExit
                              ? errors?.governmentOfficesDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch("governmentOfficesDao.noOfScreens")
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("governmentOfficesDao.noOfScreens")}
                          error={errors?.governmentOfficesDao?.noOfScreens}
                          helperText={
                            errors?.governmentOfficesDao?.noOfScreens
                              ? errors?.governmentOfficesDao?.noOfScreens
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.governmentOfficesDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.governmentOfficesDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao?.securityArrangement
                              ? errors?.governmentOfficesDao
                                  ?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.governmentOfficesDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao?.parkingArrangement
                              ? errors?.governmentOfficesDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.governmentOfficesDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.governmentOfficesDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.governmentOfficesDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao
                              ?.typesOfWiringOpenClose
                              ? errors?.governmentOfficesDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.governmentOfficesDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="governmentOfficesDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.governmentOfficesDao
                              ?.arrangementOfLightingArrester
                              ? errors?.governmentOfficesDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: watch(
                              "governmentOfficesDao.emergencyContactPersonDetails"
                            )
                              ? true
                              : false,
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "governmentOfficesDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.governmentOfficesDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.governmentOfficesDao
                              ?.emergencyContactPersonDetails
                              ? errors?.governmentOfficesDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/*  cngServiceStationDao add cinema feild */}
                {(props?.props?.typeOfBusiness == 14 ||
                  (idLocal && idLocal == 14)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "cngServiceStationDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            !!errors?.cngServiceStationDao
                              ?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.cngServiceStationDao?.requireNocAreaInSqMtrs
                              ? errors?.cngServiceStationDao
                                  ?.requireNocAreaInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.noOfEmployees"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("cngServiceStationDao.noOfEmployees")}
                          error={!!errors?.cngServiceStationDao?.noOfEmployees}
                          helperText={
                            errors?.cngServiceStationDao?.noOfEmployees
                              ? errors?.cngServiceStationDao?.noOfEmployees
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.detailsOfFireFightingEquipments"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "cngServiceStationDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.cngServiceStationDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.cngServiceStationDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.cngServiceStationDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.fireFightingWaterTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "cngServiceStationDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.cngServiceStationDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.cngServiceStationDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.cngServiceStationDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.widthOfApproachRoad"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "cngServiceStationDao.widthOfApproachRoad"
                          )}
                          error={
                            !!errors?.cngServiceStationDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.cngServiceStationDao?.widthOfApproachRoad
                              ? errors?.cngServiceStationDao
                                  ?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.numberOfExit"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("cngServiceStationDao.numberOfExit")}
                          error={!!errors?.cngServiceStationDao?.numberOfExit}
                          helperText={
                            errors?.cngServiceStationDao?.numberOfExit
                              ? errors?.cngServiceStationDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.noOfScreens"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("cngServiceStationDao.noOfScreens")}
                          error={errors?.cngServiceStationDao?.noOfScreens}
                          helperText={
                            errors?.cngServiceStationDao?.noOfScreens
                              ? errors?.cngServiceStationDao?.noOfScreens
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.cngServiceStationDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors?.cngServiceStationDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao?.securityArrangement
                              ? errors?.cngServiceStationDao
                                  ?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.cngServiceStationDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao?.parkingArrangement
                              ? errors?.cngServiceStationDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.cngServiceStationDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.cngServiceStationDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.cngServiceStationDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao
                              ?.typesOfWiringOpenClose
                              ? errors?.cngServiceStationDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.cngServiceStationDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="cngServiceStationDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.cngServiceStationDao
                              ?.arrangementOfLightingArrester
                              ? errors?.cngServiceStationDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "cngServiceStationDao.emergencyContactPersonDetails"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "cngServiceStationDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.cngServiceStationDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.cngServiceStationDao
                              ?.emergencyContactPersonDetails
                              ? errors?.cngServiceStationDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/* schoolDao - add cinema hall */}
                {(props?.props?.typeOfBusiness == 15 ||
                  (idLocal && idLocal == 15)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("schoolDao.requireNocAreaInSqMtrs")}
                          error={!!errors?.schoolDao?.requireNocAreaInSqMtrs}
                          helperText={
                            errors?.schoolDao?.requireNocAreaInSqMtrs
                              ? errors?.schoolDao?.requireNocAreaInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("schoolDao.noOfEmployees")}
                          error={!!errors?.schoolDao?.noOfEmployees}
                          helperText={
                            errors?.schoolDao?.noOfEmployees
                              ? errors?.schoolDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "schoolDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.schoolDao?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.schoolDao?.detailsOfFireFightingEquipments
                              ? errors?.schoolDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "schoolDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.schoolDao?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.schoolDao?.fireFightingWaterTankCapacity
                              ? errors?.schoolDao?.fireFightingWaterTankCapacity
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("schoolDao.widthOfApproachRoad")}
                          error={!!errors?.schoolDao?.widthOfApproachRoad}
                          helperText={
                            errors?.schoolDao?.widthOfApproachRoad
                              ? errors?.schoolDao?.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("schoolDao.numberOfExit")}
                          error={!!errors?.schoolDao?.numberOfExit}
                          helperText={
                            errors?.schoolDao?.numberOfExit
                              ? errors?.schoolDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("schoolDao.noOfScreens")}
                          error={errors?.schoolDao?.noOfScreens}
                          helperText={
                            errors?.schoolDao?.noOfScreens
                              ? errors?.schoolDao?.noOfScreens?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.schoolDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors?.schoolDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao?.securityArrangement
                              ? errors?.schoolDao?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.schoolDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao?.parkingArrangement
                              ? errors?.schoolDao?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.schoolDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.schoolDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.schoolDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao?.typesOfWiringOpenClose
                              ? errors?.schoolDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.schoolDao?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.schoolDao?.arrangementOfLightingArrester
                              ? errors?.schoolDao?.arrangementOfLightingArrester
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "schoolDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.schoolDao?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.schoolDao?.emergencyContactPersonDetails
                              ? errors?.schoolDao?.emergencyContactPersonDetails
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/* banquatDTLDao - Add Cinema Feild  */}
                {(props?.props?.typeOfBusiness == 17 ||
                  (idLocal && idLocal == 17)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("banquatDTLDao.requireNocAreaInSqMtrs")}
                          error={
                            !!errors?.banquatDTLDao?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.banquatDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.banquatDTLDao?.requireNocAreaInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("banquatDTLDao.noOfEmployees")}
                          error={!!errors?.banquatDTLDao?.noOfEmployees}
                          helperText={
                            errors?.banquatDTLDao?.noOfEmployees
                              ? errors?.banquatDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "banquatDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            !!errors?.banquatDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.banquatDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.banquatDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "banquatDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            !!errors?.banquatDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.banquatDTLDao?.fireFightingWaterTankCapacity
                              ? errors?.banquatDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("banquatDTLDao.widthOfApproachRoad")}
                          error={!!errors?.banquatDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.banquatDTLDao?.widthOfApproachRoad
                              ? errors?.banquatDTLDao?.widthOfApproachRoad
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("banquatDTLDao.numberOfExit")}
                          error={!!errors?.banquatDTLDao?.numberOfExit}
                          helperText={
                            errors?.banquatDTLDao?.numberOfExit
                              ? errors?.banquatDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfScreen" />}
                          variant="outlined"
                          {...register("banquatDTLDao.noOfScreens")}
                          error={errors?.banquatDTLDao?.noOfScreens}
                          helperText={
                            errors?.banquatDTLDao?.noOfScreens
                              ? errors?.banquatDTLDao?.noOfScreens?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            !!errors?.usageOfDryGrassCottonOrInflatable
                              ?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.banquatDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors?.banquatDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao?.securityArrangement
                              ? errors?.banquatDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.banquatDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao?.parkingArrangement
                              ? errors?.banquatDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.banquatDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.banquatDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.banquatDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao?.typesOfWiringOpenClose
                              ? errors?.banquatDTLDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.banquatDTLDao?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="banquatDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.banquatDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.banquatDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "banquatDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.banquatDTLDao?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.banquatDTLDao?.emergencyContactPersonDetails
                              ? errors?.banquatDTLDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="eachScreenSeatingCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "banquatDTLDao.eachScreenSeatingCapacity"
                          )}
                          error={
                            errors?.banquatDTLDao?.eachScreenSeatingCapacity
                          }
                          helperText={
                            errors?.banquatDTLDao?.eachScreenSeatingCapacity
                              ? errors?.banquatDTLDao?.eachScreenSeatingCapacity
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid> */}
                    </Grid>
                  </>
                )}

                {/* companyDTLDao */}
                {(props?.props?.typeOfBusiness == 12 ||
                  // formEditId == "companyDTLDao" ||
                  (idLocal && idLocal == 12)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors.typeOfCompany}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfCompany" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="typesOfCompany" />}
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {typeOfCompanyS &&
                                  typeOfCompanyS?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en"
                                        ? val.typeOfCompany
                                        : val.typeOfCompanyMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.typeOfCompany"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.usageOfDryGrass
                              ? errors?.usageOfDryGrass?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="businessDetails" />}
                          variant="outlined"
                          {...register("companyDTLDao.businessDetails")}
                          error={!!errors.businessDetails}
                          helperText={
                            errors?.businessDetails
                              ? errors.businessDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="rawMaterialDetails" />}
                          variant="outlined"
                          {...register("companyDTLDao.rawMaterialDetails")}
                          error={!!errors.rawMaterialDetails}
                          helperText={
                            errors?.rawMaterialDetails
                              ? errors.rawMaterialDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="finalMaterialDetails" />}
                          variant="outlined"
                          {...register("companyDTLDao.finalMaterialDetails")}
                          error={!!errors.finalMaterialDetails}
                          helperText={
                            errors?.finalMaterialDetails
                              ? errors.finalMaterialDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="listOfHazardousMaterial" />
                          }
                          variant="outlined"
                          {...register("companyDTLDao.listOfHazardousMaterial")}
                          error={!!errors.listOfHazardousMaterial}
                          helperText={
                            errors?.listOfHazardousMaterial
                              ? errors.listOfHazardousMaterial.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors.arrangementOfLightingArrester}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.arrangementOfLightingArrester
                              ? errors?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register("companyDTLDao.requireNocAreaInSqMtrs")}
                          error={!!errors.requireNocAreaInSqMtrs}
                          helperText={
                            errors?.requireNocAreaInSqMtrs
                              ? errors.requireNocAreaInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("companyDTLDao.noOfEmployees")}
                          error={!!errors.noOfEmployees}
                          helperText={
                            errors?.noOfEmployees
                              ? errors.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "companyDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={!!errors.detailsOfFireFightingEquipments}
                          helperText={
                            errors?.detailsOfFireFightingEquipments
                              ? errors.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "companyDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={!!errors.fireFightingWaterTankCapacity}
                          helperText={
                            errors?.fireFightingWaterTankCapacity
                              ? errors.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("companyDTLDao.widthOfApproachRoad")}
                          error={!!errors.widthOfApproachRoad}
                          helperText={
                            errors?.widthOfApproachRoad
                              ? errors.widthOfApproachRoad.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("companyDTLDao.numberOfExit")}
                          error={!!errors.numberOfExit}
                          helperText={
                            errors?.numberOfExit
                              ? errors.numberOfExit.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          
                          sx={{ width: "100%" }}
                          id='outlined-basic'
                          label={<FormattedLabel id='securityArrangement' />}
                          variant='outlined'
                          {...register("companyDTLDao.securityArrangement")}
                          error={!!errors.securityArrangement}
                          helperText={
                            errors?.securityArrangement
                              ? errors.securityArrangement.message
                              : null
                          }
                        /> */}
                        <TextField
                          InputLabelProps={{
                            shrink: { shrinkState },
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "companyDTLDao.emergencyContactPersonDetails"
                          )}
                          error={!!errors.emergencyContactPersonDetails}
                          helperText={
                            errors?.emergencyContactPersonDetails
                              ? errors.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.usageOfDryGrass
                              ? errors?.usageOfDryGrass?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={!!errors.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.securityArrangement
                              ? errors?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.parkingArrangement
                              ? errors?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            !!errors.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors.usageOfDryGrass}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="companyDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typesOfWiringOpenClose
                              ? errors?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* shaleyPoshanAaharDTLDao */}
                {(props?.props?.typeOfBusiness == 13 ||
                  (idLocal && idLocal == 13)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            `shaleyPoshanAaharDTLDao.requireNocAreaInSqMtrs`
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.requireNocAreaInSqMtrs
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.requireNocAreaInSqMtrs.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.noOfEmployees"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register(`shaleyPoshanAaharDTLDao.noOfEmployees`)}
                          error={errors?.shaleyPoshanAaharDTLDao?.noOfEmployees}
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao?.noOfEmployees
                              ? errors?.shaleyPoshanAaharDTLDao?.noOfEmployees
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.detailsOfFireFightingEquipments"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "shaleyPoshanAaharDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.detailsOfFireFightingEquipments?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.fireFightingWaterTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "shaleyPoshanAaharDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.fireFightingWaterTankCapacity?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.widthOfApproachRoad"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "shaleyPoshanAaharDTLDao.widthOfApproachRoad"
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao?.widthOfApproachRoad
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.widthOfApproachRoad?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.numberOfExit"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("shaleyPoshanAaharDTLDao.numberOfExit")}
                          error={errors?.shaleyPoshanAaharDTLDao?.numberOfExit}
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao?.numberOfExit
                              ? errors?.shaleyPoshanAaharDTLDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.sittingCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="seatingCapacity" />}
                          variant="outlined"
                          {...register(
                            "shaleyPoshanAaharDTLDao.sittingCapacity"
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao?.sittingCapacity
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao?.sittingCapacity
                              ? errors?.shaleyPoshanAaharDTLDao?.sittingCapacity
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.shaleyPoshanAaharDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao
                              ?.securityArrangement
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.securityArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.shaleyPoshanAaharDTLDao?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao?.parkingArrangement
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.shaleyPoshanAaharDTLDao?.usageOfDryGrass
                          }
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao
                              ?.typesOfWiringOpenClose
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="shaleyPoshanAaharDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.shaleyPoshanAaharDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "shaleyPoshanAaharDTLDao.emergencyContactPersonDetails"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "shaleyPoshanAaharDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.shaleyPoshanAaharDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.shaleyPoshanAaharDTLDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}
                {/* LPG Gas Godown */}
                {(props?.props?.typeOfBusiness == 16 ||
                  (idLocal && idLocal == 16)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.requireNocAreaForPetrolDieselCngPumpInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="requireNocAreaForPetrolDieselCngPumpInSqMtrs" />
                          }
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.requireNocAreaForPetrolDieselCngPumpInSqMtrs"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao
                              ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                              ? errors?.lpgGasGodownDTLDao
                                  ?.requireNocAreaForPetrolDieselCngPumpInSqMtrs
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.noOfDispensingUnits"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfDispensingUnits" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.noOfDispensingUnits"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.noOfDispensingUnits
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.noOfDispensingUnits
                              ? errors?.lpgGasGodownDTLDao?.noOfDispensingUnits
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.fuelTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="fuelTankCapacity" />}
                          variant="outlined"
                          {...register("lpgGasGodownDTLDao.fuelTankCapacity")}
                          error={errors?.lpgGasGodownDTLDao?.fuelTankCapacity}
                          helperText={
                            errors?.lpgGasGodownDTLDao?.fuelTankCapacity
                              ? errors?.lpgGasGodownDTLDao?.fuelTankCapacity
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.lengthOfCascadeForCng"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="lengthOfCascadeForCNG" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.lengthOfCascadeForCng"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.lengthOfCascadeForCng
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.lengthOfCascadeForCng
                              ? errors?.lpgGasGodownDTLDao
                                  ?.lengthOfCascadeForCng?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.widthOfCascadeForCng"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfCascadeForCNG" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.widthOfCascadeForCng"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.widthOfCascadeForCng
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.widthOfCascadeForCng
                              ? errors?.lpgGasGodownDTLDao?.widthOfCascadeForCng
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.noOfFireFightingTrainedPerson"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="noOfFireFightingTrainedPerson" />
                          }
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.noOfFireFightingTrainedPerson"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.noOfFireFightingTrainedPerson
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao
                              ?.noOfFireFightingTrainedPerson
                              ? errors?.lpgGasGodownDTLDao
                                  ?.noOfFireFightingTrainedPerson?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.lpgGasGodownDTLDao
                                  ?.requireNocAreaInSqMtrs?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.noOfEmployees"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("lpgGasGodownDTLDao.noOfEmployees")}
                          error={errors?.lpgGasGodownDTLDao?.noOfEmployees}
                          helperText={
                            errors?.lpgGasGodownDTLDao?.noOfEmployees
                              ? errors?.lpgGasGodownDTLDao?.noOfEmployees
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.detailsOfFireFightingEquipments"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.lpgGasGodownDTLDao
                                  ?.detailsOfFireFightingEquipments?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.fireFightingWaterTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.lpgGasGodownDTLDao
                                  ?.fireFightingWaterTankCapacity?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.widthOfApproachRoad"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao?.widthOfApproachRoad"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.widthOfApproachRoad
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.widthOfApproachRoad
                              ? errors?.lpgGasGodownDTLDao?.widthOfApproachRoad
                                  ?.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.numberOfExit"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("lpgGasGodownDTLDao.numberOfExit")}
                          error={errors?.lpgGasGodownDTLDao?.numberOfExit}
                          helperText={
                            errors?.lpgGasGodownDTLDao?.numberOfExit
                              ? errors?.lpgGasGodownDTLDao?.numberOfExit
                                  ?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.securityArrangement"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="securityArrangement" />}
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.securityArrangement"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao?.securityArrangement
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao?.securityArrangement
                              ? errors?.lpgGasGodownDTLDao?.securityArrangement
                                  ?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.lpgGasGodownDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.usageOfDryGrass"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao?.usageOfDryGrass
                              ? errors?.lpgGasGodownDTLDao?.usageOfDryGrass
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.lpgGasGodownDTLDao?.securityArrangement
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao?.securityArrangement
                              ? errors?.lpgGasGodownDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.lpgGasGodownDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel i d="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao?.parkingArrangement
                              ? errors?.lpgGasGodownDTLDao?.parkingArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.lpgGasGodownDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.lpgGasGodownDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao?.typesOfWiringOpenClose
                              ? errors?.lpgGasGodownDTLDao
                                  ?.typesOfWiringOpenClose?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                size="small"
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="lpgGasGodownDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.lpgGasGodownDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.lpgGasGodownDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "lpgGasGodownDTLDao.emergencyContactPersonDetails"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "lpgGasGodownDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.lpgGasGodownDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.lpgGasGodownDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.lpgGasGodownDTLDao
                                  ?.emergencyContactPersonDetails?.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}

                {/* Water Park */}
                {(props?.props?.typeOfBusiness == 21 ||
                  (idLocal && idLocal == 21)) && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.requireNocAreaInSqMtrs"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="requireNOCAreainSqMtrs" />}
                          variant="outlined"
                          {...register(
                            "waterParkDTLDao.requireNocAreaInSqMtrs"
                          )}
                          error={
                            errors?.waterParkDTLDao?.requireNocAreaInSqMtrs
                          }
                          helperText={
                            errors?.waterParkDTLDao?.requireNocAreaInSqMtrs
                              ? errors?.waterParkDTLDao?.requireNocAreaInSqMtrs
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.noOfEmployees"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="noOfEmployees" />}
                          variant="outlined"
                          {...register("waterParkDTLDao.noOfEmployees")}
                          error={errors?.waterParkDTLDao?.noOfEmployees}
                          helperText={
                            errors?.waterParkDTLDao?.noOfEmployees
                              ? errors?.waterParkDTLDao?.noOfEmployees.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.detailsOfFireFightingEquipments"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="detailsOfFireFightingEquipments" />
                          }
                          variant="outlined"
                          {...register(
                            "waterParkDTLDao.detailsOfFireFightingEquipments"
                          )}
                          error={
                            errors?.waterParkDTLDao
                              ?.detailsOfFireFightingEquipments
                          }
                          helperText={
                            errors?.waterParkDTLDao
                              ?.detailsOfFireFightingEquipments
                              ? errors?.waterParkDTLDao
                                  ?.detailsOfFireFightingEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.fireFightingWaterTankCapacity"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="fireFightingWaterTankCapacity" />
                          }
                          variant="outlined"
                          {...register(
                            "waterParkDTLDao.fireFightingWaterTankCapacity"
                          )}
                          error={
                            errors?.waterParkDTLDao
                              ?.fireFightingWaterTankCapacity
                          }
                          helperText={
                            errors?.waterParkDTLDao
                              ?.fireFightingWaterTankCapacity
                              ? errors?.waterParkDTLDao
                                  ?.fireFightingWaterTankCapacity.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.widthOfApproachRoad"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="widthOfApproachRoad" />}
                          variant="outlined"
                          {...register("waterParkDTLDao.widthOfApproachRoad")}
                          error={errors?.waterParkDTLDao?.widthOfApproachRoad}
                          helperText={
                            errors?.waterParkDTLDao?.widthOfApproachRoad
                              ? errors?.waterParkDTLDao?.widthOfApproachRoad
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.numberOfExit"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="numberOfExit" />}
                          variant="outlined"
                          {...register("waterParkDTLDao.numberOfExit")}
                          error={errors?.waterParkDTLDao?.numberOfExit}
                          helperText={
                            errors?.waterParkDTLDao?.numberOfExit
                              ? errors?.waterParkDTLDao?.numberOfExit?.message
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
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.securityArrangement"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="securityArrangement" />}
                          variant="outlined"
                          {...register("waterParkDTLDao.securityArrangement")}
                          error={
                            errors?.waterParkDTLDao?.messagesecurityArrangement
                          }
                          helperText={
                            errors?.securityArrangement
                              ? errors.securityArrangement.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: "100%",
                          }}
                          error={
                            errors?.waterParkDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="usageOfDryGrass" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={<FormattedLabel id="usageOfDryGrass" />}
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.usageOfDryGrassCottonOrInflatable"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao
                              ?.usageOfDryGrassCottonOrInflatable
                              ? errors?.waterParkDTLDao
                                  ?.usageOfDryGrassCottonOrInflatable?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={errors?.waterParkDTLDao?.securityArrangement}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="securityArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="securityArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.securityArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao?.securityArrangement
                              ? errors?.waterParkDTLDao?.securityArrangement
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.waterParkDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="parkingArrangement" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="parkingArrangement" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.parkingArrangement"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao?.parkingArrangement
                              ? errors?.parkingArrangement?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          size="small"
                          variant="outlined"
                          error={
                            errors?.waterParkDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="listOfEmergencyContactNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="listOfEmergencyContactNumber" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.listOfEmergencyContactNumberNoSmokingSignBoards"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao
                              ?.listOfEmergencyContactNumberNoSmokingSignBoards
                              ? errors?.waterParkDTLDao
                                  ?.listOfEmergencyContactNumberNoSmokingSignBoards
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          error={errors?.waterParkDTLDao?.usageOfDryGrass}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="typesOfWiringOpenClose" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="typesOfWiringOpenClose" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                <MenuItem value="123">
                                  <em>Not available</em>
                                </MenuItem>
                                {wireTypes &&
                                  wireTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.type : val.typeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.typesOfWiringOpenClose"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao?.typesOfWiringOpenClose
                              ? errors?.waterParkDTLDao?.typesOfWiringOpenClose
                                  ?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{
                            minWidth: "100%",
                          }}
                          variant="outlined"
                          size="small"
                          error={
                            errors?.waterParkDTLDao
                              ?.arrangementOfLightingArrester
                          }
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="arrangementOfLightingArrester" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                style={{ backgroundColor: "white" }}
                                label={
                                  <FormattedLabel id="arrangementOfLightingArrester" />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {values &&
                                  values?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en" ? val.name : val.nameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="waterParkDTLDao.arrangementOfLightingArrester"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.waterParkDTLDao
                              ?.arrangementOfLightingArrester
                              ? errors?.waterParkDTLDao
                                  ?.arrangementOfLightingArrester?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          InputLabelProps={{
                            shrink: shrinkFunction(
                              "waterParkDTLDao.emergencyContactPersonDetails"
                            ),
                          }}
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="emergencyContactPersonDetails" />
                          }
                          variant="outlined"
                          {...register(
                            "waterParkDTLDao.emergencyContactPersonDetails"
                          )}
                          error={
                            errors?.waterParkDTLDao
                              ?.emergencyContactPersonDetails
                          }
                          helperText={
                            errors?.waterParkDTLDao
                              ?.emergencyContactPersonDetails
                              ? errors?.waterParkDTLDao
                                  ?.emergencyContactPersonDetails.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}
                <br />
                <br />
                {!documentShow && (
                  <>
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {<FormattedLabel id="documentUpload" />}
                      </Box>
                    </Box>
                    <DocumentsUpload props={idLocal} />
                    <br />
                    <br />
                    <br />
                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Update" ? (
                            "Update"
                          ) : (
                            <FormattedLabel id="save" />
                          )}
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
                          endIcon={<ExitToAppIcon />}
                          onClick={() => {
                            localStorage.removeItem("key");
                            localStorage.removeItem("idState");
                            localStorage.removeItem("typeOfBusiness");
                            localStorage.removeItem("typeOfBusinessMr");
                            router.push({
                              pathname: "/dashboard",
                            });
                          }}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
