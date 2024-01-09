import * as yup from "yup";

// schema - validation for teacher subject mapping master
let teacherSubjectMappingSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is required"),
  subjectId: yup.string().required("Enter the Subject Name"),
  teacherId: yup.string().required("Enter the Teacher Name"),
  // remark: yup.string().required("Enter the remark"),
});

export default teacherSubjectMappingSchema;
