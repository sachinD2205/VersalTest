import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let DepartmentPerformanceReportSchema = yup.object().shape({
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />),
  toDate: yup.string().nullable().required(<FormattedLabel id="toDateValidation" />),
  // lstDepartment: yup
  //   .string()
  //   .nullable()
  //   .required("Department name selection is required !!!"),
  // lstSubDepartment: yup
  //   .array()
  //   .nullable()
  //   .required("Sub Department name selection is required !!!"),
  // splevent: yup.array().nullable().required("Event Selection is required !!!"),
  // applicantType: yup
  //   .string()
  //   .required("applicant type selection is required !!!"),
});

export default DepartmentPerformanceReportSchema;
