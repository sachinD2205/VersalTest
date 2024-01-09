import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  complaintStatus: yup.string().required("Status is Required !!!"),
});

export default schema;
