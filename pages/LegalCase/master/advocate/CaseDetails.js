import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/advocateview.module.css";

import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import axios from "axios";
import index from "../../master/caseStages";
import { unstable_createStyleFunctionSx } from "@mui/system";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const CaseDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
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
  useEffect(() => {
    //alert("df")
    console.log("router?.query.pageMode", router?.query.pageMode);
    if (router?.query.pageMode === "Edit") {
      setValue("courtCaseNumber", router?.query?.courtCaseNumber);
    } else {
      getCourtCaseNumber();
    }

    getCourtName();
    getCaseTypes();
    getCaseSubType();
    getYears();
  }, []);

  const getCourtCaseNumber = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseNumber`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setValue("courtCaseNumber", res.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Court Name

  const [courtNames, setCourtNames] = useState([]);

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
            // caseMainType: r.caseMainType,
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

  // get Case Type
  const [caseTypes, setCaseTypes] = useState([]);

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
            // caseMainType: r.caseMainType,
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

  const [years, setYears] = useState([]);

  const getYears = () => {
    axios
      .get(`${urls.LCMSURL}/master/year/getAll`, {
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

  return (
    <>
      <Box
        style={{
          display: "flex",
          // justifyContent: "center",
          // marginLeft:'50px',
          paddingTop: "10px",
          marginTop: "20px",

          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            display: "flex",
            marginLeft: "100px",
            color: "white",
            // justifyContent: "center",
          }}
        >
          <h2>
            <FormattedLabel id="caseDetails" />
          </h2>
        </Typography>
      </Box>

      <Divider />

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              disabled
              label="Court Case Number"
              maxRows={4}
              {...register("courtCaseNumber")}
            />
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ marginTop: 2 }}
              // error={!!errors.serviceName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="courtName" />}
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    // label="Case Type"
                    label="Court Name"
                  >
                    {courtNames &&
                      courtNames.map((courtName, index) => (
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
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ marginTop: 2 }}
              // error={!!errors.serviceName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseType" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Type"
                  >
                    {caseTypes &&
                      caseTypes.map((caseMainType, index) => (
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
                name="caseMainType"
                //   control={control}
                defaultValue=""
              />
            </FormControl>
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl
              sx={{ marginTop: 2 }}
              // error={!!errors.serviceName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="caseSubType" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    //   sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Case Sub-Type"
                  >
                    {caseSubTypes &&
                      caseSubTypes.map((subType, index) => (
                        <MenuItem key={index} value={subType.id}>
                          {subType.subType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="subType"
                //   control={control}
                defaultValue=""
              />
            </FormControl>{" "}
          </Grid>

          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="year" />
              </InputLabel>

              <Controller
                render={({ field }) => (
                  <Select
                    disabled={router?.query?.pageMode === "View"}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Year"
                  >
                    {years &&
                      years.map((year, index) => (
                        <MenuItem key={index} value={year.id}>
                          {year.year}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="year"
                //   control={control}
                defaultValue=""
              />
            </FormControl>
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              label={<FormattedLabel id="stampNo" />}
              {...register("stampNo")}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <FormControl sx={{ marginTop: 0 }} error={!!errors.fillingDate}>
              <Controller
                //   control={control}
                name="filingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      // disabled
                      disabled={router?.query?.pageMode === "View"}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16, marginTop: 2 }}>
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
            </FormControl>
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              label={<FormattedLabel id="filedByEn" />}
              {...register("filedBy")}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              {...register("filedByMr")}
              label={<FormattedLabel id="filedByMr" />}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              //// required
              disabled={router?.query?.pageMode === "View"}
              label={<FormattedLabel id="filedAgainstEn" />}
              {...register("filedAgainst")}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              //// required

              label={<FormattedLabel id="filedAgainstMr" />}
              {...register("filedAgainstMr")}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <TextField
              id="standard-textarea"
              label={<FormattedLabel id="caseDetails" />}
              placeholder="Placeholder"
              multiline
              variant="standard"
              {...register("caseDetails")}
            />
            {/* <TextareaAutosize
            disabled={router?.query?.pageMode === "View"}
            aria-label="minimum height"
            minRows={3}
            //// required
            placeholder="Case Details "
            // sx={{ width: 250 }}
            id="standard-basic"
            label={<FormattedLabel id="caseDetails" />}
            style={{ width: 240, height: 35, marginTop: 10 }}
            
            {...register("caseDetails")}
          /> */}
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default CaseDetails;
