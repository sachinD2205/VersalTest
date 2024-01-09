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
  Modal,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstDefinePartySchema"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../view.module.css"
import theme from "../../../../theme"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

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

  useEffect(() => {
    getAllCommittees()
  }, [])

  // Get Table - Data
  const getAllCommittees = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefinePartyName/getAll`, {
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
          let result = res.data?.definePartyName
          let _res = result?.map((val, i) => {
            console.log("44")
            return {
              activeFlag: val.activeFlag,
              id: val.id,
              srNo: i + 1 + _pageNo * _pageSize,
              partyName: val.partyName,
              partyNameMr: val.partyNameMr,
              ////////////////////
              partyNameShow: newFunctionForNullValues("en", val.partyName),
              partyNameShowMr: newFunctionForNullValues("mr", val.partyNameMr),
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

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,

      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    console.log("420", finalBodyForApi)
    setLoading(true)
    axios
      .post(`${urls.MSURL}/mstDefinePartyName/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getAllCommittees()
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
        //   getAllCommittees()
        //   setButtonInputState(false)

        //   setLoading(false)
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   })
        //   getAllCommittees()
        //   setButtonInputState(false)

        //   setLoading(false)
        // }
        // console.log("error", error);
        getAllCommittees()
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
            .post(`${urls.MSURL}/mstDefinePartyName/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully De-Activated!", {
                  icon: "success",
                })
                getAllCommittees()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);
              getAllCommittees()
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
            .post(`${urls.MSURL}/mstDefinePartyName/save`, body, {
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
                getAllCommittees()
                setButtonInputState(false)
              }
            })
            .catch((error) => {
              // if (error.request.status === 500) {
              //   swal(error.response.data.message, {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // } else {
              //   swal("Something went wrong!", {
              //     icon: "error",
              //   })
              //   getAllCommittees()
              //   setButtonInputState(false)
              // }
              // console.log("error", error);

              getAllCommittees()
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
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    partyName: "",
    partyNameMr: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    partyName: "",
    partyNameMr: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "partyNameShow" : "partyNameShowMr",
      headerName: <FormattedLabel id="partyName" />,
      flex: 1,
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
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.adjustForBread}>
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
              width: "100%",
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
              <FormattedLabel id="defineParty" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
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
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          _key={"partyName"}
                          fieldName={"partyName"}
                          updateFieldName={"partyNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="partyNameEn" required />}
                          error={!!errors.partyName}
                          targetError={"partyNameMr"}
                          helperText={
                            errors?.partyName ? errors?.partyName.message : null
                          }
                          autoFocus={"autoFocus"}
                        />
                      </Box>
                    </Grid>
                    {/* ////////////////////// */}
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
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          _key={"partyNameMr"}
                          fieldName={"partyNameMr"}
                          updateFieldName={"partyName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="partyNameMr" required />}
                          error={!!errors.partyNameMr}
                          targetError={"partyName"}
                          helperText={
                            errors?.partyNameMr
                              ? errors.partyNameMr.message
                              : null
                          }
                        />
                      </Box>
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
              </FormProvider>
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
            <Loader />
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
                  getAllCommittees(data?.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)

                  getAllCommittees(_data, data?.page)
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
