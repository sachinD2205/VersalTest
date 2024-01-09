// import * as yup from "yup";
// import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// // schema - validation
// let applicantTypeMasterSchema = (language) => {
//   return yup.object().shape({
//     // applicantType
//     applicantType: yup
//       .string()
//       .required(<FormattedLabel id="applicantTypeReq" />)
//       .matches(/^\S/, "Must be only english characters / फक्त इंग्लिश शब्द ")
//       .max(
//         500,<FormattedLabel id='applicationTypeMax'/>
//       ),

//     // aplicantTypeMr
//     applicantTypeMr: yup
//       .string()
//       .required(<FormattedLabel id="applicantTypeMrReq" />)
//       // .matches(
//       //   /^[\u0900-\u097F0-9\s!@#$%^&*(),.?":{}|<>]+$/,
//       //   language == "en"
//       //     ? "English characters are not allowed in the description !!!"
//       //     : "इंग्रजी अक्षरे वर्णनात आवश्यक नाहीत !!!"
//       // )
//       .max(
//         500,<FormattedLabel id='applicantTypeMrMax'/>
//       ),
//   });
// };

// export default applicantTypeMasterSchema;

import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let applicantTypeMasterSchema = yup.object().shape({
  // applicantType
  applicantType: yup
    .string()
    .required(<FormattedLabel id="applicantTypeReq" />)
    .matches(/^\S/, "Must be only English characters or फक्त इंग्रजी शब्द")
    .max(500, <FormattedLabel id="applicationTypeMax" />),

  // aplicantTypeMr
  applicantTypeMr: yup
    .string()
    .required(<FormattedLabel id="applicantTypeMrReq" />)
    .max(500, <FormattedLabel id="applicantTypeMrMax" />),
});

export default applicantTypeMasterSchema;
