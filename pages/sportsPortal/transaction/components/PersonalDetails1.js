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
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";

const PersonalDetails1 = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      );
    });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.map((row) => ({
          id: row.id,
          gender: row.gender,
        }))
      );
    });
  };

  // casts
  const [casts, setCasts] = useState([]);

  // getCasts
  const getCasts = () => {
    axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
      setCasts(
        r.data.map((row) => ({
          id: row.id,
          cast: row.castt,
        }))
      );
    });
  };

  // Religions
  const [religions, setReligions] = useState([]);

  // getReligions
  const getReligions = () => {
    axios.get(`${urls.BaseURL}/religion/getAll`).then((r) => {
      setReligions(
        r.data.map((row) => ({
          id: row.id,
          religion: row.religion,
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
        r.data.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        }))
      );
    });
  };

  // const addressChange = (e) => {
  //   if (e.target.checked) {
  //     setValue("prCityName", getValues("prCityName"));
  //     setValue("prState", getValues("crState"));
  //     setValue("prPincode", getValues("crPincode"));
  //   } else {
  //     setValue("prCityName", "");
  //     setValue("prState", "");
  //     setValue("prPincode", "");
  //   }
  // };

  // typeOfDisabilitys
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  const getTypeOfDisability = () => {
    axios.get(`${urls.BaseURL}/typeOfDisability/getAll`).then((r) => {
      setTypeOfDisability(
        r.data.map((row) => ({
          id: row.id,
          typeOfDisability: row.typeOfDisability,
        }))
      );
    });
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getTypeOfDisability();
    getGenders();
    getCasts();
    getCrPinCodes();
    getReligions();
  }, []);

  return (
    <>
      {/* <div className={styles.row}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Personal Details
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
          <FormattedLabel id="personalDetails" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Title *
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
            label="First Name *"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Middle Name"
            {...register("middleName")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Last Name *"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              Gender *
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
          {/* <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="dateOfBirth"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>Date of Birth *</span>
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
            </FormControl> */}
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
                        <FormattedLabel id="dateOfBirth" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYYMMDD");
                      setValue(
                        "age",
                        moment(date1, "YYYYMMDD").fromNow().slice(0, 2)
                      );
                    }}
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
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled
              size="3"
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="age" />}
              {...register("age")}
              error={!!errors.age}
              helperText={errors?.age ? errors.age.message : null}
            />
          </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            // disabled
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="age" />}
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Mobile No. *"
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors?.mobile ? errors.mobile.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Aadhar No*"
            {...register("aadharNo")}
            error={!!errors.aadharNo}
            helperText={errors?.aadharNo ? errors.aadharNo.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Email Address *"
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={
              errors?.emailAddress ? errors.emailAddress.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Current Address *"
            {...register("currentAddress")}
            error={!!errors.currentAddress}
            helperText={
              errors?.currentAddress ? errors.currentAddress.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled
            defaultValue={"Pimpri Chinchwad"}
            label="City Name *"
            {...register("crCityName")}
            error={!!errors.crCityName}
            helperText={errors?.crCityName ? errors.crCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled
            defaultValue={"Maharashtra"}
            label="State *"
            {...register("crState")}
            error={!!errors.crState}
            helperText={errors?.crState ? errors.crState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
            <InputLabel id="demo-simple-select-standard-label">
              Pin Code *
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
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography>
                <b>Permanent Address as the Correspondence Address </b>
              </Typography>
            }
            {...register("addressCheckBox")}
            onChange={(e) => {
              addressChange(e);
            }}
          />
        </Grid> */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Controller
            name="addressCheckBox"
            control={control}
            defaultValue={false}
            render={({ field: { value, ref, ...field } }) => (
              <Checkbox
                disabled={watch("disabledFieldInputState")}
                {...field}
                inputRef={ref}
                checked={!!value}
                onChange={(e) => {
                  setValue("addressCheckBox", e?.target?.checked);
                  clearErrors("addressCheckBox");
                  addressChange(e);
                }}
              />
            )}
          />
          {/* <Typography>
            <b>
              <FormattedLabel id="checkBox" />
            </b>
          </Typography> */}

          <b> {<FormattedLabel id="checkBox" />}</b>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Permanent Address *"
            {...register("permanentAddress")}
            error={!!errors.permanentAddress}
            helperText={
              errors?.permanentAddress ? errors.permanentAddress.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled
            defaultValue={"Pimpri Chinchwad"}
            label="City Name *"
            {...register("prCityName")}
            error={!!errors.prCityName}
            helperText={errors?.prCityName ? errors.prCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled
            defaultValue={"Maharashtra"}
            label="State *"
            {...register("prState")}
            error={!!errors.prState}
            helperText={errors?.prState ? errors.prState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
            <InputLabel id="demo-simple-select-standard-label">
              Pin Code *
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
    </>
  );
};

export default PersonalDetails1;
