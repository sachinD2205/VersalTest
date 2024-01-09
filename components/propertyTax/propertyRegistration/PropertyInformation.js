// import {
//   Grid,
//   Typography,
//   TextField,
//   Button,
//   Modal,
//   Paper,
// } from "@mui/material";
// import React, { useState } from "react";
// import styles from "../components/view.module.css";
// import Box from "@mui/material/Box";
// import { Controller, useFieldArray, useFormContext } from "react-hook-form";
// import OtpInput from "react-otp-input";
// import FormattedLabel from "../../../../containers/PT_ReusableComponent/FormattedLabel";
// const AadharAuthentication = () => {
//   const {
//     control,
//     register,
//     setValue,
//     formState: { errors },
//   } = useFormContext();

//   // Otp Modal Open
//   const [otpModal, setOtpModal] = useState(false);
//   const otpModalOpen = () => setOtpModal(true);
//   const otpModalClose = () => setOtpModal(false);

//   // view
//   return (
//     <>
//       {/**
//      <div className={styles.row}>
//         <Typography variant='h6' sx={{ marginTop: 4 }}>
//           <strong>Aadhar Authentication</strong>
//         </Typography>
//       </div>
//     */}
//       <div
//         style={{
//           backgroundColor: "#0084ff",
//           color: "white",
//           fontSize: 19,
//           marginTop: 30,
//           marginBottom: 30,
//           padding: 8,
//           paddingLeft: 30,
//           marginLeft: "40px",
//           marginRight: "65px",
//           borderRadius: 100,
//         }}
//       >
//         <strong>
//           <FormattedLabel id='aadharAuthentication' />
//         </strong>
//       </div>
//       <Grid
//         container
//         sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
//       >
//         <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
//           <TextField
//             id='standard-basic'
//             label=<FormattedLabel id='aadhaarNo' />
//             variant='outlined'
//             sx={{
//               width: "500px",
//               height: "50px",
//             }}
//             size='large'
//             {...register("aadhaarNo")}
//             error={!!errors.aadhaarNo}
//             helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
//           />
//         </Grid>
//         <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
//           <Button
//             sx={{
//               marginTop: "3vh",
//               width: "250px",
//               height: "50px",
//               onHover: "primary",

//               ":hover": {
//                 bgcolor: "primary.main", // theme.palette.primary.main
//                 color: "white",
//               },
//             }}
//             variant='outlined'
//             color='primary'
//             size='large'
//             onClick={() => otpModalOpen()}
//           >
//             Send OTP
//           </Button>
//         </Grid>
//         <Modal
//           open={otpModal}
//           onClose={() => otpModalClose()}
//           aria-labelledby='modal-modal-title'
//           aria-describedby='modal-modal-description'
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: 5,
//           }}
//         >
//           <Paper
//             elevation={3}
//             sx={{
//               padding: 2,
//               height: "400px",
//               width: "600px",
//               // display: "flex",
//               // alignItems: "center",
//               // justifyContent: "center",
//             }}
//             component={Box}
//           >
//             <Typography
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 textDecoration: "underline",
//               }}
//               display='inline'
//               id='modal-modal-title'
//               variant='h5'
//               component='h2'
//             >
//               <strong> OTP VERIFICATION</strong>
//             </Typography>
//             <Typography
//               id='modal-modal-description'
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mt: 5,
//               }}
//             >
//               <strong> 6-Digit OTP Send To Your Mobile Number </strong>
//             </Typography>{" "}
//             <br />
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mt: 2,
//               }}
//             >
//               <Controller
//                 render={({ field }) => (
//                   <OtpInput
//                     inputStyle={{ width: "4em", height: "4em" }}
//                     numInputs={6}
//                     isInputNum
//                     //maxLength={4}
//                     otpType={true}
//                     value={field.value}
//                     onChange={(data) => field.onChange(data)}
//                     separator={<span> - </span>}
//                   />
//                 )}
//                 name='aadharOtp'
//                 control={control}
//                 //defaultValue=''
//               />
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mt: 2,
//               }}
//             >
//               <Button
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginTop: "3vh",
//                   // width: "250px",
//                   // height: "50px",

//                   onHover: "primary",

