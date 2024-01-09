import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  magazineNewspaperTypeName: yup
    .string()
    .required("Magazine/Newspaper Type is Required !!!"),
});

export default schema;
