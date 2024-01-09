import { yupResolver } from "@hookform/resolvers/yup"
import { GetAppRounded, Send } from "@mui/icons-material"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CloseIcon from "@mui/icons-material/Close"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import NextPlanIcon from "@mui/icons-material/NextPlan"
import ReportIcon from "@mui/icons-material/Report"
import SaveIcon from "@mui/icons-material/Save"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import UndoIcon from "@mui/icons-material/Undo"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import UploadButtonOP from "../../../../components/newsRotationManagementSystem/FileUpload/DocumentsUploadOP"
import Loader from "../../../../containers/Layout/components/Loader"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import schema from "../../../../containers/schema/newsRotationManagementSystem/pressNoteRelease"
import styles from "../../../../styles/newsRotationManagementSystem/[newMarriageRegistration]view.module.css"
import { catchExceptionHandlingMethod } from "../../../../util/util"
const Create = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />

  let appName = "NRMS"
  let serviceName = "N-PN"
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [selectedNewsPapers, setSelectedNewsPapers] = useState([])
  const [isSelectAllOptionClick, setIsSelectAllOptionClick] = useState(false)

  // console.log("NRMS: selectedNewsPapers =", selectedNewsPapers);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { newsPapersLst: [] },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = methods

  const router = useRouter()
  const language = useSelector((state) => state.labels.language)
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  const user = useSelector((state) => state.user.user)
  const [modalforAprov, setmodalforAprov] = useState(false)
  const authority = user?.menus?.find(
    (r) => r.id == selectedMenuFromDrawer
  )?.roles
  const [isLoading, setIsLoading] = useState(false)

  const [mainFiles, setMainFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false)
  const [finalFiles, setFinalFiles] = useState([])
  const [attachedFile, setAttachedFile] = useState("")
  const [additionalFiles, setAdditionalFiles] = useState([])
  const [advertisementType, setadvertisementType] = useState([])
  const [department, setDepartment] = useState([])
  const [newsPaper, setNewsPaper] = useState([])
  const [btnSaveText, setBtnSaveText] = useState()
  const [ward, setWard] = useState([])
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)
  console.log("authority", authority)
  const token = useSelector((state) => state.user.user.token)
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
  const _columns = [
    {
      headerName: `${language == "en" ? "Sr.No" : "अं.क्र"}`,
      field: "srNo",
      flex: 0.2,
      //   width: 100,
      // flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Name" : "दस्ताऐवजाचे नाव"}`,
      field: "fileName",
      // File: "originalFileName",
      // width: 300,
      flex: 1,
    },
    {
      headerName: `${language == "en" ? "File Type" : "दस्ताऐवजाचे स्वरूप"}`,
      field: "extension",
      flex: 1,
      // width: 140,
    },
    language == "en"
      ? {
          headerName: "Uploaded By",
          field: "attachedNameEn",
          flex: 2,
          // width: 300,
        }
      : {
          headerName: "द्वारे अपलोड केले",
          field: "attachedNameMr",
          flex: 2,
          // width: 300,
        },
    {
      headerName: `${language == "en" ? "Action" : "क्रिया"}`,
      field: "Action",
      flex: 1,
      // width: 200,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                )
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        )
      },
    },
  ]

  const handleSelectedNewsPapers = (evt, value) => {
    if (value.some((option) => option.newspaperName === "Select All")) {
      if (isSelectAllOptionClick) {
        // Now removing all the news papers
        setSelectedNewsPapers([])
        setIsSelectAllOptionClick(false)
        setValue("newsPapers", "")
      } else {
        setSelectedNewsPapers([...newsPaper])
        setIsSelectAllOptionClick(true)
        let __selectedIds = selectedNewsPapers.map((val) => val?.id)?.join(",")
        setValue("newsPapers", __selectedIds)
      }
      return
    }

    let uniqueArrayOfObjects = Object?.values(
      value?.reduce((acc, obj) => {
        acc[obj?.id] = obj
        return acc
      }, {})
    )
    setSelectedNewsPapers(uniqueArrayOfObjects)
    let __selectedIds = uniqueArrayOfObjects?.map((val) => val?.id)?.join(",")
    setValue("newsPapers", __selectedIds)
  }

  const getadvertisementType = () => {
    axios
      .get(`${urls.NRMS}/advertisementType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setadvertisementType(res.data.advertisementType)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDepartment(res.data.department)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setWard(res.data.ward)
        console.log("getZone.data", res.data.ward)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }
  const getWardsByZone = () => {
    if(watch("zoneKey")){
    axios
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((r) => {
        console.log("r?.data", r?.data)
        setWard(r?.data)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
    }
  }

  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getNewsPaper = () => {
    axios
      .get(`${urls.NRMS}/newspaperMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setNewsPaper(r?.data?.newspaperMasterList)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const getById = async (id) => {
    setIsLoading(true)
    axios
      .get(`${urls.NRMS}/trnPressNoteRequestApproval/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setIsLoading(false)
        reset(r.data)
        console.log(
          r?.data?.pressNoteRequestApprovalAttachment,
          "r?.data?.pressNoteRequestApprovalAttachment"
        )
        if (r?.data?.pressNoteRequestApprovalAttachment != null) {
          let flag = false

          if (
            authority?.includes("ENTRY") &&
            (r?.data?.status == "DRAFTED" || r?.data?.status == "null")
          ) {
            flag = true
          } else {
            flag = false
          }

          setAuthorizedToUpload(flag)
          console.log("flag++++", flag)

          setFinalFiles(
            r?.data?.pressNoteRequestApprovalAttachment.map((r, i) => {
              return {
                ...r,
                srNo: i + 1,
              }
            })
          )
        }

        console.log("r.data", r.data)
        console.log("ogs::", newsPaper)

        let selectednps = r?.data?.newsPapers?.split(",")
        let newsPaperr = []
        for (let i = 0; i < selectednps?.length; i++) {
          console.log("ppppppp", selectednps[i])
          let nnnn = newsPaper?.find((x) => x.id == selectednps[i])
          console.log("paperrr", nnnn)
          newsPaperr.push(nnnn)
        }
        let npss = newsPaperr
        console.log("npss::", npss)
        // setValue("newsPapers", npss);
        let evt = "event"
        handleSelectedNewsPapers(evt, npss ? npss : [])
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

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

  //view application remarks
  const remarks = async (props) => {
    let applicationId
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId
    } else if (router?.query?.id) {
      applicationId = router?.query?.id
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    )

    const finalBody = {
      id: Number(applicationId),
      approveRemark:
        props == "APPROVE"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
      rejectRemark:
        props == "REASSIGN"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,

      finalRejectionRemark:
        props == "REJECT"
          ? getValues("remark") == null || getValues("remark") == undefined
            ? ""
            : getValues("remark")
          : null,
    }

    // console.log("serviceId**-", serviceId);
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, finalBody, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          setmodalforAprov(false)
          swal(
            language === "en" ? "Saved!" : "जतन केले!",
            language === "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          )
          router.push(
            `/newsRotationManagementSystem/transaction/pressNoteRelease`
          )
        }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

  const releasingOrderGeneration = async () => {
    let applicationId
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId
    } else if (router?.query?.id) {
      applicationId = router?.query?.id
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    )

    // console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
    }
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          // setmodalforAprov(false)
          router.push({
            pathname:
              "/newsRotationManagementSystem/transaction/releasingOrder/press",
            query: {
              pageMode: "View",
              id: applicationId,
            },
          })
        }
      })
      .catch((err) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

  const sendPressNoteToPublish = async () => {
    let applicationId
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId
    } else if (router?.query?.id) {
      applicationId = router?.query?.id
    }

    console.log(
      "appid",
      applicationId,
      router?.query?.applicationId,
      router?.query?.id
    )

    // console.log("serviceId**-", serviceId);

    const generateRO = {
      id: applicationId,
    }
    // alert("setIsLoading(false)");
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, generateRO, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((response) => {
        setIsLoading(false)
        if (response.status === 201) {
          setmodalforAprov(false)
          swal(
            language === "en"
              ? "Successfully Done!"
              : "यशस्वीरित्या पूर्ण झाले",
            language === "en"
              ? "SENT TO NEWS AGENCIES FOR PUBLISHMENT  !"
              : "वृत्तसंस्थांना प्रकाशनासाठी पाठवले",
            "success"
          )
          router.push(
            `/newsRotationManagementSystem/transaction/pressNoteRelease`
          )
        }
      })
      .catch((err) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

  const onSubmitForm = async (formData) => {
    console.log("btnSaveText", btnSaveText)

    // let nps = newsPaper
    //   ?.filter((r) => selectedNewsPapers?.includes(r.newspaperName))
    //   ?.map((r) => r.id);
    // let stringggg = nps.toString();
    // console.log("nps.toString()", stringggg);

    let _body = {
      ...formData,
      id: router?.query?.id ? router?.query?.id : null,
      pressNoteRequestApprovalAttachment: finalFiles,
      // newsPapers: selectedNewsPapers,
      activeFlag: formData.activeFlag ? formData.activeFlag : null,
      createdUserId: user?.id,
      isDraft: btnSaveText == "DRAFT" ? true : false,
      isCorrection: btnSaveText == "UPDATE" ? true : false,
    }

    console.log("_body", _body)
    setIsLoading(true)

    await axios
      .post(`${urls.NRMS}/trnPressNoteRequestApproval/save`, _body, {
        headers: {
          Authorization: `Bearer ${token}`,
          serviceId: selectedMenuFromDrawer,
        },
      })
      .then((res) => {
        setIsLoading(false)
        console.log("res---", res)
        if (res.status == 201) {
          if (btnSaveText == "DRAFT") {
            sweetAlert(
              language === "en" ? "Drafted!" : "मसुदा तयार केला",
              language === "en"
                ? "Record Drafted successfully !"
                : "रेकॉर्ड मसुदा यशस्वीरित्या तयार केला",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
          } else {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
          }
          router.push(
            "/newsRotationManagementSystem/transaction/pressNoteRelease"
          )
        }
      })
      .catch((error) => {
        setIsLoading(false)
        callCatchMethod(error, language);

      })
  }

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles])
  }, [mainFiles, additionalFiles])

  useEffect(() => {
    console.log("finalFiles", finalFiles)
  }, [finalFiles])
  useEffect(() => {
    // console.log("zoneKeyyyyy", watch("zoneKey"));
    if (watch("zoneKey")) {
      getWardsByZone()
    }
  }, [watch("zoneKey")])

  useEffect(() => {
    getDepartment()
    getNewsPaper()
    // getWard();
    getZone()
    getadvertisementType()
  }, [])

  useEffect(() => {
    if (
      router.query.id != undefined &&
      router?.query?.pageMode != null &&
      (router?.query?.pageMode == "Edit" ||
        (router?.query?.pageMode == "View" &&
          watch("zoneKey") &&
          watch("zoneKey")) != null)
    ) {
      getWardsByZone()
    }
  }, [watch("zoneKey")])

  useEffect(() => {
    if (router.query.id != undefined && router?.query?.pageMode != null) {
      if (
        // zoneDropDown?.length > 0 &&
        // ward?.length > 0 &&
        department?.length > 0 &&
        newsPaper?.length > 0
      ) {
        getById(router.query.id)
      }
    } else {
      if (authority.includes("ENTRY") && router.query.pageMode == "Add") {
        setAuthorizedToUpload(true)
      }
    }
  }, [router.query.id, /* zoneDropDown, ward, */ department, newsPaper])

  useEffect(() => {
    if (newsPaper.length !== selectedNewsPapers.length) {
      setIsSelectAllOptionClick(false)
    } else {
      setIsSelectAllOptionClick(true)
    }
  }, [newsPaper.length, selectedNewsPapers.length])

  const resetValuesExit = {
    id: null,
    wardKey: null,
    departmentKey: null,
    advertisementType: null,
    pressNoteSubject: "",
    newsPaper: null,
    pressNoteDescription: null,
    pressNoteReleaseDate: null,
    finalFiles: [],
  }

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    // setmodalforAprov(false)

    router.push("/newsRotationManagementSystem/transaction/pressNoteRelease/")
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
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
                <strong>
                  <FormattedLabel id={"pressNoteReleaseHeading"} />
                </strong>
              </h2>
            </Box>

            <Divider />

            <Box>
              <Box p={1}>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
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
                            sx={{ width: 300 }}
                            error={!!errors.zoneKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="zone" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled={
                                    router?.query?.pageMode === "View" ||
                                    router?.query?.pageMode === "PROCESS"
                                  }
                                  sx={{ width: "250px" }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="zone" required />}
                                >
                                  {zoneDropDown &&
                                    zoneDropDown.map((value, index) => (
                                      <MenuItem
                                        key={index}
                                        value={
                                          //@ts-ignore
                                          value.id
                                        }
                                      >
                                        {language == "en"
                                          ? //@ts-ignore
                                            value.zoneEn
                                          : // @ts-ignore
                                            value?.zoneMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="zoneKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zoneKey ? errors.zoneKey.message : null}
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
                            sx={{ width: 300 }}
                            error={!!errors.wardKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Location Name */}
                              {<FormattedLabel id="ward" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled={
                                    router?.query?.pageMode === "View" ||
                                    router?.query?.pageMode === "PROCESS"
                                  }
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  InputLabelProps={{
                                    shrink: watch("wardKey") ? true : false,
                                  }}
                                >
                                  {ward?.map((each, index) => (
                                    <MenuItem key={index} value={each.id}>
                                      {language == "en"
                                        ? each.wardName
                                        : each.wardNameMr}
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
                            error={!!errors.departmentKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="department" required />}
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
                                  onChange={(value) => field.onChange(value)}
                                  InputLabelProps={{
                                    shrink: watch("departmentKey")
                                      ? true
                                      : false,
                                  }}
                                >
                                  {department &&
                                    department.map((department, index) => (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
                                        {language == "en"
                                          ? department.department
                                          : department.departmentMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="departmentKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.departmentKey
                                ? errors.departmentKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        {/* <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
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
                            error={!!errors.advertisementType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {
                                <FormattedLabel
                                  required
                                  id="advertisementType"
                                />
                              }
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
                                  onChange={(value) => field.onChange(value)}
                                  {...register("advertisementType")}
                                  InputLabelProps={{
                                    shrink: watch("advertisementType")
                                      ? true
                                      : false,
                                  }}
                                >
                                  {advertisementType.map((p, index) => (
                                    <MenuItem key={index} value={p.id}>
                                      {language == "en"
                                        ? p.advertisementType
                                        : p.advertisementTypeMr}
                                    </MenuItem>
                                  ))}
                               
                                </Select>
                              )}
                              name="advertisementType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.advertisementType
                                ? errors.advertisementType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}

                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
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
                            variant="standard"
                            style={{ marginTop: 10 }}
                            error={!!errors.pressNoteReleaseDate}
                          >
                            <Controller
                              control={control}
                              name="pressNoteReleaseDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled={
                                      router?.query?.pageMode === "View" ||
                                      router?.query?.pageMode === "PROCESS"
                                    }
                                    variant="standard"
                                    inputFormat="DD/MM/yyyy"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        {
                                          <FormattedLabel
                                            required
                                            id="pressNoteReleaseDate"
                                          />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    minDate={new Date()}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format(
                                          "YYYY-MM-DDThh:mm:ss"
                                        )
                                      )
                                    }
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        sx={{ width: 300 }}
                                        error={!!errors.pressNoteReleaseDate}
                                      />
                                    )}
                                    InputLabelProps={{
                                      shrink: watch("pressNoteReleaseDate")
                                        ? true
                                        : false,
                                    }}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.pressNoteReleaseDate
                                ? errors.pressNoteReleaseDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        {/* news Paper */}
                        <Grid
                          item
                          xl={12}
                          lg={12}
                          md={12}
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
                            {/* <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="newsPaperName" required />}
                            </InputLabel> */}
                            <Controller
                              render={({ field }) => (
                                <Autocomplete
                                  disabled={
                                    router?.query?.pageMode === "View" ||
                                    router?.query?.pageMode === "PROCESS"
                                  }
                                  InputLabelProps={{
                                    shrink: watch("newsPaper") ? true : false,
                                  }}
                                  multiple
                                  value={selectedNewsPapers}
                                  fullWidth
                                  sx={{ width: 1100 }}
                                  size="small"
                                  id="checkboxes-tags-demo"
                                  options={[
                                    {
                                      id: 0,
                                      newspaperName: "Select All",
                                      newspaperNameMr: "सर्व निवडा",
                                    },
                                    ...newsPaper,
                                  ]}
                                  disableCloseOnSelect
                                  getOptionLabel={(option) =>
                                    language === "en"
                                      ? option.newspaperName
                                      : option.newspaperNameMr
                                  }
                                  onChange={handleSelectedNewsPapers}
                                  renderOption={(
                                    props,
                                    option,
                                    { selected }
                                  ) => (
                                    <>
                                      <li {...props}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          checked={
                                            option.newspaperName ===
                                            "Select All"
                                              ? isSelectAllOptionClick
                                              : selectedNewsPapers
                                                  ?.map((val) => val?.id)
                                                  ?.includes(option?.id)
                                          }
                                        />
                                        {language === "en"
                                          ? option.newspaperName
                                          : option.newspaperNameMr}
                                      </li>
                                    </>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      variant="standard"
                                      {...params}
                                      label={
                                        <FormattedLabel
                                          id="newsPaperName"
                                          required
                                        />
                                      }
                                    />
                                  )}
                                />

                                // <Select
                                //   disabled={
                                //     router?.query?.pageMode === "View" ||
                                //     router?.query?.pageMode === "PROCESS"
                                //   }
                                //   renderValue={(selected) =>
                                //     selected.join(", ")
                                //   }
                                //   MenuProps={MenuProps}
                                //   // disabled={router?.query?.pageMode === "View"}
                                //   labelId="demo-multiple-checkbox-label"
                                //   id="demo-multiple-checkbox"
                                //   multiple
                                //   sx={{ width: 1100 }}
                                //   // value={field.value}
                                //   value={selectedNewsPapers}
                                //   onChange={
                                //     // (value) => {
                                //     handleChange
                                //     // field.onChange(value);
                                //     // }
                                //   }
                                // >
                                //   {newsPaper &&
                                //     newsPaper.map((newsPaper, index) => (
                                //       <MenuItem
                                //         key={newsPaper.id}
                                //         value={newsPaper.newspaperName}
                                //       >
                                //         <Checkbox
                                //           checked={
                                //             selectedNewsPapers.indexOf(
                                //               newsPaper.newspaperName
                                //             ) > -1
                                //           }
                                //         />
                                //         <ListItemText
                                //           primary={newsPaper.newspaperName}
                                //         />
                                //       </MenuItem>
                                //       // <MenuItem key={index} value={newsPaper.id}>
                                //       //   {language == "en" ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
                                //       // </MenuItem>
                                //     ))}
                                // </Select>
                              )}
                              name="newsPaper"
                              control={control}
                              defaultValue=""
                              InputLabelProps={{
                                shrink: watch("newsPaper") ? true : false,
                              }}
                            />
                            <FormHelperText>
                              {errors?.newsPaper
                                ? errors.newsPaper.message
                                : null}
                            </FormHelperText>
                          </FormControl>

                          {/* <FormControl
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
                                router?.query?.pageMode === "View" || router?.query?.pageMode === "PROCESS"
                              }
                              sx={{ width: 600 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              {newsPaper &&
                                newsPaper.map((newsPaper, index) => (
                                  <MenuItem key={index} value={newsPaper.id}>
                                    {language == "en" ? newsPaper.newspaperName : newsPaper.newspaperNameMr}
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
                        <FormHelperText>{errors?.newsPaper ? errors.newsPaper.message : null}</FormHelperText>
                      </FormControl> */}
                        </Grid>
                      </Grid>

                      {/* <Grid container sx={{ padding: "10px" }}></Grid> */}
                      {/* press note subject  */}
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled={
                              router?.query?.pageMode === "View" ||
                              router?.query?.pageMode === "PROCESS"
                            }
                            sx={{ width: 1100 }}
                            id="standard-textarea"
                            label={
                              <FormattedLabel required id="pressNoteSubject" />
                            }
                            multiline
                            variant="standard"
                            {...register("pressNoteSubject")}
                            error={!!errors.pressNoteSubject}
                            helperText={
                              errors?.pressNoteSubject
                                ? errors.pressNoteSubject.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("pressNoteSubject") ? true : false,
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/*press note  description  */}
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          p={1}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            disabled={
                              router?.query?.pageMode === "View" ||
                              router?.query?.pageMode === "PROCESS"
                            }
                            sx={{ width: 1100 }}
                            id="standard-textarea"
                            label={
                              <FormattedLabel
                                required
                                id="pressNoteDescription"
                              />
                            }
                            multiline
                            variant="standard"
                            {...register("pressNoteDescription")}
                            error={!!errors.pressNoteDescription}
                            helperText={
                              errors?.pressNoteDescription
                                ? errors.pressNoteDescription.message
                                : null
                            }
                            InputLabelProps={{
                              shrink: watch("pressNoteDescription")
                                ? true
                                : false,
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "30px",
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                        }}
                      >
                        <h2>
                          <strong>
                            {language == "en" ? "Attachment" : "दस्तऐवज"}
                          </strong>
                        </h2>
                      </Box>
                      {/* Attachement */}
                      <Grid
                        container
                        style={{
                          marginTop: "1vh",
                        }}
                        spacing={3}
                      >
                        {/* docx news attachment */}
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
                          <Typography>
                            {<FormattedLabel id="pressNoteDocx" required />} :{" "}
                          </Typography>
                          <UploadButtonOP
                            error={!!errors?.advirtiseMentInDocx}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("advirtiseMentInDocx")}
                            fileKey={"advirtiseMentInDocx"}
                            showDel={
                              ["Add", "Edit"].includes(router?.query?.pageMode)
                                ? true
                                : false
                            }
                            showDelBtn={
                              ["Add", "Edit"].includes(router?.query?.pageMode)
                                ? true
                                : false
                            }
                            // showDel={true}
                          />
                          <FormHelperText error={!!errors?.advirtiseMentInDocx}>
                            {errors?.advirtiseMentInDocx
                              ? errors?.advirtiseMentInDocx?.message
                              : null}
                          </FormHelperText>
                        </Grid>

                        {/* pdf news attachment */}
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
                          <Typography>
                            {<FormattedLabel id="pressNotePdf" required />} :{" "}
                          </Typography>
                          <UploadButtonOP
                            error={!!errors?.advirtiseMentInPdf}
                            appName={appName}
                            serviceName={serviceName}
                            fileDtl={getValues("advirtiseMentInPdf")}
                            fileKey={"advirtiseMentInPdf"}
                            showDel={
                              ["Add", "Edit"].includes(router?.query?.pageMode)
                                ? true
                                : false
                            }
                            showDelBtn={
                              ["Add", "Edit"].includes(router?.query?.pageMode)
                                ? true
                                : false
                            }

                            // showDel={["Add","Edit"].includes(router?.query?.pageMode) ? false : true}
                          />
                          <FormHelperText error={!!errors?.advirtiseMentInPdf}>
                            {errors?.advirtiseMentInPdf
                              ? errors?.advirtiseMentInPdf?.message
                              : null}
                          </FormHelperText>
                        </Grid>

                        {/* special Notice attachment */}
                        {/* {checked && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{<FormattedLabel id="specialNotice" />} : </Typography>
                      <UploadButtonOP
                        error={!!errors?.specialNotice}
                        appName={appName}
                        serviceName={serviceName}
                        fileDtl={getValues("specialNotice")}
                        fileKey={"specialNotice"}
                        showDel={["Add","Edit"].includes(router?.query?.pageMode) ? false : true}
                      />
                      <FormHelperText error={!!errors?.specialNotice}>
                        {errors?.specialNotice ? errors?.specialNotice?.message : null}
                      </FormHelperText>
                    </Grid>
                  )} */}
                      </Grid>

                      {/* <Grid item xs={12}>
                    <FileTable
                      appName="NRMS" //Module Name
                      serviceName={"N-NPR"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={_columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      authorizedToUpload={authorizedToUpload}
                    />
                  </Grid> */}

                      {authority && (
                        <>
                          <Grid
                            container
                            spacing={5}
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              paddingTop: "10px",
                              marginTop: "60px",
                            }}
                          >
                            {authority?.includes("ENTRY") &&
                              (router.query.pageMode == "Add" ||
                                router.query.pageMode == "Edit") &&
                              (getValues("status") == null ||
                                getValues("status") == "DRAFTED") && (
                                <>
                                  <Grid container ml={5} border px={5}>
                                    {/* Save as Draft */}
                                    <Grid item xs={2}></Grid>

                                    <Grid item>
                                      <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        endIcon={<SaveIcon />}
                                        onClick={() => setBtnSaveText("DRAFT")}
                                      >
                                        {language == "en"
                                          ? "Save As Draft"
                                          : "तात्पुरते जतन करा"}
                                      </Button>
                                    </Grid>
                                    <Grid item xs={2}></Grid>

                                    <Grid item>
                                      <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        onClick={() => setBtnSaveText("CREATE")}
                                        endIcon={<SaveIcon />}
                                      >
                                        {language == "en" ? "Save" : "जतन करा"}
                                      </Button>
                                    </Grid>

                                    <Grid item xs={2}></Grid>

                                    <Grid item>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        endIcon={<ExitToAppIcon />}
                                        onClick={() => exitButton()}
                                      >
                                        {language == "en"
                                          ? "Exit"
                                          : "बाहेर पडा"}
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                            {(authority?.includes("APPROVAL") ||
                              authority?.includes("FINAL_APPROVAL")) &&
                              router.query.pageMode == "PROCESS" && (
                                <>
                                  <Button
                                    variant="contained"
                                    endIcon={<NextPlanIcon />}
                                    color="success"
                                    onClick={() => {
                                      // alert(serviceId)
                                      setmodalforAprov(true)
                                    }}
                                  >
                                    <FormattedLabel id="actions" />
                                  </Button>
                                </>
                              )}

                            {authority?.includes("RELEASING_ORDER_ENTRY") &&
                              router.query.pageMode == "PROCESS" &&
                              getValues("status") == "APPROVED" && (
                                <>
                                  <Button
                                    sx={{ marginRight: 8 }}
                                    width
                                    variant="contained"
                                    endIcon={<GetAppRounded />}
                                    color="error"
                                    onClick={() => releasingOrderGeneration()}
                                  >
                                    {/* Rename Releasing Order As Generate Press Note | Client Requirements 16-10-2023 */}
                                    GENREATE PRESS NOTE
                                  </Button>
                                </>
                              )}

                            {authority?.includes("SEND_TO_PUBLISH") &&
                              router.query.pageMode == "PROCESS" &&
                              getValues("status") == "FINAL_APPROVED" && (
                                <Button
                                  sx={{ marginRight: 8 }}
                                  width
                                  variant="contained"
                                  endIcon={<Send />}
                                  color="primary"
                                  onClick={() => sendPressNoteToPublish()}
                                >
                                  SEND PRESS NOTE TO PUBLISH
                                </Button>
                              )}

                            {(router?.query?.pageMode == "PROCESS" ||
                              router?.query?.pageMode == "Edit") &&
                              typeof getValues("status") != "undefined" &&
                              (getValues("status") ==
                                "REVERT_BY_FINAL_AUTHORITY" ||
                                getValues("status") ==
                                  "REVERT_BACK_TO_CONCERN_DEPT_USER") && (
                                <>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    endIcon={<SaveIcon />}
                                    onClick={() => setBtnSaveText("UPDATE")}
                                  >
                                    UPDATE
                                  </Button>
                                </>
                              )}
                            {/* 
                            {getValues("status") != "DRAFTED" &&
                              typeof getValues("status") != "undefined" && (
                                <Button
                                  sx={{ marginRight: 8 }}
                                  width
                                  variant="contained"
                                  endIcon={<ExitToAppIcon />}
                                  color="error"
                                  onClick={() =>
                                    router.push(
                                      `/newsRotationManagementSystem/transaction/pressNoteRelease/`
                                    )
                                  }
                                >
                                  Exit
                                </Button>
                              )} */}
                            {router?.query?.pageMode == "PROCESS" &&
                              typeof getValues("status") != "undefined" && (
                                <Button
                                  sx={{ marginRight: 8 }}
                                  width
                                  variant="contained"
                                  endIcon={<ExitToAppIcon />}
                                  color="error"
                                  onClick={() =>
                                    router.push(
                                      `/newsRotationManagementSystem/transaction/pressNoteRelease/`
                                    )
                                  }
                                >
                                  Exit
                                </Button>
                              )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </form>
                </FormProvider>
              </Box>
            </Box>
          </Paper>

          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={styles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false)
                }}
              >
                <div className={styles.boxRemark}>
                  <div className={styles.titlemodelremarkAprove}>
                    <Typography
                      className={styles.titleOne}
                      variant="h6"
                      component="h2"
                      color="#f7f8fa"
                      style={{ marginLeft: "25px" }}
                    >
                      <FormattedLabel id="remarkModel" />
                    </Typography>
                    <IconButton>
                      <CloseIcon
                        onClick={
                          () =>
                            setmodalforAprov(
                              false
                            ) /* router.push(`/newsRotationManagementSystem/transaction/pressNoteRelease`) */
                        }
                      />
                    </IconButton>
                  </div>

                  <div
                    className={styles.btndate}
                    style={{ marginLeft: "200px" }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      placeholder="Enter a Remarks"
                      style={{ width: 700 }}
                      // onChange={(e) => {
                      //   setRemark(e.target.value)
                      // }}
                      // name="remark"
                      {...register("remark")}
                    />
                  </div>

                  <div className={styles.btnappr}>
                    <Button
                      variant="contained"
                      color="success"
                      endIcon={<ThumbUpIcon />}
                      onClick={() => {
                        remarks("APPROVE")
                        // setBtnSaveText('APPROVED')
                        // alert(serviceId)

                        // {
                        //   router.push(
                        //     `/newsRotationManagementSystem/transaction/pressNoteRelease`
                        //   );
                        // }
                      }}
                    >
                      <FormattedLabel id="APPROVE" />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<UndoIcon />}
                      onClick={() => {
                        remarks("REASSIGN")

                        // alert(serviceId, 'REASSIGN')
                        // router.push(`/newsRotationManagementSystem/transaction/pressNoteRelease`);
                      }}
                    >
                      <FormattedLabel id="REASSIGN" />
                    </Button>
                    {router.query.role == "FINAL_APPROVAL" ? (
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ReportIcon />}
                        onClick={() => {
                          remarks("REJECT")
                        }}
                      >
                        <FormattedLabel id="reject" />
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button
                      variant="contained"
                      endIcon={<CloseIcon />}
                      color="error"
                      onClick={() => {
                        // swal({
                        //     title: "Exit?",
                        //     text: "Are you sure you want to Close the window ? ",
                        //     icon: "warning",
                        //     buttons: true,
                        //     dangerMode: true,
                        // }).then((willDelete) => {
                        //     if (willDelete) {
                        //         swal("Modal Closed!", {
                        //             icon: "success",
                        //         });
                        setmodalforAprov(false)
                        //         // router.push(`/newsRotationManagementSystem/transaction/pressNoteRelease`);
                        //     } else {
                        //         swal("Modal Closed");
                        //     }
                        // });
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </form>
        </>
      )}
    </>
  )
}

export default Create
