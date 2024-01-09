import {
  Autocomplete,
  Box,
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
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// import styles from "./view.module.css";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const CaseDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [caseTypes, setCaseTypes] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [selectedCaseNumberData, setSelectedCaseNumberData] = useState({});

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

  const getCourtCaseNumber = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseNumbers(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
            caseNoYear: r.caseNoYear,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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

  const getCaseSubType = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseSubTypes(
          res.data.caseSubType.map((r, i) => ({
            id: r.id,
            subType: r.subType,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getYears = () => {
    axios
      .get(`${urls.CFCURL}i/master/year/getAll`, {
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

  const getCaseDetails = (caseNoYear) => {
    console.log("caseNoYear", caseNoYear);
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCaseDetailsByCaseNumber?caseNumber=${caseNoYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(
          "sdf878887",
          response?.data[0]?.trnAddHearingDao?.nextHearingDate,
          response?.data[0]?.appearanceDate
        );
        if (
          response?.data?.length != "0" &&
          response?.data?.length != undefined
        ) {
          console.log("dataaa", response?.data[0]);

          setValue("court", response?.data[0]?.court);

          setValue("caseNumber", response?.data[0]?.caseNumber);

          setValue("caseType", response?.data[0]?.caseMainType);

          setValue("filingDate", response?.data[0]?.fillingDate);
          // filedBy
          setValue("filedBy", response?.data[0]?.filedBy);
          // filedByMr
          setValue("filedByMr", response?.data[0]?.filedByMr);

          setValue("transferFromAdvocate", response?.data[0]?.advocateName);
          setValue(
            "newAppearnceDate",
            response?.data[0]?.trnAddHearingDao?.nextHearingDate ??
              response?.data[0]?.appearanceDate
          );
        } else {
          setValue("court", "");

          setValue("caseType", "");

          setValue("filingDate", "");
          // filedBy
          setValue("filedBy", "");
          // filedByMr
          setValue("filedByMr", "");
          setValue("transferFromAdvocate", "");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getCourtCaseNumber();
    getCourtName();
    getCaseTypes();
    getCaseSubType();
    // getYears();
  }, []);

  useEffect(() => {
    console.log("aala re", watch("court"));
  }, [watch("court")]);

  useEffect(() => {
    console.log("caseNumberId", watch("caseNumberId"));
    if (
      watch("caseNumberId") != null &&
      watch("caseNumberId") != undefined &&
      watch("caseNumberId") != "" &&
      caseNumbers.length != 0
    ) {
      getCaseDetails(watch("caseNumberId"));
    }
  }, [watch("caseNumberId"), caseNumbers]);

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          // style={{
          //   display: "flex",
          //   // justifyContent: "center",
          //   paddingTop: "10px",
          //   marginTop: "30px",
          //   background:
          //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          // }}

          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#556CD6",
            // backgroundColor: "#1C39BB",
            display: "flex",
            justifyContent: "center",

            // #00308F
            color: "white",
            // fontSize: 19,
            marginTop: 30,
            marginBottom: "50px",
            height: "8vh",
            // marginTop: ,
            // padding: 8,
            // paddingLeft: 30,
            // marginLeft: "50px",
            // marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <Typography>
            <h2
              style={{
                color: "white",
                marginTop: "1vh",
              }}
            >
              <FormattedLabel id="caseDetails" />
            </h2>
          </Typography>
        </Box>

        {/* <Divider /> */}

        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            {/* <FormControl error={!!errors?.caseNumberId} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                Court Case Number
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      handleCaseNumberChange(event.target.value);
                    }}
                    label="Court Case Number"
                  >
                    {caseNumbers &&
                      caseNumbers.map((caseNumber, index) => (
                        <MenuItem key={index} value={caseNumber.caseNumber}>
                          {caseNumber.caseNumber}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="caseNumberId"
                defaultValue=""
              />

              <FormHelperText>
                {errors?.caseNumberId ? errors.caseNumberId.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* Using with Autocomplete */}
            <FormControl sx={{ marginTop: "2" }} error={!!errors?.caseNumber}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* <FormattedLabel id="courtCaseNo" /> */}
              </InputLabel>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      console.log("dsfsdf", newValue);
                      // onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                      onChange(newValue ? newValue?.caseNumber : null); //! store Selected id -- dont change here
                    }}
                    options={caseNumbers}
                    value={
                      caseNumbers?.find((data) => data?.caseNumber == value)
                      // ||  null
                    }
                    getOptionLabel={(option) => option?.caseNoYear}
                    disabled={router?.query?.pageMode === "View"}
                    // onChange={(event, value) => field.onChange(value?.id || "")}

                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<FormattedLabel id="courtCaseNo" />}
                        // error={!!errors?.caseNumber}
                        // helperText={
                        //   errors?.caseNumber
                        //     ? errors?.caseNumber?.message
                        //     : null
                        // }
                      />
                    )}
                  />
                )}
                name="caseNumberId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.caseNumberId ? errors?.caseNumberId?.message : null}
              </FormHelperText>
            </FormControl>

            {/*  */}
          </Grid>

          {/* courtName */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.court}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="courtName" />}
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    // disabled={router?.query?.pageMode === "View"}
                    disabled
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    // label="Case Type"
                    label="Court Name"
                  >
                    {courtNames &&
                      courtNames
                        .slice()
                        .sort((a, b) =>
                          a.courtName.localeCompare(b.courtName, undefined, {
                            numeric: true,
                          })
                        )
                        .map((courtName, index) => (
                          <MenuItem
                            key={index}
                            // @ts-ignore
                            value={courtName.id}
                          >
                            {/* @ts-ignore */}
                            {/* {title.title} */}
                            {language == "en"
                              ? courtName?.courtName
                              : courtName?.courtMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="court"
                //   control={control}
                defaultValue=""
              />
            </FormControl>

            <FormHelperText>
              {errors?.court ? errors.court.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.caseType}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseType" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    // disabled={router?.query?.pageMode === "View"}
                    disabled
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Type"
                  >
                    {caseTypes &&
                      caseTypes
                        .slice()
                        .sort((a, b) =>
                          a.caseMainType.localeCompare(
                            b.caseMainType,
                            undefined,
                            {
                              numeric: true,
                            }
                          )
                        )
                        .map((caseMainType, index) => (
                          <MenuItem
                            key={index}
                            // @ts-ignore
                            value={caseMainType.id}
                          >
                            {/* @ts-ignore */}
                            {/* {title.title} */}
                            {language == "en"
                              ? caseMainType?.caseMainType
                              : caseMainType?.caseMainTypeMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="caseType"
                //   control={control}
                defaultValue=""
              />
            </FormControl>

            <FormHelperText>
              {errors?.caseType ? errors.caseType.message : null}
            </FormHelperText>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            {/* <FormControl
              sx={{ marginTop: 0 }}
              // error={!!errors.fillingDate}
            >
              <Controller
                control={control}
                name="filingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      // disabled
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/yyyy"
                      label={
                        <span style={{ fontSize: 16, marginTop: 2 }}>
                          <FormattedLabel id="filingDate" />
                        </span>
                      }
                      onChange={(date) => {
                        console.log("date232", date);
                        field.onChange(moment(date).format("MM-DD-YYYY"));
                      }}
                      selected={field.value}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                            },

                            //true
                            shrink:
                              (watch("filingDate") ? true : false) ||
                              (router.query.filingDate ? true : false),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />

              <FormHelperText>
                {errors?.filingDate ? errors.filingDate.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* New Date Picker for Filling Date  */}
            <FormControl style={{ marginTop: 0 }} error={!!errors.fromDate}>
              <Controller
                //   control={control}
                name="filingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      // disabled={router?.query?.pageMode === "View"}
                      disabled
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          <FormattedLabel id="filingDate" />
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          // fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              // marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.filingDate ? errors.filingDate.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              //// required
              // disabled={router?.query?.pageMode === "View"}
              disabled
              label={<FormattedLabel id="filedByEn" />}
              {...register("filedBy")}
              error={!!errors.filedBy}
              helperText={errors?.filedBy ? errors.filedBy.message : null}
              InputLabelProps={{
                //true
                shrink:
                  (watch("filedBy") ? true : false) ||
                  (router.query.filedBy ? true : false),
              }}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              //// required
              // disabled={router?.query?.pageMode === "View"}
              disabled
              label={<FormattedLabel id="filedByMr" />}
              {...register("filedByMr")}
              error={!!errors.filedByMr}
              helperText={errors?.filedByMr ? errors.filedByMr.message : null}
              InputLabelProps={{
                //true
                shrink:
                  (watch("filedByMr") ? true : false) ||
                  (router.query.filedByMr ? true : false),
              }}
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default CaseDetails;
