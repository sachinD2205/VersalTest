import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // capacity: yup.string().required("capacity is Required !!!"),
  remark: yup.string().required("Remark is Required !!!"),
  remarkMr: yup.string().required("Remark is Required !!!"),
  // venueId: yup.string().required("Venue Id is Required !!!"),
  zoneName: yup.string().required("Zone Name is Required !!!"),
  wardName: yup.string().required(" Ward Name is Required !!"),
  facilityName: yup.string().required("Facility Name is Required !!"),
  facilityType: yup.string().required(" Facility Type is Required !!"),
  address: yup.string().required("Address is Required !!"),
  addressMr: yup.string().required("Address is Required !!"),
  contactPersonName: yup.string().required("Contact Person Name is Required !!"),
  contactPersonNameMr: yup.string().required("Contact Person Name is Required !!"),
  contactPersonMobileNo: yup.string().required("  Contact Person Mobile No is Required !!"),

  // subDepartment: yup.string().required(" Sub Department is Required !!"),
  // department: yup.string().required(" Department is Required !!"),
  // geoCode: yup.string().required(" Geo-Code is Required !!"),
  venue: yup.string().required("  Venue is Required !!"),
  venueMr: yup.string().required("  Venue is Required !!"),
});

export default Schema;
