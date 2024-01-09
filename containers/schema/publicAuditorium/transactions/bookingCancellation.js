import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  auditoriumBookingNumber: yup
    .number()
    .required("Auditorium booking number is required")
    .typeError("Must be a number"),
  citizenReasonForCancellation: yup.string().required("Reason For Cancellation is Required !!!"),
  //   auditoriumId: yup.string().required("Please select auditorium !!!"),
  //   serviceId: yup.string().required("Please select service !!!"),
  //   organizationName: yup.string().required("Organization name is Required !!!"),
  //   title: yup.string().required("Title is Required !!!"),
  //   organizationOwnerFirstName: yup
  //     .string()
  //     .required("Organization Owner First Name is Required !!!"),
  //   organizationOwnerLastName: yup
  //     .string()
  //     .required("Organization Owner Last Name is Required !!!"),
  //   buildingName: yup.string().required("Building Name is Required !!!"),
  //   pincode: yup.string().required("Pin Code is Required !!!"),
  //   aadhaarNo: yup.string().required("Aadhaar number is Required !!!"),
  //   mobile: yup.string().required("Mobile number is Required !!!"),
  //   eventDetails: yup.string().required("Event details are Required !!!"),
  //   eventDate: yup.string().nullable().required("Event date is Required !!!"),
  //   eventTimeFrom: yup
  //     .string()
  //     .nullable()
  //     .required("Event time from is Required !!!"),
  //   eventTimeTo: yup
  //     .string()
  //     .nullable()
  //     .required("Event time to is  Required !!!"),
  //   depositAmount: yup.string().required("Deposit amount is Required !!!"),
  //   rentAmount: yup.string().required("Rent amount is Required !!!"),
  //   payRentAmount: yup.string().required("Pay Rent Amount is Required !!!"),
  //   extendedRentAmount: yup
  //     .string()
  //     .required("Extended Rent Amount is Required !!!"),
  //   emailAddress: yup
  //     .string()
  //     .email("Incorrect format")
  //     .required("Please enter an e-mail. "),
  //   bankAccountHolderName: yup
  //   .string()
  //   .required("Bank account holder name is Required !!!"),
  //   bankaAccountNo: yup
  //   .string()
  //   .required("Bank account number is Required !!!"),
  //   typeOfBankAccountId: yup
  //   .string()
  //   .required("Type of bank account is Required !!!"),
  //   bankNameId: yup
  //   .string()
  //   .required("Bank name is Required !!!"),
  //   ifscCode: yup
  //   .string()
  //   .required("IFSC code is Required !!!"),
});

export default Schema;
