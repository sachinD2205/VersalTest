import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  auditoriumName: yup.string().required("Auditorium Name is Required !!!"),
  eventKey: yup.string().required("Event Name is Required !!!"),
  charge: yup.string().required("Charge Name is Required !!!"),
  period: yup.string().required("Period is Required !!!"),
  price: yup
    .string()
    .required("Price required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Price must be at least 1 number")
    .max(5, "Price not valid on above 5 number"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate: yup.string().nullable().required("To Date is Required !!!"),
  // ticketRate: yup.string().required("Ticket Rate is Required !!!"),
});

export default Schema;
