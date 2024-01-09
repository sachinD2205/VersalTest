import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  zooName: yup.string().required("Zoo Name is Required !!!"),
  zone: yup.string().required("Zone is Required !!!"),
  ward: yup.string().required("Ward is Required !!!"),
  area: yup.string().required("Area is Required !!!"),
  zooAddress: yup.string().required("Zoo Address is Required"),
  zooAddressAreaInAcres: yup
    .string()
    .required("Zoo Area Space In Acres is Required"),
  zooApproved: yup.string().required("Zoo Approved/Recognized by is Required"),
  zooFamousFor: yup
    .string()
    .nullable()
    .required("Zoo Famous For(History Details) is Required"),
})

export default Schema
