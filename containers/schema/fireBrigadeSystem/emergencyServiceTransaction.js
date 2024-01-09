import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  informerName: yup
    .string()
    .required("Informer Name is Required !!!")
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  informerMiddleName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  informerLastName: yup
    .string()
    .required("Informer Name is Required !!!")
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  informerNameMr: yup
    .string()
    .required("Informer Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  informerMiddleNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  informerLastNameMr: yup
    .string()
    .required("Informer Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  mailID: yup
    .string()
    .email("Email is not valid")
    .required("Email Id is Required !!!"),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Mobile Number is Required !!")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required(),
  area: yup
    .string()
    .required("Informer Name is Required !!!")
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  areaMr: yup
    .string()
    .required("Informer Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  vardiPlace: yup
    .string()
    .required("Informer Name is Required !!!")
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  vardiPlaceMr: yup
    .string()
    .required("Informer Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),
  city: yup
    .string()
    .required("Informer Name is Required !!!")
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),
  cityMr: yup
    .string()
    .required("Informer Name (In Marathi) is Required !!!")
    .matches(/^[\u0900-\u097F ]+/, "Must be only in marathi/ फक्त मराठी मध्ये"),

  typeOfVardiId: yup.string().required("Please Choose Vardi Place"),

  slipHandedOverTo: yup.string().required("Please Choose One"),
  // fireStationName: yup.string().required("Please Choose Fire Station"),
  // area: yup.string().min(0).max(50),
});

export default Schema;
