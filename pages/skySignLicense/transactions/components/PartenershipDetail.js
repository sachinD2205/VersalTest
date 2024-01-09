import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Button,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
  Modal,
  Paper,
  Box,
  Checkbox,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import OtpInput from "react-otp-input";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// http://localhost:4000/hawkerManagementSystem/transactions/components/HawkerDetails
const PartenershipDetail = (props) => {
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const language = useSelector((state) => state?.labels.language);
  const [applicantIndex, setApplicantIndex] = useState(null);

  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [addPartnerDisable, setAddPartnerDisable] = useState(true);

  const userToken = useGetToken();
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

  useEffect(() => {
    console.log("abc12345", router.query);
    // if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
    //   setDisabled(false)
    // } else {
    //   setDisabled(true)
    // }
    if (router.query.disabled) {
      setDisabled(true);
    } else if (props.disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);

  // Titles
  const [titles, setTitles] = useState([]);
  const [count, setCount] = useState(0);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            titleEn: row.title,
            titleMar: row.titleMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            genderEn: row.gender,
            genderMar: row.genderMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
  }, []);

  // useEffect(() => {
  //   if (watch('partnerCheckBox')) {
  //     console.log("hojaye", watch('partnerCheckBox'));
  //     append({
  //       pttitle: "",
  //       ptfname: "",
  //       ptmname: "",
  //       ptlname: "",
  //       ptgender: "",
  //       ptdateofBirth: "",
  //       age: "",
  //       ptmobile: "",
  //       ptemail: "",
  //       ptaadharNo: "",
  //       generateOTPBtn: "",
  //       enterotp: "",
  //       validateOTPBtn: "",
  //       ptPropertyTaxNumber: "",
  //       ptcity: "",
  //       ptpincode: "",
  //       ptroadName: "",
  //       ptvillage: "",
  //     })
  //   }
  // }, [watch('partnerCheckBox')])

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "trnPartnerDao", // unique name for your Field Array
    }
  );

  const [partenrshipAddBtn, setPartenrshipAddBtn] = useState(false);
  // if (fields.length == 2) {
  //   setPartenrshipAddBtn(true);
  // }

  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);
  console.log();

  // useEffect(() => {
  //   console.log("applicantIndex", applicantIndex, watch("trnPartnerDao").length - 1)
  // }, [applicantIndex])

  useEffect(() => {
    if (watch("addPartnerCheckBox") == true) {
      setAddPartnerDisable(false);
    } else if (watch("addPartnerCheckBox") == false) {
      setAddPartnerDisable(true);
    }
  }, [watch("trnPartnerDao"), count, watch("addPartnerCheckBox")]);

  return (
    <>
      {count == "0" ? (
        <Grid
          // container
          // sx={{ marginLeft: 5, marginBottom: 10, align: "center" }}
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{
            marginTop: "1vh",
            marginLeft: "5vh",
            justifyContent: "center",
          }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="addPartnerCheckBox"
                  control={control}
                  defaultValue={false}
                  render={({ field: { value, ref, ...field } }) => (
                    <Checkbox
                      disabled={disabled}
                      {...field}
                      inputRef={ref}
                      checked={!!value}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("addPartnerCheckBox", true);
                        } else {
                          setValue("addPartnerCheckBox", false);
                        }
                        console.log("checked1", e.target.checked);
                        // console.log("checked2",getValues("addressCheckBox"))
                      }}

                      // disableRipple
                    />
                  )}
                />
              }
              label=<Typography>
                <b>{<FormattedLabel id="addPartnerCheckBoxTitle" />}</b>
              </Typography>
              labelPlacement="End"
            />
          </Grid>
        </Grid>
      ) : (
        ""
      )}
      {fields.map((parteners, index) => {
        return (
          <div key={index}>
            {/* <Grid
              container
              sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
            >
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography>{`Parteners ${index + 1}`}</Typography>
              </Grid>

            </Grid> */}
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
              {/* <div className={styles.row}> */}
              {/* <Typography>{`Partners ${index + 1}`}</Typography> */}
              {<FormattedLabel id="Parteners" />}&nbsp;{index + 1}
              {/* </div> */}
            </div>

            {/* 2nd row */}

            {/* {count == "0" && <>

              <div className={styles.row} style={{ marginTop: 50 }}>  <FormControlLabel
                control={
                  <Controller
                    name={`trnPartnerDao.${index}.partnerCheckBox`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { value, ref, ...field } }) => (
                      <Checkbox
                        disabled={disabled}
                        {...field}
                        inputRef={ref}
                        checked={!!watch(`trnPartnerDao.${index}.partnerCheckBox`)}
                        onChange={(e) => {
                          console.log("12cha", e.target.checked)
                          if (e.target.checked) {
                            setValue(`trnPartnerDao.${index}.partnerCheckBox`, true);
                            setValue(`trnPartnerDao.${index}.pttitle`, watch('title'))
                            setValue(`trnPartnerDao.${index}.ptfname`, watch('firstName'))
                            setValue(`trnPartnerDao.${index}.ptmname`, watch('middleName'))
                            setValue(`trnPartnerDao.${index}.ptlname`, watch('lastName'))
                            setValue(`trnPartnerDao.${index}.ptgender`, watch('gender'))
                            // setValue(`trnPartnerDao.${index}.ptdateOfBirth`,watch('title'))
                            // setValue(`trnPartnerDao.${index}.ptage`,watch('title'))
                            setValue(`trnPartnerDao.${index}.ptmobile`, watch('mobile'))
                            setValue(`trnPartnerDao.${index}.ptaadharNo`, watch('aadhaarNo'))
                            setValue(`trnPartnerDao.${index}.ptemail`, watch('emailAddress'))
                            setValue(`trnPartnerDao.${index}.ptPropertyTaxNumber`, watch('crPropertyTaxNumber'))
                            setValue(`trnPartnerDao.${index}.ptroadName`, watch('crAreaName'))
                            setValue(`trnPartnerDao.${index}.ptvillage`, watch('crVillageName'))
                            setValue(`trnPartnerDao.${index}.ptcity`, watch('crCityName'))
                            setValue(`trnPartnerDao.${index}.ptpincode`, watch('crPincode'))

                            setCount(1)
                          }
                          else {
                            setValue(`trnPartnerDao.${index}.partnerCheckBox`, false);
                            setValue(`trnPartnerDao.${index}.pttitle`, "")
                            setValue(`trnPartnerDao.${index}.ptfname`, "")
                            setValue(`trnPartnerDao.${index}.ptmname`, "")
                            setValue(`trnPartnerDao.${index}.ptlname`, "")
                            setValue(`trnPartnerDao.${index}.ptgender`, "")
                            // setValue(`trnPartnerDao.${index}.ptdateOfBirth`,watch('title'))
                            // setValue(`trnPartnerDao.${index}.ptage`,watch('title'))
                            setValue(`trnPartnerDao.${index}.ptmobile`, "")
                            setValue(`trnPartnerDao.${index}.ptaadharNo`, "")
                            setValue(`trnPartnerDao.${index}.ptemail`, "")
                            setValue(`trnPartnerDao.${index}.ptPropertyTaxNumber`, "")
                            setValue(`trnPartnerDao.${index}.ptroadName`, "")
                            setValue(`trnPartnerDao.${index}.ptvillage`, "")
                            setValue(`trnPartnerDao.${index}.ptcity`, "")
                            setValue(`trnPartnerDao.${index}.ptpincode`, "")
                            setCount(0)
                          }
                        }}
                      />
                    )}
                  />
                }
                label={<Typography>
                  <b>{<FormattedLabel id="applicantPartner" />}</b>
                </Typography>}
                labelPlacement="End"
              />


              </div>
            </>}




            {(count == "1" && watch(`trnPartnerDao.${index}.partnerCheckBox`) == true) && <>

              <div className={styles.row} style={{ marginTop: 50 }}>  <FormControlLabel
                control={
                  <Controller
                    name={`trnPartnerDao.${index}.partnerCheckBox`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { value, ref, ...field } }) => (
                      <Checkbox
                        disabled={disabled}
                        {...field}
                        inputRef={ref}
                        checked={!!watch(`trnPartnerDao.${index}.partnerCheckBox`)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValue(`trnPartnerDao.${index}.partnerCheckBox`, true);
                            setValue(`trnPartnerDao.${index}.pttitle`, watch('title'))
                            setValue(`trnPartnerDao.${index}.ptfname`, watch('firstName'))
                            setValue(`trnPartnerDao.${index}.ptmname`, watch('middleName'))
                            setValue(`trnPartnerDao.${index}.ptlname`, watch('lastName'))
                            setValue(`trnPartnerDao.${index}.ptgender`, watch('gender'))
                            // setValue(`trnPartnerDao.${index}.ptdateOfBirth`,watch('title'))
                            // setValue(`trnPartnerDao.${index}.ptage`,watch('title'))
                            setValue(`trnPartnerDao.${index}.ptmobile`, watch('mobile'))
                            setValue(`trnPartnerDao.${index}.ptaadharNo`, watch('aadhaarNo'))
                            setValue(`trnPartnerDao.${index}.ptemail`, watch('emailAddress'))
                            setValue(`trnPartnerDao.${index}.ptPropertyTaxNumber`, watch('crPropertyTaxNumber'))
                            setValue(`trnPartnerDao.${index}.ptroadName`, watch('crAreaName'))
                            setValue(`trnPartnerDao.${index}.ptvillage`, watch('crVillageName'))
                            setValue(`trnPartnerDao.${index}.ptcity`, watch('crCityName'))
                            setValue(`trnPartnerDao.${index}.ptpincode`, watch('crPincode'))
                          }
                          else {
                            setValue(`trnPartnerDao.${index}.partnerCheckBox`, false);
                            setValue(`trnPartnerDao.${index}.pttitle`, "")
                            setValue(`trnPartnerDao.${index}.ptfname`, "")
                            setValue(`trnPartnerDao.${index}.ptmname`, "")
                            setValue(`trnPartnerDao.${index}.ptlname`, "")
                            setValue(`trnPartnerDao.${index}.ptgender`, "")
                            // setValue(`trnPartnerDao.${index}.ptdateOfBirth`,watch('title'))
                            // setValue(`trnPartnerDao.${index}.ptage`,watch('title'))
                            setValue(`trnPartnerDao.${index}.ptmobile`, "")
                            setValue(`trnPartnerDao.${index}.ptaadharNo`, "")
                            setValue(`trnPartnerDao.${index}.ptemail`, "")
                            setValue(`trnPartnerDao.${index}.ptPropertyTaxNumber`, "")
                            setValue(`trnPartnerDao.${index}.ptroadName`, "")
                            setValue(`trnPartnerDao.${index}.ptvillage`, "")
                            setValue(`trnPartnerDao.${index}.ptcity`, "")
                            setValue(`trnPartnerDao.${index}.ptpincode`, "")
                            setCount(0)
                          }
                        }}
                      />
                    )}
                  />
                }
                label={<Typography>
                  <b>{<FormattedLabel id="applicantPartner" />}</b>
                </Typography>}
                labelPlacement="End"
              />


              </div>
            </>} */}

            <Grid
              // container
              // sx={{
              //   marginLeft: 5,
              //   marginTop: 2,
              //   marginBottom: 5,
              //   align: "center",
              // }}
              container
              spacing={1}
              // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
              style={{ marginTop: "1vh", marginLeft: "5vh" }}
              columns={12}
            >
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <FormControl error={!!errors.pttitle} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="title" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        // autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Title *"
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles.map((pttitle, index) => (
                            <MenuItem key={index} value={pttitle.id}>
                              {pttitle.pttitle}
                              {language == "en"
                                ? pttitle?.titleEn
                                : pttitle?.titleMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`trnPartnerDao.${index}.pttitle`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.pttitle ? errors.pttitle.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptfname`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="fname"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptfname`)}
                  error={!!errors.ptfname}
                  helperText={errors?.ptfname ? errors.ptfname.message : null}
                />
              </Grid>

              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptmname`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label={<FormattedLabel id="mname"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptmname`)}
                  error={!!errors.ptmname}
                  helperText={errors?.ptmname ? errors.ptmname.message : null}
                />
              </Grid>

              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptlname`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label={<FormattedLabel id="lname"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptlname`)}
                  error={!!errors.ptlname}
                  helperText={errors?.ptlname ? errors.ptlname.message : null}
                />
              </Grid>

              {/* 3nd row */}
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <FormControl
                  variant="standard"
                  // sx={{ m: 3, minWidth: 125 }}
                  error={!!errors.ptgender}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="gender"></FormattedLabel>}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        // sx={{ width: 250 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {genders &&
                          genders.map((ptgender, index) => (
                            <MenuItem key={index} value={ptgender.id}>
                              {ptgender.ptgender}

                              {language == "en"
                                ? ptgender?.genderEn
                                : ptgender?.genderMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`trnPartnerDao.${index}.ptgender`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.ptgender ? errors.ptgender.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <FormControl style={{ marginTop: 5 }}>
                  <Controller
                    control={control}
                    name={`trnPartnerDao.${index}.ptdateOfBirth`}
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={disabled}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16, marginTop: 2 }}>
                              {<FormattedLabel id="dateOfBirth" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                            // let date1 = moment(date).format("YYYY-MM-DD");
                            // setValue(
                            //   `trnPartnerDao.${index}.ptage`,
                            //   Math.floor(moment().format("YYYY-MM-DD") - date1),
                            // );

                            let date2 = moment(new Date()).format("YYYY-MM-DD");
                            let date1 = moment(date).format("YYYY-MM-DD");

                            let temp = moment.duration(
                              moment(date2).diff(moment(date1))
                            );

                            // setValue(
                            //   "age",
                            //   Math.floor(moment().format("YYYY") - date1),
                            // );
                            setValue(
                              `trnPartnerDao.${index}.ptage`,
                              Number(temp.years())
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
                </FormControl>
              </Grid>

              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label={<FormattedLabel id="age"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptage`)}
                  // {...register("age")}
                  error={!!errors.age}
                  helperText={errors?.age ? errors.age.message : null}
                />
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptmobile`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="mobile"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptmobile`)}
                  error={!!errors.ptmobile}
                  helperText={errors?.ptmobile ? errors.ptmobile.message : null}
                />
              </Grid>

              {/* 4th row */}
              {!disabled ? (
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <TextField
                    disabled={disabled}
                    sx={{ width: 200 }}
                    InputLabelProps={{
                      shrink:
                        (watch(`trnPartnerDao.${index}.ptaadharNo`)
                          ? true
                          : false) || (router.query.wardKey ? true : false),
                    }}
                    id="standard-basic"
                    label={<FormattedLabel id="aadharNo"></FormattedLabel>}
                    variant="standard"
                    key={parteners.id}
                    {...register(`trnPartnerDao.${index}.ptaadharNo`)}
                    error={!!errors.ptaadharNo}
                    helperText={
                      errors?.ptaadharNo ? errors.ptaadharNo.message : null
                    }
                  />
                </Grid>
              ) : (
                ""
              )}
              {/* {!disabled ? (
                < Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <FormControl style={{ marginTop: 25 }}>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      // endIcon={<ClearIcon />}
                      onClick={() => otpModalOpen()}
                    >
                      {<FormattedLabel id="sendOTP"></FormattedLabel>}
                    </Button>
                  </FormControl>
                </Grid>
              ) : ""} */}
              {/* {!disabled ? (
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <TextField
                    disabled={disabled}
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={<FormattedLabel id="enterotp"></FormattedLabel>}
                    variant="standard"
                    key={parteners.id}
                    {...register(`trnPartnerDao.${index}.enterotp`)}
                    // {...register("enterotp")}
                    error={!!errors.enterotp}
                    helperText={errors?.enterotp ? errors.enterotp.message : null}
                  />
                </Grid>
              ) : ""} */}
              {/* {!disabled ? (
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                  <FormControl style={{ marginTop: 25 }}>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      // endIcon={<ClearIcon />}
                      onClick={() => otpModalOpen()}
                    >
                      {<FormattedLabel id="oTPVERIFICATION"></FormattedLabel>}
                    </Button>
                  </FormControl>
                </Grid>
              ) : ""} */}
              {/* 5th row */}

              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 200 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptemail`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="email"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptemail`)}
                  error={!!errors.ptemail}
                  helperText={errors?.ptemail ? errors.ptemail.message : null}
                />
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  id="standard-basic"
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptPropertyTaxNumber`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  label={<FormattedLabel id="crPropertyTaxNumber" />}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptPropertyTaxNumber`)}
                  error={!!errors.ptPropertyTaxNumber}
                  helperText={
                    errors?.ptPropertyTaxNumber
                      ? errors.ptPropertyTaxNumber.message
                      : null
                  }
                />
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptroadName`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="roadName"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptroadName`)}
                  error={!!errors.ptroadName}
                  helperText={
                    errors?.ptroadName ? errors.ptroadName.message : null
                  }
                />
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptvillage`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="crVillageName"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptvillage`)}
                  error={!!errors.ptvillage}
                  helperText={
                    errors?.ptvillage ? errors.ptvillage.message : null
                  }
                />
              </Grid>
              {/* {6 th row} */}
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptcity`) ? true : false) ||
                      (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="crCityName"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptcity`)}
                  error={!!errors.ptcity}
                  helperText={errors?.ptcity ? errors.ptcity.message : null}
                />
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  InputLabelProps={{
                    shrink:
                      (watch(`trnPartnerDao.${index}.ptpincode`)
                        ? true
                        : false) || (router.query.wardKey ? true : false),
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="crPincode"></FormattedLabel>}
                  variant="standard"
                  key={parteners.id}
                  {...register(`trnPartnerDao.${index}.ptpincode`)}
                  error={!!errors.ptpincode}
                  helperText={
                    errors?.ptpincode ? errors.ptpincode.message : null
                  }
                />
              </Grid>
            </Grid>
            {!disabled ? (
              <div className={styles.row} style={{ marginTop: 50 }}>
                <Button
                  onClick={() => {
                    setCount(count - 1);

                    if (
                      count == "1" &&
                      watch(`trnPartnerDao.${index}.partnerCheckBox`) == true
                    ) {
                      setCount(count - 1);
                    }
                    remove(index);
                  }}
                  variant="contained"
                >
                  {/* Remove Partener */}
                  {<FormattedLabel id="removePartner"></FormattedLabel>}
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}

      {!disabled ? (
        <>
          {/* <div className={styles.row} style={{ marginTop: 50 }}>

              <FormControlLabel
                control={
                  <Controller
                    name="partnerCheckBox"
                    control={control}
                    defaultValue={false}
                    render={({ field: { value, ref, ...field } }) => (
                      <Checkbox
                        disabled={disabled}
                        {...field}
                        inputRef={ref}
                        checked={!!value}
                        onChange={(e) => {
                          setValue("partnerCheckBox", e.target.checked);
                          // addressChange(e);
                          console.log("checked1", e.target.checked);
                        }}

                      // disableRipple
                      />
                    )}
                  />
                }
                label={<Typography>
                  <b>{<FormattedLabel id="applicantPartner" />}</b>
                </Typography>}
                labelPlacement="End"
              />
            </div> */}
          <div className={styles.row} style={{ marginTop: 50 }}>
            <Button
              disabled={addPartnerDisable}
              onClick={() => {
                append({
                  pttitle: "",
                  ptfname: "",
                  ptmname: "",
                  ptlname: "",
                  ptgender: "",
                  ptdateofBirth: "",
                  age: "",
                  ptmobile: "",
                  ptemail: "",
                  ptaadharNo: "",
                  generateOTPBtn: "",
                  enterotp: "",
                  validateOTPBtn: "",
                  ptPropertyTaxNumber: "",
                  ptcity: "",
                  ptpincode: "",
                  ptroadName: "",
                  ptvillage: "",
                });
                setCount(count + 1);
              }}
              variant="contained"
            >
              {/* Add Partener */}
              {<FormattedLabel id="partener"></FormattedLabel>}
            </Button>
          </div>
        </>
      ) : (
        ""
      )}

      <Modal
        open={otpModal}
        onClose={() => otpModalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            height: "400px",
            width: "600px",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
          }}
          component={Box}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "underline",
            }}
            display="inline"
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            {/* <strong> OTP VERIFICATION</strong> */}
            {<FormattedLabel id="oTPVERIFICATION"></FormattedLabel>}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <strong> 6 digit OTP is sent to your registered number </strong>
          </Typography>{" "}
          <br />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Controller
              render={({ field }) => (
                <OtpInput
                  inputStyle={{ width: "4em", height: "4em" }}
                  numInputs={6}
                  isInputNum
                  //maxLength={4}
                  otpType={true}
                  value={field.value}
                  onChange={(data) => field.onChange(data)}
                  separator={<span> - </span>}
                />
              )}
              name="aadharOtp"
              control={control}
              //defaultValue=''
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "3vh",
                // width: "250px",
                // height: "50px",

                onHover: "primary",

                ":hover": {
                  bgcolor: "primary.main", // theme.palette.primary.main
                  color: "white",
                },
              }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                sweetAlert("Verified Successfully");
                // setIsOpenCollapse("true");
              }}
            >
              VERIFY OTP
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // marginTop: "1vh",
                // width: "250px",
                // height: "50px",

                onHover: "secondary",

                ":hover": {
                  bgcolor: "secondary.main", // theme.palette.primary.main
                  color: "white",
                },
              }}
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => {
                sweetAlert("Resend OTP Successfully");
                // setIsOpenCollapse("true");
              }}
            >
              Resend OTP
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2vh",
                bgcolor: "error.main",
                width: "80px",
                height: "30px",

                onHover: "primary",

                ":hover": {
                  bgcolor: "error.main", // theme.palette.primary.main
                  color: "white",
                },
              }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => otpModalClose()}
            >
              BACK
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};
export default PartenershipDetail;
