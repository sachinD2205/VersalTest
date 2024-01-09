import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  // inwardNo
  inwardNo: yup
    .string()
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Please Enter Inward Number / कृपया आवक क्रमांक प्रविष्ट करा "
    )
    .required(),

  opinionRequestDate: yup
    .date()
    // .required()
    .typeError(<FormattedLabel id="selectDate" />)
    .required(),

  // officeLocation
  officeLocation: yup.string().required(<FormattedLabel id="selectLocation" />),

  concenDeptId: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="selectDepartmet" />),

  // opinionSubject
  opinionSubject: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      // /^[a-zA-Z0-9 ]*$/,
      // /^[a-zA-Z0-9,.\s@/:"]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="enterOpinionSubject" />),

  // opinionSubjectMr
  opinionSubjectMr: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      // /^[\u0900-\u097F0-9\s]*$/,
      // /^[ऀ-ॿ0-9\s,.@/]+$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?]*$/,

      // "Must be only english characters / फक्त इंग्लिश शब्द "
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="enterOpinionSubject" />),

  // panelRemarks
  panelRemarks: yup.string().matches(
    // /^[aA-zZ\s]*$/,
    // /^[a-zA-Z0-9 ]*$/,
    // /^[a-zA-Z0-9,.\s@/:"]*$/,
    // /^[a-zA-Z0-9,.\s@/:"]*$/,
    /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

    "Must be only english characters / फक्त इंग्लिश शब्द "
  ),
  // .required(<FormattedLabel id="enterOpinionSubject" />),

  panelRemarksMr: yup.string().matches(
    // /^[\u0900-\u097F\s]*$/,

    // /^[\u0900-\u097F0-9\s]*$/,
    // /^[ऀ-ॿ0-9\s,.@/]+$/,
    /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

    "Must be only marathi characters/ फक्त मराठी शब्द"
  ),

  // reportRemarks
  reportRemarks: yup.string().matches(
    // /^[aA-zZ\s]*$/,
    // /^[a-zA-Z0-9 ]*$/,
    // /^[a-zA-Z0-9,.\s@/:"]*$/,
    /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

    "Must be only english characters / फक्त इंग्लिश शब्द "
  ),

  // reportRemarksMr
  reportRemarksMr: yup.string().matches(
    // /^[\u0900-\u097F\s]*$/,
    // /^[\u0900-\u097F0-9\s]*$/,
    // /^[ऀ-ॿ0-9\s,.@/]+$/,
    /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

    "Must be only marathi characters/ फक्त मराठी शब्द"
  ),

  // clerkRemarkEn
  // clerkRemarkEn: yup.string().matches(
  //   // /^[aA-zZ\s]*$/,
  //   // /^[a-zA-Z0-9 ]*$/,
  //   // /^[a-zA-Z0-9,.\s@/:"]*$/,
  //   /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

  //   "Must be only english characters / फक्त इंग्लिश शब्द "
  // ),

  // clerkRemarkMr
  // clerkRemarkMr: yup.string().matches(
  //   // /^[\u0900-\u097F\s]*$/,
  //   // /^[\u0900-\u097F0-9\s]*$/,
  //   /^[ऀ-ॿ0-9\s,.@/]+$/,

  //   "Must be only marathi characters/ फक्त मराठी शब्द"
  // ),
});

//  schema in Marathi

export default schema;
