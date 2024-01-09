import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  // reply: yup.string().required("This field is Required !!!"),
  reply: yup
    .string()
    .required(<FormattedLabel id='replyReq'/>)
    .max(1000, <FormattedLabel id='reqplyLimit'/>)
    ,
});

export default Schema;
