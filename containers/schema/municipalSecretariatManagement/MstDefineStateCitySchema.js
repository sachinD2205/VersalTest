import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = yup.object().shape({
  state: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="stateEn" />),
  stateMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="stateMr" />),
  city: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="cityEn" />),
  cityMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="cityMr" />),
})

export default Schema
