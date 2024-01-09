import * as yup from "yup";

let Schema = yup.object().shape({
  dhoranDescription: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required("Financial Year Required / आर्थिक वर्ष आवश्यक"),
  dhoranDate: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये")
    .required("Budget Required / बजेट आवश्यक"),
});

export default Schema;
