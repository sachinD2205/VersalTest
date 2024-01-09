import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = yup.object().shape({
  partyName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="partyNameEn" />),
  partyNameMr: yup
    .string()
    .matches(
      /^[।ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\s]+$/u,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="partyNameMr" />),
})

export default Schema
