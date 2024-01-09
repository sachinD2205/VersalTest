import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  amenity: yup.string().required('This field is Required !!!'),
  amenityMr: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
