import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  propertySubTypePrefix: yup.string().required('This field is Required !!!'),
  propertyType: yup.string().required('This field is Required !!!'),
  propertySubTypeMr: yup.string().required('This field is Required !!!'),
  propertySubType: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
