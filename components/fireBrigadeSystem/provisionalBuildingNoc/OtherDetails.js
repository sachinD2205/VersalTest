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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import urls from "../../../URLS/urls";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuIcon from "@mui/icons-material/Menu";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

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
    formState: { errors },
  } = useFormContext();

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

  /* React Select */
  const [age, setAge] = React.useState(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

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
  //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
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
  //         `${urls.FbsURL}/businessSubType/saveBusinessSubType`,
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

  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/businessSubType/discardBusinessSubType/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              //getcast();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

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
    overHeadWaterTankCapacityInLiter: "",
    overHearWaterTankCoApprovedMaps: "",
    approvedKeyPlan: "",
    approvedLayoutPlanPCMC: "",
    approvedApproachRoadPCMC: "",
    measurementOfTank: "",
    explosiveLicense: "",
    permissionLetterOfPCMC: "",
    completionCertificate: "",
    structuralStabilityCertificate: "",
    escalatorApprovedByGovtCertificate: "",
    fireDrawingFloorWiseAlsoApprovedByComplianceAuthority: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    overHeadWaterTankCapacityInLiter: "",
    overHearWaterTankCoApprovedMaps: "",
    approvedKeyPlan: "",
    approvedLayoutPlanPCMC: "",
    approvedApproachRoadPCMC: "",
    measurementOfTank: "",
    explosiveLicense: "",
    permissionLetterOfPCMC: "",
    completionCertificate: "",
    structuralStabilityCertificate: "",
    escalatorApprovedByGovtCertificate: "",
    fireDrawingFloorWiseAlsoApprovedByComplianceAuthority: "",
  };

  // View
  return (
    <>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={6}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="FormattedLabel" />}
            </InputLabel>
            <NativeSelect
              defaultValue=""
              value={null}
              onChange={(val) => console.log("val", val)}
              inputProps={{
                name: "overHearWaterTankCoApprovedMaps",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="approvedKeyPlan" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "approvedKeyPlan",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="approvedLayoutPlanPCMC" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "approvedLayoutPlanPCMC",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="approvedApproachRoadPCMC" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "approvedApproachRoadPCMC",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="measurementOfTank" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "measurementOfTank",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="explosiveLicense" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "explosiveLicense",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        spacing={6}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="permissionLetterOfPCMC" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "permissionLetterOfPCMC",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              <span>Completion Certificate</span>{" "}
            </InputLabel>
            <NativeSelect
              defaultValue={null}
              inputProps={{
                name: "completionCertificate",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              <span>Structural Stability Certificate</span>{" "}
            </InputLabel>
            <NativeSelect
              defaultValue={null}
              inputProps={{
                name: "structuralStabilityCertificate",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="escalatorApprovedByGovtCertificate" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "escalatorApprovedByGovtCertificate",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        {/* React Select */}
        {/* <Grid item xs={4} className={styles.feildres}>
          <FormControl fullWidth size="small" variant="standard">
            <InputLabel id="demo-simple-select-label">
              {
                <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" />
              }
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>Yes</MenuItem>
              <MenuItem value={20}>No</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ width: "65%" }}
            error={
              !!errors.fireDrawingFloorWiseAlsoApprovedByComplianceAuthority
            }
          >
            <InputLabel id="demo-simple-select-standard-label">
              {
                <FormattedLabel id="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority" />
              }
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Select-Service Name"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                </Select>
              )}
              name="fireDrawingFloorWiseAlsoApprovedByComplianceAuthority"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.fireDrawingFloorWiseAlsoApprovedByComplianceAuthority
                ? errors.fireDrawingFloorWiseAlsoApprovedByComplianceAuthority
                    .message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
};

export default OtherDetails;
