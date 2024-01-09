import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),

  // zonePrefix: yup.string().required("Zone Prefix is Required"),
  // zoneNo: yup.string().required("Zone No is Required"),
  // zoneName: yup.string().required("Zone Name is Required"),
  // zoneAddress: yup.string().required("Zone Address is Required"),
  fromDate: yup.string().nullable().required("From date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
  zoneName: yup
    .string()
    .required("Zone Name is Required")
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only alphanumeric characters are allowed for this field"
    ),
  zoneNameMr: yup
    .string()
    .required("Zone Name (In marathi) is Required !!!")
    // .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
    .matches(
      /^[\u0900-\u097F\s]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  gisId: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  latitude: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  longitude: yup
    .string()
    .matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
});

export default schema;
