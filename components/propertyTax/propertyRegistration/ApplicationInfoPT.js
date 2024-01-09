import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import Box from "@mui/material/Box"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import axios from "axios"
import moment, { now } from "moment"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import urls from "../../../URLS/urls"
// import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "./view.module.css"

const ApplicationInfoPT = ({ step }) => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext()

  // const [red1, setRed1] = useState(false)
  console.log("APPINFO", step)

  // useEffect(() => {
  //   if (step === 0) {
  //     if (Object.keys(errors).find((obj) => obj === "serviceID")) {
  //       // console.log("kyaMila", Object.keys(errors))
  //       setRed1(true)
  //     } else {
  //       // alert("nb")
  //       setRed1(false)
  //     }
  //   }
  // })
  // console.log("11", red1)

  // crAreaNames
  const [areaNames, setAreaName] = useState([])

  // getAreaName
  const getAreaName = () => {
    axios.get(`${urls.CFCURL}/master/area/getAll`).then((r) => {
      setAreaName(
        r.data.map((row) => ({
          id: row.id,
          areaName: row.areaName,
        }))
      )
    })
  }

  // ServiceName
  const [services, setServiceNames] = useState([])

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      // console.log(
      //   "${urls.CFCURL}/master/service/getAll`",
      //   `${urls.CFCURL}/master/service/getAll`
      // )
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceID: row.serviceName,
        }))
      )
    })
  }

  // useEffect
  useEffect(() => {
    getserviceNames()
    // getHawkingZoneName();
    // getAreaName();
  }, [])

  return (
    <>
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
            <FormattedLabel id="applicationInfo" />
          </strong>
        </Box>
      </Box>

      {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

      <Grid
        container
        sx={{
          marginLeft: 5,
          marginLeft: 5,
          marginTop: 1,
          marginBottom: 5,
          align: "center",
        }}
      >
        {/* <Grid item xs={12} sm={6} md={4}>
          <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='serviceName' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label='Service Name *'
                  id='demo-simple-select-standard'
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {serviceNames &&
                    serviceNames.map((serviceName, index) => (
                      <MenuItem key={index} value={serviceName.id}>
                        {serviceName.serviceName}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='serviceName'
              control={control}
              defaultValue=''
            />
          </FormControl>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <TextField
            id='standard-basic'
            label=<FormattedLabel id='applicationNumber' />
            disabled
            defaultValue='23848494848'
            {...register("applicationNumber")}
            error={!!errors.applicationNumber}
            helperText={
              errors?.applicationNumber
                ? errors.applicationNumber.message
                : null
            }
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            error={!!errors.applicationDate}
            sx={{ marginTop: 0 }}
            // sx={{ border: "solid 1px yellow" }}
          >
            <Controller
              control={control}
              name="applicationDate"
              defaultValue={Date.now()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="applicationDate" />
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
              {errors?.applicationDate ? errors.applicationDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            disabled
            label={<FormattedLabel id="applicationNumber" />}
            {...register("applicationNumber")}
            error={!!errors.applicationNumber}
            helperText={
              errors?.applicationNumber
                ? errors.applicationNumber.message
                : null
            }
          />
        </Grid>

        {/* SubjectServiceName  */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            error={!!errors.serviceID}
            sx={{ marginTop: 2 }}
            // style={{ width: "200px",  }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="SubjectServiceName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="SubjectServiceName" />}
                >
                  {services &&
                    services.map((serviceID, index) => (
                      <MenuItem
                        style={{ maxWidth: "200px" }}
                        key={index}
                        value={serviceID.id}
                      >
                        {serviceID.serviceID}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="serviceID"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.serviceID ? errors.serviceID.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            disabled
            label={<FormattedLabel id="trackingID" />}
            {...register("trackingID")}
            error={!!errors.trackingID}
            helperText={errors?.trackingID ? errors.trackingID.message : null}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default ApplicationInfoPT
