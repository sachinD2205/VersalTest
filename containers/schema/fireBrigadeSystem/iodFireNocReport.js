import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  applicantName: yup.string().required("applicantName is Required !!!"),
  applicantMiddleName: yup
    .string()
    .required("applicantMiddleName is Required !!!"),
  applicantLastName: yup.string().required("applicantLastName is Required !!!"),
  applicantNameMr: yup.string().required("applicantNameMr is Required !!!"),
  applicantMiddleNameMr: yup
    .string()
    .required("applicantMiddleNameMr is Required !!!"),
  applicantLastNameMr: yup
    .string()
    .required("applicantLastNameMr is Required !!!"),

  applicantAddress: yup.string().required("applicantAddress is Required !!!"),
  bussinessAddress: yup.string().required("bussinessAddress is Required !!!"),

  applicantAddressMr: yup
    .string()
    .required("applicantAddressMr is Required !!!"),
  bussinessAddressMr: yup
    .string()
    .required("bussinessAddressMr is Required !!!"),
  mobileNo: yup
    .string()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile number is not valid"
    )
    .required("Mobile number is required"), //dateOfApplication: yup.string().nullable().required("dateOfApplication is Required !!!"),
  // typeOfBussiness: yup.string().required("Type of bussiness is Required !!!"),
});

export default Schema;
