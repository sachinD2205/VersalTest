import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  billingUnit: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required(<FormattedLabel id="billingUnitRequired" />),

  billingUnitNo: yup
    .string()
    .required(<FormattedLabel id="billingUnitMrRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits/ फक्त अंक असणे आवश्यक आहे"),

  divisionName: yup
    .string()
    .required(<FormattedLabel id="divisionNameRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),

  divisionNameMr: yup
    .string()
    .required(<FormattedLabel id="divisionNameMrRequired" />)
    .matches(
      // /^[\u0900-\u097F]+/ /^[0-9]+$/,
      /^[\u0900-\u097F\d]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
