import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let schema = yup.object().shape({
  // fromDate: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id="bachatgatFromDate" />),
  // toDate: yup
  //   .string()
  //   .nullable()
  //   .required(<FormattedLabel id="bachatgatToDate" />),
  schemeName: yup.string().required(<FormattedLabel id="schemeNameReq" />),
  // .matches(
  //   // /^[a-zA-Z\s]+$/,
  //   // /^[a-z\d\s]+$/i,
  //   /^[a-zA-Z0-9\s\W]+$/,
  //   "Invalid Character."
  // ),
  // .max(50, <FormattedLabel id="schemeNameReqLength" /> ),
  schemeNameMr: yup.string().required(<FormattedLabel id="schemeNameReq" />),
  // .matches(
  //   // /^[a-zA-Z\s\u0900-\u097F]+$/,
  //   // /^[a-z\d\s\u0900-\u097F]+$/i,
  //   /^[a-zA-Z0-9\s\W\u0900-\u097F]+$/,
  //   "Invalid Character."
  // ),
  // .max(100, <FormattedLabel id="schemeNameReqMrLength" />),

  schemePrefix: yup.string().required(<FormattedLabel id="schemeNamePrefix" />),
  // .matches(
  //   /^[a-z\d\-_/.\s]+$/i,
  //   "Only characters and numbers are allowed in Scheme Prefix."
  // ),
  // .max(15, <FormattedLabel id="schemeNamePrefixLength" />),
});

export default schema;
