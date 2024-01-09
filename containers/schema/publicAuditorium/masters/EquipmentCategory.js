import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  equipmentCategoryNameEn: yup.string().required("Equipment category name is Required !!!"),
  equipmentCategoryNameMr: yup.string().required("Equipment category name in marathi is Required !!!"),
});

export default Schema;
