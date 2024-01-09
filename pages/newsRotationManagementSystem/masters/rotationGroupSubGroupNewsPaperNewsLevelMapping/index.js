// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
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
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/rotationGroupSubGroupNewsPaperNewsLevelMapping"
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
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

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
      newsType: "",
      newsTypeMr: "",
    },
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
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
  const [rotationGroups, setRotationGroups] = useState([])
  const [rotationSubGroups, setRotationSubGroups] = useState([])
  const [newsPaperLevels, setNewsPaperLevels] = useState([])
  const [newsPapers, setNewsPapers] = useState([])
  const [selectedNewsPapers, setSelectedNewsPapers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

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

  const getNewsPapers = () => {
    axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setNewsPapers(r.data.newspaperMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

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
      .get(
        `${urls.NRMS}/rotationGroupSubGroupNewsPaperNewsLevelMapping/getAll`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let _res = r?.data?.rotationGroupSubGroupNewsPaperNewsLevelMapping?.map(
          (r, i) => {
            return {
              ...r,
              srNo: i + 1,
              // rotationGroupName: rotationGroups?.find((f) => r.rotationGroup === f.id)?.rotationGroupName,
              // rotationGroupNameMr: rotationGroups?.find((f) => r.rotationGroup === f.id)?.rotationGroupNameMr,
              // newspaperName: newsPapers
              //   .filter((rs) => r.newsPapers.split(",").includes(rs.id.toString()))
              //   .map((rs) => rs.newspaperName),
              // newspaperNameMr: newsPapers
              //   .filter((rs) => r.newsPapers.split(",").includes(rs.id.toString()))
              //   .map((rs) => rs.newspaperNameMr),
              // newsPaperLevelName: newsPaperLevels?.find((f) => r.newsPaperLevel == f.id)?.newsPaperLevel,
              // newsPaperLevelNameMr: newsPaperLevels?.find((f) => r.newsPaperLevel == f.id)?.newsPaperLevelMr,
            }
          }
        )
        console.log(";r;", _res)
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

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)
    let nps = newsPapers
      .filter((r) => selectedNewsPapers?.includes(r.newspaperName))
      .map((r) => r.id)
    let stringggg = nps.toString()
    console.log("nps.toString()", stringggg)
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
      newsPapers: "," + stringggg,
    }

    console.log("selectedNewsPapers", selectedNewsPapers)
    console.log("newsPapers", nps)
    console.log("_body", _body)

    axios
      .post(
        `${urls.NRMS}/rotationGroupSubGroupNewsPaperNewsLevelMapping/save`,
        _body,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
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
        }
      })
      .catch((error) => {
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
            .post(
              `${urls.NRMS}/rotationGroupSubGroupNewsPaperNewsLevelMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res)
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
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(
              `${urls.NRMS}/rotationGroupSubGroupNewsPaperNewsLevelMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res)
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
    setDeleteButtonState(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
    setSelectedNewsPapers([])
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    newsType: "",
    newsTypeMr: "",
    id: null,

    // rotationGroup
    // rotationSubGroup
    // newsPaperLevel
  }

  // Reset Values Exit
  const resetValuesExit = {
    newsType: "",
    newsTypeMr: "",
    selectedNewsPapers: [],
    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.3 },
    {
      field: language == "en" ? "rotationGroupName" : "rotationGroupNameMr",
      headerName: <FormattedLabel id="groupName" />,
      flex: 0.7,
    },
    {
      field:
        language == "en" ? "rotationSubGroupName" : "rotationSubGroupNameMr",
      headerName: <FormattedLabel id="subGroup" />,
      flex: 0.7,
    },

    {
      field: language == "en" ? "newsPaperLevelName" : "newsPaperLevelNameMr",
      headerName: <FormattedLabel id="paperLevel" />,
      flex: 0.7,
    },
    {
      field: language == "en" ? "newsPapersNames" : "newsPapersNamesMr",
      headerName: <FormattedLabel id="newsPaperDropDown" />,
      flex: 2,
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
                reset(params.row)
                getRotationSubGroupsByGroup(params.row.rotationGroup)
                getNewsPaperLevels(params.row.rotationGroup)
                setSelectedNewsPapers(params.row.newsPapersNames.split(","))
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    console.log("callllll", value)
    setSelectedNewsPapers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
  }

  useEffect(() => {
    getNewsPapers()
    getRotationGroups()
    getData()
  }, [])

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
            <FormattedLabel id="rotationMaping" />
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
                    {/* rotation grp*/}
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
                        error={!!errors.rotationGroup}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="groupName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
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
                          name="rotationGroup"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.rotationGroup
                            ? errors.rotationGroup.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* rotation sub grp*/}
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
                        error={!!errors.rotationSubGroup}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="subGroup" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
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
                          name="rotationSubGroup"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.rotationSubGroup
                            ? errors.rotationSubGroup.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* news paper level grp*/}
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
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              {...field}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
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
                    {/* news paper*/}
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
                        error={!!errors.newsPapers}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="newsPaperDropDown" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              multiple
                              sx={{ minWidth: 220 }}
                              value={selectedNewsPapers}
                              onChange={
                                // (value) => {
                                handleChange
                                // field.onChange(value);
                                // }
                              }
                              // input={<OutlinedInput label="Tag" />}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={MenuProps}
                            >
                              {newsPapers.map((name) => (
                                <MenuItem
                                  key={name.id}
                                  value={name.newspaperName}
                                >
                                  <Checkbox
                                    checked={
                                      selectedNewsPapers.indexOf(
                                        name.newspaperName
                                      ) > -1
                                    }
                                  />
                                  <ListItemText primary={name.newspaperName} />
                                </MenuItem>
                              ))}
                            </Select>

                            /*                                                     <Select
                                                                                                            multiple
                                                                                                            sx={{ minWidth: 220 }}
                                                                                                            labelId="demo-simple-select-standard-label"
                                                                                                            id="demo-simple-select-standard"
                                                                                                            {...field}
                                                                                                            value={field.value}
                                                                                                            onChange={(value) => {
                                                                                                                field.onChange(value);
                                                                                                            }}
                                                                                                        >
                                                                                                            {newsPapers &&
                                                                                                                newsPapers.map((newsPaper, index) => (
                                                                                                                    <MenuItem key={index} value={newsPaper.id}>
                                                                                                                        {language == 'en' ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
                                                                                                                    </MenuItem>
                                                                                                                ))}
                                                                                                        </Select> */
                          )}
                          name="newsPapers"
                          control={control}
                          defaultValue={[]}
                        />
                        <FormHelperText>
                          {errors?.newsPapers
                            ? errors.newsPapers.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      marginTop: "10px",
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
          <>
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
          </>
        ) : (
          ""
        )}
      </Paper>
    </>
  )
}

export default Index
