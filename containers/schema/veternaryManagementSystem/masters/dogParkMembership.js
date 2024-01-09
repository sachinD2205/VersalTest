import * as yup from "yup"

// schema - validation
let Schema = yup.object().shape({
  nameOfMember: yup
    .string()
    .required("Name of Member/Name of Animal Owner is Required"),
  periodOfMembership: yup.string().required("Period of Membership is Required"),
  nameOfDogPark: yup.string().required("Name of Dog Park is required"),
  membershipAmount: yup.string().required("Membership Amount is Required"),
  countOfAnimals: yup.string().required("Count of Animals is Required"),
  addressOfTheAnimalsOwner: yup
    .string()
    .required("Address of the Animals Owner is Required"),
  zoneName: yup.string().required("Zone Name is Required"),
  wardName: yup.string().required("Ward Name is Required"),
  nameOfArea: yup.string().required("Name of Area is Required"),
  landmark: yup.string().required("Landmark is Required"),
  pincode: yup.string().required("Pincode is Required"),
  mobileNo: yup.string().required("Mobile No is Required"),
  mobileNo: yup.string().required("Mobile No is Required"),
  emailId: yup.string().required("Mobile No is Required"),
  visitorsFee: yup.string().required("Visitors Fee is Required"),
})

export default Schema
