import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  fromDate: yup.string().nullable().required('This field is Required !!!'),
  // toDate: yup.string().nullable().required('This field is Required !!!'),
  circleNo: yup.string().required('This field is Required !!!'),
  circleName: yup.string().required('This field is Required !!!'),
  gisId: yup.string().required('This field is Required !!!'),
  // email: yup.string().required('This field is Required !!!'),
  // telephone: yup.string().required('This field is Required !!!'),
  // mobileNo: yup.string().required('This field is Required !!!'),
  circleAddress: yup.string().required('This field is Required !!!'),
  // zoneCategory: yup.string().required('This field is Required !!!'),
  // circleNameMr: yup.string().required('This field is Required !!!'),
  // administrativeZone: yup.string().required('This field is Required !!!'),
  // circlePhoto: yup.string().required("This field is Required !!!"),
  // geoLocation: yup.string().required("This field is Required !!!"),
  // employeeId: yup.string().required('This field is Required !!!'),
})

export default Schema
