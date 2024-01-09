import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  subject:yup.string().required("subject is Required !!!"),
  fromDate:yup.string().required("fromDate is Required !!!"),
  toDate:yup.string().required("toDate is Required !!!"),
  office:yup.number().required("office is Required !!!"),
  department:yup.number().required("department is Required !!!"),
  committee:yup.number().required("committee is Required !!!"),
  docket:yup.number().required("docket is Required !!!"),
  docketDate:yup.string().required("docket Date is Required !!!"),
  subjectSummary:yup.string().required("subject Summary is Required !!!"),
  verifyUploadedDocument:yup.string().required("verify Uploaded Document is Required !!!"),
  approvedAndSubmittedForAgenda:yup.string().required("  approved And Submitted For Agenda is Required !!!"),
  revert:yup.string().required("revert is Required !!!"),
  reasonForRevert:yup.string().required("reason For Revert  is Required !!!"),
  remark:yup.string().required("remark is Required !!!"),
  digitalSignature:yup.string().required("digital Signature is Required !!!"),
  
});

export default Schema;

// actionButton:yup.string().required("action Button is Required !!!"),

