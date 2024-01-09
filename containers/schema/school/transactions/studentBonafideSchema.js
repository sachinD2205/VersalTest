import * as yup from "yup";

// schema - validation for student admission form
let studentBonafideSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  divisionKey: yup.string().required("Select Your Division"),
  studentKey: yup.string().required("Select Student Name"),
  bonafiedPurpose: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required(),
  bonafiedPurposeMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required(),
  studentRollNo: yup.string().matches(/^[0-9]+$/, "Must be only digits").required(),
});

export default studentBonafideSchema;
