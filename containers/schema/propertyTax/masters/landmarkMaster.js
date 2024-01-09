import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  administrativeZone: yup.string().required('This field is Required !!!'),
  circle: yup.string().required('This field is Required !!!'),
  gat: yup.string().required('This field is Required !!!'),
  landmark: yup.string().required('This field is Required !!!'),
  landmarkMr: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
