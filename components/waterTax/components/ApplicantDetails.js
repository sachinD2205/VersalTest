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
  Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import Translation from "./Translation";

/** Author - Sachin Durge */
// ApplicantDetails -
const ApplicantDetails = () => {
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

  // applicatinType
  const getApplicants = () => {
    const url = `${urls.CFCURL}/master/applicantType/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setApplicantTypes(
            r?.data?.applicantType?.map((row) => ({
              id: row?.id,
              applicantType: row?.applicantType,
              applicantTypeMr: row?.applicantTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("applicantsApiError", error);
      });
  };

   // // typeOfDisabilitys
  // const getTypeOfDisability = () => {
  //   const url = `${urls.CFCURL}/master/typeOfDisability/getAll`;
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r?.status == 200 || r?.status == 201) {
  //         setTypeOfDisability(
  //           r?.data?.typeOfDisability?.map((row) => ({
  //             id: row?.id,
  //             typeOfDisability: row?.typeOfDisability,
  //             typeOfDisabilityMr: row?.typeOfDisabilityMr,
  //           }))
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //       console.log("typeOfDisblity ApiError", error);
  //     });
  // };

   // // casts
  // const getCasts = () => {
  //   const url = `${urls.CFCURL
  //     }/master/cast/getCastByCastCategory?casteCategoryId=${watch(
  //       "castCategory"
  //     )}`;
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r?.status == 200 || r?.status == 201) {
  //         setCasts(
  //           r?.data?.mCast.map((row) => ({
  //             id: row?.id,
  //             cast: row?.cast,
  //             castMr: row?.castMr,
  //           }))
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //       console.log("castApiError", error);
  //     });
  // };

  // // Religions
  // const getReligions = () => {
  //   const url = `${urls.CFCURL}/master/religion/getAll`;
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r?.status == 200 || r?.status == 201) {
  //         setReligions(
  //           r?.data?.religion.map((row) => ({
  //             id: row?.id,
  //             religion: row?.religion,
  //             religionMr: row?.religionMr,
  //           }))
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //       console.log("religionApiError", error);
  //     });
  // };

  // // castCategory
  // const getCastCategory = () => {
  //   const url = `${urls.CFCURL}/castCategory/getAll`;
  //   axios
  //     .get(url, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r?.status == 200 || r?.status == 201) {
  //         setCastCategory(
  //           r?.data?.castCategory?.map((row) => ({
  //             id: row?.id,
  //             castCategoryEn: row?.castCategory,
  //             castCategoryMr: row?.castCategoryMr,
  //           }))
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //       console.log("SubCastApiError", error);
  //     });
  // };


  //! useEffect -  ================================================>

  useEffect(() => {
    getApplicants();

    // setValue("loadderState", true);
    // loadderSetTimeOutFunction();
    // getTitles();
    // getTypeOfDisability();
    // getGenders();
    // getCastCategory();
    // getReligions();
  }, []);

  // useEffect(() => {
  //   if (
  //     watch("castCategory") != null &&
  //     watch("castCategory") != undefined &&
  //     watch("castCategory") != ""
  //   ) {
  //     getCasts();
  //   }
  // }, [watch("castCategory")]);

  // useEffect(() => {
  //   const castCategoryOtherA = castCategory.find(
  //     (data) => data?.id == watch("castCategory")
  //   )?.castCategoryEn;

  //   if (
  //     watch("castCategory") != null &&
  //     watch("castCategory") != undefined &&
  //     watch("castCategory") != "" &&
  //     castCategory.length != 0 &&
  //     casts.length != 0
  //   ) {
  //     if (
  //       castCategoryOtherA == "other" ||
  //       castCategoryOtherA == "Other" ||
  //       castCategoryOtherA == "OTHER"
  //     ) {
  //       setValue("castCategoryOtherA", true);
  //       localStorage.setItem("castCategoryOtherA", true);
  //       const castOtherCustom = casts.find(
  //         (data) =>
  //           data?.cast == "other" ||
  //           data?.cast == "Other" ||
  //           data?.cast == "OTHER"
  //       )?.id;
  //       setValue("castt", castOtherCustom);
  //       clearErrors("castt");
  //       console.log("castOtherCustom", castOtherCustom);
  //     } else {
  //       setValue("castCategoryOtherA", false);
  //       setValue("castCategoryOther", "");
  //       setValue("castOther", "");
  //       clearErrors("castOther");
  //       clearErrors("castCategoryOther");
  //       localStorage.setItem("castCategoryOtherA", false);
  //     }
  //   }
  // }, [watch("castCategory"), castCategory, casts]);

  // // cast other
  // useEffect(() => {
  //   const castOtherA = casts.find((data) => data?.id == watch("castt"))?.cast;
  //   if (
  //     watch("castt") != null &&
  //     watch("castt") != undefined &&
  //     watch("castt") != "" &&
  //     casts.length != 0
  //   ) {
  //     if (
  //       castOtherA == "other" ||
  //       castOtherA == "Other" ||
  //       castOtherA == "OTHER"
  //     ) {
  //       setValue("castOtherA", true);
  //       localStorage.setItem("castOtherA", true);
  //     } else {
  //       setValue("castOtherA", false);
  //       setValue("castOther", "");
  //       clearErrors("castOther");
  //       localStorage.setItem("castOtherA", false);
  //     }
  //   } else {
  //     setValue("castOtherA", false);
  //     // setValue("castOther", "");
  //     // clearErrors("castOther");
  //   }
  // }, [watch("castt"), casts]);

  // // voterName
  // useEffect(() => {
  //   console.log("12chaDAta", watch("disablityNameYN"));

  //   if (
  //     watch("disablityNameYN") != null &&
  //     watch("disablityNameYN") != undefined &&
  //     watch("disablityNameYN") != ""
  //   ) {
  //     if (watch("disablityNameYN") == "true") {
  //       setValue("disablityNameYNA", true);
  //       localStorage.setItem("disablityNameYNA", true);
  //     } else {
  //       setValue("disablityNameYNA", false);
  //       localStorage.setItem("disablityNameYNA", false);
  //       setValue("typeOfDisability", null);
  //       setValue("disablityPrecntage", "");
  //       clearErrors("typeOfDisability");
  //       clearErrors("disablityPrecntage");
  //     }
  //   }
  // }, [watch("disablityNameYN")]);

  // view
  
  return (
    <div>
      {/** Header */}
      <div className={HawkerReusableCSS.MainHeader}>
        {<FormattedLabel id="applicantDetail" />}
      </div>
      {/** content */}

      <Grid container className={HawkerReusableCSS.GridContainer}>

        {/** applicantType  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.applicantType} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("applicantType") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="applicantType" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="applicantType" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {applicantTypes &&
                    applicantTypes?.map((applicantType) => (
                      <MenuItem key={applicantType?.id + 1} value={applicantType?.id}>
                        {language=='en'?applicantType?.applicantType:applicantType?.applicantTypeMr}
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

        {/** typeOfApplication  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.typeOfApplication} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("typeOfApplication") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="typeOfApplication" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="typeOfApplication" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((typeOfApplication) => (
                      <MenuItem key={typeOfApplication?.id + 1} value={typeOfApplication?.id}>
                        {typeOfApplication?.typeOfApplication}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="typeOfApplication"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.typeOfApplication ? errors?.typeOfApplication?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** groupName  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.groupName} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("groupName") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="groupName" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="groupName" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((groupName) => (
                      <MenuItem key={groupName?.id + 1} value={groupName?.id}>
                        {groupName?.groupName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="groupName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.groupName ? errors?.groupName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** zoneName  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.zoneName} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("zoneName") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="zoneName" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="zoneName" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((zoneName) => (
                      <MenuItem key={zoneName?.id + 1} value={zoneName?.id}>
                        {zoneName?.zoneName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.zoneName ? errors?.zoneName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** wardName  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.wardName} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("wardName") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="wardName" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="wardName" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((wardName) => (
                      <MenuItem key={wardName?.id + 1} value={wardName?.id}>
                        {wardName?.wardName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="wardName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.wardName ? errors?.wardName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** location  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.location} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("location") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="location" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="location" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((location) => (
                      <MenuItem key={location?.id + 1} value={location?.id}>
                        {location?.location}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="location"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.location ? errors?.location?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** lattitude English */}
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
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='lattitude' />}
            {...register("lattitude")}
            error={!!errors?.lattitude}
            helperText={errors?.lattitude ? errors?.lattitude?.message : null}
          />
        </Grid>

        {/** longitude English */}
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
            id='standard-basic'
            disabled={watch("disabledFieldInputState")}
            label={<FormattedLabel id='longitude' />}
            {...register("longitude")}
            error={!!errors?.longitude}
            helperText={errors?.longitude ? errors?.longitude?.message : null}
          />
        </Grid>

        {/** titleEn  English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.titleEn} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("titleEn") == null ? false : true}
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
                    titles?.map((titleEn) => (
                      <MenuItem key={titleEn?.id + 1} value={titleEn?.id}>
                        {titleEn?.titleEn}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="titleEn"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.titleEn ? errors?.titleEn?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** firstNameEn English */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"firstNameEn"}
            label={<FormattedLabel id="firstNameEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.firstNameEn}
            helperText={errors?.firstNameEn ? errors?.firstNameEn?.message : null}
            key={"firstNameEn"}
            fieldName={"firstNameEn"}
            updateFieldName={"firstNameMr"}
            sourceLang={"en-US"}
            targetLang={"mr-IN"}
          />
        </Grid>

        {/** middleNameEn English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"middleNameEn"}
            label={<FormattedLabel id="middleNameEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.middleNameEn}
            helperText={errors?.middleNameEn ? errors?.middleNameEn?.message : null}
            key={"middleNameEn"}
            fieldName={"middleNameEn"}
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
          <Translation
            labelName={"lastNameEn"}
            label={<FormattedLabel id="lastNameEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.lastNameEn}
            helperText={errors?.lastNameEn ? errors?.lastNameEn?.message : null}
            key={"lastNameEn"}
            fieldName={"lastNameEn"}
            updateFieldName={"lastNameMr"}
            sourceLang={"en-US"}
            targetLang={"mr-IN"}
          />
        </Grid>

        {/** titleMr Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.titleMr} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("titleMr") == null ? false : true}
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
                    titles?.map((titleMr) => (
                      <MenuItem key={titleMr?.id + 1} value={titleMr?.id}>
                        {titleMr?.titleMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="titleMr"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.titleMr ? errors?.titleMr?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** firstNameMr Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >

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
            updateFieldName={"firstNameEn"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** middleNameMr Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >

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
            updateFieldName={"middleNameEn"}
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
          <Translation
            labelName={"lastNameMr"}
            label={<FormattedLabel id="lastNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.lastNameMr}
            helperText={errors?.lastNameMr ? errors?.lastNameMr?.message : null}
            key={"lastNameMr"}
            fieldName={"lastNameMr"}
            updateFieldName={"lastNameEn"}
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

        {/** mobileNo */}
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
            label={<FormattedLabel id="mobileNo" required />}
            {...register("mobileNo")}
            error={!!errors?.mobileNo}
            helperText={errors?.mobileNo ? errors?.mobileNo?.message : null}
          />
        </Grid>

        {/** email */}
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
            label={<FormattedLabel id="email" required />}
            {...register("email")}
            error={!!errors?.email}
            helperText={
              errors?.email ? errors?.email?.message : null
            }
          />
        </Grid>

        {/** flatCount */}
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
            label={<FormattedLabel id="flatCount" required />}
            {...register("flatCount")}
            error={!!errors?.flatCount}
            helperText={
              errors?.flatCount ? errors?.flatCount?.message : null
            }
          />
        </Grid>

        {/** flatBuildingNumberEn  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"flatBuildingNumberEn"}
            label={<FormattedLabel id="flatBuildingNumberEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.flatBuildingNumberEn}
            helperText={errors?.flatBuildingNumberEn ? errors?.flatBuildingNumberEn?.message : null}
            key={"flatBuildingNumberEn"}
            fieldName={"flatBuildingNumberEn"}
            updateFieldName={"flatBuildingNumberMr"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** buildingNameSocietyNameEn  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"buildingNameSocietyNameEn"}
            label={<FormattedLabel id="buildingNameSocietyNameEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.buildingNameSocietyNameEn}
            helperText={errors?.buildingNameSocietyNameEn ? errors?.buildingNameSocietyNameEn?.message : null}
            key={"buildingNameSocietyNameEn"}
            fieldName={"buildingNameSocietyNameEn"}
            updateFieldName={"buildingNameSocietyNameMr"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** roadNameEn  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"roadNameEn"}
            label={<FormattedLabel id="roadNameEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.roadNameEn}
            helperText={errors?.roadNameEn ? errors?.roadNameEn?.message : null}
            key={"roadNameEn"}
            fieldName={"roadNameEn"}
            updateFieldName={"roadNameMr"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** villageTownCityEn  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"villageTownCityEn"}
            label={<FormattedLabel id="villageTownCityEn" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.villageTownCityEn}
            helperText={errors?.villageTownCityEn ? errors?.villageTownCityEn?.message : null}
            key={"villageTownCityEn"}
            fieldName={"villageTownCityEn"}
            updateFieldName={"villageTownCityMr"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** flatBuildingNumberMr  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"flatBuildingNumberMr"}
            label={<FormattedLabel id="flatBuildingNumberMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.flatBuildingNumberMr}
            helperText={errors?.flatBuildingNumberMr ? errors?.flatBuildingNumberMr?.message : null}
            key={"flatBuildingNumberMr"}
            fieldName={"flatBuildingNumberMr"}
            updateFieldName={"flatBuildingNumberEn"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** buildingNameSocietyNameMr  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"buildingNameSocietyNameMr"}
            label={<FormattedLabel id="buildingNameSocietyNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.buildingNameSocietyNameMr}
            helperText={errors?.buildingNameSocietyNameMr ? errors?.buildingNameSocietyNameMr?.message : null}
            key={"buildingNameSocietyNameMr"}
            fieldName={"buildingNameSocietyNameMr"}
            updateFieldName={"buildingNameSocietyNameEn"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** roadNameMr  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"roadNameMr"}
            label={<FormattedLabel id="roadNameMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.roadNameMr}
            helperText={errors?.roadNameMr ? errors?.roadNameMr?.message : null}
            key={"roadNameMr"}
            fieldName={"roadNameMr"}
            updateFieldName={"roadNameEn"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** villageTownCityMr  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <Translation
            labelName={"villageTownCityMr"}
            label={<FormattedLabel id="villageTownCityMr" required />}
            width={230}
            disabled={watch("disabledFieldInputState")}
            error={!!errors?.villageTownCityMr}
            helperText={errors?.villageTownCityMr ? errors?.villageTownCityMr?.message : null}
            key={"villageTownCityMr"}
            fieldName={"villageTownCityMr"}
            updateFieldName={"villageTownCityEn"}
            sourceLang={"mr-IN"}
            targetLang={"en-US"}
          />
        </Grid>

        {/** areaName*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.areaName} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("areaName") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="areaName" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="areaName" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((areaName) => (
                      <MenuItem key={areaName?.id + 1} value={areaName?.id}>
                        {areaName?.areaName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="areaName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.areaName ? errors?.areaName?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** landmark*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControl error={!!errors?.landmark} sx={{ marginTop: 2 }}>
            <InputLabel
              shrink={watch("landmark") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="landmark" reuired />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={watch("disabledFieldInputState")}
                  autoFocus
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="landmark" required />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles?.map((landmark) => (
                      <MenuItem key={landmark?.id + 1} value={landmark?.id}>
                        {landmark?.landmark}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="landmark"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.landmark ? errors?.landmark?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** pinCode */}
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
            label={<FormattedLabel id="pinCode" required />}
            {...register("pinCode")}
            error={!!errors?.pinCode}
            helperText={
              errors?.pinCode ? errors?.pinCode?.message : null
            }
          />
        </Grid>

        {/** aadharNumber */}
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
            label={<FormattedLabel id="aadharNumber" required />}
            {...register("aadharNumber")}
            error={!!errors?.aadharNumber}
            helperText={
              errors?.aadharNumber ? errors?.aadharNumber?.message : null
            }
          />
        </Grid>

        {/** isBelowPovertyLine */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
          style={{ marginTop: "5vh" }}

        >
          <FormControlLabel
            control={<Checkbox checked={getValues("isBelowPovertyLine")} />}
            label={<Typography>
              {" "}
              <FormattedLabel id="isBelowPovertyLine" />
            </Typography>}
            onChange={(e) => {
              setValue("isBelowPovertyLine", e.target.checked)
            }}
          />
        </Grid>

        {/** billingAddressIsSameAsAbove */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
          style={{ marginTop: "5vh" }}

        >
          <FormControlLabel
            control={<Checkbox checked={getValues("billingAddressIsSameAsAbove")} />}
            label={<Typography>
              {" "}
              <FormattedLabel id="billingAddressIsSameAsAbove" />
            </Typography>}
            onChange={(e) => {
              setValue("billingAddressIsSameAsAbove", e.target.checked)
            }}
          />
        </Grid>

        {/** otherBillingAddress */}
        {getValues("billingAddressIsSameAsAbove") &&

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
              label={<FormattedLabel id="otherBillingAddress" required />}
              {...register("otherBillingAddress")}
              error={!!errors?.otherBillingAddress}
              helperText={
                errors?.otherBillingAddress ? errors?.otherBillingAddress?.message : null
              }
            />
          </Grid>
        }


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

export default ApplicantDetails;
