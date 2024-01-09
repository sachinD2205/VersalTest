import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = yup.object().shape({
  // noticeRecivedFromAdvocatePerson

  //     // remark
  remark: yup
    .string()
    .required(<FormattedLabel id='noticeDetailsValidation' />)

    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[a-zA-Z0-9 .]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    ),

  // /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,
  // remarkMr

  remarkMr: yup
    .string()
    .required(<FormattedLabel id='remarkMr' />)
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[\u0900-\u097F0-9\s.]*$/,
      // /^(?!\s)[\u0900-\u097F0-9\s/.]*$/,
      // /^[ऀ-ॿ0-9\s,.@/]+$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    ),

  // // noticeDetailsMr
  // noticeDetailsMr: yup
  // .string()
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   // /^[A-Za-z.]*$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   /^[\u0900-\u097F0-9\s.]*$/,
  //   "Must be only marathi characters/ फक्त मराठी शब्द"
  // )
  // .required(<FormattedLabel id="caseDetailsValidation" />),

  // // advocateAddress
  // advocateAddress: yup
  // .string()
  // .matches(
  //   /^[A-Za-z0-9.,\s]*$/,

  //   "Must be only english characters / फक्त इंग्लिश शब्द "

  // )
  // .required(<FormattedLabel id="advocateAddressValidation" />),

  // // advocateAddressMr
  // advocateAddressMr: yup
  // .string()
  // .matches(
  //   // /^[A-Za-z0-9.,\s]*$/,
  //   // /^[\u0900-\u097F0-9a-zA-Z\s.,]+$/,
  //   /^[\u0900-\u097F\s.,\d]*$/,

  //   "Must be only marathi characters/ फक्त मराठी शब्द"

  // )
  // .required(<FormattedLabel id="advocateAddressValidation" />),
});
