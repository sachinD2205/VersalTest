import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({

  state:yup.string().required("State is Required !!!"),
  stateMr:yup.string().required("State Marathi is Required !!!"),
 city: yup.string().required("City is Required !!!"),
 cityMr: yup.string().required("City Marathi is Required !!!"),
 
});

export default Schema;



