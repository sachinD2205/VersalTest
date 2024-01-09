import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);
let schema = yup.object().shape({
  zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  areaKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  bachatgatName: yup
    .string()
    .required(<FormattedLabel id="bachatgatNameValidation" />)
    .max(50, <FormattedLabel id="bachatgatNameValidationLength" />),
  totalMembersCount: yup
    .string()
    .required(<FormattedLabel id="totalMembersCountValidtion" />)
    .max(2, <FormattedLabel id="totalMembersCountValidtionLength" />),
  landmark: yup.string().required(<FormattedLabel id="landmarkValidation" />),
  pincode: yup
    .string()
    .required(<FormattedLabel id="pinCodeValidtion" />)
    .matches(/^[0-9]+$/, "please enter number only")
    .min(6, <FormattedLabel id=" pinCodeValidtionMinLength" />)
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />),
  email: yup
    .string()
    .email()
    .required(<FormattedLabel id="emailIdValidation" />)
    .max(80, <FormattedLabel id="emailIdValidtionLength" />),
  surname: yup
    .string()
    .required(<FormattedLabel id="surNameValidation" />)
    .max(50, <FormattedLabel id="surNameValidationLength" />),
  presidentFirstName: yup
    .string()
    .required(<FormattedLabel id="presidentFirstNameValidation" />)
    .max(50, <FormattedLabel id="presidentFirstNameValidationLength" />),
  presidentMiddleName: yup
    .string()
    .required(<FormattedLabel id="presidentMiddleNameValidation" />)
    .max(50, <FormattedLabel id="presidentMiddleNameValidationLength" />),
  presidentLastName: yup
    .string()
    .required(<FormattedLabel id="presidentLastNameValidation" />)
    .max(50, <FormattedLabel id="presidentLastNameValidationLength" />),
  applicantFirstName: yup
    .string()
    .required(<FormattedLabel id="applicantFirstNameValidtion" />)
    .max(50, <FormattedLabel id="applicantFirstNameValidtionLength" />),

  applicantMiddleName: yup
    .string()
    .required(<FormattedLabel id="applicantMiddleNameValidtion" />)
    .max(50, <FormattedLabel id="applicantMiddleNameValidtionLength" />),
  applicantLastName: yup
    .string()
    .required(<FormattedLabel id="applicantLastNameValidtion" />)
    .max(50, <FormattedLabel id="applicantLastNameValidtionLength" />),

  middleName: yup
    .string()
    .required(<FormattedLabel id="middleNameValidation" />)
    .max(50, <FormattedLabel id="middleNameValidationLength" />),

  mobileNo: yup
    .string()
    .required(<FormattedLabel id="mobileNoValidation" />)
    .matches(phoneRegex, "Phone number is not valid"),
  category: yup.string().required("BachatGat Category is Required !!!"),
  bankBranchKey: yup.string().required(<FormattedLabel id="bankBranchKeyValidation" />),
});

export default schema;
