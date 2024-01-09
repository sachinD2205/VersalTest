import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  division: yup
    .string()
    .required(<FormattedLabel id="divisionRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
  divisionMr: yup
    .string()
    .required(<FormattedLabel id="divisionMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
