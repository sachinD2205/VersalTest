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
  Grid,
  Box,
  ThemeProvider,
  CircularProgress,
  Tooltip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Modal,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineCommitteeEstablishmentSchema"
import moment from "moment"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../view.module.css"
import theme from "../../../../theme"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [showErrorModel, setShowErrorModel] = useState(false)
  const [errorData, setErrorData] = useState([])

  const [loading, setLoading] = useState(false)
  const [loadingComm, setLoadingComm] = useState(false)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const [commData, setCommData] = useState([])
  const [commId, setCommId] = useState(null)

  const language = useSelector((store) => store.labels.language)

  const [catchMethodStatus, setCatchMethodStatus] = useState(false)

  const showErrorMessagesInModel = (data) => {
    setErrorData(data)
    setShowErrorModel(true)
  }

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language, showErrorMessagesInModel)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  const userToken = useGetToken()

  // Get Table - Data
  const getAllCommittees = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommitteeEstablishment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(";res", res)
        if (res?.status === 200 || res?.status === 201) {
          let result = res.data?.committeeEstablishment
          let _res = result?.map((val, i) => {
            console.log("44", val)

            return {
              activeFlag: val.activeFlag,
              id: val.id,
              srNo: i + 1,
              committeeDismissedDate: val.committeeDismissedDate,
              committeeEstablishedDate: val.committeeEstablishedDate,
              // ////////////////////////////////
              committeeDismissedDateShow: moment(
                val.committeeDismissedDate
              )?.format("DD-MM-YYYY"),
              committeeEstablishedDateShow: moment(
                val.committeeEstablishedDate
              )?.format("DD-MM-YYYY"),
              ///////////////////////////////////
              committeeId: val.committeeId,
              committeeIdEn: commData
                ? commData.find((obj) => obj.id == val.committeeId)?.comitteeEn
                : "Not Available",
              committeeIdMr: commData
                ? commData.find((obj) => obj.id == val.committeeId)?.comitteeMr
                : "उपलब्ध नाही",
              working: val.working,
              honorariumPerMeeting: val.honorariumPerMeeting,
            }
          })
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          })
          setLoading(false)
        } else {
          setData([])
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // console.log("error", error)
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getCommittees = () => {
    setLoadingComm(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setCommData(
            res?.data?.committees
              ?.sort((a, b) => {
                const nameA = a?.committeeName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.committeeName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                comitteeEn: r.committeeName,
                comitteeMr: r.committeeNameMr,
              }))
          )
          setLoadingComm(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingComm(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoadingComm(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingComm(false)
        // }
        setLoadingComm(false)
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (commData?.length != 0) {
      getAllCommittees()
    }
  }, [commData])

  useEffect(() => {
    getCommittees()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const committeeDismissedDate = moment(
      formData?.committeeDismissedDate
    ).format("YYYY-MM-DD")

    const committeeEstablishedDate = moment(
      formData?.committeeEstablishedDate
    ).format("YYYY-MM-DD")

    const finalBodyForApi = {
      id: formData.id,
      committeeDismissedDate,
      committeeEstablishedDate,
      committeeId: Number(formData.committeeId),
      honorariumPerMeeting: Number(watch("honorariumPerMeeting")),
      working: watch("working"),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    console.log("420", finalBodyForApi)
    setLoading(true)
    axios
      .post(
        `${urls.MSURL}/mstDefineCommitteeEstablishment/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getAllCommittees()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)

          setLoading(false)
        }
      })
      .catch((error) => {
        // if (error.request.status === 500) {
        //   swal(error.response.data.message, {
        //     icon: "error",
        //   })
        //   getAllCommittees()
        //   setButtonInputState(false)

        //   setLoading(false)
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   })
        //   getAllCommittees()
        //   setButtonInputState(false)

        //   setLoading(false)
        // }
        // console.log("error", error);
        getAllCommittees()
        setButtonInputState(false)
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstDefineCommitteeEstablishment/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                })
                getAllCommittees()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);
              getAllCommittees()
              setButtonInputState(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
        }
      })
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // console.log("inn", willDelete);
        console.log("620", body)

        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstDefineCommitteeEstablishment/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                })
                getAllCommittees()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);
              getAllCommittees()
              setButtonInputState(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
        }
      })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    committeeId: "",
    committeeDismissedDate: null,
    committeeEstablishedDate: null,
    working: "",
    honorariumPerMeeting: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    committeeId: "",
    committeeDismissedDate: null,
    committeeEstablishedDate: null,
    working: "",
    honorariumPerMeeting: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "committeeIdEn" : "committeeIdMr",
      headerName: <FormattedLabel id="committeeName" />,
      minWidth: 400,
      headerAlign: "center",
    },
    {
      field: "committeeEstablishedDateShow",
      headerName: <FormattedLabel id="committeeEstablishedDate" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "committeeDismissedDateShow",
      headerName: <FormattedLabel id="committeeDismissedDate" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "honorariumPerMeeting",
      headerName: <FormattedLabel id="honorariumPerMeeting" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "working",
      headerName: <FormattedLabel id="workingNotWorking" />,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {language == "en" ? (
                <Tooltip title={`EDIT THIS RECORD`}>
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title={`हा रेकॉर्ड एडिट करा`}>
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                language == "en" ? (
                  <Tooltip title={`DE-ACTIVATE THIS RECORD`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={`हा रेकॉर्ड डी-एक्टिव्हेट करा`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                )
              ) : language == "en" ? (
                <Tooltip title={`ACTIVATE THIS RECORD`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={`हा रेकॉर्ड सक्रिय करा`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (watch("committeeEstablishedDate")) {
      setValue("committeeDismissedDate", "")
    }
  }, [watch("committeeEstablishedDate")])

  // Row

  return (
    // <ThemeProvider theme={theme}>
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
              <FormattedLabel id="defineCommitteeEstablishment" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    {loadingComm ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="selectCommittee" />
                          </InputLabel>
                          <Select
                            sx={{ width: "300px" }}
                            variant="standard"
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <FormControl error={!!errors.committeeId}>
                        <InputLabel>
                          <FormattedLabel id="selectCommittee" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              autoFocus
                              variant="standard"
                              sx={{ width: "350px" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {commData &&
                                commData?.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.comitteeEn
                                      : value.comitteeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="committeeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.committeeId
                            ? errors.committeeId.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>
                </Grid>

                {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

                <Grid
                  container
                  // spacing={2}
                  style={{
                    // padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.committeeEstablishedDate}
                    >
                      <Controller
                        control={control}
                        name="committeeEstablishedDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disableFuture
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="committeeEstablishedDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "250px" }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.committeeEstablishedDate
                          ? errors.committeeEstablishedDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.committeeDismissedDate}
                    >
                      <Controller
                        control={control}
                        name="committeeDismissedDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={
                                watch("committeeEstablishedDate") ? false : true
                              }
                              disableFuture
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="committeeDismissedDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "250px" }}
                                  {...params}
                                  size="small"
                                  fullWidth
                                  variant="standard"
                                />
                              )}
                              minDate={watch("committeeEstablishedDate")}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.committeeDismissedDate
                          ? errors.committeeDismissedDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* ///////////////////////// */}
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
                    <TextField
                      id="outlined-basic"
                      sx={{ width: "250px" }}
                      InputLabelProps={{
                        shrink: watch("honorariumPerMeeting") ? true : false,
                      }}
                      type="number"
                      label={<FormattedLabel id="honorariumPerMeeting" />}
                      variant="standard"
                      {...register("honorariumPerMeeting")}
                      error={!!errors.honorariumPerMeeting}
                      helperText={
                        errors?.honorariumPerMeeting
                          ? errors.honorariumPerMeeting.message
                          : null
                      }
                    />
                  </Grid>

                  {/* ///////////////////////////// */}
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
                    <FormControl fullWidth error={!!errors.working}>
                      <InputLabel id="demo-simple-select-label">
                        {<FormattedLabel id="workingNotWorking" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "250px" }}
                            variant="standard"
                            id="demo-simple-select"
                            value={field.value}
                            label="working"
                            onChange={(value) => field.onChange(value)}
                          >
                            <MenuItem value={"Yes"}>Yes</MenuItem>
                            <MenuItem value={"No"}>No</MenuItem>
                          </Select>
                        )}
                        name="working"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.working ? errors.working.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* ///////////////////////////////////////// */}

                <Grid
                  container
                  style={{
                    // padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        size="small"
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {language === "en" ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={cancellButton}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Slide>
        )}
        <Grid
          container
          style={{ padding: "10px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={9}></Grid>
          {!loading && (
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setBtnSaveText("Save")
                  setBtnSaveTextMr("जतन करा")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          )}
        </Grid>
        <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
          {loading ? (
            <Loader />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },

                  // "& .MuiSvgIcon-root": {
                  //   color: "black", // change the color of the check mark here
                  // },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                // density="standard"
                autoHeight={true}
                pagination
                paginationMode="server"
                rowCount={data?.totalRows}
                rowsPerPageOptions={data?.rowsPerPageOptions}
                page={data?.page}
                pageSize={data?.pageSize}
                rows={data?.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getAllCommittees(data?.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)

                  getAllCommittees(_data, data?.page)
                }}
              />
            </div>
          ) : (
            ""
          )}
        </Box>
        {/* MODEL FOR ERROR SHOWING */}
        <Modal
          open={showErrorModel}
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              width: "50%",
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              border: "2px solid blue",
              borderRadius: 5,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 3)",
            }}
          >
            {errorData?.map((obj, ind) => {
              return (
                <TextField
                  // disabled={true}
                  sx={{
                    width: "90%",
                    padding: "10px",
                    borderRadius: 2,
                    "& .MuiInput-input": {
                      color: "red", // Set the text color to red
                    },
                    marginTop: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  // label={<FormattedLabel id="" />}
                  label={`Error ${ind + 1}`}
                  variant="standard"
                  value={obj?.code}
                />
              )
            })}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setShowErrorModel(false)
              }}
              sx={{ margin: "5px 0px 2px 0px" }}
            >
              {language == "en" ? "close" : "बंद करा"}
            </Button>
          </Box>
        </Modal>
      </Paper>
    </div>
    // </ThemeProvider>
  )
}

export default Index
