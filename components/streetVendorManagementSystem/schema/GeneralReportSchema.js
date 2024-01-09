import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation - GeneralReportSchema
let GeneralReportSchema = yup.object().shape({
  // status
  isApproved: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="statusValidation" />),

  // zoneName
  zoneName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="zoneNameValidation" />),
  // wardName
  wardName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="wardNameValidation" />),
  // hawkerType
  hawkerType: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="hawkerTypeValidation" />),
  // hawkerType
  hawkerType: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="hawkerTypeValidation" />),
  // item
  item: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="itemValidation" />),

  // fromDate
  fromDate: yup
    .date()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),

  // toDate
  toDate: yup
    .date()
    .required(<FormattedLabel id="toDateValidation" />)
    .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
});

export default GeneralReportSchema;
