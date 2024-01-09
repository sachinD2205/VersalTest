import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To Date is Required !!!"),
  auditoriumName: yup.string().required("Auditorium name is Required !!!"),
  eventHrs: yup.string().required("Event hours is Required !!!"),
  showTime: yup.string().required("Show time is Required !!!"),
  publishFromDate: yup
    .string()
    .nullable()
    .required("Publish from date is Required !!!"),
  publishToDate: yup
    .string()
    .nullable()
    .required("Publish to date is Required !!!"),
  bookingConformationDate: yup
    .string()
    .nullable()
    .required("Booking confirmation date is Required !!!"),
  // shift: yup.string().required("Shift is Required !!!"),
  // slotDescription: yup.string().required("Slot Description is Required !!!"),
  // slotTo: yup.string().nullable().required("Event time to is  Required !!!"),
});

export default Schema;
