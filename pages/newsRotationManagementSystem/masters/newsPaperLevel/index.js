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
import schema from "../../../../containers/schema/newsRotationManagementSystem/masters/newsPaperLevel"
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
import Transliteration from "../../../../components/common/linguosol/transliteration"
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

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      newsPaperLevel: "",
      newsPaperLevelMr: "",
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
  //     newsPaperLevel: "",
  //     newsPaperLevelMr: "",
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
  const router = useRouter()
  const groupId = watch("groupId")
  // const subGroupName = watch("subGroupName");
  console.log("sssss", groupId)
  const [rotationGroups, setRotationGroups] = useState([])
  const [selectedrotationGroups, setSelectedrotationGroups] = useState([])

  // const classId = watch("classKey");

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
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    console.log("callllll", value)
    setSelectedrotationGroups(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
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

  useEffect(() => {
    getRotationGroups()
  }, [])

  useEffect(() => {
    if (rotationGroups?.length > 0) {
      getData()
    }
  }, [rotationGroups])

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

    axios
      .get(`${urls.NRMS}/newsPaperLevel/getAll`, {
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
        let _res = r.data.newsPaperLevel.map((r, i) => {
          return {
            ...r,
            srNo: i + 1,
            // rotationGroups:rotationGroups.map(())
            rotationGroupName: rotationGroups
              .filter((rs) =>
                r.rotationGroups?.split(",").includes(rs.id.toString())
              )
              .map((rs) => rs.rotationGroupName),
            rotationGroupNameMr: rotationGroups
              .filter((rs) =>
                r.rotationGroups?.split(",").includes(rs.id.toString())
              )
              .map((rs) => rs.rotationGroupNameMr),
          }
        })
       

        setData({
          rows: _res,
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
    console.log("fromData", fromData)
    // Save - DB
    let rotationGroupss = rotationGroups
      .filter((r) => selectedrotationGroups?.includes(r.rotationGroupName))
      .map((r) => r.id)
    let rotationGroupsGoodToGo = rotationGroupss.toString()
    console.log("rotationGroupsGoodToGo", rotationGroupsGoodToGo)

    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
      rotationGroups: rotationGroupsGoodToGo,
    }

    // if (btnSaveText === "Save") {
    axios
      .post(`${urls.NRMS}/newsPaperLevel/save`, _body, {
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
          setSelectedrotationGroups([])
        }
      })
      .catch((error) => {
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
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता??",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.NRMS}/newsPaperLevel/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
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
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.NRMS}/newsPaperLevel/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
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
    setDeleteButtonState(false)
    setSelectedrotationGroups([])
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
    setSelectedrotationGroups([])
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    newsPaperLevel: "",
    newsPaperLevelMr: "",
    id: null,
  }

  // Reset Values Exit
  const resetValuesExit = {
    newsPaperLevel: "",
    newsPaperLevelMr: "",
    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.5 },
    {
      field: language == "en" ? "rotationGroupName" : "rotationGroupNameMr",
      headerName: <FormattedLabel id="groupName" />,
      flex: 2,
    },
    {
      field: "newsPaperLevel",
      headerName: <FormattedLabel id="newsPaperLevel" />,
      flex: 2,
    },
    {
      field: "newsPaperLevelMr",
      headerName: <FormattedLabel id="newsPaperLevelMr" />,
      flex: 2,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      //   width: 120,
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
                let gg = rotationGroups
                  .filter((rs) =>
                    params?.row?.rotationGroups
                      ?.split(",")
                      .includes(rs?.id.toString())
                  )
                  .map((rs) => rs?.rotationGroupName)
                console.log("gggg::", gg)
                setSelectedrotationGroups(gg)
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
            <FormattedLabel id="newsPaperLevelHeading" />
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
                    {/* news paper*/}
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
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
                        error={!!errors.rotationGroups}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="groupName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-multiple-checkbox-label"
                              id="demo-multiple-checkbox"
                              multiple
                              sx={{ minWidth: 300 }}
                              value={selectedrotationGroups}
                              onChange={handleChange}
                              renderValue={(selected) => selected.join(", ")}
                              MenuProps={MenuProps}
                            >
                              {rotationGroups.map((name) => (
                                <MenuItem
                                  key={name.id}
                                  value={name.rotationGroupName}
                                >
                                  <Checkbox
                                    checked={
                                      selectedrotationGroups.indexOf(
                                        name.rotationGroupName
                                      ) > -1
                                    }
                                  />
                                  <ListItemText
                                    primary={name.rotationGroupName}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                          name="rotationGroups"
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

                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
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
                        <div style={{ width: "300px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"newsPaperLevel"}
                            required
                            labelName={<FormattedLabel id="newsPaperLevel" />}
                            fieldName={"newsPaperLevel"}
                            updateFieldName={"newsPaperLevelMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="newsPaperLevel" required />
                            }
                            multiline
                            error={!!errors.newsPaperLevel}
                            targetError={"newsPaperLevelMr"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("newsPaperLevel") ? true : false,
                            }}
                            helperText={
                              errors?.newsPaperLevel
                                ? errors.newsPaperLevel.message
                                : null
                            }
                          />
                        </div>
                        {/* <TextField
                        // required
                        // disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="newsPaperLevel" required />}
                        multiline
                        variant="standard"
                        {...register("newsPaperLevel")}
                        error={!!errors.newsPaperLevel}
                        helperText={
                          errors?.newsPaperLevel
                            ? errors.newsPaperLevel.message
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
                      sm={4}
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
                        <div style={{ width: "300px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"newsPaperLevelMr"}
                            required
                            labelName={<FormattedLabel id="newsPaperLevelMr" />}
                            fieldName={"newsPaperLevelMr"}
                            updateFieldName={"newsPaperLevel"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="newsPaperLevelMr" required />
                            }
                            multiline
                            error={!!errors.newsPaperLevelMr}
                            targetError={"newsPaperLevel"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("newsPaperLevelMr") ? true : false,
                            }}
                            helperText={
                              errors?.newsPaperLevelMr
                                ? errors.newsPaperLevelMr.message
                                : null
                            }
                          />
                        </div>
                        {/* <TextField
                        // required
                        // disabled={router?.query?.pageMode === "View"}
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel id="newsPaperLevelMr" required />
                        }
                        multiline
                        variant="standard"
                        {...register("newsPaperLevelMr")}
                        error={!!errors.newsPaperLevelMr}
                        helperText={
                          errors?.newsPaperLevelMr
                            ? errors.newsPaperLevelMr.message
                            : null
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
      </Paper>
    </>
  )
}

export default Index
