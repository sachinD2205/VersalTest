import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let usageTypeSchema = yup.object().shape({
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),

  usageTypePrefix: yup
    .string()
    .required(<FormattedLabel id="usageTypePrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in usage type prefix."
    )
    .max(15, <FormattedLabel id="usageTypePrefixLength" />),

  usageType: yup
    .string()
    .required(<FormattedLabel id="usageTypeValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in usage type."
    )
    .max(50, <FormattedLabel id="usageTypeReqLength" />),

  usageTypeMr: yup
    .string()
    .required(<FormattedLabel id="usageTypeMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in usage type (Marathi)."
    )
    .max(100, <FormattedLabel id="usageTypeMrLength" />),
});

export default usageTypeSchema;
