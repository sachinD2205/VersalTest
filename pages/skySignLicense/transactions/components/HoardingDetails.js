import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import { Button } from "antd";

let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

// http://localhost:4000/hawkerManagementSystem/transactions/components/HawkerDetails
const ApplicantDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const [advertisementTypes, setadvertisementTypes] = useState([]);

  const getadvertisementTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstAdvertisementType/getAdvertisementTypeData`)
      .then((r) => {
        setadvertisementTypes(
          r.data.map((row) => ({
            id: row.id,
            advertisementType: row.advertisementType,
          }))
        );
      });
  };

  useEffect(() => {
    getadvertisementTypes();
  }, []);

  const [mediaSubTypes, setmediaSubTypes] = useState([]);

  const getmediaSubTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstMediaSubType/getmediaSubTypeData`)
      .then((r) => {
        setmediaSubTypes(
          r.data.map((row) => ({
            id: row.id,
            mediaSubType: row.mediaSubType,
          }))
        );
      });
  };

  useEffect(() => {
    getmediaSubTypes();
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/** Main Component  */}
      <Main>
        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crPropertyTaxNumber"></FormattedLabel>}
              variant="standard"
              {...register("propertyNo")}
              error={!!errors.propertyNo}
              helperText={errors?.propertyNo ? errors.propertyNo.message : null}
            />
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="zone"></FormattedLabel>}
              variant="standard"
              {...register("zoneNo")}
              error={!!errors.zoneNo}
              helperText={errors?.zoneNo ? errors.zoneNo.message : null}
            />
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="zonename"></FormattedLabel>}
              variant="standard"
              {...register("zoneName")}
              error={!!errors.zoneName}
              helperText={errors?.zoneName ? errors.zoneName.message : null}
            />
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crVillageName"></FormattedLabel>}
              variant="standard"
              {...register("villageName")}
              error={!!errors.villageName}
              helperText={
                errors?.villageName ? errors.villageName.message : null
              }
            />
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
              variant="standard"
              {...register("surveyNo")}
              error={!!errors.surveyNo}
              helperText={errors?.surveyNo ? errors.surveyNo.message : null}
            />
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="roadName"></FormattedLabel>}
              variant="standard"
              {...register("roadName")}
              error={!!errors.roadName}
              helperText={errors?.roadName ? errors.roadName.message : null}
            />
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crLandmarkName"></FormattedLabel>}
              variant="standard"
              {...register("landmark")}
              error={!!errors.landmark}
              helperText={errors?.landmark ? errors.landmark.message : null}
            />
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crCityName"></FormattedLabel>}
              variant="standard"
              {...register("city")}
              error={!!errors.city}
              helperText={errors?.city ? errors.city.message : null}
            />
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crPincode"></FormattedLabel>}
              variant="standard"
              {...register("pincode")}
              error={!!errors.pincode}
              helperText={errors?.pincode ? errors.pincode.message : null}
            />
          </Grid>
        </Grid>

        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          <FormattedLabel id="skysigndetails" />
        </div>

        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.advertisementType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="advertisementtype"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Advertisement Type *"
                  >
                    {advertisementTypes &&
                      advertisementTypes.map((advertisementType, index) => (
                        <MenuItem key={index} value={advertisementType.id}>
                          {advertisementType.advertisementType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="advertisementType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.advertisementType
                  ? errors.advertisementType.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.mediaSubType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="mediaSubType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Media Sub Type *"
                  >
                    {mediaSubTypes &&
                      mediaSubTypes.map((mediaSubType, index) => (
                        <MenuItem key={index} value={mediaSubType.id}>
                          {mediaSubType.mediaSubType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="mediaSubType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.mediaSubType ? errors.mediaSubType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ m: 1, width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="skysignInfo"></FormattedLabel>}
              variant="standard"
              {...register("skysignInfo")}
              error={!!errors.skysignInfo}
              helperText={
                errors?.skysignInfo ? errors.skysignInfo.message : null
              }
            />
          </Grid>
        </Grid>
      </Main>
    </>
  );
};

export default ApplicantDetails;
