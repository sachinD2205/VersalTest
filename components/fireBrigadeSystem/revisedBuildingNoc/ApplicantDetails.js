import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const ApplicantDetails = () => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

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
  const [fetchData, setFetchData] = useState(null);

  // useEffect - Reload On update , delete ,Saved on refresh
  //   useEffect(() => {
  //     getBusinessTypes();
  //   }, []);

  //   useEffect(() => {
  //     getBusinesSubType();
  //   }, [businessTypes]);

  //   const getBusinessTypes = () => {
  //     axios.get(`${urls.FbsURL}/businessType/getBusinessTypeData`).then((r) => {
  //       setBusinessTypes(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           businessType: row.businessType,
  //         }))
  //       );
  //     });
  //   };
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  // useEffect(() => {
  //   if (router.query.pageMode == "") {
  //     setId(router.query.id1);
  //     //setId(208);
  //     // console.log(id);
  //   }
  // }, []);

  function getSteps() {
    return [
      // "",
      "Applicant Details",
      "Forms Details",
      "Purpose Of Building Use",
      "Other Details",
    ];
  }

  // useEffect(() => {
  //   getData();
  // }, [fetchData]);

  // Get Table - Data
  // localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/getTrnProvisionalBuildingFireNOCData
  // const getData = () => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getTrnProvisionalBuildingFireNOCData`
  //     )
  //     .then((res) => {
  //       setDataSource(res.data);
  //       console.log("res.data", res.data);
  //     });
  // };

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
  //     // localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC
  //     axios
  //       .post(
  //         `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC`,
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
  //         `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveTrnProvisionalBuildingFireNOC`,
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

  // localhost:8092/fbs/api/transaction/provisionalBuildingFireNOC/discardTrnProvisionalBuildingFireNOC/1
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
  //           `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/discardTrnProvisionalBuildingFireNOC/${value}`
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
  // const resetValuesCancell = {
  //   applicantName: "",
  //   applicantMiddleName: "",
  //   applicantLastName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  // Reset Values Exit
  // const resetValuesExit = {
  //   applicantName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  // View
  return (
    <>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="applicantName" />}
            variant="standard"
            {...register("applicantName")}
            error={!!errors.applicantName}
            helperText={
              errors?.applicantName ? errors.applicantName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
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
            id="standard-basic"
            label={<FormattedLabel id="applicantNameMr" />}
            variant="standard"
            {...register("applicantNameMr")}
            error={!!errors.applicantNameMr}
            helperText={
              errors?.applicantNameMr ? errors.applicantNameMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
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
            id="standard-basic"
            label={<FormattedLabel id="officeContactNo" />}
            variant="standard"
            {...register("officeContactNo")}
            error={!!errors.officeContactNo}
            helperText={
              errors?.officeContactNo ? errors.officeContactNo.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="workingSiteOnsitePersonMobileNo" />}
            variant="standard"
            {...register("workingSiteOnsitePersonMobileNo")}
            error={!!errors.workingSiteOnsitePersonMobileNo}
            helperText={
              errors?.workingSiteOnsitePersonMobileNo
                ? errors.workingSiteOnsitePersonMobileNo.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="emailId" />}
            variant="standard"
            {...register("emailId")}
            error={!!errors.emailId}
            helperText={errors?.emailId ? errors.emailId.message : null}
          />
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
};

export default ApplicantDetails;
