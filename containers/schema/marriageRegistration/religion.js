import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // religionMasterPrefix: yup
  //   .string()
  //   .required("Tax Master Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // religion: yup.string().required("Religion Name is Required !!!"),
});

export default Schema;
