import * as yup from 'yup'

// schema - validation
let schema = yup.object().shape({
  // paymentId: yup.string().required("Payment Id is Required !!!"),
  paymentType: yup.string().required('Payment Type is Required !!!'),

  remark: yup.string().required('Remark is Required !!!'),
})

export default schema
