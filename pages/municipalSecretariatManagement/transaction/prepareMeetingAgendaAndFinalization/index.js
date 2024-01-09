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
  Slide,
} from "@mui/material"
import { parse } from "date-fns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import PreviewIcon from "@mui/icons-material/Preview"
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
import urls from "../../../../URLS/urls"
import moment from "moment"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/TrnprepareMeetingAgendaAndFinalizationSchema"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../util/util"

let drawerWidth

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
)

const PrepareMeetingAgenda = () => {
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
    // resolver: yupResolver(Schema),
    mode: "onChange",
  })

  const language = useSelector((state) => state?.labels.language)
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

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [data, setData] = useState({
    rows: [],
  })

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

  const [offices1, setoffices1] = useState([])

  const getoffices1 = () => {
    axios
      .get(`${urls.MSURL}/mstDefineOfficeDetails/getAll`)
      .then((r) => {
        setoffices1(
          r.data.defineOfficeDetails.map((row) => ({
            id: row.id,
            office: row.office,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const [departments1, setDepartments1] = useState([])

  const getdepartments1 = () => {
    axios
      .get(`${urls.BaseURL}/department/getAll`)
      .then((r) => {
        setDepartments1(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    getcomittees1()
    getoffices1()
    getdepartments1()
  }, [])

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails()
  }, [])

  // Get Table - Data
  const getlicenseTypeDetails = async () => {
    console.log("getLIC ----")
    await axios
      .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getAll`)
      .then(async (res) => {
        let result = await res.data.prepareMeetingAgenda
        console.log(result, "GET")
        let _res = await result.map((r, i) => {
          return {
            id: r.id,
            srNo: i + 1,
            subject: r.subject,
            fromDate: r.fromDate,
            toDate: r.toDate,
            officeName: r.officeName,
            departmentId: r.departmentId,
            committeeId: r.committeeId,
            docketNo: r.docketNo,
            docketDate: r.docketDate,
            subjectSummary: r.subjectSummary,
            uploadDocument: r.uploadDocument?.toString(),
            reasonForRevert: r.reasonForRevert,
            remark: r.remark,
            digitalSignature: r.digitalSignature,
            activeFlag: r.activeFlag,
          }
        })
        setData({
          rows: _res,
        })
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  const toDate = watch("toDate")
  const fromDate = watch("fromDate")
  const officeName = watch("officeName")
  const departmentId = watch("departmentId")
  const committeeId = watch("committeeId")
  const formattedFromDate = moment(fromDate).format("YYYY-MM-DD")
  const formattedToDate = moment(toDate).format("YYYY-MM-DD")

  const fetchData = async () => {
    const response = await axios.get(
      "${urls.MSURL}/trnPrepareMeetingAgenda/getByDocketNo",
      {
        params: {
          fromDate: encodeURIComponent(formattedFromDate),
          toDate: encodeURIComponent(formattedToDate),
          officeName: officeName,
          departmentId: departmentId,
          committeeId: committeeId,
        },
      }
    )
    console.log(response.data[0], "RESPONSE")
    reset({
      ...response.data[0],
      toDate: formattedToDate,
      fromDate: formattedFromDate,
      officeName: officeName,
      departmentId: departmentId,
      committeeId: committeeId,
    })
  }

  useEffect(() => {
    fetchData()
  }, [toDate, fromDate, officeName, departmentId, committeeId])

  // Reset Values Cancell
  const resetValuesCancell = {
    id: "",
    subject: "",
    fromDate: null,
    toDate: null,
    officeName: "",
    departmentId: "",
    committeeId: "",
    docketNo: "",
    docketDate: null,
    subjectSummary: "",
    uploadDocument: "",
    reasonForRevert: "",
    remark: "",
    digitalSignature: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    id: "",
    subject: "",
    fromDate: null,
    toDate: null,
    officeName: "",
    departmentId: "",
    committeeId: "",
    docketNo: "",
    docketDate: null,
    subjectSummary: "",
    uploadDocument: "",
    reasonForRevert: "",
    remark: "",
    digitalSignature: "",
  }

  // OnSubmit Form
  const onSubmitForm = async (formData) => {
    const docketDate = await moment(formData.docketDate).format("YYYY-MM-DD")
    const fromDate = await moment(formData.fromDate).format("YYYY-MM-DD")
    const toDate = await moment(formData.toDate).format("YYYY-MM-DD")
    // const revert =await formData?.revert;
    // const approvedAndSubmittedForAgenda =await formData?.approvedAndSubmittedForAgenda?.toString();

    const uploadDocument = formData.uploadDocument.toString()
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      docketDate,
      toDate,
      uploadDocument,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }
    console.log(finalBodyForApi, "SUBMIT")
    const finalBodyForApiPut = {
      ...finalBodyForApi,
      // id:id,
    }
    delete finalBodyForApiPut.srNo
    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      await axios
        .post(
          `${urls.MSURL}/trnPrepareMeetingAgenda/save`,

          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put-----", finalBodyForApiPut)
      await axios
        .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, finalBodyForApiPut)
        .then((res) => {
          console.log(res, "PUTT")
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success")
            getlicenseTypeDetails()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            reset()
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
            .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, body)
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
            .post(`${urls.MSURL}/trnPrepareMeetingAgenda/save`, body)
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
      // flex: 1,
      align: "center",
      width: 80,
    },
    {
      field: "subject",
      headerName: "Subject",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 180,
    },
    {
      field: "fromDate",
      headerName: "From date",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "toDate",
      headerName: "To Date",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "officeName",
      headerName: "OfficeName",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 155,
    },
    {
      field: "departmentId",
      headerName: "Department Name",
      align: "center",
      headerAlign: "center",
      // type: "string",
      // flex: 1,
      width: 155,
    },
    {
      field: "committeeId",
      headerName: "Committee Name",
      align: "center",
      headerAlign: "center",
      // type: "string",
      // flex: 1,
      width: 155,
    },
    {
      field: "docketNo",
      headerName: "Docket No./Subject No.",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 125,
    },
    {
      field: "docketDate",
      headerName: "Docket Date",
      align: "center",
      headerAlign: "center",
      // type: "date",
      // flex: 1,
      width: 140,
      // width:"150px"
    },

    {
      field: "subjectSummary",
      headerName: "Subject Summary",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 190,
    },

    {
      field: "uploadDocument",
      headerName: "Uploaded Document",
      align: "center",
      headerAlign: "center",
      width: 180,
    },

    // {
    //   field: "approvedAndSubmittedForAgenda",
    //   headerName: "Approved and Submitted",
    //   align:"center",
    //   // type: "number",
    //   // flex: 1,
    //   headerAlign:"center",
    //   width: 210

    // },
    // {
    //   field: "revert",
    //   headerName: "Revert/Referred back to concern department",
    //   align:"center",
    //   // type: "number",
    //   // flex: 1,
    //   headerAlign:"center",
    //   width: 165
    // },
    {
      field: "reasonForRevert",
      headerName: "Reason For Revert/Reffered Back",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 250,
    },
    {
      field: "remark",
      headerName: "Remark",
      // type: "number",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },

    {
      field: "digitalSignature",
      headerName: "Digital Signature",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "action",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
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
  ]

  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <Card>
          {!isOpenCollapse && (
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
              Prepare Meeting Agenda And Finalization
              {/* <strong> Document Upload</strong> */}
            </div>
          )}
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
                Prepare Meeting Agenda And Finalization
                {/* <strong> Document Upload</strong> */}
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.maindiv}>
                      <Grid
                        container
                        sx={{
                          marginLeft: 0,
                          marginTop: 2,
                          marginBottom: 5,
                          align: "center",
                        }}
                      >
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 5, width: 185 }}>
                            <b>
                              <TextField
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                inputProps={{ readOnly: true }}
                                label="Subject"
                                {...register("subject")}
                                error={!!errors.subject}
                                helperText={
                                  errors?.subject
                                    ? errors.subject.message
                                    : null
                                }
                              />
                            </b>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 5, width: 230 }}>
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
                          <FormControl style={{ marginTop: 5, width: 185 }}>
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
                          <FormControl
                            sx={{ marginTop: 4, width: 230 }}
                            error={!!errors.officeName}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Office Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Office Name*"
                                >
                                  {offices1 &&
                                    offices1.map((office, index) => (
                                      <MenuItem key={index} value={office.id}>
                                        {office.office}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="officeName"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl
                            sx={{ marginTop: 4, minWidth: 210 }}
                            error={!!errors.departmentId}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Select department
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select departments *"
                                >
                                  {departments1 &&
                                    departments1.map((department, index) => (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
                                        {department.department}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="departmentId"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ marginTop: 4, width: 230 }}>
                            <b>
                              <TextField
                                inputProps={{ readOnly: true }}
                                label="Docket No."
                                // type="number"
                                // {...register("docket")}
                                {...register("docketNo")}
                                // error={!!errors.docket}
                                //           helperText={
                                //             errors?.docket
                                //               ? errors.docket.message
                                //               : null
                                //           }
                                // helperText="Please enter Docket No."
                              />
                            </b>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 185 }}>
                            <Controller
                              control={control}
                              name="docketDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputProps={{ readOnly: true }}
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

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    
                    </Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="subject summary"
                              {...register("subjectSummary")}
                              error={!!errors.subjectSummary}
                              helperText={
                                errors?.subjectSummary
                                  ? errors.subjectSummary.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl
                            sx={{ marginTop: 3, minWidth: 210 }}
                            error={!!errors.committeeId}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Select Committees
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select committee*"
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
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              inputProps={{ readOnly: true }}
                              label="Upload Document*"
                              {...register("uploadDocument")}
                              // error={!!errors.verifyUploadedDocument}
                              //           helperText={
                              //             errors?.verifyUploadedDocument
                              //               ? errors.verifyUploadedDocument.message
                              //               : null
                              //           }
                            />
                          </FormControl>
                        </Grid>
                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 20 ,width :185}}>
<label style={{display:"flex",height: 25}} htmlFor="myfile"> &ensp; Upload Document<p style={{color:"red"}}>*</p></label>
<FormControl sx={{display:"flex",flexDirection:"column-reverse",width:210,border:1,padding:1.5, borderColor:"rgba(133, 133, 133,0.6)",borderRadius:1,'&:hover':{borderColor:"rgb(133, 133, 133)"}}}>

<input type="file" id="myfile" name="myfile" />
</FormControl>

</FormControl> 
</Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ pt: 15, pb: 2 }}>
                            <Button
                              sx={{
                                backgroundColor: "rgb(0, 132, 255) !important",
                                color: "white !important",
                              }}
                              disabled
                              size="large"
                              variant="contained"
                            >
                              Approval Section
                            </Button>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}></Grid>

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 35 ,width :230}}>
<FormControlLabel label="Approved and Submitted for Agenda" 
labelPlacement="start" 
control={<Checkbox  />} 
{...register("approvedAndSubmittedForAgenda")}  />
                        </FormControl>
                        </Grid>
                        
                        
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 35 ,width :230}}>
<FormControlLabel label="Revert/Reffered back to concern department" 
labelPlacement="start" 
control={<Checkbox  />} 
{...register("revert")}  />
                        </FormControl>
                        </Grid> */}

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              label="agendaNo*"
                              {...register("agendaNo")}
                              // error={!!errors.agendaNo}
                              //           helperText={
                              //             errors?.agendaNo
                              //               ? errors.agendaNo.message
                              //               : null
                              //           }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              label="Reason for revert/referred back*"
                              {...register("reasonForRevert")}
                              error={!!errors.reasonForRevert}
                              helperText={
                                errors?.reasonForRevert
                                  ? errors.reasonForRevert.message
                                  : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              label="Remark*"
                              {...register("remark")}
                              error={!!errors.remark}
                              helperText={
                                errors?.remark ? errors.remark.message : null
                              }
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              label="Digital Signature*"
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
                reset({
                  ...resetValuesExit,
                })
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
                // rows={dataSource}
                rows={data.rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
            </div>
          </div>
        </Paper>
      </BasicLayout>
    </div>
  )
}

export default PrepareMeetingAgenda
