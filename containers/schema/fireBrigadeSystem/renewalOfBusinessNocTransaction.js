import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // businessSubTypePrefix: yup
  //   .string()
  //   .required("Business Sub Type Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // businessType: yup.string().required("Business Type is Required !!!"),
  // businessSubType: yup.string().required("Sub Type Business is Required !!!"),

  applicantName: yup.string().required("Applicant name is Required !!!"),
  applicantMiddleName: yup
    .string()
    .required("applicantMiddleName is Required !!!"),
  applicantLastName: yup.string().required("applicantLastName is Required !!!"),
  applicantNameMr: yup.string().required("Applicant name is Required !!!"),
  applicantMiddleNameMr: yup
    .string()
    .required("applicantMiddleNameMr is Required !!!"),
  applicantLastNameMr: yup
    .string()
    .required("applicantLastNameMr is Required !!!"),

  applicantAddress: yup.string().required("applicantAddress is Required !!!"),
  bussinessAddress: yup.string().required("Bussiness address is Required !!!"),
  mobileNo: yup
    .string()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile number is not valid"
    )
    .required("Mobile number is required"),
  applicantAddressMr: yup
    .string()
    .required("applicantAddressMr is Required !!!"),
  // bussinessAddressMr: yup.string().required("bussinessAddressMr is Required !!!"),
});

export default Schema;
