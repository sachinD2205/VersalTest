import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ownershipTypeSchema = yup.object().shape({

  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),

  ownershipTypePrefix: yup
    .string().nullable()
    .required(<FormattedLabel id="ownershipTypePrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in ownership type prefix."
    )
    .max(15, <FormattedLabel id="ownershipTypePrefixLength" />),

  ownershipType: yup
    .string().nullable()
    .required(<FormattedLabel id="ownershipTypeValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in ownership type."
    )
    .max(50, <FormattedLabel id="ownershipTypeReqLength" />),

  ownershipTypeMr: yup
    .string().nullable()
    .required(<FormattedLabel id="ownershipTypeMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in ownership type (Marathi)."
    )
    .max(100, <FormattedLabel id="ownershipTypeMrLength" />),
});

export default ownershipTypeSchema;
