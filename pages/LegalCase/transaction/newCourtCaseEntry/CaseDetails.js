import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";

import Transliteration from "../../../../components/common/linguosol/transliteration";
import GoogleTranslationComponent from "../../../../components/common/linguosol/googleTranslation";

import Loader from "../../../../containers/Layout/components/Loader";

import { catchExceptionHandlingMethod } from "../../../../util/util";

const CaseDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors, isDirty },
  } = useFormContext();
  const [courtNames, setCourtNames] = useState([]);
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [disabledButtonInputState, setDisabledButtonInputState] =
    useState(false);
  const [dropDownValue, setDropDownValue] = useState(false);
  const [allCaseNumbers, setAllCaseNumbers] = useState([]);
  const caseMainType = watch("caseMainType");
  console.log("caseMainType", caseMainType);
  const textFieldRef = useRef();
  const clickOutsideHandlerRef = useRef();
  const [loading, setLoading] = useState(false);

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
  // For Case Details Translate

  const caseDetailsApi = (currentFieldInput, updateFieldName, languagetype) => {
    //---------------------------------- old-----------------------------------------
    // let stringToSend = currentFieldInput;
    // const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;
    // axios.post(url, { body: stringToSend }).then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     let bodyResponse = JSON.parse(res?.data.text);
    //     console.log("titlepanelRemark", bodyResponse.body);
    //     setValue("caseDetailsMr", bodyResponse?.body);
    //   }
    // });

    // --------------------------------new by vishal--------------------------------------------------------

    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };

  const getAllCaseEntry = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let result = r.data.newCourtCaseEntry;

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            id: r.id,
            caseNumber: r.caseNumber,
          };
        });
        setAllCaseNumbers(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log("allCaseNumbers", allCaseNumbers);
  }, [allCaseNumbers]);

  const [pageMode, setPageMode] = useState();

  console.log("pageModeStepper", localStorage.getItem("pageMode"));

  useEffect(() => {
    setPageMode(localStorage.getItem("pageMode"));

    if (localStorage.getItem("pageMode") == "Add") {
      // console.log("caseNumber", watch("caseNumber"));
      console.log("______pageMode", localStorage.getItem("pageMode"));
    }
  }, [watch("caseNumber"), allCaseNumbers]);

  const handleBlur = () => {
    if (isDirty && !clickOutsideHandlerRef.current) {
      console.log("called");
      console.log("caseNumberValue2", allCaseNumbers);
      if (getValues("caseNumber")) {
        const exitCaseNumber = allCaseNumbers?.find(
          (obj) => obj?.caseNumber === getValues("caseNumber")
        );
        if (exitCaseNumber) {
          sweetAlert({
            // title: "Alert",
            title: language == "en" ? "Alert!" : "अलर्ट",

            // text: "CASE NUMBER EXISTS",
            text:
              language == "en"
                ? "CASE NUMBER EXISTS"
                : "केस नंबर अस्तित्वात आहे",
            icon: "warning",
            buttons: ["Cancel", "Ok"],
          }).then((ok) => {
            setValue("caseNumber", "");
          });
        }
      }

      document.addEventListener("mousedown", clickOutsideHandlerRef.current);
    }

    //aaa
  };

  // Court Names
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Case Types
  const getCaseTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //get subtype based on mainTypeId
  useEffect(() => {
    const getCaseSubType = async () => {
      //  setValue("subType", "");
      if (caseMainType == null || caseMainType === "") {
        setCaseSubTypes([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.LCMSURL}/master/caseSubType/getByCaseMainType?caseMainType=${caseMainType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const caseSubTypes = data.caseSubType.map((r, i) => ({
          id: r.id,
          subType: r.subType,
          caseSubTypeMr: r.caseSubTypeMr,
        }));
        console.log("caseSubTypes3232", caseSubTypes);
        setCaseSubTypes(caseSubTypes);
        // setValue("subType",caseSubTypes.find((item)=> item?.id === caseMainType).subType);
      } catch (err) {
        // catch (e) {
        //   console.log("Error", e.message);
        // }

        console.log("err", err);
        callCatchMethod(err, language);
      }
    };
    getCaseSubType();
  }, [caseMainType]);

  // years
  const getYears = () => {
    axios
      .get(`${urls.CFCURL}/master/year/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setYears(res.data.year);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // ------------- useEffect ------------

  useEffect(() => {
    getAllCaseEntry();
    getCourtName();
    getCaseTypes();
    // getCaseSubType();
    getYears();
    console.log();
    if (
      localStorage.getItem("disabledButtonInputState") == "true" ||
      localStorage.getItem("pageMode" == "View")
    ) {
      setDisabledButtonInputState(true);
    } else if (localStorage.getItem("disabledButtonInputState") == "false") {
      setDisabledButtonInputState(false);
    }
  }, []);

  useEffect(() => {}, [disabledButtonInputState]);

  useEffect(() => {
    console.log("addedEmpty", watch("filedAgainst"), watch("filedAgainstMr"));
    if (
      !(
        watch("filedAgainst") != null &&
        watch("filedAgainst") != "" &&
        watch("filedAgainst") != undefined
      )
    ) {
      setValue("filedAgainst", "Pimpri Chinchwad Municipal Corporation");
    }
    if (
      !(
        watch("filedAgainstMr") != null &&
        watch("filedAgainstMr") != "" &&
        watch("filedAgainstMr") != undefined
      )
    ) {
      setValue("filedAgainstMr", "पिंपरी चिंचवड महानगरपालिका");
    }
  }, []);

  // view
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Grid
            container
            style={{ marginLeft: 30, padding: "10px", marginTop: "20px" }}
          >
            {/* Court Name*/}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <FormControl sx={{ marginTop: 2 }} error={!!errors?.court}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="courtName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Court Name"
                  >
                    {courtNames &&
                      courtNames
                        .slice()
                        .sort((a, b) => a.courtName.localeCompare(b.courtName))
                        .map((courtName, index) => (
                          <MenuItem key={index} value={courtName?.id}>
                            {language == "en"
                              ? courtName?.courtName
                              : courtName?.courtMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="court"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.court ? errors?.court?.message : null}
              </FormHelperText>
            </FormControl> */}

              {/* New Autocomplete  */}

              <FormControl
                // variant="outlined"
                error={!!errors?.court}
                // sx={{ marginTop: 2 }}
              >
                <Controller
                  name="court"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                      }}
                      value={
                        courtNames?.find((data) => data?.id === value) || null
                      }
                      options={courtNames.sort((a, b) =>
                        // language === "en"
                        //   ? a.courtName.localeCompare(b.courtName)
                        //   : a.courtMr.localeCompare(b.courtMr)

                        //

                        language === "en"
                          ? (a.courtName || "").localeCompare(b.courtName || "")
                          : (a.courtMr || "").localeCompare(b.courtMr || "")
                      )} //! api Data
                      getOptionLabel={(courtName) =>
                        language == "en"
                          ? courtName?.courtName
                          : courtName?.courtMr
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="courtName" required />}
                          // variant="outlined"
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                <FormHelperText>
                  {errors?.court ? errors?.court?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Case Number */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              <FormControl
                error={!!errors?.caseNumber}
                variant="standard"
                size="small"
                sx={{ width: "90%" }}
              >
                <Controller
                  name="caseNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      ref={textFieldRef}
                      onBlur={handleBlur}
                      label={<FormattedLabel id="courtCaseNo" required />}
                      variant="standard"
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                <FormHelperText>
                  {errors?.caseNumber ? errors?.caseNumber?.message : null}
                </FormHelperText>
              </FormControl>

              {/* <TextField
              disabled={disabledButtonInputState}
              label={<FormattedLabel id='courtCaseNo' />}
              maxRows={4}
              ref={textFieldRef}
              onBlur={handleBlur}
              // value={caseNumberValue2}
              // onChange={handleCaseNumberChange}
              {...register("caseNumber")}
              error={!!errors?.caseNumber}
              helperText={
                errors?.caseNumber ? errors?.caseNumber?.message : null
              }
            /> */}
            </Grid>

            {/* Year */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <FormControl sx={{ marginTop: 2 }} error={!!errors?.year}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="year" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Year"
                  >
                    {years &&
                      years.map((year, index) => (
                        <MenuItem key={index} value={year?.id}>
                          {year?.year}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="year"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.year ? errors?.year?.message : null}
              </FormHelperText>
            </FormControl> */}

              {/* New Autocomplete  */}

              <FormControl
                // variant="outlined"
                error={!!errors?.year}

                // sx={{ marginTop: 2 }}
              >
                <Controller
                  name="year"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                      }}
                      value={years?.find((data) => data?.id === value) || null}
                      options={years} //! api Data
                      getOptionLabel={(year) =>
                        language == "en" ? year?.year : year?.year
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="year" required />}
                          // variant="outlined"
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                  disabled={disabledButtonInputState}
                />
                <FormHelperText>
                  {errors?.year ? errors?.year?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* priviouseCourtName */}
            <Grid
              item
              style={
                {
                  // marginTop: "20px",
                }
              }
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
            >
              {/* <FormControl
              variant="standard"
              sx={{ minWidth: 190 }}
              error={!!errors?.priviouseCourtName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="prevCourtName" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => {
                      setDropDownValue(true);
                      field.onChange(value);
                    }}
                    label="Previous Court Name"
                  >
                    {courtNames &&
                      courtNames
                        .slice()
                        .sort((a, b) => a.courtName.localeCompare(b.courtName))

                        .map((courtName, index) => (
                          <MenuItem key={index} value={courtName?.id}>
                            {language == "en"
                              ? courtName?.courtName
                              : courtName?.courtMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="priviouseCourtName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.priviouseCourtName
                  ? errors?.priviouseCourtName?.message
                  : null}
              </FormHelperText>
            </FormControl> */}

              {/* New Autocomplte  */}
              <FormControl
                // variant="outlined"
                // error={!!errors?.priviouseCourtName}
                sx={{ marginTop: 2 }}
              >
                <Controller
                  name="priviouseCourtName"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null);

                        setDropDownValue(true);
                        //! store Selected id -- dont change here
                      }}
                      value={
                        courtNames?.find((data) => data?.id === value) || null
                      }
                      options={courtNames.sort((a, b) =>
                        language === "en"
                          ? a.courtName.localeCompare(b.courtName)
                          : a.courtMr.localeCompare(b.courtMr)
                      )} //! api Data
                      getOptionLabel={(courtName) =>
                        language == "en"
                          ? courtName?.courtName
                          : courtName?.courtMr
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="prevCourtName" />}
                          // variant="outlined"
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                {/* <FormHelperText>
                  {errors?.priviouseCourtName
                    ? errors?.priviouseCourtName?.message
                    : null}
                </FormHelperText> */}
              </FormControl>
            </Grid>

            {/* Case Refrence No */}
            {/* {
            dropDownValue == true && ( */}
            <Grid
              item
              style={{
                marginTop: "40px",
              }}
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
            >
              <TextField
                // readOnly={dropDownValue}
                {...register("caseReference")}
                // disabled={dropDownValue == false || disabledButtonInputState}
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="caseRefNo" />}
                InputLabelProps={{
                  shrink: watch("caseReference") ? true : false,
                }}
                error={!!errors?.caseReference}
                helperText={
                  errors?.caseReference ? errors?.caseReference?.message : null
                }
              />
            </Grid>
            {/* )
          } */}

            {/* case Type */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <FormControl sx={{ marginTop: 2 }} error={!!errors?.caseMainType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseType" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Type"
                  >
                    {caseTypes &&
                      caseTypes
                        .slice()
                        .sort((a, b) =>
                          a.caseMainType.localeCompare(b.caseMainType)
                        )

                        .map((caseMainType, index) => (
                          <MenuItem key={index} value={caseMainType?.id}>
                            {language == "en"
                              ? caseMainType?.caseMainType
                              : caseMainType?.caseMainTypeMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="caseMainType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.caseMainType ? errors?.caseMainType?.message : null}
              </FormHelperText>
            </FormControl> */}

              {/* New Autocomplte  */}

              <FormControl
                // variant="outlined"
                error={!!errors?.caseMainType}
                sx={{ marginTop: "40px" }}
              >
                <Controller
                  name="caseMainType"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                      }}
                      value={
                        caseTypes?.find((data) => data?.id === value) || null
                      }
                      options={caseTypes.sort((a, b) =>
                        language === "en"
                          ? a.caseMainType.localeCompare(b.caseMainType)
                          : a.caseMainTypeMr.localeCompare(b.caseMainTypeMr)
                      )} //! api Data
                      getOptionLabel={(caseMainType) =>
                        language == "en"
                          ? caseMainType?.caseMainType
                          : caseMainType?.caseMainTypeMr
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="caseTypeN" required />}
                          // variant="outlined"
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                <FormHelperText>
                  {errors?.caseMainType ? errors?.caseMainType?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Case Sub Type */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <FormControl sx={{ marginTop: 2 }} error={!!errors?.subType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseSubType" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Sub-Type"
                  >
                    {caseSubTypes &&
                      caseSubTypes
                        .slice()
                        .sort((a, b) => a.subType.localeCompare(b.subType))

                        .map((subType, index) => (
                          <MenuItem key={index} value={subType.id}>
                            {subType.subType}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="subType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.subType ? errors?.subType?.message : null}
              </FormHelperText>
            </FormControl> */}

              {/* New Autocomplte  */}

              <FormControl
                // variant="outlined"
                error={!!errors?.subType}
                sx={{ marginTop: "40px" }}
              >
                <Controller
                  name="subType"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      variant="standard"
                      id="controllable-states-demo"
                      sx={{ width: 300 }}
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                      }}
                      value={
                        caseSubTypes?.find((data) => data?.id === value) || null
                      }
                      options={caseSubTypes.sort((a, b) =>
                        language === "en"
                          ? (a.subType || "").localeCompare(b.subType || "")
                          : (a.caseSubTypeMr || "").localeCompare(
                              b.caseSubTypeMr || ""
                            )
                      )} //! api Data
                      getOptionLabel={(subType) =>
                        language == "en"
                          ? subType?.subType
                          : subType?.caseSubTypeMr
                      } //! Display name the Autocomplete
                      renderInput={(params) => (
                        //! display lable list
                        <TextField
                          fullWidth
                          {...params}
                          label={<FormattedLabel id="caseSubTypeN" required />}
                          // variant="outlined"
                          variant="standard"
                        />
                      )}
                      disabled={disabledButtonInputState}
                    />
                  )}
                />
                <FormHelperText>
                  {errors?.subType ? errors?.subType?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Stamp No */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              <TextField
                sx={{
                  marginTop: "60px",
                }}
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="stampNo" />}
                {...register("stampNo")}
                InputLabelProps={{
                  shrink: watch("stampNo") ? true : false,
                }}
                error={!!errors?.stampNo}
                helperText={errors?.stampNo ? errors?.stampNo?.message : null}
              />
            </Grid>

            {/* filing Date */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              <FormControl
                label={<FormattedLabel id="fillingDate" />}
                sx={{ marginTop: "40px" }}
                disabled={disabledButtonInputState}
                error={!!errors.fillingDate}
              >
                <Controller
                  name="fillingDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="filingDate" required />
                          </span>
                        }
                        disabled={disabledButtonInputState}
                        inputFormat="DD/MM/YYYY"
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                          setValue(
                            "appearanceDate",
                            moment(date).add(30, "days")
                          );
                        }}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField {...params} size="small" fillingDate />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.fillingDate ? errors?.fillingDate?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* filied By */}
            {/* <Grid item xl={2.1} lg={2.1} md={6} sm={6} xs={12}> */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{
                marginTop: "40px",
              }}
            >
              <TextField
                // style={{
                //   marginTop: "60px",
                // }}
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="filedByEn" />}
                {...register("filedBy")}
                error={!!errors?.filedBy}
                helperText={errors?.filedBy ? errors?.filedBy?.message : null}
              />

              {/* New Transliteration  */}

              {/* <GoogleTranslationComponent
                disabled={disabledButtonInputState}
                // _key={"filedBy"}
                // labelName={"filedBy"}
                width="240px"
                fieldName={"filedBy"}
                updateFieldName={"filedByMr"}
                sourceLang={"en"}
                targetLang={"mr"}
                targetError={"filedByMr"}
                // disabled={disabled}
                label={<FormattedLabel id="filedByEn" required />}
                error={!!errors.filedBy}
                helperText={errors?.filedBy ? errors.filedBy.message : null}
              /> */}
            </Grid>

            {/* <Grid item xl={0.9} lg={0.9}></Grid> */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={
                {
                  // marginTop: "40px",
                }
              }
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Button
                // style={{ flexDirection: "column" }}
                sx={{
                  marginTop: "70px",
                  marginLeft: "1vw",
                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("filedBy"), "filedByMr", "en")
                }
              >
                <FormattedLabel id="mar" />
              </Button>
              <Button
                // style={{ flexDirection: "column" }}
                sx={{
                  marginTop: "10px",
                  marginLeft: "1vw",
                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("filedByMr"), "filedBy", "mr")
                }
              >
                <FormattedLabel id="eng" />
              </Button>
            </Grid>
            {/* <Grid item xl={0.9} lg={0.9}></Grid> */}

            {/* filied By Mr */}
            {/* <Grid item xl={2.1} lg={2.1} md={6} sm={6} xs={12}> */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              sx={{
                marginTop: "40px",
              }}
            >
              <TextField
                // style={{
                //   marginTop: "60px",
                // }}
                disabled={disabledButtonInputState}
                {...register("filedByMr")}
                label={<FormattedLabel id="filedByMr" />}
                error={!!errors?.filedByMr}
                helperText={
                  errors?.filedByMr ? errors?.filedByMr?.message : null
                }
              />

              {/* New Transliteration  */}

              {/* <GoogleTranslationComponent
                sx={{
                  marginTop: "40px",
                }}
                disabled={disabledButtonInputState}
                _key={"filedByMr"}
                width="240px"
                labelName={"filedByMr"}
                fieldName={"filedByMr"}
                updateFieldName={"filedBy"}
                sourceLang={"mr"}
                targetLang={"en"}
                targetError={"filedBy"}
                // disabled={disabled}
                label={<FormattedLabel id="filedByMr" required />}
                error={!!errors.filedByMr}
                helperText={errors?.filedByMr ? errors.filedByMr.message : null}
              /> */}
            </Grid>
          </Grid>

          {/* Grid container for Field Agnainst */}
          <Grid
            container
            style={{ marginLeft: 30, padding: "10px", marginTop: "10px" }}
          >
            {/* filied Agnainst */}
            {/* <Grid item xl={3.5} lg={3.5} md={6} sm={6} xs={12}> */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <GoogleTranslationComponent
                disabled={disabledButtonInputState}
                // _key={"filedBy"}
                // labelName={"filedBy"}
                width="240px"
                fieldName={"filedAgainst"}
                updateFieldName={"filedAgainstMr"}
                sourceLang={"en"}
                targetLang={"mr"}
                targetError={"filedAgainstMr"}
                // disabled={disabled}
                label={<FormattedLabel id="filedAgainstEn" required />}
                error={!!errors.filedAgainst}
                helperText={
                  errors?.filedAgainst ? errors.filedAgainst.message : null
                }
              /> */}
              <TextField
                style={{
                  width: "100%",
                  marginTop: "40px",
                }}
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="filedAgainstEn" />}
                {...register("filedAgainst")}
                // InputProps={{
                //   style: { fontSize: "11px", fontWeight: "bold" }, // Set the font size to 'small'
                // }}
                error={!!errors?.filedAgainst}
                helperText={
                  errors?.filedAgainst ? errors?.filedAgainst?.message : null
                }
              />

              {/* New Transliteration */}
              {/** 
              <Transliteration
                disabled={disabledButtonInputState}
                _key={"filedAgainst"}
                labelName={"filedAgainst"}
                fieldName={"filedAgainst"}
                updateFieldName={"filedAgainstMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                // disabled={disabled}
                label={<FormattedLabel id="filedAgainstEn" required />}
                error={!!errors.filedAgainst}
                helperText={
                  errors?.filedAgainst ? errors.filedAgainst.message : null
                }
              />
              */}
            </Grid>
            {/* <Grid item xl={0.9} lg={0.9}></Grid> */}
            <Grid item xl={0.6} lg={0.6}></Grid>
            <Grid item xl={2.1} lg={2.1} md={6} sm={6} xs={12}>
              <Button
                sx={{
                  marginTop: "40px",

                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("filedAgainst"), "filedAgainstMr", "en")
                }
              >
                <FormattedLabel id="mar" />
              </Button>
              <Button
                // style={{ flexDirection: "column" }}
                sx={{
                  marginTop: "10px",
                  // marginLeft: "1vw",
                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("filedAgainstMr"), "filedAgainst", "mr")
                }
              >
                <FormattedLabel id="eng" />
              </Button>
            </Grid>

            {/* filied Aginast Mr */}
            <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
              {/* <GoogleTranslationComponent
                disabled={disabledButtonInputState}
                // _key={"filedBy"}
                // labelName={"filedBy"}
                width="240px"
                fieldName={"filedAgainstMr"}
                updateFieldName={"filedAgainst"}
                sourceLang={"mr"}
                targetLang={"en"}
                targetError={"filedAgainst"}
                // disabled={disabled}
                label={<FormattedLabel id="filedAgainstMr" required />}
                error={!!errors.filedAgainstMr}
                helperText={
                  errors?.filedAgainstMr ? errors.filedAgainstMr.message : null
                }
              /> */}
              <TextField
                style={{
                  marginTop: "40px",
                  marginLeft: "10px",
                }}
                disabled={disabledButtonInputState}
                label={<FormattedLabel id="filedAgainstMr" />}
                {...register("filedAgainstMr")}
                error={!!errors?.filedAgainstMr}
                helperText={
                  errors?.filedAgainstMr
                    ? errors?.filedAgainstMr?.message
                    : null
                }
              />

              {/* New Transliteration  */}
              {/** 
              <Transliteration
                disabled={disabledButtonInputState}
                _key={"filedAgainstMr"}
                labelName={"filedAgainstMr"}
                fieldName={"filedAgainstMr"}
                updateFieldName={"filedAgainst"}
                sourceLang={"mar"}
                targetLang={"eng"}
                 disabled={disabled}
                label={<FormattedLabel id="filedAgainstMr" required />}
                error={!!errors.filedAgainstMr}
                helperText={
                  errors?.filedAgainstMr ? errors.filedAgainstMr.message : null
                }
              />
               */}
            </Grid>
          </Grid>

          {/* for case Details in English*/}
          <Grid container style={{ marginLeft: 30, padding: "10px" }}>
            {/* case Details in English */}
            <Grid item xl={11.2} lg={11.2} md={12} sm={12} xs={12}>
              {/* <GoogleTranslationComponent
                disabled={disabledButtonInputState}
                // _key={"filedBy"}
                // labelName={"filedBy"}
                // width="240px"
                fieldName={"caseDetails"}
                updateFieldName={"caseDetailsMr"}
                sourceLang={"en"}
                targetLang={"mr"}
                targetError={"caseDetailsMr"}
                label={<FormattedLabel id="caseDetails" />}
                error={!!errors.caseDetails}
                helperText={
                  errors?.caseDetails ? errors.caseDetails.message : null
                }
              /> */}
              <TextField
                style={{
                  width: "87%",
                  marginTop: "40px",
                }}
                disabled={disabledButtonInputState}
                id="standard-textarea"
                label={<FormattedLabel id="caseDetails" />}
                multiline
                // rows={4}
                variant="standard"
                {...register("caseDetails")}
                error={!!errors?.caseDetails}
                helperText={
                  errors?.caseDetails ? errors?.caseDetails?.message : null
                }
                InputLabelProps={{
                  shrink:
                    (watch("caseDetails") ? true : false) ||
                    (router.query.caseDetails ? true : false),
                }}
              />
              <Button
                sx={{
                  marginTop: "50px",
                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("caseDetails"), "caseDetailsMr", "en")
                }
              >
                <FormattedLabel id="mar" />
              </Button>

              {/* New Transliteration  */}
              {/* <Transliteration
              disabled={disabledButtonInputState}
              _key={"caseDetails"}
              labelName={"caseDetails"}
              fieldName={"caseDetails"}
              updateFieldName={"caseDetailsMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="caseDetails" required />}
              error={!!errors.caseDetails}
              helperText={
                errors?.caseDetails ? errors.caseDetails.message : null
              }
            /> */}
            </Grid>
            {/* <Grid item xl={1} lg={1}></Grid> */}

            {/* Case Details in Marathi */}
            <Grid item xl={11.2} lg={11.2} md={12} sm={12} xs={12}>
              {/* <GoogleTranslationComponent
                disabled={disabledButtonInputState}
                // _key={"filedBy"}
                // labelName={"filedBy"}
                // width="240px"
                fieldName={"caseDetailsMr"}
                updateFieldName={"caseDetails"}
                sourceLang={"mr"}
                targetLang={"en"}
                targetError={"caseDetails"}
                label={<FormattedLabel id="caseDetailsMr" />}
                error={!!errors.caseDetailsMr}
                helperText={
                  errors?.caseDetailsMr ? errors.caseDetailsMr.message : null
                }
              /> */}
              <TextField
                style={{
                  width: "87%",
                  marginTop: "40px",
                }}
                disabled={disabledButtonInputState}
                id="standard-textarea"
                // label={<FormattedLabel id="caseDetails" />}
                label="Case Details in Marathi"
                multiline
                // rows={4}
                variant="standard"
                {...register("caseDetailsMr")}
                error={!!errors?.caseDetailsMr}
                helperText={
                  errors?.caseDetailsMr ? errors?.caseDetailsMr?.message : null
                }
                InputLabelProps={{
                  shrink:
                    (watch("caseDetailsMr") ? true : false) ||
                    (router.query.caseDetailsMr ? true : false),
                }}
              />
              <Button
                sx={{
                  marginTop: "50px",
                  height: "4vh",
                  width: "9vw",
                }}
                onClick={() =>
                  caseDetailsApi(watch("caseDetailsMr"), "caseDetails", "mr")
                }
              >
                <FormattedLabel id="eng" />
              </Button>

              {/* New Transliteration  */}
              {/* <Transliteration
              disabled={disabledButtonInputState}
              _key={"caseDetailsMr"}
              labelName={"caseDetailsMr"}
              fieldName={"caseDetailsMr"}
              updateFieldName={"caseDetails"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="caseDetailsMr" required />}
              error={!!errors.caseDetailsMr}
              helperText={
                errors?.caseDetailsMr ? errors.caseDetailsMr.message : null
              }
            /> */}
            </Grid>
          </Grid>
        </ThemeProvider>
      )}
    </>
  );
};

export default CaseDetails;
