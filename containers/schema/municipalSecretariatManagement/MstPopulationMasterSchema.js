import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  ward:yup.number().required("ward No. is Required !!!"),
  maleCount:yup.number().required("maleCount is Required !!!"),
  femaleCount:yup.number().required("femaleCount is Required !!!"),
  totalCount:yup.number().required("totalCount is Required !!!"),
   
});

export default Schema;


