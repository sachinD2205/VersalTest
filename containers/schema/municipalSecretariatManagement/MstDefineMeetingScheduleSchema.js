import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({

  fromDate: yup.string().nullable().required("From Date is Required !!!"),
 toDate: yup.string().nullable().required("To date is Required !!!"),
   selectDate:yup.string().required("Meeting Date is Required !!!"),
  Committee:yup.number().required("Committee is Required !!!"), 

 
});

export default Schema;