//                   ":hover": {
//                     bgcolor: "primary.main", // theme.palette.primary.main
//                     color: "white",
//                   },
//                 }}
//                 variant='contained'
//                 color='primary'
//                 size='large'
//               >
//                 <FormattedLabel id='verifyOtp' />
//               </Button>
//             </Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 mt: 2,
//               }}
//             >
//               <Button
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   // marginTop: "1vh",
//                   // width: "250px",
//                   // height: "50px",

//                   onHover: "secondary",

//                   ":hover": {
//                     bgcolor: "secondary.main", // theme.palette.primary.main
//                     color: "white",
//                   },
//                 }}
//                 variant='outlined'
//                 color='secondary'
//                 size='small'
//               >
//                 Resend OTP
//               </Button>
//             </Box>
//           </Paper>
//         </Modal>
//       </Grid>
//     </>
//   );
// };

// export default AadharAuthentication;

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
  Typography,
} from "@mui/material"
import Box from "@mui/material/Box"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useFieldArray } from "react-hook-form" //by Ansari on 25 nov
import urls from "../../../URLS/urls"
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"
import moment from "moment"
import theme from "../../../theme.js"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded" //by Ansari
import DeleteIcon from "@mui/icons-material/Delete"
import Button from "@mui/material/Button"

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const PropertyInformation = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext()

  // wards
  const [wards, setWards] = useState([])

  // getWards
  // const getWards = () => {
  //   axios.get(`${urls.CFCUrlMaster}/ward/getAll`).then((r) => {
  //     setWards(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         ward: row.wardName,
  //         wardNo: row.wardNo,
  //       }))
  //     )
  //   })
  // }

  // hawkingDurationDailys
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([])

  // getHawkingDurationDaily
  // const getHawkingDurationDaily = () => {
  //   axios
  //     .get(`${urls.BaseURL}/hawkingDurationDaily/getHawkingDurationDailyData`)
  //     .then((r) => {
  //       setHawkingDurationDaily(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           hawkingDurationDaily:
  //             moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format(
  //               "hh:mm:ss A"
  //             ) +
  //             " To " +
  //             moment(row.hawkingDurationDailyTo, "HH:mm:ss").format(
  //               "hh:mm:ss A"
  //             ),
  //         }))
  //       )
  //     })
  // }

  //---------------------------------------------------

  //--------------------------------------------------
  // occupancies
  const [occupancies, setOccupancies] = useState([])

  // getOccupancy
  const getOccupancy = () => {
    console.log(
      "`${urls.PTAXURL}/master/occupancy/getAllOccupancy`",
      `${urls.PTAXURL}/master/occupancy/getAllOccupancy`
    )
    axios.get(`${urls.PTAXURL}/master/occupancy/getAllOccupancy`).then((r) => {
      console.log("response", r)
      setOccupancies(
        r.data.map((row) => ({
          id: row.id,
          occupancy: row.occupancy,
        }))
      )
    })
  }

  //---------------------------------------------------
  // industryTypes
  const [industryTypes, setIndustryTypes] = useState([])

  // getIndustryType
  const getIndustryType = () => {
    console.log(
      "`${urls.PTAXURL}/master/industryType/getAll`",
      `${urls.PTAXURL}/master/industryType/getAll`
    )
    axios.get(`${urls.PTAXURL}/master/industryType/getAll`).then((r) => {
      console.log("response", r)
      setIndustryTypes(
        r.data.map((row) => ({
          id: row.id,
          industryType: row.industryName,
        }))
      )
    })
  }

  //---------------------------------------------------
  // amenities
  const [amenities, setAmenitiesType] = useState([])

  // getIndustryType
  const getAmenitiesType = () => {
    axios.get(`${urls.PTAXURL}/master/amenities/getAll`).then((r) => {
      console.log("response", r)
      setAmenitiesType(
        r.data.amenities.map((row) => ({
          id: row.id,
          amenities: row.amenity,
        }))
      )
    })
  }

  //---------------------------------------------------
  // usageType
  const [usageTypes, setUsageType] = useState([])

  // getUsageType
  const getUsageType = () => {
    axios.get(`${urls.PTAXURL}/master/usageType/getAll`).then((r) => {
      console.log("getUsageType", r)
      setUsageType(
        r.data.usageType.map((row) => ({
          id: row.id,
          usageType: row.usageType,
        }))
      )
    })
  }
  //---------------------------------------------------
  // subUsageType
  const [subUsageTypes, setSubUsageType] = useState([])

  // getSubUsageType
  const getSubUsageType = () => {
    axios.get(`${urls.PTAXURL}/master/subUsageType/getAll`).then((r) => {
      console.log("subUsageType response", r)
      setSubUsageType(
        r.data.subUsageType.map((row) => ({
          id: row.id,
          subUsageType: row.subUsageType,
        }))
      )
    })
  }

  //---------------------------------------------------
  // constructionType
  const [constructionTypes, setConstructionType] = useState([])

  // getConstructionType
  const getConstructionType = () => {
    console.log(
      "`${urls.PTAXURL}/master/constructionType/getAll`",
      `${urls.PTAXURL}/master/constructionType/getAll`
    )
    axios.get(`${urls.PTAXURL}/master/constructionType/getAll`).then((r) => {
      console.log("constructionType response", r)
      setConstructionType(
        r.data.constructionType.map((row) => ({
          id: row.id,
          constructionTypeName: row.constructionTypeName,
        }))
      )
    })
  }

  // Items
  const [items, setItems] = useState([])

  // getItems
  const getItems = () => {
    axios.get(`${urls.BaseURL}/MstItem/getItemData`).then((r) => {
      setItems(
        r.data.map((row) => ({
          id: row.id,
          item: row.item,
        }))
      )
    })
  }

  // Bank Masters
  const [bankMasters, setBankMasters] = useState([])

  // getBankMasters
  // const getBankMasters = () => {
  //   axios.get(`${urls.CFCUrlMaster}/bank/getAll`).then((r) => {
  //     setBankMasters(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         bankMaster: row.bankName,
  //       }))
  //     )
  //   })
  // }

  // useEffect
  useEffect(() => {
    getUsageType() //by Ansari
    getSubUsageType() //by Ansari
    getConstructionType() //by Ansari
  }, [])

  //--------25 nov start
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  )

  //-------25 nov end

  return (
    <>
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
            <FormattedLabel id="propertyInformation" />
          </strong>
        </Grid>
      </Box>

      {/* 25 nov start */}

      {fields.map((witness, index) => {
        return (
          <>
            <Grid
              key={index}
              container
              style={{
                padding: "1%",
                display: "flex",
                alignItems: "baseline",
              }}
            >
              {/* property ID commented as per new req */}
              {/* <Grid item xs={30} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.propertyId}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='propertyId' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='propertyId' />
                  >
                    {wards &&
                      wards.map((propertyId, index) => (
                        <MenuItem key={index} value={propertyId.id}>
                          {propertyId.propertyId}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='propertyId'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.propertyId ? errors.propertyId.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* GIS Id commented as per new req*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              label=<FormattedLabel id='gisId' />
              variant='standard'
              {...register("gisId")}
              error={!!errors.gisId}
              helperText={
                errors?.gisId ? errors.gisId.message : null
              }
            />
          </Grid> */}

              {/* useType */}
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
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.usageType}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="usageType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        autoFocus
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="usageType" />}
                      >
                        {usageTypes &&
                          usageTypes.map((usageType, index) => (
                            <MenuItem key={index} value={usageType.id}>
                              {usageType.usageType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageType"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.usageType ? errors.usageType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* subUseType */}
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
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.subUsageType}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="usageSubType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="usageSubType" />}
                      >
                        {subUsageTypes &&
                          subUsageTypes.map((subUsageType, index) => (
                            <MenuItem key={index} value={subUsageType.id}>
                              {subUsageType.subUsageType}
                            </MenuItem>
                          ))}
                        {/**
                    <MenuItem value={1}>Hawking Duratio 1</MenuItem>
                    <MenuItem value={2}>Hawking Duratio 2</MenuItem>
                    <MenuItem value={3}>Hawking Duratio 3</MenuItem>
                  */}
                      </Select>
                    )}
                    name="subUsageType"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.subUsageType ? errors.subUsageType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* room type commented as per new req */}
              {/* <Grid item xs={30} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='roomType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='roomType' />
                  >
                    {roomTypes &&
                      roomTypes.map((roomType, index) => (
                        <MenuItem key={index} value={roomType.id}>
                          {roomType.roomType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='roomType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.roomType ? errors.roomType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Length commented as per new req*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              label=<FormattedLabel type="number" id='length' />
              variant='standard'
              {...register("length")}
              error={!!errors.length}
              helperText={
                errors?.length ? errors.length.message : null
              }
            />
          </Grid> */}

              {/* Breadth commented as per new req*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              label=<FormattedLabel id='breadth' />
              variant='standard'
              {...register("breadth")}
              error={!!errors.breadth}
              helperText={
                errors?.breadth ? errors.breadth.message : null
              }
            />
          </Grid> */}

              {/* area in square meter*/}
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
                  label={<FormattedLabel id="areaInSquare" />}
                  variant="standard"
                  {...register("areaInSquare")}
                  error={!!errors.areaInSquare}
                  helperText={
                    errors?.areaInSquare ? errors.areaInSquare.message : null
                  }
                />
              </Grid>

              {/* parking Area */}
              <Grid
                item
                xs={30}
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
                <FormControl sx={{ flexDirection: "row" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    <FormattedLabel id="parkingArea" />
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    style={{ marginLeft: 10 }}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label={
                        <FormattedLabel id="yes" container spacing={500} />
                      }
                      name="parkingArea"
                      {...register("parkingArea")}
                      error={!!errors.parkingArea}
                      helperText={
                        errors?.parkingArea ? errors.parkingArea.message : null
                      }
                    />
                    <FormControlLabel
                      value="NO"
                      control={<Radio />}
                      label={<FormattedLabel id="no" />}
                      name="parkingArea"
                      {...register("parkingArea")}
                      error={!!errors.parkingArea}
                      helperText={
                        errors?.parkingArea ? errors.parkingArea.message : null
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Parking area in square meter*/}
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
                  label={<FormattedLabel id="parkingAreaInSquare" />}
                  variant="standard"
                  {...register("parkingAreaInSquare")}
                  error={!!errors.parkingAreaInSquare}
                  helperText={
                    errors?.parkingAreaInSquare
                      ? errors.parkingAreaInSquare.message
                      : null
                  }
                />
              </Grid>

              {/* Total area in square meter*/}
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
                  label={<FormattedLabel id="totalAreaInSquare" />}
                  variant="standard"
                  {...register("totalAreaInSquare")}
                  error={!!errors.totalAreaInSquare}
                  helperText={
                    errors?.totalAreaInSquare
                      ? errors.totalAreaInSquare.message
                      : null
                  }
                />
              </Grid>

              {/* Construction type */}
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
                <FormControl
                  variant="standard"
                  sx={{ marginTop: 2 }}
                  error={!!errors.constructionTypeName}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="constructionType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="constructionType" />}
                      >
                        {constructionTypes &&
                          constructionTypes.map(
                            (constructionTypeName, index) => (
                              <MenuItem
                                key={index}
                                value={constructionTypeName.id}
                              >
                                {constructionTypeName.constructionTypeName}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    )}
                    name="constructionTypeName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.constructionType
                      ? errors.constructionType.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Property type commented as per new req*/}
              {/* <Grid item xs={30} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.propertyType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='propertyType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='propertyType' />
                  >
                    {propertyTypes &&
                      propertyTypes.map((propertyType, index) => (
                        <MenuItem key={index} value={propertyType.id}>
                          {propertyType.propertyType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='propertyType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.propertyType ? errors.propertyType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Property subtype commented as per new req*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='propertySubType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='propertySubType' />
                  >
                    {propertySubTypes &&
                      propertySubTypes.map((propertySubType, index) => (
                        <MenuItem key={index} value={propertySubType.id}>
                          {propertySubType.propertySubType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='propertySubType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.propertySubType ? errors.propertySubType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Occupancy subtype commented as per new req */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.occupancy}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='occupancyPT' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='occupancyPT' />
                  >
                    {occupancies &&
                      occupancies.map((occupancy, index) => (
                        <MenuItem key={index} value={occupancy.id}>
                          {occupancy.occupancy}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='occupancy'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.occupancy ? errors.occupancy.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Ownership type commented as per new req */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='ownerShipType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='ownerShipType' />
                  >
                    {ownershipTypes &&
                      ownershipTypes.map((ownershipType, index) => (
                        <MenuItem key={index} value={ownershipType.id}>
                          {ownershipType.ownershipType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='ownershipType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.ownershipType ? errors.ownershipType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Business type commented as per new req */}
              {/* <Grid item xs={30} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.businessType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='businessType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='businessType' />
                  >
                    {propertyTypes &&
                      propertyTypes.map((businessType, index) => (
                        <MenuItem key={index} value={businessType.id}>
                          {businessType.businessType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='businessType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.businessType ? errors.businessType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Industry type commented as per new req */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='industryType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='industryType' />
                  >
                    {industryTypes &&
                      industryTypes.map((industryType, index) => (
                        <MenuItem key={index} value={industryType.id}>
                          {industryType.industryType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='industryType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.industryType ? errors.industryType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Flag commented as per new req */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.flagPT}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='flagPT' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='flagPT' />
                  >
                    {propertyTypes &&
                      propertyTypes.map((flagPT, index) => (
                        <MenuItem key={index} value={flagPT.id}>
                          {flagPT.flagPT}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='flagPT'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.flagPT ? errors.flagPT.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.item}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='item1' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='item1' />
                  >
                    {items &&
                      items.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.item}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='item'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.item ? errors.item.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Building permission number commented as per new req*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              label=<FormattedLabel id='buildingPermissionNum' />
              variant='standard'
              {...register("buildingPermissionNum")}
              error={!!errors.buildingPermissionNum}
              helperText={
                errors?.buildingPermissionNum ? errors.buildingPermissionNum.message : null
              }
            />
          </Grid> */}

              {/* Date of building permission commented as per new req */}
              {/* <Grid item xs={30} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name='dateOfBuildingPermission'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 13 }}>
                          <FormattedLabel id='dateOfBuildingPermission' />
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
  
            </FormControl>
          </Grid> */}

              {/* Date of building completion commented as per new req */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name='dateOfBuildingCompletion'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 13 }}>
                          <FormattedLabel id='dateOfBuildingCompletion' />
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
  
            </FormControl>
          </Grid> */}

              {/* Occupancy cert number*/}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              label=<FormattedLabel id='occupancyCertNum' />
              variant='standard'
              {...register("occupancyCertNum")}
              error={!!errors.occupancyCertNum}
              helperText={
                errors?.occupancyCertNum ? errors.occupancyCertNum.message : null
              }
            />
          </Grid> */}

              {/* Date of occupancy certificate */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name='dateOfOccupancyCert'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 13 }}>
                          <FormattedLabel id='dateOfOccupancyCert' />
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
  
            </FormControl>
          </Grid> */}

              {/* Date of actualDateOfBuildingUsageInit */}
              <Grid
                item
                xs={30}
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
                <FormControl sx={{ marginTop: 0 }}>
                  <Controller
                    control={control}
                    name="actualDateOfBuildingUsageInit"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            // <span style={{ fontSize: 11.5 }}>
                            //   <FormattedLabel id="actualDateOfBuildingUsageInit" />
                            // </span>
                            <FormattedLabel id="actualDateOfBuildingUsageInit" />
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
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                  width: 1000,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {/** 
                <FormHelperText>
                  {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
                </FormHelperText>
              */}
                </FormControl>
              </Grid>

              {/* Amenities */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.amenity}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='amenitiesPT' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='amenitiesPT' />
                  >
                    {amenities &&
                      amenities.map((amenities, index) => (
                        <MenuItem key={index} value={amenities.id}>
                          {amenities.amenities}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='amenities'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.amenities ? errors.amenities.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Property Status */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.bankMaster}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='propertyStatus' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='propertyStatus' />
                  >
                    {bankMasters &&
                      bankMasters.map((bankMaster, index) => (
                        <MenuItem key={index} value={bankMaster.id}>
                          {bankMaster.bankMaster}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='bankMaster'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.bankMaster ? errors.bankMaster.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* Factor */}
              {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.bankMaster}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='factorPT' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label=<FormattedLabel id='factorPT' />
                  >
                    {bankMasters &&
                      bankMasters.map((bankMaster, index) => (
                        <MenuItem key={index} value={bankMaster.id}>
                          {bankMaster.bankMaster}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='bankMaster'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.bankMaster ? errors.bankMaster.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
            </Grid>
            <div
              className={styles.row}
              style={{
                marginTop: 10,
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
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
                    usageType: "",
                    subUsageType: "",
                    areaInSquare: "",
                    parkingArea: "",
                    parkingAreaInSquare: "",
                    totalAreaInSquare: "",
                    constructionTypeName: "",
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
                usageType: "",
                subUsageType: "",
                areaInSquare: "",
                parkingArea: "",
                parkingAreaInSquare: "",
                totalAreaInSquare: "",
                constructionTypeName: "",
                //propertyType: '',
                //propertySubType: '',
                //occupancy: '',
                //witnessDocumentKey: '',
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

      {/* 25 nov end */}
    </>
  )
}

export default PropertyInformation
