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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/TrnMarkAttendanceProceedingAndPublishSchema"
import urls from "../../../../URLS/urls"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const MarkAttendanceProceeding = () => {
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

  const [data, setData] = useState([])
  const language = useSelector((state) => state?.labels.language);
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [isOpenCollapseNew, setIsOpenCollapseNew] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [wardNames, setwardNames] = useState([])
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  // Reset Values Cancell
  const resetValuesCancell = {
    id: "",
    agendaNo: "",
    attendanceCaptureFrom: "",
    listOfConcernCommitteeMembers: "",
    selectDocketNo: "",
    addProceeding: "",
    addProceedingMr: "",
    proceedingDate: "",
    onSpotEntry: "",
    onSpotEntryMr: "",
    on_hold_subjects: "",
    on_hold_subjectsMr: "",
    nextMeetingDateForOnHoldSubjects: "",
    nameOfSuchak: "",
    nameOfSuchakMr: "",
    nameOfAnumodak: "",
    nameOfAnumodakMr: "",
    referenceByPersonName: "",
    referenceByPersonNameMr: "",
    digitalSignature: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    id: "",
    agendaNo: "",
    attendanceCaptureFrom: "",
    listOfConcernCommitteeMembers: "",
    selectDocketNo: "",
    addProceeding: "",
    addProceedingMr: "",
    proceedingDate: "",
    onSpotEntry: "",
    onSpotEntryMr: "",
    on_hold_subjects: "",
    on_hold_subjectsMr: "",
    nextMeetingDateForOnHoldSubjects: "",
    nameOfSuchak: "",
    nameOfSuchakMr: "",
    nameOfAnumodak: "",
    nameOfAnumodakMr: "",
    referenceByPersonName: "",
    referenceByPersonNameMr: "",
    digitalSignature: "",
  }

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    event.preventDefault()
    const proceedingDate = new Date(formData.proceedingDate).toISOString()
    const nextMeetingDateForOnHoldSubjects = new Date(
      formData.nextMeetingDateForOnHoldSubjects
    ).toISOString()
    const date = new Date(formData.date).toISOString()
    const docketDate = new Date(formData.docketDate).toISOString()
    const on_hold_subjects = formData?.on_hold_subjects?.toString()
    const on_hold_subjectsMr = formData?.on_hold_subjectsMr?.toString()
    const onSpotEntry = formData?.onSpotEntry?.toString()
    const onSpotEntryMr = formData?.onSpotEntryMr?.toString()
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      proceedingDate,
      nextMeetingDateForOnHoldSubjects,
      date,
      on_hold_subjects,
      on_hold_subjectsMr,
      docketDate,
      onSpotEntryMr,
      onSpotEntry,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(
          `${urls.MSURL}/trnMarkAttendanceProceedingAndPublish/save`,

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
        }).catch((error) => {
          callCatchMethod(error, language);
        });
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----")
      axios
        .post(
          `${urls.MSURL}/trnMarkAttendanceProceedingAndPublish/save`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
          }
        }).catch((error) => {
          callCatchMethod(error, language);
        });
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
      .get(`${urls.MSURL}/trnMarkAttendanceProceedingAndPublish/getAll`)
      .then((res) => {
        console.log(
          res.data.markAttendanceProceedingAndPublish,
          ">>>>>>>>>>>>>>>>>>>>>"
        )
        setDataSource(
          res.data.markAttendanceProceedingAndPublish.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            agendaNo: r.agendaNo,
            attendanceCaptureFrom: r.attendanceCaptureFrom,
            listOfConcernCommitteeMembers: r.listOfConcernCommitteeMembers,
            selectDocketNo: r.selectDocketNo,
            addProceeding: r.addProceeding,
            addProceedingMr: r.addProceedingMr,
            proceedingDate: r.proceedingDate,
            onSpotEntry: r.onSpotEntry,
            onSpotEntryMr: r.onSpotEntryMr,
            on_hold_subjects: r.on_hold_subjects,
            on_hold_subjectsMr: r.on_hold_subjectsMr,
            nextMeetingDateForOnHoldSubjects:
              r.nextMeetingDateForOnHoldSubjects,
            nameOfSuchak: r.nameOfSuchak,
            nameOfSuchakMr: r.nameOfSuchakMr,
            nameOfAnumodak: r.nameOfAnumodak,
            nameOfAnumodakMr: r.nameOfAnumodakMr,
            referenceByPersonName: r.referenceByPersonName,
            referenceByPersonNameMr: r.referenceByPersonNameMr,
            digitalSignature: r.digitalSignature,
            activeFlag: r.activeFlag,
            // subject:r.subject,
            // subjectSummary:r.subjectSummary,
          }))
        )
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [])

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
            .post(
              `${urls.MSURL}/trnMarkAttendanceProceedingAndPublish/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            }).catch((error) => {
              callCatchMethod(error, language);
            });
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
            .post(
              `${urls.MSURL}/trnMarkAttendanceProceedingAndPublish/save`,
              body
            )
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getlicenseTypeDetails()
                setButtonInputState(false)
              }
            }).catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe")
        }
      })
    }
  }

  // const agendaNo = watch("agendaNo");

  // const fetchData=async()=>{

  // const data = {agendaNo:1};
  //   const response= await axios.get('${urls.MSURL}/trnCirculateTheAgendaAndPublish/getByAgendaNo',{
  //      data: data,
  //   headers: {
  //      'Content-Type': 'text/plain'
  //   }
  // })
  //             console.log(response.data[0],"RESPONSE")
  //                 reset({
  //                    ...response.data[0],
  //                           agendaNo
  //                 })

  //           }

  // useEffect(  () => {
  //        fetchData();

  //  }, [])

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      headerAlign: "center",
      // flex: 1,
      width: 80,
    },
    {
      field: "agendaNo",
      headerName: "Agenda No.",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "attendanceCaptureFrom",
      headerName: "Attendance Capture Form",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "listOfConcernCommitteeMembers",
      headerName: "List of Concern Committee Members",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "selectDocketNo",
      headerName: "Docket No. ",
      headerAlign: "center",
      width: 100,
    },
    // {
    //   field:"docketNo",
    //   headerName:"Docket No.",
    //   headerAlign:"center",
    //   width:100,

    // },
    // {
    //   field:"subject",
    //   headerName:"Subject",
    //   headerAlign:"center",
    //   width:100,

    // },
    // {
    //   field:"subjectSummary",
    //   headerName:"Subject Summary",
    //   headerAlign:"center",
    //   width:100,

    // },
    {
      field: "addProceeding",
      headerName: "Add Proceeding/Verdict",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "addProceedingMr",
      headerName: "Add Proceeding/Verdict in marathi",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "proceedingDate",
      headerName: "Proceeding Date",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "onSpotEntry",
      headerName: "On Spot Entry",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "onSpotEntryMr",
      headerName: "On Spot Entry in marathi",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "on_hold_subjects",
      headerName: "On hold Subjects",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "on_hold_subjectsMr",
      headerName: "On hold Subjects in marathi",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "nextMeetingDateForOnHoldSubjects",
      headerName: "Next Meeting Date For Hold On Subject",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "nameOfSuchak",
      headerName: "Name Of Suchak",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "nameOfSuchakMr",
      headerName: "Name Of Suchak in marathi ",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "nameOfAnumodak",
      headerName: "Name Of Anumodak",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "nameOfAnumodakMr",
      headerName: "Name Of Anumodak in marathi",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "referenceByPersonName",
      headerName: "Reference By Person Name",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "referenceByPersonNameMr",
      headerName: "Reference By Person Name in marathi",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "digitalSignature",
      headerName: "Digital Signature",
      headerAlign: "center",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 120,
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
    // {
    //   field:"memberName",
    //   headerName:"Member Name",
    //   headerAlign:"center",
    //   width:100,

    // }, {
    //   field:"date",
    //   headerName:"Date",
    //   headerAlign:"center",
    //   width:100,

    // }, {
    //   field:"attendance",
    //   headerName:"Attendance",
    //   headerAlign:"center",
    //   width:100,

    // },
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
            Mark Attendance, Proceeding and Publish
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
                Mark Attendance, Proceeding and Publish
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
                            <TextField
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
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Attendance Capture Form
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label=" Attendance Capture Form *"
                                >
                                  <MenuItem value={1}>Form 1</MenuItem>
                                  <MenuItem value={2}>Form 2</MenuItem>
                                </Select>
                              )}
                              name="attendanceCaptureFrom"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="List of Concern Members "
                              {...register("listOfConcernCommitteeMembers")}
                              error={!!errors.listOfConcernCommitteeMembers}
                              helperText={
                                errors?.listOfConcernCommitteeMembers
                                  ? errors.listOfConcernCommitteeMembers.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Select Docket No."
                              type="number"
                              {...register("selectDocketNo")}
                              error={!!errors.selectDocketNo}
                              helperText={
                                errors?.selectDocketNo
                                  ? errors.selectDocketNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              control={control}
                              name="docketDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
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
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Subject
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Subject*"
                                >
                                  <MenuItem value={1}>Subject 1</MenuItem>
                                  <MenuItem value={2}>Subject 2</MenuItem>
                                </Select>
                              )}
                              name="subject"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Subject Summary
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Subject Summary*"
                                >
                                  <MenuItem value={1}>1</MenuItem>
                                  <MenuItem value={2}>2</MenuItem>
                                </Select>
                              )}
                              name="subjectSummary"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Add Proceeding/Verdict "
                              {...register("addProceeding")}
                              error={!!errors.addProceeding}
                              helperText={
                                errors?.addProceeding
                                  ? errors.addProceeding.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Add Proceeding/Verdict in Marathi "
                              {...register("addProceedingMr")}
                              error={!!errors.addProceedingMr}
                              helperText={
                                errors?.addProceedingMr
                                  ? errors.addProceedingMr.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              control={control}
                              name="proceedingDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Proceeding Date
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

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>

   <FormControl style={{ marginTop: 35 }}>
<Button type="button"
sx={{backgroundColor:"rgb(0, 132, 255) !important",color:"white !important"}}


size="large" variant="contained">On Spot Entry</Button>
</FormControl>
</Grid>

<Grid item xs={4} sm={4} md={4} lg={4} xl={4}>

   <FormControl style={{ marginTop: 35 }}>
<Button type="button"
sx={{backgroundColor:"rgb(0, 132, 255) !important",color:"white !important"}}


size="large" variant="contained">On Spot Entry (Mr)</Button>
</FormControl>
</Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 230 }}>
                            <FormControlLabel
                              label="On Spot Entry"
                              labelPlacement="start"
                              control={<Checkbox />}
                              {...register("onSpotEntry")}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 230 }}>
                            <FormControlLabel
                              label="On Spot Entry (Mr)"
                              labelPlacement="start"
                              control={<Checkbox />}
                              {...register("onSpotEntryMr")}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 230 }}>
                            <FormControlLabel
                              label="On Hold Subjects"
                              labelPlacement="start"
                              control={<Checkbox />}
                              {...register("on_hold_subjects")}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 230 }}>
                            <FormControlLabel
                              label="On Hold Subjects in Marathi"
                              labelPlacement="start"
                              control={<Checkbox />}
                              {...register("on_hold_subjectsMr")}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <Controller
                              control={control}
                              name="nextMeetingDateForOnHoldSubjects"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        Next Meeting Date For On Hold Subject
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
                              Name Of Suchak
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Name Of Suchak*"
                                >
                                  <MenuItem value={"Suchak1"}>
                                    Suchak 1
                                  </MenuItem>
                                  <MenuItem value={"Suchak2"}>
                                    Suchak 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="nameOfSuchak"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Name Of Suchak in Marathi
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Name Of Suchak*"
                                >
                                  <MenuItem value={" Suchak 1"}>
                                    Suchak 1
                                  </MenuItem>
                                  <MenuItem value={" Suchak 2"}>
                                    Suchak 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="nameOfSuchakMr"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Name Of Anumodak
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Name Of Anumodak*"
                                >
                                  <MenuItem value={"Anumodak 1"}>
                                    Anumodak 1
                                  </MenuItem>
                                  <MenuItem value={"Anumodak2"}>
                                    Anumodak 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="nameOfAnumodak"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Name Of Anumodak in Marathi
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Name Of Anumodak in Marathi*"
                                >
                                  <MenuItem value={"Anumodak1"}>
                                    Anumodak 1
                                  </MenuItem>
                                  <MenuItem value={"Anumodak2"}>
                                    Anumodak 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="nameOfAnumodakMr"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Reference By Person Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Reference By Person Name*"
                                >
                                  <MenuItem value={"Person Name 1"}>
                                    Person Name 1
                                  </MenuItem>
                                  <MenuItem value={"Person Name 2"}>
                                    Person Name 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="referenceByPersonName"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Reference By Person Name in Marathi
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Reference By Person Name in Marathi*"
                                >
                                  <MenuItem value={"Person Name 1"}>
                                    Person Name 1
                                  </MenuItem>
                                  <MenuItem value={"Person Name 2"}>
                                    Person Name 2
                                  </MenuItem>
                                </Select>
                              )}
                              name="referenceByPersonNameMr"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="Digital Signature"
                              {...register("digitalSignature")}
                              error={!!errors.digitalSignature}
                              helperText={
                                errors?.digitalSignature
                                  ? errors.digitalSignature.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35 }}>
                            <Button
                              sx={{
                                backgroundColor: "rgb(0, 132, 255) !important",
                                color: "white !important",
                              }}
                              disabled
                              size="large"
                              variant="contained"
                            >
                              Publish
                            </Button>
                          </FormControl>
                        </Grid>

                        {/* </Grid>
                      </div>
                   */}

                        {/* </div> */}
                        {/* </form>
              </FormProvider> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}></Grid>

                        {/* {isOpenCollapseNew && ( */}
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div
                            style={{
                              backgroundColor: "#0084ff",
                              color: "white",
                              fontSize: 19,
                              marginTop: 120,
                              marginBottom: 30,
                              padding: 8,
                              paddingLeft: 30,
                              marginLeft: "40px",
                              marginRight: "65px",
                              borderRadius: 100,
                            }}
                          >
                            Attendance Section
                            {/* <strong> Document Upload</strong> */}
                          </div>
                        </Grid>
                        {/* <FormProvider {...methods}> 
                <form
                //  onSubmit={handleSubmit(onSubmitForm)}
                 > */}
                        {/* <div className={styles.small} >
                    <div className={styles.maindiv}> */}
                        {/* <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        > */}
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              Member Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Committees *"
                                >
                                  <MenuItem value={1}>member1</MenuItem>
                                  <MenuItem value={2}>member2</MenuItem>
                                </Select>
                              )}
                              name="committee"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 230 }}>
                            <TextField
                              label="corporator No"
                              type="number"
                              {...register("corporatorNo")}
                              error={!!errors.corporatorNo}
                              helperText={
                                errors?.corporatorNo
                                  ? errors.corporatorNo.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

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
                          <FormControl style={{ marginTop: 25, width: 230 }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {" "}
                              Attendence
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Attendance*"
                                >
                                  <MenuItem value={1}>Present</MenuItem>
                                  <MenuItem value={2}>Absent</MenuItem>
                                </Select>
                              )}
                              name="attendance"
                              control={control}
                              defaultValue=""
                              className="mt-0"
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

export default MarkAttendanceProceeding
