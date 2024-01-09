// import * as yup from "yup";
// // import ApplicantSchema from "./ApplicantSchema";

// // schema - validation
// let schema = yup.object().shape({
//   applicantName: yup.string().required("Applicant name is Required !!!"),
//   applicantNameMr: yup.string().required("Applicant name is Required !!!"),
//   applicantMiddleName: yup.string().required("Applicant middle name is Required !!!"),
//   applicantMiddleNameMr: yup.string().required("Applicant middle name is Required !!!"),
//   applicantLastName: yup.string().required("Applicant last name is Required !!!"),
//   applicantLastNameMr: yup.string().required("Applicant last name is Required !!!"),
//   officeContactNo: yup.string().matches(/^[^\s][a-zA-Z0-9\s]+$/, "Contact number is not valid").required("Office contact number is required"),
//   workingSiteOnsitePersonMobileNo: yup.string().matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Mobile number is not valid").required("Mobile number is required"),
//   emailId: yup.string().email("Email is not valid").required("Email Id is Required !!!"),
 
//   buildingHeightFromGroundFloorInMeter: yup.string().matches(/^[0-9]+$/, "Building height in must be in number !!!").required("building Height is Required !!!"),
//   noOfBasement: yup.string().matches(/^[0-9]+$/, "Basement must be in number !!!").required("Number of basement is Required !!!"),
//   volumeLBHIn: yup.string().matches(/^[0-9]+$/, "Volume LBH must be in number !!!").required("Volume LBH is Required !!!"),
//   totalBuildingFloor: yup.string().matches(/^[0-9]+$/, "Floor must be in number !!!").required("Building Floor is Required !!!"),
//   basementAreaInsquareMeter: yup.string().matches(/^[0-9]+$/, "Basement area must be in number !!!").required("Basement area is Required !!!"),
//   noOfVentilation: yup.string().matches(/^[0-9]+$/, "Ventilation must be in number !!!").required("Ventilation is Required !!!"),
//   noOfTowers: yup.string().required("Number of towers is Required !!!"),
//   plotAreaSquareMeter: yup.string().matches(/^[0-9]+$/, "Plot area must be in number !!!").required("Plot area is Required !!!"),
//   constructionAreSqMeter: yup.string().matches(/^[0-9]+$/, "Construction area must be in number !!!").required("Construction area is Required !!!"),
//   noOfApprochedRoad: yup.string().matches(/^[0-9]+$/, "Approched road must be in number !!!").required("Aapproched road is Required !!!"),
//    drawingProvided: yup.string().required("Drawing provided is Required !!!"),
//    siteAddress: yup.string().required("Site address is Required !!!"),
//   highTensionLine: yup.string().required("High tension line is Required !!!"),
//    areaZone: yup.string().required("Area zone is Required !!!"),
//    businessSubTypePrefix: yup.string().required("Business sub type prefix is Required !!!"),
//    previouslyAnyFireNocTaken: yup.string().required("Fire noc is Required !!!"),
//   underTheGroundWaterTankCapacityLighter: yup.string().required("Capacity lighter is Required !!!"),
//   l: yup.string().matches(/^[0-9]+$/, "L must be in number !!!").required("L is Required !!!"),
//   b: yup.string().matches(/^[0-9]+$/, "B must be in number !!!").required("B is Required !!!"),
//   h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),
//    h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),


//    architectName: yup.string().required("Architect name is Required !!!"),
//    architectNameMr: yup.string().required("Architect name is Required !!!"),
//    architectFirmName: yup.string().required("Architect firm name is Required !!!"),
//    architectFirmNameMr: yup.string().required("Architect firm name is Required !!!"),
//    architectRegistrationNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Architect registration number is Required !!!"),
//    applicantPermanentAddress: yup.string().required("Applicant permanent address is Required !!!"),
//    applicantPermanentAddressMr: yup.string().required("Applicant permanent address is Required !!!"),
//    siteAddress: yup.string().required("Site address is Required !!!"),
//    siteAddressMr: yup.string().required("Site address is Required !!!"),
//    applicantContactNo: yup.string().matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Applicant contact is not valid").required("Applicant contact number is required"),
//    finalPlotNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Final plot number is Required !!!"),
//    revenueSurveyNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Revenue survey number is Required !!!"),
//    townPlanningNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Town planning number is Required !!!"),
//    blockNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Block number is Required !!!"),
//    buildingLocation: yup.string().required("Building location is Required !!!"),
//    opNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Op number is Required !!!"),
//    citySurveyNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("city survey number is Required !!!"),
//    buildingLocationMr: yup.string().required("Building location is Required !!!"),
//    typeOfBuilding: yup.string().required("Select type of building !!!"),

// });

// export default schema;
