import * as yup from 'yup'

// schema - validation
let Schema = yup.object().shape({
  fromDate: yup.string().nullable().required('From Date is Required !!!'),
  // toDate: yup.string().nullable().required('To Date is Required !!!'),
  circleName: yup.string().required('circle Name is Required !!!'),
  circleNo: yup.string().required('circle No. is Required !!!'),
  gatNo: yup.string().required('gat No. is Required !!!'),
  gatName: yup.string().required('Gat Name is Required !!!'),
  rate: yup.number(),
  // rate: yup.string().required('Rate is Required !!!'),
  // address: yup.string().required("Address is Required !!"),
  // employeeDetails: yup.string().required("Employee Details is Required !!!"),
  // plotNo: yup.string().required('This field is Required !!!'),
  // checkBox: yup.string().when("$exist", {
  //   is: (exist) => exist,
  //   then: yup.string().required(),
  //   serveyNo: yup.string().required("This field is Required !!!"),
  //   blockNo: yup.string().required("This field is Required !!!"),
  //   cTSNo: yup.string().required("This field is Required !!!"),
  //   sectorNo: yup.string().required("This field is Required !!!"),
  // }),

  // serveyNo: yup.string().when("$serveyNo", {
  //   is: (serveyNo) => serveyNo,
  //   then: yup.string().required("This field is Required !!!"),
  //   otherwise: yup.string(),
  // }),
  // serveyNo: yup.string().required("This field is Required !!!"),
  // blockNo: yup.string().required("This field is Required !!!"),
  // cTSNo: yup.string().required("This field is Required !!!"),
  // sectorNo: yup.string().required("This field is Required !!!"),
  // pincode: yup.string().required("This field is Required !!!"),
  // checkboxOptions: yup.string().required("This field is Required !!!"),
})

export default Schema
