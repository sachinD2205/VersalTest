import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  equipmentDetails: yup
    .string()
    .required(<FormattedLabel id="equipmentDetailsRequired" />)
    .matches(/^[A-Za-z-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),

  equipmentDetailsMr: yup
    .string()
    .required(<FormattedLabel id="equipmentDetailsMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),

  gisId: yup
    .string()
    .required(<FormattedLabel id="gisIdRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
});

export default schema;
