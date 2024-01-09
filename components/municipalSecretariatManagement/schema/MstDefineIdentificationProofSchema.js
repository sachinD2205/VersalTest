import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  identificationProofDocument:yup.string().required("Identification Proof Document is Required !!!"),
  identificationProofDocmar:yup.string().required("Identification Proof Document Marathi is Required !!!"),
 
});

export default Schema;

