import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  taxName: yup.string().required('This field is Required !!!'),
  taxNameMr: yup.string().required('This field is Required !!!'),
  typeOfTax: yup.string().required('This field is Required !!!'),
  applicabilityOn: yup.string().required('This field is Required !!!'),
  propertyArea: yup.string().required('This field is Required !!!'),
  priorityOfCollectionOrder: yup
    .string()
    .required('This field is Required !!!'),
  priorityOfBillDisplay: yup.string().required('This field is Required !!!'),
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required("This field is Required !!!"),
})

export default Schema
