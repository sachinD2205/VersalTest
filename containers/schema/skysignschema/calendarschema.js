import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  calendarYear: yup
    .string()
    .required("Calendar Year is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),


});

export default Schema;
