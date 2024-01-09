import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // serviceName: yup.string().required('servic eName is Required !!!'),
  // durationFrom: yup
  //   .string()
  //   .nullable()
  //   .required('duration From is Required !!!'),
  // durationTo: yup.string().nullable().required('duration To is Required !!!'),
  // serviceCharges: yup.string().required('serviceCharges Name is Required !!!'),
  // delayCharges: yup.string().required('delayCharges Name is Required !!!'),
  // dependsOn: yup.string().required('dependsOn Name is Required !!!'),
  // typeOfCategory: yup.string().required('typeOfCategory Name is Required !!!'),
});

export default Schema;
