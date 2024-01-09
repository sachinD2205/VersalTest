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
  Typography,
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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import styles from "../../../../styles/sportsPortalStyles/view.module.css";
import URLS from "../../../../URLS/urls";
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

  // Titles
  const [titles, setTitles] = useState([]);
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);
  const [checkAddress, setCheckAddress] = useState(false);
  const [addressShrink, setAddressShrink] = useState();
  const token = useSelector((state) => state.user.user.token);
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

  // Gender
  const [genders, setGenders] = useState([]);

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
  useEffect(() => {
    if (
      watch("title") != null &&
      watch("title") != undefined &&
      genders.length != 0
    ) {
      console.log("878", watch("title"));
      filtredGender();
    }
  }, [watch("title"), genders]);
  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  // const getCrPinCodes = () => {
  //   axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
  //     setCrPinCodes(
  //       r.data.pinCode.map((row) => ({
  //         id: row.id,
  //         crPincode: row.pinCode,
  //       })),
  //     );
  //   });
  // };

  const user = useSelector((state) => state?.user.user);
  const userId = useSelector((state) => state?.user.user.id);

  const checkMedicalCertificateNo = () => {
    // let user = watch("user");

    // if (user != null && user != undefined && user != "") {
    axios
      // .get(`${URLS.SPURL}/swimmingBookingMonthly/getByUserId?userId=${userId}`)
      .get(
        `${
          URLS.SPURL
        }/gymBooking/getByCreatedUserIdAndService?createdUserId=${userId}&service=${36}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("res");
        if (res?.status == 200 || res?.status == 201) {
          // console.log("56456", watch("medicalCertificate"));
          // console.log("shgdcshg", res?.data?.medicalCertificate);
          // setValue("medicalCertificate", res?.data?.medicalCertificate);
        } else {
          console.log("Not Valid", res?.data?.medicalCertificate);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  useEffect(() => {
    getTitles();

    if (router.query.pageMode === "Add") {
      setValue("title", user.title);
      setValue("firstName", user.firstName);
      setValue("middleName", user.middleName);
      setValue("lastName", user.surname);
      setValue("firstNameMr", user.firstNamemr);
      setValue("middleNameMr", user.middleNamemr);
      setValue("lastNameMr", user.surnamemr);
      setValue("gender", user.gender);
      setValue("dateOfBirth", user.dateOfBirth);
      let date = moment(user.dateOfBirth).format("YYYY-MM-DD");
      let today = new Date();
      let dob = new Date(date);
      var age = today.getFullYear() - dob.getFullYear();
      setValue("age", age);
      setValue("cState", "Maharashtra");
      // setValue('dateOfBirth', user.dateOfBirth)
      setValue("mobileNo", user.mobile);
      setValue("emailAddress", user.emailID);
      setValue(
        "cAddress",
        user.cflatBuildingNo +
          "," +
          user.cbuildingName +
          "," +
          user.croadName +
          "," +
          user.clandmark
      );

      setValue(
        "addressMr",
        user.cflatBuildingNo +
          "," +
          user.cbuildingNameMr +
          "," +
          user.croadNameMr +
          ","
        // +
        // user.clandmarkMr
      );
      console.log("6757", getValues("addressMr"));

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

  // useEffect(() => {
  //   getTitles();

  //   if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
  //     // setValue("firstName", getValues("user.firstName"));
  //     // setValue("pState", getValues("cState"));

  //     setValue("title", user.title);
  //     setValue("firstName", user.firstName);
  //     setValue("middleName", user.middleName);
  //     setValue("lastName", user.surname);
  //     setValue("gender", user.gender);
  //     // setValue('dateOfBirth', user.dateOfBirth)
  //     setValue("mobileNo", user.mobile);
  //     setValue("emailAddress", user.emailID);

  //     setValue(
  //       "cAddress",
  //       user.cflatBuildingNo + "," + user.cbuildingName + "," + user.croadName + "," + user.clandmark,
  //     );
  //     setValue("cCityName", user.ccity);
  //     setValue("cPincode", user.cpinCode);
  //   }
  // }, [user]);

  // const addressChange = (e) => {
  //   console.log("Clicked");
  //   // if (e.target.checked) {
  //   if (e.target.checked == true) {
  //     setValue("pCityName", getValues("cCityName"));
  //     setValue("pState", getValues("cState"));
  //     setValue("pPincode", getValues("cPincode"));
  //     setValue("pAddress", getValues("cAddress"));
  //     setValue("pLattitude", getValues("cLattitude"));
  //     setValue("pLongitude", getValues("cLongitude"));
  //     setValue("pLongitude", getValues("cLongitude"));
  //     setValue("pStateMr", getValues("cStateMr"));
  //     setValue("pCityNameMr", getValues("cCityNameMr"));
  //     setValue("pAddress", getValues("addressMr"));

  //     clearErrors("pCityName");
  //     clearErrors("pState");
  //     clearErrors("pPincode");
  //     clearErrors("pAddress");
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
  //     setValue("pLongitude", "");
  //     setValue("pLongitude", "");
  //     clearErrors("pCityName");
  //     clearErrors("pState");
  //     clearErrors("pPincode");
  //     clearErrors("pAddress");
  //     clearErrors("pLattitude");
  //     clearErrors("pLongitude");
  //     clearErrors("pLongitude");
  //     setAddressShrink(false);
  //     setAddressShrink();
  //   }
  // };

  const addressChange = (e) => {
    console.log("Clicked");
    // if (e.target.checked) {
    if (e.target.checked == true) {
      setValue("pCityName", getValues("cCityName"));
      setValue("pState", getValues("cState"));
      setValue("pPincode", getValues("cPincode"));
      setValue("pAddress", getValues("cAddress"));
      setValue("pLattitude", getValues("cLattitude"));
      setValue("pLongitude", getValues("cLongitude"));
      setValue("pLongitude", getValues("cLongitude"));
      setValue("pStateMr", getValues("cStateMr"));
      setValue("pCityNameMr", getValues("cCityNameMr"));
      // setValue("pAddress", getValues("addressMr"));
      setValue("pAddressMr", getValues("addressMr"));

      clearErrors("pAddress");
      clearErrors("pCityName");
      clearErrors("pState");
      clearErrors("pPincode");
      clearErrors("pAddress");
      clearErrors("pLattitude");
      clearErrors("pLongitude");
      clearErrors("pLongitude");
      clearErrors("pAddressMr");
      clearErrors("pCityNameMr");
      clearErrors("pStateMr");
      setAddressShrink(true);
      setCheckAddress(true);

      // pStateMr
      // pCityNameMr
    } else {
      setCheckAddress(false);

      setValue("pCityName", "");
      setValue("pState", "");
      setValue("pPincode", "");
      setValue("pAddress", "");
      setValue("pLattitude", "");
      setValue("pAddressMr", "");
      setValue("pCityNameMr", "");
      setValue("pStateMr", "");

      clearErrors("pAddress");
      clearErrors("pCityName");
      clearErrors("pState");
      clearErrors("pPincode");
      clearErrors("pAddressMr");
      clearErrors("pLattitude");
      clearErrors("pLongitude");
      clearErrors("pLongitude");
      clearErrors("pCityNameMr");
      clearErrors("pStateMr");
      setAddressShrink(false);
      setAddressShrink();
    }
  };
  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    // getCrPinCodes();
  }, []);

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
          <FormControl
            // disabled={readOnly}
            disabled
            error={!!errors.title}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" required />
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
          <FormControl disabled sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
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
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
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
        </Grid> */}
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
                        <FormattedLabel id="dateOfBirth" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      // let date1 = moment(date).format('YYYYMMDD');
                      let today = new Date();
                      let dob = new Date(date);
                      var age = today.getFullYear() - dob.getFullYear();
                      // setValue(`groupDetails.${index}.age`, age);
                      setValue("age", age);
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
            id="standard-basic"
            inputProps={{ maxLength: 12 }}
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
                      // let today = new Date();
                      // let dob = new Date(date);
                      // var age = today.getFullYear() - dob.getFullYear();
                      // setValue("age", age);
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
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid> */}
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

          {/* <Transliteration
            _key={"cAddress"}
            labelName={"currentAddress"}
            fieldName={"cAddress"}
            updateFieldName={"addressMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            variant="standard"
            sx={{ width: 200 }}
            label={<FormattedLabel id="currentAddress" required />}
            InputLabelProps={{
              shrink: watch("cAddress") ? true : false,
            }}
            error={!!errors.cAddress}
            helperText={errors?.cAddress ? errors.cAddress.message : null}
          /> */}
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
            // disabled
            defaultValue={"Maharashtra"}
            label={<FormattedLabel id="state" required />}
            // label="State"
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
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" required />}
            {...register("cPincode")}
            error={!!errors.cPincode}
            helperText={errors?.cPincode ? errors.cPincode.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormControlLabel
            control={
              <Controller
                name="addressCheckBox"
                control={control}
                defaultValue={false}
                render={({ field: { value, ref, ...field } }) => (
                  <Checkbox
                    disabled={readOnly}
                    // disabled={watch("disabledFieldInputState")}
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
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Controller
            name="addressCheckBox"
            control={control}
            defaultValue={false}
            render={({ field: { value, ref, ...field } }) => (
              <Checkbox
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
        
          <b> {<FormattedLabel id="checkBox" />}</b>
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
              console.log("checked1", e.target.checked);
            }}
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddress" required />}
            {...register("pAddress")}
            error={!!errors.pAddress}
            helperText={errors?.pAddress ? errors.pAddress.message : null}
          /> */}

          <Transliteration
            _key={"pAddress"}
            labelName={"permanentAddress"}
            fieldName={"pAddress"}
            disabled={readOnly || checkAddress}
            updateFieldName={"pAddressMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            width={240}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="permanentAddress" required />}
            InputLabelProps={{
              shrink: addressShrink,
            }}
            error={!!errors.pAddress}
            targetError={"pAddressMr"}
            helperText={errors?.pAddress ? errors.pAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Transliteration
            _key={"pCityName"}
            labelName={"cityName"}
            fieldName={"pCityName"}
            disabled={readOnly || checkAddress}
            updateFieldName={"pCityNameMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            width={240}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="cityName" required />}
            InputLabelProps={{
              shrink: addressShrink,
            }}
            error={!!errors.pCityName}
            targetError={"pCityNameMr"}
            helperText={errors?.pCityName ? errors.pCityName.message : null}
          />
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityName" required />}
            variant="standard"
            {...register("pCityName")}
            error={!!errors.pCityName}
            helperText={errors?.pCityName ? errors.pCityName.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Transliteration
            _key={"pState"}
            labelName={"state"}
            fieldName={"pState"}
            disabled={readOnly || checkAddress}
            updateFieldName={"pStateMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            width={240}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="state" required />}
            InputLabelProps={{
              shrink: addressShrink,
            }}
            error={!!errors.pState}
            targetError={"pStateMr"}
            helperText={errors?.pState ? errors.pState.message : null}
          />
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="state" required />}
            variant="standard"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          /> */}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Transliteration
            _key={"pAddressMr"}
            labelName={"permanentAddressMarathi"}
            fieldName={"pAddressMr"}
            updateFieldName={"pAddress"}
            sourceLang={"mar"}
            targetLang={"eng"}
            width={240}
            disabled={readOnly || checkAddress}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="permanentAddressMarathi" required />}
            InputLabelProps={{ shrink: addressShrink }}
            error={!!errors.pAddressMr}
            targetError={"pAddress"}
            helperText={errors?.pAddressMr ? errors.pAddressMr.message : null}
          />
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="permanentAddressMarathi" required />}
            {...register("pAddressMr")}
            error={!!errors.pAddressMr}
            helperText={errors?.pAddressMr ? errors.pAddressMr.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Transliteration
            _key={"pCityNameMr"}
            labelName={"cityNameMr"}
            fieldName={"pCityNameMr"}
            disabled={readOnly || checkAddress}
            updateFieldName={"pCityName"}
            sourceLang={"mar"}
            targetLang={"eng"}
            width={240}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="cityNameMr" required />}
            InputLabelProps={{
              shrink: addressShrink,
            }}
            error={!!errors.pCityNameMr}
            targetError={"pCityName"}
            helperText={errors?.pCityNameMr ? errors.pCityNameMr.message : null}
          />
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="cityNameMr" required />}
            variant="standard"
            {...register("pCityNameMr")}
            error={!!errors.pCityNameMr}
            helperText={errors?.pCityNameMr ? errors.pCityNameMr.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Transliteration
            _key={"pStateMr"}
            labelName={"stateMr"}
            fieldName={"pStateMr"}
            disabled={readOnly || checkAddress}
            updateFieldName={"pState"}
            sourceLang={"mar"}
            targetLang={"eng"}
            width={240}
            variant="standard"
            // sx={{ width: 220 }}
            label={<FormattedLabel id="stateMr" required />}
            InputLabelProps={{
              shrink: addressShrink,
            }}
            error={!!errors.pStateMr}
            targetError={"pState"}
            helperText={errors?.pStateMr ? errors.pStateMr.message : null}
          />
          {/* <TextField
            disabled={readOnly || checkAddress}
            id="standard-basic"
            InputLabelProps={{ shrink: addressShrink }}
            label={<FormattedLabel id="stateMr" required />}
            // label="State"
            variant="standard"
            {...register("pStateMr")}
            error={!!errors.pStateMr}
            helperText={errors?.pStateMr ? errors.pStateMr.message : null}
          /> */}
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <strong>Work Address</strong> */}
        <strong>
          <FormattedLabel id="workAddress" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            // label="Work Address"
            label={<FormattedLabel id="workAddress" />}
            {...register("wAddress")}
            error={!!errors.wAddress}
            helperText={errors?.wAddress ? errors.wAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="cityName" />}
            variant="standard"
            {...register("wCityName")}
            error={!!errors.wCityName}
            helperText={errors?.wCityName ? "City Name  is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="state" />}
            // label="State"
            variant="standard"
            {...register("wState")}
            error={!!errors.wState}
            helperText={errors?.wState ? "State is Required !!!" : null}
          />
          {/* <TextField
            id="standard-basic"
            disabled
            defaultValue={"Maharashtra"}
            label="State *"
            {...register("pState")}
            error={!!errors.pState}
            helperText={errors?.pState ? errors.pState.message : null}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" />}
            {...register("wPincode")}
            error={!!errors.wPincode}
            helperText={errors?.wPincode ? errors.wPincode.message : null}
          />

          {/* <TextField
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="pinCode"  />}
            variant="standard"
            {...register('pPincode')}
            error={!!errors.pPincode}
            helperText={errors?.pPincode ? 'Pin Code  is Required !!!' : null}
          /> */}
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <strong>School / College Address</strong> */}
        <strong>
          {" "}
          <FormattedLabel id="schoolCollegeAddress" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            // label="School / College Address"
            label={<FormattedLabel id="schoolCollegeAddress" />}
            {...register("sAddress")}
            error={!!errors.sAddress}
            helperText={errors?.sAddress ? errors.sAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="cityName" />}
            variant="standard"
            {...register("sCityName")}
            error={!!errors.sCityName}
            helperText={errors?.sCityName ? "City Name  is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            InputLabelProps={{ shrink: true }}
            label={<FormattedLabel id="state" />}
            // label="State"
            variant="standard"
            {...register("sState")}
            error={!!errors.sState}
            helperText={errors?.sState ? "State is Required !!!" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            // label={<FormattedLabel id="crPincode" />}
            label={<FormattedLabel id="pinCode" />}
            {...register("sPincode")}
            error={!!errors.sPincode}
            helperText={errors?.sPincode ? errors.sPincode.message : null}
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <strong>Name of recommending person</strong> */}
        <strong>
          <FormattedLabel id="nameOfRecommendingPerson" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            error={!!errors.atitle}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="atitle *"
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
              name="atitle"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.atitle ? errors.atitle.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="firstName" />}
            {...register("afirstName")}
            error={!!errors.afirstName}
            helperText={errors?.afirstName ? errors.afirstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="middleName" />}
            {...register("amiddleName")}
            error={!!errors.amiddleName}
            helperText={errors?.amiddleName ? errors.amiddleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="lastName" />}
            {...register("alastName")}
            error={!!errors.alastName}
            helperText={errors?.alastName ? errors.alastName.message : null}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PersonalDetails;
