import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let schema = yup.object().shape({
  subSchemeKey:yup.string().nullable().required(<FormattedLabel id="subSchemeKeyValidation" />),
  mainSchemeKey: yup.string().nullable().required(<FormattedLabel id="mainSchemeKeyValidation" />),
  
  
  informationTitle: yup
    .string().nullable()
    .required(<FormattedLabel id="infoTitleRequired" />),
    // .matches(
    //   // /^[a-zA-Z\s]+$/,
    //   // /^[a-z\d\-_/.\s]+$/i,
    //   /^[a-zA-Z0-9\s\W]+$/,
    //   "Invalid Character."
    // ),
    // .max(50, <FormattedLabel id="infoTitleRequiredLength" />),
  informationTitleMr: yup
    .string()
    .required(<FormattedLabel id="infoTitleRequired" />),
    // .matches(
    //   // /^[a-z\d\-_/.\s\u0900-\u097F]+$/i,
    //   // "Special characters are not allowed in Information title (Marathi)."
    //   /^[a-zA-Z0-9\s\W\u0900-\u097F]+$/,
    //   "Invalid Character."
    // ),
    // .max(50, <FormattedLabel id="infoTitleRequiredLength" />),
  informationType: yup
    .string()
    .required(<FormattedLabel id="infoTypeRequired" />),
});

export default schema;
