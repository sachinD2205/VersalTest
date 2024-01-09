import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  propertyType: yup.string().required('This field is Required !!!'),
  propertyTypeMr: yup.string().required('This field is Required !!!'),
  propertyTypePrefix: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
