import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = yup.object().shape({
  // inwardNo
  inwardNo: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,\
      /^[a-zA-Z0-9]*$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="inwardNumberValidation" />),

  // noticeDate
  noticeDate: yup
    .date()
    .required(<FormattedLabel id="fillingDateValidation" />)
    .typeError("Notice Date is required/ सूचना तारीख आवश्यक आहे !!!"),

  // noticeRecivedDate
  noticeRecivedDate: yup
    .date()
    .required(<FormattedLabel id="fillingDateValidation" />)
    .typeError(
      "Notice received  Date is required/ सूचना प्राप्त तारीख आवश्यक आहे !!!"
    ),

  // noticeRecivedFromAdvocatePerson

  noticeRecivedFromAdvocatePerson: yup
    .string()
    .matches(
      // /^[aA-zZ\s]*$/,
      // /^[a-zA-Z ]*$/,
      // /^[A-Za-z\s.]*$/,
      // /^[A-Za-z\s.\,\"\:]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/()\+\-\:\:\.\,\=\_\`\"\'\;\\.\–]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="advocateNameValidation" />),

  // noticeRecivedFromAdvocatePersonMr
  // noticeRecivedFromAdvocatePersonMr: yup
  //   .string()
  //   .matches(
  //     // /^[\u0900-\u097F\s]*$/,
  //     // /^[\u0900-\u097F\s]*$/,
  //     // /^[\u0900-\u097F\s.\,\"\:]*$/,
  //     /^[ऀ-ॿ][ऀ-ॿ0-9\s\\&\*\(\)\[\]\!\-\_\=\''\"\:\;\.\,\\{\}\/\\\अॅ\`\–]*$/,

  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   )
  //   .required(<FormattedLabel id="noticeDetailsValidation" />),

  // noticeDetails
  noticeDetails: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[a-zA-Z0-9 .]*$/,
      // /^[a-zA-Z0-9\/. ]*$/,
      // /^(?!\s)[a-zA-Z0-9\s/.]*$/,
      // /^[a-zA-Z,./@ ]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–\—]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="noticeDetailsValidation" />),

  // noticeDetailsMr
  // noticeDetailsMr: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]+$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     // /^[A-Za-z.]*$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     // /^(?!\s)[\u0900-\u097F0-9\s/.]*$/,
  //     // /^[\u0900-\u097F\w\/. ]*$/,
  //     // /^[a-zA-Z0-9/.\s]*$/,
  //     // /^[a-zA-Z0-9/.\s]*$/,
  //     // /^[a-zA-Z0-9\s,/]*$/,

  //     // /^[ऀ-ॿ0-9\s,.@/]+$/,
  //     // /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–]*$/,
  //     /^[0-9\u0900-\u097F\s][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–]*$/,
  //     // /^[\u0900-\u097F]+/,

  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   )
  //   .required(<FormattedLabel id="caseDetailsValidation" />),

  // advocateAddress
  advocateAddress: yup
    .string()
    .matches(
      // /^[A-Za-z0-9.,\s]*$/,
      // /^[a-zA-Z0-9\/. ]*$/,
      // /^(?!\s)[a-zA-Z0-9\s/.]*$/,
      // /^[a-zA-Z0-9,.\-@/:"]*$/,
      // /^[a-zA-Z0-9,.\s@/:"]*$/,
      /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–]*$/,

      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="advocateAddressValidation" />),

  // advocateAddressMr
  // advocateAddressMr: yup
  //   .string()
  //   .matches(
  //     // /^[A-Za-z0-9.,\s]*$/,
  //     // /^[\u0900-\u097F0-9a-zA-Z\s.,]+$/,
  //     // /^[\u0900-\u097F\s.,\d]*$/,
  //     // /^[\u0900-\u097F0-9\s/.]*$/,
  //     // /^(?!\s)[\u0900-\u097F0-9\s/.]*$/,
  //     // /^[ऀ-ॿ0-9\s,.@/]+$/,
  //     /^[0-9\u0900-\u097F\s][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–]*$/,
  //     // /^[ ऀ-ॿ]+$/,

  //     // /^[\u0900-\u097F\s]*$/,
  //     // /^[।,./:"\s0-9]*$/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   )
  //   .required(<FormattedLabel id="advocateAddressValidation" />),

  // locationName
  // locationName: yup
  // .string()
  // .required(<FormattedLabel id='departmentValidation' />),

  // // departmentName
  // departmentName: yup
  // .string()
  // .required(<FormattedLabel id='subDepartmentValidation' />),
});

// Validation for Marathi

