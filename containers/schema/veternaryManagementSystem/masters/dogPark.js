import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  // nameOfDogPark: yup
  //   .string()
  //   .required("Name of Dog Park is Required !!!"),
  //   zone: yup.string().required("Zone is Required !!!"),
  //   ward: yup.string().required("Ward is Required !!!"),
  //   area: yup.string().required("Area is Required !!!"),
  //   dogParkAddress:yup.string().required("Dog Park Address is Required"),
  //   dogParkAreaSpaceInAcres:yup.string().required("Dog Park Area Space In Acres is Required"),
  //   dogParkApproved:yup.string().required("Dog Park Approved/Recognized by is Required"),
  //   dogParkFamousFor:yup.string().required("Dog Park Famous For(History Details) is Required"),
  //   nameOfEmployee:yup.string().required("Name of Employee is Required"),
  //   designation:yup.string().required("Designation is Required"),
})

export default Schema
