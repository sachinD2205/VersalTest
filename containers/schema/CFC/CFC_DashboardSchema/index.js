import * as yup from "yup";

let schema = yup.object().shape({
  applicationNumber: yup
    .string()
    .required("Application Number Is Required !!!"),
});

export default schema;
