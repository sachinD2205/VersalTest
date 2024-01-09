import * as yup from "yup";

let schema = yup.object().shape({
  //Personal Information
  title: yup.string().required().typeError("Title is Required !!!"),
  firstName: yup
    .string()
    .required()
    .typeError("First Name is Required !!!")
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
  middleName: yup
    .string()
    .required()
    .typeError("Middle Name is Required !!!")
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
  lastName: yup
    .string()
    .required()
    .typeError("Last Name is Required !!!")
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),
  titleMr: yup.string().required().typeError("Title is Required !!!"),
  firstNameMr: yup
    .string()
    .required()
    .typeError("First Name is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  middleNameMr: yup
    .string()
    .required()
    .typeError("Middle Name is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  lastNameMr: yup
    .string()
    .required()
    .typeError("Last Name is Required !!!")
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),
  dateOfBirth: yup.date().required().typeError("Date Of Birth is required"),
  gender: yup.string().required().typeError("Please Choose Gender !!!"),
  mobileNumber: yup
    .string()
    .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Mobile number is not valid")
    .required()
    .typeError("Mobile number is required"),
  email: yup.string().email("Email is not valid").required().typeError("Email-Id is Required !!!"),

  // address
  cBuildingNo: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    .required()
    .typeError("Building Number is required"),
  cBuildingName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    .required()
    .typeError("Building Name is required !!"),
  cRoadName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    .required()
    .typeError("Road Name is required !!"),
  cBuildingNoMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    .required()
    .typeError("Building Name is required !!"),
  cBuildingNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    .required()
    .typeError("Building Name is required !!"),
  cRoadNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    .required()
    .typeError("Building Name is required !!"),
  cLandmark: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
    .required()
    .typeError("LandMark Name is required !!"),
  cLandmarkMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    .required()
    .typeError("LandMark Name is required !!"),
  cCity: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required()
    .typeError("City Name is required !!"),
  cState: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required()
    .typeError("State Name is required !!"),
  cPinCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Pincode is Required")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required()
    .typeError("Pin Code is required"),
  cCityMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required()
    .typeError("City Name is required !!"),
  cStateMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required()
    .typeError("State Name is required !!"),
  // permenant address
  // pBuildingNo: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required()
  //   .typeError("Building Number is required"),
  // pBuildingName: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required()
  //   .typeError("Building Name is required !!"),
  // pRoadName: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required()
  //   .typeError("Road Name is required !!"),
  // pBuildingNoMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required()
  //   .typeError("Building Name is required !!"),
  // pBuildingNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required()
  //   .typeError("Building Name is required !!"),
  // pRoadNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required()
  //   .typeError("Building Name is required !!"),
  // pLandmark: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only in english / फक्त इंग्लिश मध्ये ")
  //   .required()
  //   .typeError("LandMark Name is required !!"),
  // pLandmarkMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
  //   .required()
  //   .typeError("LandMark Name is required !!"),
  // pCity: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required()
  //   .typeError("City Name is required !!"),
  // pState: yup
  //   .string()
  //   .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required()
  //   .typeError("State Name is required !!"),
  // pPinCode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError("Pincode is Required")
  //   .min(6, "Pincode Number must be at least 6 number")
  //   .max(6, "Pincode Number not valid on above 6 number")
  //   .required()
  //   .typeError("Pin Code is required"),
  // pCityMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required()
  //   .typeError("City Name is required !!"),
  // pStateMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required()
  //   .typeError("State Name is required !!"),
  // credential
  loginId: yup.string().required().typeError("Hint Question Name is required !!"),
  hintQuestion: yup.string().required().typeError("Hint Question Name is required !!"),
  hintQuestionAnswer: yup.string().required().typeError("Hint Question Name is required !!"),
});

export default schema;
