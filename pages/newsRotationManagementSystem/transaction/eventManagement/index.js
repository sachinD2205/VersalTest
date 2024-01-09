// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import EditIcon from "@mui/icons-material/Edit"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import theme from "../../../../theme"
import VisibilityIcon from "@mui/icons-material/Visibility"
import axios from "axios"
import urls from "../../../../URLS/urls"
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import moment from "moment"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import FileTable from "../../../../components/newsRotationManagementSystem/FileUpload/FileTable"
import schema from "../../../../containers/schema/newsRotationManagementSystem/eventManagement"
import { yupResolver } from "@hookform/resolvers/yup"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import Loader from "../../../../containers/Layout/components/Loader"
import { DeleteRounded } from "@mui/icons-material"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const EventManagement = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [rotationGroup, setRotationGroup] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)
  const router = useRouter()

  const [departments, setDepartments] = useState([])
  const [eventManagements, setEventManagements] = useState([])
  const language = useSelector((state) => state.labels.language)
  const [authorizedToUpload, setAuthorizedToUpload] = useState(true)
  const [attachedFile, setAttachedFile] = useState("")
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [mainFiles, setMainFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [finalFiles, setFinalFiles] = useState([])
  const [nextEventNumber, setNextEventNumber] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(false)
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
  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles])
  }, [mainFiles, additionalFiles])

  const userToken = useGetToken()

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  useEffect(() => {
    getDepartment()
    getNextEventNumber()
  }, [])

  useEffect(() => {
    if (departments.length > 0) {
      getEventManagement()
    }
  }, [departments])

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },

    {
      field: "eventNumber",
      headerName: <FormattedLabel id="eventNumber" />,
      flex: 1,
    },
    {
      field: "departmentKey",
      headerName: <FormattedLabel id="department" />,
      flex: 1,
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      flex: 1,
    },
    {
      field: "eventTime",
      headerName: <FormattedLabel id="eventTime" />,
      flex: 1,
    },
    {
      field: "eventDescription",
      headerName: <FormattedLabel id="eventDescription" />,
      flex: 1,
    },
    {
      field: "eventLocationLat",
      headerName: <FormattedLabel id="eventLocationLat" />,
      flex: 1,
    },
    {
      field: "eventLocationLong",
      headerName: <FormattedLabel id="eventLocationLong" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
                console.log("params.row: ", params.row, params?.row?.eventTime)
                reset(params.row)
                setAdditionalFiles(
                  params?.row?.eventManagementAttachments?.map(
                    (item, index) => {
                      return {
                        ...item,
                        srNo: index,
                        originalFileName: item.fileName,
                        uploadedBy: item.attachedNameEn,
                      }
                    }
                  )
                )
                setValue("departmentKey", params?.row?._departmentKey)
                setValue(
                  "eventDate",
                  moment(params?.row?.eventDate, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                )
                setValue("eventTime", `2023-04-23T${params?.row?.eventTime}`)
                // hh:mm:ss a
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              color="primary"
              disabled={editButtonInputState}
              onClick={() => {
                setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
                console.log(
                  "params.row: 988",
                  params.row,
                  params?.row?.eventTime
                )
                reset(params.row)
                setAdditionalFiles(
                  params?.row?.eventManagementAttachments?.map(
                    (item, index) => {
                      return {
                        ...item,
                        srNo: index,
                        originalFileName: item.fileName,
                        uploadedBy: item.attachedNameEn,
                      }
                    }
                  )
                )
                setValue("departmentKey", params?.row?._departmentKey)
                setViewOnly(true)
                setValue(
                  "eventDate",
                  moment(params?.row?.eventDate, "DD/MM/YYYY").format(
                    "YYYY-MM-DD"
                  )
                )
                setValue("eventTime", `2023-04-23T${params?.row?.eventTime}`)
                // hh:mm:ss a
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                )
              }}
            >
              <VisibilityIcon />
            </IconButton>

            {!viewOnly ? (
              <IconButton
                color="primary"
                onClick={() => {
                  axios
                    .delete(
                      `${urls.CFCURL}/file/discard?filePath=${record.row.filePath}`,
                      {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      }
                    )
                    .then((res) => {
                      console.log("finallllll", finalFiles)
                      let tempa = additionalFiles.filter(
                        (obj) => obj.filePath !== record.row.filePath
                      )
                      setAdditionalFiles(tempa)
                      swal(
                        language === "en" ? "Deleted!" : "हटवले!",
                        language === "en"
                          ? "Record Deleted successfully !"
                          : "रेकॉर्ड यशस्वीरित्या हटवले",
                        "success",
                        { button: language === "en" ? "Ok" : "ठीक आहे" }
                      )
                    })
                    .catch((error) => {
                      callCatchMethod(error, language);
                    })
                }}
              >
                <DeleteRounded />
              </IconButton>
            ) : (
              ""
            )}
          </>
        )
      },
    },
  ]

  // get department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDepartments(res.data.department)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // get EventManagement
  const getEventManagement = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setIsLoading(true)
    axios
      .get(`${urls.NRMS}/trnEventManagement/getAll`, {
        // .get(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnEventManagement/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        let resp = res?.data?.trnEventManagementList
        let _res = resp?.map((val, id) => {
          return {
            activeFlag: val.activeFlag,
            srNo: id + 1 + _pageNo * _pageSize,
            eventNumber: val.eventNumber ? val.eventNumber : "-",
            departmentKey: val.departmentKey
              ? departments.find((item) => item?.id == val?.departmentKey)
                  ?.department
              : "-",
            _departmentKey: val.departmentKey,
            id: val.id,
            eventDescription: val.eventDescription,
            eventDate: val?.eventDate
              ? moment(val.eventDate).format("DD/MM/YYYY")
              : "-",
            eventTime: val?.eventTime ? val?.eventTime : "-",
            eventLocationLat: val.eventLocationLat,
            eventLocationLong: val.eventLocationLong,
            eventManagementAttachments: val.eventManagementAttachments,
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

        setEventManagements(res?.data?.trnEventManagementList)
        getNextEventNumber()
        setIsLoading(false)

        console.log("eventManagement getAll", res)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // get EventManagement by Id
  const getEventManagementById = (id) => {
    axios
      .get(`${urls.NRMS}/trnEventManagement/getById`, {
        params: {
          id: id,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setEventManagements(res?.data?.trnEventManagementList)
        console.log("eventManagement by id", res)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNextEventNumber = () => {
    axios
      .get(`${urls.NRMS}/trnEventManagement/getNextEventNo`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // axios.get(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnEventManagement/getNextEventNo`).then((r) => {
        console.log("Nex Entry Number", r)
        setNextEventNumber(r.data)
        setValue("eventNumber", r.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    subGroupName: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    subGroupName: "",

    id: null,
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
    setAdditionalFiles([])
    if (viewOnly) {
      setViewOnly(false)
    }
  }

  const onSubmitForm = (formData) => {
    // Save - DB
    console.log("formData", formData)
    let _body = {
      ...formData,
      eventDate: moment(formData?.eventDate).format("YYYY-MM-DD"),
      eventTime: moment(formData?.eventTime).format("HH:mm:ss"),
      eventNumber: nextEventNumber,
      eventManagementAttachments: finalFiles,
    }
    let updateBody = {
      ...formData,
      eventDate: moment(formData?.eventDate).format("YYYY-MM-DD"),
      eventTime: moment(formData?.eventTime).format("HH:mm:ss"),
      eventNumber: nextEventNumber,
      eventManagementAttachments: finalFiles,
    }
    console.log("btnSaveText", btnSaveText)
    if (btnSaveText === "Save") {
      console.log("_body", _body)
      setIsLoading(true)
      axios
        .post(`${urls.NRMS}/trnEventManagement/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          // axios.post(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnEventManagement/save`, _body).then((res) => {
          console.log("res---", res)
          setIsLoading(false)
          if (res.status == 201) {
            getEventManagement()
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
            exitButton()
            setAdditionalFiles([])
          }
        })
        .catch((error) => {
          setIsLoading(false)
         callCatchMethod(error, language);
     
        })
    } else if (btnSaveText == "Update") {
      console.log("updateBody", updateBody)
      setIsLoading(true)
      axios
        .post(`${urls.NRMS}/trnEventManagement/save`, updateBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          // axios.post(`http://192.168.68.145:9004/newsRotationManagementSystem/api/trnEventManagement/save`, updateBody).then((res) => {
          console.log("res---", res)
          setIsLoading(false)
          if (res.status == 201) {
            getEventManagement()
            exitButton()
            setAdditionalFiles([])
            sweetAlert(
              language === "en" ? "Updated!" : "अपडेट केले!",
              language === "en"
                ? "Record Updated successfully!"
                : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
          }
        })
        .catch((error) => {
          setIsLoading(false)
          callCatchMethod(error, language);

        })
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <>
            <BreadcrumbComponent />
          </>
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
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
                <FormattedLabel id="eventManagement" />
              </h2>
            </Box>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            fullWidth
                            sx={{ width: "80%" }}
                            label={<FormattedLabel id="eventNumber" />}
                            id="standard-basic"
                            variant="standard"
                            disabled
                            value={nextEventNumber}
                            {...register("eventNumber")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.eventNumber}
                            InputProps={{ style: { fontSize: 18 } }}
                            helperText={
                              errors?.eventNumber
                                ? errors.eventNumber.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "80%",
                            }}
                            error={!!errors.departmentKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="department" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  disabled={viewOnly}
                                  fullWidth
                                  sx={{ width: "100%" }}
                                  variant="standard"
                                  onChange={(value) => field.onChange(value)}
                                  // label="Payment Mode"
                                >
                                  {departments &&
                                    departments.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {language === "en"
                                            ? department.department
                                            : department.departmentMr}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              )}
                              name="departmentKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.departmentKey
                                ? errors.departmentKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled={viewOnly}
                            label={<FormattedLabel id="eventDescription" />}
                            fullWidth
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            variant="standard"
                            {...register("eventDescription")}
                            error={!!errors.eventDescription}
                            InputProps={{ style: { fontSize: 18 } }}
                            helperText={
                              errors?.eventDescription
                                ? errors.eventDescription.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            error={errors.eventDate}
                            fullWidth
                            sx={{ width: "80%" }}
                          >
                            <Controller
                              control={control}
                              name="eventDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DatePicker
                                    disabled={viewOnly}
                                    inputFormat="dd/MM/yyyy"
                                    label={<FormattedLabel id="eventDate" />}
                                    value={field.value}
                                    // @ts-ignore
                                    //   value={applicationDetails.petBirthdate ?? field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date, "YYYY-MM-DD").format(
                                          "YYYY-MM-DD"
                                        )
                                      )
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        sx={{ width: "100%" }}
                                        {...params}
                                        error={errors.eventDate}
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
                              {errors?.eventDate
                                ? errors.eventDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            style={{ backgroundColor: "white" }}
                            error={!!errors.eventTime}
                            fullWidth
                            sx={{ width: "80%" }}
                          >
                            <Controller
                              control={control}
                              // inputFormat="hh:mm:ss a"
                              name="eventTime"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <TimePicker
                                    disabled={viewOnly}
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="eventTime" />
                                      </span>
                                    }
                                    value={field.value}
                                    error={errors.eventTime}
                                    onChange={(time) => field.onChange(time)}
                                    selected={field.value}
                                    renderInput={(params) => (
                                      <TextField
                                        error={errors.eventTime}
                                        {...params}
                                        sx={{ width: "100%" }}
                                        size="small"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventTime
                                ? errors.eventTime.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled={viewOnly}
                            label={<FormattedLabel id="eventLocationLat" />}
                            fullWidth
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            variant="standard"
                            {...register("eventLocationLat")}
                            error={!!errors.eventLocationLat}
                            InputProps={{ style: { fontSize: 18 } }}
                            helperText={
                              errors?.eventLocationLat
                                ? errors.eventLocationLat.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={6}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled={viewOnly}
                            label={<FormattedLabel id="eventLocationLong" />}
                            id="standard-basic"
                            fullWidth
                            sx={{ width: "80%" }}
                            variant="standard"
                            {...register("eventLocationLong")}
                            error={!!errors.eventLocationLong}
                            InputProps={{ style: { fontSize: 18 } }}
                            helperText={
                              errors?.eventLocationLong
                                ? errors.eventLocationLong.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            width: "100%",
                            background:
                              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          }}
                        >
                          <h2>
                            <strong>
                              {language == "en" ? "Attachment" : "दस्तऐवज"}
                            </strong>
                          </h2>
                        </Box>

                        <Grid item xs={12}>
                          <FileTable
                            appName="NRMS" //Module Name
                            serviceName={"N-NPR"} //Transaction Name
                            fileName={attachedFile} //State to attach file
                            filePath={setAttachedFile} // File state upadtion function
                            newFilesFn={setAdditionalFiles} // File data function
                            columns={_columns} //columns for the table
                            rows={finalFiles} //state to be displayed in table
                            uploading={setUploading}
                            authorizedToUpload={authorizedToUpload}
                            disable={viewOnly}
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
                        }}
                      >
                        {!viewOnly ? (
                          <>
                            <Grid item>
                              <Button
                                size="small"
                                type="submit"
                                variant="contained"
                                color="success"
                                endIcon={<SaveIcon />}
                              >
                                {btnSaveText ===
                                <FormattedLabel id="update" /> ? (
                                  <FormattedLabel id="update" />
                                ) : (
                                  <FormattedLabel id="save" />
                                )}
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                endIcon={<ClearIcon />}
                                onClick={() => cancellButton()}
                              >
                                <FormattedLabel id="clear" />
                              </Button>
                            </Grid>
                          </>
                        ) : (
                          ""
                        )}
                        <Grid item>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>

            <div className={styles.addbtn}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setDeleteButtonState(true)
                  setBtnSaveText("Save")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                }}
              >
                <FormattedLabel id="addNew" />
              </Button>
            </div>

            <DataGrid
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection
              getRowId={(data) => data?.id}
              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getData(data.pageSize, _data)
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data)
                // updateData("page", 1);
                getData(_data, data.page)
              }}
            />
          </Paper>
        </>
      )}
    </ThemeProvider>
  )
}

export default EventManagement
