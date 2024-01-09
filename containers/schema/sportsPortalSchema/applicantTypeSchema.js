import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  typeName: yup
    .string()
    .required(<FormattedLabel id="VapplicantType" />)
    .matches(
      /^[A-Za-z\s]+$/,
      "Must be only english or marathi characters/फक्त इंग्लिश किंवा मराठी शब्द "
    ),
    typeNameMr: yup
    .string()
    .required(<FormattedLabel id="VapplicantMrType" />)
    .matches(
      /^[\u0900-\u0965\u0970-\u097F\s]+$/,
      "Must be only english or marathi characters/फक्त इंग्लिश किंवा मराठी शब्द "
    ),
});

export default Schema;
