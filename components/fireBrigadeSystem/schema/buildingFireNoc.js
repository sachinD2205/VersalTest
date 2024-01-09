import * as yup from "yup"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"

const ApplicantDetailsSchema = {
  applicantName: yup
    .string()
    .nullable()
    .required("Applicant name is Required !!!"),

  // .matches(/^[\u0900-\u097F\s]*$/, "Please enter only Marathi characters.")

  applicantNameMr: yup
    .string()
    .nullable()
    .required("Applicant name is Required !!!"),
  applicantMiddleName: yup
    .string()
    .nullable()
    .required("Applicant middle name is Required !!!"),
  applicantMiddleNameMr: yup
    .string()
    .nullable()
    .required("Applicant middle name is Required !!!"),
  applicantLastName: yup
    .string()
    .nullable()
    .required("Applicant last name is Required !!!"),
  applicantLastNameMr: yup
    .string()
    .nullable()
    .required("Applicant last name is Required !!!"),
  applicantMobileNo: yup
    .string()
    .nullable()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Mobile number is not valid"
    )
    .required("Mobile number is required"),
  applicantEmailId: yup
    .string()
    .nullable()
    .email("Email is not valid")
    .required("Email Id is Required !!!"),
}

const FormDetailsSchema = {
  formName: yup.string().required("Please enter form Name !!!"),
  siteAddress: yup
    .string()
    .typeError("Please enter site address ")
    .required("Applicant contact number is required"),
  dpOpNo: yup
    .string()
    .typeError("Please enter dp op no. ")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Applicant contact number is required"),
  blockNo: yup
    .string()
    .typeError("Please enter block no. ")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Applicant contact number is required"),
  revenueSurveyNo: yup
    .string()
    .typeError("Please enter revenue survey no. ")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Applicant contact number is required"),
  highTensionLine: yup
    .string()
    .typeError("Please enter high tension line")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Applicant contact number is required"),
  constructionAreSqMeter: yup
    .string()
    .typeError("Please enter construction Area SqMeter")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Applicant contact number is required"),
  finalPlotNo: yup
    .string()
    .typeError("Must be number !!!")
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("Final plot number is Required !!!"),
  plotAreaSquareMeter: yup
    .string()
    .matches(/^[0-9]+$/, "Plot area must be in number !!!")
    .typeError("Please enter plot Area Square Meter ")
    .required("Plot area is Required !!!"),
}

export let applicantDTLDaoSchema = yup.object().shape({
  applicantDTLDao: yup.object().shape(ApplicantDetailsSchema),
  // nocType: yup.string().required("Please select NOC type !!!"),
  // noctype: yup.string().required("Please select NOC type !!!"),
})

export let FormDTLDaoSchema = yup.object().shape({
  formDTLDao: yup.object().shape(FormDetailsSchema),
})

export let OwnerSchema = yup.object().shape({
  //   applicantName: yup.string().required("Applicant name is Required !!!"),
  //   applicantNameMr: yup.string().required("Applicant name is Required !!!"),
  //   applicantMiddleName: yup
  //     .string()
  //     .required("Applicant middle name is Required !!!"),
  //   applicantMiddleNameMr: yup
  //     .string()
  //     .required("Applicant middle name is Required !!!"),
  //   applicantLastName: yup
  //     .string()
  //     .required("Applicant last name is Required !!!"),
  //   applicantLastNameMr: yup
  //     .string()
  //     .required("Applicant last name is Required !!!"),
  //   officeContactNo: yup
  //     .string()
  //     .matches(
  //       /\(\d{3}\)\s*\d{3}-\d{4}/gm,
  //       "Contact number is not valid (ex. (044) 456-7890)"
  //     )
  //     .required("Office contact number is required"),
  //   workingSiteOnsitePersonMobileNo: yup
  //     .string()
  //     .matches(
  //       /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  //       "Mobile number is not valid"
  //     )
  //     .required("Mobile number is required"),
  //   emailId: yup
  //     .string()
  //     .email("Email is not valid")
  //     .required("Email Id is Required !!!"),
})

