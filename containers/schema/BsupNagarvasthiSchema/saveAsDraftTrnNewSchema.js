import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let saveAsDraftTrnNewApplicationSchema = yup.object().shape({
  applicantFirstName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant First Name."
    // )
    .max(50, <FormattedLabel id="applicantFirstNameValidtionLength" />)
    .nullable(),
  applicantMiddleName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant Middle Name."
    // )
    .max(50, <FormattedLabel id="applicantMiddleNameValidtionLength" />)
    .nullable(),
  applicantLastName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant Last Name."
    // )
    .max(50, <FormattedLabel id="applicantLastNameValidtionLength" />)
    .nullable(),

  //   applicantAadharNo: yup
  //     .string()
  //     .matches(/^[0-9]*$/, "Only numbers are allowed in Aadhar No.")
  //     .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
  //     .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />)
  //     .nullable(),
  age: yup
    .number()
    .typeError("Age must be a number")
    .positive(<FormattedLabel id="agePtvValidation" />)
    .integer(<FormattedLabel id="ageIntValidation" />)
    .min(18, <FormattedLabel id="ageValidationLength" />)
    .nullable(),
  mobileNo: yup
    .string()
    .matches(phoneRegex, "Phone number is not valid")
    .nullable(),
  emailId: yup
    .string()
    .max(80, "Bachat Gat should not exceed 80 characters")
    .nullable(),
  savingAccountNo: yup
    .string()
    .matches(/^[0-9]*$/, "Only numbers are allowed in Account No.")
    // .min(16, <FormattedLabel id="applicantAccountNoValidationMinLength" />)
    .max(18, <FormattedLabel id="savingAccountNoValidationLength" />)
    .nullable(),
  // ifscCode: yup
  //   .string()
  //   .matches(/^[A-Za-z]{4}[0-9]{7}$/, "Invalid IFSC code")
  //   // .min(11, <FormattedLabel id="ifscCodeValidationMinLength" />)
  //   .max(11, <FormattedLabel id="ifscCodeValidtionLength" />)
  //   .nullable(),
  // micrCode: yup
  //   .string()
  //   // .matches(/^[0-9]*$/, "Only numbers are allowed in MICR Code.")
  //   .min(9, <FormattedLabel id="micrCodeValidtionMinLength" />)
  //   .max(9, <FormattedLabel id="micrCodeValidtionLength" />),
  saOwnerFirstName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Saving Account First Name."
    // )
    .max(50, <FormattedLabel id="saOwnerFirstNameValidationLength" />)
    .nullable(),
  saOwnerMiddleName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Saving Account Middle Name."
    // )
    .max(50, <FormattedLabel id="saOwnerMiddleNameValidationLength" />)
    .nullable(),
  saOwnerLastName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Saving Account Last Name."
    // )
    .max(50, <FormattedLabel id="saOwnerLastNameValidationLength" />)
    .nullable(),
  branchName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Saving Branch name."
    // )
    .max(50, <FormattedLabel id="branchNameValidtionLength" />)
    .nullable(),
  disabilityPercentage: yup
    .string()
    // .required("Disability percentage is required")
    .test(
      "is-greater-than-or-equal",
      "Disability must be greater than or equal to 40%",
      function (value) {
        if (!value) {
          return true;
        }
        const percentage = parseInt(value);
        return percentage >= 40;
      }
    )
    .max(2, "Only two digits allowed")
    .nullable(),
});

export default saveAsDraftTrnNewApplicationSchema;
