// import { yupResolver } from "@hookform/resolvers/yup";
// import ClearIcon from "@mui/icons-material/Clear";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   Paper,
//   Radio,
//   RadioGroup,
//   TextField,
//   Typography,
// } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// import urls from "../../../../URLS/urls";
// import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import { TimePicker } from "@mui/x-date-pickers";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import moment from "moment";
// import { useRouter } from "next/router";
// import sweetAlert from "sweetalert";
// import UploadButton from "../../../../components/fireBrigadeSystem/UploadButton";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/fireBrigadeSystem/occuranceRegisterTransaction";

// const Form = () => {
//   // const language = useSelector((state) => state?.labels.language);

//   // Exit button Routing
//   const router = useRouter();

//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     reset,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   const [btnSaveText, setBtnSaveText] = useState("Save");
//   const [vardiTypes, setVardiTypes] = useState();
//   const [fireStation, setfireStation] = useState();
//   const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
//   const [showVardiOther, setShowVardiOther] = useState([]);
//   // Fetch User From cfc User (Optional)
//   const [userLst, setUserLst] = useState([]);

//   // useEffect(() => {
//   //   getUser();
//   //   getVardiTypes();
//   //   getFireStationName();
//   // }, []);

//   // get employee from cfc
//   // const getUser = () => {
//   //   axios.get(`${urls.CFCURL}/master/user/getAll`).then((res) => {
//   //     setUserLst(res?.data);
//   //   });
//   // };

//   // get fire station name
//   // const getFireStationName = () => {
//   //   axios
//   //     .get(
//   //       `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`
//   //     )
//   //     .then((res) => {
//   //       console.log("resss", res.data);
//   //       setfireStation(res?.data);
//   //     });
//   // };

//   // get Vardi Types
//   // const getVardiTypes = () => {
//   //   axios
//   //     .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`)
//   //     .then((res) => {
//   //       setVardiTypes(res?.data);
//   //     });
//   // };

//   const onSubmitForm = (fromData) => {
//     const finalBody = {
//       ...fromData,
//       dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
//         "YYYY-DD-MMThh:mm:ss"
//       ),
//     };

//     axios
//       .post(`${urls.FbsURL}/transaction/trnOccuranceRegister/save`, finalBody)
//       .then((res) => {
//         if (res.status == 201) {
//           fromData.id
//             ? sweetAlert("Update!", "Record Updated successfully !", "success")
//             : sweetAlert("Saved!", "Record Saved successfully !", "success");
//           // setButtonInputState(false);
//           // setIsOpenCollapse(false);
//           // setFetchData(tempData);

//           router.back();
//           // setEditButtonInputState(false);
//           // setDeleteButtonState(false);
//         }
//       });
//   };

//   useEffect(() => {
//     if (router.query.pageMode == "Edit") {
//       console.log("hello", router?.query);
//       setBtnSaveText("Update");
//       reset(router?.query);
//     }
//   }, []);

//   // cancell Button
//   const cancellButton = () => {
//     reset({
//       ...resetValuesCancell,
//       id,
//     });
//   };

//   // Reset Values Cancell
//   const resetValuesCancell = {};

//   // View
//   return (
//     <>
//       <Box
//         style={{
//           margin: "4%",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//         }}
//       >
//         <Box sx={{ flexGrow: 1 }} style={{ backgroundColor: "#BFC9CA  " }}>
//           <AppBar position='static' sx={{ backgroundColor: "#FBFCFC " }}>
//             <Toolbar variant='dense'>
//               <IconButton
//                 edge='start'
//                 color='inherit'
//                 aria-label='menu'
//                 sx={{
//                   mr: 2,
//                   color: "#2980B9",
//                 }}
//               >
//                 <ArrowBackIcon
//                   onClick={() =>
//                     router.push({
//                       pathname:
//                         "/FireBrigadeSystem/transactions/occuranceBookEntry",
//                     })
//                   }
//                 />
//               </IconButton>

