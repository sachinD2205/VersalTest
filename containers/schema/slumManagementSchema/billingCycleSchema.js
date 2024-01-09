import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let billingCycleSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumFromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),
  billingCyclePrefix: yup
    .string()
    .required(<FormattedLabel id="billingCyclePrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in billing cycle prefix."
    )
    .max(15, <FormattedLabel id="billingCyclePrefixLength" />),
  // remarks: yup.string().required("Remark is Required"),
  billingCycle: yup
    .string()
    .required(<FormattedLabel id="billingCycleValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in billing cycle."
    )
    .max(50, <FormattedLabel id="billingCycleReqLength" />),
  billingCycleMr: yup
    .string()
    .required(<FormattedLabel id="billingCycleMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in billing cycle (Marathi)."
    )
    .max(100, <FormattedLabel id="billingCycleMrLength" />),
  //   applicableOn:yup.string().required("Applicable on is Required"),
});

export default billingCycleSchema;
