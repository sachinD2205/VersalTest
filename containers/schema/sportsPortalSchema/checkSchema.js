import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  ward: yup.number().required("Ward is Required !!!"),
  zone: yup.number().required("Zone is Required !!!"),
  department: yup.number().required("Department is Required !!!"),
  subDepartment: yup.number().required(" sub Department Name is Required !!"),
  facilityType: yup.number().required("Facility Type is Required !!!"),
  facilityName: yup.number().required("Facility Name is Required !!!"),
  venue: yup.number().required(" Venue is Required !!"),
  // date: yup.string().nullable().required(" Date is Required !!!"),

  formDateTime: yup.string().nullable().required("From Date is Required !!!"),

  // toDateTime: yup.string().required(" Date & Time is Required !!"),

  toDateTime: yup.string().nullable().required("To Date is Required !!!"),
});

export default Schema;
