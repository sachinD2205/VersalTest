// import {
//   Box,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Controller, useFormContext } from "react-hook-form";
// import urls from "../../../../../URLS/urls";
// import styles from "../../../../styles/skysignstyles/components.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /////////////////// Drawer Related

// import { styled, useTheme } from "@mui/material/styles";
// import IconButton from "@mui/material/IconButton";
// import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// import Drawer from "@mui/material/Drawer";
// import { Button } from "antd";
// import { Bluetooth } from "@mui/icons-material";

// let drawerWidth;

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
//   ({ theme, open }) => ({
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     marginRight: -drawerWidth,
//     ...(open && {
//       transition: theme.transitions.create("margin", {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       marginRight: 0,
//     }),
//   })
// );

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
//   justifyContent: "flex-start",
// }));

// // http://localhost:4000/hawkerManagementSystem/transactions/components/AddressOfLicense
// const AddressOfLicense = () => {
//   const {
//     control,
//     register,
//     reset,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useFormContext();

//   // Shrink
//   const [shrink1, setShrink1] = useState();
//   const [shrink2, setShrink2] = useState();
//   const [addressShrink, setAddressShrink] = useState();

//   // // crAreaNames
//   // const [crAreaNames, setCRAreaName] = useState([]);

//   // // getAreaName
//   // const getCRAreaName = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/area/getAll`).then((r) => {
//   //     setCRAreaName(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         crAreaName: row.areaName,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crLandmarkNames
//   // const [crLandmarkNames, setCrLandmark] = useState([]);

//   // // getCrLandmark
//   // const getCrLandmark = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/locality/getAll`).then((r) => {
//   //     setCrLandmark(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         crLandmarkName: row.landmark,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crVillageNames
//   // const [crVillageNames, setCrVilageNames] = useState([]);

//   // // getCrVillageNames
//   // const getCrVillageNames = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/village/getAll`).then((r) => {
//   //     setCrVilageNames(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         crVillageName: row.villageNameEng,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crPincodes
//   // const [crPincodes, setCrPinCodes] = useState([]);

//   // // getCrPinCodes
//   // const getCrPinCodes = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/pinCode/getAll`).then((r) => {
//   //     setCrPinCodes(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         crPincode: row.pinCode,
//   //       })),
//   //     );
//   //   });
//   // };

//   // Pay Button
//   const payBtn = () => {
//     toast.success("Paid Successfully", {
//       position: toast.POSITION.TOP_RIGHT,
//     });
//   };

//   // Address Change
//   const addressChange = (e) => {
//     if (e.target.checked) {
//       setValue("prCitySurveyNumber", getValues("crCitySurveyNumber"));
//       setValue("prAreaName", getValues("crAreaName"));
//       setValue("prLandmarkName", getValues("crLandmarkName"));
//       setValue("prVillageName", getValues("crVillageName"));
//       setValue("prPincode", getValues("crPincode"));
//       setValue("prLattitude", getValues("crLattitude"));
//       setValue("prLongitud", getValues("crLongitud"));
//       setAddressShrink(true);
//     } else {
//       setValue("prCitySurveyNumber", "");
//       setValue("prAreaName", "");
//       setValue("prLandmarkName", "");
//       setValue("prVillageName", "");
//       setValue("prPincode", "");
//       setValue("prLattitude", "");
//       setValue("prLongitud", "");
//       setAddressShrink(false);
//       setAddressShrink();
//     }
//   };

//   // // crAreaNames
//   // const [prAreaNames, setprAreaName] = useState([]);

//   // // getAreaName
//   // const getprAreaName = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/area/getAll`).then((r) => {
//   //     setprAreaName(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         prAreaName: row.areaName,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crLandmarkNames
//   // const [prLandmarkNames, setprLandmark] = useState([]);

//   // // getCrLandmark
//   // const getprLandmark = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/locality/getAll`).then((r) => {
//   //     setprLandmark(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         prLandmarkName: row.landmark,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crVillageNames
//   // const [prVillageNames, setprVilageNames] = useState([]);

//   // // getCrVillageNames
//   // const getprVillageNames = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/village/getAll`).then((r) => {
//   //     setprVilageNames(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         prVillageName: row.villageNameEng,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // crPincodes
//   // const [prPincodes, setprPinCodes] = useState([]);

//   // // getCrPinCodes
//   // const getprPinCodes = () => {
//   //   axios.get(`${urls.CFCUrlMaster}/pinCode/getAll`).then((r) => {
//   //     setprPinCodes(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         prPincode: row.pinCode,
//   //       })),
//   //     );
//   //   });
//   // };

