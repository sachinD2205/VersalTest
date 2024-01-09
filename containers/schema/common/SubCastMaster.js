import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),

  subCastPrefix: yup.string().required("Sub Cast Prefix is Required !!!"),

  religion: yup.string().required("Religion is Required !!!"),
  cast: yup.string().required("Cast is Required !!!"),
  subCast: yup
    .string()
    .required("Sub Cast is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  subCastMr: yup
    .string()
    .required("Sub Cast (In marathi) is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
});

export default schema;
