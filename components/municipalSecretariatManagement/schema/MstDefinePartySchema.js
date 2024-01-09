import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  partyName:yup.string().required("Party Name is Required !!!"),
  partyNameMr:yup.string().required("Party Name Marathi is Required !!!"),
  
});

export default Schema;

