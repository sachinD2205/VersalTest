import * as yup from "yup";

// schema - validation
let photopassDetailsSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
//   fromDate: yup.string().nullable().required("From Date is Required !!!"),
//   toDate: yup.string().nullable().required("To Date is Required !!!"),
//   ownershipTypePrefix: yup.string().required("Ownership type Prefix is Required"),
  // remarks: yup.string().required("Remark is Required"),
//   ownershipType: yup.string().required("Ownership type is Required"),
//   ownershipTypeMr: yup.string().required("Ownership type (marathi) is Required"),
});

export default photopassDetailsSchema;