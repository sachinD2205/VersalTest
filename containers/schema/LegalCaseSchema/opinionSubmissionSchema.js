import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  // clerkRemarkEn
  clerkRemarkEn: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      // /^[a-zA-Z0-9 ]*$/,
      // /^[a-zA-Z0-9,.\s@/:"]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterOpinion" />),

  // clerkRemarkMr
  clerkRemarkMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      // /^[\u0900-\u097F0-9\s]*$/,x
      // /^[ऀ-ॿ0-9\s,.@/]+$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?\']*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterOpinion" />),

  //   clerkRemarkEn

  // clerkRemarkEn: yup
  // .string()
  // .matches(
  //   /^[aA-zZ\s]*$/,
  //   'Must be only english characters / फक्त इंग्लिश शब्द ',
  // ).required(<FormattedLabel id="enterOpinion" />),

  // // clerkRemarkMr

  // clerkRemarkMr: yup
  // .string()
  // .matches(
  //   /^[\u0900-\u097F]*/,
  //   'Must be only marathi characters/ फक्त मराठी शब्द',
  // )
  // .required(<FormattedLabel id="enterOpinion" />),
});

export default schema;
