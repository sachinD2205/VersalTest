import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let HousingTypeSchema = (language) => {
  return yup.object().shape({
    // fromDate: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="fromDateValidation" />),
   
      housingTypeName: yup
      .string()
      .required(<FormattedLabel id="housingTypeEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

      housingTypeNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="housingTypeMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
