import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// ;<FormattedLabel id="thisFieldIsrequired" />
// Schema - validation
let Schema = (language) => {
  const duplicateFunc = (l) => {
    if (l == "en") {
      return "Must be only english numbers!"
    } else {
      return "फक्त इंग्रजी संख्या असावी!"
    }
  }

  const duplicateFunc1 = (l) => {
    if (l == "en") {
      return "Must be only english characters with numbers"
    } else {
      return "संख्यांसह फक्त इंग्रजी वर्ण असणे आवश्यक आहे"
    }
  }

  return yup.object().shape({
    firstName: yup
      .string()
      .matches(
        /^[a-zA-Z\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द"
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="firstName" />),

    firstNameMr: yup
      .string()
      .matches(
        /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\s]+$/u,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="firstNameMr" />),

    middleName: yup
      .string()
      .matches(
        /^[a-zA-Z\s\-,.@]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="middleName" />),

    middleNameMr: yup
      .string()
      .matches(
        /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\s]+$/u,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="middleNameMr" />),

    lastName: yup
      .string()
      .matches(
        /^[a-zA-Z\s\-,.@]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="lastName" />),

    lastNameMr: yup
      .string()
      .matches(
        /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\s]+$/u,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      )
      // .min(3, "Minimum 3 characters are required!")
      // .max(30, "You Can't enter more than 30 characters")
      .required(<FormattedLabel id="lastNameMr" />),

    ward: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    gender: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    dateOfBirth: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    religion: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    caste: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    casteCertificateNo: yup
      .string()
      .matches(/^[a-zA-Z0-9\s]+$/, duplicateFunc1(language))
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    party: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    idProofCategory: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    idProofNo: yup
      .string()
      .matches(/^[a-zA-Z0-9\s]+$/, duplicateFunc1(language))
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    aadharNo: yup
      .string()
      .nullable()
      .matches(/^[0-9]{12}$/, {
        message: "Aadhar number must be a 12-digit numeric value",
      })
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    mobileNo: yup
      .string()
      .nullable()
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      )
      .min(
        10,
        language == "en"
          ? "Minimum 10 numbers are required!"
          : "किमान 10 संख्या आवश्यक आहेत!"
      )
      .max(
        10,
        language == "en"
          ? "Can't enter more than 10 numbers"
          : "10 पेक्षा जास्त संख्या टाकू करू शकत नाही"
      )
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    emailAddress: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        language == "en" ? "Invalid Email Format" : "अवैध ईमेल स्वरूप"
      ),
    address: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s\-,.@]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      // .min(20, "Minimum 20 characters are required!")
      // .max(100, "You Can't enter more than 100 characters")
      .required(<FormattedLabel id="address" />),

    addressMr: yup
      .string()
      .matches(
        /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\u0966-\u096F\s]+$/u,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      )
      // .min(20, "Minimum 20 characters are required!")
      // .max(100, "You Can't enter more than 100 characters")
      .required(<FormattedLabel id="addressMr" />),

    electedDate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    bankName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    branchName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    bankMicrCode: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(/^\d+$/, language == "en" ? "Invalid MICR NO." : "अवैध MICR नं.")
      .min(
        9,
        language == "en"
          ? "Minimum 10 numbers are required!"
          : "किमान 10 संख्या आवश्यक आहेत!"
      )
      .max(
        9,
        language == "en"
          ? "Can't enter more than 10 numbers"
          : "10 पेक्षा जास्त संख्या टाकू करू शकत नाही"
      ),

    savingAccountNo: yup
      .string()
      .matches(/^[0-9]+$/, duplicateFunc(language))
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    bankIfscCode: yup
      .string()
      .matches(/^[a-zA-Z0-9\s]+$/, duplicateFunc1(language))
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    resignDate: yup.date().nullable(),

    reason: yup.string().when("resignDate", {
      is: (resignDate) => !!resignDate, // Apply when resignDate is truthy (filled)
      then: yup
        .string()
        .matches(
          /^[a-zA-Z0-9\s\-,.@]+$/,
          "Must be only english characters / फक्त इंग्लिश शब्द "
        ),
      otherwise: yup.string(), // No validation when resignDate is not filled
    }),

    reasonMr: yup.string().when("resignDate", {
      is: (resignDate) => !!resignDate, // Apply when resignDate is truthy (filled)
      then: yup
        .string()
        .matches(
          /^[।\-,.@ँ-ःअ-ऋए-ऑओ-नप-रलळव-हा-ृॅॉॊो-ॐक़-य़ये-ॡ\u0966-\u096F\s]+$/u,
          "Must be only marathi characters/ फक्त मराठी शब्द"
        ),
      otherwise: yup.string(), // No validation when resignDate is not filled
    }),
  })
}
export default Schema
