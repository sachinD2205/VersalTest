import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  assetType: yup.string().required('This field is Required !!!'),
  assetName: yup.string().required('This field is Required !!!'),
  assetNameMr: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