//               <Typography
//                 sx={{
//                   textAlignVertical: "center",
//                   textAlign: "center",
//                   color: "rgb(7 110 230 / 91%)",
//                   flex: 1,
//                   flexDirection: "row",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   typography: {
//                     xs: "body1",
//                     sm: "h6",
//                     md: "h5",
//                     lg: "h4",
//                     xl: "h3",
//                   },
//                 }}
//               >
//                 {/* {btnSaveText == "Update" ? (
//                   <FormattedLabel id="emergencyServicesUpdate" />
//                 ) : (
//                   <FormattedLabel id="emergencyServices" />
//                 )} */}
//                 <FormattedLabel id='occuranceBookEntry' />
//               </Typography>
//             </Toolbar>
//           </AppBar>
//         </Box>
//         <Paper
//           sx={{
//             margin: 1,
//             padding: 2,
//             backgroundColor: "#F5F5F5",
//           }}
//           elevation={5}
//         >
//           <div>
//             <FormProvider {...methods}>
//               <form onSubmit={handleSubmit(onSubmitForm)}>
//                 <div className={styles.details}>
//                   <div className={styles.h1Tag}>
//                     <h3
//                       style={{
//                         color: "white",
//                         marginTop: "5px",
//                         paddingLeft: 10,
//                       }}
//                     >
//                       {<FormattedLabel id='occurrenceBookEntry' />}
//                       {/* Occurrence Book Entry */}
//                     </h3>
//                   </div>
//                 </div>

//                 <Grid
//                   container
//                   columns={{ xs: 4, sm: 8, md: 12 }}
//                   className={styles.feildres}
//                 >
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       label={<FormattedLabel id='occuranceNo' />}
//                       // label="Occurance No "
//                       variant='standard'
//                       {...register("informerName")}
//                       error={!!errors.informerName}
//                       helperText={
//                         errors?.informerName
//                           ? errors.informerName.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <FormControl
//                       style={{ marginTop: 10 }}
//                       error={!!errors.dateAndTimeOfVardi}
//                     >
//                       <Controller
//                         control={control}
//                         defaultValue={moment().format("YYYY-DD-MMThh:mm:ss")}
//                         // name="dateAndTimeOfVardi"
//                         render={({ field }) => (
//                           <LocalizationProvider dateAdapter={AdapterMoment}>
//                             <DateTimePicker
//                               // label="Date Of Incident *"
//                               label={<FormattedLabel id='dateOfIncident' />}
//                               value={field.value}
//                               onChange={(date) =>
//                                 field.onChange(
//                                   moment(date).format("YYYY-DD-MM hh:mm:ss")
//                                 )
//                               }
//                               //selected={field.value}
//                               renderInput={(params) => (
//                                 <TextField
//                               )}
//                             />
//                           </LocalizationProvider>
//                         )}
//                       />
//                       <FormHelperText>
//                         {errors?.DateOfIncident
//                           ? errors.DateOfIncident.message
//                           : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <FormControl
//                       style={{ marginTop: 10 }}
//                       error={!!errors.vardiDispatchTime}
//                     >
//                       <Controller
//                         control={control}
//                         name='vehicleDispatchTime'
//                         render={({ field }) => (
//                           <LocalizationProvider dateAdapter={AdapterMoment}>
//                             <TimePicker
//                               // label="Time Of Incident *"
//                               label={<FormattedLabel id='timeOfIncident' />}
//                               value={field.value}
//                               onChange={(time) => field.onChange(time)}
//                               selected={field.value}
//                               renderInput={(params) => (
//                                 <TextField
//                               )}
//                             />
//                           </LocalizationProvider>
//                         )}
//                       />
//                       <FormHelperText>
//                         {errors?.TimeOfIncident
//                           ? errors.TimeOfIncident.message
//                           : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </Grid>
//                   {/* marathi */}
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Occurance Details *"
//                       label={<FormattedLabel id='occuranceDetails' />}
//                       variant='standard'
//                       {...register("informerNameMr")}
//                       error={!!errors.OccuranceDetails}
//                       helperText={
//                         errors?.OccuranceDetails
//                           ? errors.OccuranceDetails.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
// <TextField
//   id='standard-basic'
//   // label="Informer Details *"
//   label={<FormattedLabel id='informerDetails' />}
//   variant='standard'
//   {...register("informerDetails")}
//   error={!!errors.informerDetails}
//   helperText={
//     errors?.informerDetails
//       ? errors.informerDetails.message
//       : null
//   }
// />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Address of Informer *"
//                       label={<FormattedLabel id='addressOfInformer' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Incidance took Place *"
//                       label={<FormattedLabel id='incidanceTookPlace' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Damage Details *"
//                       label={<FormattedLabel id='damageDetails' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <FormControl>
//                       {/* <FormLabel id="demo-radio-buttons-group-label">
//                         Occurance Within PCMC Area *
//                       </FormLabel> */}
//                       <FormattedLabel id='occurancePcmcArea' />
//                       <RadioGroup
//                         aria-labelledby='demo-radio-buttons-group-label'
//                         name='radio-buttons-group'
//                       >
//                         <FormControlLabel
//                           value='yes'
//                           control={<Radio />}
//                           label='Yes'
//                         />
//                         <FormControlLabel
//                           value='no'
//                           control={<Radio />}
//                           label='No'
//                         />
//                       </RadioGroup>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       type={"number"}
//                       id='standard-basic'
//                       // label="Charges if Outside PCMC *"
//                       label={<FormattedLabel id='chargesIfOutsidePCMC' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Details Description of incident Site *"
//                       label={<FormattedLabel id='detailsOfIncidentSite' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>
//                   <Grid item xs={4} className={styles.feildres}>
//                     <TextField
//                       id='standard-basic'
//                       // label="Remark *"
//                       label={<FormattedLabel id='remark' />}
//                       variant='standard'
//                       {...register("informerLastNameMr")}
//                       error={!!errors.informerLastNameMr}
//                       helperText={
//                         errors?.informerLastNameMr
//                           ? errors.informerLastNameMr.message
//                           : null
//                       }
//                     />
//                   </Grid>

