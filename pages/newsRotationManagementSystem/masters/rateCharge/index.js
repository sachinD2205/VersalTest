import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
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
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/rateCharge"
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
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
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
    defaultValues: {
      newsPaperGroupKey: "",
      newsPaperSubGroupKey: "",
      newsPaperLevel: "",
      newsPaperName: "",
      chargeType: "",
      amount: null,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [id, setID] = useState()
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [rotationGroups, setRotationGroups] = useState([])
  const [rotationSubGroups, setRotationSubGroups] = useState([])
  const [newsPaperLevels, setNewsPaperLevels] = useState([])
  const [newsPapers, setNewsPapers] = useState([])
  const [chargeTypes, setChargeTypes] = useState([])

  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedSubGroupId, setSelectedSubGroupId] = useState(null)
  const [selectedNewsPaperLevelId, setSelectedNewsPaperLevelId] = useState(null)
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
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  // Get Table - Data
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
      .get(`${urls.NRMS}/rateChargeMaster/getAll`, {
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
        let _res = r.data.rateChargeMasterList.map((r, i) => {
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
        callCatchMethod(error, language);
      })
  }

  const getRotationGroups = () => {
    axios
      .get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("a:a", r)
        setRotationGroups(r.data.newspaperRotationGroupMasterList)
        // console.log("res.data", r.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getRotationSubGroupsByGroup = (value) => {
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

  const getNewsPaperLevels = (value) => {
    axios
      .get(`${urls.NRMS}/newsPaperLevel/getByRotationGroup?groupId=${value}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res.data1npl", res.data)
        setNewsPaperLevels(res.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNewsPapers = (value) => {
    if(selectedGroupId && selectedSubGroupId && value){
    axios
      .get(
        `${urls.NRMS}/newspaperMaster/getNewsPaperByNewsPaperLevelAndMuchMore?groupId=${selectedGroupId}&subGroupId=${selectedSubGroupId}&newsPaperLevel=${value}`,
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
  }

  const getChargeType = () => {
    axios
      .get(`${urls.NRMS}/chargeTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setChargeTypes(r.data.chargeTypeMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  useEffect(() => {
    getRotationGroups()
    getChargeType()
    getData()
  }, [])

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }

    axios
      .post(`${urls.NRMS}/rateChargeMaster/save`, _body, {
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
    console.log("body", body)
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
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/rateChargeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
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
          axios
            .post(`${urls.NRMS}/rateChargeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                })
                getData()
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
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
    newsPaperLevel: "",
    amount: null,
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    newsPaperLevel: "",
    amount: "",
    id: null,
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.5,
    },
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
      field: `${
        language === "en" ? "newsPaperLevelTxt" : "newsPaperLevelTxtMr"
      }`,
      headerName: <FormattedLabel id="newsPaperLevelDropDown" />,
      flex: 1,
    },
    {
      field: `${language === "en" ? "newsPaperNameTxt" : "newsPaperNameTxtMr"}`,
      headerName: <FormattedLabel id="newsPaperDropDown" />,
      flex: 1.5,
    },

    {
      field: `${language === "en" ? "chargeTypeTxt" : "chargeTypeTxtMr"}`,
      headerName: <FormattedLabel id="chargeType" />,
      flex: 1,
    },
    {
      field: "amount",
      headerName: <FormattedLabel id="chargeAmount" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
                // setButtonInputState(true);
                console.log("params.row: ", params.row)
                setSelectedGroupId(params.row.newsPaperGroupKey)
                setSelectedSubGroupId(params.row.newsPaperSubGroupKey)
                setSelectedNewsPaperLevelId(params.row.newsPaperLevel)

                getRotationSubGroupsByGroup(params.row.newsPaperGroupKey)

                getNewsPaperLevels(params.row.newsPaperGroupKey)

                getNewsPapers(params.row.newsPaperLevel)

                reset(params.row)
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
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
            <FormattedLabel id="rateChartHeading" />
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
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
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
                          {<FormattedLabel id="groupName" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 330 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                setSelectedGroupId(value.target.value)
                                getRotationSubGroupsByGroup(value.target.value)
                                getNewsPaperLevels(value.target.value)
                              }}
                            >
                              {rotationGroups &&
                                rotationGroups.map(
                                  (rotationGroupName, index) => (
                                    <MenuItem
                                      key={index}
                                      value={rotationGroupName.id}
                                    >
                                      {language == "en"
                                        ? rotationGroupName.rotationGroupName
                                        : rotationGroupName.rotationGroupNameMr}
                                    </MenuItem>
                                  )
                                )}
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
                      sm={12}
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
                          {<FormattedLabel id="subGroup" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 330 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                setSelectedSubGroupId(value.target.value)
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
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
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
                          {
                            <FormattedLabel
                              id="newsPaperLevelDropDown"
                              required
                            />
                          }
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 330 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                setSelectedNewsPaperLevelId(value.target.value)
                                getNewsPapers(value.target.value)
                              }}
                            >
                              {newsPaperLevels &&
                                newsPaperLevels.map((newsPaperLevel, index) => (
                                  <MenuItem
                                    key={index}
                                    value={newsPaperLevel.id}
                                  >
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
                        error={!!errors.newsPaperName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="newsPaperDropDown" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 330 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
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
                          name="newsPaperName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.newsPaperName
                            ? errors.newsPaperName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
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
                        error={!!errors.chargeType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="chargeType" required />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 330 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                            >
                              {chargeTypes &&
                                chargeTypes.map((chargeType, index) => (
                                  <MenuItem key={index} value={chargeType.id}>
                                    {language == "en"
                                      ? chargeType.chargeName
                                      : chargeType.chargeNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="chargeType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.chargeType
                            ? errors.chargeType.message
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
                        error={!!errors.amount}
                      >
                        <TextField
                          // required
                          // disabled={router?.query?.pageMode === "View"}
                          sx={{ minWidth: 330 }}
                          id="standard-textarea"
                          label={<FormattedLabel id="chargeAmount" required />}
                          multiline
                          variant="standard"
                          {...register("amount")}
                          error={!!errors.amount}
                          helperText={
                            errors?.amount ? errors.amount.message : null
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    // spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                      <Button
                        sx={{
                          marginLeft: "300px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
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

                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                      <Button
                        sx={{ marginLeft: "150px" }}
                        variant="contained"
                        color="warning"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>

                    <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
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
