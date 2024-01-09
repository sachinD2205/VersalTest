import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  departmentName:yup.string().required("departmen Name is Required !!!"),
  docketNo:yup.string().required("docket No is Required !!!"),
  subjectDate:yup.string().required("subject Date is Required !!!"),
  subject:yup.string().required("subject is Required !!!"),
  subjectSummary:yup.string().required("subject Summary is Required !!!"),
  selectCommittees:yup.number().required("select Committees is Required !!!"),
  financialYear:yup.string().required("financial Year is Required !!!"),
  docketType:yup.string().required("docket Type is Required !!!"),
  amount:yup.number().required(" amount is Required !!!"),
  uploadDocument:yup.string().required("upload Document is Required !!!"),
  remark:yup.string().required("remark is Required !!!"),
  status:yup.string().required("status is Required !!!"),
  digitalSignature:yup.string().required("digital Signature is Required !!!"),
  
});

// approveStatus:yup.string().required("approve Status is Required !!!"),
// employeeName:yup.string().required("employee Name is Required !!!"),
// remarks:yup.string().required("remarks is Required !!!"),
// employeeNameMr:yup.string().required("employee Name Mr  is Required !!!"),
// remarksMr:yup.string().required("remarks Mr is Required !!!"),
export default Schema;


