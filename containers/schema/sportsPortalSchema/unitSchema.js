import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
unit: yup.string().required(<FormattedLabel id="Vunit" />),
unitMr: yup.string().required(<FormattedLabel id="VunitMr" />),

});

export default Schema;
