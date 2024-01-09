import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({



  caseMainType: yup.string().required(<FormattedLabel id="selectCaseType" />),


  subType: yup
    .string()
    .matches(
      // /^[a-zA-Z0-9 ]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

      'Must be only english characters / फक्त इंग्लिश शब्द ',
    )
    .required(<FormattedLabel id="subTypeEn" />),

    caseSubTypeMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,

      'Must be only marathi characters/ फक्त मराठी शब्द',
    )
    .required(<FormattedLabel id="subTypeMr" />),

});

export default schema;
