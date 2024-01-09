import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import PreviewIcon from "@mui/icons-material/Preview"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Tooltip,
  Card,
  Grid,
} from "@mui/material"
// import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { message } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstElectedPrabhagSchema"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
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

// func
const Index = () => {
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

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
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

  // Delete By ID
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
            .post(`${urls.MSURL}/mstDefineElectedPrabhag/save`, body)
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
            .post(`${urls.MSURL}/mstDefineElectedPrabhag/save`, body)
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

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()
    console.log("From Date ${fromDate} ")

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineElectedPrabhag/save`, finalBodyForApi)
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
        .post(`${urls.MSURL}/mstDefineElectedPrabhag/save`, finalBodyForApi)
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

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    gisId: "",
    electedPrabhagId: "",
    electedPrabhagPrefix: "",
    electedPrabhagNo: "",
    electedPrabhagName: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    gisId: "",
    electedPrabhagId: "",
    electedPrabhagPrefix: "",
    electedPrabhagNo: "",
    electedPrabhagName: "",
    id: "",
  }

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstDefineElectedPrabhag/getAll`).then((res) => {
      console.log(res.data.electedPrabhag, "__________________________________")
      setDataSource(
        res.data.electedPrabhag.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          gisId: r.gisId,
          electedPrabhagId: r.electedPrabhagId,
          electedPrabhagPrefix: r.electedPrabhagPrefix,
          electedPrabhagPrefixMr: r.electedPrabhagPrefixMr,
          electedPrabhagNo: r.electedPrabhagNo,
          electedPrabhagName: r.electedPrabhagName,
          electedPrabhagNameMr: r.electedPrabhagNameMr,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          latitude: r.latitude,
          longitude: r.longitude,
          activeFlag: r.activeFlag,
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

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },

    { field: "fromDate", headerName: "From Date" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "gisId",
      headerName: "GIS Id/GeoCode",
      // type: "number",
      flex: 1,
    },
    {
      field: "latitude",
      headerName: "Lattitude",
      //type: "number",
      flex: 1,
    },
    {
      field: "longitude",
      headerName: "Longitude",
      //type: "number",
      flex: 1,
    },
    {
      field: "electedPrabhagId",
      headerName: "Elected Prabhag Id",
      // type: "number",
      flex: 1,
    },

    {
      field: "electedPrabhagNo",
      headerName: "Elected Prabhag No",
      //type: "number",
      flex: 1,
    },
    {
      field: "electedPrabhagPrefix",
      headerName: "Elected Prabhag Prefix",
      //type: "number",
      flex: 1,
    },
    {
      field: "electedPrabhagName",
      headerName: "Elected Prabhag Name English",
      //type: "number",
      flex: 1,
    },
    {
      field: "electedPrabhagPrefixMr",
      headerName: "Elected Prabhag Prefix Marathi",
      //type: "number",
      flex: 1,
    },
    {
      field: "electedPrabhagNameMr",
      headerName: "Elected Prabhag Name Marathi",
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
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

  // View
  return (
    <>
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
          Elected Prabhag
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
              Elected Prabhag
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
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <FormControl
                          style={{
                            marginRight: 20,
                            marginTop: 10,
                            width: 185,
                          }}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date*
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
                          style={{
                            marginLeft: 160,
                            marginTop: 10,
                            width: 185,
                          }}
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="YYYY/MM/DD"
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

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          label="Elected Prabhag Name English*"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagName")}
                          error={!!errors.electedPrabhagName}
                          helperText={
                            errors?.electedPrabhagName
                              ? errors.electedPrabhagName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ marginLeft: 20 }}
                          label="Elected Prabhag Name Marathi*"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagNameMr")}
                          error={!!errors.electedPrabhagNameMr}
                          helperText={
                            errors?.electedPrabhagNameMr
                              ? errors.electedPrabhagNameMr.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Elected Prabhag Id *"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagId")}
                          error={!!errors.electedPrabhagId}
                          helperText={
                            errors?.electedPrabhagId
                              ? errors.electedPrabhagId.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Elected Prabhag Prefix *"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagPrefix")}
                          error={!!errors.electedPrabhagPrefix}
                          helperText={
                            errors?.electedPrabhagPrefix
                              ? errors.electedPrabhagPrefix.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Elected Prabhag Prefix Marathi *"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagPrefixMr")}
                          error={!!errors.electedPrabhagPrefixMr}
                          helperText={
                            errors?.electedPrabhagPrefixMr
                              ? errors.electedPrabhagPrefixMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="Elected Prabhag No *"
                          variant="standard"
                          // value={dataInForm && dataInForm.licenseType}
                          {...register("electedPrabhagNo")}
                          error={!!errors.electedPrabhagNo}
                          helperText={
                            errors?.electedPrabhagNo
                              ? errors.electedPrabhagNo.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label="GIS ID/GeoCode *"
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors.gisId}
                          helperText={
                            errors?.gisId ? errors.gisId.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label=" Lattitude*"
                          variant="standard"
                          {...register("latitude")}
                          error={!!errors.latitude}
                          helperText={
                            errors?.latitude ? errors.latitude.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                        <TextField
                          id="standard-basic"
                          label=" Longitude*"
                          variant="standard"
                          {...register("longitude")}
                          error={!!errors.longitude}
                          helperText={
                            errors?.longitude ? errors.longitude.message : null
                          }
                        />
                      </Grid>

                      {/* <div className={styles.row}> */}
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
        //checkboxSelection
        />
      </Paper>
    </>
  )
}

export default Index

// export default index
