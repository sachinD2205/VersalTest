import * as yup from "yup"

// // Import

// // schema - validation
// let Schema = yup.object().shape({
//   SubjectServiceName: yup
//     .string()
//     .required("Service Name Selection is Required !!!"),
// applicationNumber: yup
//   .string()
//   .required("Application Number is Required !!!"),
// applicationDate: yup
//   .string()
//   .nullable()
//   .required("Application Date is Required !!!"),
// trackingID: yup.string().required("Tracking ID is Required !!!"),
// citySurveyNo: yup.string().required("City Survey No Number is Required !!!"),
// hawkingZoneName: yup
//   .string()
//   .required("Hawking Zone Name  Selection is Required !!!"),
//   // title: yup.string().required("Title Selection is Required !!!"),
//   firstName: yup.string().required("First Name is Required !!!"),
//   lastName: yup.string().required("Last Name is Required !!!"),
//   // gender: yup.string().required("Gender Selection is Required !!!"),
//   // religion: yup.string().required("Religion Selection is Required !!!"),
//   // cast: yup.string().required("Cast Selection is Required !!!"),
//   // subCast: yup.string().required("subCast Selection is Required !!!"),
//   // dateOfBirth: yup
//   //   .string()
//   //   .nullable()
//   //   .required("Date Of Birth is Required !!!"),
//   // age: yup.string().required("age is Required !!!"),
//   // disbality: yup.string().required("disbality Selection is Required !!!"),
//   // typeOfDisability: yup
//   //   .string()
//   //   .required("Type Of Disability Selection is Required !!!"),
//   // mobile: yup.string().required("Mobile number is Required !!!"),
//   // emailAddress: yup.string().required("Email Address is Required !!!"),
//   // crCitySurveyNumber: yup
//   //   .string()
//   //   .required("City Survey Number is Required !!!"),
//   // crAreaName: yup.string().required("Area Name is Required !!!"),
//   // crLandmarkName: yup.string().required("Landmark is Required !!!"),
//   // crVillageName: yup.string().required("Village Name is Required !!!"),
//   // crCityName: yup.string().required("City Name is Required !!!"),
//   // crState: yup.string().required("State is Required !!!"),
//   // crPincode: yup.string().required("Pincode is Required !!!"),
//   // crLattitude: yup.string().required("Lattitude is Required !!!"),
//   // // addressCheckBox: yup.string().required("addressCheckBox is Required !!!"),
//   // prCitySurveyNumber: yup
//   //   .string()
//   //   .required("City Survey Number is Required !!!"),
//   // prAreaName: yup.string().required("Area Name is Required !!!"),
//   // prLandmarkName: yup.string().required("Landmark is Required !!!"),
//   // prVillageName: yup.string().required("Village Name is Required !!!"),
//   // prCityName: yup.string().required("City Name is Required !!!"),
//   // prState: yup.string().required("State is Required !!!"),
//   // prPincode: yup.string().required("Pincode is Required !!!"),
//   // prLattitude: yup.string().required("Lattitude is Required !!!"),

//   // wardNo: yup.string().required("ward No Selection is Required !!!"),
//   // wardName: yup.string().required("ward Name Selection is Required !!!"),
//   // natureOfBusiness: yup.string().required("nature Of Business is Required !!!"),
//   // hawkingDurationDaily: yup
//   //   .string()
//   //   .required("hawking Duration Daily Selection is Required !!!"),

//   // hawkerType: yup.string().required("hawker Type Selection is Required !!!"),
//   // item: yup.string().required("item Selection is Required !!!"),

//   // periodOfResidenceInMaharashtra: yup
//   //   .string()
//   //   .nullable()
//   //   .required("Period Of Residence In Maharashtra is Required !!!"),

//   // periodOfResidenceInPCMC: yup
//   //   .string()
//   //   .nullable()
//   //   .required("Period Of Residence In PCMC is Required !!!"),

//   // rationCardNo: yup.string().required("Ration Card No is Required !!!"),
//   // bankMaster: yup.string().required("bank Master Selection is Required !!!"),
//   // branchName: yup.string().required("branch Name No is Required !!!"),
//   accountNumPT: yup.string().required("bank Account No  is Required !!!"),
//   // ifscCode: yup.string().required("ifsc Code is Required !!!"),
// })

// export default Schema

export let applicationInfoSchema = yup.object().shape({
  // serviceID: yup.string().required("Service Name Selection is Required !!!"),
  // .............................
  // applicationNumber: yup
  //   .string()
  //   .required("Application Number is Required !!!"),
  // applicationDate: yup
  //   .string()
  //   .nullable()
  //   .required("Application Date is Required !!!"),
  // trackingID: yup.string().required("Tracking ID is Required !!!"),
})

export let propertyHolderDetailsSchema = yup.object().shape({
  // mobile: yup.string().required("This field is Required !!!"),
  // emailAddress: yup.string().required("This field is Required !!!"),
  // ....................
  // applicationNumber: yup
  //   .string()
  //   .required("Application Number is Required !!!"),
  // applicationDate: yup
  //   .string()
  //   .nullable()
  //   .required("Application Date is Required !!!"),
  // trackingID: yup.string().required("Tracking ID is Required !!!"),
})

export let propertyDetailsSchema = yup.object().shape({
  // circle: yup.string().required("This field is Required !!!"),
  // ....................
  // emailAddress: yup.string().required("This field is Required !!!"),
  // applicationNumber: yup
  //   .string()
  //   .required("Application Number is Required !!!"),
  // applicationDate: yup
  //   .string()
  //   .nullable()
  //   .required("Application Date is Required !!!"),
  // trackingID: yup.string().required("Tracking ID is Required !!!"),
})
