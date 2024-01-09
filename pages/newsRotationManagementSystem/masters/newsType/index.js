// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/newsType"
import { yupResolver } from "@hookform/resolvers/yup"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import { GridToolbar } from "@mui/x-data-grid"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import { useRouter } from "next/router"
import urls from "../../../../URLS/urls"
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
    defaultValues: {
      newsType: "",
      newsTypeMr: "",
    },
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
  //   defaultValues: {
  //     newsType: "",
  //     newsTypeMr: "",
  //   },
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [rotationGroup, setRotationGroup] = useState(false)
  const [rotationSubGroup, setRotationSubGroup] = useState(false)
  const [subGroup, setSubGroup] = useState(false)
  const [selectedGroupName, setSelectedGroupName] = useState()
  const [newsPaperLevel, setNewsPaperLevel] = useState()
  const [newsLevel, setNewsLevel] = useState()
  const [facilityNameField, setFacilityNameField] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  // const [rotationSubGroup, setClassList] = useState([]);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const groupId = watch("groupId")
  // const subGroupName = watch("subGroupName");
  console.log("sssss", groupId)

  // const classId = watch("classKey");

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

  // Get Table - Data
  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    console.log(
      "_pageSize,_pageNo,_sortBy,sortDir",
      _pageSize,
      _pageNo,
      _sortBy,
      _sortDir
    )
    setIsLoading(true)
    axios
      .get(`${urls.NRMS}/newsType/getAll`, {
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
        let _res = r.data.newsType.map((r, i) => {
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
    // Save - DB

    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }

    // if (btnSaveText === "Save") {
    setIsLoading(true)
    axios
      .post(`${urls.NRMS}/newsType/save`, _body, {
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
    // }
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
        title: language === "en" ? "Deactive?" : "डक्टिव?",
        text:
          language === "en"
            ? "Are you sure you want to deactive this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          setIsLoading(true)
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.NRMS}/newsType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deactived!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे",
                  {
                    icon: "success",
                  }
                )
                getData()
                // setButtonInputState(false);
                setIsLoading(false)
              } else {
                setIsLoading(false)
              }
            })
            .catch((error) => {
              setIsLoading(false)
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
            .post(`${urls.NRMS}/newsType/save`, body, {
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
                // setButtonInputState(false);
                setIsLoading(false)
              }
            })
            .catch((error) => {
              setIsLoading(false)
              callCatchMethod(error, language);
              
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
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
    newsType: "",
    newsTypeMr: "",
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    newsType: "",
    newsTypeMr: "",
    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.2 },
    {
      field: "newsType",
      headerName: <FormattedLabel id="newsType" />,
      flex: 1,
    },
    {
      field: "newsTypeMr",
      headerName: <FormattedLabel id="newsTypeMr" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.3,
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
                  // setButtonInputState(true);
                  console.log("params.row: ", params.row)
                  reset(params.row)
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
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
            <FormattedLabel id="newsTypeHeading" />
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
                  <Grid container sx={{ padding: "40px" }}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.rotationGroupKey}
                      >
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newsType"}
                          required
                          labelName={<FormattedLabel id="newsType" />}
                          fieldName={"newsType"}
                          updateFieldName={"newsTypeMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="newsType" required />}
                          multiline
                          error={!!errors.newsType}
                          targetError={"newsTypeMr"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newsType") ? true : false,
                          }}
                          helperText={
                            errors?.newsType ? errors.newsType.message : null
                          }
                        />
                        {/* <TextField
                        // required
                        // disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="newsType" required />}
                        multiline
                        variant="standard"
                        {...register("newsType")}
                        error={!!errors.newsType}
                        helperText={
                          errors?.newsType ? errors.newsType.message : null
                        }
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.rotationGroupKey}
                      >
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newsTypeMr"}
                          required
                          labelName={<FormattedLabel id="newsTypeMr" />}
                          fieldName={"newsTypeMr"}
                          updateFieldName={"newsType"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="newsTypeMr" required />}
                          multiline
                          error={!!errors.newsTypeMr}
                          targetError={"newsType"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newsTypeMr") ? true : false,
                          }}
                          helperText={
                            errors?.newsTypeMr
                              ? errors.newsTypeMr.message
                              : null
                          }
                        />
                        {/* <TextField
                        // required
                        // disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="newsTypeMr" required />}
                        multiline
                        variant="standard"
                        {...register("newsTypeMr")}
                        error={!!errors.newsTypeMr}
                        helperText={
                          errors?.newsTypeMr ? errors.newsTypeMr.message : null
                        }
                        InputLabelProps={{ shrink: true }}
                      /> */}
                      </FormControl>
                    </Grid>

                    {/* <Divider /> */}
                  </Grid>

                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      // paddingTop: "10px",
                      // marginTop: "10px",
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
