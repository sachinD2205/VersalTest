import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let BusinessSubTypeSchema = (language) => {
  return yup.object().shape({
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    fromDate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="fromDateValidation" />),
    businessTypeId: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="businessTypeValidation" />),
    businessSubType: yup
      .string()
      .required(<FormattedLabel id="businessSubTypeEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

    businessSubTypeMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="businessSubTypeMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
