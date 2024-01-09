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
// import {
//   Controller,
//   FormProvider,
//   useForm,
//   useFormContext,
// } from "react-hook-form";
// // import BasicLayout from "../../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import sweetAlert from "sweetalert";
// import { useRouter } from "next/router";
// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import MenuIcon from "@mui/icons-material/Menu";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { makeStyles } from "@material-ui/core/styles";
// import  from "../../";
// import style from "../../upload.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// // import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// // style for table

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: "#D7DBDD",
//     // color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
//   "&: td, &: th": {
//     border: "1px solid black",
//   },
// }));

// function createData(name, calories, fat, carbs, protein, upload) {
//   return { name, calories, fat, carbs, protein, upload };
// }

// const useStyles = makeStyles({
//   finalRow: {
//     backgroundColor: "lightblue",
//   },
// });

// // style end

// const OtherDetails = () => {
//   // Exit button Routing
//   const [valueDate, setValueDate] = React.useState(dayjs(""));
//   const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

//   // Set Current Date and Time
//   const currDate = new Date().toLocaleDateString();
//   const currTime = new Date().toLocaleTimeString();

//   const router = useRouter();

//   //   const {
//   //     // control,
//   //     // register,

//   //     // reset,
//   //     formState: { errors },
//   //   } = useFormContext();

//   useEffect(() => {
//     getData();
//   }, []);

//   const [state, setState] = useState();

