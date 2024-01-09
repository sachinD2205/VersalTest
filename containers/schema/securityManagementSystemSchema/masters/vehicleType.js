import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  // vehicleTypePrefix: yup.string().required(`Vehicle Type Prefix Is Required`),
  vehicleType: yup
    .string()
    .required(<FormattedLabel id="vehicletypeEn" />)
    .matches(/^[a-zA-Z\s]+$/, "Must be only characters"),
  vehicleTypeMr: yup
    .string()
    .required(<FormattedLabel id="vehicletypeMr" />)
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters"),
  // remark: yup.string().required("Remark Is Required"),
  vehicleTypePrefix: yup
    .string()
    .matches(
      /^[a-zA-Z]*$/,
      "Vehicle Type Prefix should contain only alphabetical characters"
    ),
});

export default Schema;
