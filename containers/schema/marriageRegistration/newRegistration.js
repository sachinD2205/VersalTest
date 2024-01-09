import * as yup from "yup"

// schema - validation
let schema = yup.object().shape({
  // Grrom
  // gFName: yup.string().required('Enter Groom First name'),
  // gMName: yup.string().required('Enter Groom Middle Name'),
  // gLName: yup.string().required('Enter Groom Last Name'),
  // gBuildingNo: yup.string().required('Enter Flat/Building No'),
  // gBuildingName: yup.string().required('Enter Apartment Name'),
  // gRoadName: yup.string().required('Enter Road Name'),
  // gLandmark: yup.string().required('Enter Landmark'),
  // gCityName: yup.string().required('Enter City Name'),
  // gPincode: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Pincode is Required !!!'),
  // gState: yup.string().required('Enter a State'),
  // gGender: yup.string().required('Please Select Gender'),
  // gAadharNo: yup
  //   .number()
  //   //  .min(12, 'Adhar Number must be at least 12 number')
  //   .typeError('Please Enter Valid Input')
  //   .required('Aadhar No is Required !!!'),
  // // .max(13, 'Adhar Number not valid on above 12 number'),
  // gMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   // .max(11, 'Mobile Number not valid on above 10 number')
  //   .required('Mobile No is Required !!!'),
  // gEmail: yup.string().required('Enter Valid Email'),
  // gAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .min(3, 'Age must be at least 2 number')
  //   .required('Age is Required !!!'),
  // gStatus: yup.string().required('select Status'),
  // gReligionByBirth: yup.string().required('Select Religion By Birth'),
  // gReligionByAdoption: yup.string().required('Select Religion By Adoption'),
  // gBirthDate: yup
  //   .date()
  //   .typeError('Please Enter Valid Date')
  //   .required('Birth Date is Required !!!'),
  // // not use fill
  // gVillageName: yup.string().required('Enter Village Name'),
  // gPhoneNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Phone No is Required !!!'),
  // gFFName: yup.string().required('Enter Father First name'),
  // gFMName: yup.string().required('Enter Father Middle name'),
  // gFLName: yup.string().required('Enter Father Last name'),
  // gFAge: yup.string().required('Enter Father Age'),
  // gFAadharNo: yup.string().required('Enter Father AadharNo'),
  // gFMobileNo: yup.string().required('Enter Mobile Number'),
  // gFBuildingNo: yup.string().required('Enter Flat/Building No'),
  // gFBuildingName: yup.string().required('Enter Apartment Name'),
  // gFRoadName: yup.string().required('Enter Road Name'),
  // gFLandmark: yup.string().required('Enter Landmark'),
  // gFVillageName: yup.string().required('Enter Village Name'),
  // gFCityName: yup.string().required('Enter City Name'),
  // gFPincode: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Pincode is Required !!!'),
  // gFState: yup.string().required('Enter State'),
  // gFEmail: yup.string().required('Enter Email'),
  // gMFName: yup.string().required('Enter Mother First name'),
  // gMMName: yup.string().required('Enter Mother Middle name'),
  // gMLName: yup.string().required('Enter Mother Last name'),
  // gMMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mobile No is Required !!!'),
  // gMAadharNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mother Aadhar No is Required !!!'),
  // gMAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mother Age is Required !!!'),
  // // bride
  // bFName: yup.string().required('Enter Bride First name'),
  // bMName: yup.string().required('Enter Bride First name'),
  // bLName: yup.string().required('Enter Bride First name'),
  // bBuildingNo: yup.string().required('Enter Flat/Building No'),
  // bBuildingName: yup.string().required('Enter Apartment Name'),
  // bRoadName: yup.string().required('Enter Road Name'),
  // bLandmark: yup.string().required('Enter Landmark'),
  // bCityName: yup.string().required('Enter City Name'),
  // bPincode: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Pincode is Required !!!'),
  // bState: yup.string().required('Enter a State'),
  // bGender: yup.string().required('Please Select Gender'),
  // bAadharNo: yup
  //   .number()
  //   //  .min(12, 'Adhar Number must be at least 12 number')
  //   .typeError('Please Enter Valid Input')
  //   .required('Aadhar No is Required !!!'),
  // bMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   // .max(11, 'Mobile Number not valid on above 10 number')
  //   .required('Mobile No is Required !!!'),
  // bEmail: yup.string().required('Enter Valid Email'),
  // bAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .min(3, 'Age must be at least 2 number')
  //   .required('Age is Required !!!'),
  // bStatus: yup.string().required('select Status'),
  // bReligionByBirth: yup.string().required('Select Religion By Birth'),
  // bReligionByAdoption: yup.string().required('Select Religion By Adoption'),
  // bBirthDate: yup
  //   .date()
  //   .typeError('Please Enter Valid Input')
  //   .required('Birth Date is Required !!!'),
  // //not use fill
  // bVillageName: yup.string().required('Enter Village Name'),
  // bPhoneNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Phone No is Required !!!'),
  // bFFName: yup.string().required('Enter Father First name'),
  // bFMName: yup.string().required('Enter Father Middle name'),
  // bFLName: yup.string().required('Enter Father Last name'),
  // bFAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Age is Required !!!'),
  // bFAadharNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Aadhar No is Required !!!'),
  // bFMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mobile No is Required !!!'),
  // bFBuildingNo: yup.string().required('Enter Flat/Building No'),
  // bFBuildingName: yup.string().required('Enter Apartment Name'),
  // bFRoadName: yup.string().required('Enter Road Name'),
  // bFLandmark: yup.string().required('Enter Landmark'),
  // bFVillageName: yup.string().required('Enter Village Name'),
  // bFCityName: yup.string().required('Enter City Name'),
  // bFPincode: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Pincode is Required !!!'),
  // bFState: yup.string().required('Enter State'),
  // bFEmail: yup.string().required('Enter Email'),
  // bMFName: yup.string().required('Enter Mother First name'),
  // bMMName: yup.string().required('Enter Mother Middle name'),
  // bMLName: yup.string().required('Enter Mother Last name'),
  // bMMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mobile No is Required !!!'),
  // bMAadharNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mother Aadhar No is Required !!!'),
  // bMAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mother Age is Required !!!'),
  // pFName: yup.string().required('Enter Prist First name'),
  // pMName: yup.string().required('Enter Bride First name'),
  // pLName: yup.string().required('Enter Bride First name'),
  // pBuildingNo: yup.string().required('Enter Flat/Building No'),
  // pBuildingName: yup.string().required('Enter Apartment Name'),
  // pRoadName: yup.string().required('Enter Road Name'),
  // pLandmark: yup.string().required('Enter Landmark'),
  // pVillageName: yup.string().required('Enter Village Name'),
  // pCityName: yup.string().required('Enter City Name'),
  // pPincode: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Pincode is Required !!!'),
  // pState: yup.string().required('Enter State'),
  // pGender: yup.string().required('Enter Gender'),
  // pAadharNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Aadhar No is Required !!!'),
  // pMobileNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Mobile No is Required !!!'),
  // pPhoneNo: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Phone No is Required !!!'),
  // pEmail: yup.string().required('Enter Valid Email'),
  // pAge: yup
  //   .number()
  //   .typeError('Please Enter Valid Input')
  //   .required('Age is Required !!!'),
  // pBirthDate: yup
  //   .date()
  //   .typeError('Please Enter Valid Input')
  //   .required('Birth Date is Required !!!'),
  // pReligionByBirth: yup.string().required('Select Religion By Adoption'),
  // pReligionByAdoption: yup.string().required('Select Religion By Adoption'),
  // pPlaceOfMarriage: yup.string().required('Select Place Of Marriage'),
})

export default schema
