import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let hutMemberSchema = yup.object().shape({
  title: yup.string().required(<FormattedLabel id="titleValidation" />),
  firstName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="proposedOwnerFirstNameValidation" />),
  middleName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="proposedOwnerMiddleNameValidation" />),
  lastName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameValidation" />),
  firstNameMr: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="proposedOwnerFirstNameValidation" />),
  middleNameMr: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="proposedOwnerMiddleNameValidation" />),
  lastNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameValidation" />),
  aadharNo: yup.string().required(<FormattedLabel id="aadharNoValidation" />),
  mobileNo: yup.string().required(<FormattedLabel id="mobileNoValidation" />),
  age: yup.string().required(<FormattedLabel id="spouseAgeValidation" />),
  email: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="emailIdValidation" />),
  genderKey: yup.string().nullable().required(<FormattedLabel id="genderKeyValidation" />),
  religionKey: yup
    .string().nullable()
    .required(<FormattedLabel id="religionKeyValidation" />),
  casteKey: yup.string().nullable().required(<FormattedLabel id="casteKeyValidation" />),
  occupation: yup
    .string().nullable()
    .required(<FormattedLabel id="spouseOccupationValidation" />),
  castCategoryKey: yup
    .string().nullable()
    .required(<FormattedLabel id="castCategoryValidation" />),
  relationKey: yup
    .string().nullable()
    .required(<FormattedLabel id="spouseRelationKeyValidation" />),
  educationKey: yup
    .string().nullable()
    .required(<FormattedLabel id="educationKeyValidation" />),
});

export default hutMemberSchema;
