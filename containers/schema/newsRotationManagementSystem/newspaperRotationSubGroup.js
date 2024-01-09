import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  rotationGroupKey: yup
    .string()
    .required(
      "Enter charge Type Prefix is Required / शुल्क प्रकार प्रविष्ट करा उपसर्ग आवश्यक आहे"
    ),
  rotationSubGroupName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "Enter charge Name in english is Required / शुल्काचे नाव इंग्रजीमध्ये एंटर करणे आवश्यक आहे"
    ),
  rotationSubGroupNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required(
      "Enter charge Name Marathi is Required / शुल्काचे नाव मराठी प्रविष्ट करणे आवश्यक आहे"
    ),
});

export default Schema;
