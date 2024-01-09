import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

//Personal Details
export let personalDetailsSchema = yup.object().shape({
  title: yup.string().required(<FormattedLabel id="titleRemark"/>),
  titleMr: yup.string().required(<FormattedLabel id="titleRemark"/>),
  firstNameEn: yup.string().required(<FormattedLabel id="firstNameVal"/>),
  firstNameMr: yup
    .string()
    .required(<FormattedLabel id="firstNameValMr"/>)
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  middleNameEn: yup.string().required(<FormattedLabel id="middleNameVal"/>),
  middleNameMr: yup
    .string()
    .required(<FormattedLabel id="middleNameValMr"/>)
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  surnameEn: yup.string().required(<FormattedLabel id="lastNameVal"/>),
  surnameMr: yup
    .string()
    .required(<FormattedLabel id="lastNameValMr"/>)
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  gender: yup.string().required(<FormattedLabel id="genderVal"/>),
  mobile: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="mobileVal"/>)
    .min(10, "Mobile Number must be at least 10 number")
    // .max(10, "Mobile Number not valid on above 10 number")
    .required(<FormattedLabel id="mobileVal"/>),
  // panNo: yup.string().required("Please select a Pan No"),
  emailAddress: yup.string().email().required(<FormattedLabel id="emailVal"/>),
  address: yup.string().required(<FormattedLabel id="addressVal"/>),
    villageName: yup.string().nullable().required(<FormattedLabel id="villegeVal"/>),
    surveyNumber: yup.string().nullable().required(<FormattedLabel id="serveyNoVal"/>),
    citySurveyNo: yup.string().nullable().required(<FormattedLabel id="cityServeyNoVal"/>),
  // aadhaarNo: yup.string().required("Please select a Aadhaar No."),
});

//Area Details
export let areaDetailsSchema = yup.object().shape({
  // reservationNo: yup.string().nullable().required('Please select Reservation'),
  // // tDRZone: yup.string().nullable().required("Please select a Zone"),
  // villageName: yup.string().nullable().required('Please select a Village'),
  // gatNo: yup.string().nullable().required('Please select a Gat'),
  // pincode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, 'Must be only digits')
  //   .typeError(<FormattedLabel id="enterPinCode" />)
  //   .min(6, 'Pincode Number must be at least 6 number')
  //   .max(6, 'Pincode Number not valid on above 6 number')
  //   .required(),
  // // serviceCompletionDate: yup
  // //   .date()
  // //   .typeError(<FormattedLabel id="selectDate" />)
  // //   .required(),
  // surveyNumber: yup.string().nullable().required('Please enter survey Number'),
  // citySurveyNo: yup.string().nullable().required('Please enter city Survey No'),
});

// export let documentsUpload = yup.object().shape({})
