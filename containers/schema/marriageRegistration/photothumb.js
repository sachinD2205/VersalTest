import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  gphoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="ResideProof" />),
  bphoto: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="ResideProof" />),
});

export default Schema;
