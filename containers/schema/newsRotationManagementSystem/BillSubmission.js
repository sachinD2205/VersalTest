import * as yup from "yup";

// let Schema = yup.object().shape({
// wardKey: yup.string().required("Ward name is Required !!!"),
// department: yup.string().required("Department name is Required !!!"),
// priority: yup.string().required("Priority is Required !!!"),
// newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required !!!"),
// // workName: yup.string().required("Work Name is Required !!!"),
// workCost: yup
//   .string()
//   .matches(/^[0-9]+$/, "Must be only digits")
//   .typeError(),
// // .required("work Cost is Required !!!"),
// newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required !!!"),
// rotationGroupKey: yup.string().required("Select rotation Group is Required !!!"),
// rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required !!!"),
// newsPaperLevel: yup.string().required("Select news Paper Level is Required !!!"),
// standardFormatSize: yup.string().required("Select standard Format Size is Required !!!"),
// typeOfNews: yup.string().required("Select type Of News is Required !!!"),
// newsPublishDate: yup.date().typeError("Enter Valid Date !!!").required("news Publish Date is Required !!!"),
// });

const paymentDetailsSchemaObject = {
  // billNo: yup.string().required("Bill No Required"),
  // billDate: yup.date().typeError("Bill Date Required").required(),
  totalNetAmount: yup
    .number()
    .moreThan(
      -1,
      "Must Be Greater than zero / शून्यापेक्षा मोठे असणे आवश्यक आहे"
    ),
};

export let paymentDetailsSchema = yup.object().shape({
  prePaymentDetails: yup
    .array()
    .of(yup.object().shape(paymentDetailsSchemaObject)),
});

// export default Schema;
