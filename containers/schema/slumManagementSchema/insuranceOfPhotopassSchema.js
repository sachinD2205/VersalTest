import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

let issuanceOfPhotopassSchema = yup.object().shape({
  spouseTitle: yup
    .string()
    .required(<FormattedLabel id="applicantTitleValidation" />),

  // noOfCopies: yup
  //   .string()
  //   .required(<FormattedLabel id="noOfCopiesValidation" />),

  // slumKey: yup.string().required(<FormattedLabel id="slumKeyValidation" />),

  // areaKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),

  // villageKey: yup
  //   .string()
  //   .required(<FormattedLabel id="villageKeyValidation" />),
  // pincode: yup
  //   .string()
  //   .required(<FormattedLabel id="pinCodeValidtion" />)
  //   .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode.")
  //   .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
  //   .max(6, <FormattedLabel id="pinCodeValidtionLength" />),

  spouseFirstName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerFirstNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in spouse first name."
    )
    .max(50, <FormattedLabel id="proposedOwnerFirstNameValidationLength" />),

  spouseMiddleName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerMiddleNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in spouse middle name."
    )
    .max(50, <FormattedLabel id="proposedOwnerMiddleNameValidationLength" />),

  spouseLastName: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in spouse last name."
    )
    .max(50, <FormattedLabel id="proposedOwnerLastNameValidationLength" />),

    spouseFirstNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerFirstNameValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse first name."
    )
    .max(100, <FormattedLabel id="proposedOwnerFirstNameMrValidationLength" />)
    .nullable(),

    spouseMiddleNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerMiddleNameValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse middle name."
    )
    .max(100, <FormattedLabel id="proposedOwnerMiddleNameMrValidationLength" />)
    .nullable(),

    spouseLastNameMr: yup
    .string()
    .required(<FormattedLabel id="proposedOwnerLastNameValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]*$/,
      "Only characters are allowed in spouse last name."
    )
    .max(100, <FormattedLabel id="proposedOwnerLastNameMrValidationLength" />)
    .nullable(),

  spouseOccupation: yup
    .string()
    .required(<FormattedLabel id="spouseOccupationValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters are allowed in spouse occupation."
    )
    .max(50, <FormattedLabel id="spouseOccupationValidationLength" />),
  spouseRelationKey: yup
    .string()
    .required(<FormattedLabel id="spouseRelationKeyValidation" />),

  spouseMobileNo: yup
    .string()
    .required(<FormattedLabel id="applicantMobileNoValidation" />)
    .matches(phoneRegex, "Phone number is not valid"),

  spouseEmail: yup
    .string()
    .required(<FormattedLabel id="emailIdValidation" />)
    .max(80, <FormattedLabel id="emailIdValidtionLength" />),

  spouseAge: yup
    .number()
    .typeError("Age must be a number")
    .required(<FormattedLabel id="spouseAgeValidation" />)
    .positive(<FormattedLabel id="spouseAgePtvValidation" />)
    .integer(<FormattedLabel id="spouseAgeIntValidation" />)
    .min(18, <FormattedLabel id="spouseAgeValidationLength" />),

  spouseAadharNo: yup
    .string()
    .required(<FormattedLabel id="applicantAadharNoValidation" />)
    .matches(/^[0-9]+$/, "Only numbers are allowed in Aadhar No.")
    .min(12, <FormattedLabel id="applicantAadharNoValidationMinLength" />)
    .max(12, <FormattedLabel id="applicantAadharNoValidationLength" />),
});

export default issuanceOfPhotopassSchema;
