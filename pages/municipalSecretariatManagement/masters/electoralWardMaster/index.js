import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
  MenuItem,
} from "@mui/material"
import sweetAlert from "sweetalert"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import AddIcon from "@mui/icons-material/Add"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import axios from "axios"
import moment from "moment"
import { yupResolver } from "@hookform/resolvers/yup"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import { useSelector } from "react-redux"
// import Schema from "../../../containers/schema/propertyTax/masters/electoralWardMaster"
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"

import theme from "../../../../theme"
import styles from "../../../../components/propertyTax/propertyRegistration/view.module.css"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
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
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [id, setID] = useState()
  const [circleName, setCircleName] = useState([])
  const [gatName, setGatName] = useState([])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const language = useSelector((state) => state?.labels.language);
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


  // const language = useSelector((store) => store.labels.language)

  useEffect(() => {
    getElectrolWard()
  }, [circleName, gatName])

  const getElectrolWard = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    axios
      .get(`${urls.PTAXURL}/master/electoral/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(";res", res)
        let result = res.data.electoral
        let _res = result?.map((val, i) => {
          console.log("44")
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: val.id,
            electoralPrefix: val.electoralPrefix,
            electoralWardNo: val.electoralWardNo,
            electoralWardName: val.electoralWardName,
            electoralWardNameMr: val.electoralWardNameMr,
            circle: val.circle,
            circleName1: circleName?.find((obj) => obj.id === val.circle)
              ?.circleName,
            gat: val.gat,
            gatName1: gatName?.find((obj) => obj.id === val.gat)?.gatName,
            fromDate: moment(val.fromDate).format("llll"),
            toDate: val.toDate,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          }
        })

        console.log("result", _res)

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  }

  // GattName
  // const gettingGatName = () => {
  //   axios.get(`${urls.PTAXURL}/master/circleGatMapping/getAll`).then((res) => {
  //     setGatName(
  //       res.data?.circleGat.map((r, i) => ({
  //         id: r.id,
  //         gatName: r.gatName,
  //       }))
  //     )
  //   })
  // }

  //CircleName
  // const gettingCircleName = () => {
  //   axios.get(`${urls.PTAXURL}/master/circle/getAll`).then((res) => {
  //     console.log("res", res)
  //     setCircleName(
  //       res.data?.circle.map((r, i) => ({
  //         id: r.id,
  //         circleName: r.circleName,
  //       }))
  //     )
  //   })
  // }

  // useEffect(() => {
  //   gettingGatName()
  //   gettingCircleName()
  // }, [])

  const onSubmitForm = (formData) => {
    // console.log("formData", formData);
    console.log("110", formData)
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD")
    const toDate = moment(formData.toDate).format("YYYY-MM-DD")
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    console.log("finalBodyForApi", finalBodyForApi)

    axios
      .post(`${urls.MSURL}/mstElectoral/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res)
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getElectrolWard()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
        }
      })
      .catch((error) => {
        // if (error.request.status === 500) {
        //   swal(error.response.data.message, {
        //     icon: "error",
        //   })
        //   getElectrolWard()
        //   setButtonInputState(false)
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   })
        //   getElectrolWard()
        //   setButtonInputState(false)
        // }
        // console.log("error", error);
        getElectrolWard()
        setButtonInputState(false)
        callCatchMethod(error, language);
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
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstElectoral/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getElectrolWard()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getElectrolWard()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getElectrolWard()
              //   setButtonInputState(false)
              // }
              // console.log("error", error)
              setButtonInputState(false)
              callCatchMethod(error, language);
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
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.MSURL}/mstElectoral/save`, body)
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getElectrolWard()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getElectrolWard()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getElectrolWard()
              //   setButtonInputState(false)
              // }
              // console.log("error", error)

              getElectrolWard()
              setButtonInputState(false)
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
        }
      })
    }
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    electoralPrefix: "",
    electoralWardNo: "",
    electoralWardName: "",
    electoralWardNameMr: "",
    circle: "",
    gat: "",
    fromDate: null,
    toDate: null,
    remark: "",
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
  }

  const resetValuesExit = {
    electoralPrefix: "",
    electoralWardNo: "",
    electoralWardName: "",
    electoralWardNameMr: "",
    circle: "",
    gat: "",
    fromDate: null,
    toDate: null,
    remark: "",
  }

  const columns = [
    {
      field: "srNo",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: "Sr.No",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "electoralPrefix",
      // headerName: <FormattedLabel id="billPrefix" />,

      headerName: "Electoral Prefix",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "electoralWardName",
      // headerName: <FormattedLabel id="electoralWardName" />,
      headerName: "Electoral Ward Name",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "electoralWardNameMr",
    // headerName: <FormattedLabel id="billType" />,
    //   headerName: "ElectoralWardName Mr",
    //   // type: "number",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "circleName1",
    // headerName: <FormattedLabel id="billType" />,
    //   headerName: "Circle Name",
    //   // type: "number",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "gatName1",
      //   headerName: <FormattedLabel id="gatName" />,
      headerName: "Gat Name",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      //   headerName: <FormattedLabel id="fromDate" />,
      // type: "number",
      flex: 1,
      // minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      //   headerName: <FormattedLabel id="toDate" />,
      headerName: "To Date",
      // type: "number",
      flex: 1,
      // minWidth: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      //   headerName: <FormattedLabel id="status" />,
      headerName: "Status",
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      //   headerName: <FormattedLabel id="actions" />,
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), setBtnSaveTextMr("अद्यतन")
                setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              height: "auto",
              overflow: "auto",
              padding: "10px 80px",
              // paddingLeft: "20px",
              // paddingRight: "20px",
              // paddingTop: "10px",
            }}
          >
            <Grid
              className={styles.details}
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: linearGradient(
                //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
                // ),
                color: "black",
                padding: "8px",
                fontSize: 19,
                borderRadius: "20px",
              }}
            >
              <strong>
                {/* <FormattedLabel id="electoralWardMaster" /> */}
                Electoral Ward Master
              </strong>
            </Grid>
          </Box>

          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      //   label={<FormattedLabel id="electoralPrefix" />}
                      label="Electoral Prefix"
                      variant="standard"
                      {...register("electoralPrefix")}
                      error={!!errors.electoralPrefix}
                      helperText={
                        errors?.electoralPrefix
                          ? errors.electoralPrefix.message
                          : null
                      }
                    />
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>From Date</span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField {...params} size="small" fullWidth />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.fromDate ? errors.fromDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>To Date</span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField {...params} size="small" fullWidth />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.toDate ? errors.toDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

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
                    <FormControl
                      error={!!errors.circle}
                      style={{ minWidth: "230px" }}
                    >
                      <InputLabel>Circle Name</InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            variant="standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            // style={{ height: 40, padding: "14px 14px" }}
                          >
                            {circleName &&
                              circleName.map((circleName, i) => (
                                <MenuItem key={i} value={circleName.id}>
                                  {circleName.circleName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="circle"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.circle ? errors.circle.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

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
                    <FormControl
                      error={!!errors.gat}
                      style={{ minWidth: "230px" }}
                    >
                      <InputLabel>Gat Name</InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            variant="standard"
                            value={field.value}
                            // label={<FormattedLabel id="gatName" />}
                            onChange={(value) => field.onChange(value)}
                            // style={{ height: 40, padding: "14px 14px" }}
                          >
                            {gatName &&
                              gatName.map((gatName, i) => (
                                <MenuItem key={i} value={gatName.id}>
                                  {gatName.gatName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="gat"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.gat ? errors.gat.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

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
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label="Electoral Ward No"
                      //   label={<FormattedLabel id="electoralWardNo" />}
                      variant="standard"
                      {...register("electoralWardNo")}
                      error={!!errors.electoralWardNo}
                      helperText={
                        errors?.electoralWardNo
                          ? errors.electoralWardNo.message
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
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label="Electoral Ward Name"
                      //   label={<FormattedLabel id="electoralWardName" />}
                      variant="standard"
                      {...register("electoralWardName")}
                      error={!!errors.electoralWardName}
                      helperText={
                        errors?.electoralWardName
                          ? errors.electoralWardName.message
                          : null
                      }
                    />
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
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label="Electoral Ward Name Mr"
                      //   label={<FormattedLabel id="electoralWardNameMr" />}
                      variant="standard"
                      {...register("electoralWardNameMr")}
                      error={!!errors.electoralWardNameMr}
                      helperText={
                        errors?.electoralWardNameMr
                          ? errors.electoralWardNameMr.message
                          : null
                      }
                    />
                  </Grid> */}

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
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      //   label={<FormattedLabel id="remark" />}
                      label="Remark"
                      variant="standard"
                      {...register("remark")}
                    />
                  </Grid>
                </Grid>

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
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {/* {language === "en" ? btnSaveText : btnSaveTextMr} */}
                      Save
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
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      {/* <FormattedLabel id="clear" /> */}
                      Clear
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
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      Exit
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
              </form>
            </Slide>
          )}

          <Grid container style={{ padding: "10px" }}>
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
                {/* <FormattedLabel id="add" /> */}
                Add
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
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
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows || []}
              columns={columns}
              onPageChange={(_data) => {
                getElectrolWard(data.pageSize, _data)
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data)
                // updateData("page", 1);
                getElectrolWard(_data, data.page)
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
