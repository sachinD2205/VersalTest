// import * as yup from "yup";
// import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// // schema - validation
// let schema = yup.object().shape({

//   caseMainType: yup
//     .string()
// .matches(
//   // /^[aA-zZ\s]+$/,
//   /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

//   'Must be only english characters / फक्त इंग्लिश शब्द ',
// )
//     .required(<FormattedLabel id="caseTypeEn" />),

//     caseMainTypeMr: yup
//     .string()
// .matches(
//   // /^[\u0900-\u097F\s]*$/,
//   /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,

//   'Must be only marathi characters/ फक्त मराठी शब्द',
// )
//     .required(<FormattedLabel id="caseTypeMr" />),

// });

// export default schema;

// import * as yup from "yup";

// const validationSchema = (language) => {
//   const schema = yup.object();

//   if (language === "en") {
//     schema.shape({
//       caseMainType: yup
//         .string()

//         .required("English case type is required.")
//         .matches(
//           /^[A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,
//           "Must be only English characters."
//         ),
//     });
//   } else {
//     schema.shape({
//       caseMainTypeMr: yup
//         .string()
//         .required()
//         .matches(
//           /^[ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
//           "Must be only Marathi characters......"
//         ),
//     });
//   }

//   return schema;
// };

// export default validationSchema;
