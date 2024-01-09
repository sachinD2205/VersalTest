import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let PropertyStatusSchema = (language) => {
  return yup.object().shape({
    // fromDate: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="fromDateValidation" />),
   
    propertyStatus: yup
      .string()
      .required(<FormattedLabel id="propertyStatusEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

      propertyStatusMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="propertyStatusMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
