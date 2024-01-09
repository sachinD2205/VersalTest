import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  magazineNewspaperMasterKey: yup
    .number()
    .required("Magazine/newspaper master key is required"),
  magazineNewspaperName: yup
    .string()
    .required("Magazine/newspaper name is required"),
  libraryMasterKey: yup.number().required("Library Key is required"),
  libraryName: yup.string().required("Library name is required"),
  magazineNewspaperSupplierMasterKey: yup
    .string()
    .required("Supplier key is required"),
  supplierName: yup.string(),
  quantity: yup.number().required("Quantity is required"),
  remark: yup.string(),
  supplierContactNumber: yup.string(),
  receivedAt: yup.string(),
  suppliedAt: yup.string(),
});

export default schema;
