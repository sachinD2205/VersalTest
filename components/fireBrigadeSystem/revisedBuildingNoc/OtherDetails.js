import { Paper } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import style from "../../../styles/fireBrigadeSystem/view.module.css";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

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

// style end

const OtherDetails = () => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const router = useRouter();

  const {
    control,
    register,

    reset,
    // formState: { errors },
  } = useFormContext();

  const rows = [
    createData(
      1,
      <>
        <FormattedLabel id="approvedMapOfUndergroundWaterTank" />,
        {/* <>Approved map of Underground water Tank</> */}
        <br /> <h5> (Upload file in .pdf format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      2,
      <>
        {/* <>Approved Key Plan, Site Plan,Elivatio n Section PCMC</> */}
        <FormattedLabel id="approvedKeyPlan" />
        <br /> <h5> (Upload file in .pdf format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      3,
      <>
        <FormattedLabel id="approvedLayoutPlanPCMC" />
        {/* <>Approved Layout plan PCMC</> */}
        <br />
        <h5> (Upload file in .pdf format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      4,
      <>
        <FormattedLabel id="approvedApproachRoadPCMC" />
        {/* <>Approved Approach Road PCMC</> */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      5,
      <>
        <FormattedLabel id="measurementOfTank" />
        {/* <>Measurement of Tank (undergroun d, overhead) with map</> {" "} */}
        <br />
        <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      6,
      <>
        <FormattedLabel id="explosiveLicense" />
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      7,
      <>
        <FormattedLabel id="permissionLetterOfPCMC" />
        {/* <>Permission letter of PCMC</> */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      8,
      <>
        <FormattedLabel id="completionCertificate" />
        {/* <>Completion Certificate</> */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      9,
      <>
        <FormattedLabel id="structuralStabilityCertificate" />
        {/* <>Structural Stability Certificate</> */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      10,
      <>
        <FormattedLabel id="escalatorApprovedByGovtCertificate" />
        {/* <>Escalator / Lift approved by Govt. Certificate</> */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
    createData(
      11,
      <>
        <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" />
        {/* <>Fire Drawing Floor wise i,e also approved by compliance Authority</>{" "} */}
        <br /> <h5> (Upload file in .XML format only)</h5>
      </>,
      "Mandatory",
      <div style={{ background: "#D0D3D4", padding: "2px" }}>
        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            console.log(event.target.files[0]);
            setSelectedImage(event.target.files[0]);
          }}
        />
      </div>,
      <span className={style.fileName}>Upload</span>
    ),
  ];
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

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

//   // const classes = useStyles();

//   // useEffect - Reload On update , delete ,Saved on refresh
//   //   useEffect(() => {
//   //     getBusinessTypes();
//   //   }, []);

//   //   useEffect(() => {
//   //     getBusinesSubType();
//   //   }, [businessTypes]);

//   //   const getBusinessTypes = () => {
//   //     axios.get(`${urls.FbsURL}/businessType/getBusinessTypeData`).then((r) => {
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
//   //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
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
//   //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
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
  //           `${urls.FbsURL}/businessSubType/discardBusinessSubType/${value}`
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
      <div className={style.small}>
        <div className={style.row}>
          {/* Documents Upload */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sr.No</StyledTableCell>
                  <StyledTableCell>Document Upload</StyledTableCell>
                  <StyledTableCell align="right">Document Type</StyledTableCell>
                  <StyledTableCell align="right">
                    Upload Document
                  </StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
                  {/* <StyledTableCell align="right">Protein&nbsp;</StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={tableCellClasses.finalRow}>
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
                    <StyledTableCell align="right" style={{ color: "red" }}>
                      {row.fat}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                    <StyledTableCell>{row.protein}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <br />
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
      </div>
      {/* </Slide> */}
      {/* )} */}
      {/* </Paper> */}
      {/* </Card> */}
      {/* </BasicLayout> */}
    </>
  );
};

export default OtherDetails;

// import React from "react";

// const OtherDetails = () => {
//   return (
//     <>
//       <h1>Document</h1>
//     </>
//   );
// };

// export default OtherDetails;
