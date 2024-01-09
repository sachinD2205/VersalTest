import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let LicenseValiditySchema = (language) => {
  return yup.object().shape({
    // module
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    // from Date
    fromDate: yup
      .date()
      .required(<FormattedLabel id="fromDateValidation" />)
      .typeError(<FormattedLabel id="fromDateValidation" />),

    // hawker Type
    hawkerType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="hawkerTypeValidationTT" />),

    // license Validity
    licenseValidity: yup
      .number()
      .required(<FormattedLabel id="licenseValidityValidation" />)
      .min(
        1,
        language == "en"
          ? "plese enter valid license years"
          : "कृपया वैध परवाना वर्ष प्रविष्ट करा"
      )
      .max(
        5,
        language == "en"
          ? "plese enter valid license years"
          : "कृपया वैध परवाना वर्ष प्रविष्ट करा"
      )
      .typeError(<FormattedLabel id="licenseValidityValidation" />),

    // serviceId
    serviceId: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="serviceNameValidation" />),
  });
};

export default LicenseValiditySchema;
