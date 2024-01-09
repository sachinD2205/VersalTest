import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
// let Schema = yup.object().shape({
//   typeOfBusiness: yup.string().required("Type Of Business is Required !!!"),
// });

// New
export let externalServiceSchema = (language) => {
  console.log("language123", language);
  const baseSchema = yup.object({
    // other fields
  });

  if (language === "en") {
    return baseSchema.shape({
      externalServiceName: yup
        .string()
        .required(<FormattedLabel id="externalServiceNameValidationEn" />)
        .matches(
          // /^[A-Za-z0-9@. \/\\\:\"\,\-\s]+$/,
          /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&\/]*$/,

          language == "en"
            ? "Must be only english characters"
            : "फक्त इंग्लिश शब्द "
        ),
    });
  } else if (language === "mr") {
    return baseSchema.shape({
      // For Marathi
      // typeOfBusinessMr,
      externalServiceNameMr: yup
        .string()
        .required(<FormattedLabel id="externalServiceNameValidationMr" />)
        .matches(
          // /^[\u0900-\u097F]+/,
          /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`\/]*$/,

          "Must be only in marathi/ फक्त मराठी मध्ये"
        ),
    });
  } else {
    return baseSchema;
  }
};
