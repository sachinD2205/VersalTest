import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    taxTypePrefix: yup
    .string()
    .required("Tax Type Prefix is Required !!!"),
  
  taxType: yup.string().required("Tax Type is Required !!!"),
  taxTypePrefix:yup.string().required("Tax Type Prefix is Required !!!"),
  
});

export default schema;
