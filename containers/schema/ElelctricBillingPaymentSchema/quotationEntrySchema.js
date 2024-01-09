import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  sanctionedLoad: yup.number().required("Sanctioned Load is Required !!!"),
  connectedLoad: yup.number().required("Connected Load is Required !!!"),
  quotationDate: yup.date().required("Quotation Date is Required !!!"),
  quotationNo: yup.number().required("Quotation Number is Required !!!"),
  quotationAmount: yup.number().required("Quotation Amount is Required !!!"),
  description: yup.string(),
  bankBranchNameKey: yup.string().required("Bank is Required !!!"),
  ifscCode: yup.string().required("IFSC Code is Required !!!"),
});

export default schema;