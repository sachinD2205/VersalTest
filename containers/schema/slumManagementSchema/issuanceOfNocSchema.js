import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

// schema - validation
let issuanceOfNocSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  //   fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // asOnDate: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id="asOnDateValidation" />),
  //   toDate: yup.string().nullable().required("To Date is Required !!!"),
  //   ownershipTypePrefix: yup.string().required("Ownership type Prefix is Required"),

  // ownerTitle: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerTitleValidation" />),

  // noOfCopies: yup
  //   .string()
  //   .required(<FormattedLabel id="noOfCopiesValidation" />),

  // slumKey: yup.string().required(<FormattedLabel id="slumKeyValidation" />),

  // areaKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),

  // villageKey: yup
  //   .string()
  //   .required(<FormattedLabel id="villageKeyValidation" />),

  // pincode: yup
  //   .string()
  //   .required(<FormattedLabel id="pinCodeValidtion" />)
  //   .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode.")
  //   .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
  //   .max(6, <FormattedLabel id="pinCodeValidtionLength" />),

  // ownerFirstName: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerFirstNameValidation" />)
  //   .matches(
  //     /^[a-zA-Z\s]+$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerFirstNameValidationLength" />),

  // ownerMiddleName: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerMiddleNameValidation" />)
  //   .matches(
  //     /^[a-zA-Z\s]+$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerMiddleNameValidationLength" />),

  // ownerLastName: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerLastNameValidation" />)
  //   .matches(
  //     /^[a-zA-Z\s]+$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerLastNameValidationLength" />),

  // ownerMobileNo: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerMobileNoValidation" />)
  //   .matches(phoneRegex, "Phone number is not valid"),

  // ownerAadharNo: yup
  //   .string()
  //   .required(<FormattedLabel id="ownerAadharNoValidation" />)
  //   .matches(/^[0-9]+$/, "Only numbers are allowed in Aadhar No.")
  //   .min(12, <FormattedLabel id="ownerAadharNoValidationMinLength" />)
  //   .max(12, <FormattedLabel id="ownerAadharNoValidationLength" />),

  applicantTitle: yup
  .string()
  .required(<FormattedLabel id="applicantTitleValidation" />),

  applicantFirstName: yup
    .string()
    .required(<FormattedLabel id="applicantFirstNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in applicant first name."
    )
    .max(50, <FormattedLabel id="applicantFirstNameValidationLength" />),

  applicantFirstNameMr: yup
    .string()
    .required(<FormattedLabel id="applicantFirstNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in applicant first name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantFirstNameMrValidationLength" />),

  applicantMiddleName: yup
    .string()
    .required(<FormattedLabel id="applicantMiddleNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in applicant middle name."
    )
    .max(50, <FormattedLabel id="applicantMiddleNameValidationLength" />),

  applicantMiddleNameMr: yup
    .string()
    .required(<FormattedLabel id="applicantMiddleNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in applicant middle name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantMiddleNameMrValidationLength" />),

  applicantLastName: yup
    .string()
    .required(<FormattedLabel id="applicantLastNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in applicant last name."
    )
    .max(50, <FormattedLabel id="applicantLastNameValidationLength" />),

  applicantLastNameMr: yup
    .string()
    .required(<FormattedLabel id="applicantLastNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in applicant last name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantLastNameMrValidationLength" />),

  applicantMobileNo: yup
    .string()
    .required(<FormattedLabel id="applicantMobileNoValidation" />)
    .matches(phoneRegex, "Phone number is not valid"),

  applicantAadharNo: yup
    .string()
    .required(<FormattedLabel id="applicantAadharNoValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Aadhar No.")
    .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />),

  //   ownershipType: yup.string().required("Ownership type is Required"),
  //   ownershipTypeMr: yup.string().required("Ownership type (marathi) is Required"),

  purpose: yup
  .string()
  .required(<FormattedLabel id="purposeValidation" />),
});

export default issuanceOfNocSchema;
