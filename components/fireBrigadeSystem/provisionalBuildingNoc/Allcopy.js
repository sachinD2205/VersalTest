// import { yupResolver } from "@hookform/resolvers/yup";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   Paper,
//   Select,
//   MenuItem,
//   Slide,
//   TextField,
//   List,
//   Grid,
//   Card,
//   Typography,
//   AppBar,
//   Toolbar,
//   FormControlLabel,
//   FormGroup,
//   Checkbox,
//   NativeSelect,
// } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import { DataGrid } from "@mui/x-data-grid";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { message } from "antd";
// import axios from "axios";
// import moment from "moment";
// import React, { useEffect, useState } from "react";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../../../containers/Layout/BasicLayout";
// import urls from "../../../../../URLS/urls";
// import styles from "./view.module.css";
// import schema from "./schema";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import sweetAlert from "sweetalert";
// import { useRouter } from "next/router";
// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import MenuIcon from "@mui/icons-material/Menu";

// const ApplicantDetails = () => {
//   // Exit button Routing
//   const [valueDate, setValueDate] = React.useState(dayjs(""));
//   const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

//   // Set Current Date and Time
//   const currDate = new Date().toLocaleDateString();
//   const currTime = new Date().toLocaleTimeString();

//   const router = useRouter();

//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   const [btnSaveText, setBtnSaveText] = useState("Save");
//   const [dataSource, setDataSource] = useState([]);
//   const [buttonInputState, setButtonInputState] = useState();
//   const [isOpenCollapse, setIsOpenCollapse] = useState(false);
//   const [id, setID] = useState();
//   const [editButtonInputState, setEditButtonInputState] = useState(false);
//   const [deleteButtonInputState, setDeleteButtonState] = useState(false);
//   const [slideChecked, setSlideChecked] = useState(false);
//   const [businessTypes, setBusinessTypes] = useState([]);

//   // useEffect - Reload On update , delete ,Saved on refresh
//   //   useEffect(() => {
//   //     getBusinessTypes();
//   //   }, []);

//   //   useEffect(() => {
//   //     getBusinesSubType();
//   //   }, [businessTypes]);

//   //   const getBusinessTypes = () => {
//   //     axios.get(`${urls.BaseURL}/businessType/getBusinessTypeData`).then((r) => {
//   //       setBusinessTypes(
//   //         r.data.map((row) => ({
//   //           id: row.id,
//   //           businessType: row.businessType,
//   //         }))
//   //       );
//   //     });
//   //   };

//   const editRecord = (rows) => {
//     setBtnSaveText("Update"),
//       setID(rows.id),
//       setIsOpenCollapse(true),
//       setSlideChecked(true);
//     reset(rows);
//   };

//   // OnSubmit Form
//   const onSubmitForm = (fromData) => {
//     const fromDate = new Date(fromData.fromDate).toISOString();
//     const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
//     // Update Form Data
//     const finalBodyForApi = {
//       ...fromData,
//       fromDate,
//       toDate,
//     };
//     if (btnSaveText === "Save") {
//       axios
//         .post(
//           `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
//           finalBodyForApi
//         )
//         .then((res) => {
//           if (res.status == 201) {
//             sweetAlert("Saved!", "Record Saved successfully !", "success");
//             getBusinesSubType();
//             setButtonInputState(false);
//             setIsOpenCollapse(false);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//           }
//         });
//     } else if (btnSaveText === "Update") {
//       axios
//         .post(
//           `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
//           finalBodyForApi
//         )
//         .then((res) => {
//           if (res.status == 201) {
//             sweetAlert("Updated!", "Record Updated successfully !", "success");
//             getBusinesSubType();
//             setButtonInputState(false);
//             setIsOpenCollapse(false);
//             setEditButtonInputState(false);
//             setDeleteButtonState(false);
//           }
//         });
//     }
//   };

//   const deleteById = (value) => {
//     swal({
//       title: "Delete?",
//       text: "Are you sure you want to delete this Record ? ",
//       icon: "warning",
//       buttons: true,
//       dangerMode: true,
//     }).then((willDelete) => {
//       if (willDelete) {
//         axios
//           .delete(
//             `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`
//           )
//           .then((res) => {
//             if (res.status == 226) {
//               swal("Record is Successfully Deleted!", {
//                 icon: "success",
//               });
//               setButtonInputState(false);
//               //getcast();
//             }
//           });
//       } else {
//         swal("Record is Safe");
//       }
//     });
//   };

//   // Exit Button
//   // const exitButton = () => {
//   //   reset({
//   //     ...resetValuesExit,
//   //   });
//   //   setButtonInputState(false);
//   //   setSlideChecked(false);
//   //   setSlideChecked(false);
//   //   setIsOpenCollapse(false);
//   //   setEditButtonInputState(false);
//   //   setDeleteButtonState(false);
//   // };

