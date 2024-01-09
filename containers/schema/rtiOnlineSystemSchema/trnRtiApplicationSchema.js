import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let trnRtiApplicationSchema = yup.object().shape({
  applicantFirstName: yup
    .string()
    .required(<FormattedLabel id="appliFirstNmReq" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant First Name./अर्जदाराच्या नावात फक्त वर्णांना परवानगी आहे."
    )
    .max(50, <FormattedLabel id="applicantFirstnmMax" />),
  applicantMiddleName: yup
    .string()
    .required(<FormattedLabel id="appliMiddNmReq" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant Middle Name./अर्जदाराच्या मधल्या नावामध्ये फक्त वर्णांना अनुमती आहे."
    )
    .max(50, <FormattedLabel id="middleNameMax" />),
  applicantLastName: yup
    .string()
    .required(<FormattedLabel id="appliLastNmReq" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant Last Name./अर्जदाराच्या आडनावामध्ये फक्त वर्णांना परवानगी आहे."
    )
    .max(50, <FormattedLabel id="lastNameMax" />),
  gender: yup.string().required(<FormattedLabel id="genderReq" />),
  pinCode: yup
    .string()
    .required(<FormattedLabel id="pinCodeValidtion" />)
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />)
    .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode./पिनकोडमध्ये फक्त क्रमांकांना परवानगी आहे."),
  emailId: yup
    .string()
    .required(<FormattedLabel id="emailReq" />)
    .email(<FormattedLabel id="inCorrectMsg" />)
    .max(80, <FormattedLabel id="emailIdMax" />),
  contactDetails: yup.string()
  .max(10, <FormattedLabel id="mobMaxValLen" />)
  .min(10, <FormattedLabel id="mobMinValLen" />)
  .required(<FormattedLabel id="contactReq" />),
  officeLocationKey: yup
    .string().nullable()
    .required(<FormattedLabel id="officeLocationReq" />),
    zoneKey: yup.string().nullable().required(<FormattedLabel id="zoneNmReq" />),
  departmentKey: yup.string().nullable().required(<FormattedLabel id="deptReq" />),
  selectedReturnMediaKey: yup
    .string()
    .required(<FormattedLabel id="reqInfoDeliveryDetailsReq" />),
  isApplicantBelowToPovertyLine: yup
    .string()
    .required(<FormattedLabel id="isBplReq" />),
  address: yup
    .string()
    .max(500, <FormattedLabel id="addressMaxLen" />)
    .required(<FormattedLabel id="addReq" />),
    addressMr: yup
    .string()
    .max(500, <FormattedLabel id="addressMrMaxLen" />)
    .required(<FormattedLabel id="addMrReq" />),
  // bplCardNo: yup
  //   .string()
  //   .matches(
  //     /^[a-zA-Z0-9]*$/,
  //     "BPL Card Number must contain only letters and numbers."
  //   )
  //   .length(10, "BPL Card Number must be exactly 10 characters.")
  //   .nullable(),
  // bplCardNo: yup
  // .string()
  // .max(10, <FormattedLabel id="bplCardNoMaxLen" />)
  // .matches(/^[0-9]+$/, "Only numbers are allowed in bpl card no."),
  // issuingAuthority:yup.string().matches(
  //   /^[a-zA-Z\s\u0900-\u097F]+$/,
  //   "Only characters are allowed in issuing authority."
  // )
  // .max(50, <FormattedLabel id="issuingAuthMax"/>),
  fromDate: yup
    .string()
    .required(<FormattedLabel id="formDateReq" />)
    .nullable(),
  place:yup.string().required(<FormattedLabel id='placeReq'/>),
  description: yup
    .string()
    .required(<FormattedLabel id="descriptionReq" />)
    .max(500, <FormattedLabel id="descriptionMaxLen" />),

  requiredInformationPurpose: yup
    .string()
    .required(<FormattedLabel id="requiredInformationPurposeReq" />)
    .max(500, <FormattedLabel id="requiredInformationPurposeMaxLen" />),
});

export default trnRtiApplicationSchema;
