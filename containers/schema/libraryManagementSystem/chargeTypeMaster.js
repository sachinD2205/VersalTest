import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  //libraryId: yup.string().required("Library Id is Required !!!"),
  libraryPrefix: yup
    .string()
    .nullable()
    .required('Library Prefix is Required !!!'),
  studyCenterName: yup.string().required('Study Center Name is Required !!!'),
  serviceName: yup.string().required('Service Name is Required !!!'),
  intake: yup.string().required('intake is Required !!!'),
  addressLocation: yup.string().required('Address Location is Required !!!'),
  gisId: yup.string().required('GIS Id is Required !!!'),
  contactNumber: yup.string().required('Contact Number is Required !!!'),
  contactPerson: yup.string().required('Contact Person is Required !!!'),
  radioValue: yup.string().required('Radio Value is Required !!!'),
  remark: yup.string().required('Remark is Required !!!'),
})

export default schema
