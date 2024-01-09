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
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css"
import moment from "moment"
import theme from "../../../theme.js"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"

// http://localhost:4000/hawkerManagementSystem/transactions/components/AdditionalDetails
const BankDetailsPT = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext()

  // wards
  const [wards, setWards] = useState([])

  // getWards
  const getWards = () => {
    axios.get(`${urls.CFCUrlMaster}/ward/getAll`).then((r) => {
      setWards(
        r.data.map((row) => ({
          id: row.id,
          ward: row.wardName,
          wardNo: row.wardNo,
        }))
      )
    })
  }

  // hawkingDurationDailys
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([])

  // getHawkingDurationDaily
  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.BaseURL}/hawkingDurationDaily/getHawkingDurationDailyData`)
      .then((r) => {
        setHawkingDurationDaily(
          r.data.map((row) => ({
            id: row.id,
            hawkingDurationDaily:
              moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format(
                "hh:mm:ss A"
              ) +
              " To " +
              moment(row.hawkingDurationDailyTo, "HH:mm:ss").format(
                "hh:mm:ss A"
              ),
          }))
        )
      })
  }

  // hawkerTypes
  const [hawkerTypes, setHawkerType] = useState([])

  // getHawkerType
  const getHawkerType = () => {
    axios.get(`${urls.BaseURL}/hawkerType/getHawkerTypeData`).then((r) => {
      setHawkerType(
        r.data.map((row) => ({
          id: row.id,
          hawkerType: row.hawkerType,
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
  const getBankMasters = () => {
    axios.get(`${urls.CFCUrlMaster}/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
        }))
      )
    })
  }

  // useEffect
  useEffect(() => {
    getWards()
    getHawkingDurationDaily()
    getHawkerType()
    getItems()
    getBankMasters()
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
            <FormattedLabel id="bankDetailsPT" />
          </strong>
        </Grid>
      </Box>

      <Grid
        container
        // sx={{
        //   marginRight: "20px",
        //   marginLeft: "10px",
        //   // marginRight: 10,
        //   marginTop: 1,
        //   marginBottom: 5,
        //   align: "center",
        // }}
        style={{ display: "flex", justifyContent: "space-around" }}
      >
        {/* bank Name */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            // autoFocus
            id="standard-basic"
            label={<FormattedLabel id="nameOfBank" />}
            variant="standard"
            {...register("nameOfBank")}
            error={!!errors.nameOfBank}
            helperText={errors?.nameOfBank ? errors.nameOfBank.message : null}
          />
        </Grid>

        {/* branch name */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="branchName" />}
            variant="standard"
            {...register("branchName")}
            error={!!errors.branchName}
            helperText={errors?.branchName ? errors.branchName.message : null}
          />
        </Grid>

        {/* accountNumPT number */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="accountNumPT" />}
            variant="standard"
            {...register("accountNumPT")}
            error={!!errors.accountNumPT}
            helperText={
              errors?.accountNumPT ? errors.accountNumPT.message : null
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

export default BankDetailsPT
