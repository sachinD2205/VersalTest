import * as yup from "yup";

let Schema = yup.object().shape({
  pointNo: yup
    .string()
    .required("Penalty Number is Required / दंड क्रमांक आवश्यक आहे"),
  pointDesc: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s()]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required(
      "Penalty Deduction in English is Required / इंग्रजीमध्ये पेनल्टी डिडक्शन आवश्यक आहे"
    ),
  pointDescMr: yup
    .string()
    // .matches(
    //   /^[A-Za-z0-9@-\s()]+$/,
    //   "Must be only in marathi/ फक्त मराठी मध्ये "
    // )
    .matches(
      /^[\u0900-\u097F()]+/,
      "Must be only in marathi / फक्त मराठी मध्ये"
    )
    .required(
      "Penalty Deduction in Marathi is Required / मराठीत दंड वजावट आवश्यक आहे"
    ),
  // rate: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required("Rate is Required"),
  // isFixed: yup
  //   .string()
  //   // .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required("Is Fixed Marathi is Required"),
});

export default Schema;
