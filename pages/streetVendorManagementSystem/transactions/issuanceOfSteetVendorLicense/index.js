import { yupResolver } from "@hookform/resolvers/yup"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark"
import Check from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import HomeIcon from "@mui/icons-material/Home"
import PermIdentityIcon from "@mui/icons-material/PermIdentity"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import VideoLabelIcon from "@mui/icons-material/VideoLabel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
} from "@mui/material"
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector"
import { styled } from "@mui/material/styles"
import axios from "axios"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import AadharAuthentication from "../../../../components/streetVendorManagementSystem/components/AadharAuthentication"
import AdditionalDetails from "../../../../components/streetVendorManagementSystem/components/AdditionalDetails"
import AddressOfHawker from "../../../../components/streetVendorManagementSystem/components/AddressOfHawker"
import DocumentsUpload from "../../../../components/streetVendorManagementSystem/components/DocumentsUpload"
import DocumentsUploadWithouDeleteButton from "../../../../components/streetVendorManagementSystem/components/DocumentsUploadWithouDeleteButton"
import HawkerDetails from "../../../../components/streetVendorManagementSystem/components/HawkerDetails"
import PropertyAndWaterTaxes from "../../../../components/streetVendorManagementSystem/components/PropertyAndWaterTaxes"
import {
  AadharAuthenticationSchema,
  AddressOfHawkerSchema,
  AddressOfHawkerSchema1,
  BusinessDetailsSchema,
  DocumentsUploadSchema,
  HawkerDetailsSchema,
  PropertyAndWaterTaxesValidation,
} from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema"
import IssuanceOfStreetVendorCSS from "../../../../components/streetVendorManagementSystem/styles/IssuanceOfHawkerLicenseSteeper.module.css"
import Loader from "../../../../containers/Layout/components/Loader"
import {
  useGetToken,
  useLoggedInUser,
  useUser,
} from "../../../../containers/reuseableComponents/CustomHooks"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import theme from "../../../../theme.js"
import { catchExceptionHandlingMethod } from "../../../../util/util"

// stepper -QontoStepIconRoot
const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}))

// stepper -  QontoStepIcon
function QontoStepIcon(props) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  )
}

// stepper - QontoStepIcon
QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
}

// stepper - ColorlibConnector
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}))

// stepper - ColorlibStepIconRoot
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}))

