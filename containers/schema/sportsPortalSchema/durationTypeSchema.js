import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  typeName: yup.string().required(<FormattedLabel id="VdurationType" />),
  typeNameMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F] +$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required(<FormattedLabel id="VdurationTypeMr" />),
});

export default Schema;
