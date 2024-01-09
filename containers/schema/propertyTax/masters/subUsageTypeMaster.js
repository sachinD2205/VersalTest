import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  subUsePrefix: yup.string().required('This field is Required !!!'),
  usageType: yup.string().required('This field is Required !!!'),
  subUsageTypeMr: yup.string().required('This field is Required !!!'),
  subUsageType: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
