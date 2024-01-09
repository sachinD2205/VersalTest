import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Card,
  Grid,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Tooltip,
  MenuItem,
  RaisedButton,
  Preview,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { yupResolver } from "@hookform/resolvers/yup"
import PreviewIcon from "@mui/icons-material/Preview"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
import axios from "axios"
import moment from "moment"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/TrnCirculateTheAgendaAndPublishSchema"
import urls from "../../../../URLS/urls"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const CirculatetheAgenda = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  })
  const language = useSelector((state) => state?.labels.language)
  const [data, setData] = useState([])

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [isOpenCollapseNew, setIsOpenCollapseNew] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [comittees1, setcomittees1] = useState([])
  const getcomittees1 = () => {
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`)
      .then((r) => {
        setcomittees1(
          r.data.committees.map((row) => ({
            id: row.id,
            comittee: row.CommitteeName,
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

  // Reset Values Cancell
  const resetValuesCancell = {
    id: "",
    fromDate: null,
    toDate: null,
    committeeId: "",
    agendaNo: "",
    meetingDate: null,
    departmentId: "",
    subject: "",
    selectAgenda: "",
    linkForGoogleMeet: "",
    meetingTahkub: "",
    meetingTahkubNoticeNo: "",
    meetingTahkubNoticeDocument: "",
    resolutionNo: "",
    resolutionDetails: "",
    docketNo: "",
    docketDetails: "",
    date: null,
    agendaDetails: "",
    subjectSummary: "",
    docketDate: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    id: "",
    fromDate: null,
    toDate: null,
    committeeId: "",
    agendaNo: "",
    meetingDate: null,
    departmentId: "",
    subject: "",
    selectAgenda: "",
    linkForGoogleMeet: "",
    meetingTahkub: "",
    meetingTahkubNoticeNo: "",
    meetingTahkubNoticeDocument: "",
    resolutionNo: "",
    resolutionDetails: "",
    docketNo: "",
    docketDetails: "",
    date: null,
    agendaDetails: "",
    subjectSummary: "",
    docketDate: null,
  }

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    event.preventDefault()
    const meetingDate = new Date(formData.meetingDate).toISOString()
    const date = new Date(formData.date).toISOString()
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()

    //  const meetingTahkub =formData?.meetingTahkub?.toString()
    console.log("From Date ${formData} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      meetingDate,
      date,
      fromDate,
      toDate,
      // meetingTahkub,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(
          `${urls.MSURL}/trnCirculateTheAgendaAndPublish/save`,

          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----")
      axios
        .post(
          `${urls.MSURL}/trnCirculateTheAgendaAndPublish/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setIsOpenCollapse(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios
      .get(`${urls.MSURL}/trnCirculateTheAgendaAndPublish/getAll`)
      .then((res) => {
        console.log(
          res.data.circulateTheAgendaAndPublish,
          ">>>>>>>>>>>>>>>>>>>>>"
        )
        setDataSource(
          res.data.circulateTheAgendaAndPublish.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            fromDate: r.fromDate,
            toDate: r.toDate,
            committeeId: r.committeeId,
            agendaNo: r.agendaNo,
            docketDate: r.docketDate,
            meetingDate: r.meetingDate,
            departmentId: r.departmentId,
            subject: r.subject,
            subjectSummary: r.subjectSummary,
            selectAgenda: r.selectAgenda,
            linkForGoogleMeet: r.linkForGoogleMeet,
            meetingTahkub: r.meetingTahkub,
            meetingTahkubNoticeNo: r.meetingTahkubNoticeNo,
            meetingTahkubNoticeDocument: r.meetingTahkubNoticeDocument,
            resolutionNo: r.resolutionNo,
            resolutionDetails: r.resolutionDetails,
            docketNo: r.docketNo,
            docketDetails: r.docketDetails,
            date: r.date,
            agendaDetails: r.agendaDetails,
            activeFlag: r.activeFlag,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [])

  const toDate = watch("toDate")
  const fromDate = watch("fromDate")
  const committeeId = watch("committeeId")
  const formattedFromDate = moment(fromDate).format("YYYY-MM-DD")
  const formattedToDate = moment(toDate).format("YYYY-MM-DD")

  const fetchData = async () => {
    const response = await axios.get(
      "${urls.MSURL}/trnCirculateTheAgendaAndPublish/getByCommitteeNo",
      {
        params: {
          fromDate: encodeURIComponent(formattedFromDate),
          toDate: encodeURIComponent(formattedToDate),
          committeeId: committeeId,
        },
      }
    )
    console.log(response.data[0], "RESPONSE")
    reset({
      ...response.data[0],
      toDate: formattedToDate,
      fromDate: formattedFromDate,
      committeeId: committeeId,
    })
  }

  useEffect(() => {
    fetchData()
  }, [toDate, fromDate, committeeId])

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/trnCirculateTheAgendaAndPublish/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    } else {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/trnCirculateTheAgendaAndPublish/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      headerAlign: "center",
      align: "center",
      // flex: 1,
      width: 80,
    },
    {
      field: "fromDate",
      headerName: "From date",
      headerAlign: "center",
      align: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "toDate",
      headerName: "To Date",
      headerAlign: "center",
      align: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "committeeId",
      headerName: "Committee Name",
      headerAlign: "center",
      align: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "agendaNo",
      headerName: "AgendaNo.",
      align: "center",
      width: 155,
    },
    {
      field: "meetingDate",
      headerName: "Date Of Agenda",
      align: "center",
      width: 155,
    },
    {
      field: "departmentId",
      headerName: "Department Name",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 155,
    },

    {
      field: "subject",
      headerName: "Subject",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 110,
    },

    {
      field: "selectAgenda",
      headerName: "Select Agenda",
      align: "center",
      headerAlign: "center",
      width: 140,
    },
    {
      field: "linkForGoogleMeet",
      headerName: "Link forGoogle Meet",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 140,
    },
    {
      field: "meetingTahkub",
      headerName: "Meeting Tahkub /On Hold",
      align: "center",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 210,
    },
    {
      field: "meetingTahkubNoticeNo",
      headerName: "Meeting Tahkub Notice No",
      align: "center",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 165,
    },
    {
      field: "meetingTahkubNoticeDocument",
      headerName: "Meeting Tahkub Notice Document",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 90,
    },

    {
      field: "resolutionNo",
      headerName: "Resolution No",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },

    {
      field: "resolutionDetails",
      headerName: "Resolution Details",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "docketNo",
      headerName: "Docket No.",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "docketDetails",
      headerName: "Docket Details",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "date",
      headerName: "Date",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },

    {
      field: "agendaDetails",
      headerName: "Agenda Details",

      // type: "number",
      headerAlign: "center",
      align: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 120,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Edit details">
              <IconButton
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setButtonInputState(true)
                  console.log("params.row: ", params.row)
                  reset(params.row)
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete details">
              <IconButton
                onClick={() => deleteById(params.id, params.activeFlag)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <Card>
          <div
            style={{
              backgroundColor: "#0084ff",
              color: "white",
              fontSize: 19,
              marginTop: 30,
              marginBottom: 30,
              padding: 8,
              paddingLeft: 30,
              marginLeft: "40px",
              marginRight: "65px",
              borderRadius: 100,
            }}
          >
            Circulate the Agenda and Publish
            {/* <strong> Document Upload</strong> */}
          </div>
        </Card>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {isOpenCollapse && (
            <div>
              <div
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: "40px",
                  marginRight: "65px",
                  borderRadius: 100,
                }}
              >
                Circulate the Agenda and Publish
                {/* <strong> Document Upload</strong> */}
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.maindiv}>
                      <Grid
                        container
                        sx={{
                          marginLeft: 5,
                          marginTop: 2,
                          marginBottom: 5,
                          align: "center",
                        }}
                      >
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY-MM-DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY-MM-DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        To Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Select Committee Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Committees *"
                                >
                                  {comittees1 &&
                                    comittees1.map((comittee, index) => (
                                      <MenuItem key={index} value={comittee.id}>
                                        {comittee.comittee}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="committeeId"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="Agenda No."
                              type="number"
                              {...register("agendaNo")}
                              error={!!errors.agendaNo}
                              helperText={
                                errors?.agendaNo
                                  ? errors.agendaNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              inputProps={{ readOnly: true }}
                              control={control}
                              name="meetingDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY-MM-DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Date of Agenda/Meeting Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="Department Name"
                              required
                              {...register("departmentId")}
                              error={!!errors.departmentId}
                              helperText={
                                errors?.departmentId
                                  ? errors.departmentId.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="Subject"
                              {...register("subject")}
                              error={!!errors.subject}
                              helperText={
                                errors?.subject ? errors.subject.message : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="subject summary"
                              {...register("subjectSummary")}
                            />
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 30 ,width :230}}>
            <TextField
                      

                        label='Committe Name'
                      
                      />
                      </FormControl>
      
         
</Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              inputProps={{ readOnly: true }}
                              control={control}
                              name="docketDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY-MM-DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Docket Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Select Agenda
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="select Agenda*"
                                >
                                  <MenuItem value={true}>True</MenuItem>
                                  <MenuItem value={false}>False</MenuItem>
                                </Select>
                              )}
                              name="selectAgenda"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              // sx={{ marginTop:"-80 !important"}}
                            />
                          </FormControl>
                        </Grid>
                        {/* 
<Grid item xs={4} sm={4} md={4} lg={4} xl={4}>

   <FormControl style={{ marginTop: 35 }}>
<Button
sx={{backgroundColor:"rgb(0, 132, 255) !important",color:"white !important"}}
disabled
size="large" variant="contained">Send</Button>
</FormControl>
</Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Link For Google Meet"
                              // helperText="Please enter Docket No."
                              // type="url"
                              {...register("linkForGoogleMeet")}
                              error={!!errors.linkForGoogleMeet}
                              helperText={
                                errors?.linkForGoogleMeet
                                  ? errors.linkForGoogleMeet.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          <FormControl style={{ marginTop: 35 }}>
<Button
sx={{backgroundColor:"rgb(0, 132, 255) !important",color:"white !important"}}
disabled
size="large" variant="contained">Publish</Button>
</FormControl>
</Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 230 }}>
                            <FormControlLabel
                              label="Meeting Tahkub /OnHold"
                              labelPlacement="start"
                              control={<Checkbox />}
                              {...register("meetingTahkub")}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Meeting Tahkub Notice No.*"
                              {...register("meetingTahkubNoticeNo")}
                              error={!!errors.meetingTahkubNoticeNo}
                              helperText={
                                errors?.meetingTahkubNoticeNo
                                  ? errors.meetingTahkubNoticeNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Meeting Tahkub Notice document*"
                              {...register("meetingTahkubNoticeDocument")}
                              error={!!errors.meetingTahkubNoticeDocument}
                              helperText={
                                errors?.meetingTahkubNoticeDocument
                                  ? errors.meetingTahkubNoticeDocument.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 5 ,width :230}}>
<label style={{display:"flex",height: 25}} htmlFor="myfile">Meeting Tahkub Notice<p style={{color:"red"}}>*</p></label>
<FormControl sx={{display:"flex",flexDirection:"column-reverse",width:210,border:1,padding:1.5, borderColor:"rgba(133, 133, 133,0.6)",borderRadius:1,'&:hover':{borderColor:"rgb(133, 133, 133)"}}}>

<input type="file" id="myfile" name="myfile" />
</FormControl>

</FormControl> 
</Grid> */}
                      </Grid>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    Resolution Entry
                    {/* <strong> Document Upload</strong> */}
                  </div>

                  <div className={styles.small}>
                    <div className={styles.maindiv}>
                      <Grid
                        container
                        sx={{
                          marginLeft: 5,
                          marginTop: 2,
                          marginBottom: 5,
                          align: "center",
                        }}
                      >
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 40, width: 230 }}>
                            <Controller
                              control={control}
                              name="date"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Meeting Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Docket No."
                              {...register("docketNo")}
                              error={!!errors.docketNo}
                              helperText={
                                errors?.docketNo
                                  ? errors.docketNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Resolution No."
                              // type="number"
                              {...register("resolutionNo")}
                              error={!!errors.resolutionNo}
                              helperText={
                                errors?.resolutionNo
                                  ? errors.resolutionNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>
                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 30 ,width :230}}>
            
              <TextField
                
                label="Agenda No."
                type="number"
                
              />
           </FormControl>
          </Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Agenda Details"
                              // required
                              {...register("agendaDetails")}
                              error={!!errors.agendaDetails}
                              helperText={
                                errors?.agendaDetails
                                  ? errors.agendaDetails.message
                                  : null
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Docket Details"
                              required
                              {...register("docketDetails")}
                              error={!!errors.docketDetails}
                              helperText={
                                errors?.docketDetails
                                  ? errors.docketDetails.message
                                  : null
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Resolution Details"
                              //  required
                              {...register("resolutionDetails")}
                              error={!!errors.resolutionDetails}
                              helperText={
                                errors?.resolutionDetails
                                  ? errors.resolutionDetails.message
                                  : null
                              }
                              multiline
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </div>

                    <div className={styles.btn}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}

          <div className={styles.addbtn}>
            <Button
              sx={{ backgroundColor: "rgb(0, 132, 255) !important" }}
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                // reset({
                //   ...resetValuesExit,
                // });
                setBtnSaveText("Save")
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              Add{" "}
            </Button>
          </div>

          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                autoHeight
                sx={{
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                rows={dataSource}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
                //checkboxSelection
              />
            </div>
          </div>
        </Paper>
      </BasicLayout>
    </div>
  )
}

export default CirculatetheAgenda
