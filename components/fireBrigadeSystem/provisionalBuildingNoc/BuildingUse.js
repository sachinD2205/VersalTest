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
import urls from "../../../URLS/urls";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MenuIcon from "@mui/icons-material/Menu";

import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const ApplicantDetails = ({ readOnly = false }) => {
  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

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

  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);

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

  useEffect(() => {
    getArea();
  }, []);

  const [area, setArea] = useState();

  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((res) => setArea(res?.data?.area))
      .catch((err) => console.log(err));
  };

  const editRecord = (rows) => {
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    buildingHeightFromGroundFloorInMeter: "",
    noOfBasement: "",
    totalBuildingFloor: "",
    basementAreaInsquareMeter: "",
    noOfVentilation: "",
    noOfTowers: "",
    plotAreaSquareMeter: "",
    constructionAreSqMeter: "",
    noOfApprochedRoad: "",
    drawingProvided: "",
    siteAddress: "",
    highTensionLine: "",
    areaZone: "",
    previouslyAnyFireNocTaken: "",
    underTheGroundWaterTankCapacityLighter: "",
    l: "",
    b: "",
    h: "",
    volumeLBHIn: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    buildingHeightFromGroundFloorInMeter: "",
    noOfBasement: "",
    totalBuildingFloor: "",
    basementAreaInsquareMeter: "",
    noOfVentilation: "",
    noOfTowers: "",
    plotAreaSquareMeter: "",
    constructionAreSqMeter: "",
    noOfApprochedRoad: "",
    drawingProvided: "",
    siteAddress: "",
    highTensionLine: "",
    areaZone: "",
    previouslyAnyFireNocTaken: "",
    underTheGroundWaterTankCapacityLighter: "",
    l: "",
    b: "",
    h: "",
    volumeLBHIn: "",
  };

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
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="buildingHeightFromGroundFloorInMeter" />}
            variant="standard"
            {...register("buildingHeightFromGroundFloorInMeter")}
            error={!!errors.buildingHeightFromGroundFloorInMeter}
            helperText={
              errors?.buildingHeightFromGroundFloorInMeter
                ? errors.buildingHeightFromGroundFloorInMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="noOfBasement" />}
            variant="standard"
            {...register("noOfBasement")}
            error={!!errors.noOfBasement}
            helperText={
              errors?.noOfBasement ? errors.noOfBasement.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="volumeLBHIn" />}
            variant="standard"
            {...register("volumeLBHIn")}
            error={!!errors.volumeLBHIn}
            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="totalBuildingFloor" />}
            variant="standard"
            {...register("totalBuildingFloor")}
            error={!!errors.totalBuildingFloor}
            helperText={
              errors?.totalBuildingFloor
                ? errors.totalBuildingFloor.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="basementAreaInsquareMeter" />}
            variant="standard"
            {...register("basementAreaInsquareMeter")}
            error={!!errors.basementAreaInsquareMeter}
            helperText={
              errors?.basementAreaInsquareMeter
                ? errors.basementAreaInsquareMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="noOfVentilation" />}
            variant="standard"
            {...register("noOfVentilation")}
            error={!!errors.noOfVentilation}
            helperText={
              errors?.noOfVentilation ? errors.noOfVentilation.message : null
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
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="noOfTowers" />}
            variant="standard"
            {...register("noOfTowers")}
            error={!!errors.noOfTowers}
            helperText={errors?.noOfTowers ? errors.noOfTowers.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="plotAreaSquareMeter" />}
            variant="standard"
            {...register("plotAreaSquareMeter")}
            error={!!errors.plotAreaSquareMeter}
            helperText={
              errors?.plotAreaSquareMeter
                ? errors.plotAreaSquareMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="constructionAreSqMeter" />}
            variant="standard"
            {...register("constructionAreSqMeter")}
            error={!!errors.constructionAreSqMeter}
            helperText={
              errors?.constructionAreSqMeter
                ? errors.constructionAreSqMeter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="noOfApprochedRoad" />}
            variant="standard"
            {...register("noOfApprochedRoad")}
            error={!!errors.noOfApprochedRoad}
            helperText={
              errors?.noOfApprochedRoad
                ? errors.noOfApprochedRoad.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "65%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="drawingProvided" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={10}>Yes</MenuItem>
                  <MenuItem value={20}>No</MenuItem>
                </Select>
              )}
              name="drawingProvided"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            fullWidth
            size="small"
            variant="standard"
            sx={{ width: "65%" }}
          >
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="siteAddress" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  <MenuItem value={10}>Yes</MenuItem>
                  <MenuItem value={20}>No</MenuItem>
                </Select>
              )}
              name="siteAddress"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="highTensionLine" />}
            variant="standard"
            {...register("highTensionLine")}
            error={!!errors.highTensionLine}
            helperText={
              errors?.highTensionLine ? errors.highTensionLine.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            fullWidth
            size="small"
            variant="standard"
            sx={{ width: "65%" }}
            error={!!errors.areaZone}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="areaZone" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="areaZone"
                  label="Select-Service Name"
                >
                  {area &&
                    area.map((a, index) => (
                      <MenuItem key={index} value={a.id}>
                        {a.areaName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="areaZone"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.areaZone ? errors.areaZone.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "65%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="previouslyAnyFireNocTaken" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="previouslyAnyFireNocTaken"
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                  <MenuItem value={3}>Revised</MenuItem>
                </Select>
              )}
              name="previouslyAnyFireNocTaken"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={
              <FormattedLabel id="underTheGroundWaterTankCapacityLighter" />
            }
            variant="standard"
            {...register("underTheGroundWaterTankCapacityLighter")}
            error={!!errors.underTheGroundWaterTankCapacityLighter}
            helperText={
              errors?.underTheGroundWaterTankCapacityLighter
                ? errors.underTheGroundWaterTankCapacityLighter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="l" />}
            variant="standard"
            {...register("l")}
            error={!!errors.l}
            helperText={errors?.l ? errors.l.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="b" />}
            variant="standard"
            {...register("b")}
            error={!!errors.b}
            helperText={errors?.b ? errors.b.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="h" />}
            variant="standard"
            {...register("h")}
            error={!!errors.h}
            helperText={errors?.h ? errors.h.message : null}
          />
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sx={{ margin: "6%" }}>
          <FormattedLabel id="buildingUse" />
          <FormGroup>
            <FormControlLabel
              label={<FormattedLabel id="residentialUse" />}
              control={<Checkbox />}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              label={<FormattedLabel id="iceFactory" />}
              control={<Checkbox />}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              label={<FormattedLabel id="commercialUse" />}
              control={<Checkbox />}
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              label={<FormattedLabel id="nocFor" />}
              control={<Checkbox />}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
    </>
  );
};

export default ApplicantDetails;

// <div>

// {<FormattedLabel id="approvedMapOfUndergroundWaterTank" />}
// <UploadButton
//   Change={(e) => {
//     handleFile1(e, "documentsUpload");
//   }}
//   {...register("documentsUpload")}
// />
// </div>
// <div>
//  <TextField
//disabled = { readOnly };
//   sx={{ width: 250 }}
//   id="standard-basic"
//   label={<FormattedLabel id="overHeadWaterTankCapacityInLiter" />}
//   variant="standard"
//   {...register("businessSubTypePrefix")}
//   error={!!errors.businessSubTypePrefix}
//   helperText={
//     errors?.businessSubTypePrefix
//       ? errors.businessSubTypePrefix.message
//       : null
//   }
// />
// </div>
// </div>
// <div className={styles.row}>
// <div>
//  <TextField
//disabled = { readOnly };
//   sx={{ width: 250 }}
//   id="standard-basic"
//   label={<FormattedLabel id="l" />}
//   variant="standard"
//   {...register("businessSubTypePrefix")}
//   error={!!errors.businessSubTypePrefix}
//   helperText={
//     errors?.businessSubTypePrefix
//       ? errors.businessSubTypePrefix.message
//       : null
//   }
// />
// </div>
// <div>
//  <TextField
//disabled = { readOnly };
//   sx={{ width: 250 }}
//   id="standard-basic"
//   label={<FormattedLabel id="b" />}
//   variant="standard"
//   {...register("businessSubTypePrefix")}
//   error={!!errors.businessSubTypePrefix}
//   helperText={
//     errors?.businessSubTypePrefix
//       ? errors.businessSubTypePrefix.message
//       : null
//   }
// />
// </div>
// <div>
//  <TextField
//disabled = { readOnly };
//   sx={{ width: 250 }}
//   id="standard-basic"
//   label={<FormattedLabel id="h" />}
//   variant="standard"
//   {...register("businessSubTypePrefix")}
//   error={!!errors.businessSubTypePrefix}
//   helperText={
//     errors?.businessSubTypePrefix
//       ? errors.businessSubTypePrefix.message
//       : null
//   }
// />
// </div>
// </div>
// <div className={styles.row}>
// <div>
//  <TextField
//disabled = { readOnly };
//   sx={{ width: 250 }}
//   id="standard-basic"
//   label={<FormattedLabel id="volumeLBHIn" />}
//   variant="standard"
//   {...register("businessSubTypePrefix")}
//   error={!!errors.businessSubTypePrefix}
//   helperText={
//     errors?.businessSubTypePrefix
//       ? errors.businessSubTypePrefix.message
//       : null
//   }
// />
// </div>
// </div>
// <br />
// <br />
