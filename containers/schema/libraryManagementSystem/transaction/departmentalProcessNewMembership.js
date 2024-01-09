import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  membershipRegistrationNo: yup
    .string()
    .required("Membership Number is Required !!!"),
  firstName: yup.string().nullable().required("First Name is Required !!!"),
  middleName: yup.string().required("Middle Name is Required !!!"),
  surnameName: yup.string().required("Last Name is Required !!!"),
  studyCenterName: yup.string().required("Library Name is Required !!!"),
  gender: yup.string().required("Gender is Required !!!"),
  address: yup.string().required("Address is Required !!!"),
  pincode: yup.string().required("Pin Code is Required !!!"),
  contactDetails: yup.string().required("Contact Details is Required !!!"),
  emailId: yup.string().required("Email Id is Required !!!"),
  educationalRadioValue: yup.string().required("Education is Required !!!"),
  membershipPeriod: yup.string().required("Member Period is Required !!!"),
  additionalInformation: yup
    .string()
    .required("Add Information is Required !!!"),
  aadharCard: yup.string().required("Aadhar Card is Required !!!"),
  actionType: yup.string().required("Action Type is Required !!!"),
});

export default schema;
