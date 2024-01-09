import * as yup from "yup";
var regex = /^[-+]?[0-9]+\.[0-9]+$/;
let Schema = yup.object().shape({
  newsPaperLevel: yup
    .string()
    .required("News Paper Level is Required / वृत्तपत्र पातळी आवश्यक आहे"),
  // newsPapers: yup.string().matches(regex, "Must be only digits with decimal point").required("News Type in Marathi is Required"),
  rotationGroup: yup
    .string()
    .required("Rotation Group is Required / रोटेशन गट आवश्यक आहे"),
  rotationSubGroup: yup
    .string()
    .required("Rotation Sub Group is Required / रोटेशनल उपसमूह आवश्यक आहे"),
});

export default Schema;
