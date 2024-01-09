import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = (language) => {
  return yup.object().shape({
    vehicleType: yup
      .string()
      .required(<FormattedLabel id='vehicleTypeValidation' />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),
    vehicleTypeMr: yup
      .string()
      .required(<FormattedLabel id='vehicleTypeMrValidation' />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
  });
};