// stepper - ColorlibStepIcon
function ColorlibStepIcon(props) {
  const { active, completed, className } = props

  const icons = {
    1: <PermIdentityIcon />,
    2: <HomeIcon />,
    3: <BrandingWatermarkIcon />,
    4: <VideoLabelIcon />,
    5: <AddCircleIcon />,
    6: <UploadFileIcon />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

// stepper - ColorlibStepIcon
ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
}

// stepper - Get steps - Name
function getSteps(i) {
  return [
    <strong key={1}>{<FormattedLabel id="hawkerDetails" key={2} />}</strong>,
    <strong key={2}>{<FormattedLabel id="addressOfHawker" key={3} />}</strong>,
    <strong key={3}>
      {<FormattedLabel id="aadharAuthentication" key={4} />}
    </strong>,
    <strong key={4}>
      {<FormattedLabel id="PropertyAndWaterTaxes" key={5} />}
    </strong>,
    <strong key={5}>
      {<FormattedLabel id="additionalDetails" key={6} />}
    </strong>,
    <strong key={6}>{<FormattedLabel id="documentsUpload" key={7} />}</strong>,
  ]
}

//  stepper -Get Step Content Form
function getStepContent(step) {
  if (localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true") {
    switch (step) {
      case 0:
        return <HawkerDetails key={2} />

      case 1:
        return <AddressOfHawker key={3} />

      case 2:
        return <AadharAuthentication key={4} />

      case 3:
        return <PropertyAndWaterTaxes key={5} />

      case 4:
        return <AdditionalDetails key={6} />

      case 5:
        return <DocumentsUploadWithouDeleteButton key={7} />

      default:
        return "unknown step"
    }
  } else {
    switch (step) {
      case 0:
        return <HawkerDetails key={2} />

      case 1:
        return <AddressOfHawker key={3} />

      case 2:
        return <AadharAuthentication key={4} />

      case 3:
        return <PropertyAndWaterTaxes key={5} />

      case 4:
        return <AdditionalDetails key={6} />

      case 5:
        return <DocumentsUpload key={7} />

      default:
        return "unknown step"
    }
  }
}

// Linear Stepper - sachin
const LinaerStepper = () => {
  const language = useSelector((state) => state?.labels?.language)
  const user = useUser()
  const userToken = useGetToken()
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [dataValidation, setDataValidation] = useState(
    HawkerDetailsSchema(
      language,
      localStorage.getItem("castOtherA"),
      localStorage.getItem("castCategoryOtherA"),
      localStorage.getItem("applicantTypeOtherA"),
      localStorage.getItem("disablityNameYNA")
    )
  )
  const methods = useForm({
    resolver: yupResolver(dataValidation),
  })
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    handleSubmit,
    methos,
    watch,
    reset,
    formState: { errors },
  } = methods
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const dispach = useDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [draftId, setDraftId] = useState()
  const [userType1, setuserType] = useState(null)
  const [formPreviewDailog, setFormPreviewDailog] = useState(false)
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState()
  const [
    issuanceOfHawkerLicenseInputState,
    setIssuanceOfHawkerLicenseInputState,
  ] = useState(false)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  // formPreview
  const formPreviewDailogOpen = () => setFormPreviewDailog(true)
  const formPreviewDailogClose = () => {
    setValue("disabledFieldInputState", false)
    setFormPreviewDailog(false)
  }

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  // Handle Next
  const handleNext = (data) => {
    setValue("loadderState", true)
    if (loggedInUser == "citizenUser") {
      setuserType(1)
    } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
      setuserType(2)
    } else if (loggedInUser == "DEPT_USER") {
      setuserType(3)
    }

    // Final Save ----
    if (activeStep == steps.length - 1) {
      let finalBodyForApi
      let url = ``
      let role
      // Department Side Edit - Final Submit
      if (localStorage.getItem("DepartSideEditApplication") == "true") {
        finalBodyForApi = {
          ...data,
          applicationStatus: "SITE_VISIT_COMPLETED",
          pageMode: "SITE_VISIT_COMPLETED",
          id: draftId,
          activeFlag: "Y",
          serviceId: 24,
          crCityNameMr: "पिंपरी चिंचवड",
          crStateMr: "महाराष्ट्र",
          serviceName: "Issuance Of Hawker License",
          createdUserId: user?.id,
          userType: userType1,
          firstName: data?.firstName.trim(),
          firstNameMr: data?.firstNameMr.trim(),
          middleName: data?.middleName.trim(),
          middleNameMr: data?.middleNameMr.trim(),
          lastName: data?.lastName.trim(),
          lastNameMr: data?.lastNameMr.trim(),
        }
        // role
        role = "DEPT_CLERK_VERIFICATION"
        // url
        url = `${urls.HMSURL}/IssuanceofHawkerLicense/editIssuanceOfHawkerLicense`
      }

      // Citizen Side Final Submit
      else {
        // finalBody For Api
        finalBodyForApi = {
          ...data,
          applicationStatus: "APPLICATION_CREATED",
          pageMode: "APPLICATION_CREATED",
          id: draftId,
          activeFlag: "Y",
          serviceId: 24,
          crCityNameMr: "पिंपरी चिंचवड",
          crStateMr: "महाराष्ट्र",
          serviceName: "Issuance Of Hawker License",
          createdUserId: user?.id,
          userType: userType1,
          firstName: data?.firstName.trim(),
          firstNameMr: data?.firstNameMr.trim(),
          middleName: data?.middleName.trim(),
          middleNameMr: data?.middleNameMr.trim(),
          lastName: data?.lastName.trim(),
          lastNameMr: data?.lastNameMr.trim(),
        }
        // role
        role = "CITIZEN"
        // url
        url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`
      }

      //Api
      axios
        .post(url, finalBodyForApi, {
          headers: {
            role: role,
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            localStorage.removeItem("applicationRevertedToCititizen")
            localStorage.removeItem("issuanceOfHawkerLicenseId")
            localStorage.removeItem("DepartSideEditApplication")
            localStorage.removeItem("Draft")

            const applicationNumber = res?.data?.message?.slice("24")

            res?.data?.id
              ? sweetAlert(
                "Submitted!",
                `application number is ${applicationNumber}`,
                "success",
                {
                  buttons: { ok: "OK" },
                }
              )
              : sweetAlert(
                "अर्ज सादर केला!",
                `
              अर्ज क्रमांक ${applicationNumber}`,
                "success",
                {
                  buttons: { ok: "ठीक आहे" },
                }
              )


            if (loggedInUser == "citizenUser") {
              setValue("loadderState", false)
              router.push(`/dashboard`)
            } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
              setValue("loadderState", false)
              router.push(`/CFC_Dashboard`)
            } else if (loggedInUser == "DEPT_USER") {
              setValue("loadderState", false)
              router.push(`/streetVendorManagementSystem/dashboards`)
            }

          } else {
            setValue("loadderState", false)
          }
        })
        .catch((error) => {
          setValue("loadderState", false)
          callCatchMethod(error, language)
        })
    }

    // Other Steps
    else {
      // if dept userEdit
      if (localStorage.getItem("DepartSideEditApplication") == "true") {
        setActiveStep(activeStep + 1)
        setValue("loadderState", false)
      }
      //  Citizen Reverted Application
      else {
        if (localStorage.getItem("applicationRevertedToCititizen") == "true") {
          setActiveStep(activeStep + 1)
          setValue("loadderState", false)
        } else {
          let finalBodyForApi

          if (draftId != null || draftId !== undefined || !isNaN(draftId)) {
            finalBodyForApi = {
              ...data,
              applicationStatus: "DRAFT",
              pageMode: "DRAFT",
              id: draftId,
              serviceId: 24,
              activeFlag: "Y",
              createdUserId: user?.id,
              userType: userType1,
              serviceName: "Issuance Of Hawker License",
            }
          } else {
            finalBodyForApi = {
              ...data,
              applicationStatus: "DRAFT",
              pageMode: "DRAFT",
              serviceId: 24,
              createdUserId: user?.id,
              userType: userType1,
              activeFlag: "Y",
              serviceName: "Issuance Of Hawker License",
            }
          }

          axios
            .post(
              `${urls.HMSURL}/IssuanceofHawkerLicense/saveIssuanceOfHawkerLicense`,
              finalBodyForApi,
              {
                headers: {
                  role: "CITIZEN",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                language == "en"
                  ? toast.success("Application Updated Successfully !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  })
                  : toast.success("अर्ज यशस्वीरित्या अपडेट !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  })

                setDraftId(res?.data?.status?.slice(8))
                setValue("loadderState", false)
                setActiveStep(activeStep + 1)
              } else {
                setValue("loadderState", false)
              }
            })
            .catch((error) => {
              setValue("loadderState", false)
              callCatchMethod(error, language)
            })
        }
      }
    }
  }

  const getHawkerCertificateData = () => {
    setValue("loadderState", true)

    const url = `${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          reset(r?.data)
          if (
            localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true"
          ) {
            setValue("disabledFieldInputState", true)
          } else {
            setValue("disabledFieldInputState", false)
          }
          setValue("loadderState", false)
        } else {
          setValue("loadderState", false)
        }
      })
      .catch((error) => {
        setValue("loadderState", false)
        callCatchMethod(error, language)
      })
  }

  // !  =======================> useEffect <================

  useEffect(() => {
    setValue("disabledFieldInputState", false)
    if (activeStep == "0") {
      localStorage.setItem("castOtherA", watch("castOtherA"))
      localStorage.setItem("castCategoryOtherA", watch("castCategoryOtherA"))
      localStorage.setItem("applicantTypeOtherA", watch("applicantTypeOtherA"))
      localStorage.setItem("disablityNameYNA", watch("disablityNameYNA"))

      setDataValidation(
        HawkerDetailsSchema(
          language,
          watch("castOtherA"),
          watch("castCategoryOtherA"),
          watch("applicantTypeOtherA"),
          watch("disablityNameYNA")
        )
      )
    }

    if (
      localStorage.getItem("Draft") == "Draft" ||
      localStorage.getItem("applicationRevertedToCititizen") == "true" ||
      localStorage.getItem("DepartSideEditApplication") == "true"
    ) {
      if (
        localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
        localStorage.getItem("issuanceOfHawkerLicenseId") != ""
      ) {
        setIssuanceOfHawkerLicenseId(
          localStorage.getItem("issuanceOfHawkerLicenseId")
        )
        setDraftId(localStorage.getItem("issuanceOfHawkerLicenseId"))
      }
    }

    if (localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true") {
      setIssuanceOfHawkerLicenseInputState(true)
    } else {
      setIssuanceOfHawkerLicenseInputState(false)
    }
  }, [])

  useEffect(() => {
    if (
      issuanceOfHawkerLicenseId != null ||
      issuanceOfHawkerLicenseId != undefined
    ) {
      getHawkerCertificateData()
    }
  }, [issuanceOfHawkerLicenseId])

  useEffect(() => {
    setDataValidation()

    if (activeStep == "0") {
      localStorage.setItem("castOtherA", watch("castOtherA"))
      localStorage.setItem("castCategoryOtherA", watch("castCategoryOtherA"))
      localStorage.setItem("applicantTypeOtherA", watch("applicantTypeOtherA"))
      localStorage.setItem("disablityNameYNA", watch("disablityNameYNA"))

      setDataValidation(
        HawkerDetailsSchema(
          language,
          watch("castOtherA"),
          watch("castCategoryOtherA"),
          watch("applicantTypeOtherA"),
          watch("disablityNameYNA")
        )
      )
    } else if (activeStep == "1") {
      if (watch("addresDetail")) {
        setDataValidation(AddressOfHawkerSchema(language))
      } else {
        setDataValidation(AddressOfHawkerSchema1(language))
      }
    } else if (activeStep == "2") {
      setDataValidation(AadharAuthenticationSchema(language))
    } else if (activeStep == "3") {
      setDataValidation(PropertyAndWaterTaxesValidation(language))
    } else if (activeStep == "4") {
      setDataValidation(
        BusinessDetailsSchema(
          language,
          watch("oldLicenseYNA"),
          watch("voterNameYNA")
        )
      )
    } else if (activeStep == "5") {
      setDataValidation(
        DocumentsUploadSchema(language, watch("disablityNameYN"))
      )
    }
  }, [
    activeStep,
    language,
    watch("addresDetail"),
    watch("castOtherA"),
    watch("castCategoryOtherA"),
    watch("applicantTypeOtherA"),
    watch("disablityNameYNA"),
    watch("oldLicenseYNA"),
    watch("voterNameYNA"),
  ])

  //Errors
  useEffect(() => { }, [errors])

  useEffect(() => { }, [watch("addresDetail")])

  useEffect(() => { }, [language])

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        {watch("loadderState") ? (
          <Loader />
        ) : (
          <Paper
            square
            className={IssuanceOfStreetVendorCSS.Paper}
            elevation={5}
          >
            {/** Main Heading */}
            <div className={IssuanceOfStreetVendorCSS.MainHeaderTitleDiv}>
              {<FormattedLabel id="issuanceOfHawkerLicense" />}
            </div>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {/** Steeper icons */}
                <Stack sx={{ width: "100%" }} spacing={4}>
                  <Stepper
                    className={IssuanceOfStreetVendorCSS.Stepper}
                    alternativeLabel
                    activeStep={activeStep}
                    connector={<ColorlibConnector />}
                  >
                    {steps.map((label) => {
                      const labelProps = {}
                      const stepProps = {}

                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel
                            {...labelProps}
                            StepIconComponent={ColorlibStepIcon}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      )
                    })}
                  </Stepper>
                </Stack>
              </Grid>
            </Grid>
            {/** Main Form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleNext)}>
                <div id="issuanceOfHawkerLicensePDFContent">
                  {getStepContent(activeStep)}
                </div>

                {/** Button */}
                <div className={IssuanceOfStreetVendorCSS.ButtonDiv}>
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                      md: "row",
                      lg: "row",
                      xl: "row",
                    }}
                    spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                    justifyContent="center"
                    alignItems="center"
                    marginTop="7"
                    paddingBottom="500"
                  >
                    {/** Back Button */}
                    <Button
                      className={IssuanceOfStreetVendorCSS.ButtonForMobileWidth}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>

                    {/** SaveAndNext Button */}
                    {!localStorage.getItem(
                      "issuanceOfHawkerLicenseInputState"
                    ) && (
                        <>
                          {activeStep != steps.length - 1 && (
                            <Button
                              variant="contained"
                              type="submit"
                              className={
                                IssuanceOfStreetVendorCSS.ButtonForMobileWidth
                              }
                            >
                              <FormattedLabel id="saveAndNext" />
                            </Button>
                          )}
                        </>
                      )}

                    {localStorage.getItem(
                      "issuanceOfHawkerLicenseInputState"
                    ) && (
                        <>
                          {activeStep != steps.length - 1 && (
                            <Button
                              className={
                                IssuanceOfStreetVendorCSS.ButtonForMobileWidth
                              }
                              variant="contained"
                              type="submit"
                            >
                              <FormattedLabel id="next" />
                            </Button>
                          )}
                        </>
                      )}

                    {/**  Finish Submit */}
                    <>
                      {activeStep == steps.length - 1 && (
                        <>
                          {/** Form Preview Button */}
                          {!localStorage.getItem(
                            "issuanceOfHawkerLicenseInputState"
                          ) && (
                              <>
                                <Button
                                  className={
                                    IssuanceOfStreetVendorCSS.ButtonForMobileWidth
                                  }
                                  onClick={() => {
                                    setValue("disabledFieldInputState", true)
                                    formPreviewDailogOpen()
                                  }}
                                  variant="contained"
                                  endIcon={<VisibilityIcon />}
                                >
                                  {<FormattedLabel id="viewForm" />}
                                </Button>
                                <Button
                                  className={
                                    IssuanceOfStreetVendorCSS.ButtonForMobileWidth
                                  }
                                  type="submit"
                                >
                                  {<FormattedLabel id="submit" />}
                                </Button>
                              </>
                            )}
                        </>
                      )}
                    </>
                    {/** Exit Button */}
                    <Button
                      color="error"
                      className={IssuanceOfStreetVendorCSS.ButtonForMobileWidth}
                      variant="contained"
                      onClick={() => {
                        localStorage.removeItem(
                          "applicationRevertedToCititizen"
                        )
                        localStorage.removeItem("DepartSideEditApplication")
                        localStorage.removeItem("issuanceOfHawkerLicenseId")
                        localStorage.removeItem("Draft")
                        if (loggedInUser == "citizenUser") {
                          setValue("loadderState", false)
                          router.push(`/dashboard`)
                        } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
                          setValue("loadderState", false)
                          router.push(`/CFC_Dashboard`)
                        } else if (loggedInUser == "DEPT_USER") {
                          setValue("loadderState", false)
                          router.push(`/streetVendorManagementSystem/dashboards`)
                        }
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Stack>
                </div>

                {/** Form Preview Dailog  - OK */}
                <Dialog
                  fullWidth
                  maxWidth={"xl"}
                  open={formPreviewDailog}
                  onClose={() => {
                    setValue("disabledFieldInputState", false)
                    formPreviewDailogClose()
                  }}
                >
                  <CssBaseline />
                  <DialogTitle>
                    <Grid container>
                      <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                        {<FormattedLabel id="viewForm" />}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sm={2}
                        md={4}
                        lg={6}
                        xl={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <IconButton
                          aria-label="delete"
                          sx={{
                            marginLeft: "530px",
                            backgroundColor: "primary",
                            ":hover": {
                              color: "white",
                            },
                          }}
                          onClick={() => {
                            formPreviewDailogClose()
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: "black",
                            }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DialogTitle>
                  <DialogContent>
                    <HawkerDetails />
                    <AddressOfHawker />
                    <AadharAuthentication />
                    <PropertyAndWaterTaxes />
                    <AdditionalDetails />
                    <DocumentsUploadWithouDeleteButton />
                  </DialogContent>

                  <DialogTitle>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button onClick={() => formPreviewDailogClose()}>
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </DialogTitle>
                </Dialog>
              </form>
            </FormProvider>
          </Paper>
        )}
      </ThemeProvider>
    </>
  )
}

export default LinaerStepper
