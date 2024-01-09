import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup"

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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";

import  { roadExcavationCitizenSchema, roadExcavationJuniorEngineerSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/



const Index = () => {
  const user = useSelector((state) => state.user.user);
  const [schema, setSchema] = useState(yup.object().shape({ roadExcavationCitizenSchema }))
  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser", loggedInUser);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(localStorage.getItem("selectedMenuFromDrawer"));

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  let juniorEngineer = authority?.find((val) => val === "JUNIOR_ENGINEER") ?? false
  let deputyEngineer = authority?.find((val) => val === "DEPUTY_ENGINEER") ?? false

  let executiveEngineer = authority?.find((val) => val === "EXECUTIVE_ENGINEER") ?? false

  // console.log("executiveEngineesrrrrrr",executiveEngineer);
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
    resolver: yupResolver(schema)
    // mode: "onSubmit",
  });

  useEffect(() => {

    console.log('Schema: ', schema)

    console.log("EE: ",executiveEngineer)
    console.log("DE: ",deputyEngineer)

    executiveEngineer || deputyEngineer ?
      setSchema(yup.object().shape({
        ...roadExcavationCitizenSchema, 
        ...roadExcavationJuniorEngineerSchema,
       
        approvalStatus: yup
          .string()
          .required("approvalStatus required")
      }))
      : setSchema(yup.object().shape({ ...roadExcavationCitizenSchema,...roadExcavationJuniorEngineerSchema }))

  }, [])
 


  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "witnesses", // unique name for your Field Array
  });

  console.log(":fields", fields);
  const [doc, setDoc] = useState()
  const language = useSelector((store) => store.labels.language);
  //get logged in user


  // console.log("juniorEngineer", juniorEngineer);
  // console.log("deputyEngineer", deputyEngineer);
  // console.log("executiveEngineer", executiveEngineer);

  const handleUploadDocument = (path) => {
    console.log("handleUploadDocument", path);
    let temp = {
      documentPath: path,
      documentKey: 1,
      documentType: "",
      remark: "",
    }
    setDoc(temp)
  }

  let onSubmitFunc = (formData) => {
    console.log("onSubmitFunc", formData);

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
              <FormattedLabel id="RoadExcavation_NocPermission" />


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
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >

                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationNumber"
                  name="applicationNumber"
                  label={<FormattedLabel id="applicationNumber" />}
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
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >

                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="companyName"
                  name="companyName"
                  label={<FormattedLabel id="companyName" />}
                  variant="standard"
                  {...register("companyName")}
                  error={!!errors.companyName}
                  helperText={errors?.companyName ? errors.companyName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="BRTS Road"
                    name="roadType"
                    {...register("roadType")}

                  >
                    <FormControlLabel value="BRTS Road" control={<Radio />} label="BRTS Road" />
                    <FormControlLabel value="Internal Road" control={<Radio />} label="Internal Road" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="FName"
                  name="FName"
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  {...register("FName")}
                  error={!!errors.FName}
                  helperText={errors?.FName ? errors.FName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="MName"
                  name="MName"
                  label={<FormattedLabel id="middleName" />}

                  variant="standard"
                  {...register("MName")}
                  error={!!errors.MName}
                  helperText={errors?.MName ? errors.MName.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="LName"
                  name="LName"
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  {...register("LName")}
                  error={!!errors.LName}
                  helperText={errors?.LName ? errors.LName.message : null}
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px"
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="landLineNumber"
                  name="landLineNumber"
                  label={<FormattedLabel id="landLineNo" />}
                  variant="standard"
                  {...register("landLineNumber")}
                  error={!!errors.landLineNumber}
                  helperText={errors?.landLineNumber ? errors.landLineNumber.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="phoneNumber"
                  name="phoneNumber"
                  // label={<FormattedLabel id="amenities" />}
                  label="Mobile No."
                  // variant="outlined"
                  variant="standard"
                  {...register("phoneNumber")}
                  error={!!errors.phoneNumber}
                  helperText={errors?.phoneNumber ? errors.phoneNumber.message : null}
                />
              </Grid>
              {/* //////////////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="email"
                  name="email"
                  // label={<FormattedLabel id="amenities" />}
                  label="Email ID"
                  // variant="outlined"
                  variant="standard"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors?.email ? errors.email.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="mainScheme"
                  name="mainScheme"
                  // label={<FormattedLabel id="amenities" />}
                  label="Main Scheme"
                  // variant="outlined"
                  variant="standard"
                  {...register("mainScheme")}
                  error={!!errors.mainScheme}
                  helperText={errors?.mainScheme ? errors.mainScheme.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="subScheme"
                  name="subScheme"
                  // label={<FormattedLabel id="amenities" />}
                  label="Sub Scheme"
                  // variant="outlined"
                  variant="standard"
                  {...register("subScheme")}
                  error={!!errors.subScheme}
                  helperText={errors?.subScheme ? errors.subScheme.message : null}
                />
              </Grid>

            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <FormControl>
                  <Grid container spacing={1}
                  >
                    <Grid item sx={{
                      marginTop: "6px"
                    }}> <FormLabel id="demo-row-radio-buttons-group-label">Eligible for Scheme</FormLabel>
                    </Grid>
                    <Grid item>
                      <FormControl flexDirection="row">

                        <Controller
                          name="eligibilityForScheme"
                          control={control}
                          defaultValue={"yes"}

                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label={"yes"}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label={"no"}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>

                  </Grid>


                </FormControl>
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="permitPeriod"
                  name="permitPeriod"
                  // label={<FormattedLabel id="amenities" />}
                  label="Permit Period"
                  // variant="outlined"
                  variant="standard"
                  {...register("permitPeriod")}
                  error={!!errors.permitPeriod}
                  helperText={errors?.permitPeriod ? errors.permitPeriod.message : null}
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="scopeOfWork"
                  name="scopeOfWork"
                  // label={<FormattedLabel id="amenities" />}
                  label="Scope Of Work"
                  // variant="outlined"
                  variant="standard"
                  {...register("scopeOfWork")}
                  error={!!errors.scopeOfWork}
                  helperText={errors?.scopeOfWork ? errors.scopeOfWork.message : null}
                />
              </Grid>
            </Grid>

            {/* ////////////////////////////////////////// */}



            {
              juniorEngineer ? <>
                <Typography sx={{ marginLeft: "20px" }}>Excavation Details
                </Typography>
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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl xs={12}
                      sm={6}
                      md={4} error={!!errors.wardId}>
                      <InputLabel>Zone</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            variant="standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Zone"
                          >

                            <MenuItem value={"zone1"}>Zone1</MenuItem>
                            <MenuItem value={"zone2"}>Zone2</MenuItem>
                            <MenuItem value={"zone3"}>Zone3</MenuItem>
                            <MenuItem value={"zone4"}>Zone4</MenuItem>
                          </Select>
                        )}
                        name="zoneId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.zoneId ? errors.zoneId.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl xs={12}
                      sm={6}
                      md={4} error={!!errors.wardId} >
                      <InputLabel>Ward</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            variant="standard"
                          >

                            <MenuItem value={"Ward1"}>Ward1</MenuItem>
                            <MenuItem value={"Ward2"}>Ward2</MenuItem>
                            <MenuItem value={"Ward3"}>Ward3</MenuItem>
                            <MenuItem value={"Ward4"}>Ward4</MenuItem>
                          </Select>
                        )}
                        name="wardId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.wardId ? errors.wardId.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl xs={12}
                      sm={6}
                      md={4} error={!!errors.wardId} >
                      <InputLabel>Road Type</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            variant="standard"
                          >

                            <MenuItem value={"RoadType1"}>RoadType1</MenuItem>
                            <MenuItem value={"RoadType2"}>RoadType2</MenuItem>
                            <MenuItem value={"RoadType3"}>RoadType3</MenuItem>
                            <MenuItem value={"RoadType4"}>RoadType4</MenuItem>
                          </Select>
                        )}
                        name="RoadTypeId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                    </FormControl></Grid>
                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="locationOfExcavation"
                      name="locationOfExcavation"
                      // label={<FormattedLabel id="amenities" />}
                      label="Location Of Excavation"
                      // variant="outlined"
                      variant="standard"
                      {...register("locationOfExcavation")}
                      error={!!errors.locationOfExcavation}
                      helperText={errors?.locationOfExcavation ? errors.locationOfExcavation.message : null}
                    />
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="lengthOfRoad"
                      name="lengthOfRoad"
                      // label={<FormattedLabel id="amenities" />}
                      label="Length Of Road"
                      // variant="outlined"
                      variant="standard"
                      {...register("lengthOfRoad")}
                      error={!!errors.lengthOfRoad}
                      helperText={errors?.lengthOfRoad ? errors.lengthOfRoad.message : null}
                    />
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="widthOfRoad"
                      name="widthOfRoad"
                      // label={<FormattedLabel id="amenities" />}
                      label="Width Of Road"
                      // variant="outlined"
                      variant="standard"
                      {...register("widthOfRoad")}
                      error={!!errors.widthOfRoad}
                      helperText={errors?.widthOfRoad ? errors.widthOfRoad.message : null}
                    />
                  </Grid>

                  {/* ////////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: 250 }}
                      id="rdepth"
                      name="rdepth"
                      label="Depth"
                      variant="standard"
                      {...register("rdepth")}
                      error={!!errors.rdepth}
                      helperText={errors?.rdepth ? errors.rdepth.message : null}
                    />
                  </Grid>
                  {/* ////////////////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="excavationPattern"
                      name="excavationPattern"
                      // label={<FormattedLabel id="amenities" />}
                      label="Excavation Pattern"
                      // variant="outlined"
                      variant="standard"
                      {...register("excavationPattern")}
                      error={!!errors.excavationPattern}
                      helperText={errors?.excavationPattern ? errors.excavationPattern.message : null}
                    />
                  </Grid>
                  {/* //////////////////////////////////////////////////// */}



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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="sLatitude"
                      name="sLatitude"
                      // label={<FormattedLabel id="amenities" />}
                      label="START Latitude Of Excavation "
                      // variant="outlined"
                      variant="standard"
                      {...register("sLatitude")}
                      error={!!errors.sLatitude}
                      helperText={errors?.sLatitude ? errors.sLatitude.message : null}
                    />
                  </Grid>
                  {/*///////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="eLatitude"
                      name="eLatitude"
                      // label={<FormattedLabel id="amenities" />}
                      label="END Latitude Of Excavation "
                      // variant="outlined"
                      variant="standard"
                      {...register("eLatitude")}
                      error={!!errors.eLatitude}
                      helperText={errors?.eLatitude ? errors.eLatitude.message : null}
                    />
                  </Grid>
                  {/*///////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="sLongitude"
                      name="sLongitude"
                      // label={<FormattedLabel id="amenities" />}
                      label="START Longitude Of Excavation "
                      // variant="outlined"
                      variant="standard"
                      {...register("sLongitude")}
                      error={!!errors.sLongitude}
                      helperText={errors?.sLongitude ? errors.sLongitude.message : null}
                    />
                  </Grid>
                  {/*///////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="eLongitude"
                      name="eLongitude"
                      // label={<FormattedLabel id="amenities" />}
                      label="END Longitude Of Excavation "
                      // variant="outlined"
                      variant="standard"
                      {...register("eLongitude")}
                      error={!!errors.eLongitude}
                      helperText={errors?.eLongitude ? errors.eLongitude.message : null}
                    />
                  </Grid>
                  {/*///////////////////////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <Typography
                          sx={{
                            marginTop: "10px"
                          }}>
                          Required Documents
                        </Typography>
                      </Grid>
                      <Grid item >

                        <UploadButton
                          appName="SLUM"
                          serviceName="SLUM-IssuancePhotopass"
                          filePath={(path) => { handleUploadDocument(path) }}
                          fileName={doc && doc.documentPath} />
                      </Grid>
                    </Grid>
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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography> Is Location excavation is same as per PCMC order?</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl flexDirection="row">

                      <Controller
                        name="q1"
                        control={control}
                        defaultValue={"yes"}

                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label={"yes"}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label={"no"}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="remarkQ1"
                      name="remarkQ1"
                      // label={<FormattedLabel id="amenities" />}
                      label="Remark "
                      // variant="outlined"
                      // value={watch("remarkQ1")}
                      variant="standard"
                      {...register("remarkQ1")}
                      error={!!errors.remarkQ1}
                      helperText={errors?.remarkQ1 ? errors.remarkQ1.message : null} />
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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",

                    }}
                  >
                    <Typography> Is Length excavation is same as per PCMC order?</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl flexDirection="row">

                      <Controller
                        name="q2"
                        control={control}
                        defaultValue={"yes"}

                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label={"yes"}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label={"no"}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="remarkQ2"
                      name="remarkQ2"
                      // label={<FormattedLabel id="amenities" />}
                      label="Remark "
                      // variant="outlined"
                      variant="standard"
                      {...register("remarkQ2")}
                      error={!!errors.remarkQ2}
                      helperText={errors?.remarkQ2 ? errors.remarkQ2.message : null} />
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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography> Is Depth excavation is same as per PCMC order?</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl flexDirection="row">

                      <Controller
                        name="q3"
                        control={control}
                        defaultValue={"yes"}

                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label={"yes"}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label={"no"}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="remarkQ3"
                      name="remarkQ3"
                      // label={<FormattedLabel id="amenities" />}
                      label="Remark "
                      // variant="outlined"
                      variant="standard"
                      {...register("remarkQ3")}
                      error={!!errors.remarkQ3}
                      helperText={errors?.remarkQ3 ? errors.remarkQ3.message : null} />
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
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography> Is Width excavation is same as per PCMC order?</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl flexDirection="row">

                      <Controller
                        name="q4"
                        control={control}
                        defaultValue={"yes"}

                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              value="yes"
                              control={<Radio />}
                              label={"yes"}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio />}
                              label={"no"}
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="remarkQ4"
                      name="remarkQ4"
                      // label={<FormattedLabel id="amenities" />}
                      label="Remark "
                      // variant="outlined"
                      variant="standard"
                      {...register("remarkQ4")}
                      error={!!errors.remarkQ4}
                      helperText={errors?.remarkQ4 ? errors.remarkQ4.message : null} />
                  </Grid>
                </Grid>

                {/* ************************ */}
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
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl xs={12}
                      sm={6}
                      md={4} error={!!errors.wardId}>
                      <InputLabel>chargeTypeName</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            variant="standard"
                          >

                            <MenuItem value={"chargeTypeName1"}>chargeTypeName1</MenuItem>
                            <MenuItem value={"chargeTypeName2"}>chargeTypeName2</MenuItem>
                            <MenuItem value={"chargeTypeName3"}>chargeTypeName3</MenuItem>
                            <MenuItem value={"chargeTypeName4"}>chargeTypeName4</MenuItem>
                          </Select>
                        )}
                        name="chargeTypeName"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.chargeTypeName ? errors.chargeTypeName.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  > <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="amount" />}
                      // variant="outlined"
                      variant="standard"
                      {...register("amount")}
                      error={!!errors.amount}
                      helperText={errors?.amount ? errors.amount.message : null}
                    /></Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  > <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="totalAmount" />}
                      // variant="outlined"
                      variant="standard"
                      {...register("totalAmount")}
                      error={!!errors.totalAmount}
                      helperText={errors?.totalAmount ? errors.totalAmount.message : null}
                    /></Grid>
                </Grid>
              </>
                : <>
                  <Typography sx={{ marginLeft: "20px" }}>Excavation Details
                  </Typography>
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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl xs={12}
                        sm={6}
                        md={4} error={!!errors.wardId}>
                        <InputLabel>Zone</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              variant="standard"
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              label="Zone"
                            >

                              <MenuItem value={"zone1"}>Zone1</MenuItem>
                              <MenuItem value={"zone2"}>Zone2</MenuItem>
                              <MenuItem value={"zone3"}>Zone3</MenuItem>
                              <MenuItem value={"zone4"}>Zone4</MenuItem>
                            </Select>
                          )}
                          name="zoneId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.zoneId ? errors.zoneId.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl xs={12}
                        sm={6}
                        md={4} error={!!errors.wardId} >
                        <InputLabel>Ward</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >

                              <MenuItem value={"Ward1"}>Ward1</MenuItem>
                              <MenuItem value={"Ward2"}>Ward2</MenuItem>
                              <MenuItem value={"Ward3"}>Ward3</MenuItem>
                              <MenuItem value={"Ward4"}>Ward4</MenuItem>
                            </Select>
                          )}
                          name="wardId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.wardId ? errors.wardId.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl xs={12}
                        sm={6}
                        md={4} error={!!errors.wardId} >
                        <InputLabel>Road Type</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >

                              <MenuItem value={"RoadType1"}>RoadType1</MenuItem>
                              <MenuItem value={"RoadType2"}>RoadType2</MenuItem>
                              <MenuItem value={"RoadType3"}>RoadType3</MenuItem>
                              <MenuItem value={"RoadType4"}>RoadType4</MenuItem>
                            </Select>
                          )}
                          name="RoadTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.RoadTypeId ? errors.RoadTypeId.message : null}</FormHelperText>
                      </FormControl></Grid>
                    {/* ////////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="locationOfExcavation"
                        name="locationOfExcavation"
                        // label={<FormattedLabel id="amenities" />}
                        label="Location Of Excavation"
                        // variant="outlined"
                        value={watch("locationOfExcavation")}

                        variant="standard"
                        // {...register("locationOfExcavation")}
                        error={!!errors.locationOfExcavation}
                        helperText={errors?.locationOfExcavation ? errors.locationOfExcavation.message : null}
                      />
                    </Grid>
                    {/* ////////////////////////////////////////// */}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="lengthOfRoad"
                        name="lengthOfRoad"
                        // label={<FormattedLabel id="amenities" />}
                        label="Length Of Road"
                        // variant="outlined"
                        variant="standard"
                        value={watch("lengthOfRoad")}

                        // {...register("lengthOfRoad")}
                        error={!!errors.lengthOfRoad}
                        helperText={errors?.lengthOfRoad ? errors.lengthOfRoad.message : null}
                      />
                    </Grid>
                    {/* ////////////////////////////////////////// */}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="widthOfRoad"
                        name="widthOfRoad"
                        // label={<FormattedLabel id="amenities" />}
                        label="Width Of Road"
                        // variant="outlined"
                        variant="standard"
                        value={watch("widthOfRoad")}

                        // {...register("widthOfRoad")}
                        error={!!errors.widthOfRoad}
                        helperText={errors?.widthOfRoad ? errors.widthOfRoad.message : null}
                      />
                    </Grid>

                    {/* ////////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 250 }}
                        id="rdepth"
                        name="rdepth"
                        label="Depth"
                        variant="standard"
                        value={watch("rdepth")}

                        // {...register("rdepth")}
                        error={!!errors.rdepth}
                        helperText={errors?.rdepth ? errors.rdepth.message : null}
                      />
                    </Grid>
                    {/* ////////////////////////////////////////// */}

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="excavationPattern"
                        name="excavationPattern"
                        // label={<FormattedLabel id="amenities" />}
                        label="Excavation Pattern"
                        // variant="outlined"
                        variant="standard"
                        value={watch("excavationPattern")}

                        // {...register("excavationPattern")}
                        error={!!errors.excavationPattern}
                        helperText={errors?.excavationPattern ? errors.excavationPattern.message : null}
                      />
                    </Grid>
                    {/* //////////////////////////////////////////////////// */}



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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="sLatitude"
                        name="sLatitude"
                        // label={<FormattedLabel id="amenities" />}
                        label="START Latitude Of Excavation "
                        value={watch("sLatitude")}
                        variant="standard"
                        // {...register("sLatitude")}
                        error={!!errors.sLatitude}
                        helperText={errors?.sLatitude ? errors.sLatitude.message : null}
                      />
                    </Grid>
                    {/*///////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="eLatitude"
                        name="eLatitude"
                        // label={<FormattedLabel id="amenities" />}
                        label="END Latitude Of Excavation "
                        // variant="outlined"
                        variant="standard"
                        value={watch("eLatitude")}

                        // {...register("eLatitude")}
                        error={!!errors.eLatitude}
                        helperText={errors?.eLatitude ? errors.eLatitude.message : null}
                      />
                    </Grid>
                    {/*///////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="sLongitude"
                        name="sLongitude"
                        // label={<FormattedLabel id="amenities" />}
                        label="START Longitude Of Excavation "
                        // variant="outlined"
                        variant="standard"
                        value={watch("sLongitude")}

                        // {...register("sLongitude")}
                        error={!!errors.sLongitude}
                        helperText={errors?.sLongitude ? errors.sLongitude.message : null}
                      />
                    </Grid>
                    {/*///////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="eLongitude"
                        name="eLongitude"
                        // label={<FormattedLabel id="amenities" />}
                        label="END Longitude Of Excavation "
                        // variant="outlined"
                        variant="standard"
                        value={watch("eLongitude")}

                        // {...register("eLongitude")}
                        error={!!errors.eLongitude}
                        helperText={errors?.eLongitude ? errors.eLongitude.message : null}
                      />
                    </Grid>
                    {/*///////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <Typography
                            sx={{
                              marginTop: "10px"
                            }}>
                            Required Documents
                          </Typography>
                        </Grid>
                        <Grid item >

                          <UploadButton
                            appName="SLUM"
                            serviceName="SLUM-IssuancePhotopass"
                            filePath={(path) => { handleUploadDocument(path) }}
                            fileName={doc && doc.documentPath} />
                        </Grid>
                      </Grid>
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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography> Is Location excavation is same as per PCMC order?</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl flexDirection="row">

                        <Controller
                          name="q1"
                          control={control}
                          defaultValue={"yes"}

                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label={"yes"}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label={"no"}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="remarkQ1"
                        name="remarkQ1"
                        // label={<FormattedLabel id="amenities" />}
                        label="Remark "
                        // variant="outlined"
                        value={watch("remarkQ1")}
                        variant="standard"
                        // {...register("remarkQ1")}
                        error={!!errors.remarkQ1}
                        helperText={errors?.remarkQ1 ? errors.remarkQ1.message : null} />
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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                      }}
                    >
                      <Typography> Is Length excavation is same as per PCMC order?</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl flexDirection="row">

                        <Controller
                          name="q2"
                          control={control}
                          defaultValue={"yes"}

                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label={"yes"}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label={"no"}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="remarkQ2"
                        name="remarkQ2"
                        // label={<FormattedLabel id="amenities" />}
                        label="Remark "
                        // variant="outlined"
                        variant="standard"
                        value={watch("remarkQ2")}
                        // {...register("remarkQ2")}
                        error={!!errors.remarkQ2}
                        helperText={errors?.remarkQ2 ? errors.remarkQ2.message : null} />
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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography> Is Depth excavation is same as per PCMC order?</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl flexDirection="row">

                        <Controller
                          name="q3"
                          control={control}
                          defaultValue={"yes"}

                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label={"yes"}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label={"no"}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="remarkQ3"
                        name="remarkQ3"
                        value={watch("remarkQ3")}

                        // label={<FormattedLabel id="amenities" />}
                        label="Remark "
                        // variant="outlined"
                        variant="standard"
                        // {...register("remarkQ3")}
                        error={!!errors.remarkQ3}
                        helperText={errors?.remarkQ3 ? errors.remarkQ3.message : null} />
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
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography> Is Width excavation is same as per PCMC order?</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl flexDirection="row">

                        <Controller
                          name="q4"
                          control={control}
                          defaultValue={"yes"}

                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label={"yes"}
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label={"no"}
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="remarkQ4"
                        name="remarkQ4"
                        // label={<FormattedLabel id="amenities" />}
                        label="Remark "
                        // variant="outlined"
                        value={watch("remarkQ4")}

                        variant="standard"
                        // {...register("remarkQ4")}
                        error={!!errors.remarkQ4}
                        helperText={errors?.remarkQ4 ? errors.remarkQ4.message : null} />
                    </Grid>
                  </Grid>

                  {/* ************************ */}
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
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl xs={12}
                        sm={6}
                        md={4} error={!!errors.wardId}>
                        <InputLabel>chargeTypeName</InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              variant="standard"
                            >

                              <MenuItem value={"chargeTypeName1"}>chargeTypeName1</MenuItem>
                              <MenuItem value={"chargeTypeName2"}>chargeTypeName2</MenuItem>
                              <MenuItem value={"chargeTypeName3"}>chargeTypeName3</MenuItem>
                              <MenuItem value={"chargeTypeName4"}>chargeTypeName4</MenuItem>
                            </Select>
                          )}
                          name="chargeTypeName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>{errors?.chargeTypeName ? errors.chargeTypeName.message : null}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    > <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="amount" />}
                        // variant="outlined"
                        variant="standard"
                        value={watch("amount")}

                        // {...register("amount")}
                        error={!!errors.amount}
                        helperText={errors?.amount ? errors.amount.message : null}
                      /></Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    > <TextField
                        autoFocus
                        style={{ backgroundColor: "white", width: "250px" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="totalAmount" />}
                        // variant="outlined"
                        variant="standard"
                        value={watch("totalAmount")}

                        // {...register("totalAmount")}
                        error={!!errors.totalAmount}
                        helperText={errors?.totalAmount ? errors.totalAmount.message : null}
                      /></Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "20px",
                      marginTop: "20px"
                    }}
                  >
                    <FormControl xs={12}
                      sm={6}
                      md={4} error={!!errors.wardId}>
                      <InputLabel>Approval Status</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            variant="standard"
                          >

                            <MenuItem value={"approvalStatus1"}>approvalStatus1</MenuItem>
                            <MenuItem value={"approvalStatus2"}>approvalStatus2</MenuItem>
                            <MenuItem value={"approvalStatus3"}>approvalStatus3</MenuItem>
                          </Select>
                        )}
                        name="approvalStatus"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.approvalStatus ? errors.approvalStatus.message : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                </>
            }
            <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "20px"
                    }}
                  >
                    <TextField
                      autoFocus
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="remarks" />}
                      // variant="outlined"
                      variant="standard"
                      {...register("remarks")}
                      error={!!errors.remarks}
                      helperText={errors?.remarks ? errors.remarks.message : null}
                    />
                  </Grid>
            <Grid
              container
              xs
              md={6} mdOffset={3}
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}>
              <Grid item><Button type="submit" variant="outlined">Save</Button></Grid>
              {
                !juniorEngineer && <>
                <Grid item><Button variant="outlined">Approve</Button></Grid>
              <Grid item><Button variant="outlined">Reject</Button></Grid></>
              }
              
              <Grid item><Button variant="outlined" >Clear</Button></Grid>
              <Grid item><Button variant="outlined">Exit</Button></Grid>
            </Grid>
            {/* //////////////////////////////////// */}

          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
