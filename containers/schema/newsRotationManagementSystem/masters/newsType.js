import * as yup from "yup";

let Schema = yup.object().shape({
  newsType: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "News Type in English is Required / इंग्रजीतील बातम्यांचा प्रकार आवश्यक आहे"
    ),
  newsTypeMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required(
      "News Type in Marathi is Required / मराठीत बातम्यांचा प्रकार आवश्यक आहे"
    ),
});

export default Schema;
