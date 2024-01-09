import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  relation: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    .required(<FormattedLabel id="enterRoadName" />),
  relationMar: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    .required(<FormattedLabel id="enterRoadNameMr" />),
});

export default Schema;
