import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let BusinessTypeSchema = (language) => {
  return yup.object().shape({
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    fromDate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="fromDateValidation" />),

    businessType: yup
      .string()
      .required(<FormattedLabel id="businessTypeEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

    businessTypeMr: yup
      .string()
      .required(<FormattedLabel id="businessTypeMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
