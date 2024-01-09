import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

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

  const editRecord = (rows) => {
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

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
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "drawingProvided",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "65%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="siteAddress" />}
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "siteAddress",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Yes</option>
              <option value={20}>No</option>
            </NativeSelect>
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
                  label="Select-Service Name"
                >
                  {businessTypes &&
                    businessTypes.map((businessType, index) => (
                      <MenuItem key={index} value={businessType.id}>
                        {businessType.businessType}
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
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "previouslyAnyFireNocTaken",
                id: "uncontrolled-native",
              }}
            >
              <option value={1}>Yes</option>
              <option value={2}>No</option>
              <option value={3}>Revised</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
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
            id="standard-basic"
            label={<FormattedLabel id="h" />}
            variant="standard"
            {...register("h")}
            error={!!errors.h}
            helperText={errors?.h ? errors.h.message : null}
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
            label={<FormattedLabel id="overHeadWaterTankCapacityInLiter" />}
            variant="standard"
            {...register("overHeadWaterTankCapacityInLiter")}
            error={!!errors.overHeadWaterTankCapacityInLiter}
            helperText={
              errors?.overHeadWaterTankCapacityInLiter
                ? errors.overHeadWaterTankCapacityInLiter.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
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
            id="standard-basic"
            label={<FormattedLabel id="h" />}
            variant="standard"
            {...register("h")}
            error={!!errors.h}
            helperText={errors?.h ? errors.h.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="volumeLBHIn" />}
            variant="standard"
            {...register("volumeLBHIn")}
            error={!!errors.volumeLBHIn}
            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        // className={styles.feildres}
      >
        <Grid item xs={4} sx={{ margin: "6%" }}>
          <h4>Building Use</h4>
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
      </Grid>
    </>
  );
};

export default ApplicantDetails;
