import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let transferMediumMasterSchema = yup.object().shape({
  mediumPrefix: yup
    .string()
    .required(<FormattedLabel id="mediumPrefReq" />)
    .min(2, <FormattedLabel id="mediumPrefMinLeng" />)
    .max(100, <FormattedLabel id="mediumPrefMaxLen" />),
  nameOfMedium: yup
    .string()
    .required(<FormattedLabel id="nmOfMediumReq" />)
    .min(2, <FormattedLabel id="mediumMinLeng" />)
    .matches(/^[A-Za-z@-\s]+$/, "Must be only in english/ फक्त इंग्लिश मध्ये")
    .max(300, <FormattedLabel id="mediumMaxLen" />),
  nameOfMediumMr: yup
    .string()
    .required(<FormattedLabel id="nmOfMediumReqMr" />)
    .min(2, <FormattedLabel id="mediumMinLengMr" />)
    .max(300, <FormattedLabel id="mediumMaxLenMr" />)
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
});

export default transferMediumMasterSchema;
