import * as yup from "yup";

let schema = yup.object().shape({
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
