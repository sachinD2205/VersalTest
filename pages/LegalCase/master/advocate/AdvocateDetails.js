import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/advocateview.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { advocateDetailsSchema } from "../../../../containers/schema/LegalCaseSchema/advocateSchema";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import DOMPurify from "dompurify";

const AdvocateDetails = () => {
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("");
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("");

  // nameOfBarCouncil
  const [nameOfBarCouncilFiledChk, setNameOfBarCouncilFiledChk] =
    useState(true);

  // nameOfBarCouncilMr
  const [nameOfBarCouncilMrFiledChk, setNameOfBarCouncilMrFiledChk] =
    useState(true);

  // area
  const [areaFiledChk, setAreaFiledChk] = useState(true);
  // roadName
  const [roadNameFiledChk, setRoadNameFiledChk] = useState(true);
  // landmark
  const [landmarkFiledChk, setLandmarkFiledChk] = useState(true);

  // city
  const [cityFiledChk, setCityFiledChk] = useState(true);

  // areaMr
  const [areaMrFiledChk, setAreaMrFiledChk] = useState(true);
  // roadNameMr
  const [roadNameMrFiledChk, setRoadNameMrFiledChk] = useState(true);
  // landmarkMr
  const [landmarkMrFiledChk, setLandmarkMrFiledChk] = useState(true);

  const error1Messsage = () => {
    if (language == "en") {
      return messageToShowOnError;
    } else {
      return messageToShowOnErrorMr;
    }
  };

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [titles, settitles] = useState([]);
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
  // get Title
  const gettitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("22", res);
        settitles(
          res.data.title.map((r, i) => ({
            id: r.id,
            title: r.title,
            titleMr: r.titleMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    gettitles();
    // getBankName()
  }, []);

  useEffect(() => {
    const hyperlinkRegex = /https?:\/\/|ftp:\/\//i;
    const csvRegex = /,\s*=/;
    const noSpecialCharRegex = /^(=).*/;

    const checkField = (fieldName, setFieldChk) => {
      const fieldValue = watch(fieldName);

      if (!fieldValue) {
        setFieldChk(true);
        return;
      }

      if (!noSpecialCharRegex.test(fieldValue)) {
        setFieldChk(true);

        if (!hyperlinkRegex.test(fieldValue)) {
          setFieldChk(true);

          if (csvRegex.test(fieldValue)) {
            setFieldChk(false);
            setMessageToShowOnError("Potential CSV injection detected! 😣");
            setMessageToShowOnErrorMr("संभाव्य CSV इंजेक्शन आढळले! 😣");
          } else {
            const sanitizedValue = DOMPurify.sanitize(fieldValue);

            if (fieldValue !== sanitizedValue) {
              setFieldChk(false);
              setMessageToShowOnError(
                "Potential HTML/Script injection detected! 😣"
              );
              setMessageToShowOnErrorMr(
                "संभाव्य एचटीएमएल/स्क्रिप्ट इंजेक्शन आढळले! 😣"
              );
            } else {
              setFieldChk(true);
            }
          }
        } else {
          setFieldChk(false);
          setMessageToShowOnError("Hyperlink is not allowed 😒");
          setMessageToShowOnErrorMr("हायपरलिंकला परवानगी नाही 😒");
        }
      } else {
        setFieldChk(false);
        setMessageToShowOnError(
          "Value should not start with any special character 😒"
        );
        setMessageToShowOnErrorMr(
          "मूल्य कोणत्याही विशेष वर्णाने सुरू होऊ नये 😒"
        );
      }
    };

    checkField("nameOfBarCouncil", setNameOfBarCouncilFiledChk);
    checkField("nameOfBarCouncilMr", setNameOfBarCouncilMrFiledChk);
    checkField("area", setAreaFiledChk);
    checkField("roadName", setRoadNameFiledChk);
    checkField("landmark", setLandmarkFiledChk);
    checkField("city", setCityFiledChk);
    checkField("areaMr", setAreaMrFiledChk);
    checkField("roadNameMr", setRoadNameMrFiledChk);
    checkField("landmarkMr", setLandmarkMrFiledChk);
  }, [
    watch("nameOfBarCouncil"),
    watch("nameOfBarCouncilMr"),
    watch("area"),
    watch("roadName"),
    watch("landmark"),
    watch("city"),
    watch("areaMr"),
    watch("roadNameMr"),
    watch("landmarkMr"),
  ]);

  return (
    <>
      <Box
        style={{
          backgroundColor: "#556CD6",

          color: "white",

          marginTop: 30,

          borderRadius: 100,
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
          }}
        >
          <h2
            style={{
              color: "white",
              marginTop: "1vh",
            }}
          >
            <FormattedLabel id="advocateDetails" />
          </h2>
        </Typography>
      </Box>
      <Divider />

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* New Autocomplete  */}
            <FormControl
              variant="standard"
              error={!!errors?.title}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="title"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    id="controllable-states-demo"
                    // sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.id : null);
                    }}
                    value={titles?.find((data) => data?.id === value) || null}
                    options={titles.sort((a, b) =>
                      language === "en"
                        ? a.title.localeCompare(b.title)
                        : a.titleMr.localeCompare(b.titleMr)
                    )} //! api Data
                    getOptionLabel={(title) =>
                      language == "en" ? title?.title : title?.titleMr
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        {...params}
                        label={language == "en" ? "Title" : "शीर्षक"}
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.title ? errors?.title?.message : null}
              </FormHelperText>
            </FormControl>

            {/* **** */}
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* First Name in English */}
          <Grid
            item
            style={{
              marginTop: "3vh",
            }}
            xl={2}
            lg={2}
            md={6}
            sm={6}
            xs={12}
          >
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              InputLabelProps={{
                //true
                shrink:
                  (watch("firstName") ? true : false) ||
                  (router.query.firstName ? true : false),
              }}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="fnameEn" required />}
              variant="standard"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            /> */}

            <Transliteration
              _key={"firstName"}
              labelName={"firstName"}
              fieldName={"firstName"}
              updateFieldName={"firstNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="fnameEn" required />}
              error={!!errors.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Middle Name in English*/}
          <Grid
            item
            style={{
              marginTop: "3vh",
            }}
            xl={2}
            lg={2}
            md={6}
            sm={6}
            xs={12}
          >
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              InputLabelProps={{
                //true
                shrink:
                  (watch("middleName") ? true : false) ||
                  (router.query.middleName ? true : false),
              }}
              label={<FormattedLabel id="mnameEn" />}
              variant="standard"
              {...register("middleName")}
              error={!!errors.middleName}
              helperText={errors?.middleName ? errors.middleName.message : null} */}
            {/* /> */}
            <Transliteration
              _key={"middleName"}
              labelName={"middleName"}
              fieldName={"middleName"}
              updateFieldName={"middleNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="mnameEn" required />}
              error={!!errors.middleName}
              helperText={errors?.middleName ? errors.middleName.message : null}
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Last Name in English */}
          <Grid
            item
            style={{
              marginTop: "3vh",
            }}
            xl={2}
            lg={2}
            md={6}
            sm={6}
            xs={12}
          >
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="lnameEn" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("lastName") ? true : false) ||
                  (router.query.lastName ? true : false),
              }}
              variant="standard"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors?.lastName ? errors.lastName.message : null}
            /> */}

            <Transliteration
              _key={"lastName"}
              labelName={"lastName"}
              fieldName={"lastName"}
              updateFieldName={"lastNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="lnameEn" required />}
              error={!!errors.lastName}
              helperText={errors?.lastName ? errors.lastName.message : null}
            />
          </Grid>

          {/* Advocate Category */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <FormControl
              disabled={router?.query?.pageMode === "View"}
              sx={{ marginTop: "2%", width: "230px" }}
              variant="standard"
              error={!!errors.advcoateCategory}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="advocateCategory" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="advcoateCategory"
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("advcoateCategory") ? true : false) ||
                        (router.query.advcoateCategory ? true : false),
                    }}
                  >
                    {[
                      { id: 1, advocateCategory: "Panel Advocate" },
                      { id: 2, advocateCategory: "Other" },
                      // { id: 3, caseStatuse: "Final Order" },
                      // { id: 4, caseStatuse: "Case Dissmiss" },
                    ].map((menu, index) => {
                      return (
                        <MenuItem key={index} value={menu.id}>
                          {menu.advocateCategory}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                name="advocateCategory"
                control={control}
                defaultValue=""
              />
              {/* <FormHelperText>
                {errors?.advcoateCategory
                  ? errors.advcoateCategory.message
                  : null}
              </FormHelperText> */}
            </FormControl>
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* First Name in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="fnameMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("firstNameMr") ? true : false) ||
                  (router.query.firstNameMr ? true : false),
              }}
              variant="standard"
              {...register("firstNameMr")}
              error={!!errors.firstNameMr}
              helperText={
                errors?.firstNameMr ? errors.firstNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"firstNameMr"}
              labelName={"firstNameMr"}
              fieldName={"firstNameMr"}
              updateFieldName={"firstName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="fnameMr" required />}
              error={!!errors.firstNameMr}
              helperText={
                errors?.firstNameMr ? errors.firstNameMr.message : null
              }
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>
          {/* Middle Name in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="mnameMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("middleNameMr") ? true : false) ||
                  (router.query.middleNameMr ? true : false),
              }}
              variant="standard"
              {...register("middleNameMr")}
              error={!!errors.middleNameMr}
              helperText={
                errors?.middleNameMr ? errors.middleNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"middleNameMr"}
              labelName={"middleNameMr"}
              fieldName={"middleNameMr"}
              updateFieldName={"middleNameMr"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="mnameMr" required />}
              error={!!errors.middleNameMr}
              helperText={
                errors?.middleNameMr ? errors.middleNameMr.message : null
              }
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Last Name in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="lnameMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("lastNameMr") ? true : false) ||
                  (router.query.lastNameMr ? true : false),
              }}
              variant="standard"
              {...register("lastNameMr")}
              error={!!errors.lastNameMr}
              helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
            /> */}

            <Transliteration
              _key={"lastNameMr"}
              labelName={"lastNameMr"}
              fieldName={"lastNameMr"}
              updateFieldName={"lastName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="lnameMr" required />}
              error={!!errors.lastNameMr}
              helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
            />
          </Grid>

          {/* Name of Bar Council in English */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="nameOfBarCouncilEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("nameOfBarCouncil") ? true : false) ||
                  (router.query.nameOfBarCouncil ? true : false),
              }}
              variant="standard"
              {...register("nameOfBarCouncil")}
              error={!!errors.nameOfBarCouncil}
              helperText={
                errors?.nameOfBarCouncil
                  ? errors.nameOfBarCouncil.message
                  : null
              }
            /> */}

            <Transliteration
              _key={"nameOfBarCouncil"}
              labelName={"nameOfBarCouncil"}
              fieldName={"nameOfBarCouncil"}
              updateFieldName={"nameOfBarCouncilMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="nameOfBarCouncilEn" required />}
              error={!!errors.nameOfBarCouncil}
              helperText={
                errors?.nameOfBarCouncil
                  ? errors.nameOfBarCouncil.message
                  : null
              }
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!nameOfBarCouncilFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* Name of Bar Council Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="nameOfBarCouncilMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("nameOfBarCouncilMr") ? true : false) ||
                  (router.query.nameOfBarCouncilMr ? true : false),
              }}
              variant="standard"
              {...register("nameOfBarCouncilMr")}
              error={!!errors.nameOfBarCouncilMr}
              helperText={
                errors?.nameOfBarCouncilMr
                  ? errors.nameOfBarCouncilMr.message
                  : null
              }
            /> */}

            <Transliteration
              _key={"nameOfBarCouncilMr"}
              labelName={"nameOfBarCouncilMr"}
              fieldName={"nameOfBarCouncilMr"}
              updateFieldName={"nameOfBarCouncil"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="nameOfBarCouncilMr" required />}
              error={!!errors.nameOfBarCouncilMr}
              helperText={
                errors?.nameOfBarCouncilMr
                  ? errors.nameOfBarCouncilMr.message
                  : null
              }
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!nameOfBarCouncilMrFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Aadhar No */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="aadharNo" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("aadhaarNo") ? true : false) ||
                  (router.query.aadhaarNo ? true : false),
              }}
              inputProps={{ maxLength: 12 }}
              variant="standard"
              {...register("aadhaarNo")}
              error={!!errors.aadhaarNo}
              helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
            />
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* PAN No */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              inputProps={{ maxLength: 10 }}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="panNo" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("panNo") ? true : false) ||
                  (router.query.panNo ? true : false),
              }}
              variant="standard"
              {...register("panNo")}
              error={!!errors.panNo}
              helperText={errors?.panNo ? errors.panNo.message : null}
            />
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* area in English */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="areaEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("area") ? true : false) ||
                  (router.query.area ? true : false),
              }}
              variant="standard"
              {...register("area")}
              error={!!errors.area}
              helperText={errors?.area ? errors.area.message : null}
            /> */}

            <Transliteration
              _key={"area"}
              labelName={"area"}
              fieldName={"area"}
              updateFieldName={"areaMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="areaEn" required />}
              error={!!errors.area}
              helperText={errors?.area ? errors.area.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!areaFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>
          {/* Road Name in English */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNameEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("roadName") ? true : false) ||
                  (router.query.roadName ? true : false),
              }}
              variant="standard"
              {...register("roadName")}
              error={!!errors.roadName}
              helperText={errors?.roadName ? errors.roadName.message : null}
            /> */}

            <Transliteration
              _key={"roadName"}
              labelName={"roadName"}
              fieldName={"roadName"}
              updateFieldName={"roadNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="roadNameEn" required />}
              error={!!errors.roadName}
              helperText={errors?.roadName ? errors.roadName.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!roadNameFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Landmark in English */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              // required
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="landmarkEn" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("landmark") ? true : false) ||
                  (router.query.landmark ? true : false),
              }}
              variant="standard"
              {...register("landmark")}
              error={!!errors.landmark}
              helperText={errors?.landmark ? errors.landmark.message : null}
            /> */}

            <Transliteration
              _key={"landmark"}
              labelName={"landmark"}
              fieldName={"landmark"}
              updateFieldName={"landmarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="landmarkEn" required />}
              error={!!errors.landmark}
              helperText={errors?.landmark ? errors.landmark.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!landmarkFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>
          {/* City/Village in English */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityOrVillageEn" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("city") ? true : false) ||
                  (router.query.city ? true : false),
              }}
              variant="standard"
              {...register("city")}
              error={!!errors.city}
              helperText={errors?.city ? errors.city.message : null}
            /> */}

            <Transliteration
              _key={"city"}
              labelName={"city"}
              fieldName={"city"}
              updateFieldName={"cityMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="cityOrVillageEn" required />}
              error={!!errors.city}
              helperText={errors?.city ? errors.city.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!cityFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* Area in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="areaMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("areaMr") ? true : false) ||
                  (router.query.areaMr ? true : false),
              }}
              variant="standard"
              {...register("areaMr")}
              error={!!errors.areaMr}
              helperText={errors?.areaMr ? errors.areaMr.message : null}
            /> */}

            <Transliteration
              _key={"areaMr"}
              labelName={"areaMr"}
              fieldName={"areaMr"}
              updateFieldName={"area"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="areaMr" required />}
              error={!!errors.areaMr}
              helperText={errors?.areaMr ? errors.areaMr.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!areaMrFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* Road Name in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNameMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("roadNameMr") ? true : false) ||
                  (router.query.roadNameMr ? true : false),
              }}
              variant="standard"
              {...register("roadNameMr")}
              error={!!errors.roadNameMr}
              helperText={errors?.roadNameMr ? errors.roadNameMr.message : null}
            /> */}

            <Transliteration
              _key={"roadNameMr"}
              labelName={"roadNameMr"}
              fieldName={"roadNameMr"}
              updateFieldName={"roadName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="roadNameMr" required />}
              error={!!errors.roadNameMr}
              helperText={errors?.roadNameMr ? errors.roadNameMr.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!roadNameMrFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Landmark in Marathi */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              // required
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="landmarkMr" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("landmarkMr") ? true : false) ||
                  (router.query.landmarkMr ? true : false),
              }}
              variant="standard"
              {...register("landmarkMr")}
              error={!!errors.landmarkMr}
              helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
            /> */}

            <Transliteration
              _key={"landmarkMr"}
              labelName={"landmarkMr"}
              fieldName={"landmarkMr"}
              updateFieldName={"landmark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="landmarkMr" required />}
              error={!!errors.landmarkMr}
              helperText={errors?.landmarkMr ? errors.landmarkMr.message : null}
            />

            <FormHelperText
              style={{ color: "red", marginTop: "0px", paddingTop: "0px" }}
            >
              {!landmarkMrFiledChk ? error1Messsage() : ""}
            </FormHelperText>
          </Grid>

          <Grid item xl={1} lg={1}></Grid>
          {/* City/Village in Marathi */}

          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            {/* <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityOrVillageMr" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("cityMr") ? true : false) ||
                  (router.query.cityMr ? true : false),
              }}
              variant="standard"
              {...register("cityMr")}
              error={!!errors.cityMr}
              helperText={errors?.cityMr ? errors.cityMr.message : null}
            /> */}

            <Transliteration
              _key={"cityMr"}
              labelName={"cityMr"}
              fieldName={"cityMr"}
              updateFieldName={"city"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="cityOrVillageMr" required />}
              error={!!errors.cityMr}
              helperText={errors?.cityMr ? errors.cityMr.message : null}
            />
          </Grid>

          {/* PinCode  */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              inputProps={{ maxLength: 6 }}
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("pinCode") ? true : false) ||
                  (router.query.pinCode ? true : false),
              }}
              variant="standard"
              {...register("pinCode")}
              error={!!errors.pinCode}
              helperText={errors?.pinCode ? errors.pinCode.message : null}
            />
          </Grid>

          <Grid item xl={1} lg={1}></Grid>

          {/* Phone No */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              // inputProps={{maxLength:10}}

              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="phone" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("phoneNo") ? true : false) ||
                  (router.query.phoneNo ? true : false),
              }}
              variant="standard"
              {...register("phoneNo")}
              error={!!errors.phoneNo}
              helperText={errors?.phoneNo ? errors.phoneNo.message : null}
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Mobile No */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              inputProps={{ maxLength: 10 }}
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobile" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("mobileNo") ? true : false) ||
                  (router.query.mobileNo ? true : false),
              }}
              variant="standard"
              {...register("mobileNo")}
              error={!!errors.mobileNo}
              helperText={errors?.mobileNo ? errors.mobileNo.message : null}
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>

          {/* Gmail */}
          <Grid item xl={2} lg={2} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              sx={{
                width: "230px",
                // marginRight: '5%',
                marginTop: "2%",
              }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("emailAddress") ? true : false) ||
                  (router.query.emailAddress ? true : false),
              }}
              variant="standard"
              {...register("emailAddress")}
              error={!!errors.emailAddress}
              helperText={
                errors?.emailAddress ? errors.emailAddress.message : null
              }
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdvocateDetails;
