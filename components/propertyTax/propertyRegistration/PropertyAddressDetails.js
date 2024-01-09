import {
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
} from "@mui/material"
import Box from "@mui/material/Box"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import urls from "../../../URLS/urls"
// import styles from "../components/view.module.css"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
import { Button } from "antd"
import Image from "next/image"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"

let drawerWidth

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
)

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}))

const PropertyAddressDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()

  const [latt, setLatt] = useState({
    lattitude: "",
    longitude: "",
  })
  console.log("Checking...", latt)

  const [shrinkS, setshrinkS] = useState()

  // circles
  const [circles, setCircle] = useState([])

  // getCircle

  const getCircle = () => {
    axios
      .get(`${urls.PTAXURL}/master/circle/getAll`)
      .then((r) => {
        console.log("getCircle", r)
        setCircle(
          r.data.circle.map((row) => ({
            id: row.id,
            circle: row.circleName,
          }))
        )
      })
      .catch((error) => {
        sweetAlert(error)
      })
  }

  // circles
  const [circleNumbers, setCircleNumber] = useState([])

  // getCircle
  const getCircleNumber = () => {
    axios.get(`${urls.PTAXURL}/master/circle/getAll`).then((r) => {
      setCircleNumber(
        r.data.circle.map((row) => ({
          id: row.id,
          circleNo: row.circleNo,
        }))
      )
    })
  }

  // crAreaNames
  const [crAreaNames, setCRAreaName] = useState([])

  // getAreaName
  const getCRAreaName = () => {
    axios.get(`${urls.CFCURL}/master/area/getAll`).then((r) => {
      setCRAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          crAreaName: row.areaName,
        }))
      )
    })
  }

  // crLandmarkNames
  const [crLandmarkNames, setCrLandmark] = useState([])

  const getCrLandmark = () => {
    axios.get(`${urls.PTAXURL}/master/landmark/getAll`).then((r) => {
      setCrLandmark(
        r.data.landmark.map((row) => ({
          id: row.id,
          crLandmarkName: row.landmark,
        }))
      )
    })
  }

  // crVillageNames
  const [crVillageNames, setCrVilageNames] = useState([])

  // getCrVillageNames
  const getCrVillageNames = () => {
    axios.get(`${urls.CFCURL}/master/village/getAll`).then((r) => {
      setCrVilageNames(
        r.data.village.map((row) => ({
          id: row.id,
          crVillageName: row.villageName,
        }))
      )
    })
  }

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([])

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios.get(`${urls.PTAXURL}/master/pinCode/getAll`).then((r) => {
      setCrPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        }))
      )
    })
  }

  // Address Change
  const addressChange = (e) => {
    if (e.target.checked) {
      setValue("prAreaName", getValues("crAreaName"))
      setValue("prLandmarkName", getValues("crLandmarkName"))
      setValue("prVillageName", getValues("crVillageName"))
      setValue("prPincode", getValues("crPincode"))
      setValue("prLattitude", getValues("crLattitude"))
      setValue("prLongitude", getValues("crLongitude"))
      setValue("prSurveyNumber", getValues("crSurveyNumber"))
      setValue("prSocietyName", getValues("crSocietyName"))
      setValue("prBuildingName", getValues("crBuildingName"))
      setValue("prFlatNumber", getValues("crFlatNumber"))
      setValue("prCitySurveyNumber", getValues("crCitySurveyNumber"))
      setshrinkS(true)
    } else {
      setValue("prCitySurveyNumber", "")
      setValue("prAreaName", "")
      setValue("prLandmarkName", "")
      setValue("prVillageName", "")
      setValue("prPincode", "")
      setValue("prLattitude", "")
      setValue("prLongitude", "")
      setValue("prSurveyNumber")
      setValue("prSocietyName")
      setValue("prBuildingName")
      setValue("prFlatNumber")
      setshrinkS(false)
    }
  }

  // crAreaNames
  const [prAreaNames, setprAreaName] = useState([])

  // getAreaName
  const getprAreaName = () => {
    axios.get(`${urls.CFCURL}/master/area/getAll`).then((r) => {
      setprAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          prAreaName: row.areaName,
        }))
      )
    })
  }

  // crLandmarkNames
  const [prLandmarkNames, setprLandmark] = useState([])

  // getPrLandmark
  const getprLandmark = () => {
    axios.get(`${urls.PTAXURL}/master/landmark/getAll`).then((r) => {
      setprLandmark(
        r.data.landmark.map((row) => ({
          id: row.id,
          prLandmarkName: row.landmark,
        }))
      )
    })
  }

  // crVillageNames
  const [prVillageNames, setprVilageNames] = useState([])

  // getCrVillageNames
  const getprVillageNames = () => {
    axios.get(`${urls.CFCURL}/master/village/getAll`).then((r) => {
      setprVilageNames(
        r.data.village.map((row) => ({
          id: row.id,
          prVillageName: row.villageName,
        }))
      )
    })
  }

  // prPincodes
  const [prPincodes, setprPinCodes] = useState([])

  // getprPinCodes
  const getprPinCodes = () => {
    axios.get(`${urls.PTAXURL}/master/pinCode/getAll`).then((r) => {
      setprPinCodes(
        r.data.pinCode.map((row) => ({
          id: row.id,
          prPincode: row.pinCode,
        }))
      )
    })
  }

  // useEffect
  useEffect(() => {
    getCrLandmark()
    getCRAreaName()
    getCrVillageNames()
    getCrPinCodes()
    getprLandmark()
    getprAreaName()
    getprVillageNames()
    getprPinCodes()
    getCircle() //by Anwar Ansari
    getCircleNumber() //by Anwar Ansari
  }, [])

  // /////// Drawer Code
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open)
    drawerWidth = "50%"
  }

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false)
    drawerWidth = 0
  }

  /////////////////////////////

  return (
    <>
      {/** Btton */}
      {/* <Box
        style={{
          right: 25,
          position: "absolute",
          top: "50%",
          backgroundColor: "#bdbdbd",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          // edge="end"
          onClick={handleDrawerOpen}
          sx={{
            width: "30px",
            height: "75px",
            borderRadius: 0,
            backgroundColor: "#0084ff",
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Box> */}

      {/** Main Component  */}
      <Main>
        <Box
          style={{
            height: "auto",
            overflow: "auto",
            padding: "10px 200px",
          }}
        >
          <Grid
            className={styles.details1}
            item
            xs={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: linearGradient(
              //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
              // ),

              // color: red2 ? "red" : "black",
              color: "black",
              padding: "2px",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            {/* <strong className={red2 ? styles.wave : ""}> */}
            <strong>
              <FormattedLabel id="propertyAddressDetails" />
            </strong>
          </Grid>
        </Box>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="searchAddress" />}
              variant="standard"
              style={{ minWidth: 500 }}
            />
            <Button
              variant="contained"
              onClick={handleDrawerOpen}
              style={{
                borderRadius: "20px",
                backgroundColor: "#0084ff",
                color: "black",
                // marginLeft: "20px",
                // outline: "none",
                border: "none",
              }}
            >
              Search
            </Button>
          </div>
        </Grid>

        {/* Grid1 by Anwar Ansari */}

        <Grid
          container
          // sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
          sx={{
            marginLeft: "10px",
            marginTop: 1,
            marginBottom: 5,
            align: "center",
            // columnGap: 1,
          }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginLeft: "15px",
            marginRight: "auto",
          }}
        >
          {/* circleName */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.circle}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="circleName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="circleName" />}
                  >
                    {circles &&
                      circles.map((circle, index) => (
                        <MenuItem key={index} value={circle.id}>
                          {circle.circle}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="circle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.circle ? errors.circle.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* circleNum */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.circleNo}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="circleNumber" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="circleNumber" />}
                  >
                    {circleNumbers &&
                      circleNumbers.map((circleNo, index) => (
                        <MenuItem key={index} value={circleNo.id}>
                          {circleNo.circleNo}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="circleNo"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.circleNo ? errors.circleNo.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* SurveyNum */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" />}
              {...register("crCitySurveyNumber")}
              error={!!errors.crCitySurveyNumber}
              helperText={
                errors?.crCitySurveyNumber
                  ? errors.crCitySurveyNumber.message
                  : null
              }
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crAreaName}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='areaName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='areaName' />
                  >
                    {crAreaNames &&
                      crAreaNames.map((crAreaName, index) => (
                        <MenuItem key={index} value={crAreaName.id}>
                          {crAreaName.crAreaName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crAreaName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crAreaName ? errors.crAreaName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

          {/* flatNum */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="flatNumber" />}
              {...register("crFlatNumber")}
              error={!!errors.crFlatNumber}
              helperText={
                errors?.crFlatNumber ? errors.crFlatNumber.message : null
              }
            />
          </Grid>

          {/* building Name */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="buildingName" />}
              {...register("crBuildingName")}
              error={!!errors.crBuildingName}
              helperText={
                errors?.crBuildingName ? errors.crBuildingName.message : null
              }
            />
          </Grid>
          {/* society Name */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="societyName" />}
              {...register("crSocietyName")}
              error={!!errors.crSocietyName}
              helperText={
                errors?.crSocietyName ? errors.crSocietyName.message : null
              }
            />
          </Grid>
          {/* city survey number */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              
              id="standard-basic"
              label=<FormattedLabel id="surveyNumber" />
              {...register("crSurveyNumber")}
              error={!!errors.crSurveyNumber}
              helperText={
                errors?.crSurveyNumber ? errors.crSurveyNumber.message : null
              }
            />
          </Grid> */}

          {/* areaNamePT */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crAreaName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="areaNamePT" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="areaNamePT" />}
                  >
                    {crAreaNames &&
                      crAreaNames.map((crAreaName, index) => (
                        <MenuItem key={index} value={crAreaName.id}>
                          {crAreaName.crAreaName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crAreaName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.crAreaName ? errors.crAreaName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* village Name
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crVillageName}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='villageName' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='villageName' />
                  >
                    {crVillageNames &&
                      crVillageNames.map((crVillageName, index) => (
                        <MenuItem key={index} value={crVillageName.id}>
                          {crVillageName.crVillageName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crVillageName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crVillageName ? errors.crVillageName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
          {/* landmark */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              disabled
              defaultValue={"Pimpri Chinchwad"}
              label=<FormattedLabel id='landmarkName' />
              {...register("crLandmarkName")}
              error={!!errors.crLandmarkName}
              helperText={errors?.crLandmarkName ? errors.crLandmarkName.message : null}
            />
          </Grid> */}

          {/* landmark */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crLandmarkName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="landmarkName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="landmarkName" />}
                  >
                    {crLandmarkNames &&
                      crLandmarkNames.map((crLandmarkName, index) => (
                        <MenuItem key={index} value={crLandmarkName.id}>
                          {crLandmarkName.crLandmarkName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crLandmarkName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.crLandmarkName ? errors.crLandmarkName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* village */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              disabled
              defaultValue={"Pimpri Chinchwad"}
              label=<FormattedLabel id='villageName' />
              {...register("crVillageName")}
              error={!!errors.crVillageName}
              helperText={errors?.crVillageName ? errors.crVillageName.message : null}
            />
          </Grid> */}

          {/* village Name */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crVillageName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="villageName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="villageName" />}
                  >
                    {crVillageNames &&
                      crVillageNames.map((crVillageName, index) => (
                        <MenuItem key={index} value={crVillageName.id}>
                          {crVillageName.crVillageName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crVillageName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.crVillageName ? errors.crVillageName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* cityname */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              disabled
              defaultValue={1}
              type="number"
              label={<FormattedLabel id="cityName" />}
              {...register("crCityName")}
              error={!!errors.crCityName}
              helperText={errors?.crCityName ? errors.crCityName.message : null}
            />
          </Grid>

          {/* pincode */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.crPincode}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="pinCode" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="pinCode" />}
                  >
                    {crPincodes &&
                      crPincodes.map((crPincode, index) => (
                        <MenuItem key={index} value={crPincode.id}>
                          {crPincode.crPincode}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crPincode"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.crPincode ? errors.crPincode.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* lattitude */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="lattitude" />}
              value={latt.lattitude}
            />
          </Grid>
          {/* {...register("crLattitude")}
              error={!!errors.crLattitude}
              helperText={
                errors?.crLattitude ? errors.crLattitude.message : null
              } */}

          {/* longitude */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="longitude" />}
              value={latt.longitude}
            />
          </Grid>
          {/* {...register("crLongitude")}
              error={!!errors.crLongitude}
              helperText={
                errors?.crLongitude ? errors.crLongitude.message : null
              } */}

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {/** 
            <Button
              variant='contained'
              onClick={() => {
                handleDrawerOpen();
              }}
            >
              View Location On Map
            </Button>
           */}
          </Grid>
        </Grid>
        {/* Grid1 end by Anwar Ansari */}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            padding: "10px 200px",
          }}
        >
          <Grid
            className={styles.details1}
            item
            xs={8}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: linearGradient(
              //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
              // ),

              // color: red2 ? "red" : "black",
              color: "black",
              padding: "2px",
              fontSize: 19,
              fontWeight: 500,
              borderRadius: 100,
            }}
          >
            {/* <strong className={red2 ? styles.wave : ""}> */}
            <strong>
              <FormattedLabel id="Postal_BillingAddress" />
            </strong>
          </Grid>
        </Box>

        {/* Grid2 by Anwar Ansari */}
        <Grid
          container
          // sx={{ marginLeft: 5, marginBottom: 10, align: "center" }}
          sx={{
            marginRight: "20px",
            marginLeft: "10px",
            // marginRight: 10,
            marginTop: 1,
            marginBottom: 5,
            align: "center",
          }}
        >
          {/* postalAddressAsThePropertyAddress */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography>
                  <b style={{ borderBottom: "2px solid red" }}>
                    <FormattedLabel id="postalAddressAsThePropertyAddress" />
                  </b>
                </Typography>
              }
              {...register("addressCheckBox")}
              onChange={(e) => {
                addressChange(e)
              }}
            />
          </Grid>

          {/* citySurveyNumber */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" />}
              {...register("prCitySurveyNumber")}
              InputLabelProps={{ shrink: shrinkS }}
              error={!!errors.prCitySurveyNumber}
              helperText={
                errors?.prCitySurveyNumber
                  ? errors.prCitySurveyNumber.message
                  : null
              }
            />
          </Grid>

          {/* flatNumber */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              InputLabelProps={{ shrink: shrinkS }}
              label={<FormattedLabel id="flatNumber" />}
              {...register("prFlatNumber")}
              error={!!errors.prFlatNumber}
              helperText={
                errors?.prFlatNumber ? errors.prFlatNumber.message : null
              }
            />
          </Grid>

          {/* buildingName */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              InputLabelProps={{ shrink: shrinkS }}
              label={<FormattedLabel id="buildingName" />}
              {...register("prBuildingName")}
              error={!!errors.prBuildingName}
              helperText={
                errors?.prBuildingName ? errors.prBuildingName.message : null
              }
            />
          </Grid>

          {/* societyName */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              InputLabelProps={{ shrink: shrinkS }}
              label={<FormattedLabel id="societyName" />}
              {...register("prSocietyName")}
              error={!!errors.prSocietyName}
              helperText={
                errors?.prSocietyName ? errors.prSocietyName.message : null
              }
            />
          </Grid>

          {/* city survey number */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label=<FormattedLabel id="surveyNumber" />
              {...register("prSurveyNumber")}
              error={!!errors.prSurveyNumber}
              helperText={
                errors?.prSurveyNumber ? errors.prSurveyNumber.message : null
              }
            />
          </Grid> */}

          {/* area name */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: true }}
              id='standard-basic'
              label=<FormattedLabel id='areaNamePT' />
              {...register("prAreaNamePT")}
              error={!!errors.prAreaNamePTr}
              helperText={
                errors?.prAreaNamePT
                  ? errors.prAreaNamePT.message
                  : null
              }
            />
          </Grid> */}
          {/* landmark name */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: true }}
              id='standard-basic'
              label=<FormattedLabel id='landmarkName' />
              {...register("prLandmarkName")}
              error={!!errors.prLandmarkName}
              helperText={
                errors?.prLandmarkName
                  ? errors.prLandmarkName.message
                  : null
              }
            />
          </Grid> */}
          {/* village name */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              InputLabelProps={{ shrink: true }}
              id='standard-basic'
              label=<FormattedLabel id='villageName' />
              {...register("prVillageName")}
              error={!!errors.prVillageName}
              helperText={
                errors?.prVillageName
                  ? errors.prVillageName.message
                  : null
              }
            />
          </Grid> */}
          {/* areaNamePT */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prAreaName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="areaNamePT" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="areaNamePT" />}
                  >
                    {prAreaNames &&
                      prAreaNames.map((prAreaName, index) => (
                        <MenuItem key={index} value={prAreaName.id}>
                          {prAreaName.prAreaName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prAreaName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.prAreaName ? errors.prAreaName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* landmarkName */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prLandmarkName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="landmarkName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    shrink={true}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="landmarkName" />}
                  >
                    {prLandmarkNames &&
                      prLandmarkNames.map((prLandmarkName, index) => (
                        <MenuItem key={index} value={prLandmarkName.id}>
                          {prLandmarkName.prLandmarkName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prLandmarkName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.prLandmarkName ? errors.prLandmarkName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* villageName */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prVillageName}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="villageName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="villageName" />}
                  >
                    {prVillageNames &&
                      prVillageNames.map((prVillageName, index) => (
                        <MenuItem key={index} value={prVillageName.id}>
                          {prVillageName.prVillageName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prVillageName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.prVillageName ? errors.prVillageName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* city */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              disabled
              defaultValue={1}
              label={<FormattedLabel id="cityName" type="number" />}
              {...register("prCityName")}
              error={!!errors.prCityName}
              helperText={errors?.prCityName ? errors.prCityName.message : null}
            />
          </Grid>

          {/* pincode */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              disabled
              defaultValue={"411045"}
              label=<FormattedLabel id='pinCode' />
              {...register("prPinCode")}
              error={!!errors.prPinCode}
              helperText={errors?.prPinCode ? errors.prPinCode.message : null}
            />
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              shrink={true}
              id='standard-basic'
              disabled
              defaultValue={"Maharashtra"}
              label=<FormattedLabel id='state' />
              {...register("prState")}
              error={!!errors.prState}
              helperText={errors?.prState ? errors.prState.message : null}
            />
          </Grid> */}
          {/* pincode */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.prPincode}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="pinCode" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="pinCode" />}
                  >
                    {prPincodes &&
                      prPincodes.map((prPincode, index) => (
                        <MenuItem key={index} value={prPincode.id}>
                          {prPincode.prPincode}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prPincode"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.prPincode ? errors.prPincode.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* lattitude */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // InputLabelProps={{ shrink: true }}
              id="standard-basic"
              label={<FormattedLabel id="lattitude" />}
              value={latt.lattitude}
              name="crLattitude"
            />
          </Grid>
          {/* {...register("prLattitude")}
              error={!!errors.prLattitude}
              helperText={
                errors?.prLattitude ? errors.prLattitude.message : null
              } */}

          {/* longitude */}

          {/* <div style={{ display: "flex", justifyContent: "center" }}></div> */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="longitude" />}
              value={latt.longitude}
            />
          </Grid>

          {/* error={!!errors.prLongitude}
              helperText={
                errors?.prLongitude ? errors.prLongitude.message : null
              } */}
          {/* {...register("prLongitude")} */}
        </Grid>
        {/*  grid2 end by Anwar Ansari*/}
      </Main>

      {/** Drawer  */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        {/* <Divider /> */}

        <Box
          style={{
            left: 0,
            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // edge="end"
            onClick={handleDrawerClose}
            sx={{ width: "30px", height: "75px", borderRadius: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>

        <img
          src="/ABC.jpg"
          //hegiht='300px'
          width="800px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
          onClick={() => {
            setLatt((previous) => ({
              ...previous,
              lattitude: "18.6298° N",
              longitude: "73.7997° E",
            }))
          }}
        />
      </Drawer>
      {/** End Drawer  */}
    </>
  )
}

export default PropertyAddressDetails
