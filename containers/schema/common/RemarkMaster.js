import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  department: yup.string().required("Department  is Required !!!"),
  service :yup.string().required("Service Name  is Required !!!"),
  remarkEn: yup.string().required("Remark Eng is Required !!!"),
  remarkMa: yup.string().required("Remark Mr  is Required !!"),
});

export default Schema;
