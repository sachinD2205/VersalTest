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
// import Transliteration from "../common/linguosol/transliteration";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
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

  const [open, setOpen] = useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };

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

  const language = useSelector((state) => state?.labels.language);

  const token = useSelector((state) => state.user.user.token);

  // Exit button Routing
  const router = useRouter();

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

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState(null);
  const [showVardiOther, setShowVardiOther] = useState([]);
  // Fetch User From cfc User (Optional)

  // fire station multiselect
  const [selectedModuleName, setSelectedModuleName] = useState([]);

  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);

  const [shifts, setShift] = useState();

  useEffect(() => {
    getShiftData();
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

  console.log("showVardiOther", showVardiOther);

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);

    let FormattedTime = moment(fromData.vardiSlip.vardiTime, "HH:mm:ss").format(
      "HH:mm:ss"
    );

    let fireStationIds = personName3
      // ?.split(",")
      ?.map((uu) => fireStation.find((ff) => ff.fireStationName == uu).id);

    let employeeNameIds = personName2
      // .split(",")
      .map(
        (emp) =>
          userLst.find(
            (user) =>
              user.firstNameEn +
                " " +
                user.middleNameEn +
                " " +
                user.lastNameEn ==
              emp
          )?.id
      );

    console.log(
      "employeeNameIds",
      employeeNameIds.toString(),
      fireStationIds.toString()
    );
    const finalBody = {
      id: router?.query?.id ? router.query.id : null,
      // role: "CREATE_APPLICATION",
      // desg: "DEPT_CLERK",
      // pageMode: router.query.id ? null : "DRAFT",
      // desg: "",
      role: "CREATE_APPLICATION",
      desg: "DEPT_CLERK",
      // pageMode: router.query.id ? null : "DRAFT",
      pageMode: "APPLICATION_CREATED",

      dateAndTimeOfVardi: moment(fromData?.dateAndTimeOfVardi).format(
        "YYYY-MM-DDThh:mm:ss"
      ),

      vardiSlip: {
        ...fromData,
        desg: "",
        vardiTime: FormattedTime,

        vardiSlip: "",

        id: router?.query?.vardiTypeId ? router.query.vardiTypeId : null,

        // fireStationName: selectedModuleName,
        fireStationName: fireStationIds.toString(),
        // .map((r) => fireStation.find((fire) => fire.fireStationName == r)?.id)
        // .toString(),

        // employeeName: selectedEmployeeName,

        employeeName: employeeNameIds.toString(),
        // .map(
        //   (r) =>
        //     userLst.find((user) => user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn == r)
        //       ?.id,
        // )
        // .toString(),
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
              router.back();
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

  console.log("filUser", router?.query?.typeOfVardiId);

  useEffect(() => {
    console.log("router.query.pageMode", router.query.pageMode);
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      setBtnSaveText("Update");
      console.log("router.query", router.query.slipHandedOverTo);

      // setValue("timeOfVardi", router.query.timeOfVardi);

      reset(router.query);
      setShowVardiOther(router?.query?.typeOfVardiId);
      setValue("otherVardiType", router?.query?.otherVardiType);
      setSlipHandedOverTo(router.query.slipHandedOverTo);

      // setSelectedModuleName(router.query.fireStationName);

      setSelectedEmployeeName(router.query.employeeName);

      // setSelectedModuleName(
      //   selectedModuleName === "string"
      //     ? router.query.fireStationName

      //         // .split(",")
      //         .map((rec) => fireStation?.find((fire) => fire.id == rec)?.fireStationName)
      //     : value,
      // );

      setOpen(true);
      if (userLst.length > 0 && fireStation) {
        setPersonName3(
          // typeof router.query.fireStationName === "string"
          //   ? router.query.fireStationName.split(",")
          //   : router.query.fireStationName,
          typeof router.query.fireStationName === "string"
            ? router.query.fireStationName
                .split(",")
                .map(
                  (rec) =>
                    fireStation?.find((fire) => fire.id == rec)?.fireStationName
                )
            : "Not available"
        );

        setPersonName2(
          // typeof router.query.employeeName === "string"
          //   ? router.query.employeeName.split(",")
          //   : router.query.employeeName,

          typeof router.query.employeeName === "string" &&
            typeof router.query.employeeName != ""
            ? router.query.employeeName
                .split(",")
                .map(
                  (rec) => userLst?.find((user) => user.id == rec)?.firstNameEn
                )
            : "-"
        );
        setOpen(false);
      }

      // setValue("id", res.data.id);
      // getById(router.query.id);
    }
  }, [fireStation, userLst]);

  // useEffect(() => {
  //   setPersonName2(
  //     // typeof router.query.employeeName === "string"
  //     //   ? router.query.employeeName.split(",")
  //     //   : router.query.employeeName,

  //     typeof router.query.employeeName === "string"
  //       ? router.query.employeeName
  //           .split(",")
  //           .map((rec) => userLst?.find((user) => user.id == rec)?.firstNameEn)
  //       : router.query.employeeName,
  //   );
  // }, [userLst]);

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
        {/* <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          Loading....
          <CircularProgress color='inherit' />
        </Backdrop> */}
        {open && <Loader />}
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
                        "/FireBrigadeSystem/transactions/emergencyService",
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
                {btnSaveText == "Update" ? (
                  <FormattedLabel id="emergencyServicesUpdate" />
                ) : (
                  <FormattedLabel id="emergencyServices" />
                )}
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
                <Box className={styles.tableHead}>
                  <Box className={styles.feildHead}>
                    {<FormattedLabel id="informerDetails" />}
                  </Box>
                </Box>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={3}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      // InputLabelProps={{
                      //   readOnly: true,
                      // }}
                      // readOnly={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerName"}
                      labelName={"informerName"}
                      fieldName={"informerName"}
                      updateFieldName={"informerNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerName" required />}
                      error={!!errors.informerName}
                      helperText={
                        errors?.informerName
                          ? errors.informerName.message
                          : null
                      }
                    />
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='informerName' />}
                      variant='standard'
                      {...register("informerName")}
                      error={!!errors.informerName}
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
                      error={!!errors.informerMiddleName}
                      helperText={
                        errors?.informerMiddleName
                          ? errors.informerMiddleName.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerMiddleName"}
                      labelName={"informerMiddleName"}
                      fieldName={"informerMiddleName"}
                      updateFieldName={"informerMiddleNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerMiddleName" required />
                      }
                      error={!!errors.informerMiddleName}
                      helperText={
                        errors?.informerMiddleName
                          ? errors.informerMiddleName.message
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
                      error={!!errors.informerLastName}
                      helperText={
                        errors?.informerLastName
                          ? errors.informerLastName.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerLastName"}
                      labelName={"informerLastName"}
                      fieldName={"informerLastName"}
                      updateFieldName={"informerLastNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerLastName" required />}
                      error={!!errors.informerLastName}
                      helperText={
                        errors?.informerLastName
                          ? errors.informerLastName.message
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
                      error={!!errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerNameMr"}
                      labelName={"informerNameMr"}
                      fieldName={"informerNameMr"}
                      updateFieldName={"informerName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="informerNameMr" required />}
                      error={!!errors.informerNameMr}
                      helperText={
                        errors?.informerNameMr
                          ? errors.informerNameMr.message
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
                      error={!!errors.informerMiddleNameMr}
                      helperText={
                        errors?.informerMiddleNameMr
                          ? errors.informerMiddleNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerMiddleNameMr"}
                      labelName={"informerMiddleNameMr"}
                      fieldName={"informerMiddleNameMr"}
                      updateFieldName={"informerMiddleName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerMiddleNameMr" required />
                      }
                      error={!!errors.informerMiddleNameMr}
                      helperText={
                        errors?.informerMiddleNameMr
                          ? errors.informerMiddleNameMr.message
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
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"informerLastNameMr"}
                      labelName={"informerLastNameMr"}
                      fieldName={"informerLastNameMr"}
                      updateFieldName={"informerLastName"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={
                        <FormattedLabel id="informerLastNameMr" required />
                      }
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
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
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"area"}
                      labelName={"area"}
                      fieldName={"area"}
                      updateFieldName={"areaMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="address" required />}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
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
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"city"}
                      labelName={"city"}
                      fieldName={"city"}
                      updateFieldName={"cityMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="city" required />}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid>

                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      disabled={router.query.pageMode == "View"}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="standard-basic"
                      label={<FormattedLabel id="email" />}
                      variant="outlined"
                      {...register("mailID")}
                      error={!!errors.mailID}
                      helperText={errors?.mailID ? errors.mailID.message : null}
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
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"areaMr"}
                      labelName={"areaMr"}
                      fieldName={"areaMr"}
                      updateFieldName={"area"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="areaMr" required />}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='cityMr' />}
                      variant='standard'
                      {...register("cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"cityMr"}
                      labelName={"cityMr"}
                      fieldName={"cityMr"}
                      updateFieldName={"city"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="cityMr" required />}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      disabled={router.query.pageMode == "View"}
                      size="small"
                      sx={{ width: "100%", backgroundColor: "white" }}
                      id="standard-basic"
                      label={<FormattedLabel id="contactNumber" />}
                      variant="outlined"
                      {...register("contactNumber")}
                      error={!!errors.contactNumber}
                      helperText={
                        errors?.contactNumber
                          ? errors.contactNumber.message
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
                  spacing={3}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlace' />}
                      variant='standard'
                      {...register("vardiPlace")}
                      error={!!errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"vardiPlace"}
                      labelName={"vardiPlace"}
                      fieldName={"vardiPlace"}
                      updateFieldName={"vardiPlaceMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="occurancePlace" required />}
                      error={!!errors.vardiPlace}
                      helperText={
                        errors?.vardiPlace ? errors.vardiPlace.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmark' />}
                      variant='standard'
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"landmark"}
                      labelName={"landmark"}
                      fieldName={"landmark"}
                      updateFieldName={"landMarkMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      // disabled={disabled}
                      label={<FormattedLabel id="landmark" required />}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {router?.query?.pageMode == "View" ||
                    router?.query?.pageMode == "Edit" ? (
                      <></>
                    ) : (
                      <>
                        <FormControl
                          error={!!errors?.vardiSlip?.vardiTime}
                          sx={{ width: "100%" }}
                        >
                          <Controller
                            control={control}
                            defaultValue={null}
                            name="vardiSlip.vardiTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  disabled={router.query.pageMode == "View"}
                                  ampm={false}
                                  openTo="hours"
                                  views={["hours", "minutes", "seconds"]}
                                  inputFormat="HH:mm:ss"
                                  mask="__:__:__"
                                  label={<FormattedLabel id="vardiTime" />}
                                  value={field.value}
                                  onChange={(time) => {
                                    field.onChange(time);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      disabled={router.query.pageMode == "View"}
                                      variant="outlined"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      sx={{
                                        width: "100%",
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
                            {errors?.vardiSlip?.vardiTime
                              ? errors.vardiSlip?.vardiTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}

                    {/* <FormControl style={{ marginTop: 10 }} error={!!errors.vardiDispatchTime}>
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
                  {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ width: "58%" }}
                      style={{ marginTop: 10 }}
                      error={!!errors.dateAndTimeOfVardi}
                    >
                      <Controller
                        control={control}
                        // defaultValue={moment(dateAndTimeOfVardi).format(
                        //   "YYYY-DD-MMThh:mm:ss"
                        // )}
                        name="dateAndTimeOfVardi"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                              readOnly
                              label={<FormattedLabel id="dateAndTimeOfVardi" />}
                              value={field.value}
                              // onChange={(date) =>
                              //   field.onChange(
                              //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                              //   )
                              // }
                              //selected={field.value}
                              renderInput={(params) => (
                                <TextField                      sx={{ width: "80%" }}
 size="small" {...params} />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.dateAndTimeOfVardi
                          ? errors.dateAndTimeOfVardi.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='occurancePlaceMr' />}
                      variant='standard'
                      {...register("vardiPlaceMr")}
                      error={!!errors.vardiPlaceMr}
                      helperText={
                        errors?.vardiPlaceMr
                          ? errors.vardiPlaceMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"vardiPlaceMr"}
                      labelName={"vardiPlaceMr"}
                      fieldName={"vardiPlaceMr"}
                      updateFieldName={"vardiPlace"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="occurancePlaceMr" required />}
                      error={!!errors.vardiPlaceMr}
                      helperText={
                        errors?.vardiPlaceMr
                          ? errors.vardiPlaceMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    {/* <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='landmarkMr' />}
                      variant='standard'
                      {...register("landmarkMr")}
                      error={!!errors.landmarkMr}
                      helperText={
                        errors?.landmarkMr ? errors.landmarkMr.message : null
                      }
                    /> */}
                    <Transliteration
                      disabled={router.query.pageMode == "View"}
                      variant={"outlined"}
                      _key={"landmarkMr"}
                      labelName={"landmarkMr"}
                      fieldName={"landmarkMr"}
                      updateFieldName={"landmark"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      // disabled={disabled}
                      label={<FormattedLabel id="landmarkMr" required />}
                      error={!!errors.landmarkMr}
                      helperText={
                        errors?.landmarkMr ? errors.landmarkMr.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      size="small"
                      sx={{ minWidth: "100%" }}
                      error={!!errors.shift}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="shift" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                            }}
                            label="Shift"
                            disabled={router.query.pageMode == "View"}
                            variant="outlined"
                            sx={{
                              backgroundColor: "white", // Set background color to white
                            }}
                          >
                            <MenuItem value="123">
                              <em>
                                {language == "en" ? "None" : "काहीही नाही"}
                              </em>
                            </MenuItem>
                            {shifts &&
                              shifts.map((shift, index) => (
                                <MenuItem key={index} value={shift.id}>
                                  {language == "en"
                                    ? shift.shiftName
                                    : shift.shiftNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="shift"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.shift ? errors.shift.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* Fetch User From cfc User (Optional)*/}
                {/* <div>
                      <FormControl
                        variant="standard"
                             sx={{ minWidth: "70%" }}
                        error={!!errors.typeOfVardiId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="slipHandedOverTo" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="slipHandedOverTo" />}
                            >
                              {userLst &&
                                userLst.map((user, index) => (
                                  <MenuItem key={index} value={user.firstName}>
                                    {user.firstName +
                                      " " +
                                      (typeof user.middleName === "string"
                                        ? user.middleName + " "
                                        : " ") +
                                      user.lastName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="slipHandedOverTo"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.slipHandedOverTo
                            ? errors.slipHandedOverTo.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div> */}
                <br />
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={3}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      sx={{ minWidth: "100%" }}
                      size="small"
                      error={!!errors.typeOfVardiId}
                    >
                      <InputLabel
                        variant="outlined"
                        id="demo-simple-select-standard-label"
                      >
                        <FormattedLabel id="typeOfVardi" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setShowVardiOther(value.target.value);
                            }}
                            label="Type of Vardi"
                            disabled={router.query.pageMode == "View"}
                            variant="outlined"
                            sx={{
                              backgroundColor: "white", // Set background color to white
                            }}
                          >
                            <MenuItem value="123">
                              <em>
                                {language == "en" ? "None" : "काहीही नाही"}
                              </em>
                            </MenuItem>
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
                        name="typeOfVardiId"
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
                  {showVardiOther == 14 ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={router.query.pageMode == "View"}
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="otherVardiType" />}
                          variant="outlined"
                          {...register("otherVardiType")}
                          error={!!errors.otherVardiType}
                          helperText={
                            errors?.otherVardiType
                              ? errors.otherVardiType.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <FormControl
                      sx={{ minWidth: "80%" }}
                      variant="standard"
                      error={!!errors.typeOfVardiId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subTypesOfVardi" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              // setShowVardiOther(value.target.value);
                            }}
                            label="Sub Type Of Vardi"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {subVardiType &&
                              subVardiType
                                .filter((u) => u.vardiTypeId == showVardiOther)
                                .map((vardi, index) => (
                                  <MenuItem key={index} value={vardi.id}>
                                    {language == "en"
                                      ? vardi.subVardiName
                                      : vardi.subVardiNameMr}
                                  </MenuItem>
                                ))}
                          </Select>
                        )}
                        name="subTypeOfVardi"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfVardiId
                          ? errors.typeOfVardiId.message
                          : null}
                      </FormHelperText>
                    </FormControl> */}
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                </Grid>
                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                  spacing={3}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: "100%", backgroundColor: "white" }}
                      error={!!errors.slipHandedOverTo}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="slipHandedOverToEmp" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => {
                              console.log("value", value);
                              field.onChange(value);
                              setSlipHandedOverTo(value.target.value);
                            }}
                            // onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="slipHandedOverToEmp" />}
                            disabled={router.query.pageMode == "View"}
                          >
                            {[
                              { id: 1, menuNameEng: "Yes", menuNameMr: "होय" },
                              { id: 2, menuNameEng: "No", menuNameMr: "नाही" },
                            ].map((menu, index) => {
                              return (
                                <MenuItem key={index} value={menu.id}>
                                  {language == "en"
                                    ? menu.menuNameEng
                                    : menu.menuNameMr}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                        name="slipHandedOverTo"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.slipHandedOverTo
                          ? errors.slipHandedOverTo.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {SlipHandedOverTo == 1 ? (
                    <>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                        >
                          <InputLabel id="demo-multiple-chip-label">
                            Fire Station
                          </InputLabel>
                          <Select
                            label="Fire Station"
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName3}
                            onChange={handleChange3}
                            // onChange={(value) => {
                            //   handleChange3;
                            //   setCrew(value.target.value);
                            //   console.log("bbb", value.target.value);
                            // }}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Fire Station"
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
                            {fireStation?.map((user, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  // user.id
                                  user.fireStationName
                                  // language === "en"
                                  //   ? crew.crewName
                                  //   : crew.crewNameMr
                                }
                                style={getStyles(user, personName3, theme)}
                              >
                                <Checkbox
                                  checked={
                                    personName3.indexOf(user.fireStationName) >
                                    -1
                                  }
                                />
                                <ListItemText primary={user.fireStationName} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {/* <FormControl size="small" sx={{ width: "95%" }}>
                          <InputLabel id="demo-multiple-checkbox-label">
                            <FormattedLabel id="fireStationName" />
                          </InputLabel>
                          <Select
                            // required
                            // {...register("applications")}
                            // error={errors?.selectedModuleName < 1 ? true : false}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            // maxRows={3}
                            // multiline
                            sx={{ backgroundColor: "white" }}
                            value={selectedModuleName}
                            // readonly={dataFromDUR}
                            onChange={_handleChange}
                            label={<FormattedLabel id="fireStationName" />}
                            renderValue={(selected) => selected.join(", ")}
                            // MenuProps={MenuProps}
                          >
                            {fireStation.length > 0
                              ? fireStation?.map((name, index) => {
                                  return (
                                    <MenuItem key={index} value={name.fireStationName}>
                                      <Checkbox
                                        checked={selectedModuleName.indexOf(name.fireStationName) > -1}
                                      />
                                      <ListItemText primary={name.fireStationName} />
                                    </MenuItem>
                                  );
                                })
                              : []}
                          </Select>
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.selectedModuleName < 1 ? errors.fireStationName.message : null}
                          </FormHelperText>
                        </FormControl> */}
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{ width: "100%", backgroundColor: "white" }}
                        >
                          <InputLabel id="demo-multiple-chip-label">
                            Employee Name
                          </InputLabel>

                          <Select
                            label="Employee Name"
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName2}
                            onChange={handleChange2}
                            // onChange={(value) => {
                            //   handleChange3;
                            //   setCrew(value.target.value);
                            //   console.log("bbb", value.target.value);
                            // }}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Employee Name"
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
                            {filUser.length > 0 &&
                              filUser?.map((user, index) => (
                                <MenuItem
                                  // key={name}
                                  // value={name}
                                  key={index}
                                  value={
                                    user.uname
                                    // user.id
                                    // user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn
                                  }
                                  style={getStyles(user, personName2, theme)}
                                >
                                  <Checkbox
                                    checked={
                                      personName2.indexOf(
                                        // user.id,
                                        user?.uname
                                        // user.firstNameEn + " " + user.middleNameEn + " " + user.lastNameEn,
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={
                                      user?.uname
                                      // (typeof user?.firstNameEn === "string" ? user : "") +
                                      // " " +
                                      // (typeof user?.middleNameEn === "string" ? user.middleNameEn : " ") +
                                      // " " +
                                      // (typeof user?.lastNameEn === "string" && user.lastNameEn)
                                    }
                                  />
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {/* <FormControl size="small" sx={{ width: "95%" }}>
                          <InputLabel id="demo-multiple-checkbox-label">
                            <FormattedLabel id="employeeName" />
                          </InputLabel>
                          <Select
                            // required
                            // {...register("applications")}
                            // error={errors?.selectedModuleName < 1 ? true : false}
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            // maxRows={3}
                            // multiline
                            sx={{ backgroundColor: "white" }}
                            value={selectedEmployeeName}
                            // readonly={dataFromDUR}
                            onChange={_handleChangeEmp}
                            label={<FormattedLabel id="employeeName" />}
                            renderValue={(selected) => selected.join(", ")}
                            // MenuProps={MenuProps}
                          >
                            {userLst.length > 0
                              ? userLst?.map((name, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={
                                        name.firstNameEn + " " + name.middleNameEn + " " + name.lastNameEn
                                      }
                                    >
                                      <Checkbox
                                        checked={
                                          selectedEmployeeName.indexOf(
                                            name.firstNameEn +
                                              " " +
                                              name.middleNameEn +
                                              " " +
                                              name.lastNameEn,
                                          ) > -1
                                        }
                                      />
                                      <ListItemText
                                        primary={
                                          (typeof name?.firstNameEn === "string" && name.firstNameEn) +
                                          " " +
                                          (typeof name?.middleNameEn === "string" ? name.middleNameEn : " ") +
                                          " " +
                                          (typeof name?.lastNameEn === "string" && name.lastNameEn)
                                        }
                                      />
                                    </MenuItem>
                                  );
                                })
                              : []}
                          </Select>
                          <FormHelperText style={{ color: "red" }}>
                          </FormHelperText>
                        </FormControl> */}
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </>
                  )}
                </Grid>
                <br />
                <br />

                <Grid container className={styles.feildres} spacing={2}>
                  {router.query.pageMode == "View" ? (
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
                    </>
                  )}

                  <Grid item>
                    <Button
                      size="small"
                      variant="outlined"
                      className={styles.button}
                      endIcon={<ExitToAppIcon />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/FireBrigadeSystem/transactions/emergencyService",
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
