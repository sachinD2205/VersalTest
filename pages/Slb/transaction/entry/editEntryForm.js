import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material"
import React from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";
import schema from "../../../../containers/schema/SlbSchema/entryFormSchema"
import styles from "../../masters/module/view.module.css"
import SaveIcon from "@mui/icons-material/Save"
import EditIcon from "@mui/icons-material/Edit"
import ClearIcon from "@mui/icons-material/Clear"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { DataGrid } from "@mui/x-data-grid"

// entryFormSchema
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
import { height } from "@mui/system"
import moment from "moment"
import sweetAlert from "sweetalert"
import { useRouter } from "next/router"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { language } from "../../../../features/labelSlice"
import urls from "../../../../URLS/urls"
import { useSelector } from "react-redux"
import theme from "../../../../theme.js"
import { ContactPageSharp } from "@mui/icons-material"
// import { InputLabel } from '@mui/material';
import DownloadIcon from "@mui/icons-material/Download"

const EditEntryForm = () => {
  const language = useSelector((state) => state.labels.language)
  const {
    register,
    // control,
    // handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })
  const [editId, setEditId] = useState()
  const [recordDetails, setRecordDetails] = useState()
  const [valueString, setValueString] = useState()
  let user = useSelector((state) => state.user.user)

  const router = useRouter()

  useEffect(() => {
    let id = ""

    // iterate through the query parameters and get value of data
    for (const key in router.query) {
      if (key == "id") {
        // get the value of data
        id = router.query[key]
      }
    }

    // alert("id is " + id);

    // set the editId

    if (id) {
      setEditId(id)
      // alert("id is " + id);

      // Get the entire record from the database using id
      axios
        .get(`${urls.SLB}/trnEntry/getById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setRecordDetails(res.data)
          setTimeout(() => {
            setValueString(res.data.valueString)
          }, 100)
          setValue("valueString", res.data.valueString)
          // alert("editId" + JSON.stringify(res));
        })
    }
  }, [])

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      editId,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    parameterName: "",
    valueString: "",
  }

  // OnSubmit Form
  const onSubmitForm = async (fromData) => {
    fromData.preventDefault()
    // Save - DB
    let body = ""
    body = {
      entryUniqueIdentifier: recordDetails.entryUniqueIdentifier,
      id: recordDetails.id,
      valueString: document.getElementById("standard-basic").value,
    }
    await axios
      .post(`${urls.SLB}/trnEntry/editRecordById`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(
        (res) => {
          if (res.status == 201 || res.status == 200) {
            let title = ""
            if (language == "en") {
              title = "Saved!"
            } else {
              title = "जतन!"
            }
            swal({
              title: title,
              text: res.data.data,
              icon: "success",
            }).then((dialogResp) => {
              if (dialogResp) {
                router.push("/Slb/transaction/entry")
              }
            })
          }
        },
        (error) => {
          alert(error)
        }
      )
  }

  // View
  return (
    valueString && (
      <>
        <ThemeProvider theme={theme}>
          <Paper
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
              // marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                // backgroundColor:'#0E4C92'
                // backgroundColor:'		#0F52BA'
                // backgroundColor:'		#0F52BA'
                background:
                  "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                {" "}
                Edit Entry Form
                {/* <FormattedLabel id="opinion" /> */}
              </h2>
            </Box>

            <Divider />
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              {recordDetails && "Zone : "}
              {recordDetails && recordDetails.zoneName}
              {recordDetails && " | Ward : "}
              {recordDetails && recordDetails.wardName}
            </InputLabel>

            <Divider />
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              {recordDetails && "Module : "}
              {recordDetails && recordDetails.moduleName}
            </InputLabel>

            <Divider />
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              {recordDetails && "Benchmark : "}
              {recordDetails && recordDetails.parameterName}
            </InputLabel>

            <Divider />
            <InputLabel
              id="demo-simple-select-standard-label"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              {recordDetails && "Sub Parameter : "}
              {recordDetails && recordDetails.subParameterName}
            </InputLabel>
            <Divider />

            <Box
              sx={{
                marginLeft: 5,
                marginRight: 5,
                // marginTop: 2,
                marginBottom: 5,
                padding: 0,
                // border:1,
                // borderColor:'grey.500'
              }}
            >
              <Box>
                <FormProvider {...methods}>
                  <form onSubmit={onSubmitForm}>
                    <div className={styles.small}>
                      <div className={styles.row}>
                        <div>
                          <TextField
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="Value *"
                            type="number"
                            variant="standard"
                            {...register("valueString")}
                            error={!!errors.valueString}
                            value={watch("valueString")}
                            helperText={
                              errors?.valueString
                                ? errors.valueString.message
                                : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            // endIcon={<SaveIcon />}
                            disabled={watch("valueString") ? false : true}
                          >
                            Update
                          </Button>{" "}
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            disabled={watch("valueString") ? false : true}
                            onClick={() => cancellButton()}
                          >
                            Clear
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() =>
                              router.push({
                                pathname: "/Slb/transaction/entry",
                              })
                            }
                          >
                            Exit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </Box>
            </Box>
          </Paper>
        </ThemeProvider>
      </>
    )
  )
}

export default EditEntryForm
