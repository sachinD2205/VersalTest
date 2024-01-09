import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation - SearchByHawkerLicenseNumberReportSchema
let SearchByHawkerLicenseNumberReportSchema = yup.object().shape({
  applicationNo: yup
    .string().nullable()
    .required(<FormattedLabel id='licenseNoValidation' />),
});

export default SearchByHawkerLicenseNumberReportSchema;
