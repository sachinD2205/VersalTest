import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let MasterReporSchema = yup.object().shape({
  // fromDate
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation"/>),
  // toDate
  toDate: yup.string().nullable().required(<FormattedLabel id="toDateValidation"/>),
  // lastCommisionerMettingDate
  lastCommissionorDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="lastCommissionorDateValidation"/>),
  // departmentName
  // department: yup
  //   .string()
  //   .nullable()
  //   .required("Department name selection is required !!!"),
  // subDepartment
  // lstSubDepartment: yup
  //   .array()
  //   .nullable()
  //   .required("Sub Department name selection is required !!!"),
  // events
  // splevent: yup.array().nullable().required("Event Selection is required !!!"),
  // applicantType: yup
  //   .string()
  //   .required("applicant type selection is required !!!"),
});

export default MasterReporSchema;
