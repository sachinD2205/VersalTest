import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";
// schema - validation
let mediaMasterSchema =  yup.object().shape({
    // media Name
    mediaName: yup
      .string()
      .required(<FormattedLabel id="mediaNameReq" />)
      // .matches(
      //   /^\S/,
      //   "Must be only english characters !!! / फक्त इंग्लिश अक्षरे असावीत !!!"
      // )
      .max(500, <FormattedLabel id="mediaNameLengthReq" />),

    // media name mr
    mediaNameMr: yup
      .string()
      .required(<FormattedLabel id="mediaNameMrReq" />)
      // .matches(
      //   /^[\u0900-\u097F0-9\s!@#$%^&*(),.?":{}|<>]+$/,
      //   "Must be only marathi characters / फक्त मराठी अक्षरे असावीत"
      // )
      .max(500, <FormattedLabel id="mediaNameMrLengthReq" />),
  });

export default mediaMasterSchema;
