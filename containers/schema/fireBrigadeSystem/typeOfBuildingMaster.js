import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let typeOfBuildingShema = (language) => {
  return yup.object().shape({
    typeOfBuilding: yup
      .string()
      .required(<FormattedLabel id='typeOfBuildingValidation' />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),

    typeOfBuildingMr: yup
      .string()
      .required(<FormattedLabel id='typeOfBuildingMrValidation' />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये"
      ),
  });
};