//   // useEffect
//   useEffect(() => {
//     // getCrLandmark();
//     // getCRAreaName();
//     // getCrVillageNames();
//     // getCrPinCodes();
//     // getprLandmark();
//     // getprAreaName();
//     // getprVillageNames();
//     // getprPinCodes();
//   }, []);

//   // /////// Drawer Code
//   const theme = useTheme();
//   const [open, setOpen] = React.useState(false);

//   // Open Drawer
//   const handleDrawerOpen = () => {
//     setOpen(!open);
//     drawerWidth = "50%";
//   };

//   // Close Drawer
//   const handleDrawerClose = () => {
//     setOpen(false);
//     drawerWidth = 0;
//   };

//   /////////////////////////////

//   return (
//     <>
//       {/** Btton */}
//       <Box
//         style={{
//           right: 10,
//           position: "absolute",
//           top: "130%",
//           backgroundColor: "#bdbdbd",
//         }}
//       >
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           // edge="end"
//           onClick={handleDrawerOpen}
//           sx={{ width: "30px", height: "75px", borderRadius: 0 }}
//         >
//           <ArrowLeftIcon />
//         </IconButton>
//       </Box>

//       {/** Main Component  */}
//       <Main>
//         <div
//           style={{
//             backgroundColor: "#0084ff",
//             color: "white",
//             fontSize: 19,
//             marginTop: 30,
//             marginBottom: 30,
//             padding: 8,
//             paddingLeft: 30,
//             marginLeft: "40px",
//             marginRight: "65px",
//             borderRadius: 100,
//           }}
//         >
//           <FormattedLabel id="tax" />
//         </div>
//         {/*<div>
//           <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
//             <strong>Tax</strong>
//             {<FormattedLabel id="tax"></FormattedLabel>}
//           </Typography>
//         </div> */}
//         <Grid
//           container
//           sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
//         >
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <TextField
//               autoFocus
//               id="standard-basic"
//               // lable="aaaaaaaaa"
//               label={<FormattedLabel id="crPropertyTaxNumber" />}
//               {...register("crPropertyTaxNumber")}
//               error={!!errors.crPropertyTaxNumber}
//               helperText={
//                 errors?.crPropertyTaxNumber
//                   ? errors.crPropertyTaxNumber.message
//                   : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <div className={styles.btn1}>
//               <Button
//                 className={styles.pay1}
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 //  padding="20px"
//                 color="primary"
//                 // endIcon={<ClearIcon />}
//                 onClick={() => {
//                   setShrink1(true);
//                   setValue("proprtyAmount", "15000.00");
//                 }}
//               >
//                 View Bill
//               </Button>
//             </div>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <TextField
//               id="standard-basic"
//               InputLabelProps={{ shrink: shrink1 }}
//               label={<FormattedLabel id="proprtyAmount"></FormattedLabel>}
//               variant="outlined"
//               sx={{
//                 width: "250px",
//                 height: "50px",
//               }}
//               size="large"
//               {...register("proprtyAmount")}
//               error={!!errors.proprtyAmount}
//               helperText={
//                 errors?.proprtyAmount ? errors.proprtyAmount.message : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <div className={styles.btn1}>
//               <Button
//                 className={styles.pay1}
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 //  padding="20px"
//                 color="primary"
//                 // endIcon={<ClearIcon />}
//                 onClick={() => payBtn()}
//               >
//                 Pay
//               </Button>
//             </div>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <TextField
//               autoFocus
//               id="standard-basic"
//               // InputLabelProps={{ shrink: true }}
//               label={<FormattedLabel id="crWaterConsumerNo"></FormattedLabel>}
//               {...register("crWaterConsumerNo")}
//               error={!!errors.crWaterConsumerNo}
//               helperText={
//                 errors?.crWaterConsumerNo
//                   ? errors.crWaterConsumerNo.message
//                   : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <div className={styles.btn1}>
//               <Button
//                 className={styles.pay1}
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 //  padding="20px"
//                 color="primary"
//                 // endIcon={<ClearIcon />}
//                 onClick={() => {
//                   setShrink2(true);
//                   setValue("waterAmount", "250.00");
//                 }}
//               >
//                 View Bill
//               </Button>
//             </div>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <TextField
//               id="standard-basic"
//               InputLabelProps={{ shrink: shrink2 }}
//               label={<FormattedLabel id="waterAmount"></FormattedLabel>}
//               variant="outlined"
//               sx={{
//                 width: "250px",
//                 height: "50px",
//               }}
//               size="large"
//               {...register("waterAmount")}
//               error={!!errors.waterAmount}
//               helperText={
//                 errors?.waterAmount ? errors.waterAmount.message : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}> */}
//             <div className={styles.btn1}>
//               <Button
//                 className={styles.pay1}
//                 sx={{ marginTop: 20 }}
//                 variant="contained"
//                 color="primary"
//                 // endIcon={<ClearIcon />}
//                 onClick={() => payBtn()}
//               >
//                 Pay
//               </Button>
//             </div>
//           </Grid>
//         </Grid>

