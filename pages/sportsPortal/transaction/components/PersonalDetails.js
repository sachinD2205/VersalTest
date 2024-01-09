/* eslint-disable react-hooks/exhaustive-deps */
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/sportsPortalStyles/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const PersonalDetails = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const [titles, setTitles] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [addressShrink, setAddressShrink] = useState();
  const [medical, setMedical] = useState("Invalid");
  const [genders, setGenders] = useState([]);
  const [crPincodes, setCrPinCodes] = useState([]);
  const userId = useSelector((state) => state?.user?.user?.id);
  const user = useSelector((state) => state?.user?.user);
  const [checkAddress, setCheckAddress] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // getTitles
  const getTitles = () => {
    axios
      .get(`${URLS.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titleMr: row.titleMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("watch",watch("firstName"));
  // title gender mapping
  const filtredGender = () => {
    if (watch("title") == 1 || watch("title") == 6) {
      let x = [genders.find((o) => o.id == 1)];
      setValue("gender", x[0]?.id);
    } else if (watch("title") == 2 || watch("title") == 3) {
      let x = [genders.find((o) => o.id == 2)];
      setValue("gender", x[0]?.id);
    } else if (watch("title") == 18) {
      let x = [genders.find((o) => o.id == 3)];
      setValue("gender", x[0]?.id);
    }
  };

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios
      .get(`${URLS.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setCrPinCodes(
          r.data.pinCode.map((row) => ({
            id: row.id,
            crPincode: row.pinCode,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getGenders
  const getGenders = () => {
    axios
      .get(`${URLS.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // addressChange
  // const addressChange = (e) => {
  //   if (e?.target?.checked == true) {
  //     setValue("pCityName", watch("cCityName"));
  //     setValue("pState", watch("cState"));
  //     setValue("pPincode", watch("cPincode"));
  //     setValue("pAddress", watch("cAddress"));
  //     setValue("pLattitude", watch("cLattitude"));
  //     setValue("pLongitude", watch("cLongitude"));
  //     setValue("pLongitude", watch("cLongitude"));
  //     setValue("pStateMr", watch("cStateMr"));
  //     setValue("pCityNameMr", watch("cCityNameMr"));
  //     setValue("pAddressMr", watch("addressMr"));
  //     clearErrors("pCityName");
  //     clearErrors("pState");
  //     clearErrors("pPincode");
  //     clearErrors("pAddress");
  //     clearErrors("pAddressMr");
  //     clearErrors("pLattitude");
  //     clearErrors("pLongitude");
  //     clearErrors("pLongitude");
  //     setAddressShrink(true);
  //   } else {
  //     setValue("pCityName", "");
  //     setValue("pState", "");
  //     setValue("pPincode", "");
  //     setValue("pAddress", "");
  //     setValue("pLattitude", "");
  //     setValue("pAddress", "");
  //     setValue("pCityNameMr", "");
  //     setValue("pStateMr", "");
  //     clearErrors("pCityName");
  //     clearErrors("pState");
  //     clearErrors("pPincode");
  //     clearErrors("pAddress");
  //     clearErrors("pAddressMr");
  //     clearErrors("pLattitude");
  //     clearErrors("pLongitude");
  //     clearErrors("pLongitude");
  //     setAddressShrink(false);
  //     setAddressShrink();
  //   }
  // };

  const addressChange = (e) => {
    if (e?.target?.checked == true) {
      setValue("pCityName", watch("cCityName"));
      setValue("pState", watch("cState"));
      setValue("pPincode", watch("cPincode"));
      setValue("pAddress", watch("cAddress"));
      setValue("pLattitude", watch("cLattitude"));
      setValue("pLongitude", watch("cLongitude"));
      setValue("pLongitude", watch("cLongitude"));
      setValue("pStateMr", watch("cStateMr"));
      setValue("pCityNameMr", watch("cCityNameMr"));
      setValue("pAddressMr", watch("addressMr"));
      clearErrors("pCityName");
      clearErrors("pCityNameMr");
      clearErrors("pState");
      clearErrors("pStateMr");
      clearErrors("pPincode");
      clearErrors("pAddress");
      clearErrors("pAddressMr");
      clearErrors("pLattitude");
      clearErrors("pLongitude");
      clearErrors("pLongitude");
      setAddressShrink(true);
      setCheckAddress(true);
    } else {
      setCheckAddress(false);
      setValue("pCityName", "");
      setValue("pState", "");
      setValue("pPincode", "");
      setValue("pAddress", "");
      setValue("pLattitude", "");
      setValue("pAddress", "");
      setValue("pAddressMr", "");
      setValue("pCityNameMr", "");
      setValue("pStateMr", "");
      clearErrors("pCityName");
      clearErrors("pState");
      clearErrors("pPincode");
      clearErrors("pAddress");
      clearErrors("pAddressMr");
      clearErrors("pLattitude");
      clearErrors("pLongitude");
      clearErrors("pLongitude");
      setAddressShrink(false);
      setAddressShrink();
    }
  };

  // checkMedicalCertificateNo
  const checkMedicalCertificateNo = () => {
    const url = `${
      URLS.SPURL
    }/gymBooking/getByCreatedUserIdAndService?createdUserId=${userId}&service=${35}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("medicalCertificate", res?.data?.medicalCertificate);
          setValue("medicalCertificate", res?.data?.medicalCertificate);
        } else {
          console.log("Not Valid", res);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  ///! =============> useEffects ========>

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    getCrPinCodes();
  }, []);
  useEffect(() => {
    if (
      watch("title") != null &&
      watch("title") != undefined &&
      genders?.length != 0
    ) {
      console.log("title", watch("title"));
      filtredGender();
    }
  }, [watch("title"), genders]);

  useEffect(() => {
    if (router?.query?.pageMode === "Add") {
      setValue("title", user?.title);
      setValue("firstName", user?.firstName);
      setValue("middleName", user?.middleName);
      setValue("lastName", user?.surname);
      setValue("firstNameMr", user?.firstNamemr);
      setValue("middleNameMr", user?.middleNamemr);
      setValue("lastNameMr", user?.surnamemr);
      setValue("gender", user?.gender);
      setValue("dateOfBirth", user?.dateOfBirth);
      setValue("age", user?.age);
      setValue("cState", "Maharashtra");
      setValue("mobileNo", user?.mobile);
      setValue("emailAddress", user?.emailID);
      // cAddress
      setValue(
        "cAddress",
        user?.cflatBuildingNo +
          "," +
          user?.cbuildingName +
          "," +
          user?.croadName +
          "," +
          user?.clandmark
      );

      // addressMr
      setValue(
        "addressMr",
        user?.cflatBuildingNo +
          "," +
          user?.cbuildingNameMr +
          "," +
          user?.croadNameMr +
          ","
      );
      setValue("cCityName", user.ccity);
      setValue("cPincode", user.cpinCode);
      setValue("cStateMr", user.cstateMr);
      setValue("cCityNameMr", user.ccityMr);
    }
  }, [user]);

  useEffect(() => {
    checkMedicalCertificateNo();
    console.log("Medical Certificate");
  }, [watch("userId")]);

  useEffect(() => {
    if (
      watch("dateOfBirth") != null &&
      watch("dateOfBirth") != undefined &&
      watch("dateOfBirth") != ""
    ) {
      let date1 = moment(watch("dateOfBirth")).format("YYYY");
      setValue("age", Math.floor(moment().format("YYYY") - date1));
    }
  }, [watch("dateOfBirth")]);

  // view
  return (
    <>
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>
          <FormattedLabel id="personalDetails" />
        </strong>
      </div>

      <>
        <h4
          style={{
            marginLeft: "40px",
            marginTop: "20px",
            color: "red",
            fontStyle: "italic",
          }}
        >
          <p>
            <blink className={styles.blink}>
              {<FormattedLabel id="depositeCondition" />}
            </blink>
          </p>
        </h4>
      </>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  // disabled={readOnly}
                  disabled
                  onChange={(value) => field.onChange(value)}
                  label="Title *"
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {/* {title.title} */}
                        {language == "en" ? title?.title : title?.titleMr}
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
            // disabled={readOnly}
            disabled
            InputLabelProps={{ shrink: true }}
            defaultValue={watch("firstName")}
            id="standard-basic"
            label={<FormattedLabel id="firstName" required />}
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            // disabled={readOnly}
            disabled
            id="standard-basic"
            label={<FormattedLabel id="middleName" required />}
            {...register("middleName")}
            error={!!errors.middleName}
            helperText={errors?.middleName ? errors.middleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            // disabled={readOnly}
            disabled
            id="standard-basic"
            label={<FormattedLabel id="lastName" required />}
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender} disabled>
            <InputLabel shrink={true} id="demo-simple-select-standard-label">
              <FormattedLabel id="gender" required />
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
                        {language == "en" ? gender?.gender : gender?.genderMr}
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
          <TextField
            disabled
            // disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="firstNamemr" />}
            {...register("firstNameMr")}
            error={!!errors.firstNameMr}
            helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled
            // disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="middleNamemr" />}
            {...register("middleNameMr")}
            error={!!errors.middleNameMr}
            helperText={
              errors?.middleNameMr ? errors.middleNameMr.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            // disabled={readOnly}
            disabled
            id="standard-basic"
            label={<FormattedLabel id="lastNamemr" />}
            {...register("lastNameMr")}
            error={!!errors.lastNameMr}
            helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
          />
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
                    disabled={readOnly}
                    inputFormat="DD/MM/YYYY"
                    maxDate={new Date()}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="dateOfBirth" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
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

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
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
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 10 }}
            id="standard-basic"
            label={<FormattedLabel id="mobileNo" required />}
            {...register("mobileNo")}
            error={!!errors.mobileNo}
            helperText={errors?.mobileNo ? errors.mobileNo.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            inputProps={{ maxLength: 12 }}
            id="standard-basic"
            label={<FormattedLabel id="aadharNo" required />}
            {...register("aadharCardNo")}
            error={!!errors.aadharCardNo}
            helperText={
              errors?.aadharCardNo ? errors.aadharCardNo.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="emailAddress" required />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={
              errors?.emailAddress ? errors.emailAddress.message : null
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.medicalIssuedDate} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="medicalIssuedDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={readOnly}
                    inputFormat="DD/MM/YYYY"
                    minDate={new Date()}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="medicalValidityPeriod" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
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
              {errors?.medicalIssuedDate
                ? errors.medicalIssuedDate.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="medicalCertificateNo" />}
            {...register("medicalCertificateNo")}
            // onChange={(e) => {
            //   console.log("Medical", e.target.value);
            //   checkMedicalCertificateNo();
            // }}
            // onClick={(e) => {
            //   console.log("Medical", e.target.value);
            //   checkMedicalCertificateNo();
            // }}
            error={!!errors.medicalCertificateNo}
            helperText={
              errors?.medicalCertificateNo
                ? errors.medicalCertificateNo.message
                : null
            }
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Controller
            render={({ field }) => (
              <TextField
                disabled={readOnly}
                id="standard-basic"
                label={<FormattedLabel id="medicalCertificateNo" required />}
                {...register("medicalCertificateNo")}
                // onChange={(e) => {
                //   console.log("Medical", e.target.value);
                //   checkMedicalCertificateNo();
                // }}
                onChange={(value) => {
                  field.onChange(value);
                  console.log("897898Medical", value.target.value);
                  checkMedicalCertificateNo();
                }}
                error={!!errors.medicalCertificateNo}
                helperText={
                  errors?.medicalCertificateNo
                    ? errors.medicalCertificateNo.message
                    : null
                }
              />
            )}
            name="venue"
            control={control}
            defaultValue=""
          />
        </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            // InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="currentAddress" required />}
            {...register("cAddress")}
            error={!!errors.cAddress}
            helperText={errors?.cAddress ? errors.cAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            // disabled
            defaultValue={"Pimpri Chinchwad"}
            label={<FormattedLabel id="cityName" required />}
            {...register("cCityName")}
            error={!!errors.cCityName}
            helperText={errors?.cCityName ? errors.cCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            defaultValue={"Maharashtra"}
            label={<FormattedLabel id="state" required />}
            {...register("cState")}
            error={!!errors.cState}
            helperText={errors?.cState ? errors.cState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            // InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="currentAddressMr" />}
            {...register("addressMr")}
            error={!!errors.cAddress}
            helperText={errors?.cAddress ? errors.cAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            // disabled
            defaultValue={"Pimpri Chinchwad"}
            label={<FormattedLabel id="cityNamemr" />}
            {...register("cCityNameMr")}
            error={!!errors.cCityName}
            helperText={errors?.cCityName ? errors.cCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            // disabled
            defaultValue={"Maharashtra"}
            label={<FormattedLabel id="stateMr" />}
            // label="State"
            {...register("cStateMr")}
            error={!!errors.cState}
            helperText={errors?.cState ? errors.cState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 6 }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" required />}
            {...register("cPincode")}
            error={!!errors.cPincode}
            helperText={errors?.cPincode ? errors.cPincode.message : null}
          />

          {/* <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
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
          </FormControl> */}
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="Lattitude" required />}
            {...register("cLattitude")}
            error={!!errors.cLattitude}
            helperText={errors?.cLattitude ? errors.cLattitude.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="Longitute" required />}
            {...register("cLongitude")}
            error={!!errors.cLongitude}
            helperText={errors?.cLongitude ? errors.cLongitude.message : null}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography>
                <b>
                  <FormattedLabel id="checkBox" />
                </b>
              </Typography>
            }
            {...register("addressCheckBox")}
            onChange={(e) => {
              setValue("addressCheckBox", e.target.checked);
              addressChange(e);
              clearErrors("addressCheckBox");
            }}
          />
        </Grid> */}

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={
              <Controller
                name="addressCheckBox"
                control={control}
                defaultValue={false}
                render={({ field: { value, ref, ...field } }) => (
                  <Checkbox
                    // disabled={watch("disabledFieldInputState")}
                    disabled={readOnly}
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
            }
            label={<b>{<FormattedLabel id="checkBox" required />}</b>}
            labelPlacement="end"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddress" required />}
            {...register("pAddress")}
            error={!!errors.pAddress}
            helperText={errors?.pAddress ? errors.pAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityName" required />}
            variant="standard"
            {...register("pCityName")}
            error={!!errors.pCityName}
            helperText={errors?.pCityName ? errors.pCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="state" required />}
            variant="standard"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddressMarathi" />}
            {...register("pAddressMr")}
            error={!!errors.pAddressMr}
            helperText={errors?.pAddressMr ? errors.pAddressMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityNameMr" required />}
            variant="standard"
            {...register("pCityNameMr")}
            error={!!errors.pCityNameMr}
            helperText={errors?.pCityNameMr ? errors.pCityNameMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="stateMr" required />}
            // label="State"
            variant="standard"
            {...register("pStateMr")}
            error={!!errors.pStateMr}
            helperText={errors?.pStateMr ? errors.pStateMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly || checkAddress}
            InputLabelProps={{ shrink: addressShrink }}
            inputProps={{ maxLength: 6 }}
            id="standard-basic"
            label={<FormattedLabel id="pinCode" required />}
            {...register("pPincode")}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? errors.pPincode.message : null}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={
              <Controller
                name="addressCheckBox"
                control={control}
                defaultValue={false}
                render={({ field: { value, ref, ...field } }) => (
                  <Checkbox
                    // disabled={watch("disabledFieldInputState")}
                    disabled={readOnly}
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
            }
            label={<b>{<FormattedLabel id="checkBox" required />}</b>}
            labelPlacement="end"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddress" required />}
            {...register("pAddress")}
            error={!!errors.pAddress}
            helperText={errors?.pAddress ? errors.pAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityName" required />}
            variant="standard"
            {...register("pCityName")}
            error={!!errors.pCityName}
            helperText={errors?.pCityName ? errors.pCityName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="state" required />}
            variant="standard"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddressMarathi" />}
            {...register("pAddressMr")}
            error={!!errors.pAddressMr}
            helperText={errors?.pAddressMr ? errors.pAddressMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityNameMr" required />}
            variant="standard"
            {...register("pCityNameMr")}
            error={!!errors.pCityNameMr}
            helperText={errors?.pCityNameMr ? errors.pCityNameMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="stateMr" required />}
            // label="State"
            variant="standard"
            {...register("pStateMr")}
            error={!!errors.pStateMr}
            helperText={errors?.pStateMr ? errors.pStateMr.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: addressShrink }}
            inputProps={{ maxLength: 6 }}
            id="standard-basic"
            label={<FormattedLabel id="pinCode" required />}
            {...register("pPincode")}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? errors.pPincode.message : null}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="Lattitude" required />}
            variant="standard"
            {...register("pLattitude")}
            error={!!errors.pLattitude}
            helperText={errors?.pLattitude ? "Pin Code  is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="Longitute" required />}
            variant="standard"
            {...register("pLongitude")}
            error={!!errors.pLongitude}
            helperText={errors?.pLongitude ? "Pin Code  is Required !!!" : null}
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default PersonalDetails;
