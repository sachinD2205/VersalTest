import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  loadType: yup
    .string()
    .required(<FormattedLabel id="loadTypeRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),

  loadTypeMr: yup
    .string()
    .required(<FormattedLabel id="loadTypeMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
