import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  selectMonth:yup.number().required("select Month is Required !!!"),
  selectYear:yup.number().required("select Year is Required !!!"),
  healthInsuranceChargesCheckbox:yup.string().required("health InsuranceCharges Checkbox is Required !!!"),
  srNo:yup.number().required("sr No is Required !!!"),
  wardNo:yup.number().required("ward No is Required !!!"),
  corporatorName:yup.number().required("corporator Name is Required !!!"),
  captureAttendance:yup.string().required("capture Attendance is Required !!!"),
  fixedAmount:yup.number().required("fixed Amount is Required !!!"),
  amountForMeetingAttendedInTheMonth:yup.number().required("amount For Meeting Attended In The Month is Required !!!"),
  deductedOtherAmount:yup.number().required("deducted Other Amount is Required !!!"),
  remark:yup.string().required("remark is Required !!!"),
  remarkMr:yup.string().required("remark Mr is Required !!!"),
  healthInsuranceCharges:yup.number().required("health Insurance Charges is Required !!!"),
  grandTotal:yup.number().required("grand Total is Required !!!"),
  digitalSignature:yup.string().required("digital Signature is Required !!!"),
 
});

export default Schema;


