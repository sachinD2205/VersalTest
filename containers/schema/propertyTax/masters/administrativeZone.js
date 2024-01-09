import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  adZoneName: yup.string().required('Administrative Zone is Required !!!'),
  fromDate: yup.string().nullable().required('From Date is Required !!!'),
  // toDate: yup.string().nullable().required("To Date is Required !!!"),
  adZoneNo: yup.string().required('Zone No. is Required !!!'),
  adZoneName: yup.string().required('Administrative Zone is Required !!!'),
  adZoneNameMr: yup.string().required('Administrative Zone is Required !!!'),
  adZoneAddress: yup
    .string()
    .required('Administrative Address is Required !!!'),
})

export default Schema
