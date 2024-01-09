import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  shiftName: yup
    .string()
    .required(<FormattedLabel id='shiftNameValidation' />)
    .typeError(<FormattedLabel id='shiftNameValidation' />),
  shiftNameMr: yup
    .string()
    .required(<FormattedLabel id='shiftNameMrValidation' />),
  shiftStartTime: yup
    .string()
    .required(<FormattedLabel id='shiftStartTimeValidation' />)
    .typeError(<FormattedLabel id='shiftStartTimeValidation' />),
  shiftEndTime: yup
    .string()
    .required(<FormattedLabel id='shiftEndTimeValidation' />)
    .typeError(<FormattedLabel id='shiftEndTimeValidation' />),

  nameOfCFO: yup.string().required(<FormattedLabel id='nameOfCFOValidation' />),
  nameOfSFO: yup.string().required(<FormattedLabel id='nameOfSFOValidation' />),
});

export default Schema;
