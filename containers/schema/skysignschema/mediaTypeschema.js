import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  mediaTypePrefix: yup.string().required("Media type  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  mediaType: yup.string().required("Media Type  is Required !!!"),
  remark: yup.string().required("remark is Required !!!"),
});

export default Schema;
