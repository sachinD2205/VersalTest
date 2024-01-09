import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let Schema = yup.object().shape({
  // verificationRemark: yup
  //   .string()
  //   .required(<FormattedLabel id="VapplicantType" />),
  // verificationRemarkMr: yup
  //   .string()
  //   .required(<FormattedLabel id="VapplicantType" />),

  verificationRemark: yup
    .string()
    .typeError(<FormattedLabel id="VtotalGroupMember" />)
    .required(<FormattedLabel id="VapplicantType" />),

  verificationRemarkMr: yup
    .string()
    .typeError(<FormattedLabel id="VtotalGroupMember" />)
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .required(<FormattedLabel id="VapplicantMrType" />),
});
