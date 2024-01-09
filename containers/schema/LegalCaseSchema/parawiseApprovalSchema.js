import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = yup.object().shape({
  remark: yup
    .string()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="noticeDetailsValidation" />),

  remarkMr: yup
    .string()
    .matches(
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="remarkMr" />),
});
