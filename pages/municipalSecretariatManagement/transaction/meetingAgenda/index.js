import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import GroupIcon from "@mui/icons-material/Group"
import router from "next/router"
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import theme from "../../../../theme"
import { TimePicker } from "@mui/x-date-pickers"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/router"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [openDataGrid, setOpenDataGrid] = useState(false)
  const [showSaveButton, setshowSaveButton] = useState(true)
  const [comittees1, setcomittees1] = useState([])
  const [shirinkTF, setshirinkTF] = useState(false)
  const [agendaNo, setAgndNumber] = useState("")

  const [queryData, setQueryData] = useState({
    agendaNo: "",
    agendaDate: "",
    committeeId: 1,
  })

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const [data1, setData1] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const router = useRouter()

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

  // Get Table - Data
  const getAllAgendaNumbers = (_pageSize = 10, _pageNo = 0) => {
    let _agendaNo = watch("agendaNo").toString()
    console.log("1000", typeof _agendaNo)
    setAgndNumber(_agendaNo)

    axios
      .get(
        `${urls.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${_agendaNo}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        }
      )
      .then((res) => {
        // console.log('88', res.data.prepareMeetingAgenda[0])
        console.log(":88", res.status)
        // if (condition) {
        // }
        setQueryData({
          agendaNo: res?.data?.prepareMeetingAgenda[0]?.agendaNo,
          agendaDate: res?.data?.prepareMeetingAgenda[0]?.meetingDate,
          committeeId: res?.data?.prepareMeetingAgenda[0]?.committeeId,
        })
        let result = res.data?.prepareMeetingAgenda
        let _res = result?.map((val, i) => {
          console.log("44", val)
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            agendaDescription: val.agendaDescription,
            agendaNo: val.agendaNo,
            agendaOutwardDate: val.agendaOutwardDate,
            agendaOutwardNo: val.agendaOutwardNo,
            agendaSubject: val.agendaSubject,
            committeeId: val.committeeId,
            coveringLetterNote: val.coveringLetterNote,
            coveringLetterSubject: val.coveringLetterSubject,
            karyakramPatrikaNo: val.karyakramPatrikaNo,
            meetingDate: val.meetingDate,
            sabhavruttant: val.sabhavruttant,
            tip: val.tip,
            // fromDate: moment(val.fromDate).format("llll"),
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          }
        })

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
        {
          _res.length > 0 && setOpenDataGrid(!openDataGrid)
        }

        setshirinkTF(true)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
    // .catch((error) => {
    //   console.log(":44", error)
    //   if (error.request.status === 500) {
    //     swal(error.response.data.message, {
    //       icon: "error",
    //     })
    //   } else if (error.request.status === 404) {
    //     swal("Oops No Data Found!", {
    //       icon: "error",
    //     })
    //   }
    //   setOpenDataGrid(!openDataGrid)
    // })
  }

  // SECOND TABLE

  const getAllAgendaNumbers1 = (_pageSize = 10, _pageNo = 0) => {
    let _agendaNo = watch("agendaNo").toString()
    console.log("1000", typeof _agendaNo)

    axios
      .get(
        `${urls.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${_agendaNo}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        }
      )
      .then((res) => {
        console.log(";res", res)

        let result = res.data?.prepareMeetingAgenda
        let _res = result?.map((val, i) => {
          console.log("44", val)
          let tempObj = val.agendaSubjectDao.map((obj, i) => {
            return {
              departmentId1: obj.departmentId,
              id: obj.id,
              srNo1: i + 1,
              inwardOutwardDate1: obj.inwardOutwardDate,
              prepareMeetingAgenda1: obj.prepareMeetingAgenda,
              subject1: obj.subject,
              subjectSerialNumber1: obj.subjectSerialNumber,
              subjectSummary1: obj.subjectSummary,
            }
          })
          return tempObj
        })

        console.log("123456789", _res[0])

        setData1({
          rows: _res[0],
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
        setOpenDataGrid(!openDataGrid)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (data.rows.length > 0) {
      // alert("hi")

      data.rows?.map((obj) => {
        let committeeName1 = comittees1?.find(
          (ob) => ob.id === obj.committeeId
        )?.comittee
        setValue("agendaDescription", obj.agendaDescription)
        //   setValue("agendaNo", obj.agendaNo)
        setValue(
          "agendaOutwardDate",
          moment(obj.agendaOutwardDate).format("YYYY-MM-DD")
        )
        setValue("agendaOutwardNo", obj.agendaOutwardNo)
        setValue("agendaSubject", obj.agendaSubject)
        setValue("committeeId", committeeName1)
        setValue("coveringLetterNote", obj.coveringLetterNote)
        setValue("coveringLetterSubject", obj.coveringLetterSubject)
        setValue("karyakramPatrikaNo", obj.karyakramPatrikaNo)
        setValue("meetingDate", obj.meetingDate)
        setValue("sabhavruttant", obj.sabhavruttant)
        setValue("tip", obj.tip)
        console.log("...562", obj)
        setshowSaveButton(false)
      })
    } else {
      setshowSaveButton(true)
    }
  }, [data.rows])

  console.log("....7485", data)

  useEffect(() => {
    if (data.rows.length !== 0) {
      // alert("gaya")
      setSlideChecked(true)
      setIsOpenCollapse(true)
    } else if (watch("agendaNo") && data.rows.length === 0) {
      sweetAlert({
        title: "Oops! No data match",
        text: "Try with another Agenda Number",
        icon: "warning",
        // buttons: ["Ok"],
        dangerMode: true,
      })
      reset()
      setSlideChecked(false)
      setIsOpenCollapse(false)
      setshirinkTF(false)
      setAgndNumber("")
      // setshowSaveButton(false)
    }
  }, [openDataGrid])

  // .............>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<

  // useEffect(() => {
  //   if (
  //     watch("agendaNo") &&
  //     watch("meetingPlace") &&
  //     watch("meetingDate") &&
  //     watch("meetingTime") &&
  //     watch("description")
  //   ) {
  //     alert("hi")
  //     console.log(".....1452", data1)
  //     // setshowSaveButton(false)

  //   }
  // }, [
  //   watch("agendaDescription"),
  //   watch("agendaNo"),
  //   watch("agendaOutwardDate"),
  //   watch("agendaOutwardNo"),
  //   watch("agendaSubject"),
  //   watch("committeeId"),
  //   watch("coveringLetterNote"),
  //   watch("coveringLetterSubject"),
  //   watch("karyakramPatrikaNo"),
  //   watch("meetingDate"),
  //   watch("sabhavruttant"),
  //   watch("tip"),
  // ])

  // .............>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");
    console.log("form Data", formData)

    const meetingDate = moment(formData.meetingDate).format("YYYY-MM-DD")
    const meetingTime = moment(formData.meetingTime).format("hh:mm")

    const finalBodyForApi = {
      ...formData,
      meetingDate,
      meetingTime,
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      activeFlag: "Y",
    }

    console.log("420", finalBodyForApi)

    axios
      .post(`${urls.MSURL}/trnMeetingSchedule/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")

          setButtonInputState(false)
          setSlideChecked(false)
          setIsOpenCollapse(!isOpenCollapse)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
          cancellButton()
        }
      })
      .catch((error) => {
        // if (error.request.status === 500) {
        //   swal(error.response.data.message, {
        //     icon: "error",
        //   });
        //   setButtonInputState(false);
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   });
        //   setButtonInputState(false);
        // }
        callCatchMethod(error, language)
        setButtonInputState(false)
        // console.log("error", error);
      })
  }

  //   ............................>>>>>>>>>> AGENDA DATA <<<<<<<<<.........................

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

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(true)
    setIsOpenCollapse(true)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
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
    agendaDescription: "",
    agendaNo: "",
    agendaOutwardNo: "",
    agendaSubject: "",
    committeeId: "",
    coveringLetterNote: "",
    coveringLetterSubject: "",
    karyakramPatrikaNo: "",
    sabhavruttant: "",
    tip: "",
    agendaOutwardDate: null,
    meetingDate: null,
    meetingPlace: "",
    description: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    agendaDescription: "",
    agendaNo: "",
    agendaOutwardNo: "",
    agendaSubject: "",
    committeeId: "",
    coveringLetterNote: "",
    coveringLetterSubject: "",
    karyakramPatrikaNo: "",
    sabhavruttant: "",
    tip: "",
    agendaOutwardDate: null,
    meetingDate: null,
    id: null,
  }

  // USE  EFFECT

  // useEffect(() => {
  //   if (
  //     watch("agendaNo") &&
  //     watch("meetingPlace") &&
  //     watch("meetingDate") &&
  //     watch("meetingTime") &&
  //     watch("description")
  //   ) {
  //     // alert("hi")
  //     console.log(".....1452", data1)
  //     setshowSaveButton(false)
  //   }
  // }, [
  //   watch("agendaNo"),
  //   watch("meetingPlace"),
  //   watch("meetingDate"),
  //   watch("meetingTime"),
  //   watch("description"),
  // ])

  const columns = [
    {
      field: "srNo1",
      headerName: "Sr.No",
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    // { field: "srNo1", headerName: "Sr.No" },
    {
      field: "inwardOutwardDate1",
      // headerName: <FormattedLabel id="amenities" />,
      headerName: "Inward Outward Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "prepareMeetingAgenda1",
      headerName: "Prepare Meeting Agenda1",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subject1",
      // headerName: <FormattedLabel id="agendaDescription" />,
      headerName: "Subject",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSerialNumber1",
      // headerName: <FormattedLabel id="committeeId" />,
      headerName: "Subject Serial Number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subjectSummary1",
      // headerName: <FormattedLabel id="meetingDate" />,
      headerName: "Subject Summary",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "agendaOutwardDate",
    //   // headerName: <FormattedLabel id="agendaOutwardDate" />,
    //   headerName: "Agenda Outward Date",
    // },
    // { field: "status", headerName: <FormattedLabel id="status" /> },
    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   minWidth: 140,
    // maxWidth: 200,
    // headerAlign: "center",
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setBtnSaveTextMr("अद्यतन"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true)
    //             setButtonInputState(true)
    //             console.log("params.row: ", params.row)
    //             reset(params.row)
    //           }}
    //         >
    //           <EditIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Update"),
    //               setBtnSaveTextMr("अद्यतन"),
    //               setID(params.row.id),
    //               //   setIsOpenCollapse(true),
    //               setSlideChecked(true)
    //             setButtonInputState(true)
    //             console.log("params.row: ", params.row)
    //             reset(params.row)
    //           }}
    //         >
    //           {params.row.activeFlag == "Y" ? (
    //             <ToggleOnIcon
    //               style={{ color: "green", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "N")}
    //             />
    //           ) : (
    //             <ToggleOffIcon
    //               style={{ color: "red", fontSize: 30 }}
    //               onClick={() => deleteById(params.id, "Y")}
    //             />
    //           )}
    //         </IconButton>
    //       </>
    //     )
    //   },
    // },
  ]

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
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
                width: "80%",
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
                {/* <FormattedLabel id="amenitiesMaster" /> */}
                Meeting Agenda
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          <div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
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
                  md={12}
                  lg={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 25,
                  }}
                >
                  <TextField
                    autoFocus
                    // onTouchCancel={alert("chora")}
                    // onInputCapture={() => alert("capture")}
                    // onAbort={alert("capture")}
                    // InputLabelProps={{ shrink: temp }}
                    style={{ backgroundColor: "white", width: "25vw" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Agenda No"
                    placeholder="Please Enter The Agenda Number"
                    // variant="outlined"
                    variant="standard"
                    // InputProps={{
                    //   startAdornment: (
                    //     <InputAdornment position="end">
                    //       <IconButton
                    //         type="button"
                    //         onClick={() => {
                    //           getAllAgendaNumbers()
                    //           getAllAgendaNumbers1()
                    //         }}
                    //         style={{
                    //           // width: "32vw",
                    //           background: "none",
                    //         }}
                    //         edge="start"
                    //       >
                    //         <SearchIcon style={{ color: "blue" }} />
                    //       </IconButton>
                    //     </InputAdornment>
                    //   ),
                    // }}
                    {...register("agendaNo")}
                    error={!!errors.agendaNo}
                    helperText={
                      errors?.agendaNo ? errors.agendaNo.message : null
                    }
                  />
                  {/* {watch("agendaNo") && ( */}
                  <Button
                    type="button"
                    size="small"
                    style={{
                      // backgroundColor: "antiquewhite",
                      // color: "blue",
                      // outlineColor: "transparent",
                      // boxShadow: "none",
                      borderRadius: "20px",
                    }}
                    onClick={() => {
                      if (watch("agendaNo")) {
                        getAllAgendaNumbers()
                        getAllAgendaNumbers1()
                      } else {
                        sweetAlert("Please Enter The Agneda Number first!")
                      }
                    }}
                  >
                    Search
                  </Button>
                  {/* )} */}
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
                    // label={<FormattedLabel id="amenities" />}
                    label="Committee Name"
                    // value={
                    //   comittees1?.find(
                    //     (obj) => obj.id === Number(watch("committeeId"))
                    //   )?.committee
                    // }
                    InputLabelProps={{ shrink: shirinkTF }}
                    // value={
                    //   comittees1.find((c) => c.id == watch("committeeId"))
                    //     ?.comittee
                    // }
                    variant="outlined"
                    {...register("committeeId")}
                    error={!!errors.committeeName}
                    helperText={
                      errors?.committeeName
                        ? errors.committeeName.message
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
                                {/* <FormattedLabel id="meetingDate" /> */}
                                Agenda Date
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
                                variant="outlined"
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
                      {errors?.meetingDate ? errors.meetingDate.message : null}
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
                    // label={<FormattedLabel id="amenities" />}
                    label="Karyakram Patrika No."
                    variant="outlined"
                    {...register("karyakramPatrikaNo")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.karyakramPatrikaNo}
                    helperText={
                      errors?.karyakramPatrikaNo
                        ? errors.karyakramPatrikaNo.message
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
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Agenda Subject"
                    variant="outlined"
                    {...register("agendaSubject")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.agendaSubject}
                    helperText={
                      errors?.agendaSubject
                        ? errors.agendaSubject.message
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
                    error={!!errors.agendaOutwardDate}
                  >
                    <Controller
                      control={control}
                      name="agendaOutwardDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                {/* <FormattedLabel id="toDate" /> */}
                                Agenda Outward Date
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
                                variant="outlined"
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
                      {errors?.agendaOutwardDate
                        ? errors.agendaOutwardDate.message
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
                    // label={<FormattedLabel id="amenities" />}
                    label="Agenda Outward No."
                    variant="outlined"
                    {...register("agendaOutwardNo")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.agendaOutwardNo}
                    helperText={
                      errors?.agendaOutwardNo
                        ? errors.agendaOutwardNo.message
                        : null
                    }
                  />
                </Grid>

                {/* .....................................Letter Subject................................... */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Covering Letter Subject"
                    variant="outlined"
                    multiline
                    rows={3}
                    minRows={2}
                    {...register("coveringLetterSubject")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.coveringLetterSubject}
                    helperText={
                      errors?.coveringLetterSubject
                        ? errors.coveringLetterSubject.message
                        : null
                    }
                  />
                </Grid>

                {/* .....................................Letter Subject Note................................... */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Covering Letter Note"
                    variant="outlined"
                    multiline
                    rows={3}
                    minRows={2}
                    {...register("coveringLetterNote")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.coveringLetterNote}
                    helperText={
                      errors?.coveringLetterNote
                        ? errors.coveringLetterNote.message
                        : null
                    }
                  />
                </Grid>

                {/* .....................................Agenda Description................................... */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Agenda Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    minRows={2}
                    {...register("agendaDescription")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.agendaDescription}
                    helperText={
                      errors?.agendaDescription
                        ? errors.agendaDescription.message
                        : null
                    }
                  />
                </Grid>

                {/* .....................................Tip................................... */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Tip"
                    variant="outlined"
                    multiline
                    rows={3}
                    minRows={2}
                    {...register("tip")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.tip}
                    helperText={errors?.tip ? errors.tip.message : null}
                  />
                </Grid>

                {/* .....................................Sabhavruttant................................... */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    disabled
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label={<FormattedLabel id="amenities" />}
                    label="Sabhavruttant"
                    variant="outlined"
                    multiline
                    rows={3}
                    minRows={2}
                    {...register("sabhavruttant")}
                    InputLabelProps={{ shrink: shirinkTF }}
                    error={!!errors.sabhavruttant}
                    helperText={
                      errors?.sabhavruttant
                        ? errors.sabhavruttant.message
                        : null
                    }
                  />
                </Grid>
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
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Button
                    // sx={{ marginRight: 8 }}
                    disabled={showSaveButton}
                    type='submit'
                    variant='contained'
                    color='success'
                    endIcon={<SaveIcon />}
                    style={{ borderRadius: '20px' }}
                    size='small'
                  >
                    Save
                  </Button> */}
                  <Button
                    variant="contained"
                    endIcon={<GroupIcon />}
                    onClick={() => {
                      router.push({
                        pathname:
                          "/municipalSecretariatManagement/transaction/markAttendance",
                        query: queryData,
                      })
                    }}
                  >
                    {/* <FormattedLabel id='save' /> */}
                    Mark Attendance
                  </Button>
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
                  {agendaNo && (
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/municipalSecretariatManagement/transaction/newDocketEntry/additionalDocket",
                          query: { agendaNo },
                        })
                      }
                      style={{ borderRadius: "20px" }}
                      size="small"
                    >
                      {/* {<FormattedLabel id="clear" />} */}
                      Add New Docket
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </div>

          {/* <Grid
            container
            style={{ padding: "10px" }}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
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
                  setDeleteButtonState(true)
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
          </Grid> */}

          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Box
                style={{ height: "auto", overflow: "auto", padding: "10px" }}
              >
                <DataGrid
                  sx={{
                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {
                      // backgroundColor:'red',
                      // height: '800px !important',
                      // display: "flex",
                      // flexDirection: "column-reverse",
                      // overflow:'auto !important'
                    },
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  disableColumnFilter
                  disableColumnSelector
                  disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      disableExport: true,
                      disableToolbarButton: true,
                      csvOptions: { disableToolbarButton: true },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  density="compact"
                  autoHeight={true}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data1?.totalRows}
                  rowsPerPageOptions={data1?.rowsPerPageOptions}
                  page={data1?.page}
                  pageSize={data1?.pageSize}
                  rows={data1?.rows || []}
                  columns={columns}
                  onPageChange={(_data) => {
                    getAllAgendaNumbers(data1?.pageSize, _data)
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data)
                    // updateData("page", 1);
                    getAllAgendaNumbers(_data, data1?.page)
                  }}
                />
              </Box>
            </Slide>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
