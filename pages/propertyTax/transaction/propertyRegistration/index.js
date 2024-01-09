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
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import sweetAlert from "sweetalert"
import urls from "../../../../URLS/urls"
import styles from "../../../../components/pTax/styles/PropertyRegistractionStepper.module.css"
import Loader from "../../../../containers/Layout/components/Loader"
import {
  useApplicantType,
  useGetToken,
  useLanguage,
  useLoggedInUser,
  useUser,
} from "../../../../containers/reuseableComponents/CustomHooks"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import theme from "../../../../theme.js"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import PropertyHolderDetails from "../../../../components/pTax/components/PropertyHolderDetails.js"
import AddressOfPropertyHolder from "../../../../components/pTax/components/AddressOfPropertyHolder.js"
import PropertyInformation from "../../../../components/pTax/components/PropertyInformation.js"
import AdditionalInformation from "../../../../components/pTax/components/AdditionalInformation.js"
import PropertyRegistractionDocumentUpload from "../../../../components/pTax/components/PropertyRegistractionDocumentUpload.js"
import { PropertyRegistractionSchema, EmptySchema, AddressOfPropertyHolderSchema1, AddressOfPropertyHolderSchema2, PropertyInformationSchema, additionalInfoSchemaforWaterElectricAndBankDetails, additionalInfoSchemaforWaterAndBankDetails, additionalInfoSchemaforElectricAndBankDetails, additionalInfoSchemaforBankDetails, propertyRegistractionDocumentsUploadSchema } from "../../../../components/pTax/schema/PropertyRegistractionSchema.js"

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
    <strong key={1}>{<FormattedLabel id="propertyHolderDetails" key={2} />}</strong>,
    <strong key={2}>{<FormattedLabel id="address" key={3} />}</strong>,
    <strong key={3}>
      {<FormattedLabel id="propertyInformation" key={4} />}
    </strong>,
    <strong key={4}>
      {<FormattedLabel id="additionalInfo" key={5} />}
    </strong>,
    <strong key={5}>
      {<FormattedLabel id="documents" key={6} />}
    </strong>,
  ]
}

//  stepper -Get Step Content Form
function getStepContent(step) {
  switch (step) {
    case 0:
      return <PropertyHolderDetails key={1} />

    case 1:
      return <AddressOfPropertyHolder key={2} />

    case 2:
      return <PropertyInformation key={3} />

    case 3:
      return <AdditionalInformation key={4} />

    case 4:
      return <PropertyRegistractionDocumentUpload key={5} />

    default:
      return "unknown step"
  }
}

