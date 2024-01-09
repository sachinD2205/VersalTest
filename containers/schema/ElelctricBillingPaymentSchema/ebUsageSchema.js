import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  usageType: yup
    .string()
    .required(<FormattedLabel id="usageTypeRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),

  usageTypeMr: yup
    .string()
    .required(<FormattedLabel id="usageTypeMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
