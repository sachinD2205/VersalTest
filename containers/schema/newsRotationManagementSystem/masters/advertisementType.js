import * as yup from "yup";

let Schema = yup.object().shape({
  advertisementType: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "Advertisement Type in English is Required / इंग्रजीमध्ये जाहिरात प्रकार आवश्यक आहे"
    ),
  advertisementTypeMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required(
      "Advertisement Type in Marathi is Required / मराठीत जाहिरात प्रकार आवश्यक आहे"
    ),
});

export default Schema;
