import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  msedclCategory: yup
    .string()
    .required(<FormattedLabel id="msedclCategoryRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
  msedclCategoryMr: yup
    .string()
    .required(<FormattedLabel id="msedclCategoryMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
