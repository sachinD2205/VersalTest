import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  magazineName: yup
    .string()
    .nullable()
    .required("Newspaper Name is Required !!!"),
  magazineSubCategory: yup
    .string()
    .nullable()
    .required("Magazines/Newspaper Sub Catagory Name is Required !!!"),
  supplierName: yup.string().required("Supplier Name is Required !!!"),
  contactNumber: yup
    .string()
    .required("Contact Number is Required !!!")
    .matches(
      RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/),
      "Phone number is not valid"
    ),
  language: yup.string().required("language is Required !!!"),
  remark: yup.string().required("Remark is Required !!!"),
});

export default schema;
