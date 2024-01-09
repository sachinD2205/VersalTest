import * as yup from "yup";

// schema - validation for student admission form
let timeTableSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is required"),
  academicYearId: yup.string().required("Academic Year is required"),
  classId: yup.string().required("class name is required"),
  divisionKey: yup.string().required("Division is required"),
  teacherKey1: yup.string().required("Teacher is required"),
  subjectKey1: yup.string().required("Teacher is required"),
  teacherKey2: yup.string().required("Teacher is required"),
  subjectKey2: yup.string().required("Teacher is required"),
  teacherKey3: yup.string().required("Teacher is required"),
  subjectKey3: yup.string().required("Teacher is required"),
  teacherKey4: yup.string().required("Teacher is required"),
  subjectKey4: yup.string().required("Teacher is required"),
  teacherKey5: yup.string().required("Teacher is required"),
  subjectKey5: yup.string().required("Teacher is required"),
  teacherKey6: yup.string().required("Teacher is required"),
  subjectKey6: yup.string().required("Teacher is required"),

})

export default timeTableSchema;
