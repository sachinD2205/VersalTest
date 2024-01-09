import * as yup from "yup";

let schema = yup.object().shape({
  appCode: yup.string().required("code is Required !!!"),
  applicationNameMr: yup
    .string()
    .required("Department Name(Mr) is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  applicationNameEng: yup
    .string()
    .required(" Description is Required !!")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
  url: yup.string().required("URL is Required !!!"),
  module: yup.string().required("Module Type is Required !!!"),
  displayOrder: yup.string().required("Display Order Type is Required !!!"),
  color: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field"),
  icon: yup.string().nullable().required("Icon is Required !!!"),
});

export default schema;
