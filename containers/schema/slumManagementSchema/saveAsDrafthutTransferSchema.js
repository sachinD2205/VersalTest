import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
// schema - validation
let saveAsDrafthutTransferSchema = yup.object().shape({
  proposedOwnerFirstName: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameValidationLength" />),
  proposedOwnerFirstNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameMrValidationLength" />),
  proposedOwnerMiddleName: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameValidationLength" />),
  proposedOwnerMiddleNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameMrValidationLength" />),
  proposedOwnerLastName: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameValidationLength" />),
  proposedOwnerLastNameMr: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameMrValidationLength" />),
    // proposedOwnerMobileNo: yup
    // .string()
    // .matches(phoneRegex, "Phone number is not valid")
    // .nullable(),
  proposedOwnerAadharNo: yup
    .string()
    .matches(/^[0-9]*$/, "Only numbers are allowed in Aadhar No.")
    // .min(12, <FormattedLabel id="proposedOwnerAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="proposedOwnerAadharNoValidationLength" />)
    .nullable(),
});

export default saveAsDrafthutTransferSchema;
