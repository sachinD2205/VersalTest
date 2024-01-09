import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let saveAsDraftBachatGatRegSchema = yup.object().shape({
  bachatgatName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9\s]*$/,
    //   "Only characters and numbers are allowed in Bachat Gat Full Name."
    // )
    .max(50, <FormattedLabel id="bachatgatNameValidationLength" />)
    .nullable(),
  presidentFirstName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in President First Name."
    // )
    .max(50, <FormattedLabel id="presidentFirstNameValidationLength" />)
    .nullable(),
  presidentMiddleName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in President Middle Name."
    // )
    .max(50, <FormattedLabel id="presidentMiddleNameValidationLength" />)
    .nullable(),
  presidentLastName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in President Last Name."
    // )
    .max(50, <FormattedLabel id="presidentLastNameValidationLength" />)
    .nullable(),
  //   totalMembersCount: yup
  //     .number()
  //     .test('maxValue', <FormattedLabel id="totalMembersCountValidation" />, value => value <= 20)
  //     .typeError(<FormattedLabel id="totalMembersCountTypeValidation" />)
  //     .nullable(),
  //   totalMembersCount: yup.mixed().nullable(),
  //   totalMembersCount: yup
  //     .number()
  //     .test(
  //       "maxValue",
  //       <FormattedLabel id="totalMembersCountValidation" />,
  //       (value) => value <= 20
  //     )
  //     .required(<FormattedLabel id="totalMembersCountRequiredValidation" />)
  //     .typeError(<FormattedLabel id="totalMembersCountTypeValidation" />)
  //     .nullable(),
  applicantFirstName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant First Name."
    // )
    .max(50, <FormattedLabel id="applicantFirstNameValidtionLength" />)
    .nullable(),
  applicantMiddleName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant Middle Name."
    // )
    .max(50, <FormattedLabel id="applicantMiddleNameValidtionLength" />)
    .nullable(),
  applicantLastName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Applicant Last Name."
    // )
    .max(50, <FormattedLabel id="applicantLastNameValidtionLength" />)
    .nullable(),
  pinCode: yup
    .string()
    .matches(/^[0-9]*$/, "Only numbers are allowed in Pincode.")
    // .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />)
    .nullable(),
  mobileNo: yup
    .string()
    .matches(phoneRegex, "Phone number is not valid")
    .nullable(),
  emailId: yup
    .string()
    .max(80, <FormattedLabel id="emailIdValidtionLength" />)
    .nullable(),
  accountNo: yup
    .string()
    .matches(/^[0-9]*$/, "Only numbers are allowed in Account No.")
    // .min(6, <FormattedLabel id="applicantAccountNoValidationMinLength" />)
    .max(18, <FormattedLabel id="accountNoValidtionLength" />)
    .nullable(),
  // ifscCode: yup
  //   .string()
  //   .matches(/^[A-Za-z]{4}[0-9]{7}$/, "Invalid IFSC code")
  //   // .matches(
  //   //   /^[a-zA-Z0-9\s]*$/,
  //   //   "Only characters and numbers are allowed in IFSC Code."
  //   // )
  //   .min(11, <FormattedLabel id="ifscCodeValidationMinLength" />)
  //   .max(11, <FormattedLabel id="ifscCodeValidtionLength" />)
  //   .nullable(),
  // micrCode: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Only numbers are allowed in MICR Code.")
  //   //   .min(9, <FormattedLabel id="micrCodeValidtionMinLength" />)
  //   //   .max(9, <FormattedLabel id="micrCodeValidtionLength" />)
  //   .nullable(),
  // landlineNo: yup
  //   .string()
  //   .min(10, <FormattedLabel id="landlineNoValidtionMinLength" />)
  //   .max(10, <FormattedLabel id="landlineNoValidtionLength" />)
  //   .nullable(),
  bankAccountFullName: yup
    .string()
    // .matches(
    //   /^[a-zA-Z\s]*$/,
    //   "Only characters are allowed in Account Full Name."
    // )
    .max(500, <FormattedLabel id="bankAccountFullNameValidtionLength" />)
    .nullable(),
  branchName: yup
    .string()
    // .matches(/^[a-zA-Z\s]*$/, "Only characters are allowed in Branch Name.")
    .max(50, <FormattedLabel id="branchNameValidtionLength" />)
    .nullable(),
});

// saveAsDraftBachatGatRegSchema = saveAsDraftBachatGatRegSchema.test(
//   "maxTotalMembers",
//   "Total Members Count should not exceed 20.",
//   function (value) {
//     const totalMembersCount = value && value.totalMembersCount;
//     return totalMembersCount === undefined || totalMembersCount <= 20;
//   }
// );

export default saveAsDraftBachatGatRegSchema;