//                   <Grid item xs={4} className={styles.feildres}>
//                     {/* <Typography>Upload Images *</Typography> */}
//                     <FormattedLabel id='uploadImages' />
//                     <UploadButton
//                       Change={(e) => {
//                         handleFile1(e, "documentsUpload");
//                       }}
//                       {...register("documentsUpload")}
//                     />
//                   </Grid>
//                   <Grid
//                     item
//                     xs={5}
//                     style={{ marginLeft: "-2rem" }}
//                     className={styles.feildres}
//                   >
//                     <TextField
//                       sx={{ width: 250 }}
//                       id='standard-basic'
//                       label={<FormattedLabel id='geoLocation' />}
//                       variant='standard'
//                       // {...register("gISLocation")}
//                       // error={!!errors.gISLocation}
//                       // helperText={
//                       //   errors?.gISLocation
//                       //     ? errors.gISLocation.message
//                       //     : null
//                       // }
//                     />
//                   </Grid>
//                   <Grid item xs={3} className={styles.feildres}></Grid>
//                 </Grid>
//                 <br />
//                 <br />

//                 <Grid container className={styles.feildres} spacing={2}>
//                   <Grid item>
//                     <Button
//                       type='submit'
//                       size='small'
//                       variant='outlined'
//                       className={styles.button}
//                       endIcon={<SaveIcon />}
//                     >
//                       {btnSaveText == "Update" ? (
//                         "Update"
//                       ) : (
//                         <FormattedLabel id='save' />
//                       )}
//                     </Button>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       size='small'
//                       variant='outlined'
//                       className={styles.button}
//                       endIcon={<ClearIcon />}
//                       onClick={() => cancellButton()}
//                     >
//                       {<FormattedLabel id='clear' />}
//                     </Button>
//                   </Grid>
//                   <Grid item>
//                     <Button
//                       size='small'
//                       variant='outlined'
//                       className={styles.button}
//                       endIcon={<ExitToAppIcon />}
//                       onClick={() =>
//                         router.push({
//                           pathname:
//                             "/FireBrigadeSystem/transactions/occuranceRegister",
//                         })
//                       }
//                     >
//                       {<FormattedLabel id='exit' />}
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </form>
//             </FormProvider>
//           </div>
//         </Paper>
//       </Box>
//     </>
//   );
// };

// export default Form;

