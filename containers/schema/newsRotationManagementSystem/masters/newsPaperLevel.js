import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperLevel: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s/]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "News Paper Level in English is Required / इंग्रजीतील वर्तमानपत्राची पातळी आवश्यक आहे"
    ),
  newsPaperLevelMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required(
      "News Paper Level in Marathi is Required / मराठीतील वर्तमानपत्राची पातळी आवश्यक आहे"
    ),
});

export default Schema;
