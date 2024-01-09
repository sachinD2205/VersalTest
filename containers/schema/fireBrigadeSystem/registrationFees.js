import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let registrationFeesSchema = (language) =>
  yup.object().shape({
    nocType: yup
      .string()
      .required(<FormattedLabel id='nocTypeValidation' />)
      .typeError(<FormattedLabel id='nocTypeValidation' />),

    serviceId: yup
      .string()
      .required(<FormattedLabel id='serviceNameValidation' />)
      .typeError(<FormattedLabel id='serviceNameValidation' />),
    registrationAmount: yup
      .string()
      .matches(
        /^[0-9]+$/,
        language ? "Must be only digits" : "संख्या असणे आवश्यक आहे"
      )
      .typeError(<FormattedLabel id='registrationAmountValidation' />)
      // .min(10, "Mobile Number must be at least 10 number")
      .max(10, language ? "Mobile Number not valid on above 10 number" : "")
      .required(),
  });
