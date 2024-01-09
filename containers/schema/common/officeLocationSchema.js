import * as yup from "yup";

let schema = yup.object().shape({
  officeLocationName: yup
    .string()
    .required("Office Location Name is Required !!!"),
  officeLocationNameMar: yup
    .string()
    .required("Office Location Name in marathi is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  officeLocationArea: yup
    .string()
    .required("Office Location Area is Required !!!"),
  officeLocationAreaMar: yup
    .string()
    .required("Office Location Area in marathi is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  officeLocationNameAddress: yup
    .string()
    .required("Office Location Address is Required !!!"),
  officeLocationNameAddressMar: yup
    .string()
    .required("Office Location Address in marathi is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),
  officeLocationPincode: yup
    .string()
    .nullable()
    .required("Office Location Pincode is Required !!!"),
  officeLocationLandmark: yup
    .string()
    .required("Office Location Landmark is Required !!!"),
  isDepartmentLocation: yup
    .string()
    .required("Is Department Location is Required !!!"),
  //   latitude: yup.number().min(-90).max(90).required(),
  //   longitude: yup.number().min(-180).max(180).required(),
  latitude: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  longitude: yup
    .string()
    .matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
  gisId: yup.string().matches(/^[0-9]*\.?[0-9]*$/, "Must be a valid number"),
});

export default schema;
