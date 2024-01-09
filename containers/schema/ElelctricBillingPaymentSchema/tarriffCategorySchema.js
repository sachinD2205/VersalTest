import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  tariffCategory: yup
    .string()
    .required(<FormattedLabel id="tariffCategoryRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
  tariffCategoryMr: yup
    .string()
    .required(<FormattedLabel id="tariffCategoryMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
