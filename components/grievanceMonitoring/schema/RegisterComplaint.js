import * as yup from "yup";
const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
// schema - validation
let schema = yup.object().shape({
  // businessSubTypePrefix: yup
  //   .string()
  //   .required("Business Sub Type Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // businessType: yup.string().required("Business Type is Required !!!"),
  // businessSubType: yup.string().required("Sub Type Business is Required !!!"),
  pincode: yup
  .string()
  .required("Pin Code is required")
  .matches(/^[0-9]+$/, "please enter number only")
  .min(6, 'Must be exactly 6 digits')
  .max(6, 'Must be exactly 6 digits'),
  email: yup.string().email().required("Email address required"),
  surname:yup.string().required("Last Name is required"),
  firstName:yup.string().required("First Name is required"),
  middleName:yup.string().required("Middle Name is required"),
  mobileNumber: yup
      .string()
      .required("Enter mobile number to proceed")
      .matches(phoneRegex, "Phone number is not valid"),
  city: yup.string().required("City is required"),
  complaintDescription: yup.string().required("Complaint Description is required"),
  subject: yup.string().required("Subject is required"),

  });


export default schema;
