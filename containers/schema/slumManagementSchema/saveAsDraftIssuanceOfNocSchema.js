import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

// schema - validation
let issuanceOfNocSchema = yup.object().shape({
  // pincode: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Only numbers are allowed in Pincode.")
  //   .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
  //   .max(6, <FormattedLabel id="pinCodeValidtionLength" />)
  //   .nullable(),

  // ownerFirstName: yup
  //   .string()
  //   .matches(
  //     /^[a-zA-Z\s]*$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerFirstNameValidationLength" />)
  //   .nullable(),

  // ownerMiddleName: yup
  //   .string()
  //   .matches(
  //     /^[a-zA-Z\s]*$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerMiddleNameValidationLength" />)
  //   .nullable(),

  // ownerLastName: yup
  //   .string()
  //   .matches(
  //     /^[a-zA-Z\s]*$/,
  //     "Only characters are allowed in applicant first name."
  //   )
  //   .max(50, <FormattedLabel id="ownerLastNameValidationLength" />)
  //   .nullable(),

  // ownerMobileNo: yup
  //   .string()

  //   .matches(phoneRegex, "Phone number is not valid"),

  // ownerAadharNo: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Only numbers are allowed in Aadhar No.")
  //   .min(12, <FormattedLabel id="ownerAadharNoValidationMinLength" />)
  //   .max(12, <FormattedLabel id="ownerAadharNoValidationLength" />)
  //   .nullable(),

  applicantFirstName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in applicant first name."
    )
    .max(50, <FormattedLabel id="applicantFirstNameValidationLength" />)
    .nullable(),

  applicantFirstNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in applicant first name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantFirstNameMrValidationLength" />)
    .nullable(),

  applicantMiddleName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in applicant middle name."
    )
    .max(50, <FormattedLabel id="applicantMiddleNameValidationLength" />)
    .nullable(),

  applicantMiddleNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in applicant middle name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantMiddleNameMrValidationLength" />)
    .nullable(),

  applicantLastName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in applicant last name."
    )
    .max(50, <FormattedLabel id="applicantLastNameValidationLength" />)
    .nullable(),

  applicantLastNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in applicant last name (Marathi)."
    )
    .max(50, <FormattedLabel id="applicantLastNameMrValidationLength" />)
    .nullable(),

  // applicantMobileNo: yup
  //   .string()
  //   .matches(phoneRegex, "Phone number is not valid")
  //   .nullable(),

  applicantAadharNo: yup
    .string()
    .matches(/^[0-9]*$/, "Only numbers are allowed in Aadhar No.")
    // .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />)
    .nullable(),

    purpose: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in Purpose."
    )
    .nullable(),

  //   ownershipType: yup.string().required("Ownership type is Required"),
  //   ownershipTypeMr: yup.string().required("Ownership type (marathi) is Required"),
});

export default issuanceOfNocSchema;
