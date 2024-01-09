import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ItemCategorySchema = (language) => {
  return yup.object().shape({
    // module
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    // fromDate
    fromDate: yup
      .date()
      .required(<FormattedLabel id="fromDateValidation" />)
      .typeError(<FormattedLabel id="fromDateValidation" />),
    // itemCategory
    itemCategory: yup
      .string()
      .required(<FormattedLabel id="itemCategoryValidationEn" />)
      .matches(
        /^[A-Za-z0-9 -]+$/,
        language == "en"
          ? "only english characters are allowed !!!"
          : "फक्त इंग्रजी वर्णांना परवानगी आहे !!!"
      ),
    // itemCategoryMr
    itemCategoryMr: yup
      .string()
      .required(<FormattedLabel id="itemCategoryValidationMr" />)
      .matches(
        /^[\u0900-\u097F0-9\s-]+$/,
        language == "en"
          ? "only marathi characters are allowed !!!"
          : "फक्त मराठी अक्षरांना परवानगी आहे !!!"
      ),
  });
};
export default ItemCategorySchema;
