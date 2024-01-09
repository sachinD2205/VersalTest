import {
  Autocomplete,
  FormControl,
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
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";
import styles from "../marriageRegistration/view.module.css";
import Transliteration from "../marriageRegistration/transliteration";
import { catchExceptionHandlingMethod } from "../../util/util";

// view - priest
const PriestDetails = () => {
  const language = useSelector((state) => state?.labels.language);
  const [pGenders, setPGenders] = useState([]);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [religions, setReligions] = useState([]);
  const [pTitles, setpTitles] = useState([]);
  let user = useSelector((state) => state.user.user);
  const {
    control,
    register,
    watch,
    reset,
    getValues,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (router.query.pageMode != "Add") {
      setValue("ptitleMr", watch("ptitle"));
    }
  }, [watch("ptitle")]);

  useEffect(() => {
    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    if (flag1 || flag2) {
      setDisabled(false);
      console.log("enabled");
    } else {
      setValue(
        "page",
        calculateAge(
          moment(getValues("marriageDate")).format("YYYY"),
          moment(getValues("pbirthDate")).format("YYYY"),
        ),
      );

      setDisabled(true);
      console.log("disabled");
    }
    // setValue("pgender", );
  }, []);
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
  // getPGenders
  const getPGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setPGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getReligion
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getTitles
  const getpTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setpTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // cast
  const [casts, setCasts] = useState([]);

  // getReligion
  const getCasts = () => {
    axios
      .get(`${urls.MR}/transaction/witness/getAllCast`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("pristCaste", r?.data?.mstCastDao);
        setCasts(
          r.data.mstCastDao.map((row) => ({
            id: row.id,
            castName: row.castName,
            castNameMr: row.castNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getPGenders();
    getReligions();
    getpTitles();
    getCasts();
  }, []);

  // useEffect(() => {
  //   setValue(
  //     'page',
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('pbirthDate')).format('YYYY'),
  //   )
  //   // dateConverter()
  // }, [getValues('marriageDate'),getValues('pbirthDate')])

  // const dateConverter = (pBirthDates, marriageDate) => {
  //   const pristAge = Math.floor(
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('pbirthDate')).format('YYYY'),
  //   )

  //   console.log('a1234', pristAge)
  // }

  function calculateAge(marriageDate, gbirthDate) {
    const duration = moment.duration(
      moment(marriageDate).diff(moment(gbirthDate)),
    );
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    return years;
  }

  const ageDiff = calculateAge(
    moment(getValues("marriageDate")).format("YYYY-MM-DD"),
    moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
  );

  useEffect(() => {
    setValue("ptitleMr", getValues("ptitle"));
  }, [getValues("ptitle")]);

  useEffect(() => {
    console.log("aaaaaaaaalaaaaaa", watch("page"));
    if (Number(watch("page")) < 18 && Number(watch("page")) > 0) {
      setError("page", {
        message:
          language == "en"
            ? "Priest Age should be greater than or eqaul to 18 at the time of Marriage"
            : "विवाहाच्या वेळी पुजारीचे वय १८ पेक्षा जास्त किंवा समतुल्य असावे!",
      });
    } else {
      clearErrors("page");
    }
  }, [watch("page")]);

  // view - Priest
  return (
    <>
      <div className={styles.small}>
        <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
            marginTop: "25px",
          }}
        >
          <p>
            <blink className={styles.blink}>
              {<FormattedLabel id="onlyMHR" />}
            </blink>
          </p>
        </h4>
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="priestDetails" />}{" "}
            </h3>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="personalDetails" />}
            </h3>
          </div>
        </div>

        <div className={styles.rowName}>
          {/* <div>
            <FormControl
              variant="standard"
              error={!!errors.ptitle}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("ptitleMr", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {pTitles &&
                      pTitles.map((ptitle, index) => (
                        <MenuItem key={index} value={ptitle.id}>
                      
                          {language == "en" ? ptitle?.title : ptitle?.titlemr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ptitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.ptitle ? errors.ptitle.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          <div>
            <Transliteration
              _key={"pfName"}
              labelName={"pfName"}
              fieldName={"pfName"}
              updateFieldName={"pfNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"pfNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="firstName" required />}
              error={!!errors.pfName}
              helperText={errors?.pfName ? errors.pfName.message : null}
            />
            {/* <TextField
              // InputLabelProps={{ shrink: (watch('pfName') ? true : false) || (router.query.pfName ? true : false) }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              variant="standard"
              disabled={disabled}
              {...register("pfName")}
              error={!!errors.pfName}
              helperText={errors?.pfName ? errors.pfName.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"pmName"}
              labelName={"pmName"}
              fieldName={"pmName"}
              updateFieldName={"pmNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"pmNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="middleName" />}
              error={!!errors.pmName}
              helperText={errors?.pmName ? errors.pmName.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("pmName") ? true : false) ||
                  (router.query.pmName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              disabled={disabled}
              {...register("pmName")}
              error={!!errors.pmName}
              helperText={errors?.pmName ? errors.pmName.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"plName"}
              labelName={"plName"}
              fieldName={"plName"}
              updateFieldName={"plNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"plNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              error={!!errors.plName}
              helperText={errors?.plName ? errors.plName.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("plName") ? true : false) ||
                  (router.query.plName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              disabled={disabled}
              {...register("plName")}
              error={!!errors.plName}
              helperText={errors?.plName ? errors.plName.message : null}
            /> */}
          </div>
        </div>
        <div className={styles.rowName}>
          {/* <div>
            <FormControl
              variant="standard"
              error={!!errors.ptitleMr}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="titlemr" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("ptitle", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {pTitles &&
                      pTitles.map((ptitle, index) => (
                        <MenuItem key={index} value={ptitle.id}>
                          {ptitle?.titlemr}
                         
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ptitleMr"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.ptitleMr ? errors.ptitleMr.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          <div>
            <Transliteration
              _key={"pfNameMr"}
              labelName={"pfNameMr"}
              fieldName={"pfNameMr"}
              updateFieldName={"pfName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"pfName"}
              InputLabelProps={{
                shrink: watch("pfNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="firstNamemr" required />}
              error={!!errors.pfNameMr}
              helperText={errors?.pfNameMr ? errors.pfNameMr.message : null}
            />
            {/* <TextField
              // InputLabelProps={{ shrink: (watch('pfName') ? true : false) || (router.query.pfName ? true : false) }}
              id="standard-basic"
              label={<FormattedLabel id="firstNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("firstNamemr")}
              error={!!errors.pfNameMr}
              helperText={errors?.pfNameMr ? errors.pfNameMr.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"pmNameMr"}
              labelName={"pmNameMr"}
              fieldName={"pmNameMr"}
              updateFieldName={"pmName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"pmName"}
              InputLabelProps={{
                shrink: watch("pfNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" />}
              error={!!errors.pmNameMr}
              helperText={errors?.pmNameMr ? errors.pmNameMr.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("pmNameMr") ? true : false) ||
                  (router.query.pmNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="middleNamemr" />}
              variant="standard"
              disabled={disabled}
              {...register("pmNameMr")}
              error={!!errors.pmNameMr}
              helperText={errors?.pmNameMr ? errors.pmNameMr.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"plNameMr"}
              labelName={"plNameMr"}
              fieldName={"plNameMr"}
              updateFieldName={"plName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"plName"}
              InputLabelProps={{
                shrink: watch("plNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              error={!!errors.plNameMr}
              helperText={errors?.plNameMr ? errors.plNameMr.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("plNameMr") ? true : false) ||
                  (router.query.plNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("plNameMr")}
              error={!!errors.plNameMr}
              helperText={errors?.plNameMr ? errors.plNameMr.message : null}
            /> */}
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl sx={{ marginTop: 0 }} error={!!errors.pbirthDate}>
              <Controller
                control={control}
                name="pbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      maxDate={moment(new Date())
                        .subtract(18, "years")
                        .calendar()}
                      minDate={moment(new Date())
                        .subtract(100, "years")
                        .calendar()}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 13 }}>
                          {" "}
                          {<FormattedLabel id="BirthDate" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));

                        setValue(
                          "page",
                          calculateAge(
                            moment(getValues("marriageDate")).format("YYYY"),
                            moment(getValues("pbirthDate")).format("YYYY"),
                          ),
                        );
                      }}
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
                              padding: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.pbirthDate ? errors.pbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              // InputLabelProps={{ shrink: watch("page") ? true : false }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              variant="standard"
              type="number"
              // disabled
              {...register("page")}
              error={!!errors.page}
              helperText={errors?.page ? errors.page.message : null}
              // onChange={(e) =>
              //   setValue(
              //     "page",
              //     calculateAge(
              //       moment(getValues("marriageDate")).format("YYYY"),
              //       moment(getValues("pbirthDate")).format("YYYY"),
              //     ),
              //   )
              // }
            />
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.pgender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("ptitle", value.target.value);
                    }}
                    label="Gender *"
                  >
                    {pGenders &&
                      pGenders.map((pgender, index) => (
                        <MenuItem key={index} value={pgender.id}>
                          {/* {pgender.pgender} */}
                          {language == "en"
                            ? pgender?.gender
                            : pgender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="pgender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.pgender ? errors.pgender.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              inputProps={{ maxLength: 12 }}
              InputLabelProps={{
                shrink:
                  (watch("paadharNo") ? true : false) ||
                  (router.query.paadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" />}
              variant="standard"
              disabled={disabled}
              {...register("paadharNo")}
              error={!!errors.paadharNo}
              helperText={errors?.paadharNo ? errors.paadharNo.message : null}
            />
          </div>
        </div>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          xl={4}
          className={styles.row}
          // style={{ marginRight: "25%" }}
        >
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pemail") ? true : false) ||
                  (router.query.pemail ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              disabled={disabled}
              {...register("pemail")}
              error={!!errors.pemail}
              helperText={errors?.pemail ? errors.pemail.message : null}
            />
          </Grid>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.preligionByBirth}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion1" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Religion by Birth"
                  >
                    {religions &&
                      religions.map((preligionByBirth, index) => (
                        <MenuItem key={index} value={preligionByBirth.id}>
                          {/* {preligionByBirth.preligionByBirth} */}
                          {language == "en"
                            ? preligionByBirth?.religion
                            : preligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="preligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.preligionByBirth
                  ? errors.preligionByBirth.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.preligionByAdoption}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion2" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Religion by Adoption"
                  >
                    {religions &&
                      religions.map((preligionByAdoption, index) => (
                        <MenuItem key={index} value={preligionByAdoption.id}>
                          {/* {preligionByAdoption.preligionByAdoption} */}
                          {language == "en"
                            ? preligionByAdoption?.religion
                            : preligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="preligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.preligionByAdoption
                  ? errors.preligionByAdoption.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: "0" }}
              error={!!errors.pcasts}
            >
              <Controller
                name="pcasts"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    disabled={disabled}
                    variant="standard"
                    id="controllable-states-demo"
                    sx={{ width: 230 }}
                    onChange={(event, newValue) => {
                      console.log("caste", event, newValue);
                      onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                    }}
                    value={casts?.find((data) => data?.id === value) || null}
                    options={casts.sort((a, b) =>
                      language === "en" ? a.castName : a.castNameMr,
                    )} //! api Data
                    getOptionLabel={(caseMainType) =>
                      language == "en"
                        ? caseMainType?.castName
                        : caseMainType?.castNameMr
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        fullWidth
                        {...params}
                        label={language == "en" ? "Caste" : "जाती"}
                        // variant="outlined"
                        variant="standard"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.pcasts ? errors.pcasts.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </Grid>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                // marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>
        {/* *******************************Start****************************** */}
        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              disabled={disabled}
              variant="standard"
              {...register("pbuildingNo")}
              error={!!errors.pbuildingNo}
              helperText={
                errors?.pbuildingNo ? errors.pbuildingNo.message : null
              }
            />

            {/* <Transliteration
              _key={"bbuildingNo"}
              labelName={"flatBuildingNo"}
              fieldName={"bbuildingNo"}
              updateFieldName={"bbuildingNoMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              disabled={disabled}
              label={<FormattedLabel id="flatBuildingNo" required />}
              error={!!errors.bbuildingNo}
              helperText={
                errors?.bbuildingNo
                  ? errors.bbuildingNo.message
                  : null
              }
            /> */}
          </div>

          <div>
            {/* <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingName") ? true : false) ||
                // (router.query.bbuildingName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingName")}
              error={!!errors.bbuildingName}
              helperText={
                errors?.bbuildingName ? errors.bbuildingName.message : null
              }
            /> */}

            <Transliteration
              _key={"pbuildingName"}
              labelName={"pbuildingName"}
              fieldName={"pbuildingName"}
              updateFieldName={"pbuildingNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"pbuildingNameMr"}
              InputLabelProps={{
                shrink: watch("pbuildingName") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="buildingName" />}
              error={!!errors.pbuildingName}
              helperText={
                errors?.pbuildingName ? errors.pbuildingName.message : null
              }
            />
          </div>
          <div>
            {/* <TextField
              //  InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("broadName") ? true : false) ||
                // (router.query.broadName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("broadName")}
              error={!!errors.broadName}
              helperText={errors?.broadName ? errors.broadName.message : null}
            /> */}

            <Transliteration
              _key={"proadName"}
              labelName={"proadName"}
              fieldName={"proadName"}
              updateFieldName={"proadNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"proadNameMr"}
              InputLabelProps={{
                shrink: watch("proadName") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="roadName" required />}
              error={!!errors.proadName}
              helperText={errors?.proadName ? errors.proadName.message : null}
            />
          </div>
          <div>
            {/* <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blandmark") ? true : false) ||
                // (router.query.blandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              disabled={disabled}
              variant="standard"
              {...register("blandmark")}
              error={!!errors.blandmark}
              helperText={errors?.blandmark ? errors.blandmark.message : null}
            /> */}
            <Transliteration
              _key={"plandmark"}
              labelName={"plandmark"}
              fieldName={"plandmark"}
              updateFieldName={"plandmarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"plandmarkMr"}
              InputLabelProps={{
                shrink: watch("plandmark") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="Landmark" required />}
              error={!!errors.plandmark}
              helperText={errors?.plandmark ? errors.plandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}

              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNomr" />}
              variant="standard"
              disabled={disabled}
              {...register("pbuildingNoMr")}
              error={!!errors.pbuildingNoMr}
              helperText={
                errors?.pbuildingNoMr ? errors.pbuildingNoMr.message : null
              }
            />
          </div>

          <div>
            {/* <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNameMr") ? true : false) ||
                // (router.query.bbuildingNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingNameMr")}
              error={!!errors.bbuildingNameMr}
              helperText={
                errors?.bbuildingNameMr ? errors.bbuildingNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"pbuildingNameMr"}
              labelName={"buildingNamemr"}
              fieldName={"pbuildingNameMr"}
              updateFieldName={"pbuildingName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"pbuildingName"}
              InputLabelProps={{
                shrink: watch("pbuildingNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="buildingNamemr" />}
              error={!!errors.pbuildingNameMr}
              helperText={
                errors?.pbuildingNameMr ? errors.pbuildingNameMr.message : null
              }
            />
          </div>

          <div>
            {/* <TextField
              //  InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("broadNameMr") ? true : false) ||
                // (router.query.broadNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("broadNameMr")}
              error={!!errors.broadNameMr}
              helperText={
                errors?.broadNameMr ? errors.broadNameMr.message : null
              }
            /> */}
            <Transliteration
              _key={"proadNameMr"}
              labelName={"proadNameMr"}
              fieldName={"proadNameMr"}
              updateFieldName={"proadName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"proadName"}
              InputLabelProps={{
                shrink: watch("proadNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="roadNamemr" required />}
              error={!!errors.proadNameMr}
              helperText={
                errors?.proadNameMr ? errors.proadNameMr.message : null
              }
            />
          </div>

          <div>
            {/* <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blandmarkMr") ? true : false) ||
                // (router.query.blandmarkMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              variant="standard"
              disabled={disabled}
              {...register("blandmarkMr")}
              error={!!errors.blandmarkMr}
              helperText={
                errors?.blandmarkMr ? errors.blandmarkMr.message : null
              }
            /> */}

            <Transliteration
              _key={"plandmarkMr"}
              labelName={"plandmarkMr"}
              fieldName={"plandmarkMr"}
              updateFieldName={"plandmark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"plandmark"}
              InputLabelProps={{
                shrink: watch("plandmarkMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="Landmarkmr" required />}
              error={!!errors.plandmarkMr}
              helperText={
                errors?.plandmarkMr ? errors.plandmarkMr.message : null
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            {/* <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bcityName") ? true : false) ||
                // (router.query.bcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("bcityName")}
              error={!!errors.bcityName}
              helperText={errors?.bcityName ? errors.bcityName.message : null}
            /> */}

            <Transliteration
              _key={"pcityName"}
              labelName={"cityName"}
              fieldName={"pcityName"}
              updateFieldName={"pcityNameMr"}
              targetError={"pcityNameMr"}
              InputLabelProps={{
                shrink: watch("pcityNameMr") ? true : false,
              }}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="cityName" required />}
              error={!!errors.pcityName}
              helperText={errors?.pcityName ? errors.pcityName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={
                {
                  // shrink: temp,
                  // (watch("pstate") ? true : false) ||
                  // (router.query.pstate ? true : false),
                }
              }
              defaultValue="Maharashtra"
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              disabled
              variant="standard"
              {...register("pstate")}
              error={!!errors.pstate}
              helperText={errors?.pstate ? errors.pstate.message : null}
            />
          </div>

          <div>
            {/* <TextField
              //   InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bcityNameMr") ? true : false) ||
                // (router.query.bcityNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("bcityNameMr")}
              error={!!errors.bcityNameMr}
              helperText={
                errors?.bcityNameMr ? errors.bcityNameMr.message : null
              }
            /> */}
            <Transliteration
              _key={"pcityNameMr"}
              labelName={"pcityNameMr"}
              fieldName={"pcityNameMr"}
              updateFieldName={"cityName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"cityName"}
              InputLabelProps={{
                shrink: watch("pcityNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="cityNamemr" required />}
              error={!!errors.pcityNameMr}
              helperText={
                errors?.pcityNameMr ? errors.pcityNameMr.message : null
              }
            />
          </div>
          <div>
            <TextField
              defaultValue="महाराष्ट्र"
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={
                {
                  // shrink: temp,
                  // (watch("pstateMr") ? true : false) ||
                  // (router.query.pstateMr ? true : false),
                }
              }
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              disabled
              variant="standard"
              {...register("pstateMr")}
              error={!!errors.pstateMr}
              helperText={errors?.pstateMr ? errors.pstateMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              inputProps={{ maxLength: 6 }}
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={
                {
                  // shrink: temp,
                  // (watch("ppincode") ? true : false) ||
                  // (router.query.ppincode ? true : false),
                }
              }
              id="standard-basic"
              disabled={disabled}
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              {...register("ppincode")}
              error={!!errors.ppincode}
              helperText={errors?.ppincode ? errors.ppincode.message : null}
            />
          </div>

          <div>
            <TextField
              inputProps={{ maxLength: 10 }}
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink:
                  (watch("pmobileNo") ? true : false) ||
                  (router.query.pmobileNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              disabled={disabled}
              {...register("pmobileNo")}
              error={!!errors.pmobileNo}
              helperText={errors?.pmobileNo ? errors.pmobileNo.message : null}
            />
          </div>
        </div>
        {/* *******************************End****************************** */}

        {/* <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pbuildingNo") ? true : false) ||
                  (router.query.pbuildingNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("pbuildingNo")}
              error={!!errors.pbuildingNo}
              helperText={
                errors?.pbuildingNo ? errors.pbuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pbuildingName") ? true : false) ||
                  (router.query.pbuildingName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("pbuildingName")}
              error={!!errors.pbuildingName}
              helperText={
                errors?.pbuildingName ? errors.pbuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("proadName") ? true : false) ||
                  (router.query.proadName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("proadName")}
              error={!!errors.proadName}
              helperText={errors?.proadName ? errors.proadName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("plandmark") ? true : false) ||
                  (router.query.plandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              variant="standard"
              disabled={disabled}
              {...register("plandmark")}
              error={!!errors.plandmark}
              helperText={errors?.plandmark ? errors.plandmark.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pcityName") ? true : false) ||
                  (router.query.pcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("pcityName")}
              error={!!errors.pcityName}
              helperText={errors?.pcityName ? errors.pcityName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pstate") ? true : false) ||
                  (router.query.pstate ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              variant="standard"
              disabled={disabled}
              {...register("pstate")}
              error={!!errors.pstate}
              helperText={errors?.pstate ? errors.pstate.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("ppincode") ? true : false) ||
                  (router.query.ppincode ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              disabled={disabled}
              {...register("ppincode")}
              error={!!errors.ppincode}
              helperText={errors?.ppincode ? errors.ppincode.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pmobileNo") ? true : false) ||
                  (router.query.pmobileNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              disabled={disabled}
              {...register("pmobileNo")}
              error={!!errors.pmobileNo}
              helperText={errors?.pmobileNo ? errors.pmobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pbuildingNoMr") ? true : false) ||
                  (router.query.pbuildingNoMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("pbuildingNoMr")}
              error={!!errors.pbuildingNoMr}
              helperText={
                errors?.pbuildingNoMr ? errors.pbuildingNoMr.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pbuildingNameMr") ? true : false) ||
                  (router.query.pbuildingNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("pbuildingNameMr")}
              error={!!errors.pbuildingNameMr}
              helperText={
                errors?.pbuildingNameMr ? errors.pbuildingNameMr.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("proadNameMr") ? true : false) ||
                  (router.query.proadNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("proadNameMr")}
              error={!!errors.proadNameMr}
              helperText={errors?.proadNameMr ? errors.proadNameMr.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("plandmarkMr") ? true : false) ||
                  (router.query.plandmarkMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              variant="standard"
              disabled={disabled}
              {...register("plandmarkMr")}
              error={!!errors.plandmarkMr}
              helperText={errors?.plandmarkMr ? errors.plandmarkMr.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pcityNameMr") ? true : false) ||
                  (router.query.pcityNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("pcityNameMr")}
              error={!!errors.pcityNameMr}
              helperText={errors?.pcityNameMr ? errors.pcityNameMr.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("pstateMr") ? true : false) ||
                  (router.query.pstateMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              variant="standard"
              disabled={disabled}
              {...register("pstateMr")}
              error={!!errors.pstateMr}
              helperText={errors?.pstateMr ? errors.pstateMr.message : null}
            />
          </div>
          
        </div> */}
      </div>
    </>
  );
};
export default PriestDetails;
