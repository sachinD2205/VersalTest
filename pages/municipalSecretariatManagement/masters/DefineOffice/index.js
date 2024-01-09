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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineOfficeSchema"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../view.module.css"
import theme from "../../../../theme"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
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
  const [loadingWard, setLoadingWard] = useState(false)
  const [loadingZone, setLoadingZone] = useState(false)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const [allWards, setAllWards] = useState([])
  const [allZones, setAllZones] = useState([])

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
  const getAllOffices = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineOfficeDetails/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "desc",
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(";res", res)
        if (res?.status === 200 || res?.status === 201) {
          let result = res.data?.defineOfficeDetails
          let _res = result?.map((r, i) => {
            console.log("44", r)

            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              office: newFunctionForNullValues("en", r.office),
              officeMr: newFunctionForNullValues("mr", r.officeMr),

              officeAddress: r.officeAddress,
              officeAddressEn: newFunctionForNullValues("en", r.officeAddress),
              officeAddressMr: newFunctionForNullValues(
                "mr",
                r.officeAddressMr
              ),

              officeType: newFunctionForNullValues("en", r.officeType),
              officeTypeMr: newFunctionForNullValues("mr", r.officeTypeMr),
              ward: r.ward,
              wardEn: newFunctionForNullValues(
                "en",
                allWards?.find((o) => o.id == r.ward)?.wardName
              ),
              wardMr: newFunctionForNullValues(
                "en",
                allWards?.find((o) => o.id == r.ward)?.wardNameMr
              ),
              zone: r.zone,
              zoneEn: newFunctionForNullValues(
                "en",
                allZones?.find((o) => o.id == r.zone)?.zoneName
              ),
              zoneMr: newFunctionForNullValues(
                "en",
                allZones?.find((o) => o.id == r.zone)?.zoneNameMr
              ),
              gisId: r.gisId,
              latitude: r.latitude,
              longitude: r.longitude,
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

  ///////////////////////////
  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available"
    } else {
      return value ? value : "उपलब्ध नाही"
    }
  }

  // /////////////////// WARD API //////////////////
  const getAllWards = () => {
    setLoadingWard(true)
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            }))
          )
          setLoadingWard(false)
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          })
          setLoadingWard(false)
        }
      })
      .catch((error) => {
        // sweetAlert({
        //   title: "OOPS!",
        //   text: `${error3}`,
        //   icon: "error",
        //   dangerMode: true,
        //   closeOnClickOutside: false,
        // })
        setLoadingWard(false)
        callCatchMethod(error, language)
      })
  }

  // /////////////////// ZONE API //////////////////
  const getAllZones = () => {
    setLoadingZone(true)
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
          )
          setLoadingZone(false)
        } else {
          sweetAlert({
            title: "OOPS!",
            text: "Something went wrong!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
          })
          setLoadingZone(false)
        }
      })
      .catch((error) => {
        // sweetAlert({
        //   title: "OOPS!",
        //   text: `${error3}`,
        //   icon: "error",
        //   dangerMode: true,
        //   closeOnClickOutside: false,
        // })
        setLoadingZone(false)
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (allWards?.length != 0 && allZones?.length != 0) {
      getAllOffices()
    }
  }, [allWards, allZones])

  useEffect(() => {
    getAllWards()
    getAllZones()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    setLoading(true)
    axios
      .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getAllOffices()
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
        //   getAllOffices()
        //   setButtonInputState(false)

        //   setLoading(false)
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   })
        //   getAllOffices()
        //   setButtonInputState(false)

        //   setLoading(false)
        // }
        // console.log("error", error);
        getAllOffices()
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
            .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, body, {
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
                getAllOffices()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllOffices()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllOffices()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);
              getAllOffices()
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
            .post(`${urls.MSURL}/mstDefineOfficeDetails/save`, body, {
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
                getAllOffices()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllOffices()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllOffices()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);
              getAllOffices()
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
    setValue("ward", "")
    setValue("zone", "")
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    office: "",
    officeMr: "",
    officeType: "",
    officeTypeMr: "",
    gisId: "",
    latitude: "",
    longitude: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    office: "",
    officeMr: "",
    officeType: "",
    officeTypeMr: "",
    gisId: "",
    latitude: "",
    longitude: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "office" : "officeMr",
      headerName: <FormattedLabel id="officeName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "officeAddressEn" : "officeAddressMr",
      headerName: <FormattedLabel id="officeAddress" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "officeType" : "officeTypeMr",
      headerName: <FormattedLabel id="officeType" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "wardEn" : "wardMr",
      headerName: <FormattedLabel id="wardName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "zoneEn" : "zoneMr",
      headerName: <FormattedLabel id="zoneName" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "latitude",
      headerName: <FormattedLabel id="latitude" />,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "longitude",
      headerName: <FormattedLabel id="longitude" />,
      minWidth: 200,
      headerAlign: "center",
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

  // Row

  return (
    // <ThemeProvider theme={theme}>
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
              width: "90%",
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
              <FormattedLabel id="defineOffice" />
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
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    {loadingWard ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="wardName" />
                          </InputLabel>
                          <Select
                            sx={{ width: "220px" }}
                            variant="standard"
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <FormControl error={!!errors.ward}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="wardName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "220px" }}
                              fullWidth
                              autoFocus
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label="Ward Name"
                            >
                              {allWards &&
                                allWards?.map((allWards, index) => (
                                  <MenuItem key={index} value={allWards.id}>
                                    {language == "en"
                                      ? //@ts-ignore
                                        allWards?.wardName
                                      : // @ts-ignore
                                        allWards?.wardNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="ward"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.ward ? errors.ward.message : null}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>
                  {/* ////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    {loadingZone ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="zoneName" />
                          </InputLabel>
                          <Select
                            sx={{ width: "220px" }}
                            variant="standard"
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <FormControl error={!!errors.zone}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "220px" }}
                              fullWidth
                              variant="standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label="Ward Name"
                            >
                              {allZones &&
                                allZones?.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {language == "en"
                                      ? //@ts-ignore
                                        zone?.zoneName
                                      : // @ts-ignore
                                        zone?.zoneNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zone ? errors.zone.message : null}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>
                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeNameEn" />}
                      variant="standard"
                      {...register("office")}
                      error={!!errors.office}
                      helperText={errors?.office ? errors.office.message : null}
                    />
                  </Grid>
                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeNameMr" />}
                      variant="standard"
                      {...register("officeMr")}
                      error={!!errors.officeMr}
                      helperText={
                        errors?.officeMr ? errors.officeMr.message : null
                      }
                    />
                  </Grid>
                  {/* //////////officeAddress//////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeAddressEn" />}
                      variant="standard"
                      {...register("officeAddress")}
                      error={!!errors.officeAddress}
                      helperText={
                        errors?.officeAddress
                          ? errors.officeAddress.message
                          : null
                      }
                    />
                  </Grid>
                  {/* //////////officeAddress Mr//////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeAddressMr" />}
                      variant="standard"
                      {...register("officeAddressMr")}
                      error={!!errors.officeAddressMr}
                      helperText={
                        errors?.officeAddressMr
                          ? errors.officeAddressMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeTypeEn" />}
                      variant="standard"
                      {...register("officeType")}
                      error={!!errors.officeType}
                      helperText={
                        errors?.officeType ? errors.officeType.message : null
                      }
                    />
                  </Grid>
                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="officeTypeMr" />}
                      variant="standard"
                      {...register("officeTypeMr")}
                      error={!!errors.officeTypeMr}
                      helperText={
                        errors?.officeTypeMr
                          ? errors.officeTypeMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="gisId" />}
                      variant="standard"
                      {...register("gisId")}
                      error={!!errors.gisId}
                      helperText={errors?.gisId ? errors.gisId.message : null}
                    />
                  </Grid>
                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="latitude" />}
                      variant="standard"
                      {...register("latitude")}
                      error={!!errors.latitude}
                      helperText={
                        errors?.latitude ? errors.latitude.message : null
                      }
                    />
                  </Grid>
                  {/* ////////////////////// */}
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
                      sx={{ width: "220px" }}
                      label={<FormattedLabel id="longitude" />}
                      variant="standard"
                      {...register("longitude")}
                      error={!!errors.longitude}
                      helperText={
                        errors?.longitude ? errors.longitude.message : null
                      }
                    />
                  </Grid>
                </Grid>

                {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

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
                        onClick={() => cancellButton()}
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
                // density="compact"
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
                  getAllOffices(data?.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)

                  getAllOffices(_data, data?.page)
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
