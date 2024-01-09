import * as yup from "yup";

let Schema = yup.object().shape({
  // wardKey: yup.string().required("Ward name is Required"),
  // budgetProvision: yup.string().required("Budget Provision is Required"),
  billDescription: yup
    .string()
    .required("Bill Description is Required / बिल वर्णन आवश्यक आहे"),
  newspaperName: yup
    .string()
    .required("News Paper Name is Required / वृत्तपत्राचे नाव आवश्यक आहे"),
  billAmount: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError()
    .required("Bill Amount is Required / बिलाची रक्कम आवश्यक आहे"),
  budgetAmountAfterPriviousBillPaymentDeduction: yup
    .string()
    .required(
      "Budget Amount After Privious Bill Payment Deduction is Required / मागील बिल पेमेंट वजावटीनंतर बजेटची रक्कम आवश्यक आहे"
    ),
  budgetAmountAfterCurrentBillPaymentDeduction: yup
    .string()
    .required(
      "Budget Amount After Current Bill Payment Deduction is Required / चालू बिल पेमेंट वजावटीनंतर बजेटची रक्कम आवश्यक आहे"
    ),
  billAppovalDate: yup
    .date()
    .typeError("Enter Valid Date / वैध तारीख प्रविष्ट करा")
    .required("Bill Approval Date is Required / बिल मंजुरीची तारीख आवश्यक आहे"),
  billAppovalOfficerName: yup
    .string()
    .required(
      "Bill Approval Officer Name is Required / बिल मंजूरी अधिकाऱ्याचे नाव आवश्यक आहे"
    ),
  remark: yup
    .string()
    .required("Remark Name is Required / टिप्पणीचे नाव आवश्यक आहे"),

  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required"),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required"),
  // workName: yup.string().required("Work Name is Required"),
  // rotationGroupKey: yup.string().required("Select rotation Group is Required"),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required"),
  // newsPaperLevel: yup.string().required("Select news Paper Level is Required"),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required"),

  budgetProvision: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError()
    .required("Budget Provision is Required / अर्थसंकल्पात तरतूद आवश्यक आहे"),
});

export default Schema;