//   // cancell Button
//   const cancellButton = () => {
//     reset({
//       ...resetValuesCancell,
//       id,
//     });
//   };

//   // Reset Values Cancell
//   const resetValuesCancell = {
//     fromDate: null,
//     toDate: null,
//     businessType: "",
//     businessSubType: "",
//     businessSubTypePrefix: "",
//     remark: "",
//   };

//   // Reset Values Exit
//   const resetValuesExit = {
//     fromDate: null,
//     toDate: null,
//     businessType: "",
//     businessSubType: "",
//     businessSubTypePrefix: "",
//     remark: "",
//     id: null,
//   };

//   // View
//   return (
//     <>
//       {/* <BasicLayout> */}
//       {/* <Card>
//           <Grid container mt={2} ml={5} mb={5} border px={5} height={10}>
//             <Grid item xs={5}></Grid>
//             <Grid item xs={5.7}>
//               <h2>Add Provisional Building NOC</h2>
//             </Grid>
//           </Grid>
//         </Card> */}

//       {/* <Paper
//           sx={{
//             marginLeft: 5,
//             marginRight: 5,
//             marginTop: 5,
//             marginBottom: 5,
//             padding: 1,
//           }}
//         > */}
//       {/* <Card style={{ marginTop: 10, paddingBottom: 20 }}> */}
//       <div className={styles.small}>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmitForm)}>
//             {" "}
//             <br />
//             <br />
//             <Typography>
//               <strong>Applicant's Details</strong>
//             </Typography>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   autoFocus
//                   id="standard-basic"
//                   label="Applicant First Name"
//                   variant="standard"
//                   {...register("applicantFirstName")}
//                   error={!!errors.applicantFirstName}
//                   helperText={
//                     errors?.applicantFirstName
//                       ? errors.applicantFirstName.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Applicant Middle Name "
//                   variant="standard"
//                   {...register("applicantMiddleName")}
//                   error={!!errors.applicantMiddleName}
//                   helperText={
//                     errors?.applicantMiddleName
//                       ? errors.applicantMiddleName.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Applicant Last Name"
//                   variant="standard"
//                   {...register("applicantLastName")}
//                   error={!!errors.applicantLastName}
//                   helperText={
//                     errors?.applicantLastName
//                       ? errors.applicantLastName.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               {/* <div className="date">
//                     <FontAwesome name="calendar" />
//                     {this.state.date}
//                   </div> */}
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Office Contact No *"
//                   variant="standard"
//                   {...register("lastName")}
//                   error={!!errors.lastName}
//                   helperText={errors?.lastName ? errors.lastName.message : null}
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Working Site Onsite Person Mobile No *"
//                   variant="standard"
//                   {...register("lastName")}
//                   error={!!errors.lastName}
//                   helperText={errors?.lastName ? errors.lastName.message : null}
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Email Id*"
//                   variant="standard"
//                   {...register("lastName")}
//                   error={!!errors.lastName}
//                   helperText={errors?.lastName ? errors.lastName.message : null}
//                 />
//               </div>
//             </div>
//             <br />
//             <Typography>
//               <strong>Forms Details</strong>
//             </Typography>
//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   fullWidth
//                   variant="standard"
//                   sx={{ m: 1, minWidth: 250 }}
//                   error={!!errors.businessType}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     <span>Applied For: Select-Service Name</span>{" "}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 250 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Select-Service Name"
//                       >
//                         {businessTypes &&
//                           businessTypes.map((businessType, index) => (
//                             <MenuItem key={index} value={businessType.id}>
//                               {businessType.businessType}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="businessType"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.businessType ? errors.businessType.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Architect Name *"
//                   variant="standard"
//                   {...register("lastName")}
//                   error={!!errors.lastName}
//                   helperText={errors?.lastName ? errors.lastName.message : null}
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Architect Firm Name *"
//                   variant="standard"
//                   {...register("lastName")}
//                   error={!!errors.lastName}
//                   helperText={errors?.lastName ? errors.lastName.message : null}
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Architech Registration No"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>

