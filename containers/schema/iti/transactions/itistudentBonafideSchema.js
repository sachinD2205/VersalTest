import * as yup from "yup";

// new bonafide schema
export let itistudentBonafideSchema = yup.object().shape({
  itiKey: yup.string().required("ITI Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  tradeKey: yup.string().required("Trade Name Required"),
  tradeDivisionKey: yup.string().required("Select Your Division"),
  traineeKey: yup.string().required("Select Trainee Name"),
  purposeOfBonafideEn: yup.string().matches(
    /^[aA-zZ\s]+$/,
    "Must be only english characters / फक्त इंग्लिश शब्द ",
  ).required("Purpose Of Bonafide in English"),
  purposeOfBonafideMr: yup.string().matches(
    /^[\u0900-\u097F]+/,
    "Must be only marathi characters/ फक्त मराठी शब्द",
  ).required("Purpose Of Bonafide in Marathi"),

});

// group instructor schema
export let itistudentBonafideSchemaGroupInstructor = yup.object().shape({

  groupInstructorStatus: yup.string().required("Select Status"),
  groupInstructorRemarksEn: yup.string().matches(
    /^[aA-zZ\s]+$/,
    "Must be only english characters / फक्त इंग्लिश शब्द ",
  ).required("Remark in English required"),
  groupInstructorRemarksMr: yup.string().matches(
    /^[\u0900-\u097F]+/,
    "Must be only marathi characters/ फक्त मराठी शब्द",
  ).required("Remark in Marathi required"),
});

export let itistudentBonafideSchemaPrincipal = yup.object().shape({

  approveBonafiedDate: yup.string().required("Select Date"),
  principalStatus: yup.string().required("Select Status"),
  principalRemarksEn: yup.string().matches(
    /^[aA-zZ\s]+$/,
    "Must be only english characters required / फक्त इंग्लिश शब्द आवश्यक ",
  ).required("Remark in English required"),
  principalRemarksMr: yup.string().matches(
    /^[\u0900-\u097F]+/,
    "Must be only marathi characters required/ फक्त मराठी शब्द आवश्यक",
  ).required("Remark in Marathi required"),
});
export let ititeacherParentCommSchema = yup.object().shape({
  itiKey: yup.string().required("ITI Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  tradeKey: yup.string().required("Trade Name Required"),
  teacherKey: yup.string().required("Select Your Division"),
  // selectedStudents: yup.boolean().required("Select Trainee Name"),
  commSubject: yup.string().required("Select Trainee Name"),
  commMessage: yup.string().required("Select Trainee Name"),

});

