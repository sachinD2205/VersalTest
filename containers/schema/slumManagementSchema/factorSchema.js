import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let factorSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),
  factorPrefix: yup
    .string()
    .required(<FormattedLabel id="factorPrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in factor prefix."
    )
    .max(15, <FormattedLabel id="factorPrefixLength" />),
  // remarks: yup.string().required("Remark is Required"),
  factorName: yup
    .string()
    .required(<FormattedLabel id="factorNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in factor name."
    )
    .max(50, <FormattedLabel id="factorNameReqLength" />),

  factorNameMr: yup
    .string()
    .required(<FormattedLabel id="factorNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in factor name (Marathi)."
    )
    .max(100, <FormattedLabel id="factorNameMrLength" />),

  applicableOn: yup
    .string()
    .required(<FormattedLabel id="applicableOnValidation" />),
});

export default factorSchema;
