import * as yup from "yup";
var regex = /^[-+]?[0-9]+\.[0-9]+$/;
let Schema = yup.object().shape({
  newsPaperGroupKey: yup
    .string()
    .required("Please Select News Paper Group / कृपया न्यूज पेपर ग्रुप निवडा"),
  newsPaperSubGroupKey: yup
    .string()
    .required(
      "Please Select News Paper Sub Group / कृपया वृत्तपत्र उपसमूह निवडा"
    ),
  newsPaperLevel: yup
    .string()
    .required("Please Select News Paper Level / कृपया वृत्तपत्र स्तर निवडा"),
  newsPaper: yup
    .string()
    .required("Please Select NewsPaper / कृपया वृत्तपत्र निवडा"),
  standardFormatSize: yup
    .string()
    .matches(
      regex,
      "Must be only digits with decimal point / दशांश बिंदूसह फक्त अंक असणे आवश्यक आहे"
    )
    .required("Standard Format Size is Required / मानक स्वरूप आकार आवश्यक आहे"),
});

export default Schema;
