import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
  loadEquipmentCapacity: yup
    .string()
    .required(<FormattedLabel id="loadEquipmentCapacityRequired" />)
    .matches(
      /^[a-zA-Z0-9-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    ),

  loadEquipmentCapacityMr: yup
    .string()
    .required(<FormattedLabel id="loadEquipmentCapacityMrRequired" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),
});

export default schema;
