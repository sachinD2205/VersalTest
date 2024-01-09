import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let saveAsDraftInsuranceOfPhotopassSchema = yup.object().shape({
  spouseFirstName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in spouse first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameValidationLength" />)
    .nullable(),

  spouseMiddleName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in spouse middle name."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameValidationLength" />)
    .nullable(),

  spouseLastName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in spouse last name."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameValidationLength" />)
    .nullable(),

    spouseFirstNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse first name."
    )
    .max(100, <FormattedLabel id="proposedOwnerFirstNameMrValidationLength" />)
    .nullable(),

    spouseMiddleNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse middle name."
    )
    .max(100, <FormattedLabel id="proposedOwnerMiddleNameMrValidationLength" />)
    .nullable(),

    spouseLastNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse last name."
    )
    .max(100, <FormattedLabel id="proposedOwnerLastNameMrValidationLength" />)
    .nullable(),



  spouseOccupation: yup
    .string()
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in spouse occupation."
    )
    .max(50, <FormattedLabel id="spouseOccupationValidationLength" />)
    .nullable(),

  spouseMobileNo: yup
    .string()
    // .matches(phoneRegex, "Phone number is not valid")
    .nullable(),

  spouseEmail: yup
    .string()
    .max(80, <FormattedLabel id="emailIdValidtionLength" />)
    .nullable(),

  // spouseAge: yup.nullable()
    // .number()
    // .typeError("Age must be a number")
    // .positive(<FormattedLabel id="spouseAgePtvValidation" />)
    // .integer(<FormattedLabel id="spouseAgeIntValidation" />)
    // .min(18, <FormattedLabel id="spouseAgeValidationLength" />)
    // ,

  spouseAadharNo: yup
    .string()
    // .matches(/^[0-9]*$/, "Only numbers are allowed in Aadhar No.")
    // .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />)
    .nullable(),
});

export default saveAsDraftInsuranceOfPhotopassSchema;
