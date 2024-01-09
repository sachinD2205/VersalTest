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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import urls from "../../../URLS/urls"
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"
import moment from "moment"
import theme from "../../../theme.js"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const WaterConnAvailable = () => {
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
  //   axios.get(`${urls.CFCUrlMaster}/bank/getAll`).then((r) => {
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
            <FormattedLabel id="waterConnAvailable" />
          </strong>
        </Grid>
      </Box>

      <Grid
        container
        sx={{
          marginRight: "20px",
          marginLeft: "10px",
          // marginRight: 10,
          marginTop: 1,
          marginBottom: 5,
          align: "center",
        }}
      >
        {/* dropdown */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ marginTop: 2 }}
            error={!!errors.waterConnType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="waterConnType" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="waterConnType" />}
                >
                  {wards &&
                    wards.map((waterConnType, index) => (
                      <MenuItem key={index} value={waterConnType.id}>
                        {waterConnType.waterConnType}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="waterConnType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.waterConnType ? errors.waterConnType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant='standard'
            sx={{ marginTop: 2 }}
            error={!!errors.wardName}
          >
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='wardName' />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id='wardName' />
                >
                  {wards &&
                    wards.map((ward, index) => (
                      <MenuItem key={index} value={ward.id}>
                        {ward.ward}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='wardName'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.wardName ? errors.wardName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        {/* input */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="numOfWaterConn" />}
            variant="standard"
            {...register("numOfWaterConn")}
            error={!!errors.numOfWaterConn}
            helperText={
              errors?.numOfWaterConn ? errors.numOfWaterConn.message : null
            }
          />
        </Grid>

        {/* input */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="waterConnNum" />}
            variant="standard"
            {...register("waterConnNum")}
            error={!!errors.waterConnNum}
            helperText={
              errors?.waterConnNum ? errors.waterConnNum.message : null
            }
          />
        </Grid>

        {/* input */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="diameter" />}
            variant="standard"
            {...register("diameter")}
            error={!!errors.diameter}
            helperText={errors?.diameter ? errors.diameter.message : null}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default WaterConnAvailable
