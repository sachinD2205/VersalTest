import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import {
  Box,
  Button,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/chargeMst"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import Loader from "../../../../containers/Layout/components/Loader"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const [isLoading, setIsLoading] = useState(false)
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const router = useRouter()
  const groupId = watch("groupId")

  console.log("sssss", groupId)

  const language = useSelector((state) => state.labels.language)
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
  const userToken = useGetToken()

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true)

    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    axios
      .get(`${urls.NRMS}/chargeTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log(";r", r)
        let result = r.data.chargeTypeMasterList
        console.log("result", result)

        let _res = result.map((r, i) => {
          console.log("44")
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,

            chargeTypePrefix: r.chargeTypePrefix,
            chargeName: r.chargeName,
            chargeNameMr: r.chargeNameMr,
            mapWithGlAccountCode: r.mapWithGlAccountCode,
            remark: r.remark,
          }
        })
        setDataSource([..._res])
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        })
        setIsLoading(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  useEffect(() => {
    getData()
  }, [])

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }
    if (btnSaveText === "Save") {
      setIsLoading(true)
      const tempData = axios
        .post(`${urls.NRMS}/chargeTypeMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
            getData()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setFetchData(tempData)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsLoading(false)
          } else {
            setIsLoading(false)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setIsLoading(true)
      const tempData = axios
        .post(`${urls.NRMS}/chargeTypeMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("res", res)
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अपडेट केले!",
                  language === "en"
                    ? "Record Updated successfully!"
                    : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
            getData()
            // setButtonInputState(false);
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)
            setIsLoading(false)
          } else {
            setIsLoading(false)
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  }

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log("body", body)
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          setIsLoading(true)
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.NRMS}/chargeTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                })
                getData()
                // setButtonInputState(false);
                setIsLoading(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setIsLoading(false)
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
          setIsLoading(true)
          axios
            .post(`${urls.NRMS}/chargeTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                })
                getData()
                setIsLoading(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setIsLoading(false)
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
    chargeTypePrefix: "",
    chargeName: "",
    chargeNameMr: "",
    mapWithGlAccountCode: "",
    remark: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    chargeTypePrefix: "",
    chargeName: "",
    chargeNameMr: "",
    mapWithGlAccountCode: "",
    remark: "",

    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    {
      field: "chargeTypePrefix",

      headerName: <FormattedLabel id="chargeprefix" />,
      flex: 1,
    },
    {
      field: "chargeName",

      headerName: <FormattedLabel id="chargeNameE" />,
      flex: 1,
    },
    {
      field: "chargeNameMr",

      headerName: <FormattedLabel id="chargeNameM" />,
      flex: 1,
    },

    {
      field: "mapWithGlAccountCode",

      headerName: <FormattedLabel id="mapGi" />,
      flex: 1,
    },

    {
      field: "remark",

      headerName: <FormattedLabel id="remark" />,
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
            <Tooltip title={language == "en" ? "Edit" : "संपादित करा"}>
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true)

                  console.log("params.row: ", params.row)
                  reset(params.row)
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true)

                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip
                  title={language == "en" ? "Deactivate" : "निष्क्रिय करा"}
                >
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={language == "en" ? "Activate" : "सक्रिय करा"}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </Box>
        )
      },
    },
  ]

  // Row

  return (
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
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="ChargeType" />
            {/* Charge Type */}
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
                <Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        // label="Charge Type Prefix"
                        label={<FormattedLabel id="chargeprefix" required />}
                        multiline
                        variant="standard"
                        {...register("chargeTypePrefix")}
                        error={!!errors.chargeTypePrefix}
                        helperText={
                          errors?.chargeTypePrefix
                            ? errors.chargeTypePrefix.message
                            : null
                        }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"chargeName"}
                          required
                          labelName={<FormattedLabel id="chargeNameE" />}
                          fieldName={"chargeName"}
                          updateFieldName={"chargeNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="chargeNameE" required />}
                          multiline
                          error={!!errors.chargeName}
                          targetError={"chargeNameMr"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("chargeName") ? true : false,
                          }}
                          helperText={
                            errors?.chargeName
                              ? errors.chargeName.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      // label="Charge Name"
                      label={<FormattedLabel id="chargeNameE" required />}
                      multiline
                      variant="standard"
                      {...register("chargeName")}
                      error={!!errors.chargeName}
                      helperText={
                        errors?.chargeName ? errors.chargeName.message : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"chargeNameMr"}
                          required
                          labelName={<FormattedLabel id="chargeNameM" />}
                          fieldName={"chargeNameMr"}
                          updateFieldName={"chargeName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="chargeNameM" required />}
                          multiline
                          error={!!errors.chargeNameMr}
                          targetError={"chargeName"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("chargeNameMr") ? true : false,
                          }}
                          helperText={
                            errors?.chargeNameMr
                              ? errors.chargeNameMr.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      // label="Charge Name Marathi"
                      label={<FormattedLabel id="chargeNameM" required />}
                      multiline
                      variant="standard"
                      {...register("chargeNameMr")}
                      error={!!errors.chargeNameMr}
                      helperText={
                        errors?.chargeNameMr
                          ? errors.chargeNameMr.message
                          : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        // label="map With Gl Account Code"
                        label={<FormattedLabel id="mapGi" required />}
                        multiline
                        variant="standard"
                        {...register("mapWithGlAccountCode")}
                        error={!!errors.mapWithGlAccountCode}
                        helperText={
                          errors?.mapWithGlAccountCode
                            ? errors.mapWithGlAccountCode.message
                            : null
                        }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        // label="remark"
                        label={<FormattedLabel id="remark" required />}
                        multiline
                        variant="standard"
                        {...register("remark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
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
                    <Grid item>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === <FormattedLabel id="update" /> ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="warning"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
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

        {isLoading ? (
          <Loader />
        ) : data?.rows?.length != 0 ? (
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
            pagination
            paginationMode="server"
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

              getData(_data, data.page)
            }}
          />
        ) : (
          ""
        )}
      </Paper>
    </>
  )
}

export default Index
