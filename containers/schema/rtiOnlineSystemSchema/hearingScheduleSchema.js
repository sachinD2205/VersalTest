import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let hearingScheduleSchema = yup.object().shape({
    // applicationNo: yup
    // .string()
    // .required("Application No is Required !!!"),
    // subject: yup.string().required("Subject is Required !!!"),
    // hearingDate: yup.string().required("Hearing Date is Required !!!"),
    // hearingTime: yup.string().required("Hearing Time Required !!!"),
    venue: yup.string().max(300, <FormattedLabel id='venueMaxLen' />)
    .required(<FormattedLabel id="venueReq"/>),
    // chargeTypeKey: yup.string().required("Charge Type is Required !!!"),
    // totalAmount:yup.string().required("Total Amount is Required !!!"),
    // remarks:yup.string().required("Remark is Required !!!"),

});

export default hearingScheduleSchema;