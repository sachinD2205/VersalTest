import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let subUsageTypeSchema = yup.object().shape({
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),

  usageTypeKey: yup
    .string()
    .required(<FormattedLabel id="usageTypeKeyValidation" />),

  subUsageTypePrefix: yup
    .string()
    .required(<FormattedLabel id="subUsageTypePrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in sub usage type prefix."
    )
    .max(15, <FormattedLabel id="subUsageTypePrefixLength" />),

  subUsageType: yup
    .string()
    .required(<FormattedLabel id="subUsageTypeValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in sub usage type."
    )
    .max(50, <FormattedLabel id="subUsageTypeReqLength" />),

  subUsageTypeMr: yup
    .string()
    .required(<FormattedLabel id="subUsageTypeMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in sub usage type (Marathi)."
    )
    .max(100, <FormattedLabel id="subUsageTypeMrLength" />),
});

export default subUsageTypeSchema;