import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/occuranceBookEntryReport";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Form = () => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  // Exit button Routing
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [vardiTypes, setVardiTypes] = useState();
  const [fireStation, setfireStation] = useState();
  const [SlipHandedOverTo, setSlipHandedOverTo] = useState([]);
  const [showVardiOther, setShowVardiOther] = useState([]);
  // Fetch User From cfc User (Optional)
  const [userLst, setUserLst] = useState([]);

  useEffect(() => {
    getUser();
    getVardiTypes();
    getFireStationName();
  }, []);

  // get employee from cfc
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setUserLst(res?.data);
      });
  };

  // get fire station name
  const getFireStationName = () => {
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
        console.log("resss", res.data);
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
        setVardiTypes(res?.data);
      });
  };

  const onSubmitForm = (fromData) => {
    let dateOfIncident = moment(fromData.dateOfIncident).format("YYYY-MM-DD");
    let timeOfIncident = moment(fromData.timeOfIncident, "HH:mm:ss").format(
      "HH:mm:ss"
    );

    const finalBody = {
      ...fromData,
      dateOfIncident,
      timeOfIncident,
      // dateOfIncident: "",

      // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      //   "YYYY-DD-MMThh:mm:ss"
      // ),
    };

    axios
      .post(`${urls.FbsURL}/transaction/trnOccuranceRegister/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 201 || res.status == 200) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setFetchData(tempData);

          router.back();
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("hello", router.query.pageMode);
      setBtnSaveText("Update");
      reset(router.query);
    }
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
    contactNumber: "",
    occurancePlace: "",
    occurancePlaceMr: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    slipHandedOverToMr: "",
    landmark: "",
    landmarkMr: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
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
    occurancePlace: "",
    typeOfVardiId: "",
    slipHandedOverTo: "",
    landmark: "",
    vardiReceivedName: "",
    dateAndTimeOfVardi: "",
    documentsUpload: "",
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
                        "/FireBrigadeSystem/transactions/occuranceRegister",
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
                  <FormattedLabel id="emergencyServicesUpdate" />
                ) : (
                  <FormattedLabel id="emergencyServices" />
                )} */}
                <FormattedLabel id="occuranceBookEntry" />
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
                {/* <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "5px",
                        paddingLeft: 10,
                      }}
                    >
                      {<FormattedLabel id='occuranceBookEntry' />}
                    </h3>
                  </div>
                </div> */}

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      style={{ marginTop: 10, marginRight: "2vw" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="dateOfIncident"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={<span style={{ fontSize: 16 }}>Date</span>}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
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
                        {errors?.dateOfIncident
                          ? errors.dateOfIncident.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      error={!!errors?.timeOfIncident}
                      sx={{ width: "80%" }}
                    >
                      <Controller
                        control={control}
                        defaultValue={null}
                        name="timeOfIncident"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              ampm={false}
                              openTo="hours"
                              views={["hours", "minutes", "seconds"]}
                              inputFormat="HH:mm:ss"
                              mask="__:__:__"
                              label="Time"
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
                                  size="small"
                                  {...params}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.timeOfIncident
                          ? errors?.timeOfIncident.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="vardiAhalNumber" />}
                      variant="standard"
                      {...register("vardiAhalNumber")}
                      error={!!errors.vardiAhalNumber}
                      helperText={
                        errors?.vardiAhalNumber
                          ? errors.vardiAhalNumber.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                {/* <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
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
                    />
                  </Grid>
                </Grid> */}

                {/* <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                > */}
                {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='area' />}
                      variant='standard'
                      {...register("area")}
                      error={!!errors.area}
                      helperText={errors?.area ? errors.area.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='city' />}
                      variant='standard'
                      {...register("city")}
                      error={!!errors.city}
                      helperText={errors?.city ? errors.city.message : null}
                    />
                  </Grid> */}

                {/* <Grid item xs={4} className={styles.feildres}>
                    <FormControl
                      variant='standard'
                      sx={{ width: "80%" }}
                      error={!!errors.crPincode}
                    >
                      <InputLabel id='demo-simple-select-standard-label'>
                        Pin Code
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label='Pin Code'
                          >
                            {crPincodes &&
                              crPincodes.map((crPincode, index) => (
                                <MenuItem key={index} value={crPincode.id}>
                                  {crPincode.crPincode}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name='pinCode'
                        control={control}
                        defaultValue=''
                      />
                      <FormHelperText>
                        {errors?.pinCode ? errors.pinCode.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}
                {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      // label="Incidance took Place *"
                      label={<FormattedLabel id='incidanceTookPlace' />}
                      variant='standard'
                      {...register("informerLastNameMr")}
                      error={!!errors.informerLastNameMr}
                      helperText={
                        errors?.informerLastNameMr
                          ? errors.informerLastNameMr.message
                          : null
                      }
                    />
                  </Grid> */}
                {/* marathi */}
                {/* <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='areaMr' />}
                      variant='standard'
                      {...register("areaMr")}
                      error={!!errors.areaMr}
                      helperText={errors?.areaMr ? errors.areaMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='cityMr' />}
                      variant='standard'
                      {...register("cityMr")}
                      error={!!errors.cityMr}
                      helperText={errors?.cityMr ? errors.cityMr.message : null}
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id='standard-basic'
                      label={<FormattedLabel id='contactNumber' />}
                      variant='standard'
                      {...register("contactNumber")}
                      error={!!errors.contactNumber}
                      helperText={
                        errors?.contactNumber
                          ? errors.contactNumber.message
                          : null
                      }
                    />
                  </Grid> */}
                {/* </Grid> */}

                <Grid
                  container
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  className={styles.feildres}
                >
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="occuranceDetails" />}
                      variant="standard"
                      {...register("occuranceDetails")}
                      error={!!errors.occuranceDetails}
                      helperText={
                        errors?.occuranceDetails
                          ? errors.occuranceDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="occuranceDetailsMr" />}
                      variant="standard"
                      {...register("occuranceDetailsMr")}
                      error={!!errors.occuranceDetailsMr}
                      helperText={
                        errors?.occuranceDetailsMr
                          ? errors.occuranceDetailsMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={
                        <FormattedLabel id="detailsDescriptionOfIncidentSite" />
                      }
                      variant="standard"
                      {...register("detailsDescriptionOfIncidentSite")}
                      error={!!errors.detailsDescriptionOfIncidentSite}
                      helperText={
                        errors?.detailsDescriptionOfIncidentSite
                          ? errors.detailsDescriptionOfIncidentSite.message
                          : null
                      }
                    />
                  </Grid>
                  {/* marathi */}
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={
                        <FormattedLabel id="detailsDescriptionOfIncidentSiteMr" />
                      }
                      variant="standard"
                      {...register("detailsDescriptionOfIncidentSiteMr")}
                      error={!!errors.detailsDescriptionOfIncidentSiteMr}
                      helperText={
                        errors?.detailsDescriptionOfIncidentSiteMr
                          ? errors.detailsDescriptionOfIncidentSiteMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="gEOLocationOfSite" />}
                      variant="standard"
                      {...register("gEOLocationOfSite")}
                      error={!!errors.gEOLocationOfSite}
                      helperText={
                        errors?.gEOLocationOfSite
                          ? errors.gEOLocationOfSite.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="vehicleDetails" />}
                      variant="standard"
                      {...register("vehicleDetails")}
                      error={!!errors.vehicleDetails}
                      helperText={
                        errors?.vehicleDetails
                          ? errors.vehicleDetails.message
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
                      label={<FormattedLabel id="causeOfFire" />}
                      variant="standard"
                      {...register("causeOfFire")}
                      error={!!errors.causeOfFire}
                      helperText={
                        errors?.causeOfFire ? errors.causeOfFire.message : null
                      }
                    />
                  </Grid>
                  <Grid item xs={4} className={styles.feildres}>
                    <TextField
                      sx={{ width: "80%" }}
                      id="standard-basic"
                      // label="Informer Details *"
                      label={<FormattedLabel id="informerDetails" />}
                      variant="standard"
                      {...register("informerDetails")}
                      error={!!errors.informerDetails}
                      helperText={
                        errors?.informerDetails
                          ? errors.informerDetails.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <br />
                <br />
                {console.log("router.query.pageMode", router.query.pageMode)}
                {/* {router.query.pageMode == "Edit" && ( */}
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
                            "/FireBrigadeSystem/transactions/occuranceRegister",
                        })
                      }
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Grid>
                </Grid>
                {/* // )} */}
              </form>
            </FormProvider>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Form;
