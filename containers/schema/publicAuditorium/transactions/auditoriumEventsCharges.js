import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // auditoriumId: yup.string().required("Please select auditorium !!!"),
  eventName:  yup.string().required("Please select Event Name !!!"),
  // eventTime: yup.string().nullable().required("Event time from is Required !!!"),
  // programEventDescription: yup.string().required("Please enter program event description !!!"),
  // days: yup.string().nullable().required("Please select no. of days!!!"),
  depositAmount: yup
    .string()
    .required("Deposit amount required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Deposit amount must be at least 1 number")
    .max(5, "Deposit amount not valid on above 5 number"),
  rentAmount: yup
    .string()
    .required("Rent amount required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Deposit amount must be at least 1 number")
    .max(5, "Deposit amount not valid on above 5 number"),
  // securityAmount: yup
  //   .string()
  //   .required("security amount required")
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "security amount must be at least 1 number")
  //   .max(5, "security amount not valid on above 5 number"),
  gstAmount: yup
    .string()
    .required("GST amount required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "GST amount must be at least 1 number")
    .max(5, "GST amount not valid on above 5 number"),
  // totalAmount: yup
  //   .string()
  //   .required("Total amount required")
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Total amount must be at least 1 number")
  //   .max(5, "Total amount not valid on above 5 number"),
  // grandTotal: yup
  //   .string()
  //   .required("Grand total required")
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Grand total must be at least 1 number")
  //   .max(5, "Grand total not valid on above 5 number"),
  // days: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Seating Capacity must be at least 1 number")
  //   .max(3, "Seating Capacity not valid on above 3 number")
  //   .required("Seating Capacity required"),
});

export default Schema;
