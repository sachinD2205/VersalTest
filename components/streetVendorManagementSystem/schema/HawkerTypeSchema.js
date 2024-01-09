import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkerTypeSchema = (language) => {
  return yup.object().shape({
    // module
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    // fromDate
    fromDate: yup
      .date()
      .required(<FormattedLabel id="fromDateValidation" />)
      .typeError(<FormattedLabel id="fromDateValidation" />),

    // hawkerType
    hawkerType: yup
      .string()
      .required(<FormattedLabel id="hawkerTypeEnValidation" />)
      .matches(
        /^[A-Za-z0-9 -]+$/,
        language == "en"
          ? "only english characters are allowed !!!"
          : "फक्त इंग्रजी वर्णांना परवानगी आहे !!!"
      ),

    // hawkerType mr
    hawkerTypeMr: yup
      .string()
      .required(<FormattedLabel id="hawkerTypeMrValidation" />)
      .matches(
        /^[\u0900-\u097F0-9\s-]+$/,
        language == "en"
          ? "only marathi characters are allowed !!!"
          : "फक्त मराठी अक्षरांना परवानगी आहे !!!"
      ),
  });
};

export default HawkerTypeSchema;
