import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import { useRouter } from "next/router"
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import BasicLayout from "../../../../containers/Layout/BasicLayout"
// import styles from "../court/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/court.module.css"
import sweetAlert from "sweetalert"

import { GridToolbar } from "@mui/x-data-grid"
import { border } from "@mui/system"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import { ElevatorOutlined } from "@mui/icons-material"
import { useSelector } from "react-redux"
import urls from "../../../../URLS/urls"
import { EyeFilled } from "@ant-design/icons"
import schema from "../../../../containers/schema/SlbSchema/parameterSchema"

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })
  const router = useRouter()

  const [btnSaveText, setBtnSaveText] = useState("Save")

  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [moduleNames, setModuleName] = useState([])

  const language = useSelector((state) => state.labels.language)
  let user = useSelector((state) => state.user.user)

  // const [data, setData] = useState({
  //   rows: [],
  //   totalRows: 0,
  //   rowsPerPageOptions: [10, 20, 50, 100],
  //   pageSize: 10,
  //   page: 1,column
  // });
  const [data, setData] = useState([])

  useEffect(() => {
    getParameter()
  }, [moduleNames])

  // get Module Name
  const getModuleName = () => {
    axios
      .get(`${urls.SLB}/module/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setModuleName(
          res?.data?.moduleList?.map((r, i) => ({
            id: r.id,
            // name: r.name,
            moduleName: r.moduleName,
          }))
        )
      })
  }

  useEffect(() => {
    getModuleName()
  }, [])

  // get Parameter
  const getParameter = () => {
    axios
      .get(`${urls.SLB}/parameter/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        // let result = r.data.parameter;

        // setData(r.data.parameterList)
        setData(
          r.data.parameterList.map((res, i) => ({
            srNo: i + 1,
            id: res.id,
            parameterName: res.parameterName,
            moduleKey: res.moduleKey,
            benchmarkType: res.benchmarkType,
            calculationMethod: res.calculationMethod,
            benchmarkValue: res.benchmarkValue,
            activeFlag: res.activeFlag,
            frequency: res.frequency,
            showYn: res.showYn,

            // get module name from module key using moduleNames array
            moduleName: moduleNames.find(
              (module) => module.id === res.moduleKey
            )?.moduleName,
          }))
        )

        // res.data.caseMainType.map((r, i) => ({
        //   id: r.id,
        //   // caseMainType: r.caseMainType,
        //   caseMainType: r.caseMainType,
        //   caseMainTypeMr: r.caseMainTypeMr,
        // }))
      })
  }

  useEffect(() => {
    getParameter()
  }, [moduleNames])

  // New
  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,

      // activeFlag: /* btnSaveText === "Update" ? null :  */ fromData.activeFlag,
    }
    if (btnSaveText === "Save") {
      const { id, ...newBody } = fromData
      let _body = {
        ...newBody,
      }
      const tempData = axios
        .post(`${urls.SLB}/parameter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            let title = language == "en" ? "Saved!" : "जतन केले गेले!"
            let text =
              language == "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले गेले !"
            sweetAlert(title, text, "success")
            getParameter()
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setFetchData(tempData)
            setEditButtonInputState(false)
            setDeleteButtonState(false)
          }
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.SLB}/parameter/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            let title = ""
            let text = ""
            if (language == "en") {
              if (FormData.id) {
                title = "Updated!"
                text = "Record Updated successfully !"
              } else {
                title = "Saved!"
                text = "Record Saved successfully !"
              }
            } else {
              if (FormData.id) {
                title = "अपडेट केले गेले!"
                text = "रेकॉर्ड यशस्वीरित्या अपडेट केले गेले !"
              } else {
                title = "जतन केले गेले!"
                text = "रेकॉर्ड यशस्वीरित्या जतन केले गेले !"
              }
            }
            sweetAlert(title, text, "success")
            // setButtonInputState(false);
            setEditButtonInputState(false)
            setDeleteButtonState(false)
            setIsOpenCollapse(false)

            getParameter()
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
    parameterName: "",
    benchmarkType: "",
    benchmarkValue: "",
    calculationMethod: "",
    frequency: "",
    moduleKey: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    // module: "",
    moduleName: "",
    parameterName: "",

    id: null,
  }

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      //activeFlag: _activeFlag,
      id: value,
    }
    if (_activeFlag === "N") {
      let title = language == "en" ? "Inactivate?" : "निष्क्रिय करा?"
      let text =
        language == "en"
          ? "Are you sure you want to inactivate this Record ?"
          : "तुम्हाला खात्री आहे की तुम्ही हा रेकॉर्ड निष्क्रिय करू इच्छिता?"
      swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLB}/parameter/inactivate?id=` + value, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                let title =
                  language == "en"
                    ? "Record is Successfully InActivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केला गेला आहे!"
                swal(title, {
                  icon: "success",
                })
                getParameter()
              }
            })
        } else if (willDelete == null) {
          //swal("Record is Safe");
        }
      })
    } else {
      let title = language == "en" ? "Activate?" : "सक्रिय करा?"
      let text =
        language == "en"
          ? "Are you sure you want to activate this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही हा रेकॉर्ड सक्रिय करू इच्छिता?"
      swal({
        title: title,
        text: text,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLB}/parameter/activate?id=` + value, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                let title =
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!"
                swal(title, {
                  icon: "success",
                })
                getParameter()
              }
            })
        } else if (willDelete == null) {
          //swal("Record is Safe");
        }
      })
    }
  }

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr. No." : "क्र.",
      headerAlign: "left",
      align: "left",
      width: 30,
      // flex: 1,
      // flex: 1
    },
    // {
    //   field: "showYn",
    //   headerName: "showYn",
    // },
    // { field: "courtNo", headerName: "Court No", flex: 1 },

    {
      field: "moduleName",
      headerName: language == "en" ? "Module Name" : "मॉड्यूलचे नाव",
      headerAlign: "left",
      align: "left",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.moduleName} placement="top">
          <span>{params.row.moduleName}</span>
        </Tooltip>
      ),
      // flex: 1,
    },
    {
      field: "parameterName",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: language == "en" ? "Parameter Name" : "पॅरामीटरचे नाव",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      flex: 1,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => (
        <Tooltip title={params.row.parameterName} placement="top">
          <span>{params.row.parameterName}</span>
        </Tooltip>
      ),
    },
    {
      field: "calculationMethod",
      headerName: language == "en" ? "Calculation Method" : "गणना पद्धत",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "benchmarkType",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: language == "en" ? "Benchmark Type" : "बेंचमार्क प्रकार",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "benchmarkValue",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: language == "en" ? "Benchmark Value" : "बेंचमार्क मूल्य",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "frequency",
      // field: language === "en" ? "courtName" : "courtMr",
      headerName: language == "en" ? "Frequency" : "वारंवारता",
      // headerName: <FormattedLabel id="courtName" />,
      // flex: 1,
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "actions",
      headerName: language == "en" ? "Actions" : "क्रिया",
      flex: 1,
      sortable: false,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/* Edit Icon */}
            <IconButton
              title="Edit"
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                reset(params.row)
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              title={params.row.showYn == "N" ? "Activate" : "Inactivate"}
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
              {params.row.showYn == "N" ? (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              ) : (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
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
    // <BasicLayout>
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        justifyContent: "center",
        alignContent: "center",
        // marginLeft: "10px",
        // marginRight: "10px",
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
        <h2>{language == "en" ? "Parameter" : "पॅरामीटर"}</h2>

        {/* <h2><FormattedLabel id="parameter"/> </h2> */}
      </Box>

      <Divider />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Grid
                container
                sx={{
                  // marginLeft: "30px",
                  justifyContent: "center",
                  alignContent: "center",
                  marginTop: "20px",
                }}
              >
                <Grid item xs={1} />
                {/* Module Name */}
                <Grid
                  item
                  // sx={{
                  //   // marginLeft: "48px",
                  //   justifyContent:'center',
                  //   alignContent:"center",
                  // }}
                  xs={2}
                >
                  <FormControl
                    variant="standard"
                    fullWidth
                    error={!!errors.moduleKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {language == "en" ? "Module Name *" : "मॉड्यूलचे नाव *"}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          // sx={{ width: "50%" }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          // label={<FormattedLabel id="caseType" />}
                          label="Module Name"

                          // InputLabelProps={{
                          //   shrink: //true
                          //     (watch("caseMainType") ? true : false) ||
                          //     (router.query.caseMainType ? true : false),
                          // }}
                        >
                          {moduleNames &&
                            moduleNames.map((moduleName, index) => (
                              <MenuItem key={index} value={moduleName.id}>
                                {moduleName.moduleName}

                                {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="moduleKey"
                      control={control}
                      defaultValue=""
                      error={!!errors.moduleKey}
                    />
                    <FormHelperText>
                      {errors?.moduleKey ? errors.moduleKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={2} />

                {/* Parameter  In English*/}
                <Grid
                  item
                  // sx={{
                  //   // marginLeft: "48px",
                  //   justifyContent:'center',
                  //   alignContent:"center",
                  // }}
                  xs={2}
                >
                  <TextField
                    fullWidth
                    // sx={{width:'50%'}}
                    // required
                    id="standard-basic"
                    label={language == "en" ? "Parameter *" : "पॅरामीटर *"}
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("parameterName") ? true : false) ||
                        (router.query.parameterName ? true : false),
                    }}
                    {...register("parameterName")}
                    error={!!errors.parameterName}
                    helperText={
                      errors?.parameterName ? errors.parameterName.message : " "
                    }
                  />
                </Grid>

                <Grid item xs={1} />

                {/* Calculation Method */}
                <Grid
                  item
                  // sx={{
                  //   // marginLeft: "48px",
                  //   justifyContent:'center',
                  //   alignContent:"center",
                  // }}
                  xs={2}
                >
                  <FormControl
                    variant="standard"
                    fullWidth
                    error={!!errors.calculationMethod}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {" "}
                      {language == "en"
                        ? "Calculation Method *"
                        : "गणना पद्धत *"}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          // sx={{ width: "50%" }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Calculation Method *"
                        >
                          <MenuItem value="Normal">
                            Normal[(Sum of Numerators / Sum of
                            Denominators)*100]
                          </MenuItem>
                          <MenuItem value="Addition">
                            Addition([(Sum of Numerators + Sum of Denominators)
                            / Sum of Numerators]*100)
                          </MenuItem>
                          <MenuItem value="Division">
                            Division([(Sum of Numerators - Sum of Denominators)
                            / Sum of Numerators]*100)
                          </MenuItem>
                          <MenuItem value="POSNEG">
                            POSNEG[(Numerator (N) 1 + N 2 - N 3)/(Denominator
                            (D) 1 + D 2 - D 3)*100]
                          </MenuItem>
                          <MenuItem value="RDAutoCalc">
                            RDAutoCalc[(Sum of Numerators / [Sum of
                            Denominators/50])*100]
                          </MenuItem>
                        </Select>
                      )}
                      name="calculationMethod"
                      control={control}
                      defaultValue=""
                      error={!!errors.calculationMethod}
                    />
                    <FormHelperText>
                      {errors?.calculationMethod
                        ? errors.calculationMethod.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* benchmarkType  In English*/}
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth
                    // sx={{width:'50%'}}
                    // required
                    id="standard-basic"
                    label={
                      language == "en"
                        ? "Benchmark Type *"
                        : "बेंचमार्क प्रकार *"
                    }
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("benchmarkType") ? true : false) ||
                        (router.query.benchmarkType ? true : false),
                    }}
                    {...register("benchmarkType")}
                    error={!!errors.benchmarkType}
                    helperText={
                      errors?.benchmarkType ? errors.benchmarkType.message : " "
                    }
                  />
                </Grid>
                <Grid item xs={1} />
                {/* benchmarkType  In English*/}
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth
                    // sx={{width:'50%'}}
                    // required
                    id="standard-basic"
                    label={
                      language == "en"
                        ? "Benchmark Value *"
                        : "बेंचमार्क मूल्य *"
                    }
                    variant="standard"
                    // disabled={isDisabled}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("benchmarkValue") ? true : false) ||
                        (router.query.benchmarkValue ? true : false),
                    }}
                    {...register("benchmarkValue")}
                    error={!!errors.benchmarkValue}
                    helperText={
                      errors?.benchmarkValue
                        ? errors.benchmarkValue.message
                        : " "
                    }
                  />
                </Grid>
                <Grid item xs={1} />
                {/* frequency  In English*/}
                <Grid
                  item
                  // sx={{
                  //   // marginLeft: "48px",
                  //   justifyContent:'center',
                  //   alignContent:"center",
                  // }}
                  xs={2.5}
                >
                  <FormControl
                    variant="standard"
                    fullWidth
                    error={!!errors.frequency}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {language == "en"
                        ? "Data Entry Frequency *"
                        : "डेटा एंट्री वारंवारता *"}{" "}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          // sx={{ width: "50%" }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Frequency"
                        >
                          <MenuItem value="Daily">
                            {language == "en" ? "Daily" : "दररोज"}
                          </MenuItem>
                          <MenuItem value="Weekly">
                            {language == "en" ? "Weekly" : "साप्ताहिक"}
                          </MenuItem>
                          <MenuItem value="Fortnightly">
                            {language == "en" ? "Fortnightly" : "पाक्षिक"}
                          </MenuItem>
                          <MenuItem value="Monthly">
                            {language == "en" ? "Monthly" : "मासिक"}
                          </MenuItem>
                          <MenuItem value="Quarterly">
                            {language == "en" ? "Quarterly" : "त्रैमासिक"}
                          </MenuItem>
                          <MenuItem value="Yearly">
                            {language == "en" ? "Yearly" : "वार्षिक"}
                          </MenuItem>
                        </Select>
                      )}
                      name="frequency"
                      control={control}
                      defaultValue=""
                      error={!!errors.frequency}
                    />
                    <FormHelperText>
                      {errors?.frequency ? errors.frequency.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    paddingTop: "50px",
                  }}
                >
                  <Grid tem xs={1} />
                  <Grid item xs={2}>
                    <Button
                      // sx={{ marginRight: 10 }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      // disabled={
                      //   watch("moduleKey") &&
                      //   watch("parameterName") &&
                      //   watch("benchmarkType") &&
                      //   watch("benchmarkValue") &&
                      //   watch("calculationMethod") &&
                      //   watch("frequency")
                      //     ? false
                      //     : true
                      // }
                      endIcon={<SaveIcon />}
                    >
                      {/* {btnSaveText} */}
                      {btnSaveText === "Update"
                        ? language === "en"
                          ? "Update"
                          : "अपडेट करा"
                        : language === "en"
                        ? "Save"
                        : "जतन करा"}
                    </Button>{" "}
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                      disabled={
                        watch("moduleKey") ||
                        watch("parameterName") ||
                        watch("benchmarkType") ||
                        watch("benchmarkValue") ||
                        watch("calculationMethod") ||
                        watch("frequency")
                          ? false
                          : true
                      }
                    >
                      {/* <FormattedLabel id="clear" /> */}
                      {language == "en" ? "Clear" : "साफ करा"}{" "}
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      {/* <FormattedLabel id="exit" /> */}
                      {language == "en" ? "Exit" : "बाहेर पडा"}{" "}
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
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
          {/* <FormattedLabel id="add" /> */}
          {language == "en" ? "Add" : "जोडा"}{" "}
        </Button>
      </div>

      <DataGrid
        getRowId={(row) => row.srNo}
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
        autoHeight
        sx={{
          // width:"900px",
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
        // autoHeight={true}
        // rowHeight={50}
        // pagination
        // paginationMode="server"
        // loading={data.loading}
        // rowCount={data.totalRows}
        // rowsPerPageOptions={data.rowsPerPageOptions}
        // page={data.page}
        // pageSize={data.pageSize}
        rows={data}
        columns={columns}
        // onPageChange={(_data) => {
        //   getParameter(data.pageSize, _data);
        // }}
        // onPageSizeChange={(_data) => {
        // updateData("page", 1);
        // getParameter(_data, data.page);
        // }}
      />
    </Paper>
    // </BasicLayout>
  )
}

export default Index
