import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";

const GroupDetails = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      );
    });
  };
  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`groupDetails.length`) >= 3) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  const appendFun = () => {
    append({
      prState: "",
      prCityName: "",
      permanentAddress: "",
      crState: "",
      crCityName: "",
      currentAddress: "",
      emailAddress: "",
      aadharNo: "",
      mobile: "",
      age: "",
      lastName: "",
      middleName: "",
      firstName: "",
    });
  };

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "groupDetails", // unique name for your Field Array
    }
  );

  //useEffect
  useEffect(() => {
    if (getValues(`groupDetails.length`) == 0) {
      appendFun();
    }
  }, []);

  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
        }))
      );
    });
  };

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
      setCrPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        }))
      );
    });
  };

  const addressChange = (e) => {
    if (e.target.checked) {
      setValue("prCityName", getValues("prCityName"));
      setValue("prState", getValues("crState"));
      setValue("prPincode", getValues("crPincode"));
    } else {
      setValue("prCityName", "");
      setValue("prState", "");
      setValue("prPincode", "");
    }
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    getCrPinCodes();
  }, []);

  return (
    <>
      <div className={styles.details}>
        <div
          className={styles.h1Tag}
          style={{
            color: "white",
            marginTop: "7px",
          }}
        >
          Group Details
        </div>
      </div>

      {fields.map((groupDetails, index) => {
        return (
          <>
            x
            <div
              className={styles.row}
              // style={{
              //   height: '7px',
              //   width: '200px',
              // }}
            >
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "300px",
                  }}
                >
                  <h3
                    style={{
                      color: "black",
                      marginTop: "7px",
                    }}
                  >
                    Member
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            {/* <div className={styles.row}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Group Details
          </Typography>
        </div> */}
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
              <strong>
                <FormattedLabel id="groupDetails" />
              </strong>
            </div>
            <Grid
              container
              sx={{
                marginLeft: 5,
                marginTop: 1,
                marginBottom: 5,
                align: "center",
              }}
            >
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="title" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Title *"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles.map((title, index) => (
                            <MenuItem key={index} value={title.id}>
                              {title.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="title"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.title ? errors.title.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.firstName`)}
                  error={!!errors.firstName}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.middleName`)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.lastName`)}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="gender" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {genders &&
                          genders.map((gender, index) => (
                            <MenuItem key={index} value={gender.id}>
                              {gender.gender}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gender"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gender ? errors.gender.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {<FormattedLabel id="dateOfBirth" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  // disabled
                  id="standard-basic"
                  label={<FormattedLabel id="age" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.age`)}
                  error={!!errors.age}
                  helperText={errors?.age ? errors.age.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.mobile`)}
                  error={!!errors.mobile}
                  helperText={errors?.mobile ? errors.mobile.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="aadharNo" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.aadharNo`)}
                  error={!!errors.aadharNo}
                  helperText={errors?.aadharNo ? errors.aadharNo.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailAddress" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.emailAddress`)}
                  error={!!errors.emailAddress}
                  helperText={
                    errors?.emailAddress ? errors.emailAddress.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="currentAddress" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.currentAddress`)}
                  error={!!errors.currentAddress}
                  helperText={
                    errors?.currentAddress
                      ? errors.currentAddress.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  disabled
                  defaultValue={"Pimpri Chinchwad"}
                  label={<FormattedLabel id="cityName" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.crCityName`)}
                  error={!!errors.crCityName}
                  helperText={
                    errors?.crCityName ? errors.crCityName.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  disabled
                  defaultValue={"Maharashtra"}
                  label={<FormattedLabel id="state" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.crState`)}
                  error={!!errors.crState}
                  helperText={errors?.crState ? errors.crState.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="pinCode" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Pin Code *"
                      >
                        {crPincodes &&
                          crPincodes.map((crPincode, index) => (
                            <MenuItem key={index} value={crPincode.id}>
                              {crPincode.crPincode}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="crPincode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.crPincode ? errors.crPincode.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Typography>
                      <FormattedLabel id="checkBox" />
                    </Typography>
                  }
                  {...register("addressCheckBox")}
                  onChange={(e) => {
                    addressChange(e);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="permanentAddress" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.permanentAddress`)}
                  error={!!errors.permanentAddress}
                  helperText={
                    errors?.permanentAddress
                      ? errors.permanentAddress.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  disabled
                  defaultValue={"Pimpri Chinchwad"}
                  key={groupDetails.id}
                  label={<FormattedLabel id="cityName" />}
                  {...register(`groupDetails.${index}.prCityName`)}
                  error={!!errors.prCityName}
                  helperText={
                    errors?.prCityName ? errors.prCityName.message : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  disabled
                  defaultValue={"Maharashtra"}
                  label={<FormattedLabel id="state" />}
                  key={groupDetails.id}
                  {...register(`groupDetails.${index}.prState`)}
                  error={!!errors.prState}
                  helperText={errors?.prState ? errors.prState.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="pinCode" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Pin Code *"
                      >
                        {crPincodes &&
                          crPincodes.map((prPincode, index) => (
                            <MenuItem key={index} value={prPincode.id}>
                              {prPincode.prPincode}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="prPincode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.prPincode ? errors.prPincode.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <div className={styles.row} style={{ marginTop: 50 }}>
              <Button
                disabled={btnValue}
                onClick={() => buttonValueSetFun()}
                variant="contained"
              >
                Add Member
              </Button>
            </div>
          </>
        );
      })}
    </>
  );
};

export default GroupDetails;
