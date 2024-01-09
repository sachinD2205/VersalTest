import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = yup.object().shape({
  ward: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  zone: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),

  office: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="office" />),
  officeMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="officeMr" />),

  officeAddress: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="officeAddress" />),
  officeAddressMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="officeAddressMr" />),

  officeType: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="officeType" />),
  officeTypeMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="officeTypeMr" />),

  gisId: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  longitude: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  latitude: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
})

export default Schema
