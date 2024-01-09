import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  occupancy: yup.string().required('Administrative Zone is Required !!!'),
  occupancyMr: yup.string().required('Zone No. is Required !!!'),
  occupancyPrefix: yup.string().required('Administrative Zone is Required !!!'),
  fromDate: yup.string().nullable().required('From Date is Required !!!'),
  // toDate: yup.string().nullable().required("To Date is Required !!!"),
})

export default Schema
