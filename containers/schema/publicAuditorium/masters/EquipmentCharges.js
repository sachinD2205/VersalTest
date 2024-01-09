import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  auditoriumName: yup.string().required("Auditorium Name is Required !!!"),
  equipmentCategory: yup
    .string()
    .required("Equipment Category is Required !!!"),
  equipmentName: yup.string().required("Equipment Name is Required !!!"),
  // price: yup.number().required("Price is Required !!!"),
  price: yup
    .string()
    .required("Price required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Price must be at least 1 number")
    .max(5, "Price not valid on above 5 number"),
  corporationRate: yup
    .string()
    .required("Corporation Rate required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(1, "Corporation Rate must be at least 1 number")
    .max(5, "Corporation Rate not valid on above 5 number"),
  // multiplyingFactor: yup.number().required("Multiplying Factor is Required !!!"),
  // totalAmount: yup
  //   .string()
  //   .required("Total Amount required")
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(1, "Total Amount must be at least 1 number")
  //   .max(5, "Total Amount not valid on above 5 number"),
});

export default Schema;
