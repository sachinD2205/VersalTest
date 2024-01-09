import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  office:yup.string().required("Office Name is Required !!!"),
  officeAddress:yup.string().required("Office Address is Required !!!"), 
 gisId: yup.string().required("GIS Id is Required !!!"),
 officeMr: yup.string().required("Enter Office Name in Marathi !!!"),
 longitude: yup.string().required("GIS Longitude is Required !!!"),
 latitude: yup.string().required("GIS Latttitude is Required !!!"),
});

export default Schema;
// zoneName:yup.string().required("Zone Name is Required !!!"),
// wardName:yup.string().required("Ward Name is Required !!!"),
  // zone:yup.string().required("Zone No is Required !!!"),