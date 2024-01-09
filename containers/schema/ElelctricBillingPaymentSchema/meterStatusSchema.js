import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  meterStatus: yup
    .string()
    .required(<FormattedLabel id="meterStatusRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
  meterStatusMr: yup
    .string()
    .required(<FormattedLabel id="meterStatusMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
