import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // timeSlot: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Shift hours must be at least 1 number")
  //   .max(2, "Shift hours not valid on above 2 number")
  //   .required("Shift hours required"),
  timeSlot: yup
    .string()
    .required("Shift hours is Required !!!")
    .matches(/^[0-9]+$/, "Must be only numbers"),
  shift: yup
    .string()
    .required("Shift name is required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters & numbers"),
  // startTime: yup.string().nullable().required("Start time is required !!!"),
  // endTime: yup.string().nullable().required("End time is required !!!"),
});

export default Schema;