//   const getData = () => {
//     axios
//       .get("${urls.CFCURL}/master/designation/getAll")
//       .then((res) => setState(res?.data?.designation))
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const rows = [
//     createData(
//       <>
//         <>Receipt No./ पावती क्र.</>
//         {/* <br /> <h5> {state.map((d) => d.id)}</h5> */}
//       </>,
//       <>Date/ तारीख</>,
//       <>Related To/ विभागाकडुन</>,
//       <>CFC Ref. No</>,
//       <>CFC Counter No.</>
//     ),
//     // createData(
//     //   2,
//     //   <>
//     //     {/* <>Approved Key Plan, Site Plan,Elivatio n Section PCMC</> */}
//     //     {/* <FormattedLabel id="approvedKeyPlan" /> */}
//     //     approvedKeyPlan
//     //     <br /> <h5> (Upload file in .pdf format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   3,
//     //   <>
//     //     {/* <FormattedLabel id="approvedLayoutPlanPCMC" /> */}
//     //     <>Approved Layout plan PCMC</>
//     //     <br />
//     //     <h5> (Upload file in .pdf format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   4,
//     //   <>
//     //     {/* <FormattedLabel id="approvedApproachRoadPCMC" /> */}
//     //     <>Approved Approach Road PCMC</>
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   5,
//     //   <>
//     //     {/* <FormattedLabel id="measurementOfTank" /> */}
//     //     <>Measurement of Tank (undergroun d, overhead) with map</> <br />
//     //     <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   6,
//     //   <>
//     //     {/* <FormattedLabel id="explosiveLicense" /> */}
//     //     explosiveLicense
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   7,
//     //   <>
//     //     {/* <FormattedLabel id="permissionLetterOfPCMC" /> */}
//     //     <>Permission letter of PCMC</>
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   8,
//     //   <>
//     //     {/* <FormattedLabel id="completionCertificate" /> */}
//     //     <>Completion Certificate</>
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   9,
//     //   <>
//     //     {/* <FormattedLabel id="structuralStabilityCertificate" /> */}
//     //     <>Structural Stability Certificate</>
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   10,
//     //   <>
//     //     {/* <FormattedLabel id="escalatorApprovedByGovtCertificate" /> */}
//     //     <>Escalator / Lift approved by Govt. Certificate</>
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//     // createData(
//     //   11,
//     //   <>
//     //     {/* <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" /> */}
//     //     <>Fire Drawing Floor wise i,e also approved by compliance Authority</>{" "}
//     //     <br /> <h5> (Upload file in .XML format only)</h5>
//     //   </>,
//     //   "Mandatory",
//     //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
//     //     <input
//     //       type="file"
//     //       name="myImage"
//     //       onChange={(event) => {
//     //         console.log(event.target.files[0]);
//     //         setSelectedImage(event.target.files[0]);
//     //       }}
//     //     />
//     //   </div>,
//     //   <span className={style.fileName}>Upload</span>
//     // ),
//   ];
//   // const {
//   //   register,
//   //   control,
//   //   handleSubmit,
//   //   methods,
//   //   setValue,
//   //   reset,
//   //   formState: { errors },
//   // } = useForm({
//   //   criteriaMode: "all",
//   //   resolver: yupResolver(schema),
//   //   mode: "onChange",
//   // });

//   const [btnSaveText, setBtnSaveText] = useState("Save");
//   const [dataSource, setDataSource] = useState([]);
//   const [buttonInputState, setButtonInputState] = useState();
//   const [isOpenCollapse, setIsOpenCollapse] = useState(false);
//   const [id, setID] = useState();
//   const [editButtonInputState, setEditButtonInputState] = useState(false);
//   const [deleteButtonInputState, setDeleteButtonState] = useState(false);
//   const [slideChecked, setSlideChecked] = useState(false);
//   const [businessTypes, setBusinessTypes] = useState([]);
//   const [selectedImage, setSelectedImage] = useState([]);

//   const classes = useStyles();

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

//   // const editRecord = (rows) => {
//   //   setBtnSaveText("Update"),
//   //     setID(rows.id),
//   //     setIsOpenCollapse(true),
//   //     setSlideChecked(true);
//   //   reset(rows);
//   // };

//   // OnSubmit Form
//   // const onSubmitForm = (fromData) => {
//   //   const fromDate = new Date(fromData.fromDate).toISOString();
//   //   const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
//   //   // Update Form Data
//   //   const finalBodyForApi = {
//   //     ...fromData,
//   //     fromDate,
//   //     toDate,
//   //   };
//   //   if (btnSaveText === "Save") {
//   //     axios
//   //       .post(
//   //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
//   //         finalBodyForApi
//   //       )
//   //       .then((res) => {
//   //         if (res.status == 201) {
//   //           sweetAlert("Saved!", "Record Saved successfully !", "success");
//   //           getBusinesSubType();
//   //           setButtonInputState(false);
//   //           setIsOpenCollapse(false);
//   //           setEditButtonInputState(false);
//   //           setDeleteButtonState(false);
//   //         }
//   //       });
//   //   } else if (btnSaveText === "Update") {
//   //     axios
//   //       .post(
//   //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
//   //         finalBodyForApi
//   //       )
//   //       .then((res) => {
//   //         if (res.status == 201) {
//   //           sweetAlert("Updated!", "Record Updated successfully !", "success");
//   //           getBusinesSubType();
//   //           setButtonInputState(false);
//   //           setIsOpenCollapse(false);
//   //           setEditButtonInputState(false);
//   //           setDeleteButtonState(false);
//   //         }
//   //       });
//   //   }
//   // };

//   // const deleteById = (value) => {
//   //   swal({
//   //     title: "Delete?",
//   //     text: "Are you sure you want to delete this Record ? ",
//   //     icon: "warning",
//   //     buttons: true,
//   //     dangerMode: true,
//   //   }).then((willDelete) => {
//   //     if (willDelete) {
//   //       axios
//   //         .delete(
//   //           `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`
//   //         )
//   //         .then((res) => {
//   //           if (res.status == 226) {
//   //             swal("Record is Successfully Deleted!", {
//   //               icon: "success",
//   //             });
//   //             setButtonInputState(false);
//   //             //getcast();
//   //           }
//   //         });
//   //     } else {
//   //       swal("Record is Safe");
//   //     }
//   //   });
//   // };

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
//       {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
//         <Table sx={{ width: '75%', marginTop: "3rem" }} size="small" aria-label="a dense table" border="1" stickyHeader>
//           {/* <TableRow >
//             <TableCell colspan="6" align="start" style={{ width: '200px' }}>
//               <FormattedLabel id="printedBy" />:
//             </TableCell>

//             <TableCell colspan="3" align="start">
//               <FormattedLabel id="printDateTime" />:
//             </TableCell>
//           </TableRow> */}

//           {/* <TableRow >
//             <TableCell colspan="6" align="start">
//               <FormattedLabel id="remarkForPrint" /><br />
//               <FormattedLabel id="tip" />
//             </TableCell>

//             <TableCell colspan="3" align="start">
//               <FormattedLabel id="receiverSign" />
//             </TableCell>
//           </TableRow> */}

//           {/* <TableRow >
//             <TableCell colspan="6" align="start">
//               <FormattedLabel id="printedBy" />:
//             </TableCell>

//             <TableCell colspan="3" align="start">
//               <FormattedLabel id="printDateTime" />:
//             </TableCell>
//           </TableRow> */}

//       {/* </div> */}
//       {/* <div className={styles.small}>
//         <div className={styles.row}> */}
//       {/* Documents Upload */}
//       {/* <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 700 }} aria-label="customized table" border="1" stickyHeader >
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>Sr.No</StyledTableCell>
//                   <StyledTableCell>Document Upload</StyledTableCell>
//                   <StyledTableCell align="right">Document Type</StyledTableCell>
//                   <StyledTableCell align="right">
//                     Upload Document
//                   </StyledTableCell>
//                   <StyledTableCell align="right"></StyledTableCell> */}
//       {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
//       {/* </TableRow>
//               </TableHead>
//               <TableBody>
//                 <TableRow className={classes.finalRow}>
//                   <TableCell align="left" colSpan={6}>
//                     <b>Mandatory Documents</b>
//                   </TableCell>
//                 </TableRow>
//                 {rows.map((row) => (
//                   <StyledTableRow key={row.name}>
//                     <StyledTableCell component="th" scope="row">
//                       {row.name}
//                     </StyledTableCell>
//                     <StyledTableCell>{row.calories}</StyledTableCell>
//                     <StyledTableCell
//                       align="right"
//                       // style={{ color: "red" }}
//                     >
//                       {row.fat}
//                     </StyledTableCell>
//                     <StyledTableCell align="right">{row.carbs}</StyledTableCell>
//                     <StyledTableCell>{row.protein}</StyledTableCell>
//                   </StyledTableRow>
//                 ))}

// {/* <Table sx={{  width: '100%', height: "40%" }} size="small" aria-label="a dense table" border="1" stickyHeader> */}

//           <TableRow >
//             <TableCell >
//               <b style={{  padding: "1.5px" }}>

//             Receipt No./ पावती क्र.
//               </b>

//             </TableCell>
//             <TableCell >
//               <b style={{  padding: "1.5px" }}>

//             Date/ तारीख
//               </b>

//             </TableCell>
//             <TableCell  >
//               <b style={{  padding: "1.5px" }}>

//             Related To/ विभागाकडुन
//               </b>

//             </TableCell>
//             <TableCell >
//               <b style={{ padding: "1.5px" }}>

//             CFC Ref. No
//               </b>

//             </TableCell>
//             <TableCell >
//               <b style={{  padding: "1.5px" }}>

//             CFC Counter No.
//               </b>

//              </TableCell>
//           </TableRow>

//           <TableRow >
//             <TableCell >
//             <b style={{  padding: "1.5px" }}>
//               Recieved Form/फॉर्म प्राप्त झाला
//               </b>
//             </TableCell>
//             <TableCell colspan="6">

//             </TableCell>

//           </TableRow>
//           <TableRow >
//             <TableCell >
//             <b style={{  padding: "1.5px" }}>
//             Service Name/सेवेचे नाव
//               </b>
//             </TableCell>
//             <TableCell colspan="6">

//             </TableCell>

//           </TableRow>
//           <TableRow >
//             <TableCell >
//             <b style={{  padding: "1.5px" }}>
//             Narration/ विवरण

//               </b>
//             </TableCell>
//             <TableCell colspan="6">

//             </TableCell>

//           </TableRow>
//           <TableRow >
//             <TableCell >
//             <b style={{  padding: "1.5px" }}>
//             Address/पत्ता
//               </b>
//             </TableCell>
//             <TableCell colspan="6">

//             </TableCell>

//           </TableRow>
//           {/* <TableRow></TableRow> */}
//           <TableRow >
//             <TableCell >
//             payment mode/पेमेंट मोड
//             </TableCell>
//             <TableCell >
//             Rupees/रुपये
//             </TableCell>
//             <TableCell  >
//             Cheque No/धनादेश क्र
//             </TableCell>
//             <TableCell >
//               Cheque Date/धनादेश तारीख
//             </TableCell>
//             <TableCell >
//             Bank Name/बँकेचे नाव
//              </TableCell>
//           </TableRow>
//           <TableRow>
//           <TableCell colspan="12" >
//               <b style={{ backgroundColor: "white", padding: "1px" }}>

//               </b>
//             </TableCell>
//           </TableRow>

//           <TableRow >
//             <TableCell >
//             Refrence No/संदर्भ क्रमांक
//             </TableCell>
//             <TableCell >
//           Date/तारीख
//             </TableCell>
//             <TableCell  >
//             Details/तपशील
//             </TableCell>
//             <TableCell >
//             Payable Amount/देय रक्कम
//             </TableCell>
//             <TableCell >
//             Received Amount/प्राप्त रक्कम
//             </TableCell>
//           </TableRow>

//           <TableRow >
//             <TableCell >
//            <b style={{ backgroundColor: "white", padding: "1px" }}>

//            </b>
//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell  >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//           </TableRow>
//           <TableRow >
//             <TableCell >
//             <b style={{ backgroundColor: "white", padding: "1px" }}>

// </b>
//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell  >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//           </TableRow>
//           <TableRow>

//             <TableCell >
//             <b style={{ backgroundColor: "white", padding: "1px" }}>

// </b>
//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell  >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//           </TableRow>

//           <TableRow>

//             <TableCell >
//               total amount/एकूण रक्कम

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell  >

//             </TableCell>
//             <TableCell >
//        0.00
//             </TableCell>
//             <TableCell >
//         0.00
//             </TableCell>
//           </TableRow>

//           <TableRow >
//             <TableCell >
//             Payable Amount/देय रक्कम

//             </TableCell>
//             <TableCell >
//             Rebate Amount/सूट रक्कम
//             </TableCell>
//             <TableCell  >
//             Advance Amount/आगाऊ रक्कम
//             </TableCell>
//             <TableCell >
//             Actual Payable/वास्तविक देय
//             </TableCell>
//             <TableCell >
//             Received Amount/प्राप्त रक्कम
//             </TableCell>
//           </TableRow>

//           <TableRow>

//             <TableCell >
//             <b style={{ backgroundColor: "white", padding: "1px" }}>

// </b>

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell  >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//             <TableCell >

//             </TableCell>
//           </TableRow>

//           <TableRow>

//             <TableCell >
//             <b style={{ backgroundColor: "white" }}>
//               Amount in words/शब्दात रक्कम:
//               </b>

//             </TableCell>

//             <TableCell colspan="6" >

//             </TableCell>
//           </TableRow>

//           <TableRow>
//           <TableCell colspan="3" >
//               <span >
//               Remark/शेरा
//               </span>
//               <br></br>
//                 <div>
//               टीप: सदरची पावती चेक वटल्यावरती ग्राह्य धरण्यात यईल.

//               </div>

//             </TableCell>

//             <TableCell colspan="6" >
//               <b >
//               Receiver Signature/प्राप्तकर्त्याची स्वाक्षरी
//               </b>

//             </TableCell>
//           </TableRow>

// <TableRow>
//           <TableCell colspan="3" >
//               <b >
//             Priented By:
//               </b>

//             </TableCell>
//             <TableCell colspan="6" >
//               <b >
//             Print Date And Time:
//               </b>

//             </TableCell>
//           </TableRow>
//         {/* </Table> */}
//               {/* </TableBody> */}
//             {/* </Table> */}
//           {/* </TableContainer> */}
//         {/* </div> */}
//       {/* <br /> */}

//       {/* <Button
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 color="primary"
//                 endIcon={<ClearIcon />}
//                 onClick={() => cancellButton()}
//               >
//                 Clear
//               </Button> */}
//       {/* </form>
//         </FormProvider> */}
//       {/* </div> */}
//       {/* </Slide> */}
//       {/* )} */}
//       {/* </Paper> */}
//       {/* </Card> */}
//       {/* </BasicLayout> */}
//       </Table>
//     </>
//   );
// };

// export default OtherDetails;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import BasicLayout from "../../../../../containers/Layout/BasicLayout";
// import schema from "./schema";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
// import { makeStyles } from "@material-ui/core/styles";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// style for table

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D7DBDD",
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&: td, &: th": {
    border: "1px solid black",
  },
}));

