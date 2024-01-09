import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  advertisementTypePrefix: yup
    .string()
    .required("Advertisement Type Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  advertisementTypemr: yup.string().required("advertisement Type marathi is Required !!!"),
  advertisementType: yup.string().required("advertisement Type  is Required !!!"),
});

export default Schema;
