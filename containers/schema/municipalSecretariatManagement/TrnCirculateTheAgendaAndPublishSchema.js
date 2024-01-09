import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  fromDate:yup.string().required("from Date is Required !!!"),
  toDate:yup.string().required("to Date is Required !!!"),
  committeeId:yup.number().required("Committee name is Required !!!"),
  agendaNo:yup.number().required("committee is Required !!!"),
  meetingDate:yup.string().required("meeting Date is Required !!!"),
  departmentId:yup.number().required("department is Required !!!"),
  subject:yup.string().required("subject is Required !!!"),
  selectAgenda:yup.boolean().required("select Agenda is Required !!!"),
  linkForGoogleMeet:yup.string().required("link For Google Meet is Required !!!"),
  meetingTahkubNoticeNo:yup.string().required("meeting Tahkub Notice No is Required !!!"),
  meetingTahkubNoticeDocument:yup.string().required("meeting Tahkub Notice Document is Required !!!"),
  resolutionNo:yup.number().required("resolution No is Required !!!"),
  resolutionDetails:yup.string().required("resolution Details is Required !!!"),
  docketNo:yup.number().required("docket No is Required !!!"),
  docketDetails:yup.string().required("docket Details is Required !!!"),
  date:yup.string().required("date is Required !!!"),
  agendaDetails:yup.string().required(" agenda Detailsis Required !!!"),

});

export default Schema;


