import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // auditoriumId: yup.string().required("Please select auditorium !!!"),
  eventNameEn: yup
    .string()
    .required("Event name is required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Must be only characters"),
  eventNameMr: yup
    .string()
    .required("Event name in marathi is required !!!")
    .matches(/^[\u0900-\u097F\s]+$/, "Must be only marathi characters"),
  // eventDate: yup.string().nullable().required("Event Date is Required !!!"),
  // eventHours: yup.string().nullable().required("Event Hours is Required !!!"),
  programEventDescription: yup
    .string()
    .notRequired()
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      "Last name should not contain special characters"
    ),
  // days: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Seating Capacity must be at least 1 number")
  //   .max(3, "Seating Capacity not valid on above 3 number")
  //   .required("Seating Capacity required"),
});

export default Schema;
