import * as yup from "yup";

let Schema = yup.object().shape({
  designation: yup
    .string()
    .required(" Designation is Required !!")
    .matches(
      /^[a-zA-Z\s\/!@#$%^&*()\-_=+[\]{};:'",.<>?]+$/,
      "Only alphabets and specific special characters are allowed for this field"
    ),
  designationMr: yup.string().required(" Designation(Mr) is Required !!"),
  description: yup
    .string()
    .required("Description is Required !!!")
    .matches(
      /^[a-zA-Z\s\/!@#$%^&*()\-_=+[\]{};:'",.<>?]+$/,
      "Only alphabets and specific special characters are allowed for this field"
    ),
});

export default Schema;
