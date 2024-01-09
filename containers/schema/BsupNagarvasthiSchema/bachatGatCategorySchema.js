import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
export let schema = yup.object().shape({
  bgCategoryPrefix: yup
    .string()
    .required(<FormattedLabel id="bgCategoryPrefixValidation" />),
  // .matches(
  //   /^[a-zA-Z0-9]+$/,
  //   "Only characters and numbers are allowed in Bachat Gat Category Prefix."
  // ),
  // .max(15, <FormattedLabel id="bgCategoryPrefixLengthValidation" />),
  bgCategoryMr: yup
    .string()
    .required(<FormattedLabel id="bgCategoryMrValidation" />),
  // .matches(
  //   // /^[a-zA-Z\s\u0900-\u097F]+$/,
  //   // /^[a-z\d\-_/.\s\u0900-\ ]+$/i,
  //   // <FormattedLabel id="bgCategoryMrCharacterValidation" />
  //   // "Special characters are not allowed in Bachat Gat Category Name (Marathi)."
  //   /^[a-zA-Z0-9\s\W\u0900-\u097F]+$/,
  //   "Invalid Character."
  // ),
  // .max(
  //   100,
  //   <FormattedLabel id="bgCategoryMrCharacterLengthValidation" />
  // ),
  bgCategoryName: yup
    .string()
    .required(<FormattedLabel id="bgCategoryNameValidation" />),
  // .matches(
  //   // /^[a-zA-Z\s]+$/,
  //   // /^[a-z\d\-_/.\s]+$/i,
  //   // <FormattedLabel id="bgCategoryNameCharacterValidation" />
  //   // "Special characters are not allowed in Bachat Gat Category Name."
  //   /^[a-zA-Z0-9\s\W]+$/,
  //   "Invalid Character."
  // ),
  // .max(50,
  //   <FormattedLabel id="bgCategoryNameLengthValidation" />
  //   ),
});

// export default schema;
