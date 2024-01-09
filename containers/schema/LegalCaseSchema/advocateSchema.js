import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let advocateDetailsSchema = yup.object().shape({
  // title: yup.string().required(<FormattedLabel id="selectTitle" />),

  firstName: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0][A-Za-z0\s\/\-\:\:\.\,\_\"\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="fnameEn" />),

  // middleName
  middleName: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0][A-Za-z0\s\/\-\:\:\.\,\_\"\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="mnameEn" />),

  // lastName
  lastName: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0][A-Za-z0\s\/\-\:\:\.\,\_\"\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="lnameEn" />),

  // nameOfBarCouncil
  nameOfBarCouncil: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\-\:\:\.\,\_\"\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="nameOfBarCouncilEn" />),

  // aadhaarNo

  aadhaarNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required(),

  // panNo
  panNo: yup
    .string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Must be in proper format")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(10, "PAN Number must be at least 9 number")
    .max(10, "PAN Number not valid on above 9 number")
    .required(),

  //  city
  city: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="cityOrVillageEn" />),

  // area
  area: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="areaEn" />),

  // roadName
  roadName: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="roadNameEn" />),

  // landmark
  landmark: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="landmarkEn" />),

  // pinCode
  pinCode: yup
    .string()
    .matches(/^[1-9][0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),

  // mobileNo
  mobileNo: yup
    .string()
    // .matches(/^[1-9][0-9]+$/, "Must be only digits")
    // /^[6-9]\d{9}$/
    .matches(/^[6-9]\d{9}$/, "Mobile Number must be  10 number and starting with 6")

    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(10, "Mobile Number must be  10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required(),

  // emailAddress
  emailAddress: yup
    .string()
    .email("Incorrect format")
    .required(<FormattedLabel id="enterEmailAddress" />),
});

// Validation For Marathi
export let advocateDetailsSchemaMr = yup.object().shape({
  // firstNameMr
  firstNameMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0\s\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\/\\\अॅ\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="fnameMr" />),

  // middleNameMr
  middleNameMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0\s\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\/\\\अॅ\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="mnameMr" />),

  // lastNameMr
  lastNameMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0\s\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\/\\\अॅ\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="lnameMr" />),

  // nameOfBarCouncilMr
  nameOfBarCouncilMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\/\\\अॅ\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="nameOfBarCouncilMr" />),

  // cityMr
  cityMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="cityOrVillageMr" />),

  // areaMr
  areaMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="areaMr" />),

  // roadNameMr

  roadNameMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="roadNameMr" />),

  // landmarkMr
  landmarkMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="landmarkMr" />),

  aadhaarNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(12, "Adhar Number must be at least 12 number")
    .max(12, "Adhar Number not valid on above 12 number")
    .required(),

  // panNo
  panNo: yup
    .string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Must be in proper format")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(10, "PAN Number must be at least 9 number")
    .max(10, "PAN Number not valid on above 9 number")
    .required(),

  // pinCode
  pinCode: yup
    .string()
    .matches(/^[1-9][0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterPinCode" />)
    .min(6, "Pincode Number must be at least 6 number")
    .max(6, "Pincode Number not valid on above 6 number")
    .required(),

  // mobileNo
  mobileNo: yup
    .string()
    .matches(/^[1-9][0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number")
    .required(),

  // emailAddress
  emailAddress: yup
    .string()
    .email("Incorrect format")
    .required(<FormattedLabel id="enterEmailAddress" />),
});

export let bankDetailsSchema = yup.object().shape({
  bankName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="selectBankName" />),

  // // branchName
  // branchName: yup.string().required(<FormattedLabel id="selectBranchName" />),
  branchName: yup
    .string()
    .matches(/^[a-zA-Z0-9-]+$/, "Branch Name is Required ")
    .typeError(<FormattedLabel id="selectBranchName" />),

  // accountNo
  accountNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError(<FormattedLabel id="enterAccountNo" />),
  // .min(7, 'Mobile Number must be at least 7 number')
  // .max(7, 'Mobile Number not valid on above 7 number'),

  // bankIFSCCode
  bankIFSCCode: yup
    .string()
    .matches(/^([A-Z]{4})(0)([0-9A-Z]{6})$/, "Must be in proper format")
    // /^[A-Z]{4}\d{7}$/
    // .matches(/^[A-Za-z]{4}[0-9]{7}$/, "Must be in proper format")
    
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    // .min(11, "IFSC Code must be at least 11 number")
    // .max(11, "IFSC Code not valid on above 11 number")
    ,

  // bankMICRCode
  bankIFSCCode: yup
    .string()
    .matches(/^[0-9-aA-zZ\s]+$/, "Must be in proper format")
    .typeError(<FormattedLabel id="enteraadhaarNo" />)
    .min(11, "IFSC Code must be at least 11 number")
    .max(11, "IFSC Code not valid on above 11 number"),
});
