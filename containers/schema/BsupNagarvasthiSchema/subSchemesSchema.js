import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let schema = yup.object().shape({
  fromDate: yup.string().nullable(),
  // .required(<FormattedLabel id="bachatgatFromDate" />),
  toDate: yup.string().nullable(),
  // .required(<FormattedLabel id="bachatgatToDate" />),
  subSchemeName: yup
    .string()
    .required(<FormattedLabel id="subSchemeNameReq" />),
  // .matches(/^[a-zA-Z\s]+$/, "Only characters are allowed in Sub Scheme Name.")
  // .matches(/^[a-zA-Z0-9\s\W]+$/, "Invalid Character."),
  // .matches(/^[a-z\d\-_/.\s]+$/i,"Special characters are not allowed in Sub Scheme Name (English)."),
  // .max(50, <FormattedLabel id="subSchemeNameReqLength" />),
  subSchemeNameMr: yup
    .string()
    .required(<FormattedLabel id="subSchemeNameMrReq" />),
  // .matches(
  //   /^[a-zA-Z\s\u0900-\u097F]+$/,
  //   "Only characters are allowed in Sub Scheme Name (Marathi)."
  // )
  // .matches(/^[a-z\d\-_/.\s\u0900-\u097F]+$/i,"Special characters are not allowed in Sub Scheme Name (Marathi)."),
  // .matches(/^[a-zA-Z0-9\s\W\u0900-\u097F]+$/, "Invalid Character."),
  // .max(100, <FormattedLabel id="subSchemeNameMrReqLength" />),
  subSchemePrefix: yup
    .string()
    .required(<FormattedLabel id="subSchemePrefReq" />),
  // .matches(
  //   /^[a-zA-Z0-9\s]+$/,
  //   "Only characters and numbers are allowed in Sub Scheme Prefix."
  // ),
  // .max(15, <FormattedLabel id="subSchemePrefReqLength" />),
  mainSchemeKey: yup.string().required(<FormattedLabel id="mainSchemeReq" />),
  benefitAmount: yup
    .string()
    .required(<FormattedLabel id="benefitAmountReq" />),
  installments: yup.string().required(<FormattedLabel id="installmentsReq" />),
});

export default schema;
