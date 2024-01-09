import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language) => {
  return yup.object().shape({
    // buildingName: yup.string().required("Please Enter Building Name !!!"),
    // wardKey: yup.string().required("Please Select ward !!!"),
    // zoneKey: yup.string().required("Please Select zone !!!"),
    // departmentKey: yup.string().required("Please Select department !!!"),
    visitorName: yup
      .string()
      .required(<FormattedLabel id="visitorNameError" />)
      .matches(/^[a-zA-Z\s]*$/, "Visitor name must only contain letters"),
    // departmentKey: yup.string().required("Please Select Department !!!"),
    // toWhomWantToMeet: yup.string().required("Please Enter Whom to meet !!!"),
    // priority: yup.string().required("Please Select priority !!!"),
    //////////////////////////////////////////////////////////
    // mobileNumber: yup
    //   .string()
    //   .matches(/^(?!0+$)/, language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे")
    //   .min(10, language == "en" ? "Mobile Number must be at least 10 number" : "मोबाईल क्रमांक किमान 10 अंकी असावा")
    //   .max(10, language == "en" ? "Mobile Number not valid on above 10 number" : "मोबाईल नंबर 10 अंकी वर वैध नाही")
    //   .required("Mobile number required"),
    //////////////////////////////////////////////////////////
    mobileNumber: yup
      .string()
      .required(<FormattedLabel id="enterMobileNo" />)
      .matches(/^[6-9][0-9]+$/, "Enter Valid Mobile Number")
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number"),
    //////////////////////////////////////////////////////////
    // searchEmployeeId: yup
    // .string()
    // .matches(/^[0-9]+$/, "Must be only digits")
    // .min(10, "Mobile Number must be at least 10 number")
    // .max(10, "Mobile Number not valid on above 10 number"),
    purpose: yup
      .string()
      .required(<FormattedLabel id="purposeError" />)
      .matches(/^[a-zA-Z\s]*$/, "Purpose must only contain letters"),
    // aadhar_card_no: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="enteraadhaarNo" />)
    //   .matches(
    //     /^[a-zA-Z0-9 ]*$/,
    //     language == "en"
    //       ? "Special characters are not allowed"
    //       : "विशेष वर्णांना परवानगी नाही",
    //   ),
    // aadhar_card_no: yup
    //   .string()
    //   .matches(/^[0-9]+$/, "Must be only digits")
    //   .min(12, "Aadhar Card No. must be at least 12 number")
    //   .max(12, "Aadhar Card No. not valid on above 12 number")
    //   .required("Please Enter Valid Aadhar Card No. !!!"),
    inTime: yup
      .string()
      .nullable()
      .required("Visitor In Date & Time is Required !!!"),
    // searchEmployeeId: yup
    //   .string()
    //   .matches(/^[0-9]+$/, "Must be only digits")
    //   .min(10, "Mobile Number must be at least 10 number")
    //   .max(10, "Mobile Number not valid on above 10 number")
    //   .required("Mobile number required"),
    visitorPhoto: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="visitorPhotoError" />),
  });
};
export default Schema;
