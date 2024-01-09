import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation

export let HawkingDurationSchema = (language) => {
  return yup.object().shape({
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id='applicationNameValidation' />),

    fromDate: yup
      .date()
      .required(<FormattedLabel id='fromDateValidation' />)
      .typeError(<FormattedLabel id='fromDateValidation' />),
    hawkingDurationDailyFrom: yup
      .date()
      .required(<FormattedLabel id='hawkingDurationDailyFromValidation' />)
      .typeError(<FormattedLabel id='hawkingDurationDailyFromValidation' />),
    hawkingDurationDailyTo: yup
      .date()
      .required(<FormattedLabel id='hawkingDurationDailyToValidation' />)
      .typeError(<FormattedLabel id='hawkingDurationDailyToValidation' />),
    businessType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id='businessTypeValidation' />),
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   language == "en"
    //     ? "Must be only english characters"
    //     : "फक्त इंग्लिश शब्द "
    // )
    // .typeError(),
    businessSubType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id='businessSubTypeValidation' />),
    // .matches(
    //   /^[aA-zZ\s]+$/,
    //   language == "en"
    //     ? "Must be only english characters"
    //     : "फक्त इंग्लिश शब्द "
    // )
    // .typeError()
  });
};

// export default HawkingDurationDailySchema;
