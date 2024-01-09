import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  transferType: yup.string().required('This field is Required !!!'),
  transferTypeMr: yup.string().required('This field is Required !!!'),
  paymentMode: yup.string().required('This field is Required !!!'),
  paymentType: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
