import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let forwardComplaintSchema = yup.object().shape({
  // reply: yup.string().required("This field is Required !!!"),
  departmentName: yup
    .string()
    .required(<FormattedLabel id='selectDeptNameReq'/>),
    complaintTypeId:yup
    .string()
    .required(<FormattedLabel id='complaintTypeReq'/>),
    reply:yup
    .string()
    .required(<FormattedLabel id='replyReq'/>).max(1000,<FormattedLabel id='replyMaxLen'/>),
});

export default forwardComplaintSchema;