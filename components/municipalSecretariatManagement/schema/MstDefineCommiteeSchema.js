import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({

  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("To date is Required !!!"),
  
  // scheduledate:yup.string().required("Scheduled Date is Required !!!"),
  CommitteeName:yup.string().required("Committee is Required !!!"),
  CommitteeNameMr:yup.string().required("Committee in Marathi is Required !!!"), 
  // timePicker:yup.string().required("Please Select Time !!!"),
  countOfCommitteeMembers:yup.number().required("No of Members is Required !!!"),
 
});

export default Schema;



