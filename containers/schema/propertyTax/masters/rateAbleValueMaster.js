import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  zoneCategory: yup.string().required('This field is Required !!!'),
  zone: yup.string().required('This field is Required !!!'),
  gat: yup.string().required('This field is Required !!!'),
  usageType: yup.string().required('This field is Required !!!'),
  usageSubType: yup.string().required('This field is Required !!!'),
  constructionType: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
