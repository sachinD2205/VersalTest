import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // baseLicenseFeesPrefix: yup
  //   .string()
  //   .required("Base License Fees Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  baseLicenseFees: yup.string().required("Base License Fees is Required !!!"),
  advertisementCategory: yup.string().required("Advertisement Category is Required !!!"),
  mediaType: yup.string().required("Media Type is Required !!!"),
  mediaSubType: yup.string().required("Media SubType is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
