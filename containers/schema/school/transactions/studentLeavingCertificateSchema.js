import * as yup from "yup";

// schema - validation for student admission form
let studentLeavingCertificateSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  divisionKey: yup.string().required("Select Your Division"),
  studentKey: yup.string().required("Select Student Name"),
  leavingReason: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required("Write a reason for Leaving the School(in English"),
  reasonForLeavingSchoolMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("Write a reason for Leaving the School(in Marathi"),
  studentRollNo: yup.string().matches(/^[0-9]+$/, "Must be only digits").required(),
  // studentFirstName: yup.string().required("Student First Name Required"),
  // studentMiddleName: yup.string().required("Student Middle Name Required"),
  // studentLastName: yup.string().required("Student Last Name Required"),
  // studentAdmissionDate: yup.string().required("Select your Admission Date"),
  // studentGeneralRegisterNumber: yup.string().required("Enter your General Register Number"),
  // studentRollNo: yup.string().required("Enter your Roll Number"),
  // studentAddress: yup.string().required("Enter your Address"),
  // studentDateOfBirth: yup.string().required("Enter your Birthdate"),

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
});

export default studentLeavingCertificateSchema;
