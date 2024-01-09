import * as yup from "yup";

// schema - validation
let trnCollectionSchema = yup.object().shape({
  collection: yup.string().required("Collection is Required !!!"),
  trnCollectionDate: yup.string().nullable().required("Transaction Date is Required !!!"),
  serviceName: yup.string().nullable().required("Service Name is Required !!!"),
  receiptNo: yup.string().required("Receipt No is Required"),
  collectionCenter: yup.string().required("Collection Center is Required"),
  counter: yup.string().required("Counter is Required"),
  moduleName: yup.string().required("Module Name is Required"),
  userName: yup.string().required("User Name is Required"),


    receiptType:yup.string().required("Receipt Type is Required"),
    refernece:yup.string().required("Reference is Required"),
    referenceDate:yup.string().required("Reference Date is Required"),
    payerName:yup.string().required("Payer Name is Required"),
    address:yup.string().required("Address is Required"),
    narration:yup.string().required("Narration is Required"),
    paymentMode:yup.string().required("Payment Mode is Required"),
    accoundCode:yup.string().required("Account Code is Required"),
    codeDescription:yup.string().required("Code Description is Required"),
    amount:yup.string().required("Amount is Required"),
});

export default trnCollectionSchema;