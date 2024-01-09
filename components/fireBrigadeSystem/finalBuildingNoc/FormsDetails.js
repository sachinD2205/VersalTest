import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const ApplicantDetails = () => {
  const userToken = useGetToken();

  // Exit button Routing
  const [valueDate, setValueDate] = React.useState(dayjs(""));
  const [valueDateTime, setValueDateTime] = React.useState(dayjs(""));

  // Set Current Date and Time
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();

  const language = useSelector((state) => state?.labels.language);

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
  const [nocTypes, setNocTypes] = useState([]);
  const [buildingTypes, setBuildingTypes] = useState([]);

  useEffect(() => {
    getNocTypes();
    getBuildingTypes();
  }, []);

  // get Noc Types
  const getNocTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfNOCMaster/getTypeOfNOCMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setNocTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  // get Building Type
  const getBuildingTypes = () => {
    axios
      .get(`${urls.BaseURL}/typeOfBuildingMaster/getTypeOfBuildingMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBuildingTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

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

  // // OnSubmit Form
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
            `${urls.BaseURL}/businessSubType/discardBusinessSubType/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
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
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
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
          <FormControl
            fullWidth
            variant="standard"
            sx={{ width: "65%" }}
            error={!!errors.businessType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="appliedFor" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Select-Service Name"
                >
                  {/* {nocTypes &&
                    nocTypes.map((NOC, index) => (
                      <MenuItem key={index} value={NOC.id}>
                        {NOC.nOCName}
                      </MenuItem>
                    ))} */}
                  <MenuItem value={1}>Provisional NOC</MenuItem>
                  <MenuItem value={2}>Final NOC</MenuItem>
                </Select>
              )}
              name="appliedFor"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.appliedFor ? errors.appliedFor.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="architectName" />}
            variant="standard"
            {...register("architectName")}
            error={!!errors.architectName}
            helperText={
              errors?.architectName ? errors.architectName.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="architectFirmName" />}
            variant="standard"
            {...register("architectFirmName: ")}
            error={!!errors.architectFirmName}
            helperText={
              errors?.architectFirmName
                ? errors.architectFirmName.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="architectRegistrationNo" />}
            variant="standard"
            {...register("architectRegistrationNo")}
            error={!!errors.architectRegistrationNo}
            helperText={
              errors?.architectRegistrationNo
                ? errors.architectRegistrationNo.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="architectNameMr" />}
            variant="standard"
            {...register("architectNameMr")}
            error={!!errors.architectNameMr}
            helperText={
              errors?.architectNameMr ? errors.architectNameMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="architectFirmNameMr" />}
            variant="standard"
            {...register("architectFirmNameMr: ")}
            error={!!errors.architectFirmNameMr}
            helperText={
              errors?.architectFirmNameMr
                ? errors.architectFirmNameMr.message
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
            label={<FormattedLabel id="applicantPermanentAddress" />}
            variant="standard"
            {...register("applicantPermanentAddress")}
            error={!!errors.applicantPermanentAddress}
            helperText={
              errors?.applicantPermanentAddress
                ? errors.applicantPermanentAddress.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="siteAddress" />}
            variant="standard"
            {...register("siteAddress")}
            error={!!errors.siteAddress}
            helperText={errors?.siteAddress ? errors.siteAddress.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="applicantContactNo" />}
            variant="standard"
            {...register("applicantContactNo")}
            error={!!errors.applicantContactNo}
            helperText={
              errors?.applicantContactNo
                ? errors.applicantContactNo.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="applicantPermanentAddressMr" />}
            variant="standard"
            {...register("applicantPermanentAddressMr")}
            error={!!errors.applicantPermanentAddressMr}
            helperText={
              errors?.applicantPermanentAddressMr
                ? errors.applicantPermanentAddressMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="siteAddressMr" />}
            variant="standard"
            {...register("siteAddressMr")}
            error={!!errors.siteAddressMr}
            helperText={
              errors?.siteAddressMr ? errors.siteAddressMr.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="finalPlotNo" />}
            variant="standard"
            {...register("finalPlotNo")}
            error={!!errors.finalPlotNo}
            helperText={errors?.finalPlotNo ? errors.finalPlotNo.message : null}
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
            label={<FormattedLabel id="revenueSurveyNo" />}
            variant="standard"
            {...register("revenueSurveyNo")}
            error={!!errors.revenueSurveyNo}
            helperText={
              errors?.revenueSurveyNo ? errors.revenueSurveyNo.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="townPlanningNo" />}
            variant="standard"
            {...register("townPlanningNo")}
            error={!!errors.townPlanningNo}
            helperText={
              errors?.townPlanningNo ? errors.townPlanningNo.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="blockNo" />}
            variant="standard"
            {...register("blockNo")}
            error={!!errors.blockNo}
            helperText={errors?.blockNo ? errors.blockNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="buildingLocation" />}
            variant="standard"
            {...register("buildingLocation")}
            error={!!errors.buildingLocation}
            helperText={
              errors?.buildingLocation ? errors.buildingLocation.message : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="opNo" />}
            variant="standard"
            {...register("opNo")}
            error={!!errors.opNo}
            helperText={errors?.opNo ? errors.opNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="citySurveyNo" />}
            variant="standard"
            {...register("citySurveyNo")}
            error={!!errors.citySurveyNo}
            helperText={
              errors?.citySurveyNo ? errors.citySurveyNo.message : null
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
            label={<FormattedLabel id="buildingLocationMr" />}
            variant="standard"
            {...register("buildingLocationMr")}
            error={!!errors.buildingLocationMr}
            helperText={
              errors?.buildingLocationMr
                ? errors.buildingLocationMr.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            variant="standard"
            sx={{ width: "65%" }}
            error={!!errors.businessType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="typeOfBuilding" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                >
                  {buildingTypes &&
                    buildingTypes.map((type, index) => (
                      <MenuItem key={index} value={type.id}>
                        {type.typeOfBuilding}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="typeOfBuilding"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl
            fullWidth
            variant="standard"
            sx={{ width: "65%" }}
            error={!!errors.nOCFor}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="nocFor" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Noc For"
                >
                  {nocTypes &&
                    nocTypes.map((NOC, index) => (
                      <MenuItem key={index} value={NOC.id}>
                        {language === "en" ? NOC.nOCName : NOC.nOCNameMr}
                        {/* {NOC.nOCName} */}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="nOCFor"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.appliedFor ? errors.appliedFor.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
};

export default ApplicantDetails;
