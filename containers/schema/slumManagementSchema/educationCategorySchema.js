import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let educationCategorySchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup.string().nullable().required(<FormattedLabel id="slumFromDate" />),
  toDate: yup.string().nullable().required(<FormattedLabel id="slumToDate" />),
  educationCategoryPrefix: yup
    .string()
    .required(<FormattedLabel id="educationCategoryPrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in education category prefix."
    )
    .max(15, <FormattedLabel id="educationCategoryPrefixLength" />),
  // remarks: yup.string().required("Remark is Required"),

  educationCategory: yup
  .string()
  .required(<FormattedLabel id="educationCategoryValidation" />)
  .matches(
    /^[a-zA-Z\s]+$/,
    "Only characters and spaces are allowed in education category."
  )
  .max(50, <FormattedLabel id="educationCategoryReqLength" />),


  educationCategoryMr: yup
  .string()
  .required(<FormattedLabel id="educationCategoryMrValidation" />)
  .matches(
    /^[a-zA-Z\s\u0900-\u097F]+$/,
    "Only characters are allowed in Education Category (Marathi)."
  )
  .max(100, <FormattedLabel id="educationCategoryMrLength" />),

  stream:yup.string().required(<FormattedLabel id="streamValidation" />),
  std:yup.string().required(<FormattedLabel id="stdValidation" />),
});

export default educationCategorySchema;