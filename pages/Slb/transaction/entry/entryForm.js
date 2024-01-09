import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material"
import React from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";
// import schema from "../../../../containers/schema/SlbSchema/entryFormSchema";
import schema from "../../../../containers/schema/SlbSchema/entryFormSchema"

// entryFormSchema
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"
import { height } from "@mui/system"
import moment from "moment"
import sweetAlert from "sweetalert"
import { useRouter } from "next/router"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { language } from "../../../../features/labelSlice"
import urls from "../../../../URLS/urls"
import { useSelector } from "react-redux"
import theme from "../../../../theme.js"
import { ContactPageSharp } from "@mui/icons-material"
// import { InputLabel } from '@mui/material';
import DownloadIcon from "@mui/icons-material/Download"

const EntryForm = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  })
  const router = useRouter()
  const [moduleName, setModuleName] = useState([])
  const [selectedModuleName, setSelectedModule] = useState([])
  const [selectParameterKey, setSelectParameterKey] = useState()
  const [selectParameter, setSelectParameter] = useState()
  const [id, setID] = useState()

  const [parameterNameList, setParameterNameList] = useState([])
  const [subParameterName, setSubParameterName] = useState([])
  const [filteredSubParameterName, setFilteredSubParameterName] = useState([])
  const [trnEntry, setTrnEntry] = useState([])
  const [finalEntry, setFinalEntry] = useState([])
  const [zoneList, setZoneList] = useState([])
  const [wardList, setWardList] = useState([])
  const [editId, setEditId] = useState()
  const language = useSelector((state) => state.labels.language)
  // const token = useSelector((state) => state.user.user.token);
  let user = useSelector((state) => state.user.user)

  useEffect(() => {
    getModuleName()
    getZoneList()
    getWardList()

    // let id = "";

    // // iterate through the query parameters and get value of data
    // for (const key in router.query) {
    //   if (key == "id") {
    //     // get the value of data
    //     id = router.query[key];
    //   }
    // }

    // alert("id is " + id);

    // // set the editId

    // if (id) {
    //   setEditId(id);
    //   alert("id is " + id);

    //   // Get the entire record from the database using id
    //   axios.get(`${urls.SLB}/trnEntry/getById?id=${id}`).then((res) => {
    //     alert("editId" + res);
    //   });
    // }

    // getParameterName();
    //getSubParameterName();
  }, [])

  // zones

  // get Zone Keys
  const getZoneList = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        // Print r in console

        setTimeout(() => {
          setZoneList(
            r.data.zone.map((row) => ({
              id: row.id,
              zoneKey: row.zoneId,
              zoneName: row.zoneName,
            }))
          )
        }, 100)
      })
  }

  // get Ward Keys
  const getWardList = (selectedZoneId) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${selectedZoneId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        // Print r in console

        setWardList(
          r.data.map((row) => ({
            id: row.id,
            wardKey: row.wardId,
            wardName: row.wardName,
          }))
        )
      })
  }

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

  // get Parameter Name
  const getParameterName = () => {
    axios
      .get(
        `${urls.SLB}/parameter/getByModuleKey?moduleKey=${watch("moduleKey")}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setParameterNameList(
          res?.data?.parameterList?.map((r, i) => ({
            id: r.id,

            parameterName: r.parameterName,
            calculationMethod: r.calculationMethod,
            benchmarkType: r.benchmarkType,
            frequency: r.frequency,
          }))
        )
      })
  }

  // get sub-Parameter Name
  const getSubParameterName = (id) => {
    if (watch("zoneKey") && watch("wardKey") && watch("moduleKey")) {
      setSubParameterName([])
      setTrnEntry([])

      axios
        .get(`${urls.SLB}/subParameter/getByParameterKey?parameterKey=${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          let subParamData = res?.data?.subParameterList?.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            description: r.description,
            // subParameterName: r.subParameterName,
            subParameterName: r.subParameterName,
            // subParameterName:r.subParameterName,
            parameterKey: r.parameterKey,
            groupParameter: r.groupParameter,
            calculationType: r.calculationType,
            dataStructure: r.dataStructure,
            valueType: r.valueType,
            measurementUnit: r.measurementUnit,
          }))

          // Sort the array by calculationType
          subParamData.sort((a, b) => {
            if (a.calculationType < b.calculationType) {
              return 1
            }
            if (a.calculationType > b.calculationType) {
              return -1
            }
            return 0
          })

          setSubParameterName(subParamData)

          setTrnEntry(
            subParamData?.map((r, i) => ({
              srNo: i + 1,
              id: r.id,
              description: r.description,
              subParameterName: r.subParameterName,
              parameterKey: r.parameterKey,

              groupParameter: r.groupParameter,
              calculationType: r.calculationType,
              dataStructure: r.dataStructure,
              valueString: "",
              valueType: r.valueType,
              measurementUnit: r.measurementUnit,
              // get current date with moment and set hours and mins and seconds to 0 in ISODate Format

              reportedDate: moment()
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0),
            }))
          )
        })
    } else {
      setSelectParameter("")
      sweetAlert("Please Select All Dropdowns")
    }
  }

  // const getSubParameter = (field, value) => {
  //   field.onChange(value);

  //   console.log(
  //     "11111",
  //     subParameterName.map(
  //       (obj) => obj?.parameterKey == value.target.value && obj
  //     )
  //   );

  //   setFilteredSubParameterName(
  //     subParameterName.map(
  //       (obj) => obj?.subParameterKey == value.target.value && obj
  //     )
  //   );
  // };

  // New DB Save
  const onSubmitForm = (Data) => {
    const trnEntryValues = Object.values(Data.trnEntry)

    const dataArray = trnEntryValues.reduce((acc, value) => {
      if (value.subParameterKey && value.valueString) {
        acc.push({
          moduleKey: Data.moduleKey,
          // get ModuleName from the list of Modules using moduleKey
          moduleName: moduleName.find((p) => p.id === Data.moduleKey)
            .moduleName,
          parameterKey: Data.parameterName,
          // get ParameterName from the list of Parameters using parameterKey
          parameterName: parameterNameList.find(
            (p) => p.id === Data.parameterName
          ).parameterName,
          subParameterKey: value.subParameterKey,
          // get SubParameterName from the list of SubParameters using SubparameterKey

          subParameterName: value.subParameterName,
          valueString: value.valueString,
          valueType: value.valueType,
          calculationType: value.calculationType,
          entryUniqueIdentifier: "SD",
          zoneKey: Data.zoneKey,
          // get ZoneName from the list of ZoneList using zoneKey
          zoneName: zoneList.find((p) => p.id === Data.zoneKey).zoneName,
          wardKey: Data.wardKey,
          // get WardName from the list of WardList using wardKey
          wardName: wardList.find((p) => p.id === Data.wardKey).wardName,
        })
      }
      return acc
    }, [])

    // Convert data array into the JSON array starting with [ and ending with ]
    const dataArrayJSON = JSON.stringify(dataArray)

    let body = {
      ...dataArrayJSON,
    }

    // // Call the API for each item in the `dataArray`
    //   Promise.all(dataArray.map((item) => {
    //   return axios.post(`${urls.SLB}/trnEntry/save`, item, {
    //          headers: {},
    //        });
    // }))
    // .then((responseArray) => {
    //   console.log(responseArray);
    //   // Check if all the API calls were successful...
    //   const allSuccessful = responseArray.every((response) => (response.status === 200 || response.status === 201));
    //   if (allSuccessful) {
    //     console.log("All API calls were successful!");
    //     sweetAlert("Saved!", "Record Submitted successfully !", "success");
    //     router.push(`/Slb/transaction/entry/`);
    //     // Handle the successful response here...
    //   } else {
    //     console.log("At least one API call failed!");
    //     sweetAlert("Error!", "At least one API call failed!", "success");
    //     router.push(`/Slb/transaction/entry/`);
    //     // Handle the failed response here...
    //   }
    // }).catch((error) => {
    //   console.error(error);
    //   // Handle any errors that occurred during the API calls here...
    // });

    // console.log("body saved", body);

    axios
      .post(`${urls.SLB}/trnEntry/saveListV2`, dataArrayJSON, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      // , {
      //   headers: { "Content-Type": "application/json" },
      // }
      .then((res) => {
        if (res.status == 201) {
          // get parameter Name from res.data.data which is json string and set it to parameterName| decode json
          const paramaterName = res.data.parameterDao.parameterName

          const htmlContent =
            "<h1>Hello world!</h1><p>This is some <strong>HTML</strong> content.</p>"

          sweetAlert({
            title: paramaterName + "",
            icon: "success",
            button: "OK",
            text: res.data.data,
            html: htmlContent,
            allowHtml: true,
          })

          router.push(`/Slb/transaction/entry/`)
        }
      })

    //clear trnEntry list
    setTrnEntry([])
    setSubParameterName([])
  }

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile() {
    let module = moduleName.find((p) => p.id === selectedModuleName)
    if (module.id == 1) {
      const excelFilePath = "/SLB/Water Supply Management System.xlsx"
      const link = document.createElement("a")
      link.href = excelFilePath
      link.download = "Water Supply Management System.xlsx"
      link.click()
    } else if (module.id == 2) {
      const excelFilePath = "/SLB/Solid Waste Management.xlsx"
      const link = document.createElement("a")
      link.href = excelFilePath
      link.download = "Solid Waste Management.xlsx"
      link.click()
    } else if (module.id == 3) {
      const excelFilePath = "/SLB/Sewerage Management System.xlsx"
      const link = document.createElement("a")
      link.href = excelFilePath
      link.download = "Sewerage Management System.xlsx"
      link.click()
    } else if (module.id == 4) {
      const excelFilePath = "/SLB/Storm Water Drainage Managment System.xlsx"
      const link = document.createElement("a")
      link.href = excelFilePath
      link.download = "Storm Water Drainage Managment System.xlsx"
      link.click()
    } else if (module.id == 5) {
      const excelFilePath = "/SLB/SolidWasteManagementMOHUA.xlsx"
      const link = document.createElement("a")
      link.href = excelFilePath
      link.download = "Solid Waste Management (MOHUA).xlsx"
      link.click()
    }
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
    moduleName: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    parameterName: "",
    moduleName: "",
    id: null,
  }

  useEffect(() => {
    getParameterName()
    setSelectParameter(null)
    setTrnEntry([])
  }, [watch("moduleKey")])

  // useEffect(() => {
  //   getSubParameterName();
  //   // getParameterName();
  // }, [watch("parameterName")]);

  useEffect(() => {
    if (watch("zoneKey")) {
      setValue("wardKey", "")
      setValue("moduleKey", "")
      setValue("parameterName", "")
      setParameterNameList([])
    }
  }, [watch("zoneKey")])

  useEffect(() => {
    if (watch("wardKey")) {
      setValue("moduleKey", "")
      setValue("parameterName", "")
      setParameterNameList([])
    }
  }, [watch("wardKey")])

  // View
  return (
    <>
      {/* <BasicLayout> */}
      {/* <Box display="inkenline-block"> */}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            // marginTop: "10px",
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
              {" "}
              {language == "en" ? "Entry Form" : "एंट्री फॉर्म"}
              {/* <FormattedLabel id="opinion" /> */}
            </h2>
          </Box>

          <Divider />

          <Box
            sx={{
              marginLeft: 5,
              marginRight: 5,
              // marginTop: 2,
              marginBottom: 5,
              padding: 1,
              // border:1,
              // borderColor:'grey.500'
            }}
          >
            <Box p={4}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* Firts Row */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* Zone Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Zone *" : "झोन *"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                getWardList(value.target.value)
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {zoneList &&
                                zoneList.map((zone, index) => (
                                  <MenuItem key={index} value={zone.id}>
                                    {zone.zoneName}

                                    {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zoneKey ? errors.zoneKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Ward Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        variant="standard"
                        size="medium"
                        error={!!errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Ward *" : "वार्ड *"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label={<FormattedLabel id="locationName" />}
                            >
                              {wardList &&
                                wardList.map((ward, index) => (
                                  <MenuItem key={index} value={ward.id}>
                                    {ward.wardName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.wardKey ? errors.wardKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Module Name */}

                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        variant="standard"
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.moduleName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {language == "en" ? "Module *" : "मॉड्यूल *"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                                setSelectedModule(value.target.value)
                              }}
                              label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {moduleName &&
                                moduleName.map((moduleName, index) => (
                                  <MenuItem key={index} value={moduleName.id}>
                                    {moduleName.moduleName}

                                    {/* {language == "en"
                                      ? name?.name
                                      : name?.name} */}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          // name="moduleName"
                          name="moduleKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.moduleName
                            ? errors.moduleName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {/* Parameter Name */}
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      xl={3}
                      lg={3}
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
                        size="medium"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.parameterName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                          {/* {<FormattedLabel id="locationName" />} */}
                          {language == "en" ? "Parameter *" : "पॅरामीटर *"}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}

                              onChange={(value) => {
                                //getSubParameter(field, value);
                                field.onChange(value)
                                setSelectParameterKey(value.target.value)

                                // get parameter from paremeterlList
                                const param = parameterNameList.find(
                                  (parameterName) =>
                                    parameterName.id === value.target.value
                                )
                                setSelectParameter(param)
                                //setParameterName("SAgar");
                                getSubParameterName(value.target.value)
                              }}
                              // label={<FormattedLabel id="locationName" />}
                              // InputLabelProps={{
                              //   //true
                              //   shrink:
                              //     (watch("officeLocation") ? true : false) ||
                              //     (router.query.officeLocation ? true : false),
                              // }}
                            >
                              {parameterNameList &&
                                parameterNameList.map(
                                  (parameterName, index) => (
                                    <MenuItem
                                      key={index}
                                      value={parameterName.id}
                                    >
                                      {parameterName.parameterName}

                                      {/* {language == "en"
                                      ? officeLocationName?.officeLocationName
                                      : officeLocationName?.officeLocationNameMar} */}
                                    </MenuItem>
                                  )
                                )}
                            </Select>
                          )}
                          name="parameterName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.parameterName
                            ? errors.parameterName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Divider />
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectParameter && "Benchmark Type : "}
                    {selectParameter && selectParameter.benchmarkType}
                    {selectParameter && " | Calculation Method : "}
                    {selectParameter && selectParameter.calculationMethod}
                    {selectParameter && " | Data Entry Frequency : "}
                    {selectParameter && selectParameter.frequency}
                  </InputLabel>
                  <Divider />
                  {/* Download Button */}
                  {selectParameter && (
                    <Grid
                      id="demo-simple-select-standard-label"
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
                      <Paper
                        elevation={4}
                        style={{ margin: "30px", width: "auto" }}
                      >
                        <Button
                          type="button"
                          variant="contained"
                          color="success"
                          endIcon={<DownloadIcon />}
                          onClick={() => generateCSVFile()}
                        >
                          {language == "en"
                            ? "Download Formula"
                            : "फॉर्मूला डाउनलोड करा"}
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                  <Divider />
                  {trnEntry?.map((val, index) => {
                    //console.log("value123", val);
                    return (
                      <>
                        <Grid
                          key={index}
                          container
                          sx={{
                            // justifyContent:"center",
                            // alignContent:"center"
                            // marginTop:"30px"
                            marginLeft: "90px",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={4}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              alignContent: "center",
                              //  border:"2px solid red"
                            }}
                          >
                            <Typography
                              style={{
                                // border:"2px solid black",
                                marginTop: "15px",
                              }}
                            >
                              {val.subParameterName} (
                              {val.calculationType ? val.calculationType : "-"})
                              <br />
                              {val.measurementUnit
                                ? " [Unit: " + val.measurementUnit + "]"
                                : ""}
                              {/* {...register("subParameterName")} */}
                            </Typography>
                            {/* {val.description} */}
                          </Grid>

                          {/* {val.description} */}

                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            xl={4}
                            style={{
                              // marginRight:""
                              display: "flex",
                              alignItems: "center",
                              alignContent: "center",
                              // border:"2px solid yellow"
                            }}
                          >
                            <TextField
                              tooltip={
                                val.measurementUnit
                                  ? " [Unit: " + val.measurementUnit + "]"
                                  : ""
                              }
                              enabled={false}
                              value={val.subParameterName}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register(
                                "trnEntry[{" + val.id + "].subParameterName"
                              )}
                              helperText={
                                errors?.valueString
                                  ? errors.valueString.message
                                  : null
                              }
                            />
                            <TextField
                              enabled={false}
                              value={val.id}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register(
                                "trnEntry[{" + val.id + "].subParameterKey"
                              )}
                              helperText={
                                errors?.valueString
                                  ? errors.valueString.message
                                  : null
                              }
                            />
                            <TextField
                              enabled={false}
                              value={val.valueType}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register(
                                "trnEntry[{" + val.id + "].valueType"
                              )}
                              helperText={
                                errors?.valueString
                                  ? errors.valueString.message
                                  : null
                              }
                            />

                            <TextField
                              enabled={false}
                              value={val.calculationType}
                              // label={val.description}
                              style={{
                                width: "0px",
                                // border:"2px solid green"
                              }}
                              variant="standard"
                              {...register(
                                "trnEntry[{" + val.id + "].calculationType"
                              )}
                              helperText={
                                errors?.valueString
                                  ? errors.valueString.message
                                  : null
                              }
                            />
                            <TextField
                              // label={val.description}
                              style={
                                {
                                  // border:"2px solid green"
                                }
                              }
                              variant="standard"
                              {...register(
                                "trnEntry[{" + val.id + "].valueString"
                              )}
                              // error={!!errors.valueString}
                              helperText={
                                errors?.valueString
                                  ? errors.valueString.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                      </>
                    )
                  })}
                  {/* Second Row */}
                  {/* Button Row */}
                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={2}></Grid>

                    {/* Save ad Draft */}
                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("saveAsDraft")}
                        type="Submit"
                        variant="contained"
                        disabled={
                          watch("zoneKey") &&
                          watch("wardKey") &&
                          watch("moduleKey") &&
                          watch("parameterName")
                            ? false
                            : true
                        }
                      >
                        {language == "en" ? "Submit" : "प्रस्तुत करणे"}
                        {/* {<FormattedLabel id="saveAsDraft" />} */}
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>

                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("submit")}
                        type="Submit"
                        variant="contained"
                        onClick={() => cancellButton()}
                        disabled={
                          watch("zoneKey") ||
                          watch("wardKey") ||
                          watch("moduleKey") ||
                          watch("parameterName")
                            ? false
                            : true
                        }
                      >
                        {language == "en" ? "Clear" : "साफ करा"}
                        {/* {<FormattedLabel id="submit" />} */}
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => router.push(`/Slb/transaction/entry/`)}
                      >
                        {language == "en" ? "Cancel" : "रद्द करा"}
                        {/* {<FormattedLabel id="cancel" />} */}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Box>
        </Paper>
      </ThemeProvider>
      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  )
}

export default EntryForm
