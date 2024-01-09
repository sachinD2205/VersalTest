
// import { yupResolver } from "@hookform/resolvers/yup";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SaveIcon from "@mui/icons-material/Save";
// import { useRouter } from "next/router";
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
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import styles from "./view.module.css";
// import schema from "./schema";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import sweetAlert from "sweetalert";
// import NewGrievanceRegistration from "../components/NewGrievanceRegistration";
// import PersonalDetails from "../components/PersonalDetails";
// import ComplaintDetails from "../components/ComplaintDetails";
// import GrievanceDetails from "../components/GrievanceDetails" ;
// const Form = () => {
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
//   const router = useRouter();
//   const [activeStep, setActiveStep] = useState(0);
//   const steps = getSteps();
//   // useEffect - Reload On update , delete ,Saved on refresh
// //   useEffect(() => {
// //     getBusinessTypes();
// //   }, []);

// //   useEffect(() => {
// //     getBusinesSubType();
// //   }, [businessTypes]);

// //   const getBusinessTypes = () => {
// //     axios.get(`${urls.BaseURL}/businessType/getBusinessTypeData`).then((r) => {
// //       setBusinessTypes(
// //         r.data.map((row) => ({
// //           id: row.id,
// //           businessType: row.businessType,
// //         }))
// //       );
// //     });
// //   };

// function getSteps() {
//     return [
//       "Personal Details",
//       "Grievance Details",
//       "Complaint Details",
//     ];
//   }
//   function getStepContent(step) {
//     switch (step) {
//       case 0:
//         return <NewGrievanceRegistration />;
  
//       case 1:
//         return <PersonalDetails />;
  
//       case 2:
//         return <ComplaintDetails />;
  
//       case 3:
//         return <GrievanceDetails />;
  
//       default:
//         return "unknown step";
//     }
//   }
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
//   const locateButton = ()=>{
//     navigator.geolocation.getCurrentPosition(function(position) {
//         console.log("Latitude is :", position.coords.latitude);
//         console.log("Longitude is :", position.coords.longitude);
//       });
//   }

//   // View
//   return (
//     <>
//       <BasicLayout>
//          <Paper
//           sx={{
//             marginLeft: 5,
//             marginRight: 5,
//             marginTop: 5,
//             marginBottom: 5,
//             padding: 1,
//           }}
//         > 
//           {/* {isOpenCollapse && (
//             <Slide
//               direction="down"
//               in={slideChecked}
//               mountOnEnter
//               unmountOnExit
//             >  */}
//               <div>
//                 <FormProvider {...methods}>
//                   <form onSubmit={handleSubmit(onSubmitForm)}>
//                     <div className={styles.small}>
//                       <div className={styles.row}>
//                       <div>
//                           <FormControl
//                             variant="standard"
//                             sx={{ minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                             Title
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="Title"
//                                 >
//                                       <MenuItem>
//                                         Mr
//                                       </MenuItem>
//                                       <MenuItem>
//                                         Mrs
//                                       </MenuItem>
//                                       <MenuItem>
//                                         Miss
//                                       </MenuItem>
//                                       <MenuItem>
//                                         Other
//                                       </MenuItem>
                                   
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>               
//                         <div>
//                           <TextField
//                           required
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="First Name"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                           required
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Middle Name"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                           required
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Last Name"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         </div>
//                         <div className={styles.row}>
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
//                           required
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Email Id"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div> 
                        
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
//                           required
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Contact"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div> 
                        
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
                          
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Location"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div> 
//                         <div className={styles.btn}>
//                       <br/>
//                     <br/>
//                         <Button
//                           sx={{ marginRight: 8 }}
//                           type="submit"
//                           variant="contained"
//                           color="primary"
//                           onClick={() => locateButton()}
//                         >
//                          Locate
//                         </Button>
//                         </div>
//                         </div>
//                         <div className={styles.row}>
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="House Number"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
                          
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Building Name"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
                          
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Road Name"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Area"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         </div>
                       
//                         {/* <div>
//                         <br/>
//                         <br/>
//                           <FormControl
//                             variant="standard"
//                             sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                             Type of Vardi
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="Type of Vardi"
//                                 >
//                                   {businessTypes &&
//                                     businessTypes.map((businessType, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={businessType.id}
//                                       >
//                                         {businessType.businessType}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>               
                     
