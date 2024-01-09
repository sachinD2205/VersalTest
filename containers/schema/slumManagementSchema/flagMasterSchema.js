
import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let flagMasterSchema = yup.object().shape({
  fromDate: yup.string().nullable().required(<FormattedLabel id="slumFromDate" />),
  toDate: yup.string().nullable().required(<FormattedLabel id="slumToDate" />),


  setFor: yup.string().required(<FormattedLabel id="setForValidation" />)
  .matches(
    /^[a-zA-Z\s]+$/,
    "Only characters and spaces are allowed in set for."
  )
  .max(50, <FormattedLabel id="setForReqLength" />),

  flagName: yup
    .string()
    .required(<FormattedLabel id="flagNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in flag name."
    )
    .max(50, <FormattedLabel id="flagNameReqLength" />),


  flagNameMr: yup
  .string()
  .required(<FormattedLabel id="flagNameMrValidation" />)
  .matches(
    /^[a-zA-Z\s\u0900-\u097F]+$/,
    "Only characters are allowed in flag name (Marathi)."
  )
  .max(100, <FormattedLabel id="flagNameMrLength" />),

  applicableOn:yup.string().required(<FormattedLabel id="applicableOnValidation" />),
});

export default flagMasterSchema;