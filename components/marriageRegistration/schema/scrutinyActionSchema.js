import * as yup from 'yup'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'


let scrutinyActionSchema = yup.object().shape({
    remark: yup.string().required(<FormattedLabel id="remarkModel" />),
})

export default scrutinyActionSchema;