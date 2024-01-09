import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import urls from "../../../URLS/urls"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded" //by Ansari
import DeleteIcon from "@mui/icons-material/Delete"
import { CallMissedOutgoing } from "@mui/icons-material"

const PropertyHolderDetails = ({ step }) => {
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext()
  const [titles, setTitles] = useState([])
  const [genders, setGenders] = useState([])
  // const [red2, setRed2] = useState(false)

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  )
  console.log("useFieldArray fields", fields)
  // Titles

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      )
    })
  }

  // Religions

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
        }))
      )
    })
  }

  // useEffect
  useEffect(() => {
    getTitles()
    // getTypeOfDisability();
    getGenders()
    // getCasts();
    // getSubCast();
    // getReligions();
  }, [])

  // useEffect(() => {
  //   if (step === 1) {
  //     if (
  //       Object.keys(errors).find((obj) => obj === ("mobile" || "emailAddress"))
  //     ) {
  //       // console.log("kyaMila", Object.keys(errors))
  //       setRed2(true)
  //     } else {
  //       // alert("nb")
  //       setRed2(false)
  //     }
  //   }
  // })

  const str1 = () => {
    const str2 = "Property Holder Details"
    // console.log("13", str2())
    return str2
  }
  const str3 = str1()
  const split_string = str3.split(" ")
  console.log("12", split_string)

  return (
    <Box>
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
            width: "60%",
            height: "auto",
            overflow: "auto",
            padding: "0.5%",
            color: "black",
            fontSize: 19,
            fontWeight: 500,
            borderRadius: 100,
          }}
        >
          <strong>
            <FormattedLabel id="propertyHolderDetails" />
          </strong>
        </Box>
      </Box>

      <Grid
        container
        style={{
          padding: "1%",
          display: "flex",
          alignItems: "baseline",
        }}
      >
        {/* Titles */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl error={!!errors.title}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="title" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="title" />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {title.title}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="title"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.title ? errors.title.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* firstName English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="firstName" />}
            {...register("firstNameEng")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>

        {/* firstName Marathi */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="firstName" />}
            label="First Name Mr"
            {...register("firstNameMr")}
            error={!!errors.firstNameMr}
            helperText={errors?.firstNameMr ? errors.firstNameMr.message : null}
          />
        </Grid>

        {/* middleName English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="middleName" />}
            {...register("middleNameEng")}
          />
        </Grid>
        {/* middleName Marathi*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="middleName" />}
            label="Middle Name Mr"
            {...register("middleNameMr")}
          />
        </Grid>

        {/* lastName English*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="lastName" />}
            {...register("lastNameEng")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>

        {/* lastName Marathi*/}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            // label={<FormattedLabel id="lastName" />}
            label="Last Name Mr"
            {...register("lastNameMr")}
            error={!!errors.lastNameMr}
            helperText={errors?.lastNameMr ? errors.lastNameMr.message : null}
          />
        </Grid>

        {/* gender */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="gender" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="gender" />}
                >
                  {genders &&
                    genders.map((gender, index) => (
                      <MenuItem key={index} value={gender.id}>
                        {gender.gender}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="gender"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.gender ? errors.gender.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            // type="number"
            InputProps={{
              inputProps: { minLength: "10", maxLength: "10", step: "1" },
            }}
            label={<FormattedLabel id="mobile" />}
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors?.mobile ? errors.mobile.message : null}
          />
        </Grid>

        {/* email */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            type="email"
            id="standard-basic"
            label={<FormattedLabel id="emailAddress" />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={
              errors?.emailAddress ? errors.emailAddress.message : null
            }
          />
        </Grid>

        {/* Pan-number */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            InputProps={{
              inputProps: { minLength: "10", maxLength: "10", step: "1" },
            }}
            label={<FormattedLabel id="panNum" />}
            // label="Pan No."
            {...register("panNum")}
            error={!!errors.panNum}
            helperText={errors?.panNum ? errors.panNum.message : null}
          />
        </Grid>

        {/* Aadharnumber */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            InputProps={{
              inputProps: { minLength: "12", maxLength: "12", step: "1" },
            }}
            label={<FormattedLabel id="aadharNoPT" />}
            {...register("aadharNoPT")}
          />
        </Grid>

        {/* generateOTP */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "0",
                padding: "0",
                gap: "50px",
              }}
            >
              <FormLabel id="demo-row-radio-buttons-group-label">
                <FormattedLabel id="generateOTP" />
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label={<FormattedLabel id="" />}
                  name="disbality"
                  {...register("generateOTP")}
                  error={!!errors.generateOTP}
                  helperText={
                    errors?.generateOTP ? errors.generateOTP.message : null
                  }
                />
                {/* <FormControlLabel
                value='NO'
                control={<Radio />}
                label=<FormattedLabel id='no' />
                name='disbality'
                {...register("disbality")}
                error={!!errors.disbality}
                helperText={errors?.disbality ? errors.disbality.message : null}
              /> */}
              </RadioGroup>
            </div>
          </FormControl>
        </Grid>

        {/* enter OTP */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="enterOTP" />}
            {...register("enterOTP")}
            error={!!errors.enterOTP}
            helperText={errors?.enterOTP ? errors.enterOTP.message : null}
          />
        </Grid>

        {/* validateOTP */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // maxWidth: "100%",
                gap: "50px",
              }}
            >
              <FormLabel id="demo-row-radio-buttons-group-label">
                <FormattedLabel id="validateOTP" />
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label={<FormattedLabel id="" />}
                  name="disbality"
                  {...register("validateOTP")}
                  error={!!errors.validateOTP}
                  helperText={
                    errors?.validateOTP ? errors.validateOTP.message : null
                  }
                />
              </RadioGroup>
            </div>
          </FormControl>
        </Grid>
      </Grid>

      {fields.map((witness, index) => {
        return (
          <>
            <Grid
              container
              style={{
                padding: "1%",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* Titles */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="title" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="title" />}
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {titles &&
                          titles.map((title, index) => (
                            <MenuItem key={index} value={title.id}>
                              {title.title}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="title"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.title ? errors.title.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* firstName English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  {...register("firstNameEng")}
                  error={!!errors.firstName}
                  helperText={
                    errors?.firstName ? errors.firstName.message : null
                  }
                />
              </Grid>

              {/* firstName Marathi */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  // label={<FormattedLabel id="firstName" />}
                  label="First Name Mr"
                  {...register("firstNameMr")}
                  error={!!errors.firstNameMr}
                  helperText={
                    errors?.firstNameMr ? errors.firstNameMr.message : null
                  }
                />
              </Grid>

              {/* middleName English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  {...register("middleNameEng")}
                />
              </Grid>

              {/* middleName Marathi*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  // label={<FormattedLabel id="middleName" />}
                  label="Middle Name Mr"
                  {...register("middleNameMr")}
                />
              </Grid>

              {/* lastName English*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="lastName" />}
                  {...register("lastNameEng")}
                  error={!!errors.lastName}
                  helperText={errors?.lastName ? errors.lastName.message : null}
                />
              </Grid>

              {/* lastName Marathi*/}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  // label={<FormattedLabel id="lastName" />}
                  label="Last Name Mr"
                  {...register("lastNameMr")}
                  error={!!errors.lastNameMr}
                  helperText={
                    errors?.lastNameMr ? errors.lastNameMr.message : null
                  }
                />
              </Grid>

              {/* gender */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="gender" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="gender" />}
                      >
                        {genders &&
                          genders.map((gender, index) => (
                            <MenuItem key={index} value={gender.id}>
                              {gender.gender}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gender"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gender ? errors.gender.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  type="number"
                  InputProps={{
                    inputProps: { minLength: "10", maxLength: "10", step: "1" },
                  }}
                  label={<FormattedLabel id="mobile" />}
                  {...register("mobile")}
                  error={!!errors.mobile}
                  helperText={errors?.mobile ? errors.mobile.message : null}
                />
              </Grid>

              {/* email */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  type="email"
                  id="standard-basic"
                  label={<FormattedLabel id="emailAddress" />}
                  {...register("emailAddress")}
                  error={!!errors.emailAddress}
                  helperText={
                    errors?.emailAddress ? errors.emailAddress.message : null
                  }
                />
              </Grid>

              {/* Pan-number */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  InputProps={{
                    inputProps: { minLength: "10", maxLength: "10", step: "1" },
                  }}
                  label={<FormattedLabel id="panNum" />}
                  // label="Pan No."
                  {...register("panNum")}
                  error={!!errors.panNum}
                  helperText={errors?.panNum ? errors.panNum.message : null}
                />
              </Grid>

              {/* Aadharnumber */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  InputProps={{
                    inputProps: { minLength: "12", maxLength: "12", step: "1" },
                  }}
                  label={<FormattedLabel id="aadharNoPT" />}
                  {...register("aadharNoPT")}
                />
              </Grid>

              {/* generateOTP */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "0",
                      padding: "0",
                      gap: "50px",
                    }}
                  >
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      <FormattedLabel id="generateOTP" />
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label={<FormattedLabel id="" />}
                        name="disbality"
                        {...register("generateOTP")}
                        error={!!errors.generateOTP}
                        helperText={
                          errors?.generateOTP
                            ? errors.generateOTP.message
                            : null
                        }
                      />
                      {/* <FormControlLabel
                value='NO'
                control={<Radio />}
                label=<FormattedLabel id='no' />
                name='disbality'
                {...register("disbality")}
                error={!!errors.disbality}
                helperText={errors?.disbality ? errors.disbality.message : null}
              /> */}
                    </RadioGroup>
                  </div>
                </FormControl>
              </Grid>

              {/* enter OTP */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="enterOTP" />}
                  {...register("enterOTP")}
                  error={!!errors.enterOTP}
                  helperText={errors?.enterOTP ? errors.enterOTP.message : null}
                />
              </Grid>

              {/* validateOTP */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      // maxWidth: "100%",
                      gap: "50px",
                    }}
                  >
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      <FormattedLabel id="validateOTP" />
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label={<FormattedLabel id="" />}
                        name="disbality"
                        {...register("validateOTP")}
                        error={!!errors.validateOTP}
                        helperText={
                          errors?.validateOTP
                            ? errors.validateOTP.message
                            : null
                        }
                      />
                    </RadioGroup>
                  </div>
                </FormControl>
              </Grid>
            </Grid>

            <div
              className={styles.row}
              style={{
                marginTop: 20,
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                startIcon={<DeleteIcon />}
                variant="contained"
                size="small"
                onClick={() => remove(index)}
              >
                REMOVE
              </Button>

              <Button
                startIcon={<AddCircleRoundedIcon />}
                color="secondary"
                variant="contained"
                size="small"
                style={{ borderRadius: "50px" }}
                onClick={() =>
                  append({
                    titleID: "",
                    firstNameEng: "",
                    firstNameMr: "",
                    middleNameEng: "",
                    middleNameMr: "",
                    lastNameEng: "",
                    lastNameMr: "",
                    genderID: "",
                    mobile: "",
                    emailID: "",
                    aadharNo: "",
                    panNo: "",
                  })
                }
              >
                {fields.length > 0
                  ? "Add More Holder's Details"
                  : " Add Holder's Details"}
              </Button>
            </div>
          </>
        )
      })}

      {fields.length === 0 ? (
        <div
          className={styles.row}
          style={{
            marginTop: 10,
            marginBottom: 50,
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            startIcon={<AddCircleRoundedIcon />}
            color="secondary"
            variant="contained"
            size="small"
            style={{ borderRadius: "50px" }}
            onClick={() =>
              append({
                titleID: "",
                firstNameEng: "",
                firstNameMr: "",
                middleNameEng: "",
                middleNameMr: "",
                lastNameEng: "",
                lastNameMr: "",
                genderID: "",
                mobile: "",
                emailID: "",
                aadharNo: "",
                panNo: "",
              })
            }
          >
            {fields.length > 0
              ? "Add More Holder's Details"
              : " Add Holder's Details"}
          </Button>
        </div>
      ) : (
        ""
      )}
    </Box>
  )
}

export default PropertyHolderDetails

// .............................API CallING.....................

// casts
//const [casts, setCasts] = useState([]);

// getCasts
// const getCasts = () => {
//   axios.get(`${urls.CFCUrlMaster}/cast/getAll`).then((r) => {
//     setCasts(
//       r.data.map((row) => ({
//         id: row.id,
//         cast: row.castt,
//       })),
//     );
//   });
// };

// Religions
//const [religions, setReligions] = useState([]);

// getReligions
// const getReligions = () => {
//   axios.get(`${urls.CFCUrlMaster}/religion/getAll`).then((r) => {
//     setReligions(
//       r.data.map((row) => ({
//         id: row.id,
//         religion: row.religion,
//       })),
//     );
//   });
// };

// subCasts
//const [subCasts, setSubCast] = useState([]);

// getSubCast
// const getSubCast = () => {
//   axios.get(`${urls.CFCUrlMaster}/subCast/getSubCastDetails`).then((r) => {
//     setSubCast(
//       r.data.map((row) => ({
//         id: row.id,
//         subCast: row.subCast,
//       })),
//     );
//   });
// };

// typeOfDisabilitys
// const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

// getTypeOfDisability
// const getTypeOfDisability = () => {
//   axios.get(`${urls.CFCUrlMaster}/typeOfDisability/getAll`).then((r) => {
//     setTypeOfDisability(
//       r.data.map((row) => ({
//         id: row.id,
//         typeOfDisability: row.typeOfDisability,
//       })),
//     );
//   });
// };

// ................................................................
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.religion}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='religion' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='religion' />
                >
                  {religions &&
                    religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.id}>
                        {religion.religion}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='religion'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.religion ? errors.religion.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.cast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='caste' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='caste' />
                >
                  {casts &&
                    casts.map((cast, index) => (
                      <MenuItem key={index} value={cast.id}>
                        {cast.cast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='cast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.cast ? errors.cast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.subCast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='subCast' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='subCast' />
                >
                  {subCasts &&
                    subCasts.map((subCast, index) => (
                      <MenuItem key={index} value={subCast.id}>
                        {subCast.subCast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='subCast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.subCast ? errors.subCast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name='dateOfBirth'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='dateOfBirth' />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYYMMDD");
                      setValue(
                        "age",
                        moment(date1, "YYYYMMDD").fromNow().slice(0, 2),
                      );
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
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
              {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled
            size='3'
            InputLabelProps={{ shrink: true }}
            id='standard-basic'
            label=<FormattedLabel id='age' />
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid> */
}

// ....................................................................
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.religion}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='religion' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='religion' />
                >
                  {religions &&
                    religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.id}>
                        {religion.religion}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='religion'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.religion ? errors.religion.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.cast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='caste' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='caste' />
                >
                  {casts &&
                    casts.map((cast, index) => (
                      <MenuItem key={index} value={cast.id}>
                        {cast.cast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='cast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.cast ? errors.cast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.subCast}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='subCast' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='subCast' />
                >
                  {subCasts &&
                    subCasts.map((subCast, index) => (
                      <MenuItem key={index} value={subCast.id}>
                        {subCast.subCast}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='subCast'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.subCast ? errors.subCast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name='dateOfBirth'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='dateOfBirth' />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      let date1 = moment(date).format("YYYYMMDD");
                      setValue(
                        "age",
                        moment(date1, "YYYYMMDD").fromNow().slice(0, 2),
                      );
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
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
              {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled
            size='3'
            InputLabelProps={{ shrink: true }}
            id='standard-basic'
            label=<FormattedLabel id='age' />
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid> */
}

// ................................................................
{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.typeOfDisability}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='typeOfDisability' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='typeOfDisability' />
                >
                  {typeOfDisabilitys &&
                    typeOfDisabilitys.map((typeOfDisability, index) => (
                      <MenuItem key={index} value={typeOfDisability.id}>
                        {typeOfDisability.typeOfDisability}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='typeOfDisability'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.typeOfDisability
                ? errors.typeOfDisability.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}

// ............................................................................

{
  /* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.typeOfDisability}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='typeOfDisability' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='typeOfDisability' />
                >
                  {typeOfDisabilitys &&
                    typeOfDisabilitys.map((typeOfDisability, index) => (
                      <MenuItem key={index} value={typeOfDisability.id}>
                        {typeOfDisability.typeOfDisability}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='typeOfDisability'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.typeOfDisability
                ? errors.typeOfDisability.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */
}
