import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ComplaintStatusReportSchema = yup.object().shape({
  applicationNo: yup
    .string()
    .matches(
      /^[A-Za-z0-9_]*$/,
      "Please Enter Valid Token Number/ कृपया वैध टोकन क्रमांक प्रविष्ट करा",
    )
    .nullable()
    .required(<FormattedLabel id="tokenNoValidation" />),
});

export default ComplaintStatusReportSchema;