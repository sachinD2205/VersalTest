import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let rejectedCatSchema = yup.object().shape({
  forBachatGatorScheme:yup.string().required(<FormattedLabel id="isForBachatOrSchemeReq" />),
  categoryType:yup.string().required(<FormattedLabel id="categoryTypeReq" />),
  rejectCatMr: yup.string().required(<FormattedLabel id="rejectCatMrReq" />),
  // .matches(
  //   // /^[a-zA-Z\s\u0900-\u097F]+$/,
  //   // /^[a-z\d\-_/.\s\u0900-\u097F]+$/i,
  //   /^[a-zA-Z0-9\s\W\u0900-\u097F]+$/,
  //   <FormattedLabel id="rejectedCatMrCharacterValidation" />
  // ),
  // .max(
  //   100,
  //   <FormattedLabel id="rejectedCatMrCharacterLengthValidation" />
  // ),
  rejectCat: yup.string().required(<FormattedLabel id="rejectCatReq" />),
  // .matches(
  //   // /^[a-zA-Z\s]+$/,
  //   // /^[a-z\d\-_/.\s]+$/i,
  //   /^[a-zA-Z0-9\s\W]+$/,
  //   <FormattedLabel id="rejectedCatCharacterValidation" />
  // )
  // .max(50,
  //   <FormattedLabel id="rejectedCatCharacterLengthValidation" />
  //   ),
});

export default rejectedCatSchema;