export let BuildingUseSchema = yup.object().shape({
  // buildingHeightFromGroundFloorInMeter: yup.string().matches(/^[0-9]+$/, "Building height in must be in number !!!").required("building Height is Required !!!"),
  // noOfBasement: yup.string().matches(/^[0-9]+$/, "Basement must be in number !!!").required("Number of basement is Required !!!"),
  // volumeLBHIn: yup.string().matches(/^[0-9]+$/, "Volume LBH must be in number !!!").required("Volume LBH is Required !!!"),
  // totalBuildingFloor: yup.string().matches(/^[0-9]+$/, "Floor must be in number !!!").required("Building Floor is Required !!!"),
  // basementAreaInsquareMeter: yup.string().matches(/^[0-9]+$/, "Basement area must be in number !!!").required("Basement area is Required !!!"),
  // noOfVentilation: yup.string().matches(/^[0-9]+$/, "Ventilation must be in number !!!").required("Ventilation is Required !!!"),
  // noOfTowers: yup.string().required("Number of towers is Required !!!"),
  // plotAreaSquareMeter: yup.string().matches(/^[0-9]+$/, "Plot area must be in number !!!").required("Plot area is Required !!!"),
  // constructionAreSqMeter: yup.string().matches(/^[0-9]+$/, "Construction area must be in number !!!").required("Construction area is Required !!!"),
  // noOfApprochedRoad: yup.string().matches(/^[0-9]+$/, "Approched road must be in number !!!").required("Aapproched road is Required !!!"),
  // // drawingProvided: yup.string().required("Drawing provided is Required !!!"),
  // // siteAddress: yup.string().required("Site address is Required !!!"),
  // highTensionLine: yup.string().required("High tension line is Required !!!"),
  // // areaZone: yup.string().required("Area zone is Required !!!"),
  // // previouslyAnyFireNocTaken: yup.string().required("Fire noc is Required !!!"),
  // underTheGroundWaterTankCapacityLighter: yup.string().required("Capacity lighter is Required !!!"),
  // l: yup.string().matches(/^[0-9]+$/, "L must be in number !!!").required("L is Required !!!"),
  // b: yup.string().matches(/^[0-9]+$/, "B must be in number !!!").required("B is Required !!!"),
  // h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),
  // // h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),
})

export let OtherDetailSchema = yup.object().shape({
  // overHearWaterTankCoApprovedMaps: yup.string().required("OverHear water is Required !!!"),
  // approvedKeyPlan: yup.string().required("Approved key plan is Required !!!"),
  // approvedLayoutPlanPCMC: yup.string().matches(/^[0-9]+$/, "Approved layout plan must be in number !!!").required("Approved layout plan is Required !!!"),
  // approvedApproachRoadPCMC: yup.string().required("Approved approach is Required !!!"),
  // measurementOfTank: yup.string().required("H   is Required !!!"),
  // measurementOfTank: yup.string().required("Measurement of tank is Required !!!"),
  // explosiveLicense: yup.string().required("Explosive license is Required !!!"),
  // permissionLetterOfPCMC: yup.string().required("Permission letter of PCMC is Required !!!"),
  // completionCertificate: yup.string().required("Completion certificate is Required !!!"),
  // structuralStabilityCertificate: yup.string().required("Structural stability certificate is Required !!!"),
  // escalatorApprovedByGovtCertificate: yup.string().required("escalator is Required !!!"),
  // fireDrawingFloorWiseAlsoApprovedByComplianceAuthority: yup.string().required("Fire drawing is Required !!!"),
})

// const witnessFieldSchema = {
//   wtitle: yup.string().required(<FormattedLabel id="selectTitle" />),
//   witnessFName: yup
//     .string()
//     .matches(
//       /^[aA-zZ\s]+$/,
//       "Must be only english characters / फक्त इंग्लिश शब्द "
//     )
//     .required(<FormattedLabel id="enterFName" />),
//   witnessMName: yup
//     .string()
//     .matches(
//       /^[aA-zZ\s]*$/,
//       "Must be only english characters / फक्त इंग्लिश शब्द "
//     ),
//   // .required(<FormattedLabel id="enterMName" />),
//   witnessLName: yup
//     .string()
//     .matches(
//       /^[aA-zZ\s]+$/,
//       "Must be only english characters / फक्त इंग्लिश शब्द "
//     )
//     .required(<FormattedLabel id="enterLName" />),
//   genderKey: yup.string().required(<FormattedLabel id="selectGender" />),
//   witnessAddressC: yup
//     .string()
//     .matches(
//       /^[A-Za-z0-9@-\s]+$/,
//       "Must be only in english / फक्त इंग्लिश मध्ये "
//     )
//     .required(<FormattedLabel id="witnessAddressC" />),
//   aadharNo: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enteraadhaarNo" />)
//     .min(12, "Adhar Number must be at least 12 number")
//     .max(12, "Adhar Number not valid on above 12 number")
//     .required(),
//   witnessMobileNo: yup
//     .string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .typeError(<FormattedLabel id="enterMobileNo" />)
//     .min(10, "Mobile Number must be at least 10 number")
//     .max(10, "Mobile Number not valid on above 10 number")
//     .required(),
//   emailAddress: yup.string().email("Incorrect format"),
//   // .required(<FormattedLabel id="enterEmailAddress" />),
//   witnessDob: yup
//     .date()
//     .typeError(<FormattedLabel id="selectDate" />)
//     .required(),
//   witnessAge: yup
//     .number()
//     .typeError()
//     .min(18, "Age must be at least 18 year")
//     .max(99, "Age not valid on above 18 year")
//     .required(<FormattedLabel id="enterAge" />),
//   witnessRelation: yup
//     .string()
//     .required(<FormattedLabel id="witnessRelation" />),
// };

// export let witnessDetailsSchema = yup.object().shape({
//   witnesses: yup.array().of(yup.object().shape(witnessFieldSchema)),
// });
