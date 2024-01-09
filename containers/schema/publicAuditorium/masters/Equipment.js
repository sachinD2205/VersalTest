import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  equipmentNameEn: yup
    .string()
    .required("Equipment name is Required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters"),
  equipmentNameMr: yup
    .string()
    .required("Equipment name in marathi is Required !!!")
    .matches(/^[\u0900-\u097F0-9\s]+$/, "Must be only marathi characters"),
  // equipmentCategory: yup
  //   .string()
  //   .required("Equipment Category is Required !!!"),
});

export default Schema;
