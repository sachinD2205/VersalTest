import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language) => {
  return yup.object().shape({
    buildingKey: yup
      .string()
      .required(<FormattedLabel id="buildingNameError" />),
    // wardKey: yup.string().required("Please Select ward !!!"),
    // zoneKey: yup.string().required("Please Select zone !!!"),
    departmentKey: yup
      .string()
      .required(<FormattedLabel id="departmentError" />),
    // departmentOnOffStatus: yup.string().required("Please Enter Whom to meet !!!"),
    // lightOnOffStatus: yup.string().required("Please Select priority !!!"),
    // fanOnOffStatus: yup.string().required("Please Enter Mobile Number !!!"),
    floor: yup.string().required(<FormattedLabel id="buildingFloorError" />),
    presentEmployeeCount: yup
      .string()
      .required(<FormattedLabel id="presentEmployeeCountError" />)
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      )
      .min(
        1,
        language == "en"
          ? "Present Employee Count must be at least 1 number"
          : "सध्याच्या कर्मचाऱ्यांची संख्या किमान 1 असणे आवश्यक आहे"
      )
      .max(
        5,
        language == "en"
          ? "Present Employee Count not valid on above 5 number"
          : "सध्याची कर्मचारी संख्या 5 वरील क्रमांकावर वैध नाही"
      ),
    checkupDateTime: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="checkupDateAndTimeError" />),
    // departmentOnOffStatus: yup.boolean(),
    // // .string().required("Selecting the gender field is required")
    // // .oneOf([0, 1]),
    // lightOnOffStatus: yup.boolean(),
    // fanOnOffStatus: yup.boolean(),
    mobileNumber: yup
      .string()
      .required(<FormattedLabel id="enterMobileNo" />)
      .matches(
        /^[6-9][0-9]+$/,
        language == "en" ? "Enter Valid Mobile Number" : "वैध मोबाईल नंबर टाका"
      )
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(
        10,
        language == "en"
          ? "Mobile Number must be at least 10 number"
          : "मोबाइल नंबर किमान 10 नंबर असणे आवश्यक आहे"
      ),
    employeeKey: yup.string().required("Employee name is required"),
    entryBy: yup.string().required("Entry by is required"),

    // "Mobile Number must be at least 10 number")
    // .max(10, "Mobile Number not valid on above 10 number"),
  });
};
export default Schema;
