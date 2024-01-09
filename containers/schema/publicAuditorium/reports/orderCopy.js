import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  applicationNumber: yup.string().required("Please Enter Application Number !!!"),
});

export default Schema;
