import * as yup from "yup";

const witnessFieldSchema = {
  quantity: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid Quantity")
    .min(0, "Quantity must be at least 0 number")
    .max(100, "Quantity is not valid on above 100 number")
    .required(),
};

// schema - validation
let Schema = yup.object().shape({
  // auditoriumId: yup.string().required("Please select auditorium !!!"),
  // auditoriumName: yup.string().required("Please select auditorium !!!"),
  // levelsOfRolesDaoList: yup.array().of(yup.object().shape(witnessFieldSchema)),
});

export default Schema;
