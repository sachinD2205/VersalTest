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
import { useGetToken } from "../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../marriageRegistration/transliteration";
import styles from "../marriageRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// import diff from "moment";

const GroomDetails = () => {
  const user = useSelector((state) => state?.user.user);

  const router = useRouter();
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

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    console.log("dsfsdsfsdf---", watch("gcasts"));
  }, [watch("gcasts")]);

  useEffect(() => {
    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    let flag3 =
      router.query.pageMode === "View" || router.query.pageMode === "DRAFT";
    if (flag1 || flag2) {
      setDisabled(false);
      console.log("enabled");
      setValue("astate", "Maharashtra");
      setValue("astateMr", "महाराष्ट्र");
    } else if (flag3) {
      setDisabled(true);
    } else {
      setDisabled(false);
      console.log("disabled");
    }
    setValue("ggender", 1);
  }, []);

  useEffect(() => {
    setValue("gtitleMar", getValues("gtitle"));
  }, [getValues("gtitle")]);

  useEffect(() => {
    if (watch("whoAreYou") == 1) {
      setValue("isApplicantGroom", true);
      setValue("isApplicantBride", false);
      addressChange(true);
    }
  }, []);

  const language = useSelector((state) => state?.labels.language);
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
  const [gGenders, setGGenders] = useState([]);

  // getGGenders
  const getGGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGGenders(
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

  // zones
  // const [gAgeProofDocumentKey, setGAgeProofDocumentKey] = useState([]);

  // // getGAgeProofDocumentKey
  // const getGAgeProofDocumentKey = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/ageProofDocument/getAll`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((r) => {
  //       setGAgeProofDocumentKey(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           gAgeProofDocumentKey: row.typeOfDocument,
  //         })),
  //       );
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  // documentKeys
  const [gIdDocumentKeys, setGIdDocumentKeys] = useState([]);

  // getGIdDocumentKeys
  const getGIdDocumentKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/identityProof/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGIdDocumentKeys(
          r.data.identityProof.map((row) => ({
            id: row.id,
            gIdDocumentKey: row.typeOFDocument,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // resedentialDocumentkey
  const [gResidentialDocumentKeys, setgResidentialDocumentKeys] = useState([]);

  // getgResidentialDocumentKeys
  const getgResidentialDocumentKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/residentialProof/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgResidentialDocumentKeys(
          r.data.residentialProof.map((row) => ({
            id: row.id,
            gResidentialDocumentKey: row.typeOFDocument,
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
        console.log("groomCaste", r?.data?.mstCastDao);
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
  // const getCasts = () => {
  //   axios
  //     .get(`${urls.CFCURL}/master/cast/getAll`, {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((r) => {
  //       setCasts(
  //         r.data.mCast.map((row) => ({
  //           id: row.id,
  //           cast: row.cast,
  //           castMr: row.castMr,
  //         })),
  //       );
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  // Titles
  const [gTitles, setgTitles] = useState([]);

  // getTitles
  const getgTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitles(
          r.data.title.map((row) => ({
            id: row.id,
            gtitle: row.title,
            //titlemr: row.titlemr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Titles
  const [gTitleMars, setgTitleMars] = useState([]);

  // getTitles
  const getgTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            gtitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //Mr Status
  const [gStatusAtTimeMarriageKeys, setgStatusAtTimeMarriageKeys] = useState(
    [],
  );

  const getgStatusAtTimeMarriageKeys = () => {
    axios
      .get(`${urls.MR}/master/maritalstatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgStatusAtTimeMarriageKeys(
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
  const userToken = useGetToken();
  const [castCategory, setCastCategory] = useState([]);
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
            })),
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("SubCastApiError", error);
      });
  };

  const [temp, setTemp] = useState();

  useEffect(() => {
    if (watch("isApplicantGroom") == true) {
      addressChange(true);
    }
  }, [watch("isApplicantGroom")]);

  // Address Change
  const addressChange = (e) => {
    let condt = e;
    // let condt = e.target.checked;
    setValue("isApplicantGroom", condt);
    console.log("condt:::", condt);
    console.log("isApplicantGroom", getValues("isApplicantGroom"));
    if (condt) {
      console.log("::::all values", getValues());
      setValue("gtitle", getValues("atitle"));
      setValue("gtitleMar", getValues("atitleMr"));
      setValue("gfName", getValues("afName"));
      setValue("gmName", getValues("amName"));
      setValue("glName", getValues("alName"));
      setValue("gbuildingNo", getValues("aflatBuildingNo"));
      setValue("gbuildingName", getValues("abuildingName"));
      setValue("groadName", getValues("aroadName"));
      setValue("glandmark", getValues("alandmark"));
      setValue("gcityName", getValues("acityName"));
      setValue("gstate", getValues("astate"));
      setValue("gpincode", getValues("apincode"));
      setValue("gfNameMr", getValues("afNameMr"));
      setValue("gmNameMr", getValues("amNameMr"));
      setValue("glNameMr", getValues("alNameMr"));
      setValue("gbuildingNoMr", getValues("aflatBuildingNoMr"));
      setValue("gbuildingNameMr", getValues("abuildingNameMr"));
      setValue("groadNameMr", getValues("aroadNameMr"));
      setValue("glandmarkMr", getValues("alandmarkMr"));
      setValue("gcityNameMr", getValues("acityNameMr"));
      setValue("gstateMr", getValues("astateMr"));
      setValue("ggender", user.gender ? user.gender : getValues("ggender"));
      setValue(
        "gbirthDate",
        user.dateOfBirth ? user.dateOfBirth : getValues("gbirthDate"),
      );

      if (getValues("marriageDate")) {
        setValue(
          "gage",
          calculateAge(
            moment(getValues("marriageDate")).format("YYYY"),
            moment(getValues("gbirthDate")).format("YYYY"),
          ),
        );
      }
      // setValue("gbirthDate", getValues("abirthDate"));
      // setValue("ggender", getValues("agender"));
      setValue("gmobileNo", getValues("amobileNo"));
      setValue("gemail", getValues("aemail"));
      // setValue("gage", getValues("gage"));

      setTemp(true);
    } else {
      setValue("gtitle", "");
      setValue("gtitleMar", "");
      setValue("gfName", "");
      setValue("gmName", "");
      setValue("glName", "");
      setValue("gbuildingNo", "");
      setValue("gbuildingName", "");
      setValue("groadName", "");
      setValue("glandmark", "");
      setValue("gcityName", "");
      setValue("gstate", "");
      setValue("gpincode", "");
      setValue("gfNameMr", "");
      setValue("gmNameMr", "");
      setValue("glNameMr", "");
      setValue("gbuildingNoMr", "");
      setValue("gbuildingNameMr", "");
      setValue("groadNameMr", "");
      setValue("glandmarkMr", "");
      setValue("gcityNameMr", "");
      setValue("gstateMr", "");

      // setValue("gbirthDate", "");
      // setValue("gage", "");
      // setValue("ggender", "");

      setValue("gmobileNo", "");
      setValue("gemail", "");

      setTemp();
    }
  };

  const disabilities = (e) => {
    // setValue('gdisabled', e.target.checked)
    console.log("gdisabled", getValues("gdisabled"));
    if (e.target.checked) {
      setValue("gdisabled", e.target.checked);

      // setTemp(true)
    } else {
      setValue("gdisabled", "");
    }
  };

  // adharNo
  const [adharNo, setAdharNos] = useState([]);

  // adharNo
  const getAdharNos = (value, label) => {
    if (watch("gaadharNoOld") != value) {
      clearErrors("gaadharNo");
      setValue("errorss", "");
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

  useEffect(() => {
    getGGenders();
    // getGAgeProofDocumentKey();
    getGIdDocumentKeys();
    getgResidentialDocumentKeys();
    getReligions();
    getgTitleMars();
    getgTitles();
    getDisabilities();
    getgStatusAtTimeMarriageKeys();
    getCasts();
    getCastCategory();
  }, []);

  useEffect(() => {
    dateConverter();
  }, []);

  const dateConverter = (gBirthDates, marriageDate) => {
    const groomAge = Math.floor(
      moment(getValues("marriageDate")).format("YYYY-MM-DD") -
        moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
    );

    console.log("a1234", groomAge);
  };

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

  // useEffect(() => {
  //   console.log("statusDetails", watch("maritalStatus.statusDetails"));
  //   if (watch("maritalStatus.statusDetails") === "Divorced") {
  //     setgStatusAtTimeMarriageKeys(gStatusAtTimeMarriageKeys);
  //   }
  // }, [watch("maritalStatus.statusDetails")]);
  // View -Groom
  console.log(
    "watch(gstatusAtTimeMarriageKey)",
    watch("gstatusAtTimeMarriageKey"),
  );

  const handleAadharError = (value) => {
    console.log("valueb", value);
    console.log("errrrrrrbbb", watch("errorss"));

    if (
      watch("errorss") != null &&
      watch("errorss").gaadharNo != null &&
      value.target.value == 2
    ) {
      setError("gaadharNo", {
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
      clearErrors("gaadharNo");
    }
    setValue("gaadharNoOld", watch("gaadharNo"));
  };

  useEffect(() => {
    console.log("error112che", errors);
  }, [errors]);

  useEffect(() => {
    if (Number(watch("gage")) < 21 && Number(watch("gage")) > 0) {
      setError("gage", {
        message:
          language == "en"
            ? "Groom Age should be greater than or eqaul to 21 at the time of Marriage"
            : "लग्नाच्या वेळी वराचे वय २१ पेक्षा जास्त किंवा बरोबर असावे!",
      });
    } else {
      clearErrors("gage");
    }
  }, [watch("gage")]);

  const [startDate, setStartDate] = useState(null);

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
              // disabled ? true : getValues("isApplicantBride") ? true : false
              true
            }
            control={
              <Checkbox
                checked={getValues("isApplicantGroom") ? true : false}
              />
            }
            label=<Typography>
              <b>
                <FormattedLabel id="ApplicatCheck1" />
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
              {<FormattedLabel id="groomDetail" />}
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
          {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              error={!!errors.gtitle}
              sx={{ marginTop: "2vh" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title1" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink: watch("gtitle") ? true : false,
                    }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("gtitleMar", value.target.value);
                    }}
                    label="Title  "
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {gTitles &&
                      gTitles.map((gtitle, index) => (
                        <MenuItem key={index} value={gtitle.id}>
                          {gtitle.gtitle}

                      
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gtitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gtitle ? errors.gtitle.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gfName") ? true : false) ||
                // (router.query.gfName ? true : false),
              }}
              disabled={disabled}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              // label="First Name  "
              variant="standard"
              {...register("gfName")}
              error={!!errors.gfName}
              helperText={errors?.gfName ? errors.gfName.message : null}
            /> */}

            <Transliteration
              _key={"gfName"}
              labelName={"firstName"}
              fieldName={"gfName"}
              updateFieldName={"gfNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"gfNameMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstName" required />}
              error={!!errors.gfName}
              helperText={errors?.gfName ? errors.gfName.message : null}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gmName") ? true : false) ||
                // (router.query.gmName ? true : false),
              }}
              // InputLabelProps={{ shrink: true }}
              disabled={disabled}
              id="standard-basic"
              // label="Middle Name  "
              label={<FormattedLabel id="middleName" required />}
              variant="standard"
              {...register("gmName")}
              error={!!errors.gmName}
              helperText={errors?.gmName ? errors.gmName.message : null}
            /> */}

            <Transliteration
              _key={"gmName"}
              labelName={"middleName"}
              fieldName={"gmName"}
              updateFieldName={"gmNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"gmNameMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="middleName" required />}
              error={!!errors.gmName}
              helperText={errors?.gmName ? errors.gmName.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glName") ? true : false) ||
                // (router.query.glName ? true : false),
              }}
              disabled={disabled}
              id="standard-basic"
              // label="Last Name  "
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("glName")}
              error={!!errors.glName}
              helperText={errors?.glName ? errors.glName.message : null}
            /> */}

            <Transliteration
              _key={"glName"}
              labelName={"lastName"}
              fieldName={"glName"}
              updateFieldName={"glNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"glNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              error={!!errors.glName}
              helperText={errors?.glName ? errors.glName.message : null}
            />
          </Grid>
        </div>
        <div className={styles.rowName}>
          {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              error={!!errors.gtitleMar}
              sx={{ marginTop: "2vh" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="titlemr" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink: watch("gtitleMar") ? true : false,
                    }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      setValue("gtitle", value.target.value);
                    }}
                    label="Title  "
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {gTitleMars &&
                      gTitleMars.map((gtitleMar, index) => (
                        <MenuItem key={index} value={gtitleMar.id}>
                          {gtitleMar.gtitleMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gtitleMar"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gtitleMar ? errors.gtitleMar.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gfNameMr") ? true : false) ||
                // (router.query.gfNameMr ? true : false),
              }}
              id="standard-basic"
              // label="प्रथम नावं  "
              label={<FormattedLabel id="firstNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gfNameMr")}
              error={!!errors.gfNameMr}
              helperText={errors?.gfNameMr ? errors.gfNameMr.message : null}
            /> */}
            <Transliteration
              _key={"gfNameMr"}
              labelName={"firstNamemr"}
              fieldName={"gfNameMr"}
              updateFieldName={"gfName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"gfName"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstNamemr" required />}
              error={!!errors.gfNameMr}
              helperText={errors?.gfNameMr ? errors.gfNameMr.message : null}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              id="standard-basic"
              // label="मधले नावं  "
              InputLabelProps={{
                shrink: temp,
                // (watch("gmNameMr") ? true : false) ||
                // (router.query.glNameMr ? true : false),
              }}
              label={<FormattedLabel id="middleNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gmNameMr")}
              error={!!errors.gmNameMr}
              helperText={errors?.gmNameMr ? errors.gmNameMr.message : null}
            /> */}

            <Transliteration
              _key={"gmNameMr"}
              labelName={"middleNamemr"}
              fieldName={"gmNameMr"}
              updateFieldName={"gmNameMr"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"gmNameMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" required />}
              error={!!errors.gmNameMr}
              helperText={errors?.gmNameMr ? errors.gmNameMr.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glNameMr") ? true : false) ||
                // (router.query.glNameMr ? true : false),
              }}
              id="standard-basic"
              // label="आडनाव  "
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("glNameMr")}
              error={!!errors.glNameMr}
              helperText={errors?.glNameMr ? errors.glNameMr.message : null}
            /> */}

            <Transliteration
              _key={"glNameMr"}
              labelName={"lastNamemr"}
              fieldName={"glNameMr"}
              updateFieldName={"glName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"glName"}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              error={!!errors.glNameMr}
              helperText={errors?.glNameMr ? errors.glNameMr.message : null}
            />
          </Grid>
        </div>
        <div className={styles.row}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {" "}
            <Transliteration
              _key={"gotherName"}
              labelName={"gotherName"}
              fieldName={"gotherName"}
              updateFieldName={"gotherNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"gotherNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="otherName" />}
              error={!!errors.gotherName}
              helperText={errors?.gotherName ? errors.gotherName.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {" "}
            <Transliteration
              _key={"gotherNameMr"}
              labelName={"gotherNameMr"}
              fieldName={"gotherNameMr"}
              updateFieldName={"gotherName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"gotherName"}
              InputLabelProps={{
                shrink: watch("gotherNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="otherNameMr" />}
              error={!!errors.gotherNameMr}
              helperText={
                errors?.gotherNameMr ? errors.gotherNameMr.message : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl error={!!errors.gbirthDate} sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="gbirthDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      maxDate={moment(new Date())
                        .subtract(21, "years")
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
                        //   "gage",

                        //   moment(getValues("marriageDate")).format("YYYY") -
                        //     moment(getValues("gbirthDate")).format("YYYY"),
                        // );
                        setValue(
                          "gage",
                          calculateAge(
                            moment(getValues("marriageDate")).format(
                              "YYYY-MM-DD",
                            ),
                            moment(getValues("gbirthDate")).format(
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
                {errors?.gbirthDate ? errors.gbirthDate.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <div>
            <TextField
              inputProps={{ maxLength: 2 }}
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="Age" required />}
              variant="standard"
              disabled
              {...register("gage")}
              error={!!errors.gage}
              helperText={errors?.gage ? errors.gage.message : null}
              // onChange={(e) =>
              //   setValue(
              //     "gage",
              //     calculateAge(
              //       moment(getValues("marriageDate")).format("YYYY-MM-DD"),
              //       moment(getValues("gbirthDate")).format("YYYY-MM-DD"),
              //     ),
              //   )
              // }
            />
            {/* <Controller
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="Age" required />}
                  variant="standard"
                  {...register("gage")}
                  error={!!errors.gage}
                  helperText={errors?.gage ? errors.gage.message : null}
                />
              )}
            /> */}
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.ggender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="Gender" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink: watch("ggender") ? true : false,
                    }}
                    disabled={disabled}
                    defaultValue={language == "en" ? "Male" : "पुरुष"}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender  "
                  >
                    {gGenders &&
                      gGenders.map((ggender, index) => (
                        <MenuItem key={index} value={ggender.id}>
                          {/* {ggender.ggender} */}
                          {language == "en"
                            ? ggender?.gender
                            : ggender?.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="ggender"
                control={control}
              />
              <FormHelperText>
                {errors?.ggender ? errors.ggender.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              // error={errors?.gaadharNo}
              variant="outlined"
              size="small"
              sx={{ marginTop: 2 }}
            >
              <Controller
                control={control}
                defaultValue=""
                name="gaadharNo"
                render={({ field, error }) => (
                  <TextField
                    disabled={disabled}
                    inputProps={{ maxLength: 12 }}
                    style={{ margin: "0" }}
                    InputLabelProps={{
                      shrink: watch("gaadharNo") ? true : false,
                    }}
                    id="standard-basic"
                    label={<FormattedLabel id="AadharNo" required />}
                    variant="standard"
                    // {...register("gaadharNo")}
                    error={!!errors.gaadharNo}
                    helperText={
                      errors?.gaadharNo ? errors.gaadharNo.message : null
                    }
                    value={field.value}
                    onChange={
                      (e) => {
                        if (e.target.value?.length == 12) {
                          getAdharNos(e.target.value, "gaadharNo");
                        }
                        field.onChange(e?.target?.value);
                      }

                      // e.target.value?.length == 12 &&
                      // getAdharNos(e.target.value, "gaadharNo")
                    }
                  />
                )}
              />
              {/** 
             <FormHelperText>
                {errors?.gaadharNo ? errors?.gaadharNo?.message : null}
              </FormHelperText>
               */}
            </FormControl>

            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("gaadharNo") ? true : false) ||
                  (router.query.gaadharNo ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("gaadharNo")}
              error={!!errors.gaadharNo}
              helperText={errors?.gaadharNo ? errors.gaadharNo.message : null}
            /> */}
          </div>
          <div style={{ marginTop: "2vh" }}>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gemail") ? true : false) ||
                // (router.query.gemail ? true : false),
              }}
              style={{ margin: "0" }}
              id="standard-basic"
              // label="Email"
              label={<FormattedLabel id="email" />}
              disabled={disabled}
              variant="standard"
              {...register("gemail")}
              error={!!errors.gemail}
              helperText={errors?.gemail ? errors.gemail.message : null}
            />
          </div>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.greligionByBirth}
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
                    label=" Religion by Birth  "
                  >
                    {religions &&
                      religions.map((greligionByBirth, index) => (
                        <MenuItem key={index} value={greligionByBirth.id}>
                          {/* {greligionByBirth.greligionByBirth} */}

                          {language == "en"
                            ? greligionByBirth?.religion
                            : greligionByBirth?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="greligionByBirth"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.greligionByBirth
                  ? errors.greligionByBirth.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: "2vh" }}
              error={!!errors.greligionByAdoption}
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
                      religions.map((greligionByAdoption, index) => (
                        <MenuItem key={index} value={greligionByAdoption.id}>
                          {/* {greligionByAdoption.greligionByAdoption} */}
                          {language == "en"
                            ? greligionByAdoption?.religion
                            : greligionByAdoption?.religionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="greligionByAdoption"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.greligionByAdoption
                  ? errors.greligionByAdoption.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
          {/** cast Category  */}
          {/* <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            // className={HawkerReusableCSS.GridItemCenter}
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
                        <MenuItem
                          key={castCategory?.id}
                          value={castCategory?.id}
                        >
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
          </Grid> */}
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: "0" }}
              error={!!errors.gcasts}
            >
              <Controller
                name="gcasts"
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
                {errors?.gcasts ? errors.gcasts.message : null}
              </FormHelperText>
            </FormControl>

            {/* <FormControl
              variant="standard"
              error={!!errors?.gcasts}
              sx={{ marginTop: 2 }}
            >
              <Controller
                //! Sachin_😴
                name="gcasts"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    id="controllable-states-demo"
                    // sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                      console.log("newValue1111", newValue);
                      onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                    }}
                    value={casts?.find((data) => data?.id === value) || null}
                    options={casts} //! api Data
                    getOptionLabel={(caseMainType) =>
                      language == "en"
                        ? caseMainType?.castName
                        : caseMainType?.castNameMr
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        {...params}
                        label={language == "en" ? "Zone Name" : "झोनचे नाव"}
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.gcasts ? errors?.gcasts?.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* <FormControl sx={{ marginTop: 2 }} error={!!errors?.gcasts}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="casts" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field?.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label={<FormattedLabel id="casts" />}
                  >
                    {casts &&
                      casts?.map((caste) => (
                        <MenuItem key={caste?.id + 1} value={caste?.id}>
                          {language == "en"
                            ? caste?.castName
                            : caste?.castNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gcasts"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.gcasts ? errors?.gcasts?.message : null}
              </FormHelperText>
            </FormControl> */}
          </div>
          <div>
            <Transliteration
              _key={"goccupation"}
              labelName={"goccupation"}
              fieldName={"goccupation"}
              updateFieldName={"goccupationMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"goccupationMr"}
              disabled={disabled}
              label={<FormattedLabel id="gOccupation" />}
              error={!!errors.pcityName}
              helperText={
                errors?.goccupation ? errors.goccupation.message : null
              }
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("goccupation") ? true : false) ||
                  (router.query.goccupation ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="goccupation" required />}
              variant="standard"
              disabled={disabled}
              {...register("goccupation")}
              error={!!errors.goccupation}
              helperText={errors?.goccupation ? errors.goccupation.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"goccupationAddress"}
              labelName={"goccupationAddress"}
              fieldName={"goccupationAddress"}
              updateFieldName={"goccupationAddressMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"goccupationAddressMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="gOccupationAddress" />}
              error={!!errors.pcityName}
              helperText={
                errors?.goccupationAddress
                  ? errors.goccupationAddress.message
                  : null
              }
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("goccupationAddress") ? true : false) ||
                  (router.query.goccupationAddress ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="goccupationAddress" required />}
              variant="standard"
              disabled={disabled}
              {...register("goccupationAddress")}
              error={!!errors.goccupationAddress}
              helperText={errors?.goccupationAddress ? errors.goccupationAddress.message : null}
            /> */}
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <Transliteration
              _key={"goccupationMr"}
              labelName={"goccupationMr"}
              fieldName={"goccupationMr"}
              updateFieldName={"goccupation"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"goccupation"}
              InputLabelProps={{
                shrink: watch("goccupationMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="gOccupationMr" />}
              error={!!errors.pcityName}
              helperText={
                errors?.goccupationMr ? errors.goccupationMr.message : null
              }
            />
          </div>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Transliteration
              _key={"goccupationAddressMr"}
              labelName={"goccupationAddressMr"}
              fieldName={"goccupationAddressMr"}
              updateFieldName={"goccupationAddress"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"goccupationAddress"}
              InputLabelProps={{
                shrink: watch("goccupationAddressMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="gOccupationAddressMr" />}
              error={!!errors.pcityName}
              helperText={
                errors?.goccupationAddressMr
                  ? errors.goccupationAddressMr.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              sx={{ marginTop: "2vh" }}
              error={!!errors.gstatusAtTimeMarriageKey}
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
                    label="Status at time of marriage  "
                  >
                    {gStatusAtTimeMarriageKeys &&
                      gStatusAtTimeMarriageKeys.map(
                        (gstatusAtTimeMarriageKey, index) => (
                          <MenuItem
                            key={index}
                            value={gstatusAtTimeMarriageKey.id}
                          >
                            {language == "en"
                              ? gstatusAtTimeMarriageKey?.statusDetails
                              : gstatusAtTimeMarriageKey?.statusDetailsMar}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="gstatusAtTimeMarriageKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gstatusAtTimeMarriageKey
                  ? errors.gstatusAtTimeMarriageKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {console.log(
            "gstatusAtTimeMarriageKey",
            watch("gstatusAtTimeMarriageKey"),
          )}
          {watch("gstatusAtTimeMarriageKey") &&
            watch("gstatusAtTimeMarriageKey") == 1 && (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{ marginLeft: "6vh" }}
              >
                <FormControl
                  error={!!errors.gdivorceDate}
                  sx={{ marginTop: 0 }}
                >
                  <Controller
                    control={control}
                    name="gdivorceDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          // selected={startDate}
                          // onChange={(date) => setStartDate(date)}
                          // minDate={"02-01-2020"}
                          maxDate={moment(getValues("marriageDate")).format(
                            "YYYY-MM-DD",
                          )}
                          // maxDate={new Date()}
                          disabled={disabled}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
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
                    {errors?.gdivorceDate ? errors.gdivorceDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
          {watch("gstatusAtTimeMarriageKey") &&
            watch("gstatusAtTimeMarriageKey") == 3 && (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                style={{ marginLeft: "6vh" }}
              >
                <FormControl error={!!errors.gwidowDate} sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="gwidowDate"
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
                    {errors?.gwidowDate ? errors.gwidowDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}

          {/* <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            // style={{ marginLeft: "12vh" }}
          >
            <FormControlLabel
              sx={{ marginTop: "4vh" }}
              // disabled={disabled ? true : getValues("gdisabled") ? true : false}
              control={
                <Checkbox checked={getValues("gdisabled") ? true : false} />
              }
              label=<Typography>
                <b>
                  <FormattedLabel id="AppliToGroomD" />
                </b>
              </Typography>
              onChange={(e) => {
                disabilities(e);
              }}
            />
          </Grid>
          {watch("gdisabled") == true && (
            // <div style={{ marginRight: "13vh", marginLeft: "18vh" }}>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginRight: "13vh", marginLeft: "18vh" }}
            >
              <FormControl sx={{}} error={!!errors.gdisabilityType}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="disablety" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="caste" />}
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
                  name="gdisabilityType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gdisabilityType
                    ? errors.gdisabilityType.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          )} */}
        </div>

        <div style={{ display: "flex" }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            // style={{ marginLeft: "12vh" }}
          >
            <FormControlLabel
              disabled={disabled}
              sx={{ marginTop: "4vh", marginLeft: "3vh" }}
              // disabled={disabled ? true : getValues("gdisabled") ? true : false}
              control={
                <Checkbox checked={getValues("gdisabled") ? true : false} />
              }
              label=<Typography>
                <b>
                  <FormattedLabel id="AppliToGroomD" />
                </b>
              </Typography>
              onChange={(e) => {
                disabilities(e);
              }}
            />
          </Grid>
          {watch("gdisabled") == true && (
            // <div style={{ marginRight: "13vh", marginLeft: "18vh" }}>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}
              style={{ marginRight: "13vh", marginLeft: "18vh" }}
            >
              <FormControl sx={{}} error={!!errors.gdisabilityType}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="disablety" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="caste" />}
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
                  name="gdisabilityType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gdisabilityType
                    ? errors.gdisabilityType.message
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
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNo") ? true : false) ||
                // (router.query.gbuildingNo ? true : false),
              }}
              id="standard-basic"
              // label="Flat/Building No. *"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNo")}
              error={!!errors.gbuildingNo}
              helperText={
                errors?.gbuildingNo ? errors.gbuildingNo.message : null
              }
            />

            {/* <Transliteration
              _key={"gbuildingNo"}
              labelName={"flatBuildingNo"}
              fieldName={"gbuildingNo"}
              updateFieldName={"gbuildingNoMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              disabled={disabled}
              label={<FormattedLabel id="flatBuildingNo" required />}
              error={!!errors.gbuildingNo}
              helperText={
                errors?.gbuildingNo
                  ? errors.gbuildingNo.message
                  : null
              }
            /> */}
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingName") ? true : false) ||
                // (router.query.gbuildingName ? true : false),
              }}
              id="standard-basic"
              // label="Apartment Name"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingName")}
              error={!!errors.gbuildingName}
              helperText={
                errors?.gbuildingName ? errors.gbuildingName.message : null
              }
            /> */}

            <Transliteration
              _key={"gbuildingName"}
              labelName={"buildingName"}
              fieldName={"gbuildingName"}
              updateFieldName={"gbuildingNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              targetError={"gbuildingNameMr"}
              label={<FormattedLabel id="buildingName" />}
              error={!!errors.gbuildingName}
              helperText={
                errors?.gbuildingName ? errors.gbuildingName.message : null
              }
            />
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("groadName") ? true : false) ||
                // (router.query.groadName ? true : false),
              }}
              id="standard-basic"
              //  label="Road Name"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              disabled={disabled}
              {...register("groadName")}
              error={!!errors.groadName}
              helperText={errors?.groadName ? errors.groadName.message : null}
            /> */}

            <Transliteration
              _key={"groadName"}
              labelName={"roadName"}
              fieldName={"groadName"}
              updateFieldName={"groadNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              targetError={"groadNameMr"}
              disabled={disabled}
              label={<FormattedLabel id="roadName" required />}
              error={!!errors.groadName}
              helperText={errors?.groadName ? errors.groadName.message : null}
            />
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glandmark") ? true : false) ||
                // (router.query.glandmark ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              // label="Landmark"
              variant="standard"
              disabled={disabled}
              {...register("glandmark")}
              error={!!errors.glandmark}
              helperText={errors?.glandmark ? errors.glandmark.message : null}
            /> */}

            <Transliteration
              _key={"glandmark"}
              labelName={"Landmark"}
              fieldName={"glandmark"}
              updateFieldName={"glandmarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"glandmarkMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="Landmark" required />}
              error={!!errors.glandmark}
              helperText={errors?.glandmark ? errors.glandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNoMr") ? true : false) ||
                // (router.query.gbuildingNoMr ? true : false),
              }}
              id="standard-basic"
              // label="Flat/Building No. *"
              label={<FormattedLabel id="flatBuildingNomr" />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNoMr")}
              error={!!errors.gbuildingNoMr}
              helperText={
                errors?.gbuildingNoMr ? errors.gbuildingNoMr.message : null
              }
            />

            {/* <Transliteration
              _key={"gbuildingNoMr"}
              labelName={"flatBuildingNomr"}
              fieldName={"gbuildingNoMr"}
              updateFieldName={"gbuildingNo"}
              sourceLang={"mar"}
              targetLang={"eng"}
              disabled={disabled}
              label={<FormattedLabel id="flatBuildingNomr" required />}
              error={!!errors.gbuildingNoMr}
              helperText={
                errors?.gbuildingNoMr ? errors.gbuildingNoMr.message : null
              }
            /> */}
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gbuildingNameMr") ? true : false) ||
                // (router.query.gbuildingNameMr ? true : false),
              }}
              id="standard-basic"
              // label="Apartment Name"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gbuildingNameMr")}
              error={!!errors.gbuildingNameMr}
              helperText={
                errors?.gbuildingName ? errors.gbuildingNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"gbuildingNameMr"}
              labelName={"buildingNamemr"}
              fieldName={"gbuildingNameMr"}
              updateFieldName={"buildingName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"buildingName"}
              InputLabelProps={{
                shrink: watch("gbuildingNameMr") ? true : false,
              }}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="buildingNamemr" />}
              error={!!errors.gbuildingNameMr}
              helperText={
                errors?.gbuildingNameMr ? errors.gbuildingNameMr.message : null
              }
            />
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("groadNameMr") ? true : false) ||
                // (router.query.groadNameMr ? true : false),
              }}
              id="standard-basic"
              //  label="Road Name"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("groadNameMr")}
              error={!!errors.groadNameMr}
              helperText={
                errors?.groadNameMr ? errors.groadNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"groadNameMr"}
              labelName={"roadNamemr"}
              fieldName={"groadNameMr"}
              updateFieldName={"groadName"}
              sourceLang={"mar"}
              InputLabelProps={{
                shrink: watch("groadName") ? true : false,
              }}
              targetLang={"eng"}
              width={230}
              targetError={"groadName"}
              disabled={disabled}
              label={<FormattedLabel id="roadNamemr" required />}
              error={!!errors.groadNameMr}
              helperText={
                errors?.groadNameMr ? errors.groadNameMr.message : null
              }
            />
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("glandmarkMr") ? true : false) ||
                // (router.query.glandmarkMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              // label="Landmark"
              variant="standard"
              disabled={disabled}
              {...register("glandmarkMr")}
              error={!!errors.glandmarkMr}
              helperText={
                errors?.glandmarkMr ? errors.glandmarkMr.message : null
              }
            /> */}

            <Transliteration
              _key={"glandmarkMr"}
              labelName={"Landmarkmr"}
              fieldName={"glandmarkMr"}
              updateFieldName={"glandmark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"glandmark"}
              InputLabelProps={{
                shrink: watch("glandmarkMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="Landmarkmr" required />}
              error={!!errors.glandmarkMr}
              helperText={
                errors?.glandmarkMr ? errors.glandmarkMr.message : null
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gcityName") ? true : false) ||
                // (router.query.gcityName ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              disabled={disabled}
              {...register("gcityName")}
              error={!!errors.gcityName}
              helperText={errors?.gcityName ? errors.gcityName.message : null}
            /> */}

            <Transliteration
              _key={"gcityName"}
              labelName={"cityName"}
              fieldName={"gcityName"}
              updateFieldName={"gcityNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              targetError={"gcityNameMr"}
              label={<FormattedLabel id="cityName" required />}
              error={!!errors.gcityName}
              helperText={errors?.gcityName ? errors.gcityName.message : null}
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gstate") ? true : false) ||
                // (router.query.gstate ? true : false),
              }}
              defaultValue="Maharashtra"
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              // label="State *"
              disabled
              variant="standard"
              {...register("gstate")}
              error={!!errors.gstate}
              helperText={errors?.gstate ? errors.gstate.message : null}
            />
          </div>

          <div>
            {/* <TextField
              InputLabelProps={{
                shrink: temp,
                // (watch("gcityNameMr") ? true : false) ||
                // (router.query.gcityNameMr ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              disabled={disabled}
              {...register("gcityNameMr")}
              error={!!errors.gcityNameMr}
              helperText={
                errors?.gcityNameMr ? errors.gcityNameMr.message : null
              }
            /> */}
            <Transliteration
              _key={"gcityNameMr"}
              labelName={"cityNamemr"}
              fieldName={"gcityNameMr"}
              updateFieldName={"gcityName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              targetError={"gcityName"}
              InputLabelProps={{
                shrink: watch("gcityNameMr") ? true : false,
              }}
              disabled={disabled}
              label={<FormattedLabel id="cityNamemr" required />}
              error={!!errors.gcityNameMr}
              helperText={
                errors?.gcityNameMr ? errors.gcityNameMr.message : null
              }
            />
          </div>
          <div>
            <TextField
              InputLabelProps={{
                shrink: temp,
                // shrink:(watch("gstateMr") ? true : false)
                // (router.query.gstateMr ? true : false),
              }}
              defaultValue="महाराष्ट्र"
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              // label="State *"
              disabled
              variant="standard"
              {...register("gstateMr")}
              error={!!errors.gstateMr}
              helperText={errors?.gstateMr ? errors.gstateMr.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              inputProps={{ maxLength: 6 }}
              InputLabelProps={{
                shrink: temp,
                // (watch("gpincode") ? true : false) ||
                // (router.query.gpincode ? true : false),
              }}
              id="standard-basic"
              // label="Pin Code *"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              disabled={disabled}
              {...register("gpincode")}
              error={!!errors.gpincode}
              helperText={errors?.gpincode ? errors.gpincode.message : null}
            />
          </div>
          <div>
            <TextField
              inputProps={{ maxLength: 10 }}
              InputLabelProps={{
                shrink: temp,
                // (watch("gmobileNo") ? true : false) ||
                // (router.query.gmobileNo ? true : false),
              }}
              id="standard-basic"
              // label="Mobile Number"
              label={<FormattedLabel id="mobileNo" required />}
              variant="standard"
              disabled={disabled}
              {...register("gmobileNo")}
              error={!!errors.gmobileNo}
              helperText={errors?.gmobileNo ? errors.gmobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gAgeProofDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="AgeDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Age Proof"
                  >
                    {gAgeProofDocumentKey &&
                      gAgeProofDocumentKey.map(
                        (gAgeProofDocumentKey, index) => (
                          <MenuItem key={index} value={gAgeProofDocumentKey.id}>
                            {gAgeProofDocumentKey.gAgeProofDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="gAgeProofDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gAgeProofDocumentKey
                  ? errors.gAgeProofDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div> */}

          {/* <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gIdDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="IdDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  ID Document"
                  >
                    {gIdDocumentKeys &&
                      gIdDocumentKeys.map((gIdDocumentKey, index) => (
                        <MenuItem key={index} value={gIdDocumentKey.id}>
                          {gIdDocumentKey.gIdDocumentKey}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="gIdDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gIdDocumentKey ? errors.gIdDocumentKey.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}
        </div>
        {/* <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.gResidentialDocumentKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="residentialDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=" Residential Document"
                  >
                    {gResidentialDocumentKeys &&
                      gResidentialDocumentKeys.map(
                        (gResidentialDocumentKey, index) => (
                          <MenuItem
                            key={index}
                            value={gResidentialDocumentKey.id}
                          >
                            {gResidentialDocumentKey.gResidentialDocumentKey}
                          </MenuItem>
                        ),
                      )}
                  </Select>
                )}
                name="gResidentialDocumentKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.gResidentialDocumentKey
                  ? errors.gResidentialDocumentKey.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ minWidth: 120, marginLeft: '2.5vw' }}
              error={!!errors.witnessDocument}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="StatusOfDocument" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 230 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="  Status of Document"
                  >
                    <MenuItem value={1}>Pending</MenuItem>
                    <MenuItem value={2}>Successful</MenuItem>
                  </Select>
                )}
                name="witnessDocument"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.witnessDocument
                  ? errors.witnessDocument.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div> */}

        {/* <div className={styles.row} style={{ marginTop: 30 }}>
          <h1>{<FormattedLabel id="groomParaentDetail" />}</h1>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNameF" />}
              variant="standard"
              {...register('gFFName')}
              error={!!errors.gFFName}
              helperText={errors?.gFFName ? errors.gFFName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="middleNameF" />}
              variant="standard"
              {...register('gFMName')}
              error={!!errors.gFMName}
              helperText={errors?.gFMName ? errors.gFMName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="lastNameF" />}
              variant="standard"
              {...register('gFLName')}
              error={!!errors.gFLName}
              helperText={errors?.gFLName ? errors.gFLName.message : null}
            />
          </div>

          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AgeF" />}
              variant="standard"
              {...register('gFAge')}
              error={!!errors.gFAge}
              helperText={errors?.gFAge ? errors.gFAge.message : null}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNoF" />}
              variant="standard"
              {...register('gFAadharNo')}
              error={!!errors.gFAadharNo}
              helperText={errors?.gFAadharNo ? errors.gFAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNoF" />}
              variant="standard"
              {...register('gFMobileNo')}
              error={!!errors.gFMobileNo}
              helperText={errors?.gFMobileNo ? errors.gFMobileNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNameM" />}
              variant="standard"
              {...register('gMFName')}
              error={!!errors.gMFName}
              helperText={errors?.gMFName ? errors.gMFName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="middleNameM" />}
              variant="standard"
              {...register('gMMName')}
              error={!!errors.gMMName}
              helperText={errors?.gMMName ? errors.gMMName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="lastNameM" />}
              variant="standard"
              {...register('gMLName')}
              error={!!errors.gMLName}
              helperText={errors?.gMLName ? errors.gMLName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AgeM" />}
              variant="standard"
              {...register('gMAge')}
              error={!!errors.gMAge}
              helperText={errors?.gMAge ? errors.gMAge.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="AadharNoM" />}
              variant="standard"
              {...register('gMAadharNo')}
              error={!!errors.gMAadharNo}
              helperText={errors?.gMAadharNo ? errors.gMAadharNo.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNoM" />}
              variant="standard"
              {...register('gMMobileNo')}
              error={!!errors.gMMobileNo}
              helperText={errors?.gMMobileNo ? errors.gMMobileNo.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="email" />}
              variant="standard"
              {...register('gFEmail')}
              error={!!errors.gFEmail}
              helperText={errors?.bFEmail ? errors.gFEmail.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              {...register('gFBuildingNo')}
              error={!!errors.gFBuildingNo}
              helperText={
                errors?.gFBuildingNo ? errors.gFBuildingNo.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" />}
              variant="standard"
              {...register('gFBuildingName')}
              error={!!errors.gFBuildingName}
              helperText={
                errors?.gFBuildingName ? errors.gFBuildingName.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" />}
              variant="standard"
              {...register('gFRoadName')}
              error={!!errors.gFRoadName}
              helperText={errors?.gFRoadName ? errors.gFRoadName.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" />}
              bFVillageName
              variant="standard"
              {...register('gFLandmark')}
              error={!!errors.gFLandmark}
              helperText={errors?.gFLandmark ? errors.gFLandmark.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="villageName" />}
              variant="standard"
              {...register('gFVillageName')}
              error={!!errors.gFVillageName}
              helperText={
                errors?.gFVillageName ? errors.gFVillageName.message : null
              }
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" />}
              variant="standard"
              {...register('gFCityName')}
              error={!!errors.gFCityName}
              helperText={errors?.gFCityName ? errors.gFCityName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="state" />}
              variant="standard"
              {...register('gFState')}
              error={!!errors.gFState}
              helperText={errors?.gFState ? errors.gFState.message : null}
            />
          </div>
        </div>

        <div>
          <TextField
            sx={{ width: 230, marginLeft: '2.5vw' }}
            id="standard-basic"
            label={<FormattedLabel id="pincode" />}
            variant="standard"
            {...register('gFPincode')}
            error={!!errors.gFPincode}
            helperText={errors?.gFPincode ? errors.gFPincode.message : null}
          />
        </div> */}
      </div>
    </>
  );
};

export default GroomDetails;
// {...register('addressCheckBoxG')}
