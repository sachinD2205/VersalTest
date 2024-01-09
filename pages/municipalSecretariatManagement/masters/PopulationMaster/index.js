import { yupResolver } from "@hookform/resolvers/yup"
import { Refresh } from "@mui/icons-material"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import PreviewIcon from "@mui/icons-material/Preview"
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
  Card,
  Tooltip,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbar,
  GridColDef,
  GridToolbarExport,
  GridRowProps,
} from "@mui/x-data-grid"
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
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstPopulationMasterSchema"
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
  const [pageSize, setPageSize] = useState(5)
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

  //   // Delete By ID
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
          axios.post(`${urls.MSURL}/mstPopulation/save`, body).then((res) => {
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
          axios.post(`${urls.MSURL}/mstPopulation/save`, body).then((res) => {
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
  const onSubmitForm = (formData, event) => {
    event.preventDefault()

    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi)
      axios
        .post(`${urls.MSURL}/mstPopulation/save`, finalBodyForApi)
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
        .post(`${urls.MSURL}/mstPopulation/save`, finalBodyForApi)
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

  //   const [honariumNames, setHonariumNames] = useState([]);

  //   const getHonariumNames = () => {
  //     axios
  //       .get(`${urls.BaseURL}/master/MstPaymentType/getpaymentTypeData`)
  //       .then((r) => {
  //         setHonariumNames(
  //           r.data.map((row) => ({
  //             id: row.id,
  //             honariumName: row.honariumName,
  //           })),
  //         );
  //       });
  //   };

  //   useEffect(() => {
  //     getHonariumNames();
  //
  //   }, []);

  //   // Reset Values Cancell
  const resetValuesCancell = {
    id: "",
    ward: "",
    maleCount: "",
    femaleCount: "",
    totalCount: "",
  }

  //   // Reset Values Exit
  const resetValuesExit = {
    id: "",
    ward: "",
    maleCount: "",
    femaleCount: "",
    totalCount: "",
  }

  const [wardNames, setwardNames] = useState([])

  const getwardNames = () => {
    axios.get(`${urls.BaseURL}/ward/getAll`).then((r) => {
      setwardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      )
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  }

  useEffect(() => {
    getwardNames()
  }, [])

  //   // Get Table - Data
  const getlicenseTypeDetails = () => {
    console.log("getLIC ----")
    axios.get(`${urls.MSURL}/mstPopulation/getAll`).then((res) => {
      console.log(res, ">>>>>>")
      setDataSource(
        res.data.population.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          ward: r.ward,
          ward1: wardNames?.find((obj) => obj.id === r.ward)?.wardName,
          maleCount: r.maleCount,
          femaleCount: r.femaleCount,
          totalCount: r.totalCount,
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
  }, [wardNames])

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ward1",
      headerName: "Ward No.",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maleCount",
      headerName: "Male Population Count",
      type: "number",
      width: 190,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "femaleCount",
      headerName: "Female Population Count",
      type: "number",
      width: 210,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalCount",
      headerName: "Total Count",
      type: "number",
      width: 135,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
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
            Population Master
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
              Population Master
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
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.ward}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward No. *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Ward No.*"
                              >
                                <MenuItem value={1}>Ward No. 1</MenuItem>
                                {/* {honariumNames &&
                            honariumNames.map((honariumName, index) => (
                              <MenuItem key={index} value={honariumName.id}>
                                {honariumName.honariumName}
                              </MenuItem>
                            ))} */}
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
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label=" Male Population Count*"
                          {...register("maleCount")}
                          error={!!errors.maleCount}
                          helperText={
                            errors?.maleCount ? errors.maleCount.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label=" Female Population Count*"
                          {...register("femaleCount")}
                          error={!!errors.femaleCount}
                          helperText={
                            errors?.femaleCount
                              ? errors.femaleCount.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <TextField
                          id="standard-basic"
                          sx={{ m: 1, minWidth: 200 }}
                          label=" Total Count*"
                          {...register("totalCount")}
                          error={!!errors.totalCount}
                          helperText={
                            errors?.totalCount
                              ? errors.totalCount.message
                              : null
                          }
                        />
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
          pagination={true}
          pageSize={pageSize}
          // onPageSizeChange={(newPageSize)=>setPageSize(newPageSize)}
          // rowsPerPageOptions={[10,20,30]}
          // components={{
          //   Toolbar: ()=>{return <GridToolbarContainer sx={{justifyContent:"flex-end"}}> <GridToolbarExport /> </GridToolbarContainer>}
          // }}
          rowsPerPageOptions={[5]}
        //checkboxSelection
        />
      </Paper>
    </>
  )
}

export default Index
