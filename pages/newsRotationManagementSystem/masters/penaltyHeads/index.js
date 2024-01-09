// import { yupResolver } from "@hookforpostm/resolvers/yup";
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
  Checkbox,
  FormControl,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
  Typography,
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
import Loader from "../../../../containers/Layout/components/Loader"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/penaltyHeads"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      advertisementType: "",
      advertisementTypeMr: "",
    },
  })
  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   setValue,
  //   //
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  //   defaultValues: {
  //     advertisementType: "",
  //     advertisementTypeMr: "",
  //   },
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const groupId = watch("groupId")
  console.log("sssss", groupId)
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    getData()
  }, [])

  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    setIsLoading(true)
    console.log(
      "_pageSize,_pageNo,_sortBy,sortDir",
      _pageSize,
      _pageNo,
      _sortBy,
      _sortDir
    )
    axios
      .get(`${urls.NRMS}/mstPenaltyHeads/getAll`, {
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
      .then((r) => {
        console.log(";r", r)
        let _res = r.data.mstPenaltyHeads.map((r, i) => {
          return {
            ...r,
            srNo: i + 1,
          }
        })
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
        setIsLoading(false)
        callCatchMethod(error, language);
      })
  }

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }

    setIsLoading(true)
    axios
      .post(`${urls.NRMS}/mstPenaltyHeads/save`, _body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
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
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }

    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to deactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          setIsLoading(true)
          axios
            .post(`${urls.NRMS}/mstPenaltyHeads/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे",
                  {
                    icon: "success",
                  }
                )
                getData()
                setIsLoading(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
          setIsLoading(false)
        }
      })
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          setIsLoading(true)
          axios
            .post(`${urls.NRMS}/mstPenaltyHeads/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे",
                  {
                    icon: "success",
                  }
                )
                getData()
                setIsLoading(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
          setIsLoading(false)
        }
      })
    }
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

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    advertisementType: "",
    advertisementTypeMr: "",
    id: null,
  }

  const resetValuesExit = {
    advertisementType: "",
    advertisementTypeMr: "",
    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    // {
    //   field: "pointNo",
    //   headerName: <FormattedLabel id="pointNo" />,
    //   flex: 1,
    // },
    {
      field: "pointDesc",
      headerName: <FormattedLabel id="pointDesc" />,
      flex: 3,
    },
    {
      field: "pointDescMr",
      headerName: <FormattedLabel id="pointDescMr" />,
      flex: 3,
    },
    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      flex: 2,
    },
    {
      field: "isFixed",
      headerName: <FormattedLabel id="isFixed" />,
      flex: 2,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      // width: 120,
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
            <FormattedLabel id="penaltyHeadsHeading" />
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
                  <Grid container spacing={5} sx={{ padding: "40px" }}>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="small"
                        error={!!errors.pointNo}
                      >
                        <TextField
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          label={<FormattedLabel id="pointNo" required />}
                          // multiline
                          variant="standard"
                          type="number"
                          // value={0}
                          {...register("pointNo")}
                          error={!!errors.pointNo}
                          helperText={
                            errors?.pointNo ? errors.pointNo.message : null
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="small"
                        error={!!errors.pointDesc}
                      >
                        <div style={{ width: "300px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"pointDesc"}
                            required
                            labelName={<FormattedLabel id="pointDesc" />}
                            fieldName={"pointDesc"}
                            updateFieldName={"pointDescMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="pointDesc" required />}
                            multiline
                            error={!!errors.pointDesc}
                            targetError={"pointDescMr"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("pointDesc") ? true : false,
                            }}
                            helperText={
                              errors?.pointDesc
                                ? errors.pointDesc.message
                                : null
                            }
                          />
                        </div>
                        {/* <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="pointDesc" required />}
                        // multiline
                        variant="standard"
                        {...register("pointDesc")}
                        error={!!errors.pointDesc}
                        helperText={
                          errors?.pointDesc ? errors.pointDesc.message : null
                        }
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="small"
                        error={!!errors.pointDescMr}
                      >
                        <div style={{ width: "300px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"pointDescMr"}
                            required
                            labelName={<FormattedLabel id="pointDescMr" />}
                            fieldName={"pointDescMr"}
                            updateFieldName={"pointDesc"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="pointDescMr" required />}
                            multiline
                            error={!!errors.pointDescMr}
                            targetError={"pointDesc"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("pointDescMr") ? true : false,
                            }}
                            helperText={
                              errors?.pointDescMr
                                ? errors.pointDescMr.message
                                : null
                            }
                          />
                        </div>
                        {/* <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="pointDescMr" required />}
                        // multiline
                        variant="standard"
                        {...register("pointDescMr")}
                        error={!!errors.pointDescMr}
                        helperText={
                          errors?.pointDescMr
                            ? errors.pointDescMr.message
                            : null
                        }
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="small"
                        error={!!errors.rate}
                      >
                        <TextField
                          sx={{ width: 300 }}
                          id="standard-textarea"
                          label={<FormattedLabel id="rate" />}
                          // multiline
                          variant="standard"
                          {...register("rate")}
                          error={!!errors.rate}
                          helperText={errors?.rate ? errors.rate.message : null}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        size="small"
                        error={!!errors.isFixed}
                      >
                        <Typography>
                          <Checkbox
                            // label={<FormattedLabel id="isFixed" required />}
                            onChange={(e) =>
                              setValue("isFixed", e.target.checked)
                            }
                            checked={watch("isFixed")}
                          />
                          <FormattedLabel id="isFixed" />
                        </Typography>
                        {/* <TextField
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="isFixed" required />}
                        // multiline
                        variant="standard"
                        {...register("isFixed")}
                        error={!!errors.isFixed}
                        helperText={
                          errors?.isFixed ? errors.isFixed.message : null
                        }
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
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
                        {btnSaveText === "Update" ? (
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
