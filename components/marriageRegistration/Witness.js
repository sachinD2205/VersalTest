import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../marriageRegistration/transliteration";
import styles from "../marriageRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// witness
const Witness = () => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [wdisabled, setwDisabled] = useState(true);

  const [aadharFieldActive, setAadharFieldActive] = useState(false);
  let user = useSelector((state) => state.user.user);
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    let flag3 = router.query.pageMode === "View";
    console.log("flag1", flag1, router.query.pageMode);
    if (flag1 || flag2) {
      console.log("flag1 || flag2", flag1, flag2);
      setDisabled(false);
      console.log("enabled");
    } else if (flag3) {
      setDisabled(true);
    } else {
      setDisabled(false);
      console.log("disabled");
    }
  }, [router.query.pageMode, router.query.role]);

  // useEffect(() => {
  //   dateConverter()
  // }, [])

  // const dateConverter = (gBirthDates, marriageDate) => {
  //   const groomAge = Math.floor(
  //     moment(getValues('marriageDate')).format('YYYY') -
  //       moment(getValues('witnessDob')).format('YYYY'),
  //   )

  //   console.log('a1234', groomAge)
  // }
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
  // genders
  const [genderKeys, setgenderKeys] = useState([]);

  // getGGenders
  const getgenderKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgenderKeys(
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

  // Titles
  const [wTitles, setwTitles] = useState([]);
  // getTitles
  const getwTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setwTitles(
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

  // Status at time mR
  const [witnessRelations, setwitnessRelations] = useState([]);

  // getStatus at time mR
  const getwitnessRelations = () => {
    axios
      .get(`${urls.MR}/master/relation/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setwitnessRelations(
          r.data.relation.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMar: row.relationMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getgenderKeys();
    getwTitles();
    getwitnessRelations();
  }, []);

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    },
  );

  const [witnessAddBtn, setWitnessAddBtn] = useState(false);
  // if (fields.length == 2) {
  //   setWitnessAddBtn(true);
  // }

  //  Append Function
  const appendFun = () => {
    append({
      wtitle: "",
      wtitleMr: "",
      witnessFName: "",
      witnessMName: "",
      witnessLName: "",
      witnessFNameMr: "",
      witnessLNameMr: "",
      witnessMNameMr: "",
      genderKey: "",
      witnessAddressC: "",
      witnessAddressCMar: "",
      witnessaadharNo: "",
      witnessMobileNo: "",
      emailAddress: "",
      witnessAge: "",
      witnessRelation: "",
      witnessDocumentKey: "",
      witnessDob: null,
      witnessOccupation: "",
      witnessOccupationMr: "",
      witnessOccupationAddress: "",
      witnessOccupationAddressMr: "",
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    if (getValues(`witnesses.length`) == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`witnesses.length`) >= 3) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

  useEffect(() => {
    dateConverter();
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
      setwDisabled(false);
      console.log("enabled");
    } else {
      setValue(
        "witnessAge",
        calculateAge(
          moment(getValues("marriageDate")).format("YYYY"),
          moment(getValues("witnessDob")).format("YYYY"),
        ),
      );

      setwDisabled(true);
      console.log("disabled");
    }
  }, []);

  const dateConverter = (witnessDobs) => {
    let marriageDate = new Date(getValues("marriageDate"));
    let dob = new Date(witnessDobs);
    var age = marriageDate.getFullYear() - dob.getFullYear();
    var m = marriageDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && marriageDate.getDate() < dob.getDate())) {
      age--;
    }
    console.log("age", age);
  };
  function calculateAge(marriageDate, witnessDob) {
    const duration = moment.duration(
      moment(marriageDate).diff(moment(witnessDob)),
    );
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();

    return years;
  }

  const ageDiff = calculateAge(
    moment(getValues("marriageDate")).format("YYYY-MM-DD"),
    moment(getValues("witnessDob")).format("YYYY-MM-DD"),
  );

  // NEW CODE FOR AADAHR VALIDATION

  const [showErr, setShowErr] = useState(false);

  useEffect(() => {
    if (aadharFieldActive) {
      localStorage.setItem("showError", true);
      setShowErr(true);
    } else {
      localStorage.setItem("showError", false);
      setShowErr(false);
    }
  }, [aadharFieldActive]);

  const validateAadhaar = (value) => {
    // If the value is empty (i.e., not provided), it is considered valid.
    if (!value || value.trim() === "") {
      return true;
    }

    // Otherwise, check for the Aadhaar card pattern.
    // Modify the pattern as per the Aadhaar card format in your country.
    const aadhaarPattern = /^[0-9]{12}$/;

    if (!aadhaarPattern.test(value)) {
      return "Invalid Aadhaar card number.";
    }

    return true;
  };

  // useEffect(() => {
  //   setValue(
  //     `witnesses?.[index]?.wtitleMr`,
  //     getValues(`witnesses?.[index]?.wtitle`),
  //   );
  // }, [getValues(`witnesses?.[index]?.wtitle`)]);
  //

  // const [runonce,setRunOnce]=useState(true);
  // useEffect(() => {
  //   if (router.query.pageMode != "Add" && watch("witnesses")?.length == 3 && runonce) {
  //     setRunOnce(false);
  //     console.log("before0000:", watch("witnesses"));
  //     setValue(
  //       "witnesses",
  //       watch("witnesses").map((a) => {
  //         return { ...a, wtitleMr: a.wtitle };
  //       })
  //     );
  //     console.log("after0000:", watch("witnesses"));
  //   }
  // }, [watch("witnesses")]);

  return (
    <>
      {fields.map((witness, index) => {
        return (
          <div key={index}>
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
                      color: "white",
                      marginTop: "7px",
                    }}
                  >
                    {<FormattedLabel id="witness" />}
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            <div className={styles.rowName}>
              {/* <div>
                <FormControl
                  variant="standard"
                  error={!!errors?.witnesses?.[index]?.wtitle}
                  sx={{ marginTop: 2 }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="titleInenglish" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        value={field.value}
                        autoFocus
                        onChange={(value) => {
                         
                          setValue(
                            `witnesses.${index}.wtitleMr`,
                            value.target.value
                          );
                          field.onChange(value);
                          if (value.target.value == 1) {
                            console.log(
                              "`witnesses.${index}.genderKey`",
                              `witnesses.${index}.genderKey`
                            );
                            setValue(`witnesses.${index}.genderKey`, 1);
                          } else if (value.target.value == 2) {
                            setValue(`witnesses.${index}.genderKey`, 2);
                          }
                         
                        }}
                        label="Title *"
                        id="component-error"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {wTitles &&
                          wTitles.map((wtitle, index) => (
                            <MenuItem key={index} value={wtitle.id}>
                              {wtitle?.title}
                            
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.wtitle`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                 
                    {errors?.witnesses?.[index]?.wtitle
                      ? errors?.witnesses?.[index]?.wtitle.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div> */}
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessFName`}
                  labelName={`witnesses.${index}.witnessFName`}
                  fieldName={`witnesses.${index}.witnessFName`}
                  updateFieldName={`witnesses.${index}.witnessFNameMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  targetError={`witnesses.${index}.witnessFNameMr`}
                  disabled={disabled}
                  label={<FormattedLabel id="firstName" required />}
                  error={!!errors?.witnesses?.[index]?.witnessFName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessFName
                      ? errors.witnesses?.[index]?.witnessFName.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  sx={{ width: 230 }}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessFName') ? true : false) }}
                  // id="standard-basic"
                  id="component-error"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="firstName" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessFName`)}
                  error={!!errors?.witnesses?.[index]?.witnessFName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessFName
                      ? errors?.witnesses?.[index]?.witnessFName.message
                      : null
                  }
                /> */}
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessMName`}
                  labelName={`witnesses.${index}.witnessMName`}
                  fieldName={`witnesses.${index}.witnessMName`}
                  updateFieldName={`witnesses.${index}.witnessMNameMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  disabled={disabled}
                  targetError={`witnesses.${index}.witnessMNameMr`}
                  label={<FormattedLabel id="middleName" />}
                  error={!!errors?.witnesses?.[index]?.witnessMName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMName
                      ? errors.witnesses?.[index]?.witnessMName.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessMName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMName`)}
                  error={!!errors?.witnesses?.[index]?.witnessMName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMName
                      ? errors?.witnesses?.[index]?.witnessMName.message
                      : null
                  }
                /> */}
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessLName`}
                  labelName={`witnesses.${index}.witnessLName`}
                  fieldName={`witnesses.${index}.witnessLName`}
                  updateFieldName={`witnesses.${index}.witnessLNameMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  disabled={disabled}
                  targetError={`witnesses.${index}.witnessLNameMr`}
                  label={<FormattedLabel id="lastName" required />}
                  error={!!errors?.witnesses?.[index]?.witnessLName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessLName
                      ? errors.witnesses?.[index]?.witnessLName.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessLName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" required />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessLName`)}
                  error={!!errors?.witnesses?.[index]?.witnessLName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessLName
                      ? errors?.witnesses?.[index]?.witnessLName.message
                      : null
                  }
                /> */}
              </div>
            </div>
            <div className={styles.rowName}>
              {/* <div>
                <FormControl
                  variant="standard"
                  error={!!errors?.witnesses?.[index]?.wtitleMr}
                  sx={{ marginTop: 2 }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="titleInmarathi" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        value={field.value}
                        onChange={(value) => {
                          setValue(
                            `witnesses.${index}.wtitle`,
                            value.target.value
                          );
                          field.onChange(value);
                          if (value.target.value == 1) {
                            console.log(
                              "`witnesses.${index}.genderKey`",
                              `witnesses.${index}.genderKey`
                            );
                            setValue(`witnesses.${index}.genderKey`, 1);
                          } else if (value.target.value == 2) {
                            setValue(`witnesses.${index}.genderKey`, 2);
                          }
                          
                        }}
                        label="Title *"
                        id="component-error"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {wTitles &&
                          wTitles.map((wtitleMr, index) => (
                            <MenuItem key={index} value={wtitleMr.id}>
                              {wtitleMr?.titlemr}
                              
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.wtitleMr`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                
                    {errors?.witnesses?.[index]?.wtitleMr
                      ? errors?.witnesses?.[index]?.wtitleMr.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div> */}
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessFNameMr`}
                  labelName={`witnesses.${index}.witnessFNameMr`}
                  fieldName={`witnesses.${index}.witnessFNameMr`}
                  updateFieldName={`witnesses.${index}.witnessFName`}
                  targetError={`witnesses.${index}.witnessFName`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  disabled={disabled}
                  label={<FormattedLabel id="firstNamemr" required />}
                  error={!!errors?.witnesses?.[index]?.witnessFNameMr}
                  helperText={
                    errors?.witnesses?.[index]?.witnessFNameMr
                      ? errors.witnesses?.[index]?.witnessFNameMr.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  sx={{ width: 230 }}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessFName') ? true : false) }}
                  // id="standard-basic"
                  id="component-error"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="firstName" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessFName`)}
                  error={!!errors?.witnesses?.[index]?.witnessFName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessFName
                      ? errors?.witnesses?.[index]?.witnessFName.message
                      : null
                  }
                /> */}
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessMNameMr`}
                  labelName={`witnesses.${index}.witnessMNameMr`}
                  fieldName={`witnesses.${index}.witnessMNameMr`}
                  updateFieldName={`witnesses.${index}.witnessMName`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  targetError={`witnesses.${index}.witnessMName`}
                  disabled={disabled}
                  label={<FormattedLabel id="middleNamemr" />}
                  error={!!errors?.witnesses?.[index]?.witnessMNameMr}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMNameMr
                      ? errors.witnesses?.[index]?.witnessMNameMr.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessMName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMName`)}
                  error={!!errors?.witnesses?.[index]?.witnessMName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMName
                      ? errors?.witnesses?.[index]?.witnessMName.message
                      : null
                  }
                /> */}
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessLNameMr`}
                  labelName={`witnesses.${index}.witnessLNameMr`}
                  fieldName={`witnesses.${index}.witnessLNameMr`}
                  updateFieldName={`witnesses.${index}.witnessLName`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  targetError={`witnesses.${index}.witnessLName`}
                  disabled={disabled}
                  label={<FormattedLabel id="lastNamemr" required />}
                  error={!!errors?.witnesses?.[index]?.witnessLNameMr}
                  helperText={
                    errors?.witnesses?.[index]?.witnessLNameMr
                      ? errors.witnesses?.[index]?.witnessLNameMr.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessLName') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" required />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessLName`)}
                  error={!!errors?.witnesses?.[index]?.witnessLName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessLName
                      ? errors?.witnesses?.[index]?.witnessLName.message
                      : null
                  }
                /> */}
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={errors?.witnesses?.[index]?.genderKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="Gender" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => {
                          setValue(
                            `witnesses.${index}.genderKey`,
                            value.target.value,
                          );
                          field.onChange(value);
                          console.log(
                            "`witnesses.${index}.wtitle`",
                            `witnesses.${index}.wtitle`,
                          );
                          if (value.target.value == 1) {
                            console.log(
                              "`witnesses.${index}.wtitle`",
                              `witnesses.${index}.wtitle`,
                            );
                            setValue(`witnesses.${index}.wtitle`, 1);
                          } else if (value.target.value == 2) {
                            setValue(`witnesses.${index}.wtitle`, 2);
                          }
                        }}
                        label="Gender *"
                      >
                        {genderKeys &&
                          genderKeys.map((genderKey, index) => (
                            <MenuItem key={index} value={genderKey.id}>
                              {/* {gGender.gGender} */}
                              {language == "en"
                                ? genderKey?.gender
                                : genderKey?.genderMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.genderKey`}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.witnesses?.[index]?.genderKey
                      ? errors?.witnesses?.[index]?.genderKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessAddressC`}
                  labelName={`witnesses.${index}.witnessAddressC`}
                  fieldName={`witnesses.${index}.witnessAddressC`}
                  updateFieldName={`witnesses.${index}.witnessAddressCMar`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  targetError={`witnesses.${index}.witnessAddressCMar`}
                  disabled={disabled}
                  label={<FormattedLabel id="address" required />}
                  error={!!errors?.witnesses?.[index]?.witnessAddressC}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAddressC
                      ? errors.witnesses?.[index]?.witnessAddressC.message
                      : null
                  }
                />
                {/* <TextField
                  disabled={disabled}
                  //  InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessAddressC') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="address" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAddressC`)}
                  error={!!errors?.witnesses?.[index]?.witnessAddressC}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAddressC
                      ? errors?.witnesses?.[index]?.witnessAddressC.message
                      : null
                  }
                /> */}
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessAddressCMar`}
                  labelName={`witnesses.${index}.witnessAddressCMar`}
                  fieldName={`witnesses.${index}.witnessAddressCMar`}
                  updateFieldName={`witnesses.${index}.witnessAddressC`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  targetError={`witnesses.${index}.witnessAddressC`}
                  disabled={disabled}
                  label={<FormattedLabel id="addressMr" required />}
                  error={!!errors?.witnesses?.[index]?.witnessAddressCMar}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAddressCMar
                      ? errors.witnesses?.[index]?.witnessAddressCMar.message
                      : null
                  }
                />
              </div>
              <div>
                <TextField
                  inputProps={{ maxLength: 12 }}
                  disabled={disabled}
                  // InputLabelProps={{ shrink:watch("witnessaadharNo")? true:false }}
                  InputLabelProps={{ shrink: true }}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessaadharNo') ? true : false) }}
                  sx={{ width: 230 }}
                  id="aadharNumber"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="AadharNo" />}
                  variant="standard"
                  type="text"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessaadharNo`, {
                    validate: validateAadhaar,
                  })}
                  error={!!errors?.witnesses?.[index]?.witnessaadharNo}
                  helperText={
                    errors?.witnesses?.[index]?.witnessaadharNo
                      ? errors?.witnesses?.[index]?.witnessaadharNo.message
                      : null
                  }
                />

                {/* <TextareaAutosize
                  error={!!errors.aadhaar}
                  aria-label="minimum height"
                  minRows={4}
                  placeholder="Enter your Aadhaar card number (optional)"
                  style={{ width: 700 }}
                  name="aadhaar"
                  control={control}
                  {...register("aadhaar", { validate: validateAadhaar })}
                /> */}

                {/* <TextField
                  disabled={disabled}
                  type="number"
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessaadharNo') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="AadharNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessaadharNo`)}
                  onClick={() => {
                    if (
                      JSON.parse(
                        JSON.stringify(
                          localStorage?.getItem("witnessaadharNo"),
                        ),
                      ).length !== 12
                    ) {
                      setAadharFieldActive(true);
                    } else {
                      setAadharFieldActive(false);
                    }
                  }}
                  onBlur={() => {
                    if (
                      JSON.parse(
                        JSON.stringify(
                          localStorage?.getItem("witnessaadharNo"),
                        ),
                      ).length !== 12 &&
                      JSON.parse(
                        JSON.stringify(
                          localStorage?.getItem("witnessaadharNo"),
                        ),
                      ).length !== 0
                    ) {
                      setAadharFieldActive(true);
                    } else {
                      setAadharFieldActive(false);
                    }
                  }}
                  onChange={(e) => {
                    localStorage.setItem("witnessaadharNo", e.target.value);
                    if (
                      JSON.parse(
                        JSON.stringify(localStorage.getItem("witnessaadharNo")),
                      ).length !== 12
                    ) {
                      setAadharFieldActive(true);
                    } else {
                      setAadharFieldActive(false);
                    }
                  }}
                />
                {showErr && (
                  <FormHelperText style={{ color: "red" }}>
                    <span>Must be 12 digits only</span>
                  </FormHelperText>
                )} */}
              </div>

              {/* <div>
                <TextField
                   
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="phoneNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMobileNo`)}
                  // error={!!errors.witnessMobileNo}
                  // helperText={
                  //   errors?.witnessMobileNo
                  //     ? errors.witnessMobileNo.message
                  //     : null
                  // }
                />
              </div> */}
            </div>

            <div
              className={styles.row}
              // style={{ marginRight: '25%' }}
            >
              <div>
                <TextField
                  inputProps={{ maxLength: 10 }}
                  disabled={disabled}
                  //InputLabelProps={{ shrink: (watch('witnesses.${index}.witnessMobileNo') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessMobileNo`)}
                  error={!!errors?.witnesses?.[index]?.witnessMobileNo}
                  helperText={
                    errors?.witnesses?.[index]?.witnessMobileNo
                      ? errors?.witnesses?.[index]?.witnessMobileNo.message
                      : null
                  }
                />
              </div>
              <div>
                <TextField
                  disabled={disabled}
                  // InputLabelProps={{ shrink: (watch('witnesses.${index}.emailAddress') ? true : false) }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="email" />}
                  //  disabled={disabledrouter?.query?.disabled}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.emailAddress`)}
                  error={!!errors?.witnesses?.[index]?.emailAddress}
                  helperText={
                    errors?.witnesses?.[index]?.emailAddress
                      ? errors?.witnesses?.[index]?.emailAddress.message
                      : null
                  }
                />
              </div>
              <div>
                <FormControl
                  error={!!errors?.witnesses?.[index]?.witnessDob}
                  sx={{ marginTop: 0 }}
                >
                  <Controller
                    control={control}
                    name="witnessDob"
                    InputLabelProps={{
                      shrink: watch("witnessDob") ? true : false,
                    }}
                    defaultValue={null}
                    format="DD/MM/YYYY"
                    key={witness.id}
                    {...register(`witnesses.${index}.witnessDob`)}
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
                            <span style={{ fontSize: 16 }}>
                              {<FormattedLabel id="BirthDate" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                            let marriageDate = new Date(
                              getValues("marriageDate"),
                            );
                            let dob = new Date(date);
                            var age =
                              marriageDate.getFullYear() - dob.getFullYear();

                            console.log("age", age, marriageDate, dob);
                            setValue(`witnesses.${index}.witnessAge`, age);

                            if (Number(age) < 18) {
                              setError(`witnesses.${index}.witnessAge`, {
                                message:
                                  language == "en"
                                    ? "Witness Age should be greater than or equal to 18 at the time of Marriage"
                                    : "लग्नाच्या वेळी साक्षीदाराचे वय १८ पेक्षा जास्त किंवा बरोबर असावे!",
                              });
                            } else {
                              clearErrors(`witnesses.${index}.witnessAge`);
                            }

                            // setValue(
                            //   `witnesses.${index}.witnessAge`,
                            //   calculateAge(
                            //     moment(getValues("marriageDate")).format("YYYY-MM-DD"),
                            //     moment(getValues("witnessDob")).format("YYYY-MM-DD"),
                            //   ),
                            // );
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
                    {errors?.witnesses?.[index]?.witnessDob
                      ? errors?.witnesses?.[index]?.witnessDob.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div>
                <TextField
                  inputProps={{ maxLength: 2 }}
                  // disabled
                  disabled={disabled || wdisabled}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  //  disabled={disabledrouter?.query?.disabled}
                  label={<FormattedLabel id="Age" required />}
                  variant="standard"
                  key={witness.id}
                  {...register(`witnesses.${index}.witnessAge`)}
                  error={!!errors?.witnesses?.[index]?.witnessAge}
                  helperText={
                    errors?.witnesses?.[index]?.witnessAge
                      ? errors?.witnesses?.[index]?.witnessAge.message
                      : null
                  }
                />
              </div>

              {/* <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.witnessDocumentKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="wDocument" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="  Witness Document *"
                      >
                        {witnessDocumentKeys &&
                          witnessDocumentKeys.map(
                            (witnessDocumentKey, index) => (
                              <MenuItem
                                key={index}
                                value={witnessDocumentKey.id}
                              >
                                {witnessDocumentKey.witnessDocumentKey}
                              </MenuItem>
                            ),
                          )}

                        <MenuItem value={1}>Pan Card</MenuItem>
                        <MenuItem value={2}>Aadhaar card</MenuItem>
                        <MenuItem value={3}>bonafide certificate</MenuItem>
                      </Select>
                    )}
                    name={`witnesses.${index}.witnessDocumentKey`}
                    key={witness.id}
                    control={control}
                    defaultValue=""
                  />

                  <FormHelperText>
                    {errors?.witnessDocumentKey
                      ? errors.witnessDocumentKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div> */}
            </div>
            <div
              className={styles.row}
              // style={{ marginRight: '25%' }}
            >
              <div>
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  // error={!!errors?.witnessRelation?.[index]}
                  error={errors?.witnesses?.[index]?.witnessRelation}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="wRelation" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        sx={{ width: 230 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="  Witness Relation *"
                      >
                        {witnessRelations &&
                          witnessRelations.map((witnessRelation, index) => (
                            <MenuItem key={index} value={witnessRelation.id}>
                              {/* {witnessRelation.witnessRelation} */}
                              {language == "en"
                                ? witnessRelation?.relation
                                : witnessRelation?.relationMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`witnesses.${index}.witnessRelation`}
                    key={witness.id}
                    control={control}
                    defaultValue=""
                  />

                  <FormHelperText>
                    {errors?.witnesses?.[index]?.witnessRelation
                      ? errors?.witnesses?.[index]?.witnessRelation.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessOccupation`}
                  labelName={`witnesses.${index}.witnessOccupation`}
                  fieldName={`witnesses.${index}.witnessOccupation`}
                  updateFieldName={`witnesses.${index}.witnessOccupationMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  targetError={`witnesses.${index}.witnessOccupationMr`}
                  disabled={disabled}
                  label={<FormattedLabel id="gOccupation" />}
                  error={!!errors.pcityName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessOccupation
                      ? errors.witnesses?.[index]?.witnessOccupation.message
                      : null
                  }
                />
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessOccupationAddress`}
                  labelName={`witnesses.${index}.witnessOccupationAddress`}
                  fieldName={`witnesses.${index}.witnessOccupationAddress`}
                  updateFieldName={`witnesses.${index}.witnessOccupationAddressMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  targetError={`witnesses.${index}.witnessOccupationAddressMr`}
                  disabled={disabled}
                  label={<FormattedLabel id="gOccupationAddress" />}
                  error={!!errors.pcityName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessOccupationAddress
                      ? errors.witnesses?.[index]?.witnessOccupationAddress
                          .message
                      : null
                  }
                />
              </div>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessOccupationMr`}
                  labelName={`witnesses.${index}.witnessOccupationMr`}
                  fieldName={`witnesses.${index}.witnessOccupationMr`}
                  updateFieldName={`witnesses.${index}.witnessOccupation`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  targetError={`witnesses.${index}.witnessOccupation`}
                  disabled={disabled}
                  label={<FormattedLabel id="gOccupationMr" />}
                  error={!!errors.pcityName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessOccupationMr
                      ? errors.witnesses?.[index]?.witnessOccupationMr.message
                      : null
                  }
                />
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <Transliteration
                  _key={`witnesses.${index}.witnessOccupationAddressMr`}
                  labelName={`witnesses.${index}.witnessOccupationAddressMr`}
                  fieldName={`witnesses.${index}.witnessOccupationAddressMr`}
                  updateFieldName={`witnesses.${index}.witnessOccupationAddress`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  targetError={`witnesses.${index}.witnessOccupationAddress`}
                  disabled={disabled}
                  label={<FormattedLabel id="gOccupationAddressMr" />}
                  error={!!errors.pcityName}
                  helperText={
                    errors?.witnesses?.[index]?.witnessOccupationAddressMr
                      ? errors.witnesses?.[index]?.witnessOccupationAddressMr
                          .message
                      : null
                  }
                />
              </div>
            </div>
            {/* <Button
               disabled={disabledbtnValue}
              onClick={() => index + 1}
              variant='contained'
            >
              Add
            </Button> */}
          </div>
        );
      })}
      {router?.query?.pageMode === "Add" ||
      router?.query?.pageMode === "Edit" ? (
        <div className={styles.row} style={{ marginTop: 50 }}>
          <Button
            disabled={fields.length > 2 ? true : btnValue}
            onClick={() => buttonValueSetFun()}
            variant="contained"
          >
            {<FormattedLabel id="witnessAdd" />}
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Witness;

// import {
//   Button,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   TextField,
//   Paper,
// } from '@mui/material'
// import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
// import styles from '../../newMarriageRegistration/view.module.css'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import urls from '../../../../URLS/urls'
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
// import { useSelector } from 'react-redux'

// // witness
// const Witness = () => {
//   const {
//     control,
//     register,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useFormContext()
//   const language = useSelector((state) => state?.labels.language)

//   // genders
//   const [genderKeys, setgenderKeys] = useState([])

//   // getGGenders
//   const getgenderKeys = () => {
//     axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//       setgenderKeys(
//         r.data.map((row) => ({
//           id: row.id,
//           gender: row.gender,
//           genderMr: row.genderMr,
//         })),
//       )
//     })
//   }

//   // Titles
//   const [wTitles, setwTitles] = useState([])
//   // getTitles
//   const getwTitles = () => {
//     axios.get(`${urls.BaseURL}/title/getAll`).then((r) => {
//       setwTitles(
//         r.data.map((row) => ({
//           id: row.id,
//           title: row.title,
//           titlemr: row.titlemr,
//         })),
//       )
//     })
//   }

//   // // genders
//   // const [gGenders, setGGenders] = useState([]);

//   // // getGGenders
//   // const getGGenders = () => {
//   //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//   //     setGGenders(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         gGender: row.gender,
//   //       })),
//   //     );
//   //   });
//   // };

//   // // genders
//   // const [gGenders, setGGenders] = useState([]);

//   // // getGGenders
//   // const getGGenders = () => {
//   //   axios.get(`${urls.BaseURL}/gender/getAll`).then((r) => {
//   //     setGGenders(
//   //       r.data.map((row) => ({
//   //         id: row.id,
//   //         gGender: row.gender,
//   //       })),
//   //     );
//   //   });
//   // };

//   useEffect(() => {
//     getgenderKeys()
//     getwTitles()
//   }, [])

//   //key={field.id}
//   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
//     {
//       control, // control props comes from useForm (optional: if you are using FormContext)
//       name: 'witnesses', // unique name for your Field Array
//     },
//   )

//   const [witnessAddBtn, setWitnessAddBtn] = useState(false)
//   // if (fields.length == 2) {
//   //   setWitnessAddBtn(true);
//   // }

//   //  Append Function
//   const appendFun = () => {
//     append({
//       wTitles: '',
//       witnessFName: '',
//       witnessMName: '',
//       witnessLName: '',
//       genderKey: '',
//       witnessAddressC: '',
//       aadharNo: '',
//       witnessMobileNo: '',
//       emailAddress: '',
//       witnessAge: '',
//       witnessRelation: '',
//       witnessDocumentKey: '',
//     })
//   }

//   // Call Append In UseEffect - First Time Only
//   useEffect(() => {
//     if (getValues(`witnesses.length`) == 0) {
//       appendFun()
//     }
//   }, [])

//   const [btnValue, setButtonValue] = useState(false)

//   // Disable Add Button After Three Wintess Add
//   const buttonValueSetFun = () => {
//     if (getValues(`witnesses.length`) >= 3) {
//       setButtonValue(true)
//     } else {
//       appendFun()
//       setButtonValue(false)
//     }
//   }

//   return (
//     <>
//       {fields.map((witness, index) => {
//         return (
//           <div>
//             <div
//               className={styles.row}
//               // style={{
//               //   height: '7px',
//               //   width: '200px',
//               // }}
//             >
//               <div
//                 className={styles.details}
//                 style={{
//                   marginRight: '820px',
//                 }}
//               >
//                 <div
//                   className={styles.h1Tag}
//                   style={{
//                     height: '40px',
//                     width: '300px',
//                   }}
//                 >
//                   <h3
//                     style={{
//                       color: 'white',
//                       marginTop: '7px',
//                     }}
//                   >
//                     {<FormattedLabel id="witness" />}
//                     {`: ${index + 1}`}
//                   </h3>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   error={!!errors.wtitle}
//                   sx={{ marginTop: 2 }}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="title" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Title *"
//                         id="demo-simple-select-standard"
//                         labelId="id='demo-simple-select-standard-label'"
//                       >
//                         {wTitles &&
//                           wTitles.map((wtitle, index) => (
//                             <MenuItem key={index} value={wtitle.id}>
//                               {/* {title.title} */}
//                               {language == 'en'
//                                 ? wtitle?.title
//                                 : wtitle?.titlemr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="wtitle"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.wtitle ? errors.wtitle.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="firstName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessFName`)}
//                   // error={!!errors.witnessFName}
//                   // helperText={
//                   //   errors?.witnessFName ? errors.witnessFName.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="middleName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMName`)}
//                   // error={!!errors.witnessMName}
//                   // helperText={
//                   //   errors?.witnessMName ? errors.witnessMName.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="lastName" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessLName`)}
//                   // error={!!errors.witnessLName}
//                   // helperText={
//                   //   errors?.witnessLName ? errors.witnessLName.message : null
//                   // }
//                 />
//               </div>
//             </div>

//             <div className={styles.row}>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   error={!!errors.genderKey}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="Gender" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="Gender *"
//                       >
//                         {genderKeys &&
//                           genderKeys.map((genderKey, index) => (
//                             <MenuItem key={index} value={genderKey.id}>
//                               {/* {gGender.gGender} */}
//                               {language == 'en'
//                                 ? genderKey?.gender
//                                 : genderKey?.genderMr}
//                             </MenuItem>
//                           ))}
//                       </Select>
//                     )}
//                     name="genderKey"
//                     control={control}
//                     defaultValue=""
//                   />
//                   <FormHelperText>
//                     {errors?.genderKey ? errors.genderKey.message : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="address" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessAddressC`)}
//                   // error={!!errors.witnessAddressC}
//                   // helperText={
//                   //   errors?.witnessAddressC
//                   //     ? errors.witnessAddressC.message
//                   //     : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="AadharNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.aadharNo`)}
//                   // error={!!errors.aadharNo}
//                   // helperText={errors?.aadharNo ? errors.aadharNo.message : null}
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="mobileNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMobileNo`)}
//                   // error={!!errors.witnessMobileNo}
//                   // helperText={
//                   //   errors?.witnessMobileNo
//                   //     ? errors.witnessMobileNo.message
//                   //     : null
//                   // }
//                 />
//               </div>
//               {/* <div>
//                 <TextField

//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="phoneNo" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessMobileNo`)}
//                   // error={!!errors.witnessMobileNo}
//                   // helperText={
//                   //   errors?.witnessMobileNo
//                   //     ? errors.witnessMobileNo.message
//                   //     : null
//                   // }
//                 />
//               </div> */}
//             </div>

//             <div className={styles.row} style={{ marginRight: '25%' }}>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="email" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.emailAddress`)}
//                   // error={!!errors.emailAddress}
//                   // helperText={
//                   //   errors?.emailAddress ? errors.emailAddress.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <TextField
//                   sx={{ width: 230 }}
//                   id="standard-basic"
//                   label={<FormattedLabel id="Age" />}
//                   variant="standard"
//                   key={witness.id}
//                   {...register(`witnesses.${index}.witnessAge`)}
//                   // error={!!errors.witnessAge}
//                   // helperText={
//                   //   errors?.witnessAge ? errors.witnessAge.message : null
//                   // }
//                 />
//               </div>
//               <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   // error={!!errors.witnessRelation}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="wRelation" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="  Witness Relation *"
//                       >
//                         {/* {witnessRelations &&
//                              witnessRelations.map((witnessRelation, index) => (
//                                <MenuItem key={index} value={witnessRelation.id}>
//                                  {witnessRelation.witnessRelation}
//                                </MenuItem>
//                              ))} */}

//                         <MenuItem value="Brother">Brother</MenuItem>
//                         <MenuItem value="Uncle">Uncle</MenuItem>
//                         <MenuItem value="GrandFather">Grand Father</MenuItem>
//                         <MenuItem value="GrandMother">Grand Mother</MenuItem>
//                         <MenuItem value="Sister">Sister</MenuItem>
//                         <MenuItem value="Friend">Friend</MenuItem>
//                       </Select>
//                     )}
//                     name={`witnesses.${index}.witnessRelation`}
//                     key={witness.id}
//                     control={control}
//                     defaultValue=""
//                   />
//                   {/**

//                     <FormHelperText>
//                       {errors?.witnessRelation
//                         ? errors.witnessRelation.message
//                         : null}
//                     </FormHelperText>
//                   */}
//                 </FormControl>
//               </div>
//               {/* <div>
//                 <FormControl
//                   variant="standard"
//                   sx={{ marginTop: 2 }}
//                   error={!!errors.witnessDocumentKey}
//                 >
//                   <InputLabel id="demo-simple-select-standard-label">
//                     {<FormattedLabel id="wDocument" />}
//                   </InputLabel>
//                   <Controller
//                     render={({ field }) => (
//                       <Select
//                         sx={{ width: 230 }}
//                         value={field.value}
//                         onChange={(value) => field.onChange(value)}
//                         label="  Witness Document *"
//                       >
//                         {witnessDocumentKeys &&
//                           witnessDocumentKeys.map(
//                             (witnessDocumentKey, index) => (
//                               <MenuItem
//                                 key={index}
//                                 value={witnessDocumentKey.id}
//                               >
//                                 {witnessDocumentKey.witnessDocumentKey}
//                               </MenuItem>
//                             ),
//                           )}

//                         <MenuItem value={1}>Pan Card</MenuItem>
//                         <MenuItem value={2}>Aadhaar card</MenuItem>
//                         <MenuItem value={3}>bonafide certificate</MenuItem>
//                       </Select>
//                     )}
//                     name={`witnesses.${index}.witnessDocumentKey`}
//                     key={witness.id}
//                     control={control}
//                     defaultValue=""
//                   />

//                   <FormHelperText>
//                     {errors?.witnessDocumentKey
//                       ? errors.witnessDocumentKey.message
//                       : null}
//                   </FormHelperText>
//                 </FormControl>
//               </div> */}
//             </div>
//             {/* <Button
//                disabled={disabledbtnValue}
//               onClick={() => index + 1}
//               variant='contained'
//             >
//               Add
//             </Button> */}
//           </div>
//         )
//       })}
//       <div className={styles.row} style={{ marginTop: 50 }}>
//         <Button
//            disabled={disabledbtnValue}
//           onClick={() => buttonValueSetFun()}
//           variant="contained"
//         >
//           {<FormattedLabel id="witnessAdd" />}
//         </Button>
//       </div>
//     </>
//   )
// }

// export default Witness