//                         <div>
//                         <br/>
//                         <br/>
//                           <FormControl
//                             variant="standard"
//                             sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                             Vardi Received Name
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="Type of Vardi"
//                                 >
//                                   {businessTypes &&
//                                     businessTypes.map((businessType, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={businessType.id}
//                                       >
//                                         {businessType.businessType}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>
//                         <div>
//                         <br/>
//                         <br/>
//                           <FormControl
//                             variant="standard"
//                             sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                           Employee Shift ID
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="Type of Vardi"
//                                 >
//                                   {businessTypes &&
//                                     businessTypes.map((businessType, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={businessType.id}
//                                       >
//                                         {businessType.businessType}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>
//                         <div>
//                         <br/>
//                                                   <br/>
//                     <FormControl
//                       style={{ marginTop: 10 }}
//                       error={!!errors.fromDate}
//                     >
//                       <Controller
//                         control={control}
//                         name="fromDate"
//                         defaultValue={null}
//                         render={({ field }) => (
//                           <LocalizationProvider
//                             dateAdapter={AdapterMoment}
//                           >
//                                 <DatePicker
//                                     required
//                               inputFormat="DD/MM/YYYY"
//                               label={
//                                 <span style={{ fontSize: 16 }}>
//                                   Date and Time of Vardi
//                                 </span>
//                               }
//                               value={field.value}
//                               onChange={(date) => field.onChange(date)}
//                               selected={field.value}
//                               center
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   size="small"
//                                   fullWidth
//                                   InputLabelProps={{
//                                     style: {
//                                       fontSize: 12,
//                                       marginTop: 3,
//                                     },
//                                   }}
//                                 />
//                               )}
//                             />
//                           </LocalizationProvider>
//                         )}
//                       />
//                       <FormHelperText>
//                         {errors?.fromDate
//                           ? errors.fromDate.message
//                           : null}
//                       </FormHelperText>
//                     </FormControl>
//                   </div>
//                         <div>
//                         <br/>
//                                                   <br/>
//                           <FormControl
//                             variant="standard"
//                             sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                           Slip Handed Over to
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="Type of Vardi"
//                                 >
//                                   {businessTypes &&
//                                     businessTypes.map((businessType, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={businessType.id}
//                                       >
//                                         {businessType.businessType}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div> */}
                        
//                       <div className={styles.row}>
//                       <div>
//                         <br/>
//                         <br/>
//                           <FormControl
//                             variant="standard"
//                             sx={{minWidth: 120 }}
//                             error={!!errors.businessType}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                             City
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ width: 250 }}
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="City"
//                                 >
//                                   {businessTypes &&
//                                     businessTypes.map((businessType, index) => (
//                                       <MenuItem
//                                         key={index}
//                                         value={businessType.id}
//                                       >
//                                         {businessType.businessType}
//                                       </MenuItem>
//                                     ))}
//                                 </Select>
//                               )}
//                               name="businessType"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.businessType
//                                 ? errors.businessType.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>         
//                         <div>
//                         <br/>
//                         <br/>
//                           <TextField
//                             autoFocus
//                             sx={{ width: 250 }}
//                             id="standard-basic"
//                             label="Pin Code"
//                             variant="standard"
//                             {...register("businessSubTypePrefix")}
//                             error={!!errors.businessSubTypePrefix}
//                             helperText={
//                               errors?.businessSubTypePrefix
//                                 ? errors.businessSubTypePrefix.message
//                                 : null
//                             }
//                           />
//                         </div>
//                         </div>
//                         </div>
//                       <div className={styles.row}>
//                       </div>
                    
//                       <div className={styles.btn}>
//                       <br/>
//                     <br/>
//                         <Button
//                           sx={{ marginRight: 8 }}
//                           type="submit"
//                           variant="contained"
//                           color="success"
//                           endIcon={<SaveIcon />}
//                         >
//                           {btnSaveText}
//                         </Button>{" "}
//                         <Button
//                           sx={{ marginRight: 8 }}
//                           variant="contained"
//                           color="primary"
//                           endIcon={<ClearIcon />}
//                           onClick={() => cancellButton()}
//                         >
//                           Clear
//                         </Button>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           endIcon={<ExitToAppIcon />}
//                           onClick={() => {
//                             router.push({
//                               pathname: "/grievanceMonitoring/transactions/newGrievanceRegistration/"
//                             })
//                         }}
//                         >
//                           Exit
//                         </Button>    
//                         <Button
//                   variant='contained'
//                   color='primary'
//                   // onClick={handleNext}
//                   type='submit'
//                 >
//                   {activeStep === steps.length - 1 ? "Finish" : "Next"}
//                 </Button>       
//                     </div>
//                   </form>
//                 </FormProvider>
//               </div>
//             {/* </Slide> */}
//           {/* )} */}
//            {/* <div className={styles.addbtn}>
//   <Button
//      variant="contained"
//      endIcon={<AddIcon />}
//      type="primary"
//      disabled={buttonInputState}
//      onClick={() => {
//        reset({
//          ...resetValuesExit,
//        });
//        setEditButtonInputState(true);
//        setDeleteButtonState(true);
//        setBtnSaveText("Save");
//        setButtonInputState(true);
//        setSlideChecked(true);
//        setIsOpenCollapse(!isOpenCollapse);
//      }}
//    >
//      Add{" "}
//    </Button>
//  </div>  */}

//         </Paper>
//       </BasicLayout>
//     </>
//   );
// };

// export default Form;