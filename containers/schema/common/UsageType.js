import * as yup from "yup";

let schema = yup.object().shape({
  remark: yup.string().required("Remark is Required !!!"),
  usagePrefix: yup.string().required("Usage Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
  usageType: yup.string().required("Usage Type is Required !!!"),
  department: yup.string().nullable().required("Department is Required !!!"),
});

export default schema;
