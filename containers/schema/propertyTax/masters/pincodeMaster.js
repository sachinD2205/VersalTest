import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  pinCode: yup.string().required('This field is required!!!'),

  pinCodePrefix: yup.string().required('This field is required !!!'),
  fromDate: yup.string().nullable().required('This field is required !!!'),
  // toDate: yup.string().nullable().required("This field is required !!!"),
})

export default Schema
