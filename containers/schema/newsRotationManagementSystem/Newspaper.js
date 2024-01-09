import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

let Schema = yup.object().shape({
  // newspaperAgencyName: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये "
  //   )
  //   .required("news paper Agency name is Required "),
  // newspaperAgencyNameMr: yup
  //   .string()
  //   .nullable()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये ")
  //   .required("news paper Agency name is Required "),
  // newspaperName: yup
  //   .string()
  //   .matches(
  //     /^[A-Za-z0-9@-\s]+$/,
  //     "Must be only in english / फक्त इंग्लिश मध्ये "
  //   )
  //   .required("news paper Name is Required "),
  // newspaperNameMr: yup
  //   .string()
  //   .nullable()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये ")
  //   .required("news paper Name is Required "),
  contactNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits / फक्त अंक असणे आवश्यक आहे")
    .typeError()
    .min(
      10,
      "Mobile Number must be at least 10 number / मोबाईल क्रमांक किमान 10 क्रमांकाचा असावा"
    )
    .max(
      10,
      "Mobile Number not valid on above 10 number / 10 वरील नंबरवर मोबाईल नंबर वैध नाही"
    )
    .required("contact Number is Required / संपर्क क्रमांक आवश्यक आहे"),
  emailId: yup
    .string()
    .email("Incorrect format / चुकीचे स्वरूप")
    .required("Email is Required / ईमेल आवश्यक आहे"),
  address: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required("Address is Required / पत्ता आवश्यक आहे"),
  addressMr: yup
    .string()
    .nullable()
    .matches(/^[\u0900-\u097F]+/, "Must be only in marathi / फक्त मराठी मध्ये ")
    .required("Address is Required / पत्ता आवश्यक आहे"),
  accountNo: yup
    .string()
    .matches(
      /^[0-9]{9,18}$/,
      "Length must be between 9-18 & Only numbers are allowed / लांबी 9-18 च्या दरम्यान असणे आवश्यक आहे आणि फक्त संख्यांना अनुमती आहे"
    )
    .required("Account Number is required"),
  bank: yup.string().required("Bank Name is Required / बँकेचे नाव आवश्यक आहे"),
  branch: yup
    .string()
    .matches(
      /^[A-Za-z0-9@-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये "
    )
    .required("Bank Name is Required / बँकेचे नाव आवश्यक आहे"),
  ifsc: yup
    .string()
    .matches(
      /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/,
      "Enter valid IFSC code/ वैध IFSC कोड प्रविष्ट करा "
    )
    .required("IFSC code is Required / IFSC कोड आवश्यक आहे"),
});

export default Schema;
