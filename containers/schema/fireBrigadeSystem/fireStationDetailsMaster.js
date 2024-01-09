import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let fireStationDetailSchema = (language) => {
  const baseSchema = yup.object({
    // For English Marathi Feild
    fireStationName: yup
      .string()
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),

    address: yup
      .string()
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),

    addressMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      ),

    fireStationNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en" ? "Must be only marathi characters" : "फक्त मराठी शब्द"
      ),

    // In Both Language
    gISID: yup
      .string()
      .required(<FormattedLabel id='gISIDValidation' />)
      .matches(/^[0-9]+$/, "must be number"),

    zone: yup
      .string()
      .required(<FormattedLabel id='zoneValidation' />)
      .typeError(<FormattedLabel id='zoneValidation' />),

    ward: yup
      .string()
      .required(<FormattedLabel id='wardValidation' />)
      .typeError(<FormattedLabel id='wardValidation' />),

    gisLocation: yup
      .string()
      .required(<FormattedLabel id='gISLocationValidation' />)
      .typeError(<FormattedLabel id='gISLocationValidation' />),
  });

  if (language === "en") {
    return baseSchema.shape({
      address: yup
        .string()
        .required(<FormattedLabel id='addressValidation' />)
        .matches(
          /^[A-Za-z@. \-\s]+$/,
          language == "en"
            ? "Must be only english characters"
            : "फक्त इंग्लिश शब्द "
        ),

      fireStationName: yup
        .string()
        .required(<FormattedLabel id='fireStationNameValidation' />)
        .matches(
          /^[A-Za-z@. \-\s]+$/,
          language == "en"
            ? "Must be only english characters"
            : "फक्त इंग्लिश शब्द "
        ),
    });
  } else if (language === "mr") {
    return baseSchema.shape({
      addressMr: yup
        .string()
        .required(<FormattedLabel id='addressMrValidation' />)
        .matches(
          /^[\u0900-\u097F]+/,
          language == "en"
            ? "Must be only marathi characters"
            : "फक्त मराठी शब्द"
        ),

      fireStationNameMr: yup
        .string()
        .required(<FormattedLabel id='fireStationNameMrValidation' />)
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
