import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ReOpneSummaryReport = yup.object().shape({
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />),
  toDate: yup.string().nullable().required(<FormattedLabel id="toDateValidation" />),
  // department: yup
  //   .string()
  //   .nullable()
  //   .required("Department name selection is required !!!"),
  // subDepartment: yup
  //   .array()
  //   .nullable()
  //   .required("Sub Department name selection is required !!!"),
  // mediaId: yup.array().nullable().required("Event Selection is required !!!"),
  // eventId: yup.array().nullable().required("Special Event Selection is required !!!"),
});

export default ReOpneSummaryReport;
