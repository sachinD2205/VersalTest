import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = yup.object().shape({
  committeeId: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  committeeEstablishedDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  // committeeDismissedDate: yup
  //   .string()
  //   .nullable()
  //   .required("This Field is Required !!!"),
  honorariumPerMeeting: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  working: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
})

export default Schema
