import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // informerName: yup.string().required("Informer Name is Required !!!"),
  // informerLastName: yup.string().required("Informer Last Name is Required !!!"),
  // contactNumber: yup.string().required("Contact Number is Required !!!"),
  // occurancePlace: yup.string().required("Vardi Place is Required !!!"),
  // typeOfVardiId: yup.string().required("Vardi Place is Required !!!"),
  // landmark: yup.string().required("Landmark is Required !!!"),
  // city: yup.string().required("City is Required !!!"),
});

export default Schema;
