import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation - WardwiseTokenDetailsReportSchema.js
let WardwiseTokenDetailsReportSchema = yup.object().shape({
  // zoneName
  zoneName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id='zoneNameValidation' />),
  // wardName
  wardName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id='wardNameValidation' />),
});

export default WardwiseTokenDetailsReportSchema;
