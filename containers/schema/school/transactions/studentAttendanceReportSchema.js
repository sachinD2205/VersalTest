import * as yup from "yup";

// schema - validation for student admission form
let studentAttendanceReportSchema = yup.object().shape({
  schoolId: yup.string().required("School Name is Required"),
  academicYearId: yup.string().required("Academic Year Required"),
  classId: yup.string().required("Class Name Required"),
  divisionId: yup.string().required("Select Your Division"),
  fromDate: yup.string().required("Select Your Division"),
  // studentKey: yup.string().required("Select Student Name"),
  //   toDate: yup
  //     .string()
  //     .max(new Date(), "Date cannot be in the future")
  //     .required("Date is required and it should past or current date"),
});

export default studentAttendanceReportSchema;
