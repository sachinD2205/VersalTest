import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  billingCycle: yup
    .string()
    .required(<FormattedLabel id="billingCycleRequired" />)
    .matches(
      /^[a-zA-Z0-9-( )]+$/, // regex to allow alphabets, numbers, spaces, dash(-)
      "Must be only in english / फक्त इंग्लिश मध्ये "
    ),

  billingCycleMr: yup
    .string()

    .required(<FormattedLabel id="billingCycleMrRequired" />)
    .matches(
      // /^[\u0900-\u097F]+/ /^[0-9]+$/,
      /^[\u0900-\u097F\d]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
