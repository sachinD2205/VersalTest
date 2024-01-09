import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
// import Schema from "../../../containers/schema/propertyTax/masters/amenitiesMaster"
import moment from "moment"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import theme from "../../../../theme"
import { TimePicker } from "@mui/x-date-pickers"
import { useRouter } from "next/router"
import {
  filterDocketAddToLocalStorage,
  filterDocketRemoveToLocalStorage,
  getFilterDocketFromLocalStorage,
} from "../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage"
import CircularProgress from "@mui/material/CircularProgress"
import { ExitToApp } from "@mui/icons-material"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [shirinkTF, setshirinkTF] = useState(false)
  const [comittees1, setcomittees1] = useState([])
  const [startDateLocalS, setStartDateLocalS] = useState(
    getFilterDocketFromLocalStorage("startDate")
  )
  const [queryParams] = useState(getFilterDocketFromLocalStorage("queryParams"))
  const [showSaveButton, setshowSaveButton] = useState(true)
  const [prepareAgenda, setPrepareAgenda] = useState()
  const [loading, setLoading] = useState(false)
  const [enableTahkubBtn, setEnableTahkubBtn] = useState(true)
  const [fieldDisable, setFieldDisable] = useState(false)
  const [priviousMeetingTime, setPriviousMeetingTime] = useState("")
  const [commId, setCommId] = useState(null)

  const router = useRouter()

  const userToken = useGetToken()

  console.log(".........router", router.query.agendaNo)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const language = useSelector((store) => store.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  useEffect(() => {
    getAllAmenities()
  }, [comittees1])

  useEffect(() => {
    if (
      watch("currentMeetingPlace") &&
      watch("newMeetingDate") &&
      watch("meetingTime")
    ) {
      return setshowSaveButton(false)
    } else {
      return setshowSaveButton(true)
    }
  }, [
    watch("currentMeetingPlace"),
    watch("newMeetingDate"),
    watch("meetingTime"),
  ])

  // ${queryParams?.agendaNo}
  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(
        `${urls.MSURL}/trnMeetingSchedule/getByMeetingScheduleData?agendaNo=${queryParams?.agendaNo}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )

      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let result = res?.data

          setValue("meetingDate", result[0]?.currentMeeetingDate)
          setValue("agendaNo", queryParams?.agendaNo)
          setValue("meetingPlace", result[0]?.currentMeetingPlace)
          setValue("currentMeetingPlace", result[0]?.currentMeetingPlace)
          setPriviousMeetingTime(result[0]?.currentMeetingTime)
          let ids = result[0]?.aid
          setPrepareAgenda(ids)
          let temp1
          if (comittees1) {
            comittees1?.map((obj) => {
              if (obj?.id === result[0]?.committeeId) {
                temp1 = obj?.comitteeMr
              }
            })
          }

          setData({
            rows: temp1,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          })
          setLoading(false)
        } else {
          sweetAlert({
            title: "Oops!",
            text: "There is nothing to show you!",
            icon: "warning",
            // buttons: ["No", "Yes"],
            dangerMode: false,
            closeOnClickOutside: false,
          })
          setLoading(false)
        }
      })
      .catch((error) => {
        // sweetAlert(error)
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  const getcomittees1 = () => {
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setcomittees1(
          r.data.committees.map((row) => ({
            id: row.id,
            comittee: row.committeeName,
            comitteeMr: row.committeeNameMr,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }
  useEffect(() => {
    getcomittees1()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const newMeetingDate = moment(formData.newMeetingDate).format("YYYY-MM-DD")
    const meetinfDate = moment(formData.meetingDate).format("YYYY-MM-DD")
    const meetingTime = moment(formData.meetingTime).format("HH:mm")

    const finalBodyForApi = {
      agendaNo: formData.agendaNo,
      meetingPlace: formData.currentMeetingPlace,
      meetingDate: newMeetingDate,
      meetingTime: meetingTime,
      isMeetingRescheduled: true,
      prepareMeetingAgendaId: prepareAgenda,
      previousMeetinfDate: meetinfDate,
      previousMeetingTime: priviousMeetingTime ? priviousMeetingTime : null,
      previousMeetingPlace: watch("meetingPlace"),
    }

    console.log(":a1", finalBodyForApi)

    sweetAlert({
      title: "Are you sure?",
      text: "Wanted to Rescheduled the meeting otherwise not!",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .post(`${urls.MSURL}/trnMeetingSchedule/save`, finalBodyForApi, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              // filterDocketRemoveToLocalStorage("queryParams");
              sweetAlert(
                "Saved!",
                "Meeting Rescheduled Successfully !",
                "success"
              ).then((will) => {
                if (will) {
                  // reset({
                  //   newMeetingDate: "",
                  //   meetingPlace: "",
                  //   currentMeetingPlace: "",
                  //   meetingTime: "",
                  //   description: "",
                  // });
                  setFieldDisable(true)
                  setshowSaveButton(true)
                  setEnableTahkubBtn(false)
                }
              })
            }
          })
          // .catch((error) => {
          //   if (error.request.status === 500) {
          //     swal(error.response.data.message, {
          //       icon: "error",
          //     })
          //   } else {
          //     swal("Something went wrong!", {
          //       icon: "error",
          //     })
          //   }
          // })
          .catch((error) => {
            if (!error.status) {
              sweetAlert({
                title: "ERROR",
                text: error?.toString(),
                icon: "warning",
                dangerMode: false,
                closeOnClickOutside: false,
              })
              setFieldDisable(false)
              setshowSaveButton(false)
              setEnableTahkubBtn(true)
              setLoading(false)
            } else {
              // sweetAlert({
              //   title: "ERROR",
              //   text: error?.toString(),
              //   icon: "warning",
              //   dangerMode: false,
              //   closeOnClickOutside: false,
              // })
              setFieldDisable(false)
              setshowSaveButton(false)
              setEnableTahkubBtn(true)
              setLoading(false)
              callCatchMethod(error, language)
            }
          })
      } else {
        sweetAlert("Your Meeting is still not Rescheduled")
      }
    })
  }

  // cancell Button
  const cancellButton = () => {
    // setValue("currentMeetingPlace", "")
    setValue("newMeetingDate", null)
    setValue("meetingTime", null)
  }

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <Paper className={styles.adjustForBread}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "white",
                fontSize: 19,
                fontWeight: 500,
                borderRadius: 100,
              }}
            >
              <strong>
                <FormattedLabel id="meetingReschedule" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
              }}
            >
              <Paper
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "white",
                  borderRadius: "50%",
                  padding: 8,
                }}
                elevation={8}
              >
                <CircularProgress color="success" />
              </Paper>
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit(onSubmitForm)} autoComplete="off">
                {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
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
                    <TextField
                      autoFocus
                      disabled
                      style={{ backgroundColor: "white" }}
                      InputLabelProps={{
                        shrink: watch("committeeId") ? false : true,
                      }}
                      id="outlined-basic"
                      value={data.rows}
                      label={<FormattedLabel id="committeeName" />}
                      variant="standard"
                      {...register("committeeId")}
                      // error={!!errors.committeeId}
                      // helperText={
                      //   errors?.committeeId ? errors.committeeId.message : null
                      // }
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.meetingDate}
                    >
                      <Controller
                        control={control}
                        name="meetingDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="previousMeetingDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={
                                    {
                                      // style: {
                                      //   fontSize: 12,
                                      //   marginTop: 3,
                                      // },
                                    }
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.meetingDate
                          ? errors.meetingDate.message
                          : null}
                      </FormHelperText>
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
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="agendaNo" />}
                      InputLabelProps={{
                        shrink: watch("agendaNo") ? true : false,
                      }}
                      {...register("agendaNo")}
                      // error={!!errors.agendaNo}
                      // helperText={
                      //   errors?.agendaNo ? errors.agendaNo.message : null
                      // }
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
                      disabled
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="meetingPlace" />}
                      InputLabelProps={{
                        shrink: watch("meetingPlace") ? true : false,
                      }}
                      variant="standard"
                      {...register("meetingPlace")}
                      // error={!!errors.meetingPlace}
                      // helperText={
                      //   errors?.meetingPlace ? errors.meetingPlace.message : null
                      // }
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
                      // disabled={fieldDisable}
                      disabled={true}
                      id="outlined-basic"
                      label={<FormattedLabel id="currentMeetingPlace" />}
                      variant="standard"
                      {...register("currentMeetingPlace")}
                      error={!!errors.currentMeetingPlace}
                      helperText={
                        errors?.currentMeetingPlace
                          ? errors.currentMeetingPlace.message
                          : null
                      }
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.newMeetingDate}
                    >
                      <Controller
                        control={control}
                        name="newMeetingDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disablePast
                              disabled={fieldDisable}
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="newMeetingDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  InputLabelProps={
                                    {
                                      // style: {
                                      //   fontSize: 12,
                                      //   marginTop: 3,
                                      // },
                                    }
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.newMeetingDate
                          ? errors.newMeetingDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // style={{ marginTop: 10 }}
                      error={!!errors.meetingTime}
                    >
                      <Controller
                        control={control}
                        name="meetingTime"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              disabled={fieldDisable}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="meetingTime" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(time) => field.onChange(time)}
                              selected={field.value}
                              renderInput={(params) => (
                                <TextField {...params} size="small" fullWidth />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.meetingTime
                          ? errors.meetingTime.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* <Grid
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
                      disabled={fieldDisable}
                      id="outlined-basic"
                      // label={<FormattedLabel id="remark" />}
                      label={<FormattedLabel id="description" />}
                      // variant="outlined"
                      variant="standard"
                      {...register("description")}
                    />
                  </Grid> */}
                </Grid>

                {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled={showSaveButton}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                      size="small"
                    >
                      {language === "en" ? btnSaveText : btnSaveTextMr}
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      disabled={enableTahkubBtn}
                      type="button"
                      variant="contained"
                      color="success"
                      // endIcon={<SaveIcon />}
                      size="small"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/municipalSecretariatManagement/transaction/meetingReScheduling/tahkubNoticePrint",
                          query: { agNo: watch("agendaNo") },
                        })
                      }
                    >
                      {<FormattedLabel id="tahkubNotice" />}
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="error"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                      size="small"
                    >
                      {<FormattedLabel id="clear" />}
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="error"
                      variant="contained"
                      endIcon={<ExitToApp />}
                      onClick={() => {
                        router.back()
                        filterDocketRemoveToLocalStorage("queryParams")
                      }}
                      size="small"
                    >
                      <FormattedLabel id="back" />
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
