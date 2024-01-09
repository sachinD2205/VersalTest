import * as yup from "yup";

let schema = yup.object().shape({
  selectedServiceName: yup
    .string()
    .required("Please select a service")
    .typeError("Please select a service"),
});

export default schema;
