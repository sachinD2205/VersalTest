import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  // courtTypeId
  // courtTypeId: yup.string().required(<FormattedLabel id="selectCourtType" />),

  courtTypeId: yup.string().required(<FormattedLabel id="selectCourtType" />),

  courtName: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="courtNameEn" />),

  // courtMr
  courtMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="courtNameMr" />),

  // area
  area: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="areaEn" />),

  // areaMr
  areaMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="courtNameMr" />),

  //landmark
  landmark: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="areaEn" />),

  // landmarkMr
  landmarkMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="landmarkMr" />),

  // city
  city: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="cityOrVillageEn" />),

  // cityMr
  cityMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="cityOrVillageMr" />),

  pinCode: yup
    .string()
    .matches(/^[1-9][0-9]{5}$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),
});

export default schema;
