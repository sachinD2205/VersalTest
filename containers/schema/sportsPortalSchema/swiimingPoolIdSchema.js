import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let BookingDetailSchema = yup.object().shape({
  zoneName: yup.string().required(<FormattedLabel id="selectZone" />),
  // wardName: yup.string().required(<FormattedLabel id="selectWard" />),
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),
  durationType: yup.string().required(<FormattedLabel id="VdurationType" />),
  // applicantType: yup.string().required(<FormattedLabel id="VapplicantType" />),
  type: yup
    .string()
    .typeError(<FormattedLabel id="VType" />)
    .required(<FormattedLabel id="VType" />),

  applicantType: yup.string().when(["type"], {
    is: (type) => type === "Concession",
    then: yup
      .string()
      .typeError(<FormattedLabel id="VapplicantType" />)
      .required(<FormattedLabel id="VapplicantType" />),
    otherwise: yup.string().nullable(),
  }),

  bookingTimeId: yup.string().required(<FormattedLabel id="VselectSlots" />),
  venue: yup.string().required(<FormattedLabel id="Vvenue" />),
  fromDate: yup
    .string()
    .typeError(<FormattedLabel id="VfromDate" />)
    .required(<FormattedLabel id="VfromDate" />),
  // toDate: yup.string().required(<FormattedLabel id="VtoDate" />),
});

export let PersonalDetailsSchema = yup.object().shape({
  title: yup.string().required(<FormattedLabel id="selectTitle" />),
  firstName: yup
    .string()
    .matches(
      /^[aA-zZ\s\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात "
    )
    .required(<FormattedLabel id="enterFName" />),
  middleName: yup
    .string()
    .matches(
      /^[aA-zZ\s\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात "
    )
    .required(<FormattedLabel id="enterMName" />),
  lastName: yup
    .string()
    .matches(
      /^[aA-zZ\s\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात "
    )
    .required(<FormattedLabel id="enterLName" />),
  gender: yup.string().required(<FormattedLabel id="selectGender" />),
  dateOfBirth: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),
  medicalIssuedDate: yup
    .date()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),
  // age: yup
  //   .number()
  //   .typeError()
  //   .min(18, "Age must be at least 18 year")
  //   .max(99, "Age not valid on above 18 year")
  //   .required(<FormattedLabel id="enterAge" />),
  aadharCardNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits /फक्त अंक असणे आवश्यक आहे")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, <FormattedLabel id="minNumber" />)
    .max(12, <FormattedLabel id="maxNumber" />)
    .required(),
  // mobileNo: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   .typeError(<FormattedLabel id="mobileNo" />)
  //   .min(10, "Mobile Number must be at least 10 number")
  //   .max(10, "Mobile Number not valid on above 10 number"),

  mobileNo: yup
    .string()
    .nullable()
    .matches(/^[6-9][0-9]+$/, "Enter Valid Mobile Number")
    .typeError(<FormattedLabel id="mobileNo" />)
    // .min(10, 'Mobile Number must be at least 10 number')
    .max(10, "Mobile Number not valid on above 10 number"),
  // .required(),
  emailAddress: yup
    .string()
    .email("Incorrect format")
    .required(<FormattedLabel id="enterEmailAddress" />),
  cAddress: yup.string().required(<FormattedLabel id="Vcaddres" />),
  cCityName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterCity" />),
  cState: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="state" />),
  cPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, <FormattedLabel id="minPin" />)
    .max(6, <FormattedLabel id="maxPin" />)
    .required(),
  // cLattitude: yup
  //   .number()
  //   .min(-90, "Latitude must be greater than or equal to -90")
  //   .max(90, "Latitude must be less than or equal to 90")
  //   .required("Latitude is required"),
  // cLongitude: yup
  //   .number()
  //   .min(-180, "Longitude must be greater than or equal to -180")
  //   .max(180, "Longitude must be less than or equal to 180")
  //   .required("Longitude is required"),
  pAddress: yup.string().required(<FormattedLabel id="Vcaddres" />),
  pCityName: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="enterCity" />),
  pState: yup
    .string()
    .matches(/^[A-Za-z0-9@-\s]+$/, "Must be only characters / फक्त शब्दात ")
    .required(<FormattedLabel id="state" />),
  pPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, <FormattedLabel id="minPin" />)
    .max(6, <FormattedLabel id="maxPin" />)
    .required(),
  pAddress: yup.string().required(<FormattedLabel id="Vpaddres" />),
  pStateMr: yup.string().required(<FormattedLabel id="state" />),
  pCityNameMr: yup.string().required(<FormattedLabel id="enterCity" />),
  pAddressMr: yup.string().required(<FormattedLabel id="Vpaddres" />),
  // pLattitude: yup
  //   .number()
  //   .min(-90, "Latitude must be greater than or equal to -90")
  //   .max(90, "Latitude must be less than or equal to 90")
  //   .required("Latitude is required"),
  // pLongitude: yup
  //   .number()
  //   .min(-180, "Longitude must be greater than or equal to -180")
  //   .max(180, "Longitude must be less than or equal to 180")
  //   .required("Longitude is required"),
});

