
import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let rejectedCatSchema = yup.object().shape({


    rejectCatMr: yup
    .string()
    .required(<FormattedLabel id="rejectCatMrReq" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Rejected Category (Marathi)./नाकारलेली श्रेणीत (मराठी) फक्त वर्णांना परवानगी आहे."
    )
    .max(
      100,
      <FormattedLabel id="rejectedCatMrCharacterLengthValidation" />
    ),
    rejectCat: yup
    .string()
    .required(<FormattedLabel id="rejectCatReq" />)
    .matches(
      /^[a-zA-Z\s]+$/,
     "Only characters are allowed in Rejected Category./नाकारलेली श्रेणीत फक्त वर्णांना परवानगी आहे."
    )
    .max(50, 
      <FormattedLabel id="rejectedCatCharacterLengthValidation" />
      ),
});

export default rejectedCatSchema;