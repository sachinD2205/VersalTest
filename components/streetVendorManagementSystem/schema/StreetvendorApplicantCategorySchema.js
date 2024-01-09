import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let StreetvendorApplicantCategorySchema = yup.object().shape({
  applicationName: yup
    .string()
    .required(<FormattedLabel id='applicationNameValidation' />)
    .typeError(<FormattedLabel id='applicationNameValidation' />),
  type: yup
    .string()
    .required(<FormattedLabel id='typeValidation' />)
    .typeError(<FormattedLabel id='typeValidation' />),
  typeMr: yup
    .string()
    .required(<FormattedLabel id='typeValidation' />)
    .typeError(<FormattedLabel id='typeValidation' />),
  subtype: yup
    .string()
    .required(<FormattedLabel id='subtypeValidation' />)
    .typeError(<FormattedLabel id='subtypeValidation' />),
  subtypeMr: yup
    .string()
    .required(<FormattedLabel id='subtypeValidation' />)
    .typeError(<FormattedLabel id='subtypeValidation' />),
  // fromDate: yup
  //   .date()
  //   .required(<FormattedLabel id="fromDateValidation" />)
  //   .typeError("please enter valid date/कृपया वैध तारीख प्रविष्ट करा !!!"),
  // businessSubTypePrefix: yup
  //   .string()
  //   .required("Business Sub Type Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // businessType: yup.string().required("Business Type is Required !!!"),
  // businessSubType: yup.string().required("Sub Type Business is Required !!!"),
});

export default StreetvendorApplicantCategorySchema;