// Linear Stepper - sachin
const LinaerStepper = () => {
  const language = useLanguage()
  const userToken = useGetToken()
  const user = useUser()
  const loggedInUser = useLoggedInUser()
  const applicantType = useApplicantType()
  const userID = useSelector(
    (state) => state?.user?.user?.id
  );
  const [dataValidation, setDataValidation] = useState(PropertyRegistractionSchema(language))

  const methods = useForm({
    resolver: yupResolver(dataValidation),
    defaultValues: {

      collapse: true,
      addHolderInputState: true,
      propertyHoldersDetails: null,

      // ! propertyInformation
      collapsePropertyInformation: true,
      addPropertyInformationInputState: true,
      propertyDetails: null,

      //! additonalInformation
      waterConnections: null,
      electricConnections: null,
      bankDetails: null,

      collapseWaterConnection: false,
      addWaterConnectionInformationInputState: false,

      collapseElectricConnection: false,
      addElectricConnectionInformationInputState: false,

      //! documents  -- Upload defultValues
      documents: [
        {
          "srNo": 1,
          "documentId": 39,
          "documentTypeEng": "Builder's letter",
          "documentTypeMr": "बांधकाम व्यावसायिकाचे पत्र",
          "activeFlag": "Y",
          "servieId": "140",
          "filePath": null,
          "documentApproveRejectRemark": "",
          "documentStatus": "1",
          "fileName": null,
          "documentIsRequied": true
        },
        {
          "srNo": 2,
          "documentId": 38,
          "documentTypeEng": "Bills of construction materials",
          "documentTypeMr": "बांधकाम साहित्याची बिले",
          "activeFlag": "Y",
          "servieId": "140",
          "filePath": null,
          "fileName": null,
          "documentApproveRejectRemark": "",
          "documentStatus": "1",
          "documentIsRequied": true
        },
        {
          "srNo": 3,
          "documentId": 37,
          "documentTypeEng": "Building completion certificate",
          "documentTypeMr": "इमारत पूर्णत्वाचा दाखला",
          "activeFlag": "Y",
          "filePath": null,
          "fileName": null,
          "documentApproveRejectRemark": "",
          "documentStatus": "1",
          "documentIsRequied": true
        },
        {
          "srNo": 4,
          "documentId": 36,
          "documentTypeEng": "Copy of approved building construction map",
          "documentTypeMr": "इमारत बांधकाम मंजूर नकाशाची प्रत ",
          "activeFlag": "Y",
          "filePath": null,
          "fileName": null,
          "documentApproveRejectRemark": "",
          "documentStatus": "1",
          "documentIsRequied": true
        },
        {
          "srNo": 5,
          "documentId": 35,
          "documentTypeEng": " Documents regarding ownership of the premises",
          "documentTypeMr": "जागेच्या मालकी हक्काबाबतची कागदपत्रे",
          "activeFlag": "Y",
          "filePath": null,
          "fileName": null,
          "documentApproveRejectRemark": "",
          "documentStatus": "1",
          "documentIsRequied": true
        }
      ],




    }
  })
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    trigger,
    handleSubmit,
    methos,
    watch,
    reset,
    formState: { errors },
  } = methods
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const router = useRouter()
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
  const [formPreviewDailog, setFormPreviewDailog] = useState(false)
  const formPreviewDailogOpen = () => setFormPreviewDailog(true)
  const formPreviewDailogClose = () => {
    setValue("disabledFieldInputState", false)
    setFormPreviewDailog(false)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }



  const getDocumentByServiceId = () => {

    const url = `${urls.CFCURL}/master/documentMaster/getDocumentByService?serviceId=${140}`;

    const header = {
      Authorization: `Bearer ${userToken}`,
    };

    axios
      .get(url, {
        headers: header
      })
      .then((res) => {

        console.log("dsflsdkfj23432", res?.data)

        if (res?.status == 200 || res.status == 201) {

          let mapData = res?.data?.map((data, index) => {
            return {
              srNo: index + 1,
              documentId: data?.id,
              documentTypeEng: data?.documentTypeEng,
              documentTypeMr: data?.documentTypeMr,
              servieId: data?.servieId,
              filePath: null,
              remark: "",
              status: 0,
            }
          })

          setDocumentListByServiceId(mapData);

        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));


  }





  const handleNext = (data) => {

    console.log("324234324324324234", errors)


    const viewMode = localStorage.getItem("disabledFieldInputState") == true || localStorage.getItem("disabledFieldInputState") == "true" || localStorage.getItem("disabledFieldInputState") == "1";

    if (!viewMode) {
      const url = `${urls.PTAXURL}/transaction/property/saveV1`;

      console.log("PropertyRegistractionHandleNextData", data);

      if (activeStep == steps.length - 1) {
        savePropertyRegistractionFinal(url);
      }
      else {
        if (activeStep === 0) {

          let applicantTest = watch("propertyHoldersDetails")?.filter((data) => data?.activeFlag == "Y")?.find((data) => data?.applicantOrCoApplicant == true || data?.applicantOrCoApplicant == "true" || data?.applicantOrCoApplicant == "1");

          console.log("applicantTest9898", applicantTest)


          if (applicantTest == undefined || applicantTest == null || applicantTest == "") {
            language == "en" ? sweetAlert(
              "कृपया अर्जदार निवडा !",
              `please select applicant from property holder`,
              "warning",
              {
                buttons: { ok: "OK" },
              }
            )
              : sweetAlert(
                "Please select an applicant !",
                `कृपया मालमत्ताधारकातून अर्जदार निवडा`,
                "warning",
                {
                  buttons: { ok: "ठीक आहे" },
                }
              );

          } else {
            savePropertyRegistraction(url);
          }


        } else {
          savePropertyRegistraction(url);
        }
      }

    } else {
      setActiveStep(activeStep + 1);
    }

  }

  const savePropertyRegistraction = (url) => {


    const finalBodyApi = {
      ...watch(),
      status: watch("status") != null && watch("status") != undefined && watch("status") != "" ? watch("status") : "DRAFT",
      activeFlag: "Y",
      serviceId: 140,
      createdUserId: userID,
      applicantType: applicantType,
      id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
    };



    axios
      .post(url, finalBodyApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res) {
          console.log("response", res?.data?.message.split("@")[1]);
          const id = null;
          setValue("propertyRegistractionId", res?.data?.message.split("@")[1]);
          setActiveStep(activeStep + 1);
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));

  }
  const savePropertyRegistractionFinal = (url) => {



    let documentNotUploaded = watch("documents")?.filter((data) => data?.filePath == undefined || data?.filePath == "" || data?.filePath == null)

    console.log("documentNotUploaded", documentNotUploaded);

    if (documentNotUploaded != length != null && documentNotUploaded != undefined && documentNotUploaded != "" && documentNotUploaded.length >= 1) {

      language == "en" ? sweetAlert(
        "Error !",
        `please upload all documents`,
        "error",
        {
          buttons: { ok: "OK" },
        }
      )
        : sweetAlert(
          "त्रुटी !",
          `कृपया सर्व कागदपत्रे अपलोड करा`,
          "error",
          {
            buttons: { ok: "ठीक आहे" },
          }
        );

    } else {


      let applicantTest = watch("propertyHoldersDetails")?.filter((data) => data?.activeFlag == "Y")?.find((data) => data?.applicantOrCoApplicant == true || data?.applicantOrCoApplicant == "true" || data?.applicantOrCoApplicant == "1");

      let applicantDetails = null;

      console.log("applicantTes24234", applicantTest)


      if (applicantTest != undefined || applicantTest != null || applicantTest != "") {

        console.log("applicant32423432", applicantTest)

        applicantDetails = {
          applicantFirstNameEng: applicantTest?.firstNameEng,
          applicantFirstNameMr: applicantTest?.firstNameMr,
          applicantMiddleNameEng: applicantTest?.middleNameEng,
          applicantMiddleNameMr: applicantTest?.middleNameMr,
          applicantLastNameEng: applicantTest?.lastNameEng,
          applicantLastNameMr: applicantTest?.lastNameMr,
          applicantAadharNumber: applicantTest?.aadharNo,
          applicantEmaiId: applicantTest?.emailID,
          applicantMobileNumber: applicantTest?.mobile,
          applicantPanNumber: applicantTest?.panNo,
          applicantFullNameEng: applicantTest?.fullNameEng,
          applicantFullNameMr: applicantTest?.fullNameMr,
          applicantGenderID: applicantTest?.genderID,
          applicantTitleID: applicantTest?.titleID,
          // fullAddressEng: applicantTest?. ,
          // fullAddressMar: applicantTest?. ,
          // fullAddressEngChecked: applicantTest?. ,
          // fullAddressMarChecked: applicantTest?. ,
          // postalFullAddressEng: applicantTest?.postalFullAddressMr,
          // postalFullAddressMr: applicantTest?.postalFullAddressEng,
        }



      }





      const finalBodyApi = {
        ...watch(),
        ...applicantDetails,
        status: "APPLICATION_CREATED",
        activeFlag: "Y",
        serviceId: 140,
        createdUserId: userID,
        applicantType: applicantType,
        id: watch("id") != null && watch("id") != undefined && watch("id") != null ? watch("id") : null,
      };


      console.log("applicantDetail", applicantDetails)
      console.log("finalBodyForApi", finalBodyApi)
      axios
        .post(url, finalBodyApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res) {
            console.log("response", res?.data?.message, "applicationNumber", res?.data?.message.split("@")[2]);
            const applicationNumber = res?.data?.message.split("@")[2];
            language == "en" ? sweetAlert(
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
              );

            if (user?.userDao?.cfcUser) {
              router.push("/CFC_Dashboard");
            } else if (user?.userDao?.deptUser) {
              router.push("/propertyTax/dashboard");
            } else {
              router.push("/dashboard");
            }
          }
        })
        .catch((error) => catchExceptionHandlingMethod(error, language));

    }






  }

  const getByIdPropertyRegistractionData = () => {


    console.log("sdfdslf32432", watch("propertyRegistractionId"))
    if (
      watch("propertyRegistractionId") != null &&
      watch("propertyRegistractionId") != undefined &&
      watch("propertyRegistractionId") != ""
    ) {
      setValue("loadderState", true)

      const url = `${urls.PTAXURL}/transaction/property/getById`;

      const finalBodyForApi = {
        id: watch("propertyRegistractionId")
      }


      axios
        .post(url, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {



            console.log("propertyRegistractionGetByIdData", r?.data)


            console.log("4534ddf", localStorage.getItem("disabledFieldInputState") == "true" || localStorage.getItem("disabledFieldInputState") == true || localStorage.getItem("disabledFieldInputState") == "1" ? true : false, localStorage.getItem("disabledFieldInputState"))

            if (r?.data) {


              console.log("PropertyDetailss324324324324324",

                r?.data?.propertyDetails,

                r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length,

                (r?.data?.propertyDetails != null && r?.data?.propertyDetails != undefined && r?.data?.propertyDetails != "" && r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y") >= 1),

                r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length >= 1
              )

              const finalData = {
                ...r?.data,

                //! propertyHoldersDetails
                collapse: (r?.data?.propertyHoldersDetails != null && r?.data?.propertyHoldersDetails != undefined && r?.data?.propertyHoldersDetails != "" && r?.data?.propertyHoldersDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

                addHolderInputState: (r?.data?.propertyHoldersDetails != null && r?.data?.propertyHoldersDetails != undefined && r?.data?.propertyHoldersDetails != "" && r?.data?.propertyHoldersDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

                //! propertyInformation 
                collapsePropertyInformation: (r?.data?.propertyDetails != null && r?.data?.propertyDetails != undefined && r?.data?.propertyDetails != "" && r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

                addPropertyInformationInputState: (
                  r?.data?.propertyDetails != null &&
                  r?.data?.propertyDetails != undefined &&
                  r?.data?.propertyDetails != ""
                  && r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

                //! electric
                collapseElectricConnection: false,
                addElectricConnectionInformationInputState: false,

                //! water
                addWaterConnectionInformationInputState: false,
                collapseWaterConnection: false,

                //! documents 
                documents: r?.data?.documents != null && r?.data?.documents != undefined && r?.data?.documents != "" && r?.data?.documents.length >= 1 ? r?.data?.documents?.sort((a, b) => a?.id - b?.id)?.map((data, index) => { return { srNo: index + 1, ...data } }) : null,




              }




              console.log("finalData3423", finalData)







              reset(finalData)
              setValue("trnProprtyHolderAddressDao.addressCheckBox",
                r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == true || r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == "true" || r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == 1 ? true : false);

              // disabledInputState 
              setValue("disabledFieldInputState", localStorage.getItem("disabledFieldInputState") == "true" || localStorage.getItem("disabledFieldInputState") == true || localStorage.getItem("disabledFieldInputState") == "1" ? true : false,);
            }
            setValue("loadderState", false)





            // reset(r?.data)
            // if (
            //   localStorage.getItem("issuanceOfHawkerLicenseInputState") == "true"
            // ) {
            //   setValue("disabledFieldInputState", true)
            // } else {
            //   setValue("disabledFieldInputState", false)
            // }
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


  const applyValidation = () => {
    // setDataValidation()



    console.log("collaspwe", watch("collapse"), watch("collapse") == false)


    if (activeStep == "0") {

      console.log("collapse", watch("collapse"));

      // setDataValidation(
      //   EmptySchema()
      // )

      if (watch("collapse") == false || watch("collapse") == 0 || watch("collapse") == "false") {
        setDataValidation(
          EmptySchema()
        )
      } else {
        setDataValidation(
          PropertyRegistractionSchema(
            language
          )
        )
      }


    }


    else if (activeStep == "1") {

      console.log("trnProprtyHolderAddressDao", watch("trnProprtyHolderAddressDao.addressCheckBox"))

      // setDataValidation(
      //   EmptySchema()
      // )

      // ! for billing address diffrent
      if (watch("trnProprtyHolderAddressDao.addressCheckBox") == true || watch("trnProprtyHolderAddressDao.addressCheckBox") == "true" || watch("trnProprtyHolderAddressDao.addressCheckBox") == 1) {
        setDataValidation(AddressOfPropertyHolderSchema2(language))
      }

      //! current address billing address same
      else {
        setDataValidation(AddressOfPropertyHolderSchema1(language))
      }


    }





    else if (activeStep == "2") {


      // setDataValidation(
      //   EmptySchema()
      // )


      console.log(watch("collapsePropertyInformation"), typeof watch("collapsePropertyInformation"), "32432432")



      if (watch("collapsePropertyInformation") == false || watch("collapsePropertyInformation") == "0" || watch("collapsePropertyInformation") == "false") {
        setDataValidation(
          EmptySchema()
        )
      } else {
        setDataValidation(
          PropertyInformationSchema(
            language
          )
        )
      }


    }

    else if (activeStep == "3") {


      // setDataValidation(
      //   EmptySchema()
      // )

      console.log("waterConnection32432423", watch("collapseElectricConnection"), watch("collapseWaterConnection"))

      if ((watch("collapseElectricConnection") == true || watch("collapseElectricConnection") == "true" || watch("collapseElectricConnection") == 1) && (watch("collapseWaterConnection") == true || watch("collapseWaterConnection") == 'true' || watch("collapseWaterConnection") == 1)) {
        setDataValidation(
          additionalInfoSchemaforWaterElectricAndBankDetails(language)
        )
      }
      else if ((watch("collapseWaterConnection") == true || watch("collapseWaterConnection") == 'true' || watch("collapseWaterConnection") == 1)) {
        setDataValidation(
          additionalInfoSchemaforWaterAndBankDetails(language)
        )
      } else if ((watch("collapseElectricConnection") == true || watch("collapseElectricConnection") == "true" || watch("collapseElectricConnection") == 1)) {
        setDataValidation(
          additionalInfoSchemaforElectricAndBankDetails(language)
        )
      } else {
        setDataValidation(
          additionalInfoSchemaforBankDetails(language)
        )

      }


    } else if (activeStep == "4") {

      setDataValidation(
        EmptySchema()
      )

      // setDataValidation(
      //   propertyRegistractionDocumentsUploadSchema(language)
      // )

    }

    // trigger()
  }



  // !  =======================> useEffect <================


  useEffect(() => {
    getByIdPropertyRegistractionData()
  }, [watch("propertyRegistractionId")])

  useEffect(() => {
    applyValidation()
  }, [
    activeStep,
    language,
    watch("collapse"),
    watch("trnProprtyHolderAddressDao.addressCheckBox"),
    watch("collapseWaterConnection"),
    watch("collapseElectricConnection"),
    watch("collapsePropertyInformation")
  ])


  useEffect(() => {
    const errorList = Object.keys(errors);
    if (errorList.length > 0) {
      toast.error(language == "en" ? "कृपया फॉर्म सबमिट करण्यापूर्वी सर्व आवश्यक फील्ड्स भरा!" : "Please fill out all required fields before submitting the form.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log("propertyRegistractionErrors", Object.keys(errors))
  }, [errors])

  useEffect(() => {

    console.log("4543534534", watch("disabledFieldInputState"))
  }, [watch("disabledFieldInputState")])

  useEffect(() => {


    setValue("loadderState", true);
    const propertTaxId = localStorage.getItem("propertyRegistractionId")



    console.log("propertTaxId", propertTaxId)

    if (propertTaxId) {
      setValue("propertyRegistractionId", propertTaxId)
    } else {
      setValue("loadderState", false);
    }

  }, [])




  //! View
  return (
    <div>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        {watch("loadderState") ? (
          <Loader />
        ) : (
          <Paper
            square
            className={styles.Paper}
            elevation={5}
          >
            {/** Main Heading */}
            <div className={styles.MainHeaderTitleDiv}>
              {<FormattedLabel id="propertyRegistration" />}
            </div>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {/** Steeper icons */}
                <Stack sx={{ width: "100%" }} spacing={4}>
                  <Stepper
                    className={styles.Stepper}
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
                <div>
                  {getStepContent(activeStep)}
                </div>

                {/** Button */}
                <div className={styles.ButtonDiv}>
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
                    <Button
                      className={styles.ButtonForMobileWidth}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                    >
                      {<FormattedLabel id="back" />}
                    </Button>

                    {!(watch("disabledFieldInputState") == true || watch("disabledFieldInputState") == "true" || watch("disabledFieldInputState") == "1") && (
                      <>
                        {activeStep != steps.length - 1 && (
                          <Button
                            variant="contained"
                            type="submit"
                            className={
                              styles.ButtonForMobileWidth
                            }
                          >
                            <FormattedLabel id="saveAndNext" />
                          </Button>
                        )}
                      </>
                    )}

                    {(watch("disabledFieldInputState") == true || watch("disabledFieldInputState") == "true" || watch("disabledFieldInputState") == "1") && (
                      <>
                        {activeStep != steps.length - 1 && (
                          <Button
                            className={
                              styles.ButtonForMobileWidth
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
                          {!(watch("disabledFieldInputState") == true || watch("disabledFieldInputState") == "true" || watch("disabledFieldInputState") == "1") && (
                            <>
                              <Button
                                className={
                                  styles.ButtonForMobileWidth
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
                                  styles.ButtonForMobileWidth
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
                      className={styles.ButtonForMobileWidth}
                      variant="contained"
                      onClick={() => {
                        localStorage.removeItem(
                          "applicationRevertedToCititizen"
                        )
                        localStorage.removeItem("DepartSideEditApplication")
                        localStorage.removeItem("issuanceOfHawkerLicenseId")
                        localStorage.removeItem("Draft")
                        if (loggedInUser == "departmentUser") {
                          router.push(
                            `/streetVendorManagementSystem/dashboards`
                          )
                        } else {
                          router.push(`/dashboard`)
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
                    <div
                    // style={{ pointerEvents: "none" }}
                    >
                      <PropertyHolderDetails />
                      <AddressOfPropertyHolder />
                      <PropertyInformation />
                      <AdditionalInformation />
                      <PropertyRegistractionDocumentUpload />
                    </div>
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
    </div>
  )
}

export default LinaerStepper
