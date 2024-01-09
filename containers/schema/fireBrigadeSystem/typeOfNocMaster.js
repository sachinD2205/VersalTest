import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
// let Schema = yup.object().shape({
  export let Schema = (language) => {
    return yup.object().shape({
  nOCName: yup
  .string()
  .required(<FormattedLabel id='nOCNameValidation' />)
  // .required("Name Of NOC is Required !!!")
  .matches(
    /^[A-Za-z@. \-\s]+$/,
    language == "en"
      ? "Must be only english characters"
      : "फक्त इंग्लिश शब्द "
  ),
  nOCNameMr: yup
    .string()
    .required(<FormattedLabel id="nOCNameMrValidation" />)
    // .required("required")
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
});
  }
