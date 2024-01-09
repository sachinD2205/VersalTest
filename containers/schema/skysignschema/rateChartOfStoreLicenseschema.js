import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  rateChartOfStoreLicensePrefix: yup
    .string()
    .required("Rate Chart of Store License Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
  itemName: yup.string().required("Item Name is Required !!!"),
  slab: yup.string().required("Slab is Required !!!"),
  rate: yup.string().required("Rate is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default schema;
