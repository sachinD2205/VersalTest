import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  chargeTypePrefix: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "Enter charge Type Prefix is Required / शुल्क प्रकार प्रविष्ट करा उपसर्ग आवश्यक आहे"
    ),
  chargeName: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "Enter charge Name english is Required / शुल्काचे नाव इंग्रजीमध्ये एंटर करणे आवश्यक आहे"
    ),
  chargeNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required(
      "Enter charge Name in Marathi is Required / शुल्काचे नाव मराठीत टाकणे आवश्यक आहे"
    ),
  mapWithGlAccountCode: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "map With Gl Account Code Required / Gl खाते कोड आवश्यक असलेला नकाशा"
    ),
  remark: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required("Remark name is Required / टिप्पणी नाव आवश्यक आहे"),
});

export default Schema;
