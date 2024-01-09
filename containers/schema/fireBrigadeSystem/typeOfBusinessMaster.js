import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
// let Schema = yup.object().shape({
//   typeOfBusiness: yup.string().required("Type Of Business is Required !!!"),
// });

// New
export let typeOfBusinessSchema = (language) => {
  console.log("language123", language);
  const baseSchema = yup.object({
    // other fields
    remark: yup
      .string()
      .required(<FormattedLabel id="enterRemarks" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),
  });

  if (language === "en") {
    return baseSchema.shape({
      typeOfBusiness: yup
        .string()
        .required(<FormattedLabel id="typeOfBusinessValidation" />)
        .matches(
          /^[A-Za-z@. \-\s]+$/,
          language == "en"
            ? "Must be only english characters"
            : "फक्त इंग्लिश शब्द "
        ),
    });
  } else if (language === "mr") {
    return baseSchema.shape({
      // For Marathi
      // typeOfBusinessMr,
      typeOfBusinessMr: yup
        .string()
        .required(<FormattedLabel id="typeOfBusinessValidationMr" />)
        .matches(
          /^[\u0900-\u097F]+/,
          "Must be only in marathi/ फक्त मराठी मध्ये"
        ),
    });
  } else {
    return baseSchema;
  }
};
