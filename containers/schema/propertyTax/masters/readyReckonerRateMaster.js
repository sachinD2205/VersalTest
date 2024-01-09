import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  readyReckonerPrefix: yup.string().required('This field is Required !!!'),
  landmark: yup.string().required('This field is Required !!!'),
  rate: yup.string().required('This field is Required !!!'),
  typeOfArea: yup.string().required('This field is Required !!!'),
  subCircle: yup.string().required('This field is Required !!!'),
  landNumber: yup.string().required('This field is Required !!!'),

  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
