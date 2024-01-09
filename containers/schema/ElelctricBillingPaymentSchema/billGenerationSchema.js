import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({ 
    prevReadingDate: yup.string().nullable().required("Previous Reading Date is Required !!!"),
  currReadingDate: yup.string().nullable().required("Previous Reading Date is Required !!!"),
  billDueDate: yup.string().nullable().required("Previous Reading Date is Required !!!"),
  prevReading: yup.string().required("Previous Reading is Required !!!"),
  currReading: yup.string().required("Current Reading is Required !!!"),
  toBePaidAmount: yup.number().required("To Be Paid Amount is Required !!!"),
  meterStatusKey: yup.string().required("Meter Status is Required !!!"),
  // arrears: yup.number().required("Arrears is Required !!!")
});

export default schema;
