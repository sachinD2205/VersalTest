import * as yup from "yup";

const witnessFieldSchema = {
  // quantity: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError("Invalid Quantity")
  //   .min(0, "Quantity must be at least 0 number")
  //   .max(100, "Quantity is not valid on above 100 number")
  //   .required(),
};

// schema - validation
let Schema = yup.object().shape({
  // auditoriumId: yup.string().required("Please select auditorium !!!"),
  // serviceId: yup.string().required("Please select service !!!"),
  // organizationName: yup.string().required("Department name is Required !!!"),
  eventTitle: yup
    .string()
    .required("Event title is required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters and numbers"),
  flatBuildingNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(1, "Flat building number must be at least 1 number")
    .max(6, "Flat building number is not valid on above 6 number")
    .required("Flat building number is required !!!"),
  title: yup.string().required("Title is required !!!"),
  organizationOwnerFirstName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Organization owner first name only contain letters"
    )
    .required("Organization owner first name is required !!!"),
  organizationOwnerLastName: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Organization owner last name only contain letters"
    )
    .required("Organization owner last name is required !!!"),
  buildingName: yup
    .string()
    .required("Building name is required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters and numbers"),
  pinCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(6, "Pin code number must be at least 6 number")
    .max(6, "Pin code number is not valid on above 6 number")
    .required("Pin code is required !!!"),
  aadhaarNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(12, "Aadhaar number must be at least 12 number")
    .max(12, "Aadhaar number is not valid on above 12 number")
    .required("Aadhaar number is required !!!"),
  landlineNo: yup
    .string()
    .matches(/^[0-9]{6,15}$/, "Enter a valid landline number")
    .typeError("Invalid quantity")
    .min(9, "Landline number must be at least 9 number")
    .max(11, "Landline number is not valid on above 11 number")
    .required("Landline number is required !!!"),
  gstNo: yup
    .string()
    .matches(/^[0-9A-Z]{15}$/, "Enter a valid GST number")
    .min(15, "GST number must be at least 15")
    .max(15, "GST number is not valid on above 15 number")
    .notRequired(),
  // mobile: yup
  // .string()
  // .matches(/^[0-9]+$/, "Must be only digits")
  // .typeError("Invalid Quantity")
  // .min(10, "Mobile number must be at least 10 number")
  // .max(10, "Mobile number is not valid on above 10 number")
  // .required("Mobile number is Required !!!"),
  mobile: yup
    .string()
    .required("Mobile number is required !!!")
    .matches(/^[6-9][0-9]+$/, "Enter valid mobile number")
    .typeError("Invalid quantity")
    .min(10, "Mobile number must be at least 10 number")
    .max(10, "Mobile number not valid on above 10 number"),
  eventDetails: yup
    .string()
    .required("Event details are required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters and numbers"),
  // eventDate: yup.string().nullable().required("Event date is Required !!!"),
  // eventTimeFrom: yup
  //   .string()
  //   .nullable()
  //   .required("Event time from is Required !!!"),
  // eventTimeTo: yup
  //   .string()
  //   .nullable()
  //   .required("Event time to is  Required !!!"),
  // depositAmount: yup.string().required("Deposit amount is Required !!!"),
  // rentAmount: yup.string().required("Rent amount is Required !!!"),
  // payRentAmount: yup.string().required("Pay Rent Amount is Required !!!"),
  // extendedRentAmount: yup
  //   .string()
  //   .required("Extended Rent Amount is Required !!!"),
  emailAddress: yup
    .string()
    .email("Invalid email format")
    .required("Please enter an e-mail. "),
  relationWithOrganization: yup
    .string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Relation with organization must only contain letters"
    )
    .required("Relation with organization is required !!!"),
  bankAccountHolderName: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Bank account holder name only contain letters")
    .required("Bank account holder name is required !!!"),
  bankaAccountNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(8, "Bank account number must be at least 8 number")
    .max(12, "Bank account number is not valid on above 12 number")
    .required("Bank account number is required !!!"),
  confirmBankAccountNo: yup
    .string()
    .test(
      "is-same-as-confirmation",
      "Account number and confirmation must match",
      function (value) {
        return value === this.parent.bankaAccountNo;
      }
    )
    .required("Please confirm your account number"),
  typeOfBankAccount: yup
    .string()
    .required("Type of bank account is required !!!"),
  bankNameId: yup.string().required("Bank name is required !!!"),
  ifscCode: yup
    .string()
    .required("IFSC code is required")
    .matches(
      /^([A-Z]{4}0[a-zA-Z0-9]{6})$/,
      "Enter a valid IFSC code, First 4 letters must be capital, 5th letter must be zero and remaining may be number or characters"
    )
    .typeError("Invalid IFSC code"),
  micrCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(9, "MICR code number must be at least 9 number")
    .max(9, "MICR code number is not valid on above 9 number")
    .required("MICR code number is required !!!"),

  // levelsOfRolesDaoList: yup.array().of(yup.object().shape(witnessFieldSchema)),
  ///////////////////////////////////////////////////////////////

  applicantName: yup.string().when("loggedInUserCFC", {
    is: true,
    then: yup
      .string()
      .required("Applicant name is required !!!")
      .matches(/^[a-zA-Z\s]+$/, "Applicant name must only contain letters"),
  }),
  applicantMobileNo: yup.string().when("loggedInUserCFC", {
    is: true,
    then: yup
      .string()
      .required("Applicant mobile number is required !!!")
      .matches(/^[6-9][0-9]+$/, "Enter valid mobile number")
      .typeError("Invalid quantity")
      .min(10, "Applicant mobile number must be at least 10 number")
      .max(10, "Applicant mobile number not valid on above 10 number"),
  }),
  applicantConfirmMobileNo: yup
    .string()
    .test(
      "is-same-as-confirmation",
      "Applicant mobile number must match",
      function (value) {
        return value === this.parent.applicantMobileNo;
      }
    )
    .required("Please confirm applicant mobile number"),

  applicantEmail: yup.string().when("loggedInUserCFC", {
    is: true,
    then: yup
      .string()
      .email("Invalid email format")
      .required("Please enter applicanr e-mail. "),
  }),
  applicantConfirmEmail: yup
    .string()
    .test(
      "is-same-as-confirmation",
      "Applicant e-mail must match",
      function (value) {
        return value === this.parent.applicantEmail;
      }
    )
    .required("Please confirm applicant e-mail"),
  applicantFlatHouseNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(1, "Applicant flat building number must be at least 1 number")
    .max(6, "Applicant flat building number is not valid on above 6 number")
    .required("Applicant flat building number is required !!!"),
  applicantFlatBuildingName: yup
    .string()
    .required("Applicant building name is required !!!")
    .matches(/^[a-zA-Z0-9\s]+$/, "Must be only characters and numbers"),
  applicantPinCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Invalid quantity")
    .min(6, "Applicant pin code number must be at least 6 number")
    .max(6, "Applicant pin code number is not valid on above 6 number")
    .required("Applicant pin code is required !!!"),
});

export default Schema;
