import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  department: yup
    .string()
    .nullable()
    .required("Department Name is Required !!!"),
  description: yup
    .string()
    .required(" Description is Required !!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),

  subDepartment: yup
    .string()
    .required("Sub Department Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  subDepartmentMr: yup
    .string()
    .required("Sub Department Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default Schema;
