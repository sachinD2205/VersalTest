import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  wardName: yup
    .string()
    .required("Ward Name is Required")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  wardNameMr: yup
    .string()
    .required("Ward Name (In marathi) is Required !!!")
    // .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
    .matches(
      /^[\u0900-\u097F\s]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  gisId: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  latitude: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  longitude: yup
    .string()
    .matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  fromDate: yup.string().nullable().required("From date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
});

export default schema;
