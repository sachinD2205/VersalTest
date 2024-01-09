import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  department: yup
    .string()
    .required("Department Name is Required !!!")
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
  departmentMr: yup
    .string()
    .required("Department Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  description: yup
    .string()
    .required(" Description is Required !!")
    .matches(/^[aA-zZ\0-9\s]+$/, "Only alphabets are allowed for this field"),
});

export default Schema;
