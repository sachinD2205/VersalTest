import {
  Autocomplete,
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
import { toast } from "react-toastify";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../marriageRegistration/transliteration";
import styles from "../marriageRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// view Bride
const BrideDetails = () => {
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
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const user = useSelector((state) => state?.user.user);
  const errorColor = disabled ? "green" : "red";
  // useEffect(() => {
  //   if (router.query.pageMode != "Add") {
  //     setValue("btitleMr", watch("btitle"));
  //   }
  // }, [watch("btitle")]);

  useEffect(() => {
    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    let flag3 = router.query.pageMode === "View";
    if (flag1 || flag2) {
      setDisabled(false);
      console.log("enabled");
    } else if (flag3) {
      setDisabled(true);
    } else {
      setDisabled(false);
      console.log("disabled");
    }
    setValue("bgender", 2);
  }, []);

  useEffect(() => {
    setValue("btitleMar", getValues("btitle"));
    // if (router.query.pageMode === 'Edit' || router.query.pageMode === 'View') {
    // }
  }, [getValues("btitle")]);

  useEffect(() => {
    if (watch("whoAreYou") == 2) {
      setValue("isApplicantGroom", false);
      setValue("isApplicantBride", true);
      addressChange(true);
    }
  }, []);

  const language = useSelector((state) => state?.labels.language);
  // gender
  const [bGenders, setBGenders] = useState([]);

  // getBGenders
  const getBGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setBGenders(
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

  // // Age Proof Document
  // const [bAgeProofDocumentKey, setBAgeProofDocumentKey] = useState([]);

  // // getBAgeProofDocumentKey
  // const getBAgeProofDocumentKey = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/ageProofDocument/getAll`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((r) => {
  //       setBAgeProofDocumentKey(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           bAgeProofDocumentKey: row.typeOfDocument,
  //         })),
  //       );
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  // Id Document
  const [BIdDocumentKeys, setBIdDocumentKeys] = useState([]);

  // getBIdDocumentKeys
  const getBIdDocumentKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/identityProof/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setBIdDocumentKeys(
          r.data.identityProof.map((row) => ({
            id: row.id,
            BIdDocumentKey: row.typeOFDocument,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // resedentialDocumentkey
  const [bResidentialDocumentKeys, setBResidentialDocumentKeys] = useState([]);

  // getBResidentialDocumentKeys
  const getBResidentialDocumentKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/residentialProof/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setBResidentialDocumentKeys(
          r.data.residentialProof.map((row) => ({
            id: row.id,
            bResidentialDocumentKey: row.typeOFDocument,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // religion
  const [religions, setReligions] = useState([]);

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

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.map((row) => ({
            id: row.id,
            title: row.title,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Titles
  const [bTitles, setbTitles] = useState([]);

  // getTitles
  const getbTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setbTitles(
          r.data.title.map((row) => ({
            id: row.id,
            btitle: row.title,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Titles
  const [bTitleMars, setbTitleMars] = useState([]);

  // getTitles
  const getbTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setbTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            btitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Status at time mR
  const [bStatusAtTimeMarriageKeys, setbStatusAtTimeMarriageKeys] = useState(
    [],
  );

  // getStatus at time mR
  const getbStatusAtTimeMarriageKeys = () => {
    axios
      .get(`${urls.MR}/master/maritalstatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setbStatusAtTimeMarriageKeys(
          r.data.maritalStatus.map((row) => ({
            id: row.id,
            statusDetails: row.statusDetails,
            statusDetailsMar: row.statusDetailsMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Disabilities
  const [Disabilities, setDisabilities] = useState([]);

  // getDisabilities
  const getDisabilities = () => {
    axios
      .get(`${urls.CFCURL}/master/typeOfDisability/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDisabilities(
          r.data.typeOfDisability.map((row) => ({
            id: row.id,
            typeOfDisability: row.typeOfDisability,
            typeOfDisabilityMr: row.typeOfDisabilityMr,
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
        console.log("brideCaste", r?.data?.mstCastDao);
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

  // adharNo
  const [adharNo, setAdharNos] = useState([]);

  // adharNo
  const getAdharNos = (value, label) => {
    if (watch("baadharNoOld") != value) {
      clearErrors("baadharNo");
    }
    const finalBody = {
      gaadharNo: label == "gaadharNo" ? value : null,
      baadharNo: label == "baadharNo" ? value : null,
    };

    axios
      .post(`${urls.MR}/transaction/applicant/validate`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let errors = r.data;
        setValue("errorss", errors);
        console.log("errors4321", errors);
        // console.log("errors1234", watch("errors"));
        // setAdharNos();
        // r.data.map((row) => ({
        //   id: row.id,
        // })),
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [temp, setTemp] = useState();

  useEffect(() => {
    if (watch("isApplicantBride") == true) {
      addressChange(true);
    }
  }, [watch("isApplicantBride")]);

  // Address Change
  const addressChange = (e) => {
    // let condt = e.target.checked;
    let condt = e;
    setValue("isApplicantBride", condt);

    console.log("isApplicantBride", getValues("isApplicantBride"));

    if (condt) {
      setValue("btitle", getValues("atitle"));
      setValue("bfName", getValues("afName"));
      setValue("bmName", getValues("amName"));
      setValue("blName", getValues("alName"));
      setValue("bbuildingNo", getValues("aflatBuildingNo"));
      setValue("bbuildingName", getValues("abuildingName"));
      setValue("broadName", getValues("aroadName"));
      setValue("blandmark", getValues("alandmark"));
      setValue("bcityName", getValues("acityName"));
      setValue("bstate", getValues("astate"));
      setValue("bpincode", getValues("apincode"));

      setValue("btitleMar", getValues("atitleMr"));
      setValue("bfNameMr", getValues("afNameMr"));
      setValue("bmNameMr", getValues("amNameMr"));
      setValue("blNameMr", getValues("alNameMr"));
      setValue("bbuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("bbuildingNameMr", getValues("abuildingNameMr"));
      setValue("broadNameMr", getValues("aroadNameMr"));
      setValue("blandmarkMr", getValues("alandmarkMr"));
      setValue("bcityNameMr", getValues("acityNameMr"));
      // setValue('bstateMr', getValues('astateMr'))
      // setValue("bbirthDate", user.dateOfBirth);
      setValue(
        "bbirthDate",
        user.dateOfBirth ? user.dateOfBirth : getValues("bbirthDate"),
      );
      if (getValues("marriageDate")) {
        setValue(
          "bage",
          calculateAge(
            moment(getValues("marriageDate")).format("YYYY"),
            moment(getValues("bbirthDate")).format("YYYY"),
          ),
        );
      }
      // setValue("bgender", user.gender);
      //     setValue("bbirthDate", getValues("abirthDate"));
      // setValue("bgender", getValues("agender"));
      setValue("bmobileNo", getValues("amobileNo"));
      setValue("bemail", getValues("aemail"));

      setTemp(true);
    } else {
      setValue("btitle", "");
      setValue("btitleMar", "");
      setValue("bfName", "");
      setValue("bmName", "");
      setValue("blName", "");
      setValue("bbuildingNo", "");
      setValue("bbuildingName", "");
      setValue("broadName", "");
      setValue("blandmark", "");
      setValue("bcityName", "");
      setValue("bstate", "");
      setValue("bpincode", "");
      setValue("bfNameMr", "");
      setValue("bmNameMr", "");
      setValue("blNameMr", "");
      setValue("bbuildingNoMr", "");
      setValue("bbuildingNameMr", "");
      setValue("broadNameMr", "");
      setValue("blandmarkMr", "");
      setValue("bcityNameMr", "");
      setValue("bstateMr", "");
      setValue("bbirthDate", null);
      setValue("bage", null);
      setValue("bgender", null);
      setValue("bmobileNo", "");
      setValue("bemail", "");

      setTemp();
    }
  };

  const disabilities = (e) => {
    // setValue('gdisabled', e.target.checked)
    console.log("bdisabled", getValues("bdisabled"));
    if (e.target.checked) {
      setValue("bdisabled", e.target.checked);

      // setTemp(true)
    } else {
      setValue("bdisabled", "");
    }
  };

  useEffect(() => {
    getBGenders();
    // getBAgeProofDocumentKey();
    getBIdDocumentKeys();
    getBResidentialDocumentKeys();
    getReligions();
    getbTitles();
    getbTitles();
    getDisabilities();
    getbTitleMars();
    getbStatusAtTimeMarriageKeys();
    getCasts();
  }, []);

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

  const handleAadharError = (value) => {
    console.log("valueb", value);
    console.log("errrrrrrbbb", watch("errorss"));

    if (
      watch("errorss") != null &&
      watch("errorss").baadharNo != null &&
      value.target.value == 2
    ) {
      setError("baadharNo", {
        message:
          language == "en"
            ? "Aadhar No already in use!"
            : "आधार क्रमांक आधीच वापरात आहे!",
      });

      console.log("valuea", value);
      console.log("errrrrrraaa", watch("errorss"));
      toast.error(
        language == "en"
          ? "Aadhar No already in use!"
          : "आधार क्रमांक आधीच वापरात आहे!",
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );
    } else {
      clearErrors("baadharNo");
    }
    setValue("baadharNoOld", watch("baadharNo"));
  };

  useEffect(() => {
    console.log("error112che", errors);
  }, [errors]);

  useEffect(() => {
    console.log("bage", watch("bage"));
    if (Number(watch("bage")) < 18 && Number(watch("bage")) > 0) {
      setError("bage", {
        message:
          language == "en"
            ? "Bride Age should be greater than or eqaul to 18 at the time of Marriage"
            : "लग्नाच्या वेळी वधू वय १८ पेक्षा जास्त किंवा बरोबर असावे!",
      });
    } else {
      clearErrors("bage");
    }
  }, [watch("bage")]);

  // view - Bride
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
        {/* <div style={{ marginLeft: "25px" }}>
          <FormControlLabel
            disabled={
              true
              // disabled ? true : getValues("isApplicantGroom") ? true : false
            }
            // disabled={getValues('isApplicantGroom')}
            control={<Checkbox checked={getValues("isApplicantBride")} />}
            label=<Typography>
              <b>
                {" "}
                <FormattedLabel id="ApplicatCheck2" />
              </b>
            </Typography>
            onChange={(e) => {
              addressChange(e);
            }}
          />
        </div> */}
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="brideDetails" />}{" "}
            </h3>
            <h5
              style={{
                color: "white",
                marginTop: "10px",
                marginLeft: "5px",
              }}
            >
              {<FormattedLabel id="BriNBM" />}
            </h5>
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
              error={!!errors.btitle}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
              
                <FormattedLabel id="title1" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("btitleMar", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {bTitles &&
                      bTitles.map((btitle, index) => (
                        <MenuItem key={index} value={btitle.id}>
                          {btitle.btitle}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="btitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.btitle ? errors.btitle.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          <div>
            {/* <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bfName") ? true : false) ||
                // (router.query.bfName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              // label={<FormattedLabel id="firstName" />}
              disabled={disabled}
              variant="standard"
              {...register("bfName")}
              error={!!errors.bfName}
              helperText={errors?.bfName ? errors.bfName.message : null}
            /> */}

            <Transliteration
              _key={"bfName"}
              labelName={"firstName"}
              fieldName={"bfName"}
              updateFieldName={"bfNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstName" required />}
              error={!!errors.bfName}
              helperText={errors?.bfName ? errors.bfName.message : null}
            />
          </div>
          <div>
            {/* <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bmName") ? true : false) ||
                // (router.query.bmName ? true : false),
              }}
              id="standard-basic"
              // label={<FormattedLabel id="middleName" />}
              disabled={disabled}
              label={<FormattedLabel id="middleName" required />}
              variant="standard"
              {...register("bmName")}
              error={!!errors.bmName}
              helperText={errors?.bmName ? errors.bmName.message : null}
            /> */}

            <Transliteration
              _key={"bmName"}
              labelName={"middleName"}
              fieldName={"bmName"}
              updateFieldName={"bmNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"bmNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="middleName" required />}
              error={!!errors.bmName}
              helperText={errors?.bmName ? errors.bmName.message : null}
            />
          </div>
          <div>
            {/* <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("blName") ? true : false) ||
                // (router.query.blName ? true : false),
              }}
              id="standard-basic"
              // label={<FormattedLabel id="lastName" />}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("blName")}
              error={!!errors.blName}
              helperText={errors?.blName ? errors.blName.message : null}
            /> */}

            <Transliteration
              _key={"blName"}
              labelName={"lastName"}
              fieldName={"blName"}
              updateFieldName={"blNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"blNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              error={!!errors.blName}
              helperText={errors?.blName ? errors.blName.message : null}
            />
          </div>
        </div>

        <div className={styles.rowName}>
          {/* <div>
            <FormControl
              variant="standard"
              error={!!errors.btitleMar}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="titlemr" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("btitle", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {bTitleMars &&
                      bTitleMars.map((btitleMar, index) => (
                        <MenuItem key={index} value={btitleMar.id}>
                          {btitleMar.btitleMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="btitleMar"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.btitleMar ? errors.btitleMar.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          <div>
            {/* <TextField
              id="standard-basic"
              InputLabelProps={{
                shrink: temp,
                // (watch("bfNameMr") ? true : false) ||
                // (router.query.bfNameMr ? true : false),
              }}
              // label={<FormattedLabel id="firstNameV" />}
              label={<FormattedLabel id="firstNamemr" required />}
              disabled={disabled}
              variant="standard"
              {...register("bfNameMr")}
              error={!!errors.bfNameMr}
              helperText={errors?.bfNameMr ? errors.bfNameMr.message : null}
            /> */}
            <Transliteration
              _key={"bfNameMr"}
              labelName={"firstNamemr"}
              fieldName={"bfNameMr"}
              updateFieldName={"bfName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"bfName"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstNamemr" required />}
              error={!!errors.bfNameMr}
              helperText={errors?.bfNameMr ? errors.bfNameMr.message : null}
            />
          </div>
          <div>
            {/* <TextField
              id="standard-basic"
              // label={<FormattedLabel id="middleNameV" />}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" required />}
              InputLabelProps={{
                shrink: temp,
                // (watch("bmNameMr") ? true : false) ||
                // (router.query.bmNameMr ? true : false),
              }}
              variant="standard"
              {...register("bmNameMr")}
              error={!!errors.bmNameMr}
              helperText={errors?.bmNameMr ? errors.bmNameMr.message : null}
            /> */}

            <Transliteration
              _key={"bmNameMr"}
              labelName={"middleNamemr"}
              fieldName={"bmNameMr"}
              updateFieldName={"bmName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"bmName"}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" required />}
              error={!!errors.bmNameMr}
              helperText={errors?.bmNameMr ? errors.bmNameMr.message : null}
            />
          </div>
          <div>
            {/* <TextField
              id="standard-basic"
              InputLabelProps={{
                shrink: temp,
                // (watch("blNameMr") ? true : false) ||
                // (router.query.blNameMr ? true : false),
              }}
              // label={<FormattedLabel id="lastNameV" />}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("blNameMr")}
              error={!!errors.blNameMr}
              helperText={errors?.blNameMr ? errors.blNameMr.message : null}
            /> */}
            <Transliteration
              _key={"blNameMr"}
              labelName={"lastNamemr"}
              fieldName={"blNameMr"}
              updateFieldName={"blName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"blName"}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              error={!!errors.blNameMr}
              helperText={errors?.blNameMr ? errors.blNameMr.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            {" "}
            <Transliteration
              _key={"botherName"}
              labelName={"botherName"}
              fieldName={"botherName"}
              updateFieldName={"botherNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"botherNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="otherName" />}
              error={!!errors.botherName}
              helperText={errors?.botherName ? errors.botherName.message : null}
            />
          </div>
          <div>
            {" "}
            <Transliteration
              _key={"botherNameMr"}
              labelName={"botherNameMr"}
              fieldName={"botherNameMr"}
              updateFieldName={"botherName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              InputLabelProps={{
                shrink: watch("botherNameMr") ? true : false,
              }}
              targetError={"botherName"}
              disabled={disabled}
              label={<FormattedLabel id="otherNameMr" />}
              error={!!errors.botherNameMr}
              helperText={
                errors?.botherNameMr ? errors.botherNameMr.message : null
              }
            />
          </div>
          <div>
            <FormControl error={!!errors.bbirthDate} sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="bbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      maxDate={moment(new Date())
                        .subtract(18, "years")
                        .calendar()}
                      minDate={moment(new Date())
                        .subtract(100, "years")
                        .calendar()}
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          {<FormattedLabel id="BirthDate" required />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        // setValue(
                        //   "bage",
                        //   moment(getValues("marriageDate")).format("YYYY") -
                        //     moment(getValues("bbirthDate")).format("YYYY"),
                        // );

                        setValue(
                          "bage",
                          calculateAge(
                            moment(getValues("marriageDate")).format(
                              "YYYY-MM-DD",
                            ),
                            moment(getValues("bbirthDate")).format(
                              "YYYY-MM-DD",
                            ),
                          ),
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
                {errors?.bbirthDate ? errors.bbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              inputProps={{ maxLength: 2 }}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              // InputLabelProps={{ shrink: watch("bage") ? true : false }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              // disabled
              variant="standard"
              {...register("bage")}
              error={!!errors.bage}
              // helperText={errors?.bage ? errors.bage.message : null}
              helperText={errors?.bage ? errors?.bage.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl style={{ marginTop: 0 }} error={!!errors.bbirthDate}>
              <Controller
                control={control}
                name="bbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 13 }}>
                          {<FormattedLabel id="BirthDate" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format('YYYY-MM-DD'))
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
                {errors?.bbirthDate ? errors.bbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bgender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender *"
                  >
                    {bGenders &&
                      bGenders.map((bgender, index) => (
                        <MenuItem key={index} value={bgender.id}>
                          {/* {bgender.bgender} */}
                          {language == "en"
                            ? bgender?.gender
                            : bgender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bgender"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bgender ? errors.bgender.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("baadharNo") ? true : false) ||
                  (router.query.baadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("baadharNo")}
              error={!!errors.baadharNo}
              helperText={errors?.baadharNo ? errors.baadharNo.message : null}
            /> */}

            <FormControl
              // error={errors?.baadharNo}
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
            >
              <Controller
                control={control}
                defaultValue=""
                name="baadharNo"
                render={({ field, error }) => (
                  <TextField
                    disabled={disabled}
                    inputProps={{ maxLength: 12 }}
                    style={{ margin: "0" }}
                    InputLabelProps={{
                      shrink: watch("baadharNo") ? true : false,
                    }}
                    id="standard-basic"
                    label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    // {...register("baadharNo")}
                    error={!!errors.baadharNo}
                    helperText={
                      errors?.baadharNo ? errors.baadharNo.message : null
                    }
                    value={field.value}
                    onChange={(e) => {
                      if (e.target.value?.length == 12) {
                        getAdharNos(e.target.value, "baadharNo");
                      }
                      field.onChange(e?.target?.value);
                    }}
                  />
                )}
              />
            </FormControl>
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink:
                  (watch("bemail") ? true : false) ||
                  (router.query.bemail ? true : false),
              }}
              id="standard-basic"
              disabled={disabled}
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register("bemail")}
              error={!!errors.bemail}
              helperText={errors?.bemail ? errors.bemail.message : null}
            />
          </div>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.breligionByBirth}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Religion1" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Religion by Birth *"
                  >
                    {religions &&
                      religions.map((breligionByBirth, index) => (
                        <MenuItem key={index} value={breligionByBirth.id}>
                          {/* {breligionByBirth.breligionByBirth} */}
                          {language == "en"
                            ? breligionByBirth?.religion
                            : breligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="breligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.breligionByBirth
                  ? errors.breligionByBirth.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className={styles.row}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            xl={4}
            style={{ display: "flex" }}
          >
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.breligionByAdoption}
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
                    label="  Religion by Adoption *"
                  >
                    {religions &&
                      religions.map((breligionByAdoption, index) => (
                        <MenuItem key={index} value={breligionByAdoption.id}>
                          {/* {breligionByAdoption.breligionByAdoption} */}
                          {language == "en"
                            ? breligionByAdoption?.religion
                            : breligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="breligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.breligionByAdoption
                  ? errors.breligionByAdoption.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: "0" }}
              error={!!errors.bcasts}
            >
              <Controller
                name="bcasts"
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
                {errors?.bcasts ? errors.bcasts.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bstatusAtTimeMarriageKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfMarrige" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), handleAadharError(value);
                    }}
                    label="Status at time of marriage *"
                  >
                    {bStatusAtTimeMarriageKeys &&
                      bStatusAtTimeMarriageKeys.map(
                        (bstatusAtTimeMarriageKey, index) => (
                          <MenuItem
                            key={index}
                            value={bstatusAtTimeMarriageKey.id}
                          >
                            {/* {gStatusOfDocumentKey.gStatusOfDocumentKey} */}

                            {language == "en"
                              ? bstatusAtTimeMarriageKey?.statusDetails
                              : bstatusAtTimeMarriageKey?.statusDetailsMar}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="bstatusAtTimeMarriageKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bstatusAtTimeMarriageKey
                  ? errors.bstatusAtTimeMarriageKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {watch("bstatusAtTimeMarriageKey") &&
            watch("bstatusAtTimeMarriageKey") == 1 && (
              <div style={{ marginLeft: "6vh" }}>
                <FormControl
                  error={!!errors.bdivorceDate}
                  sx={{ marginTop: 0 }}
                >
                  <Controller
                    control={control}
                    name="bdivorceDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          maxDate={moment(getValues("marriageDate")).format(
                            "YYYY-MM-DD",
                          )}
                          disabled={disabled}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {" "}
                              <FormattedLabel id="divorcedDate" required />
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
                    {errors?.bdivorceDate ? errors.bdivorceDate.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
          {watch("bstatusAtTimeMarriageKey") &&
            watch("bstatusAtTimeMarriageKey") == 3 && (
              <div style={{ marginLeft: "6vh" }}>
                <FormControl error={!!errors.bwidowDate} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="bwidowDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          maxDate={moment(getValues("marriageDate")).format(
                            "YYYY-MM-DD",
                          )}
                          disabled={disabled}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="widowDate" required />
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
                    {errors?.bwidowDate ? errors.bwidowDate.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
          {/* <div style={{ marginLeft: "12vh" }}>
            <FormControlLabel
              // disabled={disabled ? true : getValues("gdisabled") ? true : false}
              sx={{ marginTop: "4vh" }}
              // disabled={disabled ? true : getValues("bdisabled") ? true : false}
              control={
                <Checkbox checked={getValues("bdisabled") ? true : false} />
              }
              label=<Typography>
                <b>
                  {" "}
                  <FormattedLabel id="AppliToBrideD" />
                </b>
              </Typography>
              onChange={(e) => {
                disabilities(e);
              }}
            />
          </div> */}
        </div>

        <div style={{ display: "flex" }}>
          <FormControlLabel
            disabled={disabled}
            // disabled={disabled ? true : getValues("gdisabled") ? true : false}
            sx={{ marginTop: "4vh", marginLeft: "3vh" }}
            // disabled={disabled ? true : getValues("bdisabled") ? true : false}
            control={
              <Checkbox checked={getValues("bdisabled") ? true : false} />
            }
            label=<Typography>
              <b>
                {" "}
                <FormattedLabel id="AppliToBrideD" />
              </b>
            </Typography>
            onChange={(e) => {
              disabilities(e);
            }}
          />

          {watch("bdisabled") == true && (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginRight: "auto", marginLeft: "20vh" }}
            >
              <FormControl sx={{}} error={!!errors.bdisabilityType}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="disablety" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      // label={<FormattedLabel id="caste" />}
                    >
                      {Disabilities &&
                        Disabilities.map((typeOfDisability, index) => (
                          <MenuItem key={index} value={typeOfDisability.id}>
                            {language == "en"
                              ? typeOfDisability?.typeOfDisability
                              : typeOfDisability?.typeOfDisabilityMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="bdisabilityType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.bdisabilityType
                    ? errors.bdisabilityType.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          )}
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
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNo") ? true : false) ||
                // (router.query.bbuildingNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              disabled={disabled}
              variant="standard"
              {...register("bbuildingNo")}
              error={!!errors.bbuildingNo}
              helperText={
                errors?.bbuildingNo ? errors.bbuildingNo.message : null
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
              _key={"bbuildingName"}
              labelName={"buildingName"}
              fieldName={"bbuildingName"}
              updateFieldName={"bbuildingNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"bbuildingNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="buildingName" />}
              error={!!errors.bbuildingName}
              helperText={
                errors?.bbuildingName ? errors.bbuildingName.message : null
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
              _key={"broadName"}
              labelName={"roadName"}
              fieldName={"broadName"}
              updateFieldName={"broadNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"broadNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="roadName" required />}
              error={!!errors.broadName}
              helperText={errors?.broadName ? errors.broadName.message : null}
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
              _key={"blandmark"}
              labelName={"Landmark"}
              fieldName={"blandmark"}
              updateFieldName={"blandmarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"blandmarkMr"}
              disabled={disabled}
              label={<FormattedLabel id="Landmark" required />}
              error={!!errors.blandmark}
              helperText={errors?.blandmark ? errors.blandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bbuildingNoMr") ? true : false) ||
                // (router.query.bbuildingNoMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNomr" />}
              variant="standard"
              disabled={disabled}
              {...register("bbuildingNoMr")}
              error={!!errors.bbuildingNoMr}
              helperText={
                errors?.bbuildingNoMr ? errors.bbuildingNoMr.message : null
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
              _key={"bbuildingNameMr"}
              labelName={"buildingNamemr"}
              fieldName={"bbuildingNameMr"}
              updateFieldName={"bbuildingName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              InputLabelProps={{
                shrink: watch("bbuildingNameMr") ? true : false,
              }}
              targetError={"bbuildingName"}
              disabled={disabled}
              label={<FormattedLabel id="buildingNamemr" />}
              error={!!errors.bbuildingNameMr}
              helperText={
                errors?.bbuildingNameMr ? errors.bbuildingNameMr.message : null
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
              _key={"broadNameMr"}
              labelName={"roadNamemr"}
              fieldName={"broadNameMr"}
              updateFieldName={"broadName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              InputLabelProps={{
                shrink: watch("broadNameMr") ? true : false,
              }}
              targetError={"broadName"}
              disabled={disabled}
              label={<FormattedLabel id="roadNamemr" required />}
              error={!!errors.broadNameMr}
              helperText={
                errors?.broadNameMr ? errors.broadNameMr.message : null
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
              _key={"blandmarkMr"}
              labelName={"Landmarkmr"}
              fieldName={"blandmarkMr"}
              updateFieldName={"blandmark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              InputLabelProps={{
                shrink: watch("blandmarkMr") ? true : false,
              }}
              targetError={"blandmark"}
              disabled={disabled}
              label={<FormattedLabel id="Landmarkmr" required />}
              error={!!errors.blandmarkMr}
              helperText={
                errors?.blandmarkMr ? errors.blandmarkMr.message : null
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
              _key={"bcityName"}
              labelName={"cityName"}
              fieldName={"bcityName"}
              updateFieldName={"bcityNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              InputLabelProps={{
                shrink: watch("bcityName") ? true : false,
              }}
              targetError={"bcityNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="cityName" required />}
              error={!!errors.bcityName}
              helperText={errors?.bcityName ? errors.bcityName.message : null}
            />
          </div>
          <div>
            <TextField
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bstate") ? true : false) ||
                // (router.query.bstate ? true : false),
              }}
              defaultValue="Maharashtra"
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              disabled
              variant="standard"
              {...register("bstate")}
              error={!!errors.bstate}
              helperText={errors?.bstate ? errors.bstate.message : null}
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
              _key={"bcityNameMr"}
              labelName={"cityNamemr"}
              fieldName={"bcityNameMr"}
              updateFieldName={"cityName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              InputLabelProps={{
                shrink: watch("bcityNameMr") ? true : false,
              }}
              targetError={"cityName"}
              disabled={disabled}
              label={<FormattedLabel id="cityNamemr" required />}
              error={!!errors.bcityNameMr}
              helperText={
                errors?.bcityNameMr ? errors.bcityNameMr.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{ shrink: watch("bstateMr") ? true : false }}
              // InputLabelProps={{
              //   shrink: temp,
              //   // (watch("bstateMr") ? true : false) ||
              //   // (router.query.bstateMr ? true : false),
              // }}
              defaultValue="महाराष्ट्र"
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              disabled
              variant="standard"
              {...register("bstateMr")}
              error={!!errors.bstateMr}
              helperText={errors?.bstateMr ? errors.bstateMr.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              inputProps={{ maxLength: 6 }}
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink: temp,
                // (watch("bpincode") ? true : false) ||
                // (router.query.bpincode ? true : false),
              }}
              id="standard-basic"
              disabled={disabled}
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              {...register("bpincode")}
              error={!!errors.bpincode}
              helperText={errors?.bpincode ? errors.bpincode.message : null}
            />
          </div>

          <div>
            <TextField
              inputProps={{ maxLength: 10 }}
              // InputLabelProps={{ shrink: true }}
              InputLabelProps={{
                shrink:
                  (watch("bmobileNo") ? true : false) ||
                  (router.query.bmobileNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("bmobileNo")}
              error={!!errors.bmobileNo}
              helperText={errors?.bmobileNo ? errors.bmobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bAgeProofDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="AgeDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Age Proof"
                  >
                    {bAgeProofDocumentKey &&
                      bAgeProofDocumentKey.map(
                        (bAgeProofDocumentKey, index) => (
                          <MenuItem key={index} value={bAgeProofDocumentKey.id}>
                            {bAgeProofDocumentKey.bAgeProofDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="bAgeProofDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bAgeProofDocumentKey
                  ? errors.bAgeProofDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.BIdDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="IdDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  ID Document"
                  >
                    {BIdDocumentKeys &&
                      BIdDocumentKeys.map((BIdDocumentKey, index) => (
                        <MenuItem key={index} value={BIdDocumentKey.id}>
                          {BIdDocumentKey.BIdDocumentKey}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="BIdDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.BIdDocumentKey ? errors.BIdDocumentKey.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>
        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.bResidentialDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="residentialDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Residential Document"
                  >
                    {bResidentialDocumentKeys &&
                      bResidentialDocumentKeys.map(
                        (bResidentialDocumentKey, index) => (
                          <MenuItem
                            key={index}
                            value={bResidentialDocumentKey.id}
                          >
                            {bResidentialDocumentKey.bResidentialDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="bResidentialDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bResidentialDocumentKey
                  ? errors.bResidentialDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, marginLeft: '2.5vw' }}
              error={!!errors.bStatusOfDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Status of Document"
                  >
                    <MenuItem value={1}>Pending</MenuItem>
                    <MenuItem value={2}>Successful</MenuItem>
                  </Select>
                )}
                name="bStatusOfDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bStatusOfDocumentKey
                  ? errors.bStatusOfDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>

        {/* <div className={styles.row} style={{ marginTop: 30 }}>
          <h1>{<FormattedLabel id="brideParaentDetail" />}</h1>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="firstNameF" />}
              variant="standard"
              {...register('bFFName')}
              error={!!errors.bFFName}
              helperText={errors?.bFFName ? errors.bFFName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="middleNameF" />}
              variant="standard"
              {...register('bFMName')}
              error={!!errors.bFMName}
              helperText={errors?.bFMName ? errors.bFMName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="lastNameF" />}
              variant="standard"
              {...register('bFLName')}
              error={!!errors.bFLName}
              helperText={errors?.bFLName ? errors.bFLName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AadharNoF" />}
              variant="standard"
              {...register('bFAadharNo')}
              error={!!errors.bFAadharNo}
              helperText={errors?.bFAadharNo ? errors.bFAadharNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AgeF" />}
              variant="standard"
              {...register('bFAge')}
              error={!!errors.bFAge}
              helperText={errors?.bFAge ? errors.bFAge.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="mobileNoF" />}
              variant="standard"
              {...register('bFMobileNo')}
              error={!!errors.bFMobileNo}
              helperText={errors?.bFMobileNo ? errors.bFMobileNo.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="firstNameM" />}
              variant="standard"
              {...register('bMFName')}
              error={!!errors.bMFName}
              helperText={errors?.bMFName ? errors.bMFName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="middleNameM" />}
              variant="standard"
              {...register('bMMName')}
              error={!!errors.bMMName}
              helperText={errors?.bMMName ? errors.bMMName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="lastNameM" />}
              variant="standard"
              {...register('bMLName')}
              error={!!errors.bMLName}
              helperText={errors?.bMLName ? errors.bMLName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AgeM" />}
              variant="standard"
              {...register('bMAge')}
              error={!!errors.bMAge}
              helperText={errors?.bMAge ? errors.bMAge.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="AadharNoM" />}
              variant="standard"
              {...register('bMAadharNo')}
              error={!!errors.bMAadharNo}
              helperText={errors?.bMAadharNo ? errors.bMAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="mobileNoM" />}
              variant="standard"
              {...register('bMMobileNo')}
              error={!!errors.bMMobileNo}
              helperText={errors?.bMMobileNo ? errors.bMMobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register('bFEmail')}
              error={!!errors.bFEmail}
              helperText={errors?.bFEmail ? errors.bFEmail.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              {...register('bFBuildingNo')}
              error={!!errors.bFBuildingNo}
              helperText={
                errors?.bFBuildingNo ? errors.bFBuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              {...register('bFBuildingName')}
              error={!!errors.bFBuildingName}
              helperText={
                errors?.bFBuildingName ? errors.bFBuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="roadName" />}
              variant="standard"
              {...register('bFRoadName')}
              error={!!errors.bFRoadName}
              helperText={errors?.bFRoadName ? errors.bFRoadName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="Landmark" />}
              bFVillageName
              variant="standard"
              {...register('bFLandmark')}
              error={!!errors.bFLandmark}
              helperText={errors?.bFLandmark ? errors.bFLandmark.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="villageName" />}
              variant="standard"
              {...register('bFVillageName')}
              error={!!errors.bFVillageName}
              helperText={
                errors?.bFVillageName ? errors.bFVillageName.message : null
              }
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="cityName" />}
              variant="standard"
              {...register('bFCityName')}
              error={!!errors.bFCityName}
              helperText={errors?.bFCityName ? errors.bFCityName.message : null}
            />
          </div>
          <div>
            <TextField
              
              id="standard-basic"
              label={<FormattedLabel id="state" />}
              variant="standard"
              {...register('bFState')}
              error={!!errors.bFState}
              helperText={errors?.bFState ? errors.bFState.message : null}
            />
          </div>
        </div>

        <div>
          <TextField
            sx={{ width: 230, marginLeft: '2.5vw' }}
            id="standard-basic"
            label={<FormattedLabel id="pincode" />}
            variant="standard"
            {...register('bFPincode')}
            error={!!errors.bFPincode}
            helperText={errors?.bFPincode ? errors.bFPincode.message : null}
          />
        </div> */}
      </div>
    </>
  );
};
export default BrideDetails;

// useEffect(() => {
//   dateConverter()
// }, [getValues("bbirthDate"),getValues("marriageDate")])

// const dateConverter = (startDate, timeEnd) => {
//   // const brideAge = Math.floor(
//   //   moment(getValues('marriageDate')).format('YYYY') -
//   //     moment(getValues('bbirthDate')).format('YYYY'),
//   // )
//   console.log('bride age', brideAge)
// }
// {...register('addressCheckBoxB')}
