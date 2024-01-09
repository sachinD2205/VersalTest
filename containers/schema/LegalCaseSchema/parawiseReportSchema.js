import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

export let parawiseRequestLcClerk = yup.object().shape({
  // opponentAdvocateMr
  //    parawiseReportRemarkClerk

  clerkRemarkEnglish: yup
    .string()
    .matches(
      //  /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9 .]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–\?\—\’]*$/,

      //   'Must be only marathi characters/ फक्त मराठी शब्द',
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterRemarks" />),

  //   parawiseReportRemarkClerkMr
  clerkRemarkMarathi: yup
    .string()
    .matches(
      // /^[\u0900-\u097F0-9\s.]*$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–\?\—\’]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterRemarks" />),

  // department
  // departmentName: yup
  //     .string()
  //     .required(<FormattedLabel id='departmentValidation' />),

  //   // // department
  //   department: yup
  //     .string()
  //     .required(<FormattedLabel id='departmentValidation' />),
  // });

  // // caseDetailsSchema
  // export let courtCaseDetailsSchema = yup.object().shape({
  //   // caseNumber
  //   caseNumber: yup
  //     .string()
  //     .required(<FormattedLabel id='caseNumberValidation' />)
  //     .matches(
  //       /^[a-zA-Z0-9]+$/,
  //       // /^[0-9]+$/,
  //       "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //     )
  //     .typeError(),

  // //   // year
  //   year: yup.string().required(<FormattedLabel id='yearValidation' />),
  // //   // court
  //   court: yup.string().required(<FormattedLabel id='courtNameValidation' />),
  // //   // priviouseCourtName
  //   // priviouseCourtName: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='priviouseCourtNameValidation' />),

  // //   // caseReference
  //   // caseReference: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='caseReferenceValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   )
  //   //   .typeError(),

  // //   // caseMainType
  //   caseMainType: yup
  //     .string()
  //     .required(<FormattedLabel id='caseMainTypeValidation' />),
  // //   // subType
  //   subType: yup.string().required(<FormattedLabel id='caseSubTypeValidation' />),
  // //   // stampNo
  //   // stampNo: yup
  //   //   .string()
  //   //   .required(<FormattedLabel id='stampNoValidation' />)
  //   //   .matches(
  //   //     /^[0-9]+$/,
  //   //     "only numbers are allowed / फक्त संख्यांना परवानगी आहे",
  //   //   )
  //   //   .typeError(),
  // //   // fillingDate
  //   fillingDate: yup
  //     .date()
  //     .required(<FormattedLabel id='fillingDateValidation' />)
  //     .typeError("filing Date is required/दाखल करण्याची तारीख आवश्यक आहे !!!"),
  // //   // filedBy
  //   // filedBy: yup.string().required(<FormattedLabel id='filedByValidation' />),

  //   filedBy: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]+$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     /^[A-Za-z.]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   )
  //   .required(<FormattedLabel id="filedByValidation" />),
  // //   // filedByMr
  // filedByMr: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]+$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     // /^[A-Za-z.]*$/,
  //     /^[\u0900-\u097F.]*$/,

  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   )
  //   .required(<FormattedLabel id="filedByValidation" />),

  // //   // filedAgainst
  // filedAgainst: yup
  // .string()
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   // /^[A-Za-z.]*$/,
  //   // /^[A-Za-z\s]*$,/,
  //   /^[A-Za-z\s.]*$/,
  //   "Must be only english characters / फक्त इंग्लिश शब्द "
  // )
  // .required(<FormattedLabel id="filedAgainstValidation" />),
  // //   // filedAgainstMr
  // filedAgainstMr: yup
  // .string()
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   // /^[A-Za-z.]*$/,
  //   // /^[\u0900-\u097F.]*$/,
  //   /^[\u0900-\u097F\s.]*$/,

  //   "Must be only marathi characters/ फक्त मराठी शब्द"
  // )
  // .required(<FormattedLabel id="filedAgainstValidation" />),
  // //   // caseDetails
  // // /^[a-zA-Z0-9.]*$/;
  // caseDetails: yup
  // .string()
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   // /^[A-Za-z.]*$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   /^[a-zA-Z0-9 .]*$/,

  //   "Must be only english characters / फक्त इंग्लिश शब्द "

  // )
  // .required(<FormattedLabel id="caseDetailsValidation" />),

  // // caseDetailsMr
  // caseDetailsMr: yup
  // .string()
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   // /^[A-Za-z.]*$/,
  //   // /^[a-zA-Z0-9.]*$/,
  //   /^[\u0900-\u097F0-9\s.]*$/,
  //   "Must be only marathi characters/ फक्त मराठी शब्द"
  // )
  // .required(<FormattedLabel id="caseDetailsValidation" />),

  // // export let courtCaseEntryBankDetailsSchema = yup.object().shape({
  // //   // bankName
  // //   bankName: yup.string().required(<FormattedLabel id='bankNameValidation' />),
  // //   // accountNo
  // //   accountNo: yup
  // //     .string()
  // //     .required(<FormattedLabel id='accountNoValidation' />)
  // //     .matches(/^[0-9]+$/, "only digits are allowed/फक्त अंकांना परवानगी आहे")
  // //     .min(
  // //       12,
  // //       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
  // //     )
  // //     .max(
  // //       17,
  // //       "please enter valid bank account number/कृपया वैध बँक खाते क्रमांक प्रविष्ट करा",
  // //     )
  // //     .typeError(<FormattedLabel id='accountNoValidation' />),
  // //   //bankIFSCCode
  // //   bankIFSCCode: yup
  // //     .string()
  // //     .required(<FormattedLabel id='ifscCodeValidation' />),
  // //   // bankMICRCode
  // //   bankMICRCode: yup
  // //     .string()
  // //     .required(<FormattedLabel id='bankMICRCodeValidation' />),
});

export let parawiseRequestLcHOD = yup.object().shape({
  //    parawiseReportRemarkHod

  parawiseReportRemarkHod: yup
    .string()
    .matches(
      //  /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9 .]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–\?\—\’]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterRemarks" />),

  //   parawiseReportRemarkHodMr
  parawiseReportRemarkHodMr: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[\u0900-\u097F0-9\s.]*$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–\?\—\’]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterRemarks" />),
});

// Concern Department Clerk
const parawiseRequestLcConcernClerk = {
  // issueNo
  issueNo: yup
    .number()
    // .string()
    .nullable()
    .typeError(<FormattedLabel id="issueNumberValidationNew" />)
    .test({
      name: "is-valid-issue-number",
      message: "Issue number must be a valid number greater than zero",
      test: (value) => {
        if (isNaN(value) || value <= 0) {
          return false; // Reject if not a number or less than or equal to zero
        }
        // Add additional checks if needed
        return true; // Pass the validation
      },
    })
    .required(<FormattedLabel id="issueNumberValidation" />),

  answerInEnglish: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/
      // /^[a-zA-Z0-9 .]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–\–\?\—\’]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterRemarks" />),

  // answerInMarathi
  answerInMarathi: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/
      // /^[\u0900-\u097F0-9\s.]*$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–\–\?\—\’]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterRemarks" />),
};

export let parawiseRequestLcConcernClerk1 = yup.object().shape({
  parawiseReportDao: yup
    .array()
    .of(yup.object().shape(parawiseRequestLcConcernClerk)),
});

export default parawiseRequestLcClerk;
