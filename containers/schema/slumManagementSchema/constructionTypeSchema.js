import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let constructionTypeSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),
  constructionTypePrefix: yup
    .string()
    .required(<FormattedLabel id="constructionTypePrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in construction type prefix."
    )
    .max(15, <FormattedLabel id="constructionTypePrefixLength" />),
  // remarks: yup.string().required("Remark is Required"),
  constructionType: yup
    .string()
    .required(<FormattedLabel id="constructionTypeValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in construction type."
    )
    .max(50, <FormattedLabel id="constructionTypeReqLength" />),
  constructionTypeMr: yup
    .string()
    .required(<FormattedLabel id="constructionTypeMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in construction type (Marathi)."
    )
    .max(100, <FormattedLabel id="constructionTypeMrLength" />),
});

export default constructionTypeSchema;
