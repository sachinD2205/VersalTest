import * as yup from "yup";

let itiTeacherOrInstructorMasterSchema = yup.object().shape({
  itiKey: yup.string().required("ITI Name is required"),
  tradeKey: yup.string().required("Trade Name is required"),
  firstName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("First Name is required"),
  middleName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Middle Name is required"),
  lastName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Last Name is required"),
  // teacherType: yup.boolean().required("Teacher is required"),

  //   teacherType: yup
  //     .array()
  //     .min(1, "Select at least one teacher type")
  //     .required("Select at least one teacher type"),
});

export default itiTeacherOrInstructorMasterSchema;
