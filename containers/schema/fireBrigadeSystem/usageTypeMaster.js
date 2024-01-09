import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  nameOfUsage: yup.string().required("Name Of Usage is Required !!!"),
});

export default Schema;
