import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// caseDetailsSchema
export let courtCaseDetailsSchema = yup.object().shape({
  // caseNumber
  caseNumber: yup
    .string()
    .required(<FormattedLabel id="caseNumberValidation" />)
    .matches(
      /^[a-zA-Z0-9]+$/,
      // /^[0-9]+$/,
      "only numbers are allowed / फक्त संख्यांना परवानगी आहे"
    )
    .typeError(),

  //   // year
  year: yup.string().required(<FormattedLabel id="yearValidation" />),
  //   // court
  court: yup.string().required(<FormattedLabel id="courtNameValidation" />),

  //   // caseMainType
  caseMainType: yup
    .string()
    .required(<FormattedLabel id="caseMainTypeValidation" />),
  //   // subType
  subType: yup.string().required(<FormattedLabel id="caseSubTypeValidation" />),
  //   // stampNo
  stampNo: yup
    .string()
    .required(<FormattedLabel id="stampNoValidation" />)
    .matches(
      /^[0-9]+$/,
      "only numbers are allowed / फक्त संख्यांना परवानगी आहे"
    )
    .typeError(),
  //   // fillingDate
  fillingDate: yup
    .date()
    .required(<FormattedLabel id="fillingDateValidation" />)
    .typeError("filing Date is required/दाखल करण्याची तारीख आवश्यक आहे !!!"),
  //   // filedBy
  filedBy: yup.string().required(<FormattedLabel id="filedByValidation" />),
  //   // filedByMr
  filedByMr: yup.string().required(<FormattedLabel id="filedByValidation" />),
  //   // filedAgainst
  filedAgainst: yup
    .string()
    .required(<FormattedLabel id="filedAgainstValidation" />),
  //   // filedAgainstMr
  filedAgainstMr: yup
    .string()
    .required(<FormattedLabel id="filedAgainstValidation" />),
  //   // caseDetails
  caseDetails: yup
    .string()
    .required(<FormattedLabel id="caseDetailsValidation" />),
});

// add Hearing Schema in English

export let addHearingSchema = yup.object().shape({
  // caseNumber
  caseNumber: yup
    .string()
    .required(<FormattedLabel id="caseNumberValidation" />),

  // caseMainType
  caseMainType: yup
    .string()
    .required(<FormattedLabel id="caseMainTypeValidation" />),

  // fillingDate
  fillingDate: yup
    .string()
    .required(<FormattedLabel id="fillingDateValidation" />),

  // caseStatus
  // caseStatus: yup
  //   .string()
  //   .required(<FormattedLabel id="caseStatusValidation" />),

  // caseStage
  caseStage: yup
    .string()
    .required(<FormattedLabel id="caseStageValidation" />)
    .typeError("Case Stages is Required/केसचा टप्पा आवश्यक आहे"),

  // remark
  // remarkMr: yup
  //   .string()
  //   .matches(
  //     // /^[\u0900-\u097F]+/,
  //     // /^[\u0900-\u097F0-9\s]*$/,
  //     /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   )
  //   .required(<FormattedLabel id="enterRemarks" />),

  // hearingDate
  hearingDate: yup
    .date()
    .required(<FormattedLabel id="appearanceDateValidation" />)
    .typeError("Hearing Date is Required/सुनावणीची तारीख आवश्यक आहे!!!"),

  // caseStatus
  caseStatus: yup
    .string()
    .required(<FormattedLabel id="caseStageValidation" />)
    .typeError("Case Status is Required/केसची स्थिती आवश्यक आहे"),

  remark: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      // /^[a-zA-Z0-9 ]*$/,
      // /^[a-zA-Z0-9 ]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?\']*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterRemarks" />),
});

// Add Hearing Schema in Marathi
export let addHearingSchemaMr = yup.object().shape({
  // caseNumber
  caseNumber: yup
    .string()
    .required(<FormattedLabel id="caseNumberValidation" />),

  // caseMainType
  caseMainType: yup
    .string()
    .required(<FormattedLabel id="caseMainTypeValidation" />),

  // fillingDate
  fillingDate: yup
    .string()
    .required(<FormattedLabel id="fillingDateValidation" />),

  // caseStatus
  caseStatus: yup
    .string()
    .required(<FormattedLabel id="caseStatusValidation" />),

  // caseStage
  caseStage: yup
    .string()
    .required(<FormattedLabel id="caseStageValidation" />)
    .typeError("Case Stages is Required/केसचा टप्पा आवश्यक आहे"),

  // remark
  remarkMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F]+/,
      // /^[\u0900-\u097F0-9\s]*$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\'\?]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterRemarks" />),

  // remark: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]*$/,
  //     // /^[a-zA-Z0-9 ]*$/,
  //     // /^[a-zA-Z0-9 ]*$/,
  //     /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   )
  //   .required(<FormattedLabel id="enterRemarks" />),
});
