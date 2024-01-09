import * as yup from "yup";

// new admission schema
export let itiTraineeAdmissionSchema = yup.object().shape({
  itiAllocatedKey: yup.string().required("ITI Name is required"),
  itiTradeKey: yup.string().required("ITI Trade is required"),
  academicYearKey: yup.string().required("Academic Year is required"),
  traineeFirstName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Trainee First Name is required"),
  traineeMiddleName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Trainee Middle Name Required"),
  traineeLastName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Trainee Last Name Required"),
  fatherFirstName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father First Name Required"),
  fatherMiddleName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father Middle Name Required"),
  fatherLastName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Father Last Name Required"),
  motherFirstName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Mother First Name Required"),
  gender: yup.string().required("Please Select a Gender"),
  traineeMobileNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Mobile Number"),
  traineeEmailId: yup
    .string()
    .email("Incorrect Format")
    .required("Enter Your Email Id"),
  traineeAadharNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(12, "Aadhar Number Must be 12 number")
    .max(12, "Aadhar Number not valid on above 12 number")
    .required("Enter your aadhar number"),
  // other details
  religionKey: yup.string().required("Please select your religion"),
  casteCategoryKey: yup.string().required("Please select your caste category"),
  casteKey: yup.string().required("Please select your caste"),
  citizenshipName: yup.string().required("Please select your Nationality"),
  motherTongueName: yup.string().required("Please select your mother tongue"),
  address: yup.string().required("Please enter your address"),
  locatedAt: yup.string().required("Please select you're located on"),
  area: yup.string().required("Please enter your area name"),
  stateKey: yup.string().required("Please select your state name"),
  districtName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Please enter your district name"),
  pincode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Pincode must be 6 number")
    .max(6, "Pincode must not valid on 6 number")
    .required("Enter your pincode"),

  traineeDateOfBirth: yup
    .string()
    .required("Enter your birth date")
    .test("traineeDateOfBirth", "Must be 15 years or older", function (value) {
      const currentDate = new Date();
      const selectedDate = new Date(value);
      const diffInYears =
        currentDate.getFullYear() - selectedDate.getFullYear();

      return diffInYears >= 15;
    }),

  traineeBirthPlace: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Enter your birth place"),
  allotmentCategory: yup.string().required("Select your category"),
  allotmentRound: yup
    .string()
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter your allotement number"),
  preferenceNumber: yup.string().required("Preference Number is required"),
  parentMobileNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Mobile Number must be 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required("Enter Your Parent Mobile Number"),

  lastSchoolName: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Enter your last school name"),
  lastClass: yup.string().required("Enter your last Class name"),
  mediumOfEducation: yup
    .string()
    .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ")
    .required("Enter your last class Education Medium"),

  lastSchoolAdmissionDate: yup
    .string()
    .required("Select your last school admission date"),
  lastSchoolLeavingDate: yup
    .string()
    .required("Select your last school leaving date"),
  lastSchoolLeavingReason: yup
    .string()
    .matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ")
    .required("Enter your last school leaving Reason"),

  traineePhotograph: yup
    .string()
    .nullable()
    .required("Trainee Photograph Required"),
  traineeAadharCardDocument: yup
    .string()
    .nullable()
    .required("Trainee Aadhar Card Required"),
  leavingCertificateDocument: yup
    .string()
    .nullable()
    .required("Trainee School Transfer Certificate Required"),
  lastYearMarksheet: yup
    .string()
    .nullable()
    .required("Trainee Last Year Marksheet Required"),
  dvetAllotmentLetter: yup
    .string()
    .nullable()
    .required("DVET ITI Allotement Letter Required"),
});

// doc verification clerk and principal schema
export let principalOrDocsClerkSchema = yup.object().shape({
  action: yup.string().required("Status/Action is required !!")
})
// accountant clerk schema
export let accountantSchema = yup.object().shape({
  admissionFees: yup
    .string()
    .typeError("Please Enter Admission Fees")
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter Admission Fees"),
  deposit: yup
    .string()
    .typeError("Please Enter Caution Fees")
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter Caution Fees"),

  totalAdmissionFeeRs: yup
    .string()
    .typeError("Please Enter total admission fees")
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter total admission fees"),

  admissionFeeAmountToPay: yup
    .string()
    .typeError("Admission fee required")
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .test(
      "is-same-as-confirmation",
      "Amount should not be greater than total amount fees",
      function (value) {
        const totalAdmissionFeeRs = this.parent.totalAdmissionFeeRs;
        return parseInt(value, 10) <= parseInt(totalAdmissionFeeRs, 10);
      }
    )
    .required("Please Enter the amount fees you're paying"),
  remainingFeesAmount: yup
    .string()
    .typeError("Please Enter Remaining Fees")
    .matches(/^[0-9]+$/, "Must be Only Digits")
    .required("Please Enter Remaining Fees"),
  paymentTypeKey: yup
    .string()
    .typeError("Select Payment Type")
    .required("Select Payment Type"),
  paymentModeKey: yup
    .string()
    .typeError("Select Payment Mode")
    .required("Select Payment Mode"),
  accountantRemarks: yup
    .string().required("Remarks required")
});
