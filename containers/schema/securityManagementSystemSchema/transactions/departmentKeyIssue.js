import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language, open) => {
  console.log("openOpn", language, open);
  return yup.object().shape({
    departmentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="departmentKeyError" />),
    // mobileNumber: yup.string().required("Please Enter Mobile Number !!!"),
    mobileNumber: yup
      .string()
      .matches(
        /^[0-9]+$/,
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
      .required(<FormattedLabel id="mobileNumberError" />),
    employeeName: yup
      .string()
      .required(<FormattedLabel id="employeeNameError" />)
      .matches(/^[a-zA-Z\s]*$/, "Employee name must only contain letters"),
    buildingName: yup
      .string()
      .required(<FormattedLabel id="buildingNameError" />),
    wardKey: yup.string().nullable().required("Please Select ward !!!"),
    zoneKey: yup.string().nullable().required("Please Select zone !!!"),
    // keyIssueAt: yup.date().required("Date of incident is Required !!!"),
    // keyStatus: yup.string().required("Please Select Departmemt key Status !!!"),
    // keyReceivedAt: yup
    //   .string()
    //   .nullable()
    //   .required("Please Select key Recieved at !!!"),
    otherDepartmentKey: yup
      .string()
      .nullable()
      .when("departmentKeyType", {
        is: "Other Key",
        then: yup
          .string()
          .required(<FormattedLabel id="otherDepartmentKeyError" />),
      }),
    //Modal states
    mobileNumberReturningKey: yup
      .string()
      .nullable()
      .when("personReturningKey", {
        is: false,
        then: yup
          .string()
          .matches(
            /^[0-9]+$/,
            language == "en"
              ? "Must be only digits"
              : "फक्त अंक असणे आवश्यक आहे"
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
          .required(<FormattedLabel id="mobileNumberError" />),
      }),
    employeeNameReturningKey: yup
      .string()
      .nullable()
      .when("personReturningKey", {
        is: false,
        then: yup
          .string()
          .required(<FormattedLabel id="employeeNameError" />)
          .matches(/^[a-zA-Z\s]*$/, "Employee name must only contain letters"),
      }),
  });
};
export default Schema;
