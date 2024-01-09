import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let businessRateChartShema = (language) => {
  return yup.object().shape({
    typeOfBusinessId: yup
      .string()
      .required(<FormattedLabel id='typeOfBusinessValidation' />)
      .typeError(<FormattedLabel id='typeOfBusinessValidation' />),

    capacityFrom: yup
      .string()
      .required(<FormattedLabel id='capacityFromValidation' />)
      .test(
        "is-number",
        language == "en"
          ? "Capacity From must be a Number"
          : "पासून क्षमता संख्या असणे आवश्यक आहे",
        (value) => {
          if (!value) return true; // Allow empty values
          return !isNaN(parseFloat(value)) && isFinite(value);
        }
      ),

    // yup
    //   .number()
    //   .required(<FormattedLabel id='capacityFromValidation' />)
    //   .typeError(<FormattedLabel id='capacityFromValidation' />),

    capacityTo: yup
      .string()
      .required(<FormattedLabel id='capacityToValidation' />)
      .test(
        "is-number",
        language == "en"
          ? "Capacity To must be a Number"
          : "क्षमतेपर्यंत संख्या असणे आवश्यक आहे",
        (value) => {
          if (!value) return true; // Allow empty values
          return !isNaN(parseFloat(value)) && isFinite(value);
        }
      ),

    rate: yup
      .string()
      .required(<FormattedLabel id='rateValidation' />)
      .test(
        "is-number",
        language == "en"
          ? "Rate must be a Number"
          : "दर हा क्रमांक असणे आवश्यक आहे",
        (value) => {
          if (!value) return true; // Allow empty values
          return !isNaN(parseFloat(value)) && isFinite(value);
        }
      ),

    renewRatePercentage: yup
      .string()
      .required(<FormattedLabel id='renewRatePercentageValidation' />)
      .test(
        "is-number",
        language == "en"
          ? "Renew Rate must be a Number"
          : "नूतनीकरण दर हा क्रमांक असणे आवश्यक आहे",
        (value) => {
          if (!value) return true; // Allow empty values
          return !isNaN(parseFloat(value)) && isFinite(value);
        }
      ),
  });
};
