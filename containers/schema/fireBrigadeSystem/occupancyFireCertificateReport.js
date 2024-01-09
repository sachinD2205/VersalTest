import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  applicantName: yup.string().required("applicantName is Required !!!"),
  officeContactNo: yup
    .string()
    .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Contact number is not valid")
    .required("Office contact number is required"),
  personMobileNo: yup
    .string()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Person mobile no is not valid"
    )
    .required("Mobile number is required"), //dateOfApplication: yup.string().nullable().required("dateOfApplication is Required !!!"),
  emailId: yup
    .string()
    .email("Email is not valid")
    .required("Email Id is Required !!!"),
  architectNameMr: yup.string().required("Architect name mr is Required !!!"),
  architectFirmName: yup
    .string()
    .required("Architect firm name is Required !!!"),
  architectRegistrationNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("occurance number is required"),
  applicantPermanentAddress: yup
    .string()
    .required("Applicant permanent address is Required !!!"),
  siteAddress: yup.string().required("Site address is Required !!!"),
  applicantContactNo: yup
    .string()
    .matches(/^[^\s][a-zA-Z0-9\s]+$/, "Contact number is not valid")
    .required(" Applicant contact number is required"),
  FinalPlotNoFP: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Final plot NoFP is required"),
  RevenueSurveyNoRS: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Revenue survey no rS is required"),
  BuildingLocation: yup.string().required("Building location is Required !!!"),
  townPlanningNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Town planning no  is required"),
  blockNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Block no is required"),
  OPNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("OP no is required"),
  citySurveyNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("City survey no is required"),
  typeofBuilding: yup.string().required("Type of building is Required !!!"),
  residentialUse: yup.string().required("Residential use is Required !!!"),
  commercialUse: yup.string().required("Commercial use is Required !!!"),
  NOCFor: yup.string().required("NOC for is Required !!!"),
  buildingHeight: yup.string().required("Building height is Required !!!"),
  noOfBasement: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("No of basement is required"),
  totalBuilding: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Total building is required"),
  basementArea: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Basement area is required"),
  noOfVentilation: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("No of ventilation is  required"),
  noOfTowers: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("No of towers is required"),
  plotArea: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Plot area is required"),
  construction: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("construction is required"),
  noOfApprochedRoad: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("No of approched road is required"),
  drawingProvided: yup.string().required("Drawing provided is Required !!!"),
  siteAddressWithName: yup.string().required("Site address  is Required !!!"),
  highTensionLineMac: yup
    .string()
    .required("High tension line is Required !!!"),
  areaZone: yup.string().required("Area zone is Required !!!"),
  fireNocTaken: yup.string().required("Fire noc taken is Required !!!"),
  underTheGroundWaterTank: yup
    .string()
    .required("Under the ground water tank is Required !!!"),
  l: yup.string().required("L is Required !!!"),
  b: yup.string().required("B is Required !!!"),
  h: yup.string().required("H is Required !!!"),
  volumeLBHIn: yup.string().required("Volume LBHIn is Required !!!"),
  approvedMap: yup.string().required("Approved map is Required !!!"),
  overHeadWaterTank: yup
    .string()
    .required("Over head water tank is Required !!!"),
  OverHearWaterTank: yup
    .string()
    .required("Over hear water tank is Required !!!"),
});

export default Schema;
