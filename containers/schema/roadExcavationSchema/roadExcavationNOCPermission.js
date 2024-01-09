import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const length = /r'^[-+]?[0-9]*\.?[0-9]+$'/



export let roadExcavationCitizenSchema = {

//   isIndividualOrFirm: yup
//   .string()
//   .required(<FormattedLabel id="select" />),
//   taxReceipt: yup.string().when("isIndividualOrFirm", {
//     is: "Individual",
//     then: yup.string().required("Name Of BRTS Road is Required")
//   }),
//   otherDoc: yup.string().when("isIndividualOrFirm", {
//     is: "Individual",
//     then: yup.string().required("Name Of BRTS Road is Required")
//   }),
//   diggingMap: yup.string().when("isIndividualOrFirm", {
//     is: "Firm",
//     then: yup.string().required("Name Of BRTS Road is Required")
//   }),
//   workOrderfromConcernDepartment: yup.string().when("isIndividualOrFirm", {
//     is: "Firm",
//     then: yup.string().required("Name Of BRTS Road is Required")
//   }),
// companyName: yup
//   .string()
//   .required(<FormattedLabel id="companyNameReqEn" />),
// companyNameMr: yup
//   .string()
//   .matches(
//     /^[\u0900-\u097F\d]+/,"Company Name is required (In marathi)/कंपनीचे नाव आवश्यक (मराठीत)"  )
//   // .typeError(<FormattedLabel id="companyNameReqMr" />)
//   .required(),
// firstName: yup
//   .string()
//   .required(<FormattedLabel id="firstNameReqEn" />),
// firstNameMr: yup
//   .string()
//   .matches(
//         /^[\u0900-\u097F\d]+/,
//         "First Name is required (In marathi)/प्रथम नाव आवश्यक (मराठीत)",
//   )
//   .required(<FormattedLabel id="firstNameReqMr" />),
// middleName: yup
//   .string()
//   .required(<FormattedLabel id="middleNameReqEn" />),
// middleNameMr: yup
//   .string()
//   .matches(
//     /^[\u0900-\u097F\d]+/,
//     "Middle Name is required (In marathi)/मधले नाव आवश्यक (मराठीत)",
//   ).required(<FormattedLabel id="middleNameReqMr" />),
// lastName: yup
//   .string()
//   .required(<FormattedLabel id="lastNameReqEn" />),
// lastNameMr: yup
//   .string()
//   .matches(
//     /^[\u0900-\u097F\d]+/,
//     "Last Name is required (In marathi)/आडनाव नाव आवश्यक (मराठीत)",
//   ).required(<FormattedLabel id="lastNameReqMr" />),
// landlineNo: yup
// .string()
// .matches(/^[0-9]{11}$/, <FormattedLabel id="landlineNoReq" />)
// .required(),
// mobileNo: yup
//   .string()
//   .required(<FormattedLabel id="mobileNoReq" />)
//   .matches(phoneRegExp, <FormattedLabel id="mobileNoReq" />),
// emailAddress: yup
//   .string()
//   .email(<FormattedLabel id="emailAddressReq" />)
//   .required(<FormattedLabel id="emailAddressReq" />),
//   categoryOfRoad: yup
//   .string()
//   .required(<FormattedLabel id="categoryOfRoadReq" />),
//   nameOfBRTSRoad: yup.string().when("categoryOfRoad", {
//     is: "BRTS Road",
//     then: yup.string()
//     .required(<FormattedLabel id="nameOfBRTSRoadReq" />)
//   }),
//   nonBRTSRoadZone: yup.string().when("categoryOfRoad", {
//     is: "Internal Road",
//     then: yup.string()
//     .required(<FormattedLabel id="nonBRTSRoadZoneReq" />)
//   }),
//   nonBRTSRoadWard: yup.string().when("categoryOfRoad", {
//     is: "Internal Road",
//     then: yup.string()
//     .required(<FormattedLabel id="nonBRTSRoadWardReq" />)
//   }),
//   nonBRTSRoadLocationOfExcavation: yup.string().when("categoryOfRoad", {
//     is: "Internal Road",
//     then: yup.string()
//     .required(<FormattedLabel id="nonBRTSRoadLocationOfExcavationReq" />)
//   }),
//   typeOfPavement: yup
//   .string()
//   .required(<FormattedLabel id="typeOfPavementReq" />),
//   typesOfServices: yup
//   .string()
//   .required(<FormattedLabel id="typesOfServicesReq" />),
//   otherTypesOfServices: yup.string().when("typesOfServices", {
//     is: 7,
//     then: yup.number().required(<FormattedLabel id="otherTypesOfServicesReq" />)
//   }),
//   natureofExcavation: yup
//   .string()
//   .required(<FormattedLabel id="natureofExcavationReq" />),
//     lengthOfRoad: yup
//     .number()
//     .required("Length is required(only numbers)/उत्खननाची लांबी आवश्यक आहे(फक्त संख्या)"),
//     // .matches(length, <FormattedLabel id="mobileNoReq" />),
//     widthOfRoad: yup
//     .number()
//     .required("Width is required(only numbers)/उत्खननाची रुंदी आवश्यक आहे(फक्त संख्या)"),    
//     depthOfRoad: yup
//     .string()
//     .required(<FormattedLabel id="depthOfRoadReq" />),
//     expectedPeriod: yup
//     .string()
//     .required(<FormattedLabel id="expectedPeriodReq" />),
//     scopeOfWork: yup
//   .string()
//   .required(<FormattedLabel id="scopeOfWorkReq" />),
//   startLatAndStartLng: yup
//   .string()
//   .required(<FormattedLabel id="startLatAndStartLngReq" />),
//   endLatAndEndLng: yup
//   .string()
//   .required(<FormattedLabel id="endLatAndEndLngReq" />),
  
}

// export let scrutinySchema =  {

//   action:yup
//   .string()
//   .required("action required"),
//   remark:yup
//   .string()
//   .required("remark required")
// }

// export let paymentSchema =  {

//   paymentType:yup
//   .string()
//   .required("action required"),
//   paymentMode:yup
//   .string()
  // .required("remark required")
// }






export let roadExcavationJuniorEngineerSchema =  {
 
  RoadTypeId: yup
    .string()
    .required("Scope of work is required"),
  zoneId: yup
    .string()
    .required("Scope of work is required"),
  wardId: yup
    .string()
    .required("Scope of work is required"),
  locationOfExcavation: yup
    .string()
    .required("location is required")
    .matches(/^[0-9a-zA-Z]+$/, "Main Scheme can only contain alphanumeric value."),

  lengthOfRoad: yup
    .number()
    .required("Length is required"),
  widthOfRoad: yup
    .number()
    .required("Width is required"),
  rdepth: yup
    .number()
    .required("Depth is required"),
  excavationPattern: yup
    .string()
    .required("Pattern is required"),
  
  chargeTypeName: yup
    .string()
    .required("Charge Type Name is required"),
  amount: yup
    .number()
    .required("Amount is required"),
  totalAmount: yup
    .string()
    .required("Total Amount is required"),
    remarks: yup
    .string()
    .required("Remarks required")
  

}


