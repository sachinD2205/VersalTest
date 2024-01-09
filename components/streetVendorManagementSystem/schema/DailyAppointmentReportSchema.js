import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation - DailyAppointmentReportSchema
let DailyAppointmentReportSchema = yup.object().shape({
  // zoneName
  zoneName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id='zoneNameValidation' />),
  // fromDate
  fromDate: yup
    .date()
    .required(<FormattedLabel id='fromDateValidation' />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),

  toDate: yup
    .date()
    .required(<FormattedLabel id='toDateValidation' />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
});

export default DailyAppointmentReportSchema;
