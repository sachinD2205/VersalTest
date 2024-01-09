import * as yup from "yup";

// schema - validation for student admission form
let updateStudentForm = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  academicYearKey: yup.string().required("Academic Year Required"),
  classKey: yup.string().required("Class Name Required"),
  firstNameMr: yup
    .string()
    .required("Student First Name Required (In Marathi)"),
  middleNameMr: yup
    .string()
    .required("Student Middle Name Required (In Marathi)"),
  motherNameMr: yup.string().required("Mother Name (In Marathi) Required"),
  motherMiddleName: yup.string().required("Mother Middle Name Required"),
  motherLastName: yup.string().required("Mother Last Name Required"),

  lastNameMr: yup.string().required("Student Last Name Required (In Marathi)"),
  fatherFirstName: yup.string().required("Father First Name Required"),
  fatherMiddleName: yup.string().required("Father Middle Name Required"),
  fatherLastName: yup.string().required("father Last Name Required"),

  motherName: yup.string().required("Mother Name Required"),
  religionKey: yup.string().required("Select Your Religion"),
  casteKey: yup.string().required("Select your Caste Name"),
  subCastKey: yup.string().required("Select your SubCaste Name"),

  citizenshipName: yup.string().required("Enter your Citizen Name"),
  motherTongueName: yup.string().required("Enter your MotherTongue Name"),

  familyPermanentAddress: yup
    .string()
    .required("Enter your Family Permanent Address"),
  parentFullName: yup.string().required("Enter your Parent Fullname"),
  parentAddress: yup.string().required("Enter your Parent Address"),
  fatherQualification: yup
    .string()
    .required("Required ! Write NA if not applicable"),
  fatherOccupation: yup
    .string()
    .required("Required ! Write NA if not applicable"),
  fatherIncome: yup.string().required("Required ! Write NA if not applicable"),
  motherQualification: yup
    .string()
    .required("Required ! Write NA if not applicable"),
  motherOccupation: yup
    .string()
    .required("Required ! Write NA if not applicable"),

  motherIncome: yup.string().required("Required ! Write NA if not applicable"),
  colonyName: yup.string().required("Enter your Area/Colony Name"),
  parentDistrictName: yup.string().required("Enter your Parent District Name"),
  parentStateName: yup.string().required("Enter your Parent State Name"),
  // Bank Ac Details
  accountNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter your account number"),
  confirmBankAcNumber: yup
    .string()
    .test(
      "is-same-as-confirmation",
      "Account number and confirmation must match",
      function (value) {
        return value === this.parent.accountNo;
      }
    )
    .required("Please confirm your account number"),

  accountHolderName: yup.string().required("Enter Account Holder Name"),
  bankName: yup.string().required("Enter Bank Name"),
  ifscCode: yup.string().required("Enter Bank IFSC Code"),
  bankAdderess: yup.string().required("Enter Bank Address"),

  parentEmailId: yup
    .string()
    .email("Incorrect format")
    .required("Enter Parent EmailID"),
  fatherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Father Mobile Number"),
  motherContactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mother Mobile Number"),
  parentPincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required("Enter your Parent Pincode"),
  relationWithAccountantHolder: yup
    .string()
    .required("Account Holder Must be selected!"),
  otherRelationWithAccountantHolder: yup
    .string()
    .nullable()
    .when("relationWithAccountantHolder", {
      is: "other",
      then: yup.string().required("Account Holder Must be selected!"),
    }),

  saralId: yup.string().nullable(),
  schoolMedium: yup.string().required("School medium is required!"),
});

export default updateStudentForm;
