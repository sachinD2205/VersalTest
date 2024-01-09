import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let complaintStatusMasterSchema = yup.object().shape({
  complaintStatus: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]*$/,
    //   "Must be only english characters / फक्त इंग्लिश शब्द "
    // )
    .max(500, <FormattedLabel id="complaintStausMrLengthValidation" />)
    .required(<FormattedLabel id="complaintStausValidation" />),
  complaintStatusMr: yup
    .string()
    // .matches(
    //   /^[\u0900-\u097F]*/,
    //   "Must be only marathi characters/ फक्त मराठी शब्द"
    // )
    .max(500, <FormattedLabel id="complaintStausLengthValidation" />)
    .required(<FormattedLabel id="complaintStausMrValidation" />),
});

export default complaintStatusMasterSchema;
