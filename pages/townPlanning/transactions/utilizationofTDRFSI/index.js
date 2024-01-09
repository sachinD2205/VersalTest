import { yupResolver } from "@hookform/resolvers/yup"
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
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import SearchIcon from "@mui/icons-material/Search"
import { toast } from "react-toastify"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
    mode: "onSubmit",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [allZones, setAllZones] = useState([])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const language = useSelector((store) => store.labels.language)

  useEffect(() => {
    getAllAmenities()
  }, [])

  // getAllZones
  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
          )
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "अरेरे!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          })
        }
      })
      .catch((error2) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error2}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        })
      })
  }

  // Get Table - Data
  const getAllAmenities = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/amenities/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res)

        let result = res.data?.amenities
        let _res = result?.map((val, i) => {
          console.log("44")
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            amenity: val.amenity,
            amenityMr: val.amenityMr,
            fromDate: moment(val.fromDate).format("llll"),
            toDate: val.toDate,
            remark: val.remark,
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
      })
  }

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");
    console.log(":a1", formData)
  }

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   }

  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("520", body)
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.PTAXURL}/master/amenities/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res)
  //             if (res.status == 200 || res.status == 201) {
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             }
  //           })
  //           .catch((error) => {
  //             if (error.request.status === 500) {
  //               swal(error.response.data.message, {
  //                 icon: "error",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             } else {
  //               swal("Something went wrong!", {
  //                 icon: "error",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             }
  //             // console.log("error", error);
  //           })
  //       } else if (willDelete == null) {
  //         swal("Record is Safe")
  //         setButtonInputState(false)
  //       }
  //     })
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       // console.log("inn", willDelete);
  //       console.log("620", body)

  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.PTAXURL}/master/amenities/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res)
  //             if (res.status == 200 || res.status == 201) {
  //               swal("Record is Successfully Recovered!", {
  //                 icon: "success",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             }
  //           })
  //           .catch((error) => {
  //             if (error.request.status === 500) {
  //               swal(error.response.data.message, {
  //                 icon: "error",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             } else {
  //               swal("Something went wrong!", {
  //                 icon: "error",
  //               })
  //               getAllAmenities()
  //               setButtonInputState(false)
  //             }
  //             // console.log("error", error);
  //           })
  //       } else if (willDelete == null) {
  //         swal("Record is Safe")
  //         setButtonInputState(false)
  //       }
  //     })
  //   }
  // }

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
    amenity: "",
    amenityMr: "",
    remark: "",
    fromDate: null,
    toDate: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    amenity: "",
    amenityMr: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  }

  // const columns = [
  //   { field: "srNo", headerName: <FormattedLabel id="srNo" /> },
  //   {
  //     field: "amenity",
  //     headerName: <FormattedLabel id="amenityNameEn" />,
  //     flex: 1,
  //   },
  //   {
  //     field: "amenityMr",
  //     headerName: <FormattedLabel id="amenityNameMr" />,
  //     flex: 1,
  //   },
  //   {
  //     field: "fromDate",
  //     headerName: <FormattedLabel id="fromDate" />,
  //     flex: 1,
  //   },
  //   { field: "toDate", headerName: <FormattedLabel id="toDate" /> },
  //   { field: "status", headerName: <FormattedLabel id="status" /> },
  //   {
  //     field: "actions",
  //     headerName: <FormattedLabel id="actions" />,
  //     width: 120,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => {
  //       return (
  //         <>
  //           <IconButton
  //             disabled={editButtonInputState}
  //             onClick={() => {
  //               setBtnSaveText("Update"),
  //                 setBtnSaveTextMr("अद्यतन"),
  //                 setID(params.row.id),
  //                 setIsOpenCollapse(true),
  //                 setSlideChecked(true)
  //               setButtonInputState(true)
  //               console.log("params.row: ", params.row)
  //               reset(params.row)
  //             }}
  //           >
  //             <EditIcon style={{ color: "#556CD6" }} />
  //           </IconButton>
  //           <IconButton
  //             disabled={editButtonInputState}
  //             onClick={() => {
  //               setBtnSaveText("Update"),
  //                 setBtnSaveTextMr("अद्यतन"),
  //                 setID(params.row.id),
  //                 //   setIsOpenCollapse(true),
  //                 setSlideChecked(true)
  //               setButtonInputState(true)
  //               console.log("params.row: ", params.row)
  //               reset(params.row)
  //             }}
  //           >
  //             {params.row.activeFlag == "Y" ? (
  //               <ToggleOnIcon
  //                 style={{ color: "green", fontSize: 30 }}
  //                 onClick={() => deleteById(params.id, "N")}
  //               />
  //             ) : (
  //               <ToggleOffIcon
  //                 style={{ color: "red", fontSize: 30 }}
  //                 onClick={() => deleteById(params.id, "Y")}
  //               />
  //             )}
  //           </IconButton>
  //         </>
  //       )
  //     },
  //   },
  // ]

  // Row

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 2,
          marginBottom: 2,
          padding: 1,
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
        density="compact"
        autoHeight
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {language == "en" ? "Utilization of TDR/FSI" : "TDR/FSI चा वापर"}
          </h2>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
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
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    autoFocus
                    style={{ backgroundColor: "white", width: "25vw" }}
                    id="outlined-basic"
                    variant="standard"
                    label={<FormattedLabel id="DRCNo" required />}
                    {...register("drcNumber")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              if (watch("drcNumber")) {
                                // FUNCTION TO CALL HERE FOR SEARCHING
                              } else {
                                toast.warn("Please Enter the DRC Number")
                              }
                            }}
                            style={{
                              background: "none",
                            }}
                            edge="end"
                          >
                            <SearchIcon
                              style={{
                                color: "blue",
                                fontSize: 30,
                                fontWeight: "bold",
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.drcNumber}
                    helperText={
                      errors?.drcNumber ? errors.drcNumber.message : null
                    }
                  />
                </Grid>
                {/* NAME OF DRC HOLDER */}
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
                    style={{ backgroundColor: "white", width: "255px" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="nameOfDrcHolder" required />}
                    variant="standard"
                    {...register("nameOfDrcHolder")}
                    error={!!errors.nameOfDrcHolder}
                    helperText={
                      errors?.nameOfDrcHolder
                        ? errors.nameOfDrcHolder.message
                        : null
                    }
                  />
                </Grid>
                {/* ARE IN SQ.MTR */}
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
                    id="outlined-basic"
                    type="number"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={<FormattedLabel id="areaInSquareMeter" required />}
                    variant="standard"
                    {...register("areaInSquareMeter")}
                    error={!!errors.areaInSquareMeter}
                    helperText={
                      errors?.areaInSquareMeter
                        ? errors.areaInSquareMeter.message
                        : null
                    }
                  />
                </Grid>
                {/* POSSCESSION CRFT */}
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
                    id="outlined-basic"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={
                      <FormattedLabel id="possessionCertificateNo" required />
                    }
                    variant="standard"
                    {...register("possessionCertificateNo")}
                    error={!!errors.possessionCertificateNo}
                    helperText={
                      errors?.possessionCertificateNo
                        ? errors.possessionCertificateNo.message
                        : null
                    }
                  />
                </Grid>
                {/* ORDER NO. OF ADDITIONAL COLLECTOR */}
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
                    id="outlined-basic"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={
                      <FormattedLabel id="orderNoOfAddCollector" required />
                    }
                    variant="standard"
                    {...register("orderNoOfAddCollector")}
                    error={!!errors.orderNoOfAddCollector}
                    helperText={
                      errors?.orderNoOfAddCollector
                        ? errors.orderNoOfAddCollector.message
                        : null
                    }
                  />
                </Grid>
                {/* ORDER NO. OF GOVT. */}
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
                    id="outlined-basic"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={<FormattedLabel id="orderNoOfGovt" required />}
                    variant="standard"
                    {...register("orderNoOfGovt")}
                    error={!!errors.orderNoOfGovt}
                    helperText={
                      errors?.orderNoOfGovt
                        ? errors.orderNoOfGovt.message
                        : null
                    }
                  />
                </Grid>
                {/* ZONE DROPDOWN */}
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
                  <FormControl error={!!errors.zone}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zone" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "255px" }}
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          label={<FormattedLabel id="zone" required />}
                        >
                          {allZones &&
                            allZones?.map((zone, index) => (
                              <MenuItem key={index} value={zone.id}>
                                {language == "en"
                                  ? zone?.zoneName
                                  : zone?.zoneNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zone"
                      control={control}
                      defaultValue={null}
                    />
                    <FormHelperText>
                      {errors?.zone ? errors.zone.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* PROPOSAL NAME */}
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
                  <FormControl error={!!errors.proposalName}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="proposalName" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "255px" }}
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          label={<FormattedLabel id="proposalName" required />}
                        >
                          {/* {allZones &&
                            allZones?.map((zone, index) => (
                              <MenuItem key={index} value={zone.id}>
                                {language == "en"
                                  ? zone?.zoneName
                                  : zone?.zoneNameMr}
                              </MenuItem>
                            ))} */}
                        </Select>
                      )}
                      name="proposalName"
                      control={control}
                      defaultValue={null}
                    />
                    <FormHelperText>
                      {errors?.proposalName
                        ? errors.proposalName.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* DRC CERTIFICATE UPLOAD */}
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
                    style={{ backgroundColor: "white", width: "255px" }}
                    id="outlined-basic"
                    type="file"
                    label={<FormattedLabel id="drcCertificate" required />}
                    variant="standard"
                    {...register("drcCertificate")}
                    error={!!errors.drcCertificate}
                    helperText={
                      errors?.drcCertificate
                        ? errors.drcCertificate.message
                        : null
                    }
                  />
                </Grid>
                {/* ROAD SIZE */}
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
                    id="outlined-basic"
                    type="number"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={<FormattedLabel id="roadSize" required />}
                    variant="standard"
                    {...register("roadSize")}
                    error={!!errors.roadSize}
                    helperText={
                      errors?.roadSize ? errors.roadSize.message : null
                    }
                  />
                </Grid>
                {/* FOLIO NO. */}
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
                    id="outlined-basic"
                    type="number"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={<FormattedLabel id="folioNo" required />}
                    variant="standard"
                    {...register("folioNo")}
                    error={!!errors.folioNo}
                    helperText={errors?.folioNo ? errors.folioNo.message : null}
                  />
                </Grid>
                {/* DRC DATE */}
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
                    error={!!errors.drcDate}
                  >
                    <Controller
                      control={control}
                      name="drcDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="drcDate" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                sx={{ width: "255px" }}
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
                      {errors?.drcDate ? errors.drcDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* FSI CREDIT AREA */}
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
                    id="outlined-basic"
                    type="number"
                    style={{ backgroundColor: "white", width: "255px" }}
                    label={<FormattedLabel id="fsiCreditArea" required />}
                    variant="standard"
                    {...register("fsiCreditArea")}
                    error={!!errors.fsiCreditArea}
                    helperText={
                      errors?.fsiCreditArea
                        ? errors.fsiCreditArea.message
                        : null
                    }
                  />
                </Grid>
              </Grid>

              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

              <Grid container style={{ padding: "10px" }} spacing={2}>
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
                  <Button
                    // sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {language === "en" ? btnSaveText : btnSaveTextMr}
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
                  <Button
                    // sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    // onClick={() => cancellButton()}
                  >
                    {<FormattedLabel id="clear" />}
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
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    // onClick={() => exitButton()}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        {/* ADD TABEL AND BUTTON */}
        {/* <Grid
          container
          style={{ padding: "10px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "end",
              paddingRight: "50px",
            }}
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

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
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
              }}
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
              density="compact"
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
                getAllCommitteMembersData(data?.pageSize, _data)
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data)

                getAllCommitteMembersData(_data, data?.page)
              }}
            />
          </Grid>
        </Grid> */}

        {/* <Grid
          container
          style={{ padding: "10px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        ></Grid> */}
      </Paper>
    </>
  )
}

export default Index
