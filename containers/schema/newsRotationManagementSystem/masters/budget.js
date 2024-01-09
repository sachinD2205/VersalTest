import * as yup from "yup";

let Schema = yup.object().shape({
  financialYear: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required("Financial Year Required / आर्थिक वर्ष आवश्यक"),
  budgetAmount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError()
    .required("Budget Required / बजेट आवश्यक"),
});

export default Schema;
