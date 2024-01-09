import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  percentage: yup
    .string()
    .required('This field is Required !!!')
    .matches(/^(0|[1-9]\d*)$/, 'Only numbers are allowed'),
  // .matches(
  //   /^(0|[1-9]\d*)(\.\d+)?$/,
  //   "Only numbers are allowed with decimal value"
  // ),

  financialYear: yup.string().required('This field is Required !!!'),
  rebateName: yup.string().required('This field is Required !!!'),
  rebateNameMr: yup.string().required('This field is Required !!!'),
  taxName: yup.string().required('This field is Required !!!'),
  usageType: yup.string().required('This field is Required !!!'),
  propertyType: yup.string().required('This field is Required !!!'),
  propertySubType: yup.string().required('This field is Required !!!'),
  noOfDays: yup.string().required('This field is Required !!!'),
  constraint: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
