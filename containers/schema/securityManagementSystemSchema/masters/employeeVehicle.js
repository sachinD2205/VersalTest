import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language) => {
  return yup.object().shape({
    vehicleNumber: yup
      .string()
      .matches(
        // /^[a-zA-Z0-9]*$/,
        /^[a-zA-Z0-9\s]*$/,
        "Building name must only contain letters, numbers"
      )
      .required(<FormattedLabel id="vehicleNoError" />),
    // employeeKey: yup.string().required("Please Enter Employee Key !!!"),
    employeeKey: yup
      .string()
      .required(<FormattedLabel id="employeeIdError" />)
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      ),

    // employeeName: yup.string().required("Please Enter Employee Name !!!"),
    employeeName: yup
      .string()
      .required(<FormattedLabel id="employeeNameError" />)
      .matches(
        /^[A-Z a-z]+$/,
        language == "en" ? "Must be only string" : "फक्त अक्षर असणे आवश्यक आहे"
      )
      .typeError(),
    employeeMobileNumber: yup
      .string()
      .required(<FormattedLabel id="mobileNoError" />)
      .matches(
        /^(?!0+$)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
        language == "en" ? "Phone number is not valid" : "फोन नंबर वैध नाही"
      )
      .min(
        10,
        language == "en"
          ? "Mobile Number must be at least 10 number"
          : "मोबाईल क्रमांक किमान 10 अंकी असावा"
      )
      .max(
        10,
        language == "en"
          ? "Mobile Number not valid on above 10 number"
          : "मोबाईल नंबर 10 अंकी वर वैध नाही"
      )
      .typeError(),
    officerName: yup
      .string()
      .required(<FormattedLabel id="officerNameError" />)
      .matches(
        /^[A-Z a-z]+$/,
        language == "en" ? "Must be only string" : "फक्त अक्षर असणे आवश्यक आहे"
      )
      .typeError(),
    officeMobileNumber: yup
      .string()
      .required(<FormattedLabel id="mobileNoError" />)
      .matches(
        /^(?!0+$)\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      )
      .min(
        10,
        language == "en"
          ? "Mobile Number must be at least 10 number"
          : "मोबाईल क्रमांक किमान 10 अंकी असावा"
      )
      .max(
        10,
        language == "en"
          ? "Mobile Number not valid on above 10 number"
          : "मोबाईल नंबर 10 अंकी वर वैध नाही"
      )
      .typeError(),
    // employeeMobileNumber: yup
    //   .string()
    //   .required("Please Enter Employee Mobile Number !!!"),
    vehicleAllotedAt: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="vehicleAllotedAttError" />),
    departmentKey: yup
      .string()
      .required(<FormattedLabel id="departmentError" />),
    vehicleType: yup
      .string()
      .required(<FormattedLabel id="vehicleTypeError" />),
    fromDateAllocated: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="vehicleAllotedFromError" />),
    toDateAllocated: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="vehicleAllotedAtError" />),
  });
};

export default Schema;
