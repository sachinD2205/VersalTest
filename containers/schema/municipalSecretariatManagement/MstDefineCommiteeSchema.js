import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = (language) => {
  return yup.object().shape({
    committeeName: yup
      .string()
      .matches(
        /^[a-zA-Z\s\-,.@]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      // .min(5, "Minimum 5 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="nameOfCommitee" />),
    committeeNameMr: yup
      .string()
      .matches(
        /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\s]+$/u,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      )
      // .min(5, "Minimum 5 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="nameOfCommiteeMr" />),
    countOfCommitteeMembers: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "countOfCommitteeMembers must be a valid number"
          : "समिती सदस्यांची संख्या वैध संख्या असणे आवश्यक आहे"
      ), // Only allow numeric values
    priority: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "priority must be a valid number"
          : "प्राधान्य एक वैध संख्या असणे आवश्यक आहे"
      ),
  })
}

export default Schema
