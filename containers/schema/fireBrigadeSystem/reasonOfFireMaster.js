import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let reasonOfFireSchema = (language) => {
  const baseSchema = yup.object({});

  if (language == "en") {
    return baseSchema.shape({
      reasonOfFire: yup
        .string()
        .required(<FormattedLabel id='reasonOfFireValidation' />),
    });
  } else if (language == "mr") {
    return baseSchema.shape({
      reasonOfFireMr: yup
        .string()
        .required(<FormattedLabel id='reasonOfFireValidationMr' />),
    });
  }
};
