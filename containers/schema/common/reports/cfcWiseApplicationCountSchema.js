import * as yup from "yup";

let schema = yup.object().shape({
  selectedcfcName: yup
    .string()
    .required("Please select a center name")
    .typeError("Please select a center name"),
  applicationKey: yup
    .number()
    .required("Please select a application")
    .typeError("Please select a application"),
  fromDate: yup
    .date()
    .typeError(`Please select a from Date`)
    .required(`Please select a from Date`),
  toDate: yup
    .date()
    .typeError(`Please select a to Date`)
    .required(`Please select a to Date`),
});

export default schema;
