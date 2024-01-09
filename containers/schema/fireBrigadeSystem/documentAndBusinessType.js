import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  // bill payer details
  documentKey: yup
    .string()
    .required(<FormattedLabel id='typeOfBusinessValidation' />)
    .typeError(<FormattedLabel id='typeOfBusinessValidation' />),
});

export default Schema;