//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Applicant Permanent Address"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Site Address"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}></div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Applicant Contact No"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Final Plot No:- (F.P)"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Revenue Survey No(R.S)"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Building Location"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Town Planning"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Block No"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="O.P No."
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="City Survey No."
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ m: 1, minWidth: 250 }}
//                   error={!!errors.businessType}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     Type of Building
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 250 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="List"
//                       >
//                         {businessTypes &&
//                           businessTypes.map((businessType, index) => (
//                             <MenuItem key={index} value={businessType.id}>
//                               {businessType.businessType}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="businessType"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.businessType ? errors.businessType.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//             </div>
//             <Typography>
//               <strong>Purpose Of Building Use</strong>
//             </Typography>
//             <div className={styles.row}>
//               <div>
//                 <FormGroup>
//                   <FormControlLabel
//                     label="Residential Use"
//                     control={<Checkbox />}
//                   />
//                 </FormGroup>
//               </div>
//               <div>
//                 <FormGroup>
//                   <FormControlLabel
//                     label="Ice Factory"
//                     control={<Checkbox />}
//                   />
//                 </FormGroup>
//               </div>
//               <div>
//                 <FormGroup>
//                   <FormControlLabel
//                     label="Commercial Use"
//                     control={<Checkbox />}
//                   />
//                 </FormGroup>
//               </div>
//               <div>
//                 <FormGroup>
//                   <FormControlLabel label="NOC For" control={<Checkbox />} />
//                 </FormGroup>
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Building Height from Ground Floor in Meter *"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="No of Basement *"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Total Building Floor(G+)"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Basement Area in square Meter"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="No of Ventilation"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="No of Towers"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             {/* end  */}
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Plot Area sqaure Meter"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Construction are square Meter"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="No of Approched road"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <Box sx={{ minWidth: 250 }}>
//                   <FormControl fullWidth>
//                     <InputLabel
//                       variant="standard"
//                       htmlFor="uncontrolled-native"
//                     >
//                       Drawing Provided
//                     </InputLabel>
//                     <NativeSelect
//                       defaultValue={30}
//                       inputProps={{
//                         name: "age",
//                         id: "uncontrolled-native",
//                       }}
//                     >
//                       <option value={10}>Yes</option>
//                       <option value={20}>No</option>
//                     </NativeSelect>
//                   </FormControl>
//                 </Box>
//               </div>
//               <div>
//                 <Box sx={{ minWidth: 250 }}>
//                   <FormControl fullWidth>
//                     <InputLabel
//                       variant="standard"
//                       htmlFor="uncontrolled-native"
//                     >
//                       Site Address(with Building Name)
//                     </InputLabel>
//                     <NativeSelect
//                       defaultValue={30}
//                       inputProps={{
//                         name: "age",
//                         id: "uncontrolled-native",
//                       }}
//                     >
//                       <option value={10}>Yes</option>
//                       <option value={20}>No</option>
//                     </NativeSelect>
//                   </FormControl>
//                 </Box>
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="High Tension Line, Mac Grid Channel Railway Crossing information"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   fullWidth
//                   variant="standard"
//                   sx={{ m: 1, minWidth: 250 }}
//                   error={!!errors.businessType}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     Area Zone
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 250 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Select-Service Name"
//                       >
//                         {businessTypes &&
//                           businessTypes.map((businessType, index) => (
//                             <MenuItem key={index} value={businessType.id}>
//                               {businessType.businessType}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="businessType"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.businessType ? errors.businessType.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <Box sx={{ minWidth: 250 }}>
//                   <FormControl fullWidth>
//                     <InputLabel
//                       variant="standard"
//                       htmlFor="uncontrolled-native"
//                     >
//                       Previously Any Fire NOC Taken
//                     </InputLabel>
//                     <NativeSelect
//                       defaultValue={30}
//                       inputProps={{
//                         name: "age",
//                         id: "uncontrolled-native",
//                       }}
//                     >
//                       <option value={10}>Yes</option>
//                       <option value={20}>No</option>
//                     </NativeSelect>
//                   </FormControl>
//                 </Box>
//               </div>
//               <div>
//                 <TextField
//                   required
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Under the Ground Water Tank Capacity Lighter"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="L *"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="B *"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="H *"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <TextField
//                   sx={{ width: 250 }}
//                   id="standard-basic"
//                   label="Volume LBH in(M³)*"
//                   variant="standard"
//                   {...register("businessSubTypePrefix")}
//                   error={!!errors.businessSubTypePrefix}
//                   helperText={
//                     errors?.businessSubTypePrefix
//                       ? errors.businessSubTypePrefix.message
//                       : null
//                   }
//                 />
//               </div>
//             </div>
//             <div className={styles.btn}>
//               <br />
//               <br />
//               <Button
//                 sx={{ marginRight: 8 }}
//                 type="submit"
//                 variant="contained"
//                 color="success"
//                 endIcon={<SaveIcon />}
//               >
//                 {btnSaveText}
//               </Button>{" "}
//               <Button
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 color="primary"
//                 endIcon={<ClearIcon />}
//                 onClick={() => cancellButton()}
//               >
//                 Clear
//               </Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 endIcon={<ExitToAppIcon />}
//                 // onClick={() => exitButton()}
//                 onClick={() =>
//                   router.push({
//                     pathname: "/FireBrigadeSystem/transactions/buildingNoc",
//                   })
//                 }
//               >
//                 Exit
//               </Button>
//             </div>
//           </form>
//         </FormProvider>
//       </div>
//       {/* </Slide> */}
//       {/* )} */}
//       {/* </Paper> */}
//       {/* </Card> */}
//       {/* </BasicLayout> */}
//     </>
//   );
// };

