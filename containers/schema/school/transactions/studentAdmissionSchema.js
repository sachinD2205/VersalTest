import * as yup from "yup";

// schema - validation for student admission form
let studentAdmissionSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  divisionKey: yup.string().required("Division Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),

  studentFirstName: yup.string()
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required("Student First Name Required"),

  // studentFirstName: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required("Student First Name Required"),

  firstNameMr: yup
    .string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("Student First Name Required (In Marathi)"),
  studentMiddleName: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Student Middle Name Required"),
  middleNameMr: yup
    .string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("Student Middle Name Required (In Marathi)"),
  studentLastName: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Student Last Name Required"),
  lastNameMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("Student Last Name Required (In Marathi)"),

  fatherFirstName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  fatherMiddleName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  fatherLastName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  motherName: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Student Last Name Required"),
  motherMiddleName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  motherLastName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  motherNameMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("Student Last Name Required (In Marathi)"),

  // fatherMiddleName: yup.string().required("Father Middle Name Required"),
  // fatherLastName: yup.string().required("father Last Name Required"),

  // motherName: yup.string().required("Mother Name Required"),
  // motherNameMr: yup.string().required("Mother Name (In Marathi) Required"),
  // motherMiddleName: yup.string().required("Mother Middle Name Required"),
  // motherLastName: yup.string().required("Mother Last Name Required"),
  studentGender: yup.string().required("Select your gender"),

  religionKey: yup.string().required("Select Your Religion"),
  casteKey: yup.string().required("Select your Caste Name"),
  subCastKey: yup.string().required("Select your SubCaste Name"),
  citizenshipName: yup.string().required("Enter your Citizen Name"),
  motherTongueName: yup.string().required("Enter your MotherTongue Name"),

  // studentBirthPlace: yup.string().required("Enter your Birthplace"),
  // birthPlacemr: yup.string().required("Enter your Birthplace (In marathi)"),
  studentBirthPlace: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Student Last Name Required"),
  birthPlacemr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("Student Last Name Required (In Marathi)"),

  studentDateOfBirth: yup.string().required("Enter your Birthdate"),
  stateName: yup.string().required("Select your state"),
  // districtName: yup.string().required("Enter your Birthplace district"),
  districtName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  familyPermanentAddress: yup
    .string()
    .required("Enter your Family Permanent Address"),
  parentFullName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  // parentFullName: yup.string().required("Enter your Parent Fullname"),
  fatherQualification: yup.string().required("Father qualification Required"),
  fatherOccupation: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  motherQualification: yup.string().required("Mother qualification Required"),
  motherOccupation: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  parentAddress: yup.string().required("Enter your Parent Address"),
  // fatherQualification: yup
  //   .string()
  //   .required("Required ! Write NA if not applicable"),
  // fatherOccupation: yup
  //   .string()
  //   .required("Required ! Write NA if not applicable"),
  fatherIncome: yup.string().matches(/^[0-9]+$/, "Must be Only Digits").required("Required ! Write NA if not applicable"),
  motherIncome: yup.string().matches(/^[0-9]+$/, "Must be Only Digits").required("Required ! Write NA if not applicable"),
  // motherQualification: yup
  //   .string()
  //   .required("Required ! Write NA if not applicable"),
  // motherOccupation: yup
  //   .string()
  //   .required("Required ! Write NA if not applicable"),
  // motherIncome: yup.string().required("Required ! Write NA if not applicable"),
  colonyName: yup.string().required("Enter your Area/Colony Name"),
  // parentDistrictName: yup.string().required("Enter your Parent District Name"),
  parentDistrictName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  parentStateName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),

  // lastSchoolNameMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द"),

  // Bank Ac Details

  accountNo: yup
    .string()
    // .matches(/^[0-9]+$/, "Must be Only Digits")
    .matches(/^[0-9]{9,18}$/, "Must be Only Digits")
    .required("Please Enter your account number"),

  confirmBankAcNumber: yup
    .string()
    .test(
      "is-same-as-confirmation",
      "Account number and confirmation must match",
      function (value) {
        return value === this.parent.accountNo;
      }
    )
    .required("Please confirm your account number"),

  // accountHolderName: yup.string().required("Enter Account Holder Name"),
  accountHolderName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  bankName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),

  // bankName: yup.string().required("Enter Bank Name"),
  // ifscCode: yup.string().required("Enter Bank IFSC Code"),
  ifscCode: yup.string().matches(/[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/, "Must be correct format ").required("Father First Name Required"),
  bankAdderess: yup.string().required("Enter Bank Address"),

  studentContactDetails: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mobile Number"),
  studentEmail: yup
    .string()
    .email("Incorrect format")
    .required("Enter Your EmailID"),
  parentEmailId: yup
    .string()
    .email("Incorrect format")
    .required("Enter Parent EmailID"),
  studentAadharNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required("Enter Your Aadhar Number"),
  fatherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Father Mobile Number"),
  motherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mother Mobile Number"),
  parentPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required("Enter your Parent Pincode"),



  // last school info

  isLastSchoolIsApplicable: yup
    .boolean()
    .required("is Last School Is Applicable ? required"),

  lastSchoolName: yup
    .string()
    .nullable()
    .when("isLastSchoolIsApplicable", {
      is: true,
      then: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Account Holder Must be selected!"),
    }),
  lastSchoolNameMr: yup
    .string()
    .nullable()
    .when("isLastSchoolIsApplicable", {
      is: true,
      then: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("Account Holder Must be selected!"),
    }),

  // parentStateName: yup.string().required("Enter your Parent State Name"),
  // lastSchoolName: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द "),



  relationWithAccountantHolder: yup
    .string()
    .required("Account Holder Must be selected!"),

  otherRelationWithAccountantHolder: yup
    .string()
    .nullable()
    .when("relationWithAccountantHolder", {
      is: "other",
      then: yup.string().required("Account Holder Must be selected!"),
    }),

  saralId: yup.string().nullable(),
  schoolMedium: yup.string().required("School medium is required!"),

  birthCertificateDocument: yup
    .string()
    .nullable()
    .required("Student Birth Certificate Required"),
  studentPhotograph: yup
    .string()
    .nullable()
    .required("Student Photograph Certificate Required"),
  studentAadharCardDocument: yup
    .string()
    .nullable()
    .required("Student Aadhar Card Required"),
  parentAadharCardDocument: yup
    .string()
    .nullable()
    .required("Parent Aadhar Card Required"),
});

export default studentAdmissionSchema;
