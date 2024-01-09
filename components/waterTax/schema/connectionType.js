import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let ConnectionTypeSchema = (language) => {
  return yup.object().shape({
    // fromDate: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="fromDateValidation" />),
   
    connectionType: yup
      .string()
      .required(<FormattedLabel id="connectionTypeNameEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

      connectionTypeNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="connectionTypeNameMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
