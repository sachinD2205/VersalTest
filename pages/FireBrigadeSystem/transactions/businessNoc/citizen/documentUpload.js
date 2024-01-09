// import { Paper } from "@mui/material";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { styled } from "@mui/material/styles";
// import dayjs from "dayjs";
// import { useRouter } from "next/router";
// import React, { useState } from "react";
// import { useFormContext, useForm } from "react-hook-form";
// import style from "../../../../../styles/fireBrigadeSystem/view.module.css";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";

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

// // style end

// const DocumentsUpload = () => {
//   // Exit button Routing
//   const [valueDate, setValueDate] = React.useState(dayjs(""));
//   const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

//   // Set Current Date and Time
//   const currDate = new Date().toLocaleDateString();
//   const currTime = new Date().toLocaleTimeString();

//   const router = useRouter();

//   const {
//     control,
//     register,
//     reset,
//     // formState: { errors },
//   } = useFormContext, useForm();

//   const rows = [
//     createData(
//       1,
//       <>
//         <FormattedLabel id='approvedMapOfUndergroundWaterTank' />,
//         {/* <>Approved map of Underground water Tank</> */}
//         <br /> <h5> (Upload file in .pdf format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       2,
//       <>
//         {/* <>Approved Key Plan, Site Plan,Elivatio n Section PCMC</> */}
//         <FormattedLabel id='approvedKeyPlan' />
//         <br /> <h5> (Upload file in .pdf format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       3,
//       <>
//         <FormattedLabel id='approvedLayoutPlanPCMC' />
//         {/* <>Approved Layout plan PCMC</> */}
//         <br />
//         <h5> (Upload file in .pdf format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       4,
//       <>
//         <FormattedLabel id='approvedApproachRoadPCMC' />
//         {/* <>Approved Approach Road PCMC</> */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       5,
//       <>
//         <FormattedLabel id='measurementOfTank' />
//         {/* <>Measurement of Tank (undergroun d, overhead) with map</> {" "} */}
//         <br />
//         <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       6,
//       <>
//         <FormattedLabel id='explosiveLicense' />
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       7,
//       <>
//         <FormattedLabel id='permissionLetterOfPCMC' />
//         {/* <>Permission letter of PCMC</> */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       8,
//       <>
//         <FormattedLabel id='completionCertificate' />
//         {/* <>Completion Certificate</> */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       9,
//       <>
//         <FormattedLabel id='structuralStabilityCertificate' />
//         {/* <>Structural Stability Certificate</> */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       10,
//       <>
//         <FormattedLabel id='escalatorApprovedByGovtCertificate' />
//         {/* <>Escalator / Lift approved by Govt. Certificate</> */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
//     createData(
//       11,
//       <>
//         <FormattedLabel id='fireDrawingFloorWiseAlsoApprovedByComplianceAuthority' />
//         {/* <>Fire Drawing Floor wise i,e also approved by compliance Authority</>{" "} */}
//         <br /> <h5> (Upload file in .XML format only)</h5>
//       </>,
//       "Mandatory",
//       <div style={{ background: "#D0D3D4", padding: "2px" }}>
//         <input
//           type='file'
//           name='myImage'
//           onChange={(event) => {
//             console.log(event.target.files[0]);
//             setSelectedImage(event.target.files[0]);
//           }}
//         />
//       </div>,
//       <span className={style.fileName}>Upload</span>
//     ),
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

//   // const classes = useStyles();

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
//       <div className={styles.small}>
//         <div className={styles.row}>
//           {/* Documents Upload */}
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 700 }} aria-label='customized table'>
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>Sr.No</StyledTableCell>
//                   <StyledTableCell>Document Upload</StyledTableCell>
//                   <StyledTableCell align='right'>Document Type</StyledTableCell>
//                   <StyledTableCell align='right'>
//                     Upload Document
//                   </StyledTableCell>
//                   <StyledTableCell align='right'></StyledTableCell>
//                   {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {/* <TableRow className={classes.finalRow}> */}
//                 <TableRow>
//                   <TableCell align='left' colSpan={6}>
//                     <b>Mandatory Documents</b>
//                   </TableCell>
//                 </TableRow>
//                 {rows.map((row) => (
//                   <StyledTableRow key={row.name}>
//                     <StyledTableCell component='th' scope='row'>
//                       {row.name}
//                     </StyledTableCell>
//                     <StyledTableCell>{row.calories}</StyledTableCell>
//                     <StyledTableCell align='right' style={{ color: "red" }}>
//                       {row.fat}
//                     </StyledTableCell>
//                     <StyledTableCell align='right'>{row.carbs}</StyledTableCell>
//                     <StyledTableCell>{row.protein}</StyledTableCell>
//                   </StyledTableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//         <br />
//         {/* <Button
//                 sx={{ marginRight: 8 }}
//                 variant="contained"
//                 color="primary"
//                 endIcon={<ClearIcon />}
//                 onClick={() => cancellButton()}
//               >
//                 Clear
//               </Button> */}
//         {/* </form>
//         </FormProvider> */}
//       </div>
//       {/* </Slide> */}
//       {/* )} */}
//       {/* </Paper> */}
//       {/* </Card> */}
//       {/* </BasicLayout> */}
//     </>
//   );
// };

// export default DocumentsUpload;

import { Box, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useFormContext, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel.js";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
// import UploadButtonOP from "../../../components/fileUpload/DocumentsUploadOP.js";
import UploadButtonOP from "../../../../../components/fileUpload/DocumentsUploadOP";
import Loader from "../../../../../containers/Layout/components/Loader/index.js";
import urls from "../../../../../URLS/urls";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Document = (props) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const userToken = useGetToken();

  const [isLoading, setIsLoading] = useState(true);

  // let typeOfBusiness = props?.props;
  // console.log("documentprops?.props---->", typeOfBusiness);
  // useEffect(() => {
  //   // setValue(typeOfBusiness, props?.props);
  // }, []);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = () => {
    axios
      .get(
        `${urls.FbsURL}/businessAndServiceMapping/getAllServiceWiseCheckList?typeOfBusinessId=${props?.props}`,
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
            console.log("rrrrrrrr", r);
            return {
              ...r,
              // docKey: r.document,
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
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setIsLoading(false);
    console.log("attachmentssafterupdate", watch("attachmentss"));
  }, [watch("attachmentss")]);
  // }, []);

  const language = useSelector((state) => state.labels.language);

  let appName = "FBS";

  let serviceName = "BusinessNoc";

  const columnsF = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      // field: "documentChecklistEn",
      headerName: "Document Name",
      flex: 4,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      width: 30,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Upload Document",
      flex: 2,
      // headerAlign: "center",
      // align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <UploadButtonOP
              // error={!!errors?.advirtiseMentInDocx}
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
            />
            {/*  */}
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* <Grid
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          padding: 8,
          paddingLeft: 30,
          // marginLeft: "40px",
          // marginRight: "65px",
          borderRadius: 100,
        }}
      >
        Documents Upload
      </Grid> */}
      {isLoading ? (
        <Loader />
      ) : (
        <DataGrid
          style={{
            marginTop: 30,
            marginBottom: 30,
          }}
          getRowId={(row) => row.srNo}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableExport
          hideFooter
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",

            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {},
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={getValues(`attachmentss`) ? getValues(`attachmentss`) : []}
          columns={columnsF}
        />
      )}
    </>
  );
};
export default Document;
