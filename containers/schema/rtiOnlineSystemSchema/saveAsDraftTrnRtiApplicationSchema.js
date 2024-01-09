import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let saveAsDraftTrnRtiApplicationSchema = yup.object().shape({
  applicantFirstName: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant First Name./अर्जदाराच्या नावात फक्त वर्णांना परवानगी आहे."
    )
    .max(50, <FormattedLabel id="applicantFirstnmMax" />),
  applicantMiddleName: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant Middle Name./अर्जदाराच्या मधल्या नावामध्ये फक्त वर्णांना अनुमती आहे."
    )
    .max(50, <FormattedLabel id="middleNameMax" />),
  applicantLastName: yup
    .string()
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in Applicant Last Name./अर्जदाराच्या आडनावामध्ये फक्त वर्णांना परवानगी आहे."
    )
    .max(50, <FormattedLabel id='lastNameMax' />),
    contactDetails: yup.string()
    .max(10, <FormattedLabel id="mobMaxValLen" />)
    .min(10, <FormattedLabel id="mobMinValLen" />),
  pinCode: yup
    .string()
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />)
    .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode./पिनकोडमध्ये फक्त क्रमांकांना परवानगी आहे."),
    emailId: yup
    .string()
    .email(<FormattedLabel id="inCorrectMsg" />)
    .max(80, <FormattedLabel id='emailIdMax'/>),
  address: yup.string().max(500, <FormattedLabel id="addressMaxLen" />),

  description: yup.string().max(5000, <FormattedLabel id="descriptionMaxLen" />),

  requiredInformationPurpose: yup
    .string()
    .max(500, <FormattedLabel id="requiredInformationPurposeMaxLen" />
    ),

    // bplCardNo: yup
    // .string()
    // .max(10, <FormattedLabel id="bplCardNoMaxLen" />)
    // .matches(/^[0-9]+$/, "Only numbers are allowed in bpl card no."),

    // issuingAuthority:yup.string().matches(
    //   /^[a-zA-Z\s\u0900-\u097F]+$/,
    //   "Only characters are allowed in issuing authority."
    // )
    // .max(50, <FormattedLabel id="issuingAuthMax"/>)
});

export default saveAsDraftTrnRtiApplicationSchema;
