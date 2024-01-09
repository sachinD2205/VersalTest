import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  villageName: yup
    .string()
    .required("Please enter a village name in English")
    // .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),

  villageNameMr: yup
    .string()
    .required("Please enter a village name in Marathi")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  // .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),

  district: yup
    .string()
    .required("Please enter a district in English")
    // .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),

  taluka: yup
    .string()
    .required("Please enter a taluka in English")
    // .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये "),
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
});

export default Schema;
