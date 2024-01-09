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
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  ThemeProvider,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import sweetAlert from "sweetalert"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import { GridToolbar } from "@mui/x-data-grid"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import urls from "../../../../URLS/urls"
import theme from "../../../../theme"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import Schema from "../../../../containers/schema/newsRotationManagementSystem/newspaperRotationSubGroup"
import { yupResolver } from "@hookform/resolvers/yup"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = methods
  //   const {
  //     register,
  //     control,
  //     handleSubmit,
  //     methods,
  //     reset,
  //     watch,
  //     setError,
  //     formState: { errors },
  //   } = useForm({
  //     criteriaMode: "all",
  //     resolver: yupResolver(Schema),
  //     mode: "onChange",
  //   });

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [rotationGroup, setRotationGroup] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)
  const router = useRouter()

  const [groupNames, setGroupNames] = useState([])
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

  useEffect(() => {
    getRotationGroup()
  }, [])

  useEffect(() => {
    if (rotationGroup.length > 0) getData()
  }, [rotationGroup])

  const getRotationGroup = () => {
    axios
      .get(`${urls.NRMS}/newspaperRotationGroupMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setRotationGroup(r.data.newspaperRotationGroupMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    axios
      .get(`${urls.NRMS}/newspaperRotationSubGroupMaster/getAll`, {
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
        let result = r.data.newspaperRotationSubGroupMasterList
        console.log("result", result)

        let _res = result.map((r, i) => {
          console.log("44")
          return {
            ...r,
            srNo: i + 1,
            rotationGroupKey: r.rotationGroupKey,
            rotationGroupName: rotationGroup?.find(
              (rg) => rg?.id == r.rotationGroupKey
            )?.rotationGroupName,
            rotationGroupNameMr: rotationGroup?.find(
              (rg) => rg?.id == r.rotationGroupKey
            )?.rotationGroupNameMr,
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
      })
      .catch((error) => {
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
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            if (res.data?.errors?.length > 0) {
              res.data?.errors?.map((x) => {
                if (x.field == "rotationGroupKey") {
                  setError("rotationGroupKey", { message: x.code })
                } else if (x.field == "rotationSubGroupName") {
                  setError("rotationSubGroupName", { message: x.code })
                } else if (x.field == "rotationSubGroupNameMr") {
                  setError("rotationSubGroupNameMr", { message: x.code })
                }
              })
            } else {
              sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )

              setButtonInputState(false)
              setIsOpenCollapse(false)
              setFetchData(tempData)
              setEditButtonInputState(false)
              setDeleteButtonState(false)
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, _body, {
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
    // if (_activeFlag === "N") {
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
          // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
          .post(`${urls.NRMS}/newspaperRotationSubGroupMaster/save`, body, {
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
    // } else {
    //   swal({
    //     title: "Activate?",
    //     text: "Are you sure you want to activate this Record ? ",
    //     icon: "warning",
    //     buttons: true,
    //     dangerMode: true,
    //   }).then((willDelete) => {
    //     console.log("inn", willDelete);
    //     if (willDelete === true) {
    //       axios.delete(`${urls.NRMS}/newspaperRotationSubGroupMaster/delete/${body.id}`).then((res) => {
    //         console.log("delet res", res);
    //         if (res.status == 201) {
    //           swal("Record is Successfully Activated!", {
    //             icon: "success",
    //           });
    //           // getPaymentRate();
    //           getData();
    //           // setButtonInputState(false);
    //         }
    //       });
    //     } else if (willDelete == null) {
    //       swal("Record is Safe");
    //     }
    //   });
    // }
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
    subGroupName: "",
    rotationSubGroupName: "",
    rotationSubGroupNameMr: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    subGroupName: "",

    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.5 },

    {
      field: language == "en" ? "rotationGroupName" : "rotationGroupNameMr",
      headerName: <FormattedLabel id="groupName" />,
      flex: 1,
    },
    {
      field: "rotationSubGroupName",

      headerName: <FormattedLabel id="rotationgroupSubNameE" />,
      flex: 1,
    },

    {
      field: "rotationSubGroupNameMr",

      headerName: <FormattedLabel id="rotationgroupSubNameM" />,
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
                // setButtonInputState(true);
                console.log("params.row: ", params.row)
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
    <ThemeProvider theme={theme}>
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
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="RotationsubGroup" />
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
                <Grid container>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
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
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {/* {<FormattedLabel id="de     partment" />} */}
                        <FormattedLabel id="groupName" />
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
                            //   onChange={(value) => field.onChange(value)}
                            // label="Select Auditorium"
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
                        name="rotationGroupKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.rotationGroupKey
                          ? errors.rotationGroupKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <div style={{ width: "300px" }}>
                      <Transliteration
                        style={{
                          backgroundColor: "white",
                          margin: "250px",
                        }}
                        _key={"rotationSubGroupName"}
                        required
                        labelName={
                          <FormattedLabel id="rotationgroupSubNameE" />
                        }
                        fieldName={"rotationSubGroupName"}
                        updateFieldName={"rotationSubGroupNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={
                          <FormattedLabel id="rotationgroupSubNameE" required />
                        }
                        multiline
                        error={!!errors.rotationSubGroupName}
                        targetError={"rotationSubGroupNameMr"}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("rotationSubGroupName") ? true : false,
                        }}
                        helperText={
                          errors?.rotationSubGroupName
                            ? errors.rotationSubGroupName.message
                            : null
                        }
                      />
                    </div>
                    {/* <TextField
                      label={<FormattedLabel id="rotationgroupSubNameE" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("rotationSubGroupName")}
                      error={!!errors.rotationSubGroupName}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("rotationSubGroupName") ? true : false) ||
                          (router.query.rotationSubGroupName ? true : false),
                      }}
                      helperText={
                        errors?.rotationSubGroupName
                          ? errors.rotationSubGroupName.message
                          : null
                        // errors?.rotationSubGroupName ? "Rotation Group Name is Required !!!" : null
                      }
                    /> */}
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <div style={{ width: "300px" }}>
                      <Transliteration
                        style={{
                          backgroundColor: "white",
                          margin: "250px",
                        }}
                        _key={"rotationSubGroupNameMr"}
                        required
                        labelName={
                          <FormattedLabel id="rotationgroupSubNameM" />
                        }
                        fieldName={"rotationSubGroupNameMr"}
                        updateFieldName={"rotationSubGroupName"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        label={
                          <FormattedLabel id="rotationgroupSubNameM" required />
                        }
                        multiline
                        error={!!errors.rotationSubGroupNameMr}
                        targetError={"rotationSubGroupName"}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("rotationSubGroupNameMr")
                            ? true
                            : false,
                        }}
                        helperText={
                          errors?.rotationSubGroupNameMr
                            ? errors.rotationSubGroupNameMr.message
                            : null
                        }
                      />
                    </div>
                    {/* <TextField
                      label={<FormattedLabel id="rotationgroupSubNameM" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("rotationSubGroupNameMr")}
                      error={!!errors.rotationSubGroupNameMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("rotationSubGroupNameMr") ? true : false) ||
                          (router.query.rotationSubGroupNameMr ? true : false),
                      }}
                      helperText={
                        errors?.rotationSubGroupNameMr
                          ? errors.rotationSubGroupNameMr.message
                          : null
                        // errors?.rotationSubGroupNameMr ? "Rotation Group Name is Required !!!" : null
                      }
                    /> */}
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
            console.log("222", _data)
            // updateData("page", 1);
            getData(_data, data.page)
          }}
        />
      </Paper>
    </ThemeProvider>
  )
}

export default Index
