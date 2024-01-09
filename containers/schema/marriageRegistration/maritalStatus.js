import * as yup from 'yup'
import FormattedLabel from '../../reuseableComponents/FormattedLabel'

// schema - validation
let Schema = yup.object().shape({
  statusDetails: yup
    .string()
    .required(<FormattedLabel id="enterstatusName" />)
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    ),
    statusDetailsMar: yup
    .string()
    .required(<FormattedLabel id="enterstatusNameMr" />)
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
})

export default Schema
