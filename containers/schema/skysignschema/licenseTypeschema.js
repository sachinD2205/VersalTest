import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  licenseTypePrefix: yup
    .string()
    .required("license type  Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  licenseType: yup.string().required("license Type  is Required !!!"),
  licenseTypeMar: yup.string().required("license Type Marathi  is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
