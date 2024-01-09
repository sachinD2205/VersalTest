import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  fromDate: yup.string().nullable().required("From date is required !!!"),
  toDate: yup.string().nullable().required("To date is required !!!"),
  auditoriumId: yup.string().required("Please select auditorium !!!"),
});

export default Schema;
