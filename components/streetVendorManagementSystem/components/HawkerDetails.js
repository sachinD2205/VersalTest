import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import Translation from "./Translation";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// HawkerDetails -
const HawkerDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [casts, setCasts] = useState([]);
  const [religions, setReligions] = useState([]);
  const [castCategory, setCastCategory] = useState([]);
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // loadderSetTimeOutFunction
  // const loadderSetTimeOutFunction = () => {
  //   setTimeout(() => {
  //     setValue("loadderState", false);
  //   }, 0);
  // };

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

  // Titles
  const getTitles = () => {
    const url = `${urls.CFCURL}/master/title/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setTitles(
            r.data.title.map((row) => ({
              id: row.id,
              title: row.title,
              titleMr: row.titleMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("titlesApiError", error);
      });
  };

  // genders
  const getGenders = () => {
    const url = `${urls.CFCURL}/master/gender/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setGenders(
            r?.data?.gender?.map((row) => ({
              id: row?.id,
              gender: row?.gender,
              genderMr: row?.genderMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("genderApiError", error);
      });
  };

  // casts
  const getCasts = () => {
    const url = `${
      urls.CFCURL
    }/master/cast/getCastByCastCategory?casteCategoryId=${watch(
      "castCategory"
    )}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setCasts(
            r?.data?.mCast.map((row) => ({
              id: row?.id,
              cast: row?.cast,
              castMr: row?.castMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("castApiError", error);
      });
  };

  // Religions
  const getReligions = () => {
    const url = `${urls.CFCURL}/master/religion/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setReligions(
            r?.data?.religion.map((row) => ({
              id: row?.id,
              religion: row?.religion,
              religionMr: row?.religionMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("religionApiError", error);
      });
  };

  // castCategory
  const getCastCategory = () => {
    const url = `${urls.CFCURL}/castCategory/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setCastCategory(
            r?.data?.castCategory?.map((row) => ({
              id: row?.id,
              castCategoryEn: row?.castCategory,
              castCategoryMr: row?.castCategoryMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("SubCastApiError", error);
      });
  };

  // typeOfDisabilitys
  const getTypeOfDisability = () => {
    const url = `${urls.CFCURL}/master/typeOfDisability/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setTypeOfDisability(
            r?.data?.typeOfDisability?.map((row) => ({
              id: row?.id,
              typeOfDisability: row?.typeOfDisability,
              typeOfDisabilityMr: row?.typeOfDisabilityMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("typeOfDisblity ApiError", error);
      });
  };

  // applicatinType/streetVendorType
  const getApplicants = () => {
    const url = `${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setApplicantTypes(
            r?.data?.streetVendorApplicantCategory?.map((row) => ({
              id: row?.id,
              applicantType: row?.type,
              applicantTypeMr: row?.typeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("applicantsApiError", error);
      });
  };

  //! useEffect -  ================================================>
  useEffect(() => {
    // setValue("loadderState", true);
    // loadderSetTimeOutFunction();
    getTitles();
    getTypeOfDisability();
    getGenders();
    getCastCategory();
    getReligions();
    getApplicants();
  }, []);

  useEffect(() => {
    if (
      watch("castCategory") != null &&
      watch("castCategory") != undefined &&
      watch("castCategory") != ""
    ) {
      getCasts();
    }
  }, [watch("castCategory")]);

  useEffect(() => {
    const castCategoryOtherA = castCategory.find(
      (data) => data?.id == watch("castCategory")
    )?.castCategoryEn;

    if (
      watch("castCategory") != null &&
      watch("castCategory") != undefined &&
      watch("castCategory") != "" &&
      castCategory.length != 0 &&
      casts.length != 0
    ) {
      if (
        castCategoryOtherA == "other" ||
        castCategoryOtherA == "Other" ||
        castCategoryOtherA == "OTHER"
      ) {
        setValue("castCategoryOtherA", true);
        localStorage.setItem("castCategoryOtherA", true);
        const castOtherCustom = casts.find(
          (data) =>
            data?.cast == "other" ||
            data?.cast == "Other" ||
            data?.cast == "OTHER"
        )?.id;
        setValue("castt", castOtherCustom);
        clearErrors("castt");
        console.log("castOtherCustom", castOtherCustom);
      } else {
        setValue("castCategoryOtherA", false);
        setValue("castCategoryOther", "");
        setValue("castOther", "");
        clearErrors("castOther");
        clearErrors("castCategoryOther");
        localStorage.setItem("castCategoryOtherA", false);
      }
    }
  }, [watch("castCategory"), castCategory, casts]);

  // cast other
  useEffect(() => {
    const castOtherA = casts.find((data) => data?.id == watch("castt"))?.cast;
    if (
      watch("castt") != null &&
      watch("castt") != undefined &&
      watch("castt") != "" &&
      casts.length != 0
    ) {
      if (
        castOtherA == "other" ||
        castOtherA == "Other" ||
        castOtherA == "OTHER"
      ) {
        setValue("castOtherA", true);
        localStorage.setItem("castOtherA", true);
      } else {
        setValue("castOtherA", false);
        setValue("castOther", "");
        clearErrors("castOther");
        localStorage.setItem("castOtherA", false);
      }
    } else {
      setValue("castOtherA", false);
      // setValue("castOther", "");
      // clearErrors("castOther");
    }
  }, [watch("castt"), casts]);

  // applicant Type other
  useEffect(() => {
    const applicantTypeOtherA = applicantTypes.find(
      (data) => data?.id == watch("applicantType")
    )?.applicantType;

    if (
      watch("applicantType") != null &&
      watch("applicantType") != undefined &&
      watch("applicantType") != "" &&
      applicantTypes.length != 0
    ) {
      if (
        applicantTypeOtherA == "other" ||
        applicantTypeOtherA == "Other" ||
        applicantTypeOtherA == "OTHER"
      ) {
        setValue("applicantTypeOtherA", true);
        localStorage.setItem("applicantTypeOtherA", true);
      } else {
        setValue("applicantTypeOtherA", false);
        setValue("applicantTypeOther", "");
        clearErrors("applicantTypeOther");
        localStorage.setItem("applicantTypeOtherA", false);
      }
    }
  }, [watch("applicantType"), applicantTypes]);

  // voterName
  useEffect(() => {
    console.log("12chaDAta", watch("disablityNameYN"));

    if (
      watch("disablityNameYN") != null &&
      watch("disablityNameYN") != undefined &&
      watch("disablityNameYN") != ""
    ) {
      if (watch("disablityNameYN") == "true") {
        setValue("disablityNameYNA", true);
        localStorage.setItem("disablityNameYNA", true);
      } else {
        setValue("disablityNameYNA", false);
        localStorage.setItem("disablityNameYNA", false);
        setValue("typeOfDisability", null);
        setValue("disablityPrecntage", "");
        clearErrors("typeOfDisability");
        clearErrors("disablityPrecntage");
      }
    }
  }, [watch("disablityNameYN")]);

  // useEffect(() => {
  //   // firstName
  //   if (
  //     watch("firstName") != null &&
  //     watch("firstName") != "" &&
  //     watch("firstName") != undefined
  //   ) {
  //     clearErrors("firstName");
  //   }
  //   // firstNamerMr
  //   if (
  //     watch("firstNameMr") != null &&
  //     watch("firstNameMr") != "" &&
  //     watch("firstNameMr") != undefined
  //   ) {
  //     clearErrors("firstNameMr");
  //   }
  //   // middleName
  //   if (
  //     watch("middleName") != null &&
  //     watch("middleName") != "" &&
  //     watch("middleName") != undefined
  //   ) {
  //     clearErrors("middleName");
  //   }
  //   // middleNameMr
  //   if (
  //     watch("middleNameMr") != null &&
  //     watch("middleNameMr") != "" &&
  //     watch("middleNameMr") != undefined
  //   ) {
  //     clearErrors("middleNameMr");
  //   }
  //   //  lastName
  //   if (
  //     watch("lastName") != null &&
  //     watch("lastName") != "" &&
  //     watch("lastName") != undefined
  //   ) {
  //     clearErrors("lastName");
  //   }

  //   //  lastName
  //   if (
  //     watch("lastNameMr") != null &&
  //     watch("lastNameMr") != "" &&
  //     watch("lastNameMr") != undefined
  //   ) {
  //     clearErrors("lastNameMr");
  //   }
  // }, [
  //   watch("firstName"),
  //   watch("firstNameMr"),
  //   watch("middleName"),
  //   watch("middleNameMr"),
  //   watch("lastName"),
  //   watch("lastNameMr"),
  // ]);

  // view
  return (
    <div>
      {/** Header */}
      <div className={HawkerReusableCSS.MainHeader}>
        {<FormattedLabel id="hawkerDetails" />}
      </div>
      {/** content */}
      <Grid container className={HawkerReusableCSS.GridContainer}>
        {/** title  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.title} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("title") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="titleEn" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="titleEn" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((title) => (
                      <MenuItem key={title?.id + 1} value={title?.id}>
                        {title?.title}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="title"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.title ? errors?.title?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** first Name English */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='firstName' />}
            {...register("firstName")}
            error={!!errors?.firstName}
            helperText={errors?.firstName ? errors?.firstName?.message : null}
          /> */}

          <Translation
            labelName={"firstName"}
            label={<FormattedLabel id="firstName" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.firstName}
            helperText={errors?.firstName ? errors?.firstName?.message : null}
            key={"firstName"}
            fieldName={"firstName"}
            updateFieldName={"firstNameMr"}
            sourceLang={"en-US"}
            targetLang={"mr-IN"}
          />
        </Grid>
        {/** middle Name English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='middleName' />}
            {...register("middleName")}
            error={!!errors?.middleName}
            helperText={errors?.middleName ? errors?.middleName?.message : null}
          /> */}
          <Translation
            labelName={"middleName"}
            label={<FormattedLabel id="middleName" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.middleName}
            helperText={errors?.middleName ? errors?.middleName?.message : null}
            key={"middleName"}
            fieldName={"middleName"}
            updateFieldName={"middleNameMr"}
            sourceLang={"en-US"}
            targetLang={"mr-IN"}
          />
        </Grid>
        {/** last Name  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='lastName' />}
            {...register("lastName")}
            error={!!errors?.lastName}
            helperText={errors?.lastName ? errors?.lastName?.message : null}
          /> */}

          <Translation
            labelName={"lastName"}
            label={<FormattedLabel id="lastName" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.lastName}
            helperText={errors?.lastName ? errors?.lastName?.message : null}
            key={"lastName"}
            fieldName={"lastName"}
            updateFieldName={"lastNameMr"}
            sourceLang={"en-US"}
            targetLang={"mr-IN"}
          />
        </Grid>

        {/** title in Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.title} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("title") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="titleMr" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="titleMr" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((title) => (
                      <MenuItem key={title?.id + 1} value={title?.id}>
                        {title?.titleMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="title"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.title ? errors?.title?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** first Name Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='firstNameMr' />}
            {...register("firstNameMr")}
            error={!!errors?.firstNameMr}
            helperText={
              errors?.firstNameMr ? errors?.firstNameMr?.message : null
            }
          /> */}

          <Translation
            labelName={"firstNameMr"}
            label={<FormattedLabel id="firstNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.firstNameMr}
            helperText={
              errors?.firstNameMr ? errors?.firstNameMr?.message : null
            }
            key={"firstNameMr"}
            fieldName={"firstNameMr"}
            updateFieldName={"firstName"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>
        {/** middle Name Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='middleNameMr' />}
            {...register("middleNameMr")}
            error={!!errors?.middleNameMr}
            helperText={
              errors?.middleNameMr ? errors?.middleNameMr?.message : null
            }
          /> */}

          <Translation
            labelName={"middleNameMr"}
            label={<FormattedLabel id="middleNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.middleNameMr}
            helperText={
              errors?.middleNameMr ? errors?.middleNameMr?.message : null
            }
            key={"middleNameMr"}
            fieldName={"middleNameMr"}
            updateFieldName={"middleName"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>
        {/** last Name Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          {/* <TextField
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='lastNameMr' />}
            {...register("lastNameMr")}
            error={!!errors?.lastNameMr}
            helperText={errors?.lastNameMr ? errors?.lastNameMr?.message : null}
          /> */}

          <Translation
            labelName={"lastNameMr"}
            label={<FormattedLabel id="lastNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.lastNameMr}
            helperText={errors?.lastNameMr ? errors?.lastNameMr?.message : null}
            key={"lastNameMr"}
            fieldName={"lastNameMr"}
            updateFieldName={"lastName"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** gender */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.gender}>
            <InputLabel
              shrink={watch("gender") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="gender" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="gender" required />}
                >
                  {genders &&
                    genders?.map((gender) => (
                      <MenuItem key={gender?.id} value={gender?.id}>
                        {language == "en" ? gender?.gender : gender?.genderMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="gender"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.gender ? errors?.gender?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** religion */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.religion}>
            <InputLabel
              shrink={watch("religion") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="religion" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="religion" required />}
                >
                  {religions &&
                    religions?.map((religion) => (
                      <MenuItem key={religion?.id + 1} value={religion?.id}>
                        {language == "en"
                          ? religion?.religion
                          : religion?.religionMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="religion"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.religion ? errors.religion?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** cast Category  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.castCategory}>
            <InputLabel
              shrink={watch("castCategory") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="castCategory" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => {
                    setValue("castt", null);
                    clearErrors("castt");
                    return field?.onChange(value);
                  }}
                  label={<FormattedLabel id="castCategory" required />}
                >
                  {castCategory &&
                    castCategory?.map((castCategory) => (
                      <MenuItem key={castCategory?.id} value={castCategory?.id}>
                        {language == "en"
                          ? castCategory?.castCategoryEn
                          : castCategory?.castCategoryMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="castCategory"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.castCategory ? errors?.castCategory?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** cast Category other */}
        {watch("castCategoryOtherA") && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              size="3"
              // InputLabelProps={{
              //   shrink:
              //     watch("castCategoryOther ") != "" &&
              //     watch("castCategoryOther ") != undefined
              //       ? true
              //       : false,
              // }}
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="castCategoryOther" required />}
              {...register("castCategoryOther")}
              error={!!errors?.castCategoryOther}
              helperText={
                errors?.castCategoryOther
                  ? errors?.castCategoryOther?.message
                  : null
              }
            />
          </Grid>
        )}

        {/** cast  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.castt}>
            <InputLabel
              shrink={
                watch("castCategoryOtherA") == true
                  ? true
                  : watch("castt") == null
                  ? false
                  : true
              }
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="caste" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="caste" required />}
                >
                  {casts &&
                    casts?.map((caste) => (
                      <MenuItem key={caste?.id + 1} value={caste?.id}>
                        {language == "en" ? caste?.cast : caste?.castMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="castt"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.castt ? errors?.castt?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** cast Other */}
        {watch("castOtherA") && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              size="3"
              // InputLabelProps={{
              //   shrink:
              //     watch("castOther") != "" && watch("castOther") != undefined
              //       ? true
              //       : false,
              // }}
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="castOther" required />}
              {...register("castOther")}
              error={!!errors?.castOther}
              helperText={errors?.castOther ? errors?.castOther?.message : null}
            />
          </Grid>
        )}

        {/** date Of Birth */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfBirth"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={moment(new Date())
                      .subtract(14, "years")
                      .calendar()}
                    minDate={moment(new Date())
                      .subtract(100, "years")
                      .calendar()}
                    disabled={watch("disabledFieldInputState")}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16, marginTop: 2 }}>
                        {<FormattedLabel id="dateOfBirth" required />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field?.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYY");
                      setValue(
                        "age",
                        Math.floor(moment().format("YYYY") - date1)
                      );
                      clearErrors("age");
                    }}
                    selected={field?.value}
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
              {errors?.dateOfBirth ? errors?.dateOfBirth?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** age */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <TextField
            disabled
            size="3"
            InputLabelProps={{
              shrink:
                watch("age") != "" && watch("age") != undefined ? true : false,
            }}
            // InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="age" required />}
            {...register("age")}
            error={!!errors?.age}
            helperText={errors?.age ? errors?.age?.message : null}
          />
        </Grid>
        {/** mobile */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <TextField
            id="standard-basic"
            inputProps={{ maxLength: 10 }}
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="mobile" required />}
            {...register("mobile")}
            error={!!errors?.mobile}
            helperText={errors?.mobile ? errors?.mobile?.message : null}
          />
        </Grid>
        {/** email Address */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <TextField
            id="standard-basic"
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id="emailAddress" required />}
            {...register("emailAddress")}
            error={!!errors?.emailAddress}
            helperText={
              errors?.emailAddress ? errors?.emailAddress?.message : null
            }
          />
        </Grid>
        {/** ration Card No  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <TextField
            inputProps={{ maxLength: 12 }}
            disabled={watch("disabledFieldInputState")}
            id="standard-basic"
            label={<FormattedLabel id="rationCardNo" required />}
            {...register("rationCardNo")}
            error={!!errors?.rationCardNo}
            helperText={
              errors?.rationCardNo ? errors?.rationCardNo?.message : null
            }
          />
        </Grid>
        {/** applicant  Type */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.applicantType}>
            <InputLabel
              shrink={watch("applicantType") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="applicantType" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel required id="applicantType" />}
                >
                  {applicantTypes &&
                    applicantTypes?.map((applicantType) => (
                      <MenuItem
                        key={applicantType?.id + 1}
                        value={applicantType?.id}
                      >
                        {language == "en"
                          ? applicantType?.applicantType
                          : applicantType?.applicantTypeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="applicantType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.applicantType ? errors?.applicantType?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** applicant Type Other  */}
        {watch("applicantTypeOtherA") && (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="applicantTypeOther" required />}
              {...register("applicantTypeOther")}
              error={!!errors?.applicantTypeOther}
              helperText={
                errors?.applicantTypeOther
                  ? errors?.applicantTypeOther?.message
                  : null
              }
            />
          </Grid>
        )}
        {/** disablity Name YesNo */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          sx={{ marginTop: 2 }}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl flexDirection="row">
            <FormLabel
              sx={{ width: "230px" }}
              id="demo-row-radio-buttons-group-label"
              error={!!errors?.disablityNameYN}
            >
              {<FormattedLabel required id="disablityNameYN" />}
            </FormLabel>

            <Controller
              name="disablityNameYN"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <RadioGroup
                  disabled={watch("disabledFieldInputState")}
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  selected={field?.value}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                >
                  <FormControlLabel
                    error={!!errors?.disablityNameYN}
                    value={true}
                    disabled={watch("disabledFieldInputState")}
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="yes" />}
                  />
                  <FormControlLabel
                    error={!!errors?.disablityNameYN}
                    value={false}
                    disabled={watch("disabledFieldInputState")}
                    control={<Radio size="small" />}
                    label={<FormattedLabel id="no" />}
                  />
                </RadioGroup>
              )}
            />
            <FormHelperText error={!!errors?.disablityNameYN}>
              {errors?.disablityNameYN
                ? errors?.disablityNameYN?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {watch("disablityNameYNA") == true ? (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            >
              {/** disablity */}
              <FormControl
                sx={{ marginTop: 2 }}
                error={!!errors?.typeOfDisability}
                className={HawkerReusableCSS.GridItemCenter}
              >
                <InputLabel
                  shrink={watch("typeOfDisability") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  {<FormattedLabel id="typeOfDisability" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={watch("disabledFieldInputState")}
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      label={<FormattedLabel id="typeOfDisability" required />}
                    >
                      {typeOfDisabilitys &&
                        typeOfDisabilitys?.map((typeOfDisability) => (
                          <MenuItem
                            key={typeOfDisability?.id + 1}
                            value={typeOfDisability?.id}
                          >
                            {language == "en"
                              ? typeOfDisability?.typeOfDisability
                              : typeOfDisability?.typeOfDisabilityMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="typeOfDisability"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.typeOfDisability
                    ? errors?.typeOfDisability?.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            >
              <TextField
                disabled={watch("disabledFieldInputState")}
                id="standard-basic"
                inputProps={{ maxLength: 3 }}
                label={<FormattedLabel id="disablityPrecntage" required />}
                {...register("disablityPrecntage")}
                error={!!errors?.disablityPrecntage}
                helperText={
                  errors?.disablityPrecntage
                    ? errors?.disablityPrecntage?.message
                    : null
                }
              />
            </Grid>
          </>
        ) : (
          <></>
        )}

        {/** responsive */}
        {watch("disabledFieldInputState") ? (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
          </>
        ) : (
          <>
            {/** view map button */}
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
          </>
        )}
      </Grid>
      {/** content End */}
    </div>
  );
};

export default HawkerDetails;