//         <div
//           style={{
//             backgroundColor: "#0084ff",
//             color: "white",
//             fontSize: 19,
//             marginTop: 30,
//             marginBottom: 30,
//             padding: 8,
//             paddingLeft: 30,
//             marginLeft: "40px",
//             marginRight: "65px",
//             borderRadius: 100,
//           }}
//         >
//           <FormattedLabel id="currentAddress" />
//         </div>
//         {/* <div>
//           <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
//             {/* <strong> Current Address</strong>
//             {<FormattedLabel id="currentAddress"></FormattedLabel>}
//           </Typography>
//         </div> */}
//         <Grid
//           container
//           sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
//         >
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               autoFocus
//               id="standard-basic"
//               label={<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
//               {...register("crCitySurveyNumber")}
//               error={!!errors.crCitySurveyNumber}
//               helperText={
//                 errors?.crCitySurveyNumber
//                   ? errors.crCitySurveyNumber.message
//                   : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               autoFocus
//               id="standard-basic"
//               label={<FormattedLabel id="crAreaName"></FormattedLabel>}
//               {...register("crAreaName")}
//               error={!!errors.crAreaName}
//               helperText={errors?.crAreaName ? errors.crAreaName.message : null}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               autoFocus
//               id="standard-basic"
//               label={<FormattedLabel id="crLandmarkName"></FormattedLabel>}
//               {...register("crLandmarkName")}
//               error={!!errors.crLandmarkName}
//               helperText={
//                 errors?.crLandmarkName ? errors.crLandmarkName.message : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               autoFocus
//               id="standard-basic"
//               label={<FormattedLabel id="crVillageName"></FormattedLabel>}
//               {...register("crVillageName")}
//               error={!!errors.crVillageName}
//               helperText={
//                 errors?.crVillageName ? errors.crVillageName.message : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               id="standard-basic"
//               disabled
//               defaultValue={"Pimpri Chinchwad"}
//               label={<FormattedLabel id="crCityName"></FormattedLabel>}
//               {...register("crCityName")}
//               error={!!errors.crCityName}
//               helperText={errors?.crCityName ? errors.crCityName.message : null}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               id="standard-basic"
//               disabled
//               defaultValue={"Maharashtra"}
//               label={<FormattedLabel id="crState"></FormattedLabel>}
//               {...register("crState")}
//               error={!!errors.crState}
//               helperText={errors?.crState ? errors.crState.message : null}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               autoFocus
//               id="standard-basic"
//               label={<FormattedLabel id="crPincode"></FormattedLabel>}
//               {...register("crPincode")}
//               error={!!errors.crPincode}
//               helperText={errors?.crPincode ? errors.crPincode.message : null}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               id="standard-basic"
//               label={<FormattedLabel id="crLattitude"></FormattedLabel>}
//               {...register("crLattitude")}
//               error={!!errors.crLattitude}
//               helperText={
//                 errors?.crLattitude ? errors.crLattitude.message : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               //  InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crLongitud"></FormattedLabel>}
//               {...register("crLongitud")}
//               error={!!errors.crLongitud}
//               helperText={errors?.crLongitud ? errors.crLongitud.message : null}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             {/**
//             <Button
//               variant='contained'
//               onClick={() => {
//                 handleDrawerOpen();
//               }}
//             >
//               View Location On Map
//             </Button>
//            */}
//           </Grid>
//         </Grid>

//         <div
//           style={{
//             backgroundColor: "#0084ff",
//             color: "white",
//             fontSize: 19,
//             marginTop: 30,
//             marginBottom: 30,
//             padding: 8,
//             paddingLeft: 30,
//             marginLeft: "40px",
//             marginRight: "65px",
//             borderRadius: 100,
//           }}
//         >
//           <FormattedLabel id="postalAddress" />
//         </div>
//         {/* <div className={styles.row}>
//           <Typography variant='h6' sx={{ marginBottom: 5 }}>
//             <strong> Permanent / Postal Address </strong>
//             {<FormattedLabel id="postalAddress"></FormattedLabel>}
//           </Typography>
//         </div> */}

