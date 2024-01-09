import { ThemeProvider } from "@emotion/react";
import React from "react";
// import theme from "../../../../theme";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import theme from "../../../../../theme";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  console.log(":fields", fields);

  const language = useSelector((store) => store.labels.language);

  let onSubmitFunc = () => {
    console.log("onSubmitFunc");
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          margin: "30px",
          marginBottom: "100px"

        }}
        elevation={2}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="siteVisitSchedulerandIntimation" />
              {/* Site Visit  and Intimation */}
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  id="outlined-basic"
                  label={<FormattedLabel id="siteVisitId" />}
                  // label="Site Visit Id"
                  // variant="outlined"
                  variant="standard"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors?.firstName ? errors.firstName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12}
                  sm={6}
                  md={6} error={!!errors.wardId} >
                  <InputLabel><FormattedLabel id="serviceName" /></InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        variant="standard"
                      >

                        <MenuItem value={"RoadType1"}>ServiceName1</MenuItem>
                        <MenuItem value={"RoadType2"}>ServiceName2</MenuItem>
                        <MenuItem value={"RoadType3"}>ServiceName3</MenuItem>
                        <MenuItem value={"RoadType4"}>ServiceName4</MenuItem>
                      </Select>
                    )}
                    name="RoadTypeId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  id="outlined-basic"
                  label={<FormattedLabel id="applicationNo" />}
                  // label="Application No"
                  // variant="outlined"
                  variant="standard"
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={errors?.applicationNumber ? errors.applicationNumber.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  id="outlined-basic"
                  label={<FormattedLabel id="applicantName" />}
                  // label="Application Name"
                  // variant="outlined"
                  variant="standard"
                  {...register("applicationName")}
                  error={!!errors.applicationName}
                  helperText={errors?.applicationName ? errors.applicationName.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="scopeOfWork" />}
                  // label="Scope Of Work"
                  variant="standard"
                  {...register("scopeOfWork")}
                  error={!!errors.scopeOfWork}
                  helperText={errors?.scopeOfWork ? errors.scopeOfWork.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                <FormControl xs={12}
                  sm={6}
                  md={6} error={!!errors.wardId} >
                  <InputLabel><FormattedLabel id="employeeName" /></InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        variant="standard"
                      >

                        <MenuItem value={"EmployeeName1"}>EmployeeName1</MenuItem>
                        <MenuItem value={"EmployeeName2"}>EmployeeName2</MenuItem>
                        <MenuItem value={"EmployeeName3"}>EmployeeName3</MenuItem>
                        <MenuItem value={"EmployeeName4"}>EmployeeName4</MenuItem>
                      </Select>
                    )}
                    name="EmployeeNameId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >


                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    sx={{ m: 1, minWidth: '50%' }}
                    variant="standard"
                    id="standard-textarea"
                    label={<FormattedLabel id="date" />}
                    inputFormat="dd/MM/yyyy"
                    // value={paymentDate}
                    // onChange={(date) => setPaymentDate(moment(date).format("YYYY-MM-DDThh:mm:ss"))}
                    // onChange={(value) => fields.onChange(value)}

                    renderInput={(params) => <TextField {...params} />}
                    error={!!errors.Date}
                    helperText={
                      errors?.Date ? errors.Date.message : null
                    }
                  />


                </LocalizationProvider>
              </Grid>
              {/* /////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >


                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <TimePicker
                    sx={{ m: 1, minWidth: '50%' }}
                    minDate={new Date()}

                    label={<FormattedLabel id="time" />}

                    renderInput={(params) => <TextField {...params} />}
                  //   value={value}
                  //   onChange={(newValue) => setValue(newValue)}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  id="outlined-basic"
                  label={<FormattedLabel id="message" />}
                  // label="Message"
                  // variant="outlined"
                  variant="standard"
                  {...register("Message")}
                  error={!!errors.Message}
                  helperText={errors?.Message ? errors.Message.message : null}
                />

              </Grid>
            </Grid>
            <Grid
              container
              xs
              md={6} smOffset={2} mdOffset={4}
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}>
              <Grid item><Button variant="outlined"><FormattedLabel id="add" /></Button></Grid>
              <Grid item><Button variant="outlined"><FormattedLabel id="save" /></Button></Grid>
              <Grid item><Button variant="outlined"><FormattedLabel id="clear" /></Button></Grid>
              <Grid item><Button variant="outlined"><FormattedLabel id="exit" /></Button></Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
