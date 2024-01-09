import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let complaintSubTypeMasterSchema = yup.object().shape({
  complaintTypeId: yup
    .string()
    .required(<FormattedLabel id="complaintTypeReq" />),

  complaintSubType: yup
    .string()
    .required(<FormattedLabel id="complaintSubTypeReq" />)
    .max(500, <FormattedLabel id="complaintSubTypeMax" />),
  // .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),

  complaintSubTypeMr: yup
    .string()
    .required(<FormattedLabel id="complaintSubTypeMrReq" />)
    .max(500, <FormattedLabel id="complaintSubTypeMrMax" />),
  // .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  //

  categoryKey: yup.string().required(<FormattedLabel id="categoryReq" />),
});

export default complaintSubTypeMasterSchema;
