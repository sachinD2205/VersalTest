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
import urls from "../../../URLS/urls"
import moment from "moment"
import theme from "../../../theme.js"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const ElectricalConnAvailable = () => {
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
  //   axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
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

  // hawkerTypes
  const [hawkerTypes, setHawkerType] = useState([])

  // getHawkerType
  // const getHawkerType = () => {
  //   axios.get(`${urls.BaseURL}/hawkerType/getHawkerTypeData`).then((r) => {
  //     setHawkerType(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         hawkerType: row.hawkerType,
  //       }))
  //     )
  //   })
  // }

  // Items
  const [items, setItems] = useState([])

  // getItems
  // const getItems = () => {
  //   axios.get(`${urls.BaseURL}/MstItem/getItemData`).then((r) => {
  //     setItems(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         item: row.item,
  //       }))
  //     )
  //   })
  // }

  // Bank Masters
  const [bankMasters, setBankMasters] = useState([])

  // getBankMasters
  // const getBankMasters = () => {
  //   axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
  //     setBankMasters(
  //       r.data.map((row) => ({
  //         id: row.id,
  //         bankMaster: row.bankName,
  //       }))
  //     )
  //   })
  // }

  // // BranchNames
  // const [branchNames, setBranchNames] = useState([]);

  // getBranchNames
  // const getBranchNames = () => {
  //   axios
  //     .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setBranchNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           branchName: row.branchName,
  //         })),
  //       );
  //     });
  // };

  // useEffect
  useEffect(() => {
    // getWards()
    // getHawkingDurationDaily()
    // getHawkerType()
    // getItems()
    // getBankMasters()
    // getBranchNames();
  }, [])

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
            <FormattedLabel id="electricalConnAvailable" />
          </strong>
        </Grid>
      </Box>

      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        {/* dropdown */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            sx={{ marginTop: 2 }}
            error={!!errors.electricConnType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="electricConnType" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  // autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="electricConnType" />}
                >
                  {wards &&
                    wards.map((electricConnType, index) => (
                      <MenuItem key={index} value={electricConnType.id}>
                        {electricConnType.electricConnType}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="electricConnType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.electricConnType
                ? errors.electricConnType.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Date of date of electric connection */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfElectricConn"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 13 }}>
                        <FormattedLabel id="dateOfElectricConn" />
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
            {/** 
              <FormHelperText>
                {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
              </FormHelperText>
            */}
          </FormControl>
        </Grid>

        {/* electric consumer number */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="electricConsumerNum" />}
            variant="standard"
            {...register("electricConsumerNum")}
            error={!!errors.electricConsumerNum}
            helperText={
              errors?.electricConsumerNum
                ? errors.electricConsumerNum.message
                : null
            }
          />
        </Grid>

        {/* Action */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              <FormattedLabel id="actionPT" />
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label={<FormattedLabel id="yes" />}
                name="disbality"
                {...register("actionPT")}
                error={!!errors.actionPT}
                helperText={errors?.actionPT ? errors.actionPT.message : null}
              />
              <FormControlLabel
                value="NO"
                control={<Radio />}
                label={<FormattedLabel id="no" />}
                name="disbality"
                {...register("actionPT")}
                error={!!errors.actionPT}
                helperText={errors?.actionPT ? errors.actionPT.message : null}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </>
  )
}

export default ElectricalConnAvailable
