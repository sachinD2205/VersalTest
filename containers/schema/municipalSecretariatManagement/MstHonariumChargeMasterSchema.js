import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = (language) => {
  return yup.object().shape({
    amountDecidedPerMeeting: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "amountDecidedPerMeeting must be a valid number"
          : "प्रति मीटिंग ठरवलेली रक्कम ही वैध संख्या असणे आवश्यक आहे"
      ),
    fixedAmount: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "fixedAmount must be a valid number"
          : "निश्चित रक्कम ही वैध संख्या असणे आवश्यक आहे"
      ),
  })
}

export default Schema