//         <Grid
//           container
//           sx={{ marginLeft: 5, marginBottom: 10, align: "center" }}
//         >
//           {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//             <FormControlLabel
//               control={<Checkbox />}
//               label={<FormattedLabel id="permanentCorrespondence"></FormattedLabel>}
//               // <b> Permanent Address as the Correspondence Address </b>

//               {...register("addressCheckBox")}
//               onChange={(e) => {
//                 addressChange(e);
//               }}
//             />
//           </Grid> */}

//           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//             <FormControlLabel
//               control={
//                 <Controller
//                   name="addressCheckBox"
//                   control={control}
//                   defaultValue={false}
//                   render={({ field: { value, ref, ...field } }) => (
//                     <Checkbox
//                       {...field}
//                       inputRef={ref}
//                       checked={!!value}
//                       onChange={(e) => {
//                         setValue("addressCheckBox", e.target.checked);
//                         addressChange(e);
//                         console.log("checked1", e.target.checked);
//                         // console.log("checked2",getValues("addressCheckBox"))
//                       }}

//                       // disableRipple
//                     />
//                   )}
//                 />
//               }
//               label=<Typography>
//                 <b>{<FormattedLabel id="permanentCorrespondence" />}</b>
//               </Typography>
//               labelPlacement="End"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
//               {...register("prCitySurveyNumber")}
//               error={!!errors.prCitySurveyNumber}
//               helperText={
//                 errors?.prCitySurveyNumber
//                   ? errors.prCitySurveyNumber.message
//                   : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crAreaName"></FormattedLabel>}
//               {...register("prAreaName")}
//               error={!!errors.prAreaName}
//               helperText={errors?.prAreaName ? errors.prAreaName.message : null}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crLandmarkName"></FormattedLabel>}
//               {...register("prLandmarkName")}
//               error={!!errors.prLandmarkName}
//               helperText={
//                 errors?.prLandmarkName ? errors.prLandmarkName.message : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crVillageName"></FormattedLabel>}
//               {...register("prVillageName")}
//               error={!!errors.prVillageName}
//               helperText={
//                 errors?.prVillageName ? errors.prVillageName.message : null
//               }
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               id="standard-basic"
//               disabled
//               defaultValue={"Pimpri Chinchwad"}
//               label={<FormattedLabel id="crCityName"></FormattedLabel>}
//               {...register("prCityName")}
//               error={!!errors.prCityName}
//               helperText={errors?.prCityName ? errors.prCityName.message : null}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               shrink={true}
//               id="standard-basic"
//               disabled
//               defaultValue={"Maharashtra"}
//               label={<FormattedLabel id="crState"></FormattedLabel>}
//               {...register("prState")}
//               error={!!errors.prState}
//               helperText={errors?.prState ? errors.prState.message : null}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crPincode"></FormattedLabel>}
//               {...register("prPincode")}
//               error={!!errors.prPincode}
//               helperText={errors?.prPincode ? errors.prPincode.message : null}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crLattitude"></FormattedLabel>}
//               {...register("prLattitude")}
//               error={!!errors.prLattitude}
//               helperText={
//                 errors?.prLattitude ? errors.prLattitude.message : null
//               }
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
//             <TextField
//               InputLabelProps={{ shrink: true }}
//               id="standard-basic"
//               label={<FormattedLabel id="crLongitud"></FormattedLabel>}
//               {...register("prLongitud")}
//               error={!!errors.prLongitud}
//               helperText={errors?.prLongitud ? errors.prLongitud.message : null}
//             />
//           </Grid>
//         </Grid>
//       </Main>

//       {/** Drawer  */}
//       <Drawer
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: drawerWidth,
//           },
//         }}
//         variant="persistent"
//         anchor="right"
//         open={open}
//       >
//         {/* <DrawerHeader>
//           <IconButton onClick={handleDrawerClose}>
//             {theme.direction === "rtl" ? (
//               <ChevronLeftIcon />
//             ) : (
//               <ChevronRightIcon />
//             )}
//           </IconButton>
//         </DrawerHeader> */}
//         {/* <Divider /> */}

//         <Box
//           style={{
//             left: 0,
//             position: "absolute",
//             top: "50%",
//             backgroundColor: "#bdbdbd",
//           }}
//         >
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             // edge="end"
//             onClick={handleDrawerClose}
//             sx={{ width: "30px", height: "75px", borderRadius: 0 }}
//           >
//             <ArrowRightIcon />
//           </IconButton>
//         </Box>
//         <img
//           src="/ABC.jpg"
//           //hegiht='300px'
//           width="800px"
//           alt="Map Not Found"
//           style={{ width: "100%", height: "100%" }}
//         />
//       </Drawer>
//       {/** End Drawer  */}
//     </>
//   );
// };

// export default AddressOfLicense;
