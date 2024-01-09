import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({

  // comittee:yup.string().required("Name of Committee is Required !!!"),
  committeeEstablishedDate:yup.string().required("Committee Established Date is Required !!!"),
  committeeDismissedDate: yup.string().required("Committee Dismissed Date is Required !!!"),
  honorariumPerMeeting: yup.number().required("Honarium/Meeting is Required !!!"),
  working: yup.string().required("Working/Not Working is Required !!!"),
 
});

export default Schema;




