import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation - HawkingSummaryReportSchema
let HawkingSummaryReportSchema = yup.object().shape({
  // zoneName
  zoneName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id='zoneNameValidation' />),
});

export default HawkingSummaryReportSchema;
