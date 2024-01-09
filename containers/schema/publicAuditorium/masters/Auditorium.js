import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  zone: yup.string().nullable().required("Zone name is Required !!!"),
  wardName: yup.string().nullable().required("Ward name is Required !!!"),
  auditoriumNameEn: yup
    .string()
    .required("Auditorium name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Must be only characters"),
  auditoriumNameMr: yup
    .string()
    .required("Auditorium name in marathi is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters"),
  addressEn: yup
    .string()
    .required("Address is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Must be only characters"),
  addressMr: yup
    .string()
    .required("Address in marathi is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters"),
  gsiIdGeocode: yup
    .string()
    .required("gsiId Geocode is Required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters and numbers"),
  // seatingCapacity: yup.string().required("Seating Capacity is Required !!!"),
  seatingCapacity: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(3, "Seating Capacity must be at least 2 number")
    .max(5, "Seating Capacity not valid on above 5 number")
    .required("Seating Capacity required"),
});

export default Schema;
