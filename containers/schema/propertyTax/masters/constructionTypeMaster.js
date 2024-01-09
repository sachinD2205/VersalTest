import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  constructionTypeName: yup.string().required('This field is Required !!!'),
  constructionTypeNameMr: yup.string().required('This field is Required !!!'),
  // constructionTypeNamePrefix: yup
  //   .string()
  //   .required("This field is Required !!!"),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required('This field is Required !!!'),
})

export default Schema