export let SchemaMr = yup.object().shape({
  // inwardNo
  inwardNo: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,\
      /^[a-zA-Z0-9]*$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required(<FormattedLabel id="inwardNumberValidation" />),

  // noticeDate
  noticeDate: yup
    .date()
    .required(<FormattedLabel id="fillingDateValidation" />)
    .typeError("Notice Date is required/ सूचना तारीख आवश्यक आहे !!!"),

  // noticeRecivedDate
  noticeRecivedDate: yup
    .date()
    .required(<FormattedLabel id="fillingDateValidation" />)
    .typeError(
      "Notice received  Date is required/ सूचना प्राप्त तारीख आवश्यक आहे !!!"
    ),

  // noticeRecivedFromAdvocatePerson

  // noticeRecivedFromAdvocatePerson: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]*$/,
  //     // /^[a-zA-Z ]*$/,
  //     // /^[A-Za-z\s.]*$/,
  //     // /^[A-Za-z\s.\,\"\:]*$/,
  //     /^[A-Za-z0-9][A-Za-z0-9\s\/()\+\-\:\:\.\,\=\_\`\"\'\;\\.\–]*$/,

  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   )
  //   .required(<FormattedLabel id="advocateNameValidation" />),

  // noticeRecivedFromAdvocatePersonMr
  noticeRecivedFromAdvocatePersonMr: yup
    .string()
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      // /^[\u0900-\u097F\s]*$/,
      // /^[\u0900-\u097F\s.\,\"\:]*$/,
      /^[ऀ-ॿ][ऀ-ॿ0-9\s\\&\*\(\)\[\]\!\-\_\=\''\"\:\;\.\,\\{\}\/\\\अॅ\`\–]*$/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="noticeDetailsValidation" />),

  // noticeDetails
  // noticeDetails: yup
  //   .string()
  //   .matches(
  //     // /^[aA-zZ\s]+$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     // /^[A-Za-z.]*$/,
  //     // /^[a-zA-Z0-9.]*$/,
  //     // /^[a-zA-Z0-9 .]*$/,
  //     // /^[a-zA-Z0-9\/. ]*$/,
  //     // /^(?!\s)[a-zA-Z0-9\s/.]*$/,
  //     // /^[a-zA-Z,./@ ]*$/,
  //     /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–]*$/,

  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   )
  //   .required(<FormattedLabel id="noticeDetailsValidation" />),

  // noticeDetailsMr
  noticeDetailsMr: yup
    .string()
    .matches(
      // /^[aA-zZ\s]+$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^[A-Za-z.]*$/,
      // /^[a-zA-Z0-9.]*$/,
      // /^(?!\s)[\u0900-\u097F0-9\s/.]*$/,
      // /^[\u0900-\u097F\w\/. ]*$/,
      // /^[a-zA-Z0-9/.\s]*$/,
      // /^[a-zA-Z0-9/.\s]*$/,
      // /^[a-zA-Z0-9\s,/]*$/,

      // /^[ऀ-ॿ0-9\s,.@/]+$/,
      // /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–]*$/,
      /^[0-9\u0900-\u097F\s][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–\—]*$/,
      // /^[\u0900-\u097F]+/,

      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="caseDetailsValidation" />),

  // advocateAddress
  // advocateAddress: yup
  //   .string()
  //   .matches(
  //     // /^[A-Za-z0-9.,\s]*$/,
  //     // /^[a-zA-Z0-9\/. ]*$/,
  //     // /^(?!\s)[a-zA-Z0-9\s/.]*$/,
  //     // /^[a-zA-Z0-9,.\-@/:"]*$/,
  //     // /^[a-zA-Z0-9,.\s@/:"]*$/,
  //     /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\–]*$/,

  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   )
  //   .required(<FormattedLabel id="advocateAddressValidation" />),

  // advocateAddressMr
  advocateAddressMr: yup
    .string()
    .matches(
      // /^[A-Za-z0-9.,\s]*$/,
      // /^[\u0900-\u097F0-9a-zA-Z\s.,]+$/,
      // /^[\u0900-\u097F\s.,\d]*$/,
      // /^[\u0900-\u097F0-9\s/.]*$/,
      // /^(?!\s)[\u0900-\u097F0-9\s/.]*$/,
      // /^[ऀ-ॿ0-9\s,.@/]+$/,
      /^[0-9\u0900-\u097F\s][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\–]*$/,
      // /^[ ऀ-ॿ]+$/,

      // /^[\u0900-\u097F\s]*$/,
      // /^[।,./:"\s0-9]*$/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required(<FormattedLabel id="advocateAddressValidation" />),

  // locationName
  // locationName: yup
  // .string()
  // .required(<FormattedLabel id='departmentValidation' />),

  // // departmentName
  // departmentName: yup
  // .string()
  // .required(<FormattedLabel id='subDepartmentValidation' />),
});
