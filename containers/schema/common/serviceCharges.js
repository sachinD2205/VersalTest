import * as yup from "yup";

let schema = yup.object().shape({
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  application: yup
    .string()
    .nullable()
    .required("Application Name is Required !!!"),
  service: yup.string().nullable().required("Service Name is Required !!!"),
  serviceChargeType: yup
    .string()
    .nullable()
    .required("Service Charge Type is Required !!!"),
  charge: yup.string().nullable().required("Charge is Required !!!"),
  amount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Amount is Required"),
  // ward: yup.string().required(" Ward is Required !!"),
  // zone: yup.string().required(" Zone is Required !!"),
  // remark: yup.string().required(" Remark is Required !!"),
});

export default schema;
