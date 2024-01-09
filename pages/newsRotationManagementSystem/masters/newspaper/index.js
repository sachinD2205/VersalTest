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
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/Newspaper"
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css"
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
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const router = useRouter()
  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [buttonInputState, setButtonInputState] = useState()
  const [callAgain, setCallAgain] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const [bankDetails, setBankDetails] = useState([])

  useEffect(() => {
    getBankDetails()
  }, [])

  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true)
    console.log("_pageSize,_pageNo", _pageSize, _pageNo)
    axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("result", r?.data?.newspaperMasterList)
        let _res = r?.data?.newspaperMasterList?.map((r, i) => {
          return {
            ...r,
            // srNo: i + 1 * (r?.data?.pageSize * r?.data?.pageNo),
            srNo: _pageSize * _pageNo + i + 1,
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

  //bank details
  const getBankDetails = () => {
    setIsLoading(true)
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(res.data.bank)
        setBankDetails(
          res.data.bank.map((j) => ({
            ...j,
          }))
        )
        setIsLoading(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  useEffect(() => {
    getData()
  }, [callAgain])

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData)

    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    }

    const tempData = axios
      .post(`${urls.NRMS}/newspaperMaster/save`, _body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "newspaperName") {
                setError("newspaperName", { message: x.code })
              } else if (x.field == "newspaperNameMr") {
                setError("newspaperNameMr", { message: x.code })
              }
            })
          } else {
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
            setButtonInputState(false)
            setIsOpenCollapse(false)
            setEditButtonInputState(false)
            setCallAgain(tempData)
          }
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
          const tempData = axios
            .post(`${urls.NRMS}/newspaperMaster/save`, body, {
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
                    : "Record is Successfully Deactivated",
                  {
                    icon: "success",
                  }
                )
                setCallAgain(tempData)
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
          const tempData = axios
            .post(`${urls.NRMS}/newspaperMaster/save`, body, {
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
                setCallAgain(tempData)
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

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
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
    address: "",
    addressMr: "",
    contactNumber: "",
    emailId: "",
    newspaperAgencyName: "",
    newspaperAgencyNameMr: "",
    newspaperLevel: "",
    newspaperName: "",
    newspaperNameMr: "",
    accountNo: "",
    branch: "",
    bank: "",
    ifsc: "",
    // remark: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    address: "",
    addressMr: "",
    contactNumber: "",
    emailId: "",
    newspaperAgencyName: "",
    newspaperAgencyNameMr: "",
    newspaperLevel: "",
    newspaperName: "",
    newspaperNameMr: "",
    accountNo: "",
    branch: "",
    bank: "",
    ifsc: "",
    // remark: "",

    id: null,
  }

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.5 },
    {
      field: "newspaperAgencyName",
      headerName: <FormattedLabel id="newsAgencyEn" />,
      flex: 2,
    },

    {
      field: "newspaperAgencyNameMr",
      headerName: <FormattedLabel id="newsAgencyMr" />,
      flex: 2,
    },

    {
      field: "newspaperName",
      headerName: <FormattedLabel id="newspaperNameEn" />,
      flex: 2,
    },

    {
      field: "newspaperNameMr",
      headerName: <FormattedLabel id="newspaperNameMr" />,
      flex: 2,
    },

    // {
    //   field: "contactNumber",
    //   headerName: <FormattedLabel id="contact" />,
    //   flex: 1,
    // },
    // {
    //   field: "emailId",
    //   headerName: <FormattedLabel id="emailId" />,
    //   flex: 1,
    // },
    // {
    //   field: "address",
    //   headerName: <FormattedLabel id="address" />,
    //   flex: 1,
    // },
    // {
    //   field: "addressMr",
    //   headerName: <FormattedLabel id="address" />,
    //   flex: 1,
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      width: 120,
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
            <FormattedLabel id="newsp" />
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
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newspaperAgencyName"}
                          required
                          labelName={<FormattedLabel id="newsAgencyEn" />}
                          fieldName={"newspaperAgencyName"}
                          updateFieldName={"newspaperAgencyNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="newsAgencyEn" required />}
                          multiline
                          error={!!errors.newspaperAgencyName}
                          targetError={"newspaperAgencyNameMr"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newspaperAgencyName") ? true : false,
                          }}
                          helperText={
                            errors?.newspaperAgencyName
                              ? errors.newspaperAgencyName.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      //   label="Newspaper Agency Name"
                      label={<FormattedLabel id="newsAgencyEn" required />}
                      multiline
                      variant="standard"
                      {...register("newspaperAgencyName")}
                      error={!!errors.newspaperAgencyName}
                      helperText={
                        errors?.newspaperAgencyName
                          ? errors.newspaperAgencyName.message
                          : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newspaperAgencyNameMr"}
                          required
                          labelName={<FormattedLabel id="newsAgencyMr" />}
                          fieldName={"newspaperAgencyNameMr"}
                          updateFieldName={"newspaperAgencyName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="newsAgencyMr" required />}
                          multiline
                          error={!!errors.newspaperAgencyNameMr}
                          targetError={"newspaperAgencyName"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newspaperAgencyNameMr")
                              ? true
                              : false,
                          }}
                          helperText={
                            errors?.newspaperAgencyNameMr
                              ? errors.newspaperAgencyNameMr.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      //   label="Newspaper Agency Name"
                      label={<FormattedLabel id="newsAgencyMr" required />}
                      multiline
                      variant="standard"
                      {...register("newspaperAgencyNameMr")}
                      error={!!errors.newspaperAgencyNameMr}
                      helperText={
                        errors?.newspaperAgencyNameMr
                          ? errors.newspaperAgencyNameMr.message
                          : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newspaperName"}
                          required
                          labelName={<FormattedLabel id="newspaperNameEn" />}
                          fieldName={"newspaperName"}
                          updateFieldName={"newspaperNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="newspaperNameEn" required />
                          }
                          multiline
                          error={!!errors.newspaperName}
                          targetError={"newspaperNameMr"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newspaperName") ? true : false,
                          }}
                          helperText={
                            errors?.newspaperName
                              ? errors.newspaperName.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="newspaperNameEn" required />}
                      multiline
                      variant="standard"
                      {...register("newspaperName")}
                      error={!!errors.newspaperName}
                      helperText={
                        errors?.newspaperName
                          ? errors.newspaperName.message
                          : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"newspaperNameMr"}
                          required
                          labelName={<FormattedLabel id="newspaperNameMr" />}
                          fieldName={"newspaperNameMr"}
                          updateFieldName={"newspaperName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="newspaperNameMr" required />
                          }
                          multiline
                          error={!!errors.newspaperNameMr}
                          targetError={"newspaperName"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("newspaperNameMr") ? true : false,
                          }}
                          helperText={
                            errors?.newspaperNameMr
                              ? errors.newspaperNameMr.message
                              : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="newspaperNameMr" required />}
                      multiline
                      variant="standard"
                      {...register("newspaperNameMr")}
                      error={!!errors.newspaperNameMr}
                      helperText={
                        errors?.newspaperNameMr
                          ? errors.newspaperNameMr.message
                          : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="contact" required />}
                        multiline
                        variant="standard"
                        {...register("contactNumber")}
                        error={!!errors.contactNumber}
                        helperText={
                          errors?.contactNumber
                            ? errors.contactNumber.message
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

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="emailId" required />}
                        multiline
                        variant="standard"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"address"}
                          required
                          labelName={<FormattedLabel id="addressEn" />}
                          fieldName={"address"}
                          updateFieldName={"addressMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="addressEn" required />}
                          multiline
                          error={!!errors.address}
                          targetError={"addressMr"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("address") ? true : false,
                          }}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="addressEn" required />}
                      multiline
                      variant="standard"
                      {...register("address")}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <div style={{ width: "300px" }}>
                        <Transliteration
                          style={{
                            backgroundColor: "white",
                            margin: "250px",
                          }}
                          _key={"addressMr"}
                          required
                          labelName={<FormattedLabel id="addressMr" />}
                          fieldName={"addressMr"}
                          updateFieldName={"address"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="addressMr" required />}
                          multiline
                          error={!!errors.addressMr}
                          targetError={"address"}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("addressMr") ? true : false,
                          }}
                          helperText={
                            errors?.addressMr ? errors.addressMr.message : null
                          }
                        />
                      </div>
                      {/* <TextField
                      sx={{ width: 300 }}
                      id="standard-textarea"
                      label={<FormattedLabel id="addressMr" required />}
                      multiline
                      variant="standard"
                      {...register("addressMr")}
                      error={!!errors.addressMr}
                      helperText={
                        errors?.addressMr ? errors.addressMr.message : null
                      }
                      // InputLabelProps={{
                      //     //true
                      //     shrink:
                      //         (watch("label2") ? true : false) ||
                      //         (router.query.label2 ? true : false),
                      // }}
                    /> */}
                    </Grid>
                  </Grid>
                  <Divider />
                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {<FormattedLabel id="accountDetails" />}
                    </Typography>
                  </Box>

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                      <FormControl
                        variant="standard"
                        error={!!errors.bank}
                        fullWidth
                        sx={{ width: 300 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="bankName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label={<FormattedLabel id="bankName" />}
                            >
                              {bankDetails &&
                                bankDetails.map((obj) => {
                                  return (
                                    <MenuItem key={obj.id} value={obj.id}>
                                      {language === "en"
                                        ? obj.bankName
                                        : obj.bankNameMr}
                                    </MenuItem>
                                  )
                                })}
                            </Select>
                          )}
                          name="bank"
                          control={control}
                        />
                        <FormHelperText>
                          {errors?.bank ? errors.bank.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        fullWidth
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="branchName" required />}
                        multiline
                        variant="standard"
                        {...register("branch")}
                        error={!!errors.branch}
                        helperText={
                          errors?.branch ? errors.branch.message : null
                        }
                        // InputLabelProps={{
                        //     //true
                        //     shrink:
                        //         (watch("label2") ? true : false) ||
                        //         (router.query.label2 ? true : false),
                        // }}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        fullWidth
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="accountNo" required />}
                        multiline
                        variant="standard"
                        {...register("accountNo")}
                        error={!!errors.accountNo}
                        helperText={
                          errors?.accountNo ? errors.accountNo.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        fullWidth
                        sx={{ width: 300 }}
                        id="standard-textarea"
                        label={<FormattedLabel id="ifscCode" required />}
                        multiline
                        variant="standard"
                        {...register("ifsc")}
                        error={!!errors.ifsc}
                        helperText={errors?.ifsc ? errors.ifsc.message : null}
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
            // loading={}
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
