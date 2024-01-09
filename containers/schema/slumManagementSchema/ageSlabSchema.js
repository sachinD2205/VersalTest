import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ageSlabSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),
  ageSlabPrefix: yup
    .string()
    .required(<FormattedLabel id="ageSlabPrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in age slab prefix."
    )
    .max(15, <FormattedLabel id="ageSlabPrefixLength" />),
  // remarks: yup.string().required(<FormattedLabel id=""/>),
  ageSlabName: yup
    .string()
    .required(<FormattedLabel id="ageSlabNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in age slab name."
    )
    .max(50, <FormattedLabel id="ageSlabNameReqLength" /> ),
  ageSlabNameMr: yup
    .string()
    .required(<FormattedLabel id="ageSlabNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in age slab name (Marathi)."
    )
    .max(100, <FormattedLabel id="ageSlabNameMrLength" />),
  rangeOfAge: yup
    .string()
    .required(<FormattedLabel id="rangeOfAgeValidation" />),
});

export default ageSlabSchema;
