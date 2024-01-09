import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  //   gisId: yup.string().required("GIS Id is Required !!!"),
  // zonePrefix: yup.string().required("Zone Prefix is Required"),
  // zoneNo: yup.string().required("Zone No is Required"),
  // zoneName: yup.string().required("Zone Name is Required"),
  // zoneAddress: yup.string().required("Zone Address is Required"),
});

export default schema;
