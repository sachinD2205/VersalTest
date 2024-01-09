import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    // paymentDate: yup.string().nullable().required("Payment Date is Required !!!"),
    // transactionNo: yup.number().required("Check No/UTR No is Required !!!"),
});

export default schema;