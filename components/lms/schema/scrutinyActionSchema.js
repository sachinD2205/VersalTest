import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let scrutinyActionSchema = yup.object().shape({

    remark: yup
        .string()
        .matches(
            /^[A-Za-z0-9@-\s]+$/,
            'Must be only in english / फक्त इंग्लिश मध्ये ',
        )
        .required("Remark taaka"),
})