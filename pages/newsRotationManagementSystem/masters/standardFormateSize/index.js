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
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/standardFormatSize"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })

  const router = useRouter()
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()
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
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedSubGroupId, setSelectedSubGroupId] = useState(null)

  const [rotationGroup, setRotationGroup] = useState([])
  const [rotationSubGroups, setRotationSubGroups] = useState()
  const [newsPaperLevels, setNewsPaperLevels] = useState([])
  const [newsPapers, setNewsPapers] = useState([])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  // Rotation Group
  const getRotationGroup = () => {
    axios
      .get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setRotationGroup(
          r.data.newspaperRotationGroupMasterList.map((row) => ({
            id: row.id,
            rotationGroupName: row.rotationGroupName,
            groupId: row.groupId,
            rotationGroupKey: row.rotationGroupKey,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // Rotation Sub Group
  const getRotationSubGroup = (value) => {
    axios
      .get(
        `${urls.NRMS}/newspaperRotationSubGroupMaster/getByGroupId?groupId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setRotationSubGroups(r.data.newspaperRotationSubGroupMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNewsPaperLevels = (groupId, value) => {
    axios
      .get(
        `${urls.NRMS}/newsPaperLevel/getByRotationSubGroup?groupId=${groupId}&subGroupId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setNewsPaperLevels(res.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNewsPaperOriginal = (groupId, subGroupId, value) => {
    axios
      .get(
        `${urls.NRMS}/newspaperMaster/getNewsPaperByNewsPaperLevelAndMuchMore?groupId=${groupId}&subGroupId=${subGroupId}&newsPaperLevel=${value}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setNewsPapers(r.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getData = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    axios
      .get(`${urls.NRMS}/newsStandardFormatSizeMst/getAll`, {
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
        setData({
          rows: r.data.newsStandardFormatSizeMstList.map((r, i) => {
            return {
              ...r,
              srNo: i + 1,
            }
          }),
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        })
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }
    axios
      .post(`${urls.NRMS}/newsStandardFormatSizeMst/save`, _body, {
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
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.NRMS}/newsStandardFormatSizeMst/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deleted!"
                    : "रेकॉर्ड यशस्वीरित्या हटवले आहे",
                  {
                    icon: "success",
                  }
                )
                getData()
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
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
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/newsStandardFormatSizeMst/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })

            // .delete(`${urls.NRMS}/newsStandardFormatSizeMstList/delete/${body.id}`)
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे",
                  {
                    icon: "success",
                  }
                )
                // getPaymentRate();
                getData()
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे")
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
    // setDeleteButtonState(false);
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
    address: "",
    contactNumber: "",
    emailId: "",
    newspaperAgencyName: "",
    newspaperLevel: "",
    newspaperName: "",
    remark: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    address: "",
    contactNumber: "",
    emailId: "",
    newspaperAgencyName: "",
    newspaperLevel: "",
    newspaperName: "",
    remark: "",

    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    {
      field: `${
        language === "en" ? "newsPaperGroupName" : "newsPaperGroupNameMr"
      }`,
      headerName: <FormattedLabel id="groupName" />,
      flex: 1,
    },
    {
      field: `${
        language === "en" ? "newsPaperSubGroupName" : "newsPaperSubGroupNameMr"
      }`,
      headerName: <FormattedLabel id="subGroup" />,
      flex: 1,
    },
    {
      field: `${language === "en" ? "newsPaperNameTxt" : "newsPaperNameTxtMr"}`,
      headerName: <FormattedLabel id="newsPaperDropDown" />,
      flex: 1,
    },
    {
      field: `${
        language === "en" ? "newsPaperLevelTxt" : "newsPaperLevelTxtMr"
      }`,
      headerName: <FormattedLabel id="newsPaperLevelDropDown" />,
      flex: 1,
    },
    {
      field: "standardFormatSize",
      headerName: <FormattedLabel id="standardFormatSizeLabel" />,
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
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)

                setSelectedGroupId(params.row.newsPaperGroupKey),
                  setSelectedSubGroupId(params.row.newsPaperSubGroupKey),
                  getRotationSubGroup(params.row.newsPaperGroupKey)

                getNewsPaperLevels(
                  params.row.newsPaperGroupKey,
                  params.row.newsPaperSubGroupKey
                )

                getNewsPaperOriginal(
                  params.row.newsPaperGroupKey,
                  params.row.newsPaperSubGroupKey,
                  params.row.newsPaperLevel
                )

                reset(params.row)
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                // setButtonInputState(true);
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
          </Box>
        )
      },
    },
  ]

  useEffect(() => {
    getRotationGroup()
    getData()
  }, [])

  // Row
  return (
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
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="standardFormatSizeLabel" />
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
                  {/* news Paper */}
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
                      error={!!errors.newsPaperGroupKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="groupName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              setSelectedGroupId(value.target.value)
                              getRotationSubGroup(value.target.value)
                            }}
                          >
                            {rotationGroup &&
                              rotationGroup.map((rotationGroupName, index) => (
                                <MenuItem
                                  key={index}
                                  value={rotationGroupName.id}
                                >
                                  {language == "en"
                                    ? rotationGroupName.rotationGroupName
                                    : rotationGroupName.rotationGroupNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newsPaperGroupKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.newsPaperGroupKey
                          ? errors.newsPaperGroupKey.message
                          : null}
                      </FormHelperText>
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
                      error={!!errors.newsPaperSubGroupKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="subGroup" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              setSelectedSubGroupId(value.target.value)
                              getNewsPaperLevels(
                                selectedGroupId,
                                value.target.value
                              )
                            }}
                          >
                            {rotationSubGroups &&
                              rotationSubGroups.map(
                                (rotationGroupName, index) => (
                                  <MenuItem
                                    key={index}
                                    value={rotationGroupName.id}
                                  >
                                    {language == "en"
                                      ? rotationGroupName.rotationSubGroupName
                                      : rotationGroupName.rotationSubGroupNameMr}
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        )}
                        name="newsPaperSubGroupKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.newsPaperSubGroupKey
                          ? errors.newsPaperSubGroupKey.message
                          : null}
                      </FormHelperText>
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
                      error={!!errors.newsPaperLevel}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="newsPaperLevelDropDown" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 300 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            {...field}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              getNewsPaperOriginal(
                                selectedGroupId,
                                selectedSubGroupId,
                                value.target.value
                              )
                            }}
                          >
                            {newsPaperLevels &&
                              newsPaperLevels.map((newsPaperLevel, index) => (
                                <MenuItem key={index} value={newsPaperLevel.id}>
                                  {language == "en"
                                    ? newsPaperLevel.newsPaperLevel
                                    : newsPaperLevel.newsPaperLevelMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newsPaperLevel"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.newsPaperLevel
                          ? errors.newsPaperLevel.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    p={1}
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
                      error={!!errors.newsPaper}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="newsPaperName" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={
                              router?.query?.pageMode === "View" ||
                              router?.query?.pageMode === "PROCESS"
                            }
                            sx={{ width: 300 }}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              // setSelectedNewsPaper(value.target.value);
                              // getStandardFormatSize(value.target.value);
                            }}
                          >
                            {newsPapers &&
                              newsPapers.map((newsPaper, index) => (
                                <MenuItem key={index} value={newsPaper.id}>
                                  {language == "en"
                                    ? newsPaper.newspaperName
                                    : newsPaper.newspaperNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="newsPaper"
                        control={control}
                        defaultValue=""
                        InputLabelProps={{
                          shrink: watch("newsPaper") ? true : false,
                        }}
                      />
                      <FormHelperText>
                        {errors?.newsPaper ? errors.newsPaper.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* format size */}
                  <Grid
                    item
                    xl={6}
                    lg={6}
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
                      // required
                      // disabled={router?.query?.pageMode === "View"}
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      // value={inputData}
                      label={<FormattedLabel id="standardFormatSize" />}
                      multiline
                      variant="standard"
                      {...register("standardFormatSize")}
                      error={!!errors.standardFormatSize}
                      helperText={
                        errors?.standardFormatSize
                          ? errors.standardFormatSize.message
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
          // type='primary'
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesExit,
            })
            setEditButtonInputState(true)
            // setDeleteButtonState(true);
            setBtnSaveText("Save")
            setButtonInputState(true)
            setSlideChecked(true)
            setIsOpenCollapse(!isOpenCollapse)
          }}
        >
          <FormattedLabel id="addNew" />
        </Button>
      </div>

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
          // marginLeft: 5,
          // marginRight: 5,
          // marginTop: 5,
          // marginBottom: 5,

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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
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
          // updateData("page", 1);
          getData(_data, data.page)
        }}
      />
    </Paper>
  )
}

export default Index