// export default ApplicantDetails;

// // index file..........

// import {
//   Button,
//   Paper,
//   Stack,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";

// import { FormProvider, useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { addIsssuanceofHawkerLicense } from "../../../redux/features/isssuanceofHawkerLicenseSlice";
// import ApplicantDetails from "./components/ApplicantDetails";
// import FormsDetails from "./components/FormsDetails";
// import BuildingUse from "./components/BuildingUse";
// // import Allcopy from "./components/Allcopy";

// // Get steps - Name
// function getSteps() {
//   return [
//     // "",
//     "Applicant Details",
//     "Forms Details",
//     "Purpose Of Building Use",
//   ];
// }

// // Get Step Content Form
// function getStepContent(step) {
//   switch (step) {
//     // case 0:
//     // return <IssuanceOfHawkerLicense />;

//     case 0:
//       return <ApplicantDetails />;

//     case 1:
//       return <FormsDetails />;

//     case 2:
//       return <BuildingUse />;

//     default:
//       return "unknown step";
//   }
// }

// // Linear Stepper
// const LinaerStepper = () => {
//   const methods = useForm({
//     defaultValues: {
//       serviceName: "",
//       applicationNumber: "",
//       applicationDate: null,
//       trackingID: "",
//       citySurveyNo: "",
//       hawkingZoneName: "",
//       title: "",
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       gender: "",
//       religion: "",
//       cast: "",
//       subCast: "",
//       dateOfBirth: "",
//       age: "",
//       disbality: "",
//       typeOfDisability: "",
//       mobile: "",
//       emailAddress: "",
//       crCitySurveyNumber: "",
//       crAreaName: "",
//       crLandmarkName: "",
//       crVillageName: "",
//       crCityName: "",
//       crState: "",
//       crPincode: "",
//       crLattitude: "",
//       addressCheckBox: "",
//       prCitySurveyNumber: "",
//       prAreaName: "",
//       prLandmarkName: "",
//       prVillageName: "",
//       prCityName: "",
//       prState: "",
//       prPincode: "",
//       prLattitude: "",
//       wardNo: "",
//       wardName: "",
//       natureOfBusiness: "",
//       hawkingDurationDaily: "",
//       hawkerType: "",
//       item: "",
//       periodOfResidenceInMaharashtra: null,
//       periodOfResidenceInPCMC: null,
//       rationCardNo: "",
//       bankMaster: "",
//       branchName: "",
//       bankAccountNo: "",
//       ifscCode: "",
//     },
//   });

//   // Const
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = getSteps();
//   const dispach = useDispatch();

//   // Handle Next
//   const handleNext = (data) => {
//     dispach(addIsssuanceofHawkerLicense(data));
//     console.log(data);
//     if (activeStep == steps.length - 1) {
//       fetch("https://jsonplaceholder.typicode.com/comments")
//         .then((data) => data.json())
//         .then((res) => {
//           console.log(res);
//           setActiveStep(activeStep + 1);
//         });
//     } else {
//       setActiveStep(activeStep + 1);
//     }
//   };

//   // Handle Back
//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   // View
//   return (
//     <>
//       <BasicLayout>
//         <Paper
//           sx={{
//             margin: 5,
//             padding: 1,
//             paddingTop: 5,
//             paddingBottom: 5,
//           }}
//         >
//           <Stepper alternativeLabel activeStep={activeStep}>
//             {steps.map((step, index) => {
//               const labelProps = {};
//               const stepProps = {};

//               return (
//                 <Step {...stepProps} key={index}>
//                   <StepLabel {...labelProps}>{step}</StepLabel>
//                 </Step>
//               );
//             })}
//           </Stepper>

//           {activeStep === steps.length ? (
//             <Typography variant="h3" align="center">
//               <br />
//               <br />
//               Thank You
//             </Typography>
//           ) : (
//             <FormProvider {...methods}>
//               <form onSubmit={methods.handleSubmit(handleNext)}>
//                 {getStepContent(activeStep)}
//                 <Stack direction="row" spacing={2} style={{ marginLeft: 900 }}>
//                   <Button disabled={activeStep === 0} onClick={handleBack}>
//                     back
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     // onClick={handleNext}
//                     type="submit"
//                   >
//                     {activeStep === steps.length - 1 ? "Finish" : "Next"}
//                   </Button>
//                 </Stack>
//               </form>
//             </FormProvider>
//           )}
//         </Paper>
//       </BasicLayout>
//     </>
//   );
// };

// export default LinaerStepper;
