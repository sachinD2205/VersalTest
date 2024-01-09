import * as yup from "yup";

// schema - validation for exam time table form
let examtimeTableSchema = yup.object().shape({
  schoolKey: yup.number().required("school name is required"),
  academicYearKey: yup.number().required("academic Year is required"),
  classKey: yup.number().required("class is required"),
  term: yup.number().required("term is required"),
  examName: yup.number().required("exam is required"),
  minimumMark:yup.number(),
  outOfMarks:yup.number(),
  subjectKey:yup.number(),
  toTime:yup.string(),
  fromTime:yup.string(),
  dateOfExam:yup.string()

})

export default examtimeTableSchema;
