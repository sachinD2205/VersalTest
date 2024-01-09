import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bookClassification: yup
    .string()
    .nullable()
    .required("Book Classification is Required !!!"),
  zoneKey: yup.string().nullable().required("Zone is Required !!!"),
  libraryKey: yup
    .string()
    .nullable()
    .required("Library/Competitive Study Centre is Required !!!"),
  language: yup.string().required("Language is Required !!!"),
  bookName: yup.string().required("Book Name is Required !!!"),
  publication: yup.string().required("Publication is Required !!!"),
  author: yup.string().required("Author is Required !!!"),
  bookEdition: yup.string().required("Book Edition is Required !!!"),
  bookPrice: yup
    .string()
    .required("Book Price is Required !!!")
    .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
  totalBooksCopy: yup
    .string()
    .required("Total Books Copy is Required !!!")
    .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
});

export default schema;
