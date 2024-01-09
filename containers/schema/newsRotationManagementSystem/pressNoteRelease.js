import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  wardKey: yup
    .string()
    .required("Ward name is Required / प्रभागाचे नाव आवश्यक आहे"),
  departmentKey: yup
    .string()
    .required("Department name is Required / विभागाचे नाव आवश्यक आहे"),
  // advertisementType: yup
  //   .string()
  //   .required("Advertisement Type is Required "),
  // newsPaper: yup.string().required("News Paper name is Required "),
  pressNoteReleaseDate: yup
    .date()
    .typeError("Enter Valid Date / वैध तारीख प्रविष्ट करा")
    .required(
      "Press Note Release Date is Required / प्रेस नोट प्रकाशन तारीख आवश्यक आहे"
    ),
  pressNoteSubject: yup
    .string()
    .required("Press Note Subject is Required / प्रेस नोट विषय आवश्यक आहे"),
  pressNoteDescription: yup
    .string()
    .required(
      "Press Note Description is Required / प्रेस नोट वर्णन आवश्यक आहे"
    ),
});

export default Schema;
