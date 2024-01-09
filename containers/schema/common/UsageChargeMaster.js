import * as yup from "yup";

let schema = yup.object().shape({
//     billPrefix: yup
//     .string()
//     .required("Bill Prefix is Required !!!"),
//   fromDate: yup.string().nullable().required("From Date is Required !!!"),
//   toDate: yup.string().nullable().required("To Date is Required !!!"),
//   billType:yup.string().required("Bill Type is Required"),
});

export default schema;
