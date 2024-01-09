import * as yup from "yup";

// schema - validation for roadNameSchema
let roadNameSchema = yup.object().shape({
  roadNameEn: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required("Type Of Disability is required"),
  roadNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required("Type Of Disability in Marathi is required"),
  moduleId: yup.string().required("Module Name is required"),
});

export default roadNameSchema;
