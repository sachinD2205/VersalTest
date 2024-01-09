import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let decisionSchema = yup.object().shape({
    decisionDetails: yup.string()
        .required(<FormattedLabel id="decisionReq"/>)
    .max(3000, <FormattedLabel id='decisionMaxLen' />),
    decisionStatus: yup.string()
    .required(<FormattedLabel id="decisionStatusReq"/>)
    .max(300, <FormattedLabel id='decisionStatussMaxLen' />),
    decisionRemarks:yup.string()
    .required(<FormattedLabel id="remarkReq"/>)
    .max(2000, <FormattedLabel id='remarkMaxLen' />),
});

export default decisionSchema;