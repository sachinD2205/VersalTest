import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  serviceId: yup.string().nullable().required("Service Name is Required !!!"),
  startDate: yup.string().nullable().required("From Date is Required !!!"),
  endDate: yup.string().nullable().required("To Date is Required !!!"),
  chargePrefixEng: yup.string().required("Charge Prefix is Required !!!"),
  chargePrefixMr: yup.string().required("Charge Prefix Mr is Required !!!"),
  chargeNameEng: yup.string().required("Charge Name is Required !!!"),
  chargeNameMr: yup.string().required("Charge Name Mr is Required !!!"),
  libraryType: yup.string().nullable().required("Library Type is Required !!!"),
  amount: yup
    .string()
    .nullable()
    .required("Amount is Required !!!")
    .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
  chargeType: yup.string().required("Charge Type is Required !!!"),
});

export default schema;