export let AadharAuthenticationSchema = yup.object().shape({
  aadharCardNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits /फक्त अंक असणे आवश्यक आहे")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, <FormattedLabel id="minNumber" />)
    .max(12, <FormattedLabel id="maxNumber" />)
    .required(),
});

// export let EcsDetailsSchema = yup.object().shape({
//   bankName: yup.string().required(<FormattedLabel id="VbankName" />),
//   branchName: yup
//     .string()
//     .matches(
//       /^[aA-zZ\s\u0900-\u097F]+$/,
//       "Must be only characters / फक्त शब्दात "
//     )
//     .required(<FormattedLabel id="VbranchName" />),
//   bankAccountHolderName: yup
//     .string()
//     .matches(
//       /^[aA-zZ\s\u0900-\u097F]+$/,
//       "Must be only characters / फक्त शब्दात "
//     )
//     .required(<FormattedLabel id="VbankAccountHolderName" />),
//   // bankAccountNo: yup
//   //   .string()
//   //   .matches(/^[0-9]*$/, "Must be only digits /फक्त अंक असणे आवश्यक आहे")
//   //   .typeError(<FormattedLabel id="VbankAccountNo" />)
//   //   .max(17, "bank Account No not valid on above 17 number")
//   //   .required(),

//   confirmBankAccountNo: yup
//     .string()
//     .test(
//       "is-same-as-confirmation",
//       <FormattedLabel id="matchAccNo" />,
//       // "Account number and confirmation must match",
//       function (value) {
//         return value === this.parent.bankAccountNo;
//       }
//     )
//     // .required("Please confirm your account number"),
//     .required(<FormattedLabel id="confirmAccountMsg" />),

//   bankAccountNo: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
//     .length(15, "Bank account number must be exactly 15 digits")
//     .required("Please Enter your account number"),
//   ifscCode: yup
//     .string()
//     .matches(/^([A-Za-z]{4})(\d{7})$/, "Invalid IFSC code /अवैध IFSC कोड")
//     .uppercase()
//     .required(<FormattedLabel id="VifscCode" />),
//   bankAddress: yup.string().required(<FormattedLabel id="VbankAddress" />),
// });

export let EcsDetailsSchema = yup.object().shape({
  bankName: yup

    .string()
    .nullable()
    .typeError(<FormattedLabel id="VbankName" />)
    .required(<FormattedLabel id="VbankName" />),

  branchName: yup
    .string()
    .matches(
      /^[aA-zZ\s\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात "
    )
    .required(<FormattedLabel id="VbranchName" />),
  bankAccountHolderName: yup
    .string()
    .matches(
      /^[aA-zZ\s\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात "
    )
    .required(<FormattedLabel id="VbankAccountHolderName" />),
  // bankAccountNo: yup
  //   .string()
  //   .matches(/^[0-9]*$/, "Must be only digits /फक्त अंक असणे आवश्यक आहे")
  //   .typeError(<FormattedLabel id="VbankAccountNo" />)
  //   .max(17, "bank Account No not valid on above 17 number")
  //   .required(),

  confirmBankAccountNo: yup
    .string()
    .test(
      "is-same-as-confirmation",
      <FormattedLabel id="matchAccNo" />,
      // "Account number and confirmation must match",
      function (value) {
        return value === this.parent.bankAccountNo;
      }
    )
    // .required("Please confirm your account number"),
    .required(<FormattedLabel id="confirmAccountMsg" />),

  bankAccountNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .length(15, <FormattedLabel id="bankNoMsg" />)

    .required(<FormattedLabel id="VbankAccountNo" />),
  ifscCode: yup
    .string()
    .matches(/^([A-Za-z]{4})(\d{7})$/, "Invalid IFSC code /अवैध IFSC कोड")
    .uppercase()
    .required(<FormattedLabel id="VifscCode" />),
  bankAddress: yup.string().required(<FormattedLabel id="VbankAddress" />),
});

export let documentsUpload = yup.object().shape({
  // aadharCard: yup
  //   .string()
  //   .typeError(<FormattedLabel id="VaadharCard" />)
  //   .required(<FormattedLabel id="VaadharCard" />),
  // idCard: yup
  //   .string()
  //   .typeError(<FormattedLabel id="Vphoto" />)
  //   .required(<FormattedLabel id="Vphoto" />),
  // medicalCertificate: yup
  //   .string()
  //   .typeError(<FormattedLabel id="Vmedical" />)
  //   .required(<FormattedLabel id="Vmedical" />),
});
