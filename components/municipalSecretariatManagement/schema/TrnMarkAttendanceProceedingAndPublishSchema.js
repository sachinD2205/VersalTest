import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  agendaNo:yup.number().required("agenda No is Required !!!"),
  attendanceCaptureFrom:yup.string().required("attendance Capture From is Required !!!"),
  listOfConcernCommitteeMembers:yup.number().required("list Of Concern Committee Members is Required !!!"),
  selectDocketNo:yup.number().required("select Docket No is Required !!!"),
  addProceeding:yup.string().required("add Proceeding is Required !!!"),
  addProceedingMr:yup.string().required("add Proceeding Mr is Required !!!"),
  proceedingDate:yup.string().required("proceeding Date is Required !!!"),
  onSpotEntry:yup.string().required("on Spot Entry is Required !!!"),
  onSpotEntryMr:yup.string().required("on Spot Entry Marathi is Required !!!"),
  on_hold_subjects:yup.string().required("on hold subjects is Required !!!"),
  on_hold_subjectsMr:yup.string().required("on hold subjects Mr is Required !!!"),
  nextMeetingDateForOnHoldSubjects:yup.string().required("next Meeting Date For On Hold Subjects is Required !!!"),
  nameOfSuchak:yup.string().required("name Of Suchak is Required !!!"),
  nameOfSuchakMr:yup.string().required("name Of Suchak Mr  is Required !!!"),
  nameOfAnumodak:yup.string().required("name Of Anumodak is Required !!!"),
  nameOfAnumodakMr:yup.string().required("name Of Anumodak Mr is Required !!!"),
  referenceByPersonName:yup.string().required("reference By Person Name  is Required !!!"),
  referenceByPersonNameMr:yup.string().required("reference By Person Name Mr is Required !!!"),
  digitalSignature:yup.string().required("digital Signature is Required !!!"),
  attendance:yup.string().required(" attendance is Required !!!"),
  corporatorNo:yup.string().required("corporator No is Required !!!"),
  committee:yup.string().required("committee is Required !!!"),
  date:yup.string().required("date is Required !!!"),
 
 
});

export default Schema;


