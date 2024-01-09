

import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let categoryMasterSchema = yup.object().shape({
  categoryType: yup
    .string()
    // .matches(
    //   /^[aA-zZ\s]*$/,
    //   "Must be only english characters / फक्त इंग्लिश शब्द "
    // )
    .max(500, <FormattedLabel id="categoryMax" />)
    .required(<FormattedLabel id="categoryTypeValidation" />),
  categoryTypeMr: yup
    .string()
    // .matches(
    //   /^[\u0900-\u097F]*/,
    //   "Must be only marathi characters/ फक्त मराठी शब्द"
    // )
    .max(500, <FormattedLabel id="categoryMrMax" />)
    .required(<FormattedLabel id="categoryTypeMrValidation" />),
});

export default categoryMasterSchema;
