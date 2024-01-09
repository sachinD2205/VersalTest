import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = (language) => {
  return yup.object().shape({
  nameOfUsage: yup
    .string()
    .required(<FormattedLabel id='nameOfUsageValidation' />)
    .matches(
      /^[aA-zZ\s]*$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),

  nameOfUsageMr: yup
    .string()
    .required(<FormattedLabel id='nameOfUsageMrValidation' />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters / फक्त मराठी शब्द "
    ),
  // .required("Usage Name in marathi is required !!"),
});
}

