import { useSelector } from 'react-redux'
import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  classificationCode: yup
    .string()
    .required('Book Classification Code Is Required !!!'),
  bookClassification: yup
    .string()
    .required('Book Classification is Required !!!'),
})

export default schema
