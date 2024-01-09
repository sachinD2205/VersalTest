import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  capacity: yup
    .number()
    .typeError("you must specify a number")
    .required("capacity is Required !!!"),
  // remark: yup.string().required("Remark is Required !!!"),
  // venueId: yup.string().required("Venue Id is Required !!!"),
  // zoneName: yup.string().required("Zone Name is Required !!!"),
  // wardName: yup.string().required(" Ward Name is Required !!"),
  // facilityName: yup.string().required("Facility Name is Required !!"),
  // facilityType: yup.string().required(" Facility Type is Required !!"),
  // subDepartment: yup.string().required(" Sub Department is Required !!"),
  // department: yup.string().required(" Department is Required !!"),
  // geoCode: yup.string().required(" Geo-Code is Required !!"),
  // venue: yup.string().required("  Venue is Required !!"),
});

export default schema;
