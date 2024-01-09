import * as yup from "yup";

let Schema = yup.object().shape({
  // wardKey: yup.string().required("Ward name is Required "),
  departmentKey: yup
    .string()
    .required("Department name is Required / विभागाचे नाव आवश्यक आहे"),
  eventTime: yup
    .date()
    .typeError("Enter Valid Time / वैध वेळ प्रविष्ट करा")
    .required("Event Time is Required / कार्यक्रमाची वेळ आवश्यक आहे"),
  eventDescription: yup
    .string()
    .required("Event Description is Required / कार्यक्रमाचे वर्णन आवश्यक आहे"),
  eventDate: yup
    .date()
    .typeError("Enter Valid Date / वैध तारीख प्रविष्ट करा")
    .required("Event Date is Required / कार्यक्रमाची तारीख आवश्यक आहे"),
  eventLocationLat: yup
    .string()
    .required("Event Location Lat is Required / इव्हेंट लोकेशन Lat आवश्यक आहे"),
  eventLocationLong: yup
    .string()
    .required(
      "Event Location Long is Required / कार्यक्रमाचे स्थान लांब आवश्यक आहे"
    ),
  // newsAdvertisementSubject: yup.string().required("News Advertisement Subject is Required "),
  // newsAdvertisementDescription: yup.string().required("news Advertisement Description is Required "),
  // workName: yup.string().required("Work Name is Required "),
  // rotationGroupKey: yup.string().required("Select rotation Group is Required "),
  // rotationSubGroupKey: yup.string().required("Select rotation SubGroup is Required "),
  // newsPaperLevel: yup.string().required("Select news Paper Level is Required "),
  // standardFormatSize: yup.string().required("Select standard Format Size is Required "),

  // workCost: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError(),
  // .required("work Cost is Required "),
});

export default Schema;
