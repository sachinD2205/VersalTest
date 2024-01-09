import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let purposeOfBuildingSchema = (language) => {
  const baseSchema = yup.object({
    // Other Feilds
  });

  if (language === "en") {
    return baseSchema.shape({
      buildingPurpose: yup
        .string()
        .required(<FormattedLabel id='buildingPurposeValidation' />)
        .matches(
          /^[A-Za-z@. \-\s]+$/,
          language == "en"
            ? "Must be only english characters"
            : "फक्त इंग्लिश शब्द "
        ),
    });
  } else if (language === "mr") {
    return baseSchema.shape({
      buildingPurposeMr: yup
        .string()
        .required(<FormattedLabel id='buildingPurposeValidationMr' />)
        .matches(
          /^[\u0900-\u097F]+/,
          language == "en"
            ? "Must be only marathi characters"
            : "फक्त मराठी शब्द"
        ),
    });
  } else {
    return baseSchema;
  }
};