function createData(name, calories, fat, carbs, protein, upload) {
  return { name, calories, fat, carbs, protein, upload };
}

// const useStyles = makeStyles({
//   finalRow: {
//     backgroundColor: "lightblue",
//   },
// });

// style end

const ForPrint = () => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));
  const userToken = useGetToken();

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const router = useRouter();

  //   const {
  //     // control,
  //     // register,

  //     // reset,
  //     formState: { errors },
  //   } = useFormContext();

  useEffect(() => {
    getData();
  }, []);

  const [state, setState] = useState();

  const getData = () => {
    axios
      .get(`${urls.FbsURL}/transaction/paymentDetails/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setState(res?.data?.designation))
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // if (router.query.pageMode == "Edit") {
    // console.log("hello", router.query.informerName);
    reset(router.query);
    // }
  }, []);

  const rows = [
    createData(
      <>
        <>Receipt No./ पावती क्र.</>
        {/* <br /> <h5> {state.map((d) => d.id)}</h5> */}
      </>,
      <>Date/ तारीख</>,
      <>Related To/ विभागाकडुन</>,
      <>CFC Ref. No</>,
      <>CFC Counter No.</>
    ),
    // createData(
    //   2,
    //   <>
    //     {/* <>Approved Key Plan, Site Plan,Elivatio n Section PCMC</> */}
    //     {/* <FormattedLabel id="approvedKeyPlan" /> */}
    //     approvedKeyPlan
    //     <br /> <h5> (Upload file in .pdf format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   3,
    //   <>
    //     {/* <FormattedLabel id="approvedLayoutPlanPCMC" /> */}
    //     <>Approved Layout plan PCMC</>
    //     <br />
    //     <h5> (Upload file in .pdf format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   4,
    //   <>
    //     {/* <FormattedLabel id="approvedApproachRoadPCMC" /> */}
    //     <>Approved Approach Road PCMC</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   5,
    //   <>
    //     {/* <FormattedLabel id="measurementOfTank" /> */}
    //     <>Measurement of Tank (undergroun d, overhead) with map</> <br />
    //     <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   6,
    //   <>
    //     {/* <FormattedLabel id="explosiveLicense" /> */}
    //     explosiveLicense
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   7,
    //   <>
    //     {/* <FormattedLabel id="permissionLetterOfPCMC" /> */}
    //     <>Permission letter of PCMC</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   8,
    //   <>
    //     {/* <FormattedLabel id="completionCertificate" /> */}
    //     <>Completion Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   9,
    //   <>
    //     {/* <FormattedLabel id="structuralStabilityCertificate" /> */}
    //     <>Structural Stability Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   10,
    //   <>
    //     {/* <FormattedLabel id="escalatorApprovedByGovtCertificate" /> */}
    //     <>Escalator / Lift approved by Govt. Certificate</>
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
    // createData(
    //   11,
    //   <>
    //     {/* <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" /> */}
    //     <>Fire Drawing Floor wise i,e also approved by compliance Authority</>{" "}
    //     <br /> <h5> (Upload file in .XML format only)</h5>
    //   </>,
    //   "Mandatory",
    //   <div style={{ background: "#D0D3D4", padding: "2px" }}>
    //     <input
    //       type="file"
    //       name="myImage"
    //       onChange={(event) => {
    //         console.log(event.target.files[0]);
    //         setSelectedImage(event.target.files[0]);
    //       }}
    //     />
    //   </div>,
    //   <span className={style.fileName}>Upload</span>
    // ),
  ];
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);

  // const classes = useStyles();

  // useEffect - Reload On update , delete ,Saved on refresh
  //   useEffect(() => {
  //     getBusinessTypes();
  //   }, []);

  //   useEffect(() => {
  //     getBusinesSubType();
  //   }, [businessTypes]);

  //   const getBusinessTypes = () => {
  //     axios.get(`${urls.BaseURL}/businessType/getBusinessTypeData`).then((r) => {
  //       setBusinessTypes(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           businessType: row.businessType,
  //         }))
  //       );
  //     });
  //   };

  // const editRecord = (rows) => {
  //   setBtnSaveText("Update"),
  //     setID(rows.id),
  //     setIsOpenCollapse(true),
  //     setSlideChecked(true);
  //   reset(rows);
  // };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   const fromDate = new Date(fromData.fromDate).toISOString();
  //   const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   // Update Form Data
  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromDate,
  //     toDate,
  //   };
  //   if (btnSaveText === "Save") {
  //     axios
  //       .post(
  //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   } else if (btnSaveText === "Update") {
  //     axios
  //       .post(
  //         `${urls.BaseURL}/businessSubType/saveBusinessSubType`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 201) {
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");
  //           getBusinesSubType();
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  // };

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             //getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

  // Exit Button
  // const exitButton = () => {
  //   reset({
  //     ...resetValuesExit,
  //   });
  //   setButtonInputState(false);
  //   setSlideChecked(false);
  //   setSlideChecked(false);
  //   setIsOpenCollapse(false);
  //   setEditButtonInputState(false);
  //   setDeleteButtonState(false);
  // };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    remark: "",
    id: null,
  };

  // View
  return (
    <>
      {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
      <Table
        sx={{ width: "75%", marginTop: "3rem" }}
        size="small"
        aria-label="a dense table"
        border="1"
        stickyHeader
      >
        {/* <TableRow >
            <TableCell colspan="6" align="start" style={{ width: '200px' }}>
              <FormattedLabel id="printedBy" />:
            </TableCell>

            <TableCell colspan="3" align="start">
              <FormattedLabel id="printDateTime" />:
            </TableCell>
          </TableRow> */}

        {/* <TableRow >
            <TableCell colspan="6" align="start">
              <FormattedLabel id="remarkForPrint" /><br />
              <FormattedLabel id="tip" />
            </TableCell>

            <TableCell colspan="3" align="start">
              <FormattedLabel id="receiverSign" />
            </TableCell>
          </TableRow> */}

        {/* <TableRow >
            <TableCell colspan="6" align="start">
              <FormattedLabel id="printedBy" />:
            </TableCell>

            <TableCell colspan="3" align="start">
              <FormattedLabel id="printDateTime" />:
            </TableCell>
          </TableRow> */}

        {/* </div> */}
        {/* <div className={styles.small}>
        <div className={styles.row}> */}
        {/* Documents Upload */}
        {/* <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" border="1" stickyHeader >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr.No</StyledTableCell>
                  <StyledTableCell>Document Upload</StyledTableCell>
                  <StyledTableCell align="right">Document Type</StyledTableCell>
                  <StyledTableCell align="right">
                    Upload Document
                  </StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell> */}
        {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
        {/* </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.finalRow}>
                  <TableCell align="left" colSpan={6}>
                    <b>Mandatory Documents</b>
                  </TableCell>
                </TableRow>
                {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.calories}</StyledTableCell>
                    <StyledTableCell
                      align="right"
                      // style={{ color: "red" }}
                    >
                      {row.fat}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                    <StyledTableCell>{row.protein}</StyledTableCell>
                  </StyledTableRow>
                ))}



{/* <Table sx={{  width: '100%', height: "40%" }} size="small" aria-label="a dense table" border="1" stickyHeader> */}

        <TableRow>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Receipt No./ पावती क्र.</b>
          </TableCell>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Date/ तारीख</b>
          </TableCell>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Related To/ विभागाकडुन</b>
          </TableCell>
          <TableCell>
            <b style={{ padding: "1.5px" }}>CFC Ref. No</b>
          </TableCell>
          <TableCell>
            <b style={{ padding: "1.5px" }}>CFC Counter No.</b>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <b style={{ padding: "1.5px" }}>
              Recieved Form/फॉर्म प्राप्त झाला
              {/* {<FormattedLabel id="recievedForm" />} */}
            </b>
          </TableCell>
          <TableCell colspan="6"></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Service Name/सेवेचे नाव</b>
          </TableCell>
          <TableCell colspan="6">{router.query.serviceName}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Narration/ विवरण</b>
          </TableCell>
          <TableCell colspan="6"></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b style={{ padding: "1.5px" }}>Address/पत्ता</b>
          </TableCell>
          <TableCell colspan="6"></TableCell>
        </TableRow>
        {/* <TableRow></TableRow> */}
        <TableRow>
          <TableCell>payment mode/पेमेंट मोड</TableCell>
          <TableCell>Rupees/रुपये</TableCell>
          <TableCell>Cheque No/धनादेश क्र</TableCell>
          <TableCell>Cheque Date/धनादेश तारीख</TableCell>
          <TableCell>Bank Name/बँकेचे नाव</TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan="12">
            <b style={{ backgroundColor: "white", padding: "1px" }}></b>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Refrence No/संदर्भ क्रमांक</TableCell>
          <TableCell>Date/तारीख</TableCell>
          <TableCell>Details/तपशील</TableCell>
          <TableCell>Payable Amount/देय रक्कम</TableCell>
          <TableCell>Received Amount/प्राप्त रक्कम</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <b style={{ backgroundColor: "white", padding: "1px" }}></b>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b style={{ backgroundColor: "white", padding: "1px" }}></b>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <b style={{ backgroundColor: "white", padding: "1px" }}></b>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>

        <TableRow>
          <TableCell>total amount/एकूण रक्कम</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>0.00</TableCell>
          <TableCell>0.00</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Payable Amount/देय रक्कम</TableCell>
          <TableCell>Rebate Amount/सूट रक्कम</TableCell>
          <TableCell>Advance Amount/आगाऊ रक्कम</TableCell>
          <TableCell>Actual Payable/वास्तविक देय</TableCell>
          <TableCell>Received Amount/प्राप्त रक्कम</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <b style={{ backgroundColor: "white", padding: "1px" }}></b>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <b style={{ backgroundColor: "white" }}>
              Amount in words/शब्दात रक्कम:
            </b>
          </TableCell>

          <TableCell colspan="6">{router.query.amountInWord}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell colspan="3">
            <span>Remark/शेरा</span>
            <br></br>
            <div>टीप: सदरची पावती चेक वटल्यावरती ग्राह्य धरण्यात यईल.</div>
          </TableCell>

          <TableCell colspan="6">
            <b>Receiver Signature/प्राप्तकर्त्याची स्वाक्षरी</b>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colspan="3">
            <b>Priented By:</b>
          </TableCell>
          <TableCell colspan="6">
            <b>Print Date And Time:</b>
          </TableCell>
        </TableRow>
        {/* </Table> */}
        {/* </TableBody> */}
        {/* </Table> */}
        {/* </TableContainer> */}
        {/* </div> */}
        {/* <br /> */}

        {/* <Button
                sx={{ marginRight: 8 }}
                variant="contained"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => cancellButton()}
              >
                Clear
              </Button> */}
        {/* </form>
        </FormProvider> */}
        {/* </div> */}
        {/* </Slide> */}
        {/* )} */}
        {/* </Paper> */}
        {/* </Card> */}
        {/* </BasicLayout> */}
      </Table>
    </>
  );
};

export default ForPrint;
