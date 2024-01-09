import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bookType: yup.string().nullable().required("Book Type is Required !!!"),
  bookSubtype: yup.string().required("Book Sub Type is Required !!!"),
});

export default schema;
