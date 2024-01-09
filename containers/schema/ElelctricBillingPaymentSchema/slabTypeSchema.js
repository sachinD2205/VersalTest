import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  slabType: yup
    .string()
    .required(<FormattedLabel id="slabTypeRequired" />)
    .matches(
      /^[A-Za-z0-9-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    ),
  slabTypeMr: yup
    .string()
    .required(<FormattedLabel id="slabTypeMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
