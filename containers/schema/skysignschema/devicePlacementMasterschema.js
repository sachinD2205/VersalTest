import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  devicePlacementMasterPrefix: yup
    .string()
    .required("Device Placement Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  devicePlacementMaster: yup.string().required("Device Placement is Required !!!"),
  //remark:yup.string().required("remark is Required !!!")
});

export default Schema;
