import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  groupingOfTaxName: yup.string().required('This field is Required !!!'),
  groupingOfTaxNameMr: yup.string().required('This field is Required !!!'),
  // taxName: yup.string().required("This field is Required !!!"),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
