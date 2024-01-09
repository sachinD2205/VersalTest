import {
  Autocomplete,
  Box,
  Divider,
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
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/advocateview.module.css";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BankDetails = () => {
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  const {
    register,
    setValue,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const [bankNames, setBankNames] = useState([]);
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
    if (router.query.pageMode == "Edit" || router.query.pageMode == "View") {
      console.log("bankName", router.query.bankName);
      setValue("bankName", Number(router?.query?.bankName));
      // branchName
      // setValue("branchName", Number(router?.query?.branchName));
    }
  }, [bankNames]);

  // get Bank Name

  const getBankName = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("22", res);
        setBankNames(
          res.data.bank.map((r, i) => ({
            id: r.id,
            bankName: r.bankName,
            bankNameMr: r.bankNameMr,
            branchName: r.branchName,
            branchNameMr: r.branchNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getBankName();
  }, []);
  return (
    <>
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

          // #00308F
          color: "white",
          // fontSize: 19,
          marginTop: 30,
          // marginBottom: "50px",
          // // marginTop: ,
          // padding: 8,
          // paddingLeft: 30,
          // marginLeft: "50px",
          // marginRight: "75px",
          borderRadius: 100,
          height: "8vh",
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
          <h2
            style={{
              color: "white",
              marginTop: "1vh",
            }}
          >
            <FormattedLabel id="bankDetails" />
          </h2>
        </Typography>
      </Box>
      <Divider />

      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/* Bank Name */}
          {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
                  disabled={router?.query?.pageMode === "View"}

              variant="standard"
              sx={{ m: 1, minWidth: 120 ,marginTop:"20px"}}
              error={!!errors.bankName}
            >
              <InputLabel id="demo-simple-select-standard-label">
              
            <FormattedLabel id="bankName" />

              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Bank Name"
                    InputLabelProps={{
                      shrink: 
                        (watch("bankName") ? true : false) ||
                        (router.query.bankName ? true : false),
                    }}


                  >
                    {bankNames &&
                      bankNames.map((bankName, index) => (
                        <MenuItem
                          key={index}
                         
                          value={bankName.id}
                        >
                        
                          {language == "en" ? bankName?.bankName : bankName?.bankNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bankName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.bankName ? errors.bankName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

          {/* Bank Name by using Autocomplete  */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            {/* <FormControl
              sx={{ marginTop: "2%", width: "230px" }}
              variant="standard"
              error={!!errors.bankName}
              disabled={router?.query?.pageMode === "View"}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={bankNames
                  .slice()
                  .sort((a, b) => a.bankName.localeCompare(b.bankName))
                  .map((t) => t.bankName)}
                sx={{ width: 300 }}
                renderOption={(props, option) => (
                  <li {...props}>
                    {language === "en"
                      ? option
                      : bankNames.find((t) => t.bankName === option)
                          ?.bankNameMr}
                  </li>
                )}
                renderInput={(params) => (
                  <>
                    {setValue(
                      "bankId",
                      bankNames.find(
                        (r) => params?.inputProps?.value === r?.bankName
                      )?.id
                    )}
                    <TextField
                      {...params}
                      {...register("bankName")}
                      label={<FormattedLabel id="bankName" />}
                    />
                  </>
                )}
              />
              <FormHelperText>
                {errors?.bankName ? errors.bankName.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* New Autocomplete Bank Name   */}

            <FormControl
              error={!!errors?.bankName}
              // sx={{ marginTop: 1 }}
            >
              <Controller
                name="bankName"
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
                      bankNames?.find((data) => data?.id === value) || null
                    }
                    options={bankNames.sort((a, b) =>
                      language === "en"
                        ? a.bankName.localeCompare(b.bankName)
                        : a.bankNameMr.localeCompare(b.bankNameMr)
                    )} //! api Data
                    getOptionLabel={(bankName) =>
                      language == "en"
                        ? bankName?.bankName
                        : bankName?.bankNameMr
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        fullWidth
                        {...params}
                        label={language == "en" ? "Bank Name" : "बँकेचे नाव"}
                        // variant="outlined"
                        variant="standard"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.bankName ? errors?.bankName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Branch Name  in English*/}
          {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              disabled={router?.query?.pageMode === "View"}

              variant="standard"
              sx={{ m: 1, minWidth: 120, marginTop: "20px" }}
              error={!!errors.branchName}
            >
              <InputLabel id="demo-simple-select-standard-label">
              
                <FormattedLabel id="branchName"></FormattedLabel>
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="branchName"

                    InputLabelProps={{
                      shrink: //true
                        (watch("branchName") ? true : false) ||
                        (router.query.branchName ? true : false),
                    }}
                  >
                    {bankNames &&
                      bankNames.map((bankName, index) => (
                        <MenuItem
                          key={index}
                       
                          value={bankName.id}
                        >
                        
                          {language == "en" ? bankName?.branchName : bankName?.branchNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="branchName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.branchName ? errors.branchName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

          {/* Branch Name by Using Autocomplete  */}

          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            {/* <FormControl
              sx={{ marginTop: "2%", width: "230px" }}
              variant="standard"
              error={!!errors.branchName}
              disabled={router?.query?.pageMode === "View"}
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={bankNames
                  .slice()
                  .sort((a, b) => a.branchName.localeCompare(b.branchName))
                  .map((t) => t.branchName)}
                sx={{ width: 300 }}
                renderOption={(props, option) => (
                  <li {...props}>
                    {language === "en"
                      ? option
                      : bankNames.find((t) => t.branchName === option)
                          ?.branchName}
                  </li>
                )}
                renderInput={(params) => (
                  <>
                    {setValue(
                      "bankId",
                      bankNames.find(
                        (r) => params?.inputProps?.value === r?.branchName
                      )?.id
                    )}
                    <TextField
                      {...params}
                      {...register("branchName")}
                      label={<FormattedLabel id="branchName" />}
                    />
                  </>
                )}
              />
              <FormHelperText>
                {errors?.branchName ? errors.branchName.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* New Autocomplete  */}

            {/* <FormControl
              // variant="outlined"
              error={!!errors?.branchName}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="branchName"
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
                      bankNames?.find((data) => data?.id === value) || null
                    }
                    options={bankNames}
                    getOptionLabel={(branchName) =>
                      language == "en"
                        ? branchName?.branchName
                        : branchName?.branchNameMr
                    }
                    renderInput={(params) => (
                      <TextField
                        fullWidth
                        {...params}
                        label={language == "en" ? "Branch Name" : "शाखेचे नाव"}
                        // variant="outlined"
                        variant="standard"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.branchName ? errors?.branchName?.message : null}
              </FormHelperText>
            </FormControl> */}

            {/* Textfield for branch name  */}

            <TextField
              disabled={router?.query?.pageMode === "View"}
              autoFocus
              sx={{ width: 250, marginTop: "5vh" }}
              id="standard-basic"
              // label="Branch Name"
              label={<FormattedLabel id="branchName" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("branchName") ? true : false) ||
                  (router.query.branchName ? true : false),
              }}
              variant="standard"
              {...register("branchName")}
              error={!!errors.branchName}
              helperText={errors?.branchName ? errors.branchName.message : null}
            />
          </Grid>

          {/* Account Name      */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={router?.query?.pageMode === "View"}
              autoFocus
              sx={{ width: 250, marginTop: "5vh" }}
              id="standard-basic"
              // label="Account No"
              label={<FormattedLabel id="accountNo" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("accountNo") ? true : false) ||
                  (router.query.accountNo ? true : false),
              }}
              variant="standard"
              {...register("accountNo")}
              error={!!errors.accountNo}
              helperText={errors?.accountNo ? errors.accountNo.message : null}
            />
          </Grid>

          {/* Bank IFSC Code */}
          <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              inputProps={{ maxLength: 11 }}
              disabled={router?.query?.pageMode === "View"}
              autoFocus
              sx={{ width: 250, marginTop: "5vh" }}
              id="standard-basic"
              // label="Bank IFSC Code"
              label={<FormattedLabel id="bankIFSC" />}
              InputLabelProps={{
                //true
                shrink:
                  (watch("bankIFSCCode") ? true : false) ||
                  (router.query.bankIFSCCode ? true : false),
              }}
              variant="standard"
              {...register("bankIFSCCode")}
              error={!!errors.bankIFSCCode}
              helperText={
                errors?.bankIFSCCode ? errors.bankIFSCCode.message : null
              }
            />
          </Grid>
          {/* Remove Babk MICR Code  */}
          {/* Bank MICR Code */}
          {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
                  disabled={router?.query?.pageMode === "View"}

              autoFocus
              sx={{ width: 250 }}
              id="standard-basic"
              // label="Bank MICR Code"
              label ={<FormattedLabel id="bankMICR"/>}

              InputLabelProps={{
                shrink: //true
                  (watch("bankMICRCode") ? true : false) ||
                  (router.query.bankMICRCode ? true : false),
              }}
              variant="standard"
              {...register("bankMICRCode")}
              error={!!errors.bankMICRCode}
              helperText={
                errors?.bankMICRCode ? errors.bankMICRCode.message : null
              }
            />
          </Grid> */}
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default BankDetails;
