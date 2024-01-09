import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let bachatgatRegistration = yup.object().shape({
  areaKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),
  zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  // geoCode: yup.string().required("Geo Code is Required !!!"),
  // bachatgatName: yup.string().required("Bachat Gat is Required !!!"),
  bachatgatName: yup
    .string()
    .required(<FormattedLabel id="bachatgatNameValidation" />)
    // .matches(
    //   /^[a-zA-Z0-9\s]+$/,
    //   "Only characters and numbers are allowed in Bachat Gat Full Name."
    // )
    .max(50, <FormattedLabel id="bachatgatNameValidationLength" />),
  presidentFirstName: yup
    .string()
    .required(<FormattedLabel id="presidentFirstNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in President First Name."
    // )
    .max(50, <FormattedLabel id="presidentFirstNameValidationLength" />),
  presidentMiddleName: yup
    .string()
    .required(<FormattedLabel id="presidentMiddleNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in President Middle Name."
    // )
    .max(50, <FormattedLabel id="presidentMiddleNameValidationLength" />),
  presidentLastName: yup
    .string()
    .required(<FormattedLabel id="presidentLastNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in President Last Name."
    // )
    .max(50, <FormattedLabel id="presidentLastNameValidationLength" />),
  // totalMembersCount: yup
  //   .string()
  //   .required(<FormattedLabel id="totalMembersCountValidtion" />)
  //   .max(2, <FormattedLabel id="totalMembersCountValidtionLength" />),
  totalMembersCount: yup
    .number()
    .test(
      "maxValue",
      <FormattedLabel id="totalMembersCountValidation" />,
      (value) => value <= 20
    )
    .required(<FormattedLabel id="totalMembersCountRequiredValidation" />)
    .nullable()
    .typeError(<FormattedLabel id="totalMembersCountTypeValidation" />),
  applicantFirstName: yup
    .string()
    .required(<FormattedLabel id="applicantFirstNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant First Name."
    // )
    .max(50, <FormattedLabel id="applicantFirstNameValidtionLength" />),
  applicantMiddleName: yup
    .string()
    .required(<FormattedLabel id="applicantMiddleNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant Middle Name."
    // )
    .max(50, <FormattedLabel id="applicantMiddleNameValidtionLength" />),
  applicantLastName: yup
    .string()
    .required(<FormattedLabel id="applicantLastNameValidtion" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Applicant Last Name."
    // )
    .max(50, <FormattedLabel id="applicantLastNameValidtionLength" />),
  pinCode: yup
    .string()
    .required(<FormattedLabel id="pinCodeValidtion" />)
    // .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode.")
    .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />),
  flatBuldingNo: yup
    .string()
    .required(<FormattedLabel id="flatBuldingNoValidation" />),
  buildingName: yup
    .string()
    .required(<FormattedLabel id="buildingNameValidation" />),
  roadName: yup.string().required(<FormattedLabel id="roadNameValidation" />),
  landmark: yup.string().required(<FormattedLabel id="landmarkValidation" />),
  // geoCode: yup.string().required(<FormattedLabel id="geoCodeValidation" />),
  mobileNo: yup.string().required(<FormattedLabel id="mobileNoValidation" />),
  // .matches(phoneRegex, "Phone number is not valid"),
  emailId: yup
    .string()
    .required(<FormattedLabel id="emailIdValidation" />)
    .max(80, <FormattedLabel id="emailIdValidtionLength" />),
  startDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="startDateValidation" />),
  accountNo: yup
    .string()
    .required(<FormattedLabel id="accountNoValidation" />)
    // .matches(/^[0-9]+$/, "Only numbers are allowed in Account No.")
    // .min(6, <FormattedLabel id="applicantAccountNoValidationMinLength" />)
    .max(18, <FormattedLabel id="accountNoValidtionLength" />),
  ifscCode: yup
    .string()
    .matches(/^[A-Za-z]{4}[0-9]{7}$/, "Invalid IFSC code")
    .required(<FormattedLabel id="ifscCodeValidation" />)
    // .matches(
    //   /^[a-zA-Z0-9\s]+$/,
    //   "Only characters and numbers are allowed in IFSC Code."
    // )
    .min(11, <FormattedLabel id="ifscCodeValidationMinLength" />)
    .max(11, <FormattedLabel id="ifscCodeValidtionLength" />),
  micrCode: yup
    .string()
    // .required(<FormattedLabel id="micrCodeValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in MICR Code."),
    // .min(9, <FormattedLabel id="micrCodeValidtionMinLength" />)
    // .max(9, <FormattedLabel id="micrCodeValidtionLength" />),
  // landlineNo: yup
  // .string()
  // .min(10, <FormattedLabel id="landlineNoValidtionMinLength" />)
  // .max(10, <FormattedLabel id="landlineNoValidtionLength" />),
  bankAccountFullName: yup
    .string()
    .required(<FormattedLabel id="bankAccountFullNameValidation" />)
    // .matches(
    //   /^[a-zA-Z\s]+$/,
    //   "Only characters are allowed in Account Full Name."
    // )
    .max(500, <FormattedLabel id="bankAccountFullNameValidtionLength" />),
  branchName: yup
    .string()
    .required(<FormattedLabel id="branchNameValidation" />)
    // .matches(/^[a-zA-Z\s]+$/, "Only characters are allowed in Branch Name.")
    .max(50, <FormattedLabel id="branchNameValidtionLength" />),
  // uploadDocs: yup
  //   .mixed()
  //   .test("fileUploaded", "Image or document is required", function (value) {
  //     if (!value || value.length === 0) {
  //       return this.createError({
  //         message: "Image or document is required",
  //         path: "uploadDocs",
  //       });
  //     }
  //     return true;
  //   })
  //   .required("Image or document is required"),
  // renewalRemarks: yup
  //   .string()
  //   .max(500, "Renewal Remarks should not exceed 500 characters"),
  // saSanghatakRemark: yup
  //   .string()
  //   .max(500, "Samuha Sanghatak Remark should not exceed 500 characters"),
  // deptClerkRemark: yup
  //   .string()
  //   .max(500, "Department Clerk Remark should not exceed 500 characters"),
  // deptyCommissionerRemark: yup
  //   .string()
  //   .max(500, "Department Commissioner Remark should not exceed 500 characters"),
  // asstCommissionerRemark: yup
  //   .string()
  //   .max(500, "Asistance Commissioner Remark should not exceed 500 characters"),
});

export default bachatgatRegistration;
