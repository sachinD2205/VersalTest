import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  mediaSubTypePrefix: yup
    .string()
    .required("Tax Master Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  mediaType: yup.string().nullable().required("media Type  is Required !!!"),
  mediaSubType: yup.string().required("media Sub Type  is Required !!!"),

});

export default Schema;
