import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let trnNewApplicationSchema = yup.object().shape({
  areaKey: yup.string().nullable().required(<FormattedLabel id="areaKeyValidation" />),
  zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  benecode: yup.string().nullable().required(<FormattedLabel id="benecodeValidation" />),
  mainSchemeKey: yup
    .string().nullable()
    .required(<FormattedLabel id="mainSchemeKeyValidation" />),
  subSchemeKey: yup
    .string().nullable()
    .required(<FormattedLabel id="subSchemeKeyValidation" />),
  applicantFirstName: yup
    .string()
    .required(<FormattedLabel id="applicantFirstNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant First Name."
    // )
    .max(50, <FormattedLabel id="applicantFirstNameValidtionLength" />),
  applicantMiddleName: yup
    .string()
    .required(<FormattedLabel id="applicantMiddleNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant Middle Name."
    // )
    .max(50, <FormattedLabel id="applicantMiddleNameValidtionLength" />),
  applicantLastName: yup
    .string()
    .required(<FormattedLabel id="applicantLastNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant Last Name."
    // )
    .max(50, <FormattedLabel id="applicantLastNameValidtionLength" />),
  gender: yup.string().required(<FormattedLabel id="genderValidation" />),
  flatBuldingNo: yup
    .string()
    .required(<FormattedLabel id="flatBuldingNoValidation" />),
  buildingName: yup
    .string()
    .required(<FormattedLabel id="buildingNameValidation" />),
  roadName: yup.string().required(<FormattedLabel id="roadNameValidation" />),
  landmark: yup.string().required(<FormattedLabel id="landmarkValidation" />),
  // geoCode: yup.string().required(<FormattedLabel id="geoCodeValidation" />),
  applicantAadharNo: yup
    .string()
    .required(<FormattedLabel id="applicantAadharNoValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Aadhar No.")
    .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />),
  // dateOfBirth: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id="dateOfBirthValidation" />),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required(<FormattedLabel id="ageValidation" />)
    .positive(<FormattedLabel id="agePtvValidation" />)
    .integer(<FormattedLabel id="ageIntValidation" />)
    .min(18, <FormattedLabel id="ageValidationLength" />),
  mobileNo: yup
    .string()
    .required(<FormattedLabel id="mobileNoValidation" />)
    .matches(phoneRegex, "Phone number is not valid"),
  emailId: yup
    .string()
    .required(<FormattedLabel id="emailIdValidation" />)
    .max(80, "Bachat Gat should not exceed 80 characters"),
  religionKey: yup
    .string().nullable()
    .required(<FormattedLabel id="religionKeyValidation" />),
  casteCategory: yup
    .string().nullable()
    .required(<FormattedLabel id="casteCategoryValidation" />),
  // disabilityCertificateValidity: yup
  //   .string()
  //   .required(<FormattedLabel id="disabilityCertificateValidityValidation" />),
  bankBranchKey: yup
    .string().nullable()
    .required(<FormattedLabel id="bankBranchKeyValidation" />),
  savingAccountNo: yup
    .string()
    .required(<FormattedLabel id="savingAccountNoValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Account No.")
    // .min(6, <FormattedLabel id="applicantAccountNoValidationMinLength" />)
    .max(18, <FormattedLabel id="savingAccountNoValidationLength" />),
  ifscCode: yup
    .string()
    .matches(/^[A-Za-z]{4}[0-9]{7}$/, "Invalid IFSC code")
    .required(<FormattedLabel id="ifscCodeValidation" />)
    .min(11, <FormattedLabel id="ifscCodeValidationMinLength" />)
    .max(11, <FormattedLabel id="ifscCodeValidtionLength" />),
    micrCode: yup
    .string()
    // .required(<FormattedLabel id="micrCodeValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in MICR Code."),
  // micrCode: yup
  //   .string()
  //   .required(<FormattedLabel id="micrCodeValidation" />),
  // .matches(/^[0-9]+$/, "Only numbers are allowed in MICR Code.")
  // .min(9, <FormattedLabel id="micrCodeValidtionMinLength" />)
  // .max(9, <FormattedLabel id="micrCodeValidtionLength" />),
  saOwnerFirstName: yup
    .string()
    .required(<FormattedLabel id="saOwnerFirstNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Saving Account First Name."
    // )
    .max(50, <FormattedLabel id="saOwnerFirstNameValidationLength" />),
  saOwnerMiddleName: yup
    .string()
    .required(<FormattedLabel id="saOwnerMiddleNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Saving Account Middle Name."
    // )
    .max(50, <FormattedLabel id="saOwnerMiddleNameValidationLength" />),
  saOwnerLastName: yup
    .string()
    .required(<FormattedLabel id="saOwnerLastNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Saving Account Last Name."
    // )
    .max(50, <FormattedLabel id="saOwnerLastNameValidationLength" />),
  branchName: yup
    .string()
    .required(<FormattedLabel id="branchNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Saving Branch name."
    // )
    .max(50, <FormattedLabel id="branchNameValidtionLength" />),
  // disabilityPercentage: yup
  //   .string()
  //   // .required("Disability percentage is required")
  //   .test(
  //     "is-greater-than-or-equal",
  //     "Disability must be greater than or equal to 40%",
  //     function (value) {
  //       if (!value) {
  //         // Skip validation if value is not provided
  //         return true;
  //       }
  //       const percentage = parseInt(value);
  //       return percentage >= 40;
  //     }
  //   )
  //   .max(2, "Only two digits allowed"),

  disabilityPercentage: yup
    .string()
    .test(
      "disability-validation",
      "Disability must be greater than or equal to 40%",
      function (value) {
        const { disabilityPercentage } = this.parent;
        if (
          disabilityPercentage !== "-" 
          // &&
          // parseFloat(disabilityPercentage) !== 0
        ) {
          if (!value) {
            // Skip validation if value is not provided
            return true;
          }
          const percentage = parseInt(value);
          return percentage >= 40;
        }
        return true; // Skip validation
      }
    )
    .max(2, "Only two digits allowed"),
});

export default trnNewApplicationSchema;
