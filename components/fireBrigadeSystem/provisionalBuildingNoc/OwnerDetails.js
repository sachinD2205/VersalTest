import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
  List,
  Grid,
  Card,
  Typography,
  AppBar,
  Toolbar,
  FormControlLabel,
  FormGroup,
  Checkbox,
  NativeSelect,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";

import { useRouter } from "next/router";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MenuIcon from "@mui/icons-material/Menu";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

const OwnerDetails = () => {
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
      "owner Details",
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
  //   ownerName: "",
  //   ownerMiddleName: "",
  //   ownerLastName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  // Reset Values Exit
  // const resetValuesExit = {
  //   ownerName: "",
  //   applicationDate: "",
  //   officeContactNo: "",
  //   workingSiteOnsitePersonMobileNo: "",
  //   emailId: "",
  // };

  // View
  return (
    <>
      <br />
      <br />
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        // className={styles.feildres}
        sx={{ marginLeft: "6%" }}
      >
        {/* <Grid item xs={1} className={styles.feildres}></Grid> */}
        {/* <h4>{<FormattedLabel id="applicationDate" />} :</h4> */}
        <Grid item xs={4} className={styles.feildres}>
          {/* <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.applicationDate}
            sx={{ width: "65%" }}
          >
            <Controller
              control={control}
              name="applicationDate"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    readOnly
                    inputFormat="DD/MM/YYYY"
                    label={<FormattedLabel id="applicationDate" />}
                    value={field.value}
                    // onChange={(date) => field.onChange(date)}
                    // onChange={(date) =>
                    //   field.onChange(
                    //     moment(date).format("yyyy-MM-dd")
                    //   )
                    // }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.applicationDate ? errors.applicationDate.message : null}
            </FormHelperText>
          </FormControl> */}
          {/* <FormControl
            style={{ marginTop: 10 }}
            error={!!errors.dateAndTimeOfVardi}
          >
            <Controller
              control={control}
              
              name="applicationDate"
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    readOnly
                    label={<FormattedLabel id="applicationDate" />}
                    value={field.value}
                    inputFormat="YYYY-MM-DD"
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-DD-MM"))
                    }
                    selected={field.value}
                    {...register("applicationDate")}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                            shrink: true,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
           
          </FormControl> */}
        </Grid>
      </Grid>
      <br />

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="ownerName" />}
            variant="standard"
            {...register("ownerName")}
            error={!!errors.ownerName}
            helperText={errors?.ownerName ? errors.ownerName.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="ownerMiddleName" />}
            variant="standard"
            {...register("ownerMiddleName")}
            error={!!errors.ownerMiddleName}
            helperText={
              errors?.ownerMiddleName ? errors.ownerMiddleName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="ownerLastName" />}
            variant="standard"
            {...register("ownerLastName")}
            error={!!errors.ownerLastName}
            helperText={
              errors?.ownerLastName ? errors.ownerLastName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="ownerNameMr" />}
            variant="standard"
            {...register("ownerNameMr")}
            error={!!errors.ownerNameMr}
            helperText={errors?.ownerNameMr ? errors.ownerNameMr.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
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
            id="standard-basic"
            label={<FormattedLabel id="ownerLastNameMr" />}
            variant="standard"
            {...register("ownerLastNameMr")}
            error={!!errors.ownerLastNameMr}
            helperText={
              errors?.ownerLastNameMr ? errors.ownerLastNameMr.message : null
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
            label={<FormattedLabel id="mobileNo" />}
            variant="standard"
            {...register("mobileNo")}
            // type="number"
            error={!!errors.mobileNo}
            helperText={errors?.mobileNo ? errors.mobileNo.message : null}
          />
        </Grid>
        {/* <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="workingSiteOnsitePersonMobileNo" />}
            variant="standard"
            // type="number"
            {...register("workingSiteOnsitePersonMobileNo")}
            error={!!errors.workingSiteOnsitePersonMobileNo}
            helperText={
              errors?.workingSiteOnsitePersonMobileNo
                ? errors.workingSiteOnsitePersonMobileNo.message
                : null
            }
          />
        </Grid> */}
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
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="firmName" />}
            variant="standard"
            // key={groupDetails.id}
            {...register("firmName")}
            error={!!errors.firmName}
            helperText={errors?.firmName ? errors.firmName.message : null}
          />
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
};

export default OwnerDetails;
