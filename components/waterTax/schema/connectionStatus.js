import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let ConnectionStatusSchema = (language) => {
  return yup.object().shape({
    // fromDate: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="fromDateValidation" />),
   
    connectionStatus: yup
      .string()
      .required(<FormattedLabel id="connectionStatusEnValidation" />)
      // .matches(
      //   /^[aA-zZ\s]+$/,
      //   language == "en"
      //     ? "Must be only english characters"
      //     : "फक्त इंग्लिश शब्द "
      // )
      .typeError(),

      connectionStatusMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="connectionStatusMrValidation" />)
      // .matches(
      //   /^[\u0900-\u097F]+/,
      //   language == "en"
      //     ? "Must be only marathi characters"
      //     : "फक्त मराठी शब्द "
      // ),
  });
};

// export default BusinessSubTypeSchema;
