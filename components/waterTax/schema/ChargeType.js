import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let ChargeTypeSchema = (language) => {
  return yup.object().shape({
    // fromDate: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="fromDateValidation" />),
   
    chargeTypeNameEn: yup
      .string()
      .required(<FormattedLabel id="chargeTypeNameEnValidation" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      )
      .typeError(),

      chargeTypeNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="chargeTypeMrValidation" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द "
      ),
  });
};

// export default BusinessSubTypeSchema;
