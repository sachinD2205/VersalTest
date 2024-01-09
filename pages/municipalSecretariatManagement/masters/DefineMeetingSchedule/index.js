import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import PreviewIcon from "@mui/icons-material/Preview"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { TimePicker } from "@mui/x-date-pickers"
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
  Tooltip,
  InputLabel,
  Form,
  MenuItem,
  Select,
} from "@mui/material"
// import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid"

import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { message } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
// import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefineMeetingScheduleSchema"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import sweetAlert from "sweetalert"
import { LeftOutlined } from "@ant-design/icons"
import { styled, useTheme } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Drawer from "@mui/material/Drawer"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
} from "react-hook-form"
import { useSelector } from "react-redux"

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
  const [value, setValuee] = useState(null)
  const [valuee, setValueTwo] = useState(null)
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [inputState, setInputState] = useState()
  const [dataInModal, setDataInModal] = useState()
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
            .post(`${urls.MSURL}/mstDefineMeetingSchedule/save`, body)
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
            .post(`${urls.MSURL}/mstDefineMeetingSchedule/save`, body)
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

  const [comittees1, setcomittees1] = useState([])

  const getcomittees1 = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r.data.committees.map((row) => ({
          id: row.id,
          comittee: row.CommitteeName,
        }))
      )
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  }

  useEffect(() => {
    getcomittees1()
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log("From Date ${fromDate} ")
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = new Date(formData.toDate).toISOString()
    const selectDate = new Date(formData.selectDate).toISOString()
    // const timePicker = moment(formData.timePicker, "hh:mm:ss a").format(
    //     "hh:mm:ss",
    //     );

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      selectDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineMeetingSchedule/save`, finalBodyForApi)
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
      console.log("Put -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstDefineMeetingSchedule/save`, finalBodyForApi)
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
    scheduledate: null,
    timePicker: null,
    comittee: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    scheduledate: null,
    timePicker: null,
    comittee: "",
    id: "",
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "committeeses", // unique name for your Field Array
    }
  )
  const [committeeAddBtn, setcommitteeAddBtn] = useState(false)

  // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstDefineMeetingSchedule/getAll`).then((res) => {
      console.log(res.data.defineMeetingSchedule, "hi<<<<<<")
      setDataSource(
        res.data.defineMeetingSchedule.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          selectDate: moment(r.selectDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          Committee: r.Committee,
          activeFlag: r.activeFlag,
          //  timePicker: moment(r.toBookingTimetimePicker, "hh:mm A").format("hh:mm A"),

          //   comittee1: comittees1?.find((obj) => obj?.id == r.comittee)?.comittee,
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
      field: "Committee",
      headerName: "Comittee",
      // type: "number",
      flex: 1,
    },
    {
      field: "selectDate",
      headerName: "Meeting Date",
      // type: "number",
      flex: 1,
    },
    // {
    //   field: "scheduleTime",
    //   headerName: "Meeting Time",
    //   //type: "number",
    //   flex: 1,
    // },

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
          Define Meeting Schedule
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
              Define Meeting Schedule
              {/* <strong> Document Upload</strong> */}
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                sx={{
                  marginLeft: 30,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                  <FormControl style={{ marginTop: 10, width: 185 }}>
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="YYYY/MM/DD"
                            label={
                              <span style={{ fontSize: 16 }}>From Date*</span>
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
                  <FormControl style={{ marginTop: 10, width: 185 }}>
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="YYYY/MM/DD"
                            label={
                              <span style={{ fontSize: 16 }}>To Date</span>
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
              </Grid>

              {fields.map((Committee, index) => {
                return (
                  // eslint-disable-next-line react/jsx-key
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
                      <FormControl
                        variant="standard"
                        // key={comittees.id}
                        // {...register(`committeeses.${index}.firstName`)}

                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.Committee}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Select Committee *
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Select Committee*"
                            >
                              <MenuItem value={1}>comittee1</MenuItem>
                              {comittees1 &&
                                comittees1.map((comittee, index) => (
                                  <MenuItem key={index} value={comittee.id}>
                                    {comittee.comittee}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="Committee"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.Committee ? errors.Committee.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <FormControl style={{ marginTop: 10, width: 185 }}>
                        <Controller
                          control={control}
                          name="selectDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="YYYY/MM/DD"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Meeting Date*
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

<FormControl
    style={{ marginTop: 10 ,width :185}}
    error={!!errors.timePicker}
  >
    <Controller
      control={control}
      sx={{ width: 200 }}
      name="timePicker"
      defaultValue={null}
      render={({ field }) => (
        <LocalizationProvider
          dateAdapter={AdapterMoment}
        >
          <TimePicker
            label={
              <span style={{ fontSize: 16 }}>
                Meeting Time
              </span>
            }
            value={value}
            onChange={(newValue) => {
              setValuee(newValue);
              console.log("Ha Time Aahe: ", newValue);
            }}
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
    <FormHelperText>
      {errors?.timePicker
        ? errors.timePicker.message
        : null}
    </FormHelperText>
  </FormControl>

  </Grid> */}
                  </Grid>
                )
              })}

              <Grid
                container
                sx={{
                  marginLeft: 5,
                  marginTop: 2,
                  marginBottom: 5,
                  align: "center",
                }}
              >
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Button
                    onClick={() =>
                      append({
                        Comittee: "",
                      })
                    }
                    variant="contained"
                  >
                    Add Committee
                  </Button>
                </Grid>
              </Grid>

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
            </form>
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
