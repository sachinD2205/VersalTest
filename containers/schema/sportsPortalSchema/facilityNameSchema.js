import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  typeOfSports: yup.string().required(<FormattedLabel id="VtypeOfSports" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),

  facilityNameMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required(<FormattedLabel id="VfacilityNameMr" />),

  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),

  remark: yup.string().required(<FormattedLabel id="Vremark" />),
  remarkMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required(<FormattedLabel id="VremarkMr" />),
});

export default Schema;
