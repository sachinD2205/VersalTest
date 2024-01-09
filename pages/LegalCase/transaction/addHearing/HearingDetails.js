import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { useEffect, useState } from "react";
// import styles from "./view.module.css";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import urls from "../../../../URLS/urls";

import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";

import { catchExceptionHandlingMethod } from "../../../../util/util";

const HearingDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state.labels.language);

  const router = useRouter();
  const [hearingDate, setHearingDate] = React.useState(null);
  const [nextHearingDate, setNextHearingDate] = React.useState(null);
  const [interimOrderDate, setInterimOrderDate] = React.useState(null);
  const [finalOrderDate, setFinalOrderDate] = React.useState(null);
  const [courtNames, setCourtNames] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [selectedCaseNo, setSelectedCaseNo] = useState(""); //for filter
  const [showDatePicker, setShowDatePicker] = useState([]);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState();
  const [loading, setLoading] = useState(false);

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

  // For remarkApi
  // const remarkApi = (currentField) => {
  //   // let body = {
  //   //   ...currentField,
  //   // }
  //   let stringToSend = currentField;
  //   console.log("transalation", currentField);
  //   // const currentField = currentField;
  //   // const UpdatedField = UpdatedField;
  //   const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;

  //   axios.post(url, { body: stringToSend }).then((res) => {
  //     if (res?.status == 200 || res?.status == 201) {
  //       let bodyResponse = JSON.parse(res?.data.text);
  //       console.log("resssss123", bodyResponse.body);
  //       setValue("remarkMr", bodyResponse?.body);
  //     }
  //   });
  // };

  //  New
  const remarkApi = (currentFieldInput, updateFieldName, languagetype) => {
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
  // get Court Name

  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getCourtData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Case Stages

  const getCaseStages = (caseStatus) => {
    axios
      .get(
        `${urls.LCMSURL}/master/caseStages/getAll?caseStatus=${caseStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("casestages", res);
        setCaseStages(
          res.data.caseStages.map((r, i) => ({
            id: r.id,
            caseStages: r.caseStages,
            caseStagesMr: r.caseStagesMr,
          }))
        );
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  // get Case Type

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
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getCourtCaseNumber = () => {
    // alert("sdf")
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res4353453534534", res.data.newCourtCaseEntry);
        setCaseNumbers(
          res?.data?.newCourtCaseEntry.map((r, i) => ({
            id: r?.id,
            // courtCaseNumber: r.courtCaseNumber,
            caseNumber: r?.caseNumber,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("Data------", router?.query);
      setValue("caseMainType", router?.query?.caseMainType);
      setValue("fillingDate", router?.query?.fillingDate);
      // fillingDate

      setValue("courtCaseNumber", router?.query?.courtCaseNumber);
      setValue("caseNumber", router?.query?.caseNumber);
      setValue("caseNoYear", router?.query?.caseNoYear);

      setValue("court", router.query.court);

      // reset(router.query);
    }
  }, []);

  const [caseStatusNumber, setCaseStatusNumber] = useState();
  const [caseStatusArray, setCaseStatusArray] = useState([]);

  console.log("caseStatusArray", caseStatusArray);

  // get Case Status
  const getCaseStatus = () => {
    axios
      .get(
        `${urls.LCMSURL}/master/caseStages/getCaseStagesByStatus?caseStatus=${caseStatusNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("resOfCaseStatus", res?.data);
        setCaseStatusArray(
          res?.data
          // res.data.newCourtCaseEntry.map((r, i) => ({
          //   id: r.id,
          //   // courtCaseNumber: r.courtCaseNumber,
          //   caseNumber: r.caseNumber,
          // }))
        );
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  useEffect(() => {
    getCaseStatus();
  }, [caseStatusNumber]);

  useEffect(() => {
    getCaseTypes();
    getCaseStages();
    getCourtCaseNumber();
    // getCourtName();
  }, []);

  useEffect(() => {
    console.log("fillingDate", watch("fillingDate"));
  }, [watch("fillingDate")]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <Box sx={{ p: 3 }} boxShadow={2}> */}
          {/* Title */}

          <Box
            // style={{
            //   display: "flex",
            //   // justifyContent: "center",
            //   // marginLeft:'50px',
            //   paddingTop: "10px",
            //   marginTop: "20px",

            //   background:
            //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            // }}

            style={{
              // backgroundColor: "#0084ff",
              backgroundColor: "#556CD6",
              // backgroundColor: "#1C39BB",
              display: "flex",
              justifyContent: "center",
              // marginLeft:'50px',

              // #00308F
              color: "white",
              fontSize: 19,
              marginTop: 30,
              // marginBottom: "50px",
              // marginTop: ,
              // padding: 8,
              // paddingLeft: 30,
              // marginLeft: "50px",
              // marginRight: "75px",
              borderRadius: 100,
            }}
          >
            <Typography
              style={{
                display: "flex",
                // marginLeft: "100px",
                color: "white",
                // justifyContent: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                <FormattedLabel id="hearingDetails" />
              </h2>
            </Typography>
          </Box>

          <Divider />

          {/* 1st Row */}
          <Grid
            container
            sx={{
              // marginLeft: "70px",
              // marginTop: "5px",
              marginTop: "50px",

              // padding: "30px",
            }}
          >
            <Grid item xl={1} lg={1}></Grid>
            {/* Case Number  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              {/* <FormControl
                fullWidth
                variant="standard"
                error={!!errors.caseNumber}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="courtCaseNo" />
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      // fullWidth
                      // size="small"
                      // disabled={router?.query?.pageMode === "View"}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Case Number"
                    >
                      {caseNumbers &&
                        caseNumbers.map((caseNumber, index) => (
                          <MenuItem key={index} value={caseNumber.id}>
                            {caseNumber.caseNumber}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="caseNumber"
                  control={control}
                  defaultValue=""
                />

                <FormHelperText>
                  {errors?.caseNumber ? errors.caseNumber.message : null}
                </FormHelperText>
              </FormControl> */}
              <TextField
                variant="standard"
                label={<FormattedLabel id="courtCaseNo" required />}
                disabled
                {...register("caseNoYear")}
                error={!!errors?.caseNoYear}
                helperText={
                  errors?.caseNoYear ? errors?.caseNoYear?.message : null
                }
              />
              {/* New */}
            </Grid>
            <Grid item xl={1} lg={1} md={1}></Grid>
            {/* Case Type  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                error={!!errors?.caseMainType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="caseType" />
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      // disabled={router?.query?.pageMode === "View"}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Case Type"
                    >
                      {caseTypes &&
                        caseTypes.map((caseMainType, index) => (
                          <MenuItem key={index} value={caseMainType.id}>
                            {caseMainType.caseMainType}
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
              </FormControl>
            </Grid>
            <Grid item xl={1} lg={1} md={1}></Grid>

            {/* filling Date  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                error={!!errors.fillingDate}
              >
                <Controller
                  control={control}
                  name="fillingDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled
                        // disabled={router?.query?.pageMode === "View"}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="filingDate" />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(
                            moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
                          )
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            variant="standard"
                            {...params}
                            // sx={{ width: 250 }}
                            // size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                // marginTop: 10,
                              },
                            }}
                          />
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
          </Grid>

          {/* 2nd row  */}
          <Grid
            container
            sx={{
              // marginLeft: "70px",
              // marginTop: "5px",
              marginTop: "50px",

              // padding: "30px",
            }}
          >
            <Grid item xl={1} lg={1}></Grid>

            {/* Hearing Date  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              <FormControl
                fullWidth
                disabled={router?.query?.pageMode === "View"}
                // style={{ marginTop: 10 }}
                // sx={{ width: "55%" }}
                // size="small"
                variant="standard"
                error={!!errors?.hearingDate}
              >
                <Controller
                  disabled={router?.query?.pageMode === "View"}
                  control={control}
                  name="hearingDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        disabled={router?.query?.pageMode === "View"}
                        // label="Hearing Date"
                        label={
                          <FormattedLabel id="hearingDate"></FormattedLabel>
                        }
                        value={field.value}
                        minDate={moment(watch("fillingDate")).add(1, "days")}
                        onChange={(date) =>
                          field.onChange(
                            moment(date, "DD-MM-YYYY").format("YYYY-MM-DD")
                          )
                        }
                        selected={field.value}
                        renderInput={(params) => (
                          <TextField
                            disabled={router?.query?.pageMode === "View"}
                            variant="standard"
                            fullWidth
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.hearingDate ? errors?.hearingDate?.message : null}
                </FormHelperText>
              </FormControl>
              {/* <FormControl
            style={{ backgroundColor: "white" }}
            error={!!errors.hearingDate}
          >
            <Controller
              control={control}
              name='hearingDate'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={router?.query?.pageMode === "View"}
                    minDate={moment(watch("fillingDate")).add(1, "days")}
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='hearingDate' />
                      </span>
                    }
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        variant='standard'
                        disabled={router?.query?.pageMode === "View"}
                        {...params}
                        size='small'
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
              {errors?.hearingDate ? errors.hearingDate.message : null}
            </FormHelperText>
          </FormControl> */}
            </Grid>

            <Grid item xl={1} lg={1} md={1}></Grid>
            {/* Case status  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              <FormControl
                fullWidth
                // sx={{ width: "55%" }}
                //  size="small"
                error={!!errors?.caseStatus}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="caseStatus" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={router?.query?.pageMode === "View"}
                      variant="standard"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={<FormattedLabel id="caseStatus" />}
                      value={field.value}
                      onChange={(value) => {
                        console.log("value", value);
                        field.onChange(value);
                        setShowDatePicker(value.target.value);
                        setCaseStatusNumber(value.target.value);
                      }}
                      style={{ backgroundColor: "white" }}
                    >
                      {[
                        { id: 1, caseStatus: "Running" },
                        { id: 2, caseStatus: "Dispose" },
                        // { id: 3, caseStatus: "Final Order" },
                        // { id: 4, caseStatus: "Case Dissmiss" },
                      ].map((menu, index) => {
                        return (
                          <MenuItem key={index} value={menu?.id}>
                            {menu?.caseStatus}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                  name="caseStatus"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.caseStatus ? errors?.caseStatus?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xl={1} lg={1} md={1}></Grid>
            {/* Case stages  */}
            <Grid item xl={2.5} lg={2.5} md={6} sm={6} xs={12}>
              <FormControl
                fullWidth
                // sx={{ width: "55%" }}
                // size="small"
                variant="standard"
                error={!!errors?.caseStage}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="caseStagesEn" />
                </InputLabel>

                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: "55%" }}
                      disabled={router?.query?.pageMode === "View"}
                      //   sx={{ width: 500 }}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Case Stages"
                    >
                      {caseStatusArray &&
                        caseStatusArray.map((caseStages, index) => (
                          <MenuItem key={index} value={caseStages?.id}>
                            {caseStages?.caseStages}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="caseStage"
                  //   control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.caseStage ? errors?.caseStage?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {/* 3rd Row  */}
          <Grid
            container
            sx={{
              // marginLeft: "70px",
              // marginTop: "5px",
              marginTop: "50px",

              // padding: "30px",
            }}
          >
            <Grid item xl={1} lg={1}></Grid>
            <Grid item xl={2} lg={2}>
              {showDatePicker === 1 && (
                <FormControl
                  fullWidth
                  style={{ marginTop: 10 }}
                  // sx={{ width: "60%" }}
                  // size="small"
                  variant="standard"
                  // error={!!errors?.nextHearingDate}
                >
                  <Controller
                    control={control}
                    name="nextHearingDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          minDate={watch("hearingDate")}
                          disabled={router?.query?.pageMode === "View"}
                          label="Next Hearing Date"
                          // InputProps={{ style: { fontSize: 5 } }}
                          // InputLabelProps={{ style: { fontSize: 50 } }}
                          // size="small"
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          renderInput={(params) => (
                            <TextField
                              disabled={router?.query?.pageMode === "View"}
                              variant="standard"
                              style={{ marginTop: 10 }}
                              // sx={{ width: "60%" }}
                              // InputLabelProps={{ style: { fontSize: 13 } }}
                              InputProps={{ style: { fontSize: 20 } }}
                              InputLabelProps={{ style: { fontSize: 13 } }}
                              {...params}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {/* <FormHelperText>
                {errors?.nextHearingDate ? errors?.nextHearingDate?.message : null}
              </FormHelperText> */}
                </FormControl>
              )}

              {showDatePicker === 2 && (
                <></>
                // <FormControl
                //   fullWidth
                //   style={{ marginTop: 10 }}
                //   // sx={{ width: "60%" }}
                //   // size="small"
                //   variant="standard"
                //   error={!!errors?.interimOrderDate}
                // >
                //   <Controller
                //     control={control}
                //     name="interimOrderDate"
                //     defaultValue={null}
                //     render={({ field }) => (
                //       <LocalizationProvider dateAdapter={AdapterMoment}>
                //         <DatePicker
                //           label="Interim Order Date"
                //           // InputProps={{ style: { fontSize: 5 } }}
                //           // InputLabelProps={{ style: { fontSize: 50 } }}
                //           value={field.value}
                //           onChange={(date) =>
                //             field.onChange(moment(date).format("YYYY-MM-DD"))
                //           }
                //           selected={field.value}
                //           renderInput={(params) => (
                //             <TextField
                //               variant="standard"
                //               // sx={{ width: "60%" }}
                //               // InputLabelProps={{ style: { fontSize: 13 } }}
                //               InputProps={{ style: { fontSize: 20 } }}
                //               InputLabelProps={{ style: { fontSize: 13 } }}
                //               {...params}
                //             />
                //           )}
                //         />
                //       </LocalizationProvider>
                //     )}
                //   />
                //   <FormHelperText>
                //     {errors?.interimOrderDate
                //       ? errors?.interimOrderDate?.message
                //       : null}
                //   </FormHelperText>
                // </FormControl>
              )}

              {/* {showDatePicker === 3 && (
            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              variant="standard"
              error={!!errors?.finalOrderDate}
            >
              <Controller
                control={control}
                name="finalOrderDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Final Order Date"
                      // InputProps={{ style: { fontSize: 5 } }}
                      // InputLabelProps={{ style: { fontSize: 50 } }}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      renderInput={(params) => (
                        <TextField
                          disabled={router?.query?.pageMode === "View"}
                          variant="standard"
                          // sx={{ width: "55%" }}
                          InputProps={{ style: { fontSize: 20 } }}
                          InputLabelProps={{ style: { fontSize: 13 } }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.finalOrderDate
                  ? errors?.finalOrderDate?.message
                  : null}
              </FormHelperText>
            </FormControl>
          )} */}
            </Grid>
          </Grid>

          {/* 4th Row  */}
          <Grid
            container
            sx={{
              // marginLeft: "70px",
              // marginTop: "5px",
              marginTop: "50px",

              // padding: "30px",
            }}
          >
            <Grid item xl={1} lg={1}></Grid>

            {/* Remark in English  */}
            <Grid item xl={10} lg={10} sm={12} md={12} xs={12}>
              <TextField
                disabled={router?.query?.pageMode === "View"}
                variant="standard"
                sx={{ width: "85%" }}
                id="outlined-multiline-flexible"
                label={<FormattedLabel id="remarksEn" />}
                multiline
                maxRows={4}
                error={!!errors?.remark}
                helperText={errors?.remark ? errors?.remark?.message : null}
                {...register("remark")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("remark") ? true : false) ||
                    (router.query.remark ? true : false),
                }}
              />

              {/*  Button For Translation */}
              <Button
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginLeft: "1vw",
                  height: "5vh",
                  width: "9vw",
                }}
                onClick={() => remarkApi(watch("remark"), "remarkMr", "en")}
              >
                {/* Translate */}
                <FormattedLabel id="mar" />
              </Button>

              {/* New Transliteration  */}

              {/* <Transliteration
            _key={"remark"}
            labelName={"remark"}
            fieldName={"remark"}
            updateFieldName={"remarkMr"}
            sourceLang={"eng"}
            targetLang={"mar"}
            // disabled={disabled}
            label={<FormattedLabel id='remarksEn' required />}
            error={!!errors.remark}
            helperText={errors?.remark ? errors.remark.message : null}
          /> */}
            </Grid>
          </Grid>

          {/* 5th row  */}
          <Grid
            container
            sx={{
              // marginLeft: "70px",
              // marginTop: "5px",
              marginTop: "50px",

              // padding: "30px",
            }}
          >
            <Grid item xl={1} lg={1}></Grid>
            {/* Remark in Marathi  */}
            <Grid item xl={10} lg={10} sm={12} md={12} xs={12}>
              <TextField
                disabled={router?.query?.pageMode === "View"}
                variant="standard"
                sx={{ width: "85%" }}
                id="outlined-multiline-flexible"
                label={<FormattedLabel id="remarksMr" />}
                multiline
                maxRows={4}
                {...register("remarkMr")}
                error={!!errors?.remarkMr}
                helperText={errors?.remarkMr ? errors?.remarkMr?.message : null}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("remarkMr") ? true : false) ||
                    (router.query.remarkMr ? true : false),
                }}
              />

              <Button
                variant="contained"
                sx={{
                  marginTop: "20px",
                  marginLeft: "1vw",
                  height: "5vh",
                  width: "9vw",
                }}
                onClick={() => remarkApi(watch("remarkMr"), "remark", "mr")}
              >
                {/* Translate */}
                <FormattedLabel id="eng" />
              </Button>

              {/* New Transliteration  */}

              {/* <Transliteration
            _key={"remarkMr"}
            labelName={"remarkMr"}
            fieldName={"remarkMr"}
            updateFieldName={"remark"}
            sourceLang={"mar"}
            targetLang={"eng"}
            // disabled={disabled}
            label={<FormattedLabel id="remarksMr" required />}
            error={!!errors.remarkMr}
            helperText={errors?.remarkMr ? errors.remarkMr.message : null}
          /> */}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default HearingDetails;
