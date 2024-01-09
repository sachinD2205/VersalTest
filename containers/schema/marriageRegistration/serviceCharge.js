import * as yup from 'yup'
import FormattedLabel from '../../reuseableComponents/FormattedLabel'

// schema - validation
let Schema = yup.object().shape({
    serviceId:yup.number().typeError(<FormattedLabel id="enterServiceId" />).required(<FormattedLabel id="enterServiceId" />),
    chargeName: yup
    .string()
    .required(<FormattedLabel id="enterChargeName" />)
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    ),
    chargeNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये')
    .required(<FormattedLabel id="enterChargeNameMr" />),
    chargeType: yup
    .string()
    .required(<FormattedLabel id="enterChargeType" />)
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      'Must be only in english / फक्त इंग्लिश मध्ये ',
    ),
    chargeTypeMr: yup
    .string()
    .required(<FormattedLabel id="enterChargeTypeMr" />)
    .matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये'),
    durationFrom:yup.number().typeError(<FormattedLabel id="enterdurationForm" />).required(<FormattedLabel id="enterdurationForm" />),
    durationTo:yup.number().typeError(<FormattedLabel id="enterdurationTo" />).required(<FormattedLabel id="enterdurationTo" />),
    amount:yup.number().typeError(<FormattedLabel id="enterAmount" />).required(<FormattedLabel id="enterAmount" />),
})

export default Schema
