import * as yup from "yup";

let Schema = yup.object().shape({
  newsPaperGroupKey: yup
    .string()
    .required("Please Select News Paper Group / कृपया न्यूज पेपर ग्रुप निवडा"),
  newsPaperSubGroupKey: yup
    .string()
    .required(
      "Please Select News Paper Sub-Group / कृपया वृत्तपत्र उप-गट निवडा"
    ),
  newsPaperLevel: yup
    .string()
    .required("Please Select News Paper Level / कृपया वृत्तपत्र स्तर निवडा"),
  newsPaperName: yup
    .string()
    .required("Please Select News Paper / कृपया वृत्तपत्र निवडा"),
  chargeType: yup
    .string()
    .required("Please Select Charge Type / Please Select Charge Type"),
  amount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError()
    .required("Amount is Required / रक्कम आवश्यक आहे"),
});

export default Schema;
