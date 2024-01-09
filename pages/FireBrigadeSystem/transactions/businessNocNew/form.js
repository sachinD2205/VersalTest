import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
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
import urls from "../../../../URLS/urls";
import schema from "../../../../containers/schema/fireBrigadeSystem/emergencyServiceTransaction";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from "../../../../containers/FB_ReusableComponent/reusableComponents/FormattedLabel";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

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

const Form = () => {
  const [personName2, setPersonName2] = React.useState([]);
  const [personName3, setPersonName3] = React.useState([]);
  const userToken = useGetToken();

  const [checkBoxValue, setCheckBoxValue] = useState();

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

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState(null);
  const [showVardiOther, setShowVardiOther] = useState([]);
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

  useEffect(() => {
    getShiftData();
  }, []);

  useEffect(() => {
    console.log("dataa", router.query);
    reset(router.query);
    // if (router.query.id) {
    setIsApplicantIsRental(
      router.query.IsRentalApplicant == "Y" ? true : false
    );

    setCheckBoxValue(router.query.IsRentalApplicant == "Y" ? true : false);

    // setValue(
    //   "IsRentalApplicant",
    //   router.query.IsRentalApplicant == "Y" ? true : false
    // );
    // }
  }, []);

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
    getUser();
    getVardiTypes();
    getFireStationName();
    getPinCode();
    getSubVardiTypes();
    getEmpFire();
  }, []);

  // const getById = (appId) => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`
  //     )
  //     .then((res) => {
  //       // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
  //       // reset(res.data.vardiSlip);
  //       setValue("id", res.data.id);
  //     });
  // };

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

  useEffect(() => {
    getBusinessType();
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
    console.log("fromData", fromData);
    console.log("router.query.idState000", router.query.typeOfBusiness);
    const finalBody = {
      id: router?.query?.id ? router.query.id : null,

      //   id: router?.query?.idState ? router.query.idState : null,
      //   ...fromData,
      // role: "CREATE_APPLICATION",
      // desg: "DEPT_CLERK",
      // pageMode: router.query.id ? null : "DRAFT",
      //   desg: "",

      applicantName: fromData.applicantName,

      applicantNameMr: fromData.applicantNameMr,

      applicantMiddleName: fromData.applicantMiddleName,

      //   nOCFor: fromData.nOCFor,

      applicantMiddleNameMr: fromData.applicantMiddleNameMr,

      applicantLastName: fromData.applicantLastName,

      applicantLastNameMr: fromData.applicantLastNameMr,

      applicantAddress: fromData.applicantAddress,

      applicantAddressMr: fromData.applicantAddressMr,

      mobileNo: fromData.mobileNo,

      emailId: fromData.emailId,

      IsRentalApplicant: fromData.IsRentalApplicant == true ? "Y" : "N",

      // Owner Details

      ownerName: fromData.ownerName,

      ownerNameMr: fromData.ownerNameMr,

      ownerMiddleName: fromData.ownerMiddleName,

      ownerMiddleNameMr: fromData.ownerMiddleNameMr,

      ownerLastName: fromData.ownerLastName,

      ownerLastNameMr: fromData.ownerLastNameMr,

      ownerAddress: fromData.ownerAddress,

      ownerAddressMr: fromData.ownerAddressMr,

      ownerMobileNo: fromData.ownerMobileNo,

      ownerEmailId: fromData.ownerEmailId,

      // Business Detailss

      firmName: fromData.firmName,

      firmNameMr: fromData.firmNameMr,

      // zone List

      propertyNo: fromData.propertyNo,

      shopNo: fromData.shopNo,

      plotNo: fromData.plotNo,

      buildingName: fromData.buildingName,

      buildingNameMr: fromData.buildingNameMr,

      gatNo: fromData.gatNo,

      citySurveyNo: fromData.citySurveyNo,

      roadName: fromData.roadName,

      landmark: fromData.landmark,

      area: fromData.area,

      //   roadNameMr: fromData.roadNameMr,

      //   landmarkMr: fromData.landmarkMr,

      //   areaMr: fromData.areaMr,

      village: fromData.village,

      pincode: fromData.pincode,

      officeContactNo: fromData.officeContactNo,

      workingOnsitePersonMobileNo: fromData.workingOnsitePersonMobileNo,

      officeMailId: fromData.officeMailId,

      lattitude: fromData.lattitude,

      longitude: fromData.longitude,

      [router.query.key]: {
        id: router?.query?.id ? router.query.id : null,

        // ...fromData,
        starHotel: fromData.starHotel,
        noOfRooms: fromData.noOfRooms,
        foodAndDrugSafetyLicenseCopy: fromData.foodAndDrugSafetyLicenseCopy,
        nocAreaForPetrolPumpInSqMtrs: fromData.nocAreaForPetrolPumpInSqMtrs,
        noOfDespesingUnit: fromData.noOfDespesingUnit,
        fuelTankCapacity: fromData.fuelTankCapacity,
        lengthOfCascadeForCNG: fromData.lengthOfCascadeForCNG,
        widthOfCascadeForCNG: fromData.widthOfCascadeForCNG,
        noOfBeds: fromData.noOfBeds,
        noOfScreen: fromData.noOfScreen,
        eachScreenSeatingCapacity: fromData.eachScreenSeatingCapacity,

        typesOfCompany: fromData.typesOfCompany,
        businessDetails: fromData.businessDetails,
        rawMaterialDetails: fromData.rawMaterialDetails,
        finalMaterialDetails: fromData.finalMaterialDetails,
        listOfHazardousMaterial: fromData.listOfHazardousMaterial,
        emergencyContactPersonDetails: fromData.emergencyContactPersonDetails,
        // businessNocId: router?.query?.businessNocId
        //   ? router?.query?.businessNocId
        //   : null,
        //   id: router?.query?.vardiTypeId ? router.query.vardiTypeId : null,
      },
    };

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to submit the application ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${urls.FbsURL}/transaction/trnBussinessNOC/save`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            //    {
            //     headers: {
            //       Authorization: `Bearer ${token}`,
            //     },
            //   }
          )
          .then((res) => {
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
                pathname: "/FireBrigadeSystem/transactions/businessNocNew",
              });
            }
          });
      }
    });
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

  const [filUser, setFilUser] = useState([]);

  let temp2 = [];
  useEffect(() => {
    console.log("personName3", personName3);

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

  let appName = "FBS";
  let serviceName = "M-MBR";
  let applicationFrom = "Web";

  // View
  return (
    <>
      <Box
        style={{
          margin: "4%",
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
                      pathname:
                        "/FireBrigadeSystem/transactions/businessNocNew/nocTypes",
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
                {/* {btnSaveText == "Update" ? (
                  <FormattedLabel id='emergencyServicesUpdate' />
                ) : (
                  <FormattedLabel id='emergencyServices' />
                )} */}

                {language == "en"
                  ? router.query.typeOfBusiness
                  : router.query.typeOfBusinessMr}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
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
                  <Box className={styles.tableHead}>
                    <Box className={styles.feildHead}>
                      {<FormattedLabel id="applicantDetails" />}
                    </Box>
                  </Box>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantName" />}
                        variant="standard"
                        {...register("applicantName")}
                        error={!!errors.applicantName}
                        helperText={
                          errors?.applicantName
                            ? errors.applicantName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantMiddleName" />}
                        variant="standard"
                        {...register("applicantMiddleName")}
                        error={!!errors.applicantMiddleName}
                        helperText={
                          errors?.applicantMiddleName
                            ? errors.applicantMiddleName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantLastName" />}
                        variant="standard"
                        {...register("applicantLastName")}
                        error={!!errors.applicantLastName}
                        helperText={
                          errors?.applicantLastName
                            ? errors.applicantLastName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantNameMr" />}
                        variant="standard"
                        {...register("applicantNameMr")}
                        error={!!errors.applicantNameMr}
                        helperText={
                          errors?.applicantNameMr
                            ? errors.applicantNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantMiddleNameMr" />}
                        variant="standard"
                        {...register("applicantMiddleNameMr")}
                        error={!!errors.applicantMiddleNameMr}
                        helperText={
                          errors?.applicantMiddleNameMr
                            ? errors.applicantMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantLastNameMr" />}
                        variant="standard"
                        {...register("applicantLastNameMr")}
                        error={!!errors.applicantLastNameMr}
                        helperText={
                          errors?.applicantLastNameMr
                            ? errors.applicantLastNameMr.message
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
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantAddresss" />}
                        variant="standard"
                        {...register("applicantAddress")}
                        error={!!errors.applicantAddress}
                        helperText={
                          errors?.applicantAddress
                            ? errors.applicantAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="applicantAddressMr" />}
                        variant="standard"
                        {...register("applicantAddressMr")}
                        error={!!errors.applicantAddressMr}
                        helperText={
                          errors?.applicantAddressMr
                            ? errors.applicantAddressMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="mobileNo" />}
                        variant="standard"
                        {...register("mobileNo")}
                        error={!!errors.mobileNo}
                        helperText={
                          errors?.mobileNo ? errors.mobileNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="emailId" />}
                        variant="standard"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                  <br />
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
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
                                // checked={props.value}
                                checked={IsRentalApplicant}
                                onChange={(e) => {
                                  // call function For Checked and UnChecked Checkbox
                                  handlePaddressCheck(e);
                                  console.log("000", e.target.checked);
                                  setCheckBoxValue(e.target.checked);
                                  props.onChange(e.target.checked);
                                }}
                              />
                            )}
                          />
                        }
                        label={<FormattedLabel id="isPAddressSame" />}
                      />
                      <h4>
                        <FormattedLabel id="IfApplicantIsRental" />
                      </h4>
                    </Grid>
                    <Grid item xs={9} className={styles.feildres}></Grid>
                  </Grid>
                </>
                <br />
                <br />
                {checkBoxValue == true && (
                  <>
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {<FormattedLabel id="ownerDetails" />}
                      </Box>
                    </Box>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerName" />}
                          variant="standard"
                          {...register("ownerName")}
                          error={!!errors.ownerName}
                          helperText={
                            errors?.ownerName ? errors.ownerName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerMiddleName" />}
                          variant="standard"
                          {...register("ownerMiddleName")}
                          error={!!errors.ownerMiddleName}
                          helperText={
                            errors?.ownerMiddleName
                              ? errors.ownerMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerLastName" />}
                          variant="standard"
                          {...register("ownerLastName")}
                          error={!!errors.ownerLastName}
                          helperText={
                            errors?.ownerLastName
                              ? errors.ownerLastName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerNameMr" />}
                          variant="standard"
                          {...register("ownerNameMr")}
                          error={!!errors.ownerNameMr}
                          helperText={
                            errors?.ownerNameMr
                              ? errors.ownerNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerMiddleNameMr" />}
                          variant="standard"
                          {...register("ownerMiddleNameMr")}
                          error={!!errors.ownerMiddleNameMr}
                          helperText={
                            errors?.ownerMiddleNameMr
                              ? errors.ownerMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerLastNameMr" />}
                          variant="standard"
                          {...register("ownerLastNameMr")}
                          error={!!errors.ownerLastNameMr}
                          helperText={
                            errors?.ownerLastNameMr
                              ? errors.ownerLastNameMr.message
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
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerAddresss" />}
                          variant="standard"
                          {...register("ownerAddresss")}
                          error={!!errors.ownerAddresss}
                          helperText={
                            errors?.ownerAddresss
                              ? errors.ownerAddresss.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerAddresssMr" />}
                          variant="standard"
                          {...register("ownerAddresssMr")}
                          error={!!errors.ownerAddresssMr}
                          helperText={
                            errors?.ownerAddresssMr
                              ? errors.ownerAddresssMr.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerMobileNo" />}
                          variant="standard"
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
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="ownerEmailId" />}
                          variant="standard"
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
                  </>
                )}
                <br />
                <br />
                <br />

                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="businessDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="firmName" />}
                      variant="standard"
                      {...register("firmName")}
                      error={!!errors.firmName}
                      helperText={
                        errors?.firmName ? errors.firmName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="firmNameMr" />}
                      variant="standard"
                      {...register("firmNameMr")}
                      error={!!errors.firmNameMr}
                      helperText={
                        errors?.firmNameMr ? errors.firmNameMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="zone" />}
                      variant="standard"
                      {...register("zone")}
                      error={!!errors.zone}
                      helperText={errors?.zone ? errors.zone.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="propertyNo" />}
                      variant="standard"
                      {...register("propertyNo")}
                      error={!!errors.propertyNo}
                      helperText={
                        errors?.propertyNo ? errors.propertyNo.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="shopNo" />}
                      variant="standard"
                      {...register("shopNo")}
                      error={!!errors.shopNo}
                      helperText={errors?.shopNo ? errors.shopNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="plotNo" />}
                      variant="standard"
                      {...register("plotNo")}
                      error={!!errors.plotNo}
                      helperText={errors?.plotNo ? errors.plotNo.message : null}
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
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="buildingName" />}
                      variant="standard"
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
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="gatNo" />}
                      variant="standard"
                      {...register("gatNo")}
                      error={!!errors.gatNo}
                      helperText={errors?.gatNo ? errors.gatNo.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="citySurveyNo" />}
                      variant="standard"
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
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadName" />}
                      variant="standard"
                      {...register("roadName")}
                      error={!!errors.roadName}
                      helperText={
                        errors?.roadName ? errors.roadName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="landMark" />}
                      variant="standard"
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="areaEn" />}
                      variant="standard"
                      {...register("area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                </Grid>
                {/* Village */}
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="village" />}
                      variant="standard"
                      {...register("village")}
                      error={!!errors.village}
                      helperText={
                        errors?.village ? errors.village.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="pinCode" />}
                      variant="standard"
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={
                        errors?.pincode ? errors.pincode.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="officeContactNo" />}
                      variant="standard"
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
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="officeMailId" />}
                      variant="standard"
                      {...register("officeMailId")}
                      error={!!errors.officeMailId}
                      helperText={
                        errors?.officeMailId
                          ? errors.officeMailId.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={
                        <FormattedLabel id="workingOnSitePersonMobileNo" />
                      }
                      variant="standard"
                      {...register("workingOnsitePersonMobileNo")}
                      error={!!errors.workingOnsitePersonMobileNo}
                      helperText={
                        errors?.workingOnsitePersonMobileNo
                          ? errors.workingOnsitePersonMobileNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={2} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="latitude" />}
                      variant="standard"
                      {...register("lattitude")}
                      error={!!errors.lattitude}
                      helperText={
                        errors?.lattitude ? errors.lattitude.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={2} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="longitude" />}
                      variant="standard"
                      {...register("longitude")}
                      error={!!errors.longitude}
                      helperText={
                        errors?.longitude ? errors.longitude.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <br />
                <br />
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="otherDetails" />}
                  </Box>
                </Box>

                {router.query.idState == 1 && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          type="number"
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="starHotel" />}
                          variant="standard"
                          {...register("starHotel")}
                          error={!!errors.starHotel}
                          helperText={
                            errors?.starHotel ? errors.starHotel.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </>
                )}

                {router.query.idState == 2 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        type="number"
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="noOfRooms" />}
                        variant="standard"
                        {...register("noOfRooms")}
                        error={!!errors.noOfRooms}
                        helperText={
                          errors?.noOfRooms ? errors.noOfRooms.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="foodAndDrugSafetyLicenseCopy" />
                        }
                        incode
                        variant="standard"
                        {...register("foodAndDrugSafetyLicenseCopy")}
                        error={!!errors.foodAndDrugSafetyLicenseCopy}
                        helperText={
                          errors?.foodAndDrugSafetyLicenseCopy
                            ? errors.foodAndDrugSafetyLicenseCopy.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {router.query.idState == 3 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="foodAndDrugSafetyLicenseCopy" />
                        }
                        variant="standard"
                        {...register("foodAndDrugSafetyLicenseCopy")}
                        error={!!errors.foodAndDrugSafetyLicenseCopy}
                        helperText={
                          errors?.foodAndDrugSafetyLicenseCopy
                            ? errors.foodAndDrugSafetyLicenseCopy.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      {/* <FormControl
                      error={!!errors?.vardiSlip?.vardiDispatchTime}
                      sx={{ width: "80%" }}
                    >
                      <Controller
                        control={control}
                        defaultValue={null}
                        name='vardiSlip.vardiTime'
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              ampm={false}
                              openTo='hours'
                              views={["hours", "minutes", "seconds"]}
                              inputFormat='HH:mm:ss'
                              mask='__:__:__'
                              label='Vardi Time'
                              value={field.value}
                              onChange={(time) => {
                                field.onChange(time);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{ width: "100%" }}
                                  size='small'
                                  {...params}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.vardiSlip?.vardiTime
                          ? errors.vardiSlip?.vardiTime.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* lodggingDTLDao */}
                {router.query.idState == 4 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="noOfRooms" />}
                        variant="standard"
                        {...register("noOfRooms")}
                        error={!!errors.noOfRooms}
                        helperText={
                          errors?.noOfRooms ? errors.noOfRooms.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="foodAndDrugSafetyLicenseCopy" />
                        }
                        incode
                        variant="standard"
                        {...register("foodAndDrugSafetyLicenseCopy")}
                        error={!!errors.foodAndDrugSafetyLicenseCopy}
                        helperText={
                          errors?.foodAndDrugSafetyLicenseCopy
                            ? errors.foodAndDrugSafetyLicenseCopy.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* shaleyPoshanAaharDTLDao */}
                {router.query.idState == 5 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="foodAndDrugSafetyLicenseCopy" />
                        }
                        variant="standard"
                        {...register("foodAndDrugSafetyLicenseCopy")}
                        error={!!errors.foodAndDrugSafetyLicenseCopy}
                        helperText={
                          errors?.foodAndDrugSafetyLicenseCopy
                            ? errors.foodAndDrugSafetyLicenseCopy.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* petrolPumpDTLDao */}
                {router.query.idState == 6 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="nocAreaForPetrolPumpInSqMtrs" />
                        }
                        variant="standard"
                        {...register("nocAreaForPetrolPumpInSqMtrs")}
                        error={!!errors.nocAreaForPetrolPumpInSqMtrs}
                        helperText={
                          errors?.nocAreaForPetrolPumpInSqMtrs
                            ? errors.nocAreaForPetrolPumpInSqMtrs.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="noOfDespesingUnit" />}
                        variant="standard"
                        {...register("noOfDespesingUnit")}
                        error={!!errors.noOfDespesingUnit}
                        helperText={
                          errors?.noOfDespesingUnit
                            ? errors.noOfDespesingUnit.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="fuelTankCapacity" />}
                        variant="standard"
                        {...register("fuelTankCapacity")}
                        error={!!errors.fuelTankCapacity}
                        helperText={
                          errors?.fuelTankCapacity
                            ? errors.fuelTankCapacity.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="lengthOfCascadeForCNG" />}
                        variant="standard"
                        {...register("lengthOfCascadeForCNG")}
                        error={!!errors.lengthOfCascadeForCNG}
                        helperText={
                          errors?.lengthOfCascadeForCNG
                            ? errors.lengthOfCascadeForCNG.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="widthOfCascadeForCNG" />}
                        variant="standard"
                        {...register("widthOfCascadeForCNG")}
                        error={!!errors.widthOfCascadeForCNG}
                        helperText={
                          errors?.widthOfCascadeForCNG
                            ? errors.widthOfCascadeForCNG.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* hospitalDTLDao */}
                {router.query.idState == 7 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        type="number"
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="noOfBeds" />}
                        variant="standard"
                        {...register("noOfBeds")}
                        error={!!errors.noOfBeds}
                        helperText={
                          errors?.noOfBeds ? errors.noOfBeds.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* dmartDTLDao */}
                {router.query.idState == 8 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      {/* <TextField
                        type='number'
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        label={<FormattedLabel id='noOfBeds' />}
                        variant='standard'
                        {...register("noOfBeds")}
                        error={!!errors.noOfBeds}
                        helperText={
                          errors?.noOfBeds ? errors.noOfBeds.message : null
                        }
                      /> */}
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* cinemaHallDTLDao */}
                {router.query.idState == 9 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        type="number"
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="noOfScreen" />}
                        variant="standard"
                        {...register("noOfScreen")}
                        error={!!errors.noOfScreen}
                        helperText={
                          errors?.noOfScreen ? errors.noOfScreen.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        type="number"
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="eachScreenSeatingCapacity" />
                        }
                        variant="standard"
                        {...register("eachScreenSeatingCapacity")}
                        error={!!errors.eachScreenSeatingCapacity}
                        helperText={
                          errors?.eachScreenSeatingCapacity
                            ? errors.eachScreenSeatingCapacity.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                )}

                {/* companyDTLDao */}
                {router.query.idState == 10 && (
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="typesOfCompany" />}
                        variant="standard"
                        {...register("typesOfCompany")}
                        error={!!errors.typesOfCompany}
                        helperText={
                          errors?.typesOfCompany
                            ? errors.typesOfCompany.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="businessDetails" />}
                        variant="standard"
                        {...register("businessDetails")}
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
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="rawMaterialDetails" />}
                        variant="standard"
                        {...register("rawMaterialDetails")}
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
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="finalMaterialDetails" />}
                        variant="standard"
                        {...register("finalMaterialDetails")}
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
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="listOfHazardousMaterial" />}
                        variant="standard"
                        {...register("listOfHazardousMaterial")}
                        error={!!errors.listOfHazardousMaterial}
                        helperText={
                          errors?.listOfHazardousMaterial
                            ? errors.listOfHazardousMaterial.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="rawMaterialDetails" />}
                        variant="standard"
                        {...register("rawMaterialDetails")}
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
                        sx={{ width: "80%" }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="emergencyContactPersonDetails" />
                        }
                        variant="standard"
                        {...register("emergencyContactPersonDetails")}
                        error={!!errors.emergencyContactPersonDetails}
                        helperText={
                          errors?.emergencyContactPersonDetails
                            ? errors.emergencyContactPersonDetails.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                )}

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
                      onClick={() =>
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/businessNocNew",
                        })
                      }
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
