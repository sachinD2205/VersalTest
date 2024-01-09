import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  caseMainTypeId: yup.string()
  .nullable()

  .required(<FormattedLabel id="selectCaseType" />),
  // caseMainType: yup.string().required(<FormattedLabel id="selectCaseType" />),

  caseSubType: yup.string().required(<FormattedLabel id="selectSubType" />),

  // rate
  rate: yup
    .string()
    .matches(/^[1-9][0-9/.]+$/, "Must be only digits")
    // .typeError(<FormattedLabel id="enteraadhaarNo" />)
    // .min(12, 'Adhar Number must be at least 12 number')
    // .max(12, 'Adhar Number not valid on above 12 number')
    .required(<FormattedLabel id="enterPaymentRate" />),

  // fromDate
  fromDate: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),
});

export default schema;
