import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
// schema - validation
let hutTransferSchema = yup.object().shape({
  transferTypeKey: yup
    .string()
    .required(<FormattedLabel id="transferTypeKeyValidation" />).nullable(),
  proposedOwnerTitle: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerTitleValidation" />),
  proposedOwnerFirstName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerFirstNameValidation" />)
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameValidationLength" />),
  proposedOwnerFirstNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerFirstNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameMrValidationLength" />),
  proposedOwnerMiddleName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerMiddleNameValidation" />)
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameValidationLength" />),
  proposedOwnerMiddleNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerMiddleNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameMrValidationLength" />),
  proposedOwnerLastName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameValidation" />)
    .matches(
      /^[a-zA-Z\s]*$/,
      "Only characters are allowed in proposed owner first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameValidationLength" />),
  proposedOwnerLastNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in proposed owner first name (Marathi)."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameMrValidationLength" />),
  proposedOwnerMobileNo: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerMobileNoValidation" />)
    .matches(phoneRegex, "Phone number is not valid"),
  proposedOwnerAadharNo: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerAadharNoValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Aadhar No.")
    .min(12, <FormattedLabel id="proposedOwnerAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="proposedOwnerAadharNoValidationLength" />),
});

export default hutTransferSchema;
