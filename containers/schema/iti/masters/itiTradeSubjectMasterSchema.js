import * as yup from "yup";
let itiTradeSubjectMasterSchema = yup.object().shape({
  subjectName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Subject name is required"),
  subjectPrefix: yup.string().required("Subject prefix is required"),
  tradeKey: yup.string().required("Trade name is required"),

  marks: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Marks required"),
});
export default itiTradeSubjectMasterSchema;
