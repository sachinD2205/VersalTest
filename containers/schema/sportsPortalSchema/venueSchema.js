import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  zoneName: yup.string().required("Zone Name is Required !!!"),
  wardName: yup.string().required(" Ward Name is Required !!"),
  venue: yup.string().required("  Venue is Required !!"),
  remark: yup.string().required("Remark is Required !!!"),
  // facilityName: yup.string().required("Facility Name is Required !!"),
  // facilityType: yup.string().required(" Facility Type is Required !!"),
  // address: yup.string().required("Address is Required !!"),
  // capacity: yup.string().required("Capacity is Required !!"),
  // unit: yup.string().required("Unit is Required !!"),
  contactPersonName: yup
    .string()
    .required("Contact Person Name is Required !!"),
  contactPersonMobileNo: yup
    .string()
    .required("  Contact Person Mobile No is Required !!"),
  contactPersonNameMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required("Contact Person Name is Required !!"),
  addressMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required("Address is Required !!"),
  remarkMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required("Remark is Required !!!"),
  venueMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required("Must be only characters / फक्त शब्दात!!"),
});

export default Schema;
