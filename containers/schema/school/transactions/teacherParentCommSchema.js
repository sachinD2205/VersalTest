import * as yup from "yup";

// schema - validation for student admission form
let teacherParentCommSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  divisionKey: yup.string().required("Select Your Division"),
  // selectedStudents: yup.boolean().required("Select Student Name"),
  teacherKey: yup.string().required("Select Teacher Name"),
  //   selectedStudents: yup.array().required("Select Students Name"),
  commSubject: yup.string().required("Enter your Communication Subject Name"),
  commMessage: yup.string().required("Enter your Message"),

  // zoneKey: yup.string().required("Zone Name is Required"),
  // wardKey: yup.string().required("Ward Name is Required"),
  // religionKey: yup.string().required("Select Your Religion"),
  // studentFirstName: yup.string().required("Student First Name Required"),
  // studentMiddleName: yup.string().required("Student Middle Name Required"),
  // studentLastName: yup.string().required("Student Last Name Required"),
  // fatherFirstName: yup.string().required("Father First Name Required"),
  // fatherMiddleName: yup.string().required("Father Middle Name Required"),
  // fatherLastName: yup.string().required("father Last Name Required"),
  // motherName: yup.string().required("Mother Name Required"),
  // studentGender: yup.string().required("Select your gender"),
  // casteName: yup.string().required("Enter your Caste Name"),
  // citizenshipName: yup.string().required("Enter your Citizen Name"),
  // motherTongueName: yup.string().required("Enter your MotherTongue Name"),
  // studentBirthPlace: yup.string().required("Enter your Birthplace"),
  // studentDateOfBirth: yup.string().required("Enter your Birthdate"),
  // stateName: yup.string().required("Enter your Birthplace state"),
  // districtName: yup.string().required("Enter your Birthplace district"),
  // familyPermanentAddress: yup.string().required("Enter your Family Permanent Address"),
  // parentFullName: yup.string().required("Enter your Parent Fullname"),
  // parentAddress: yup.string().required("Enter your Parent Address"),
  // parentOccupation: yup.string().required("Enter your Parent Occupation"),
  // colonyName: yup.string().required("Enter your Area/Colony Name"),
  // parentDistrictName: yup.string().required("Enter your Parent District Name"),
  // parentStateName: yup.string().required("Enter your Parent State Name"),
  // examName: yup.string().required("Enter the Exam Name"),
  // schoolId: yup.string().required("School Name is required"),
  // academicYearId: yup.string().required("Academic Year is required"),
  // classId: yup.string().required("class name is required"),
  // divisionId: yup.string().required("Division is required"),
  // subjectName: yup.string().required("Enter the Subject Name"),
  // studentAdmissionDate: yup.string().required("Select your Admission Date"),
  // studentGeneralRegisterNumber: yup.string().required("Enter your General Register Number"),
  // studentRollNo: yup.string().required("Enter your Roll Number"),
  // studentAddress: yup.string().required("Enter your Address"),
  // studentDateOfBirth: yup.string().required("Enter your date of birth"),
  // studentPlaceOfBirth: yup.string().required("Enter your Birthplace"),
  // academicYearFrom: yup.string().required("Enter the academic year starts date"),
  // academicYearTo: yup.string().required("Enter the academic year ends date"),
  // className: yup.string().required("Classname is Required"),
  // classPrefix: yup.string().required("Class Prefix is Required"),
  // divisionName: yup.string().required("Division Name is Required"),
  // divisionPrefix: yup.string().required("Division Prefix is Required"),
  // schoolName: yup.string().required("School Name is Required"),
  // schoolPrefix: yup.string().required("School Prefix is Required"),
  // schoolAddress: yup.string().required("School Address is Required"),
  // contactPersonName: yup.string().required("Enter School Contact Person Name"),
  // zoneKey: yup.string().required("Select the Zone Name"),
  // wardKey: yup.string().required("Select the Ward Name"),
  // firstName: yup.string().required("Enter First Name"),
  // middleName: yup.string().required("Enter Middle Name"),
  // lastName: yup.string().required("Enter Last Name"),
  // gender: yup.string().required("Select your gender"),
  // motherTongueName: yup.string().required("Enter your Mother tongue name"),
  // permanentAddress: yup.string().required("Enter your Permanent Address"),

  // studentContactDetails: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter Your Mobile Number"),
  // fatherContactNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter Your Father Mobile Number"),
  // motherContactNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter Your Mother Mobile Number"),
  // studentEmail: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter Your EmailID"),
  // studentAadharNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(12, 'Adhar Number must be at least 12 number')
  //     .max(12, 'Adhar Number not valid on above 12 number')
  //     .required("Enter Your Aadhar Number"),
  // parentPincode: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(6, 'Pincode Number must be at least 6 number')
  //     .max(6, 'Pincode Number not valid on above 6 number')
  //     .required("Enter your Parent Pincode"),

  // studentMobileNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter Your Mobile Number"),
  // studentEmailId: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter Your EmailID"),

  // pincode: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(6, 'Pincode Number must be at least 6 number')
  //     .max(6, 'Pincode Number not valid on above 6 number')
  //     .required("Enter Pincode"),
  // contactPersonNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter school contact person Mobile Number"),
  // emailId: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter School EmailID"),
  // contactDetails: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(10, 'Mobile Number must be 10 number')
  //     .max(10, 'Mobile Number not valid on above 10 number')
  //     .required("Enter your Mobile Number"),
  // emailDetails: yup
  //     .string()
  //     .email('Incorrect format')
  //     .required("Enter your EmailID"),
  // aadharNumber: yup
  //     .string()
  //     .matches(/^[0-9]+$/, 'Must be only digits')
  //     .min(12, 'Adhar Number must be at least 12 number')
  //     .max(12, 'Adhar Number not valid on above 12 number')
  //     .required("Enter Your Aadhar Number"),
});

export default teacherParentCommSchema;
