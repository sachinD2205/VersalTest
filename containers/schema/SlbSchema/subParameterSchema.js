import * as yup from "yup"

// schema - validation
const schema = yup.object().shape({
  moduleKey: yup.string().nullable().required("This Field Is Required!!!"),
  parameterKey: yup.string().nullable().required("This Field Is Required!!!"),
  calculationType: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!"),
  valueType: yup.string().nullable().required("This Field Is Required!!!"),
  subParameterName: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),
  groupParameter: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),
  measurementUnit: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),
  dataSource: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),
})

export default schema
