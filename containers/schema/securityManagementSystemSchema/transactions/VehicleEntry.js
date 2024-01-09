import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language) => {
  return yup.object().shape({
    vehicle_number: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "Vehicle number must only contain letters, numbers"
      )
      .required(<FormattedLabel id="vehicleNoError" />),
    departmentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="departmentError" />),
    // // departmentKey: yup.number().required("Please select an department"),
    // // mobile_number: yup.string().required("Please Enter Mobile Number !!!"),
    driver_name: yup
      .string()
      .required(<FormattedLabel id="driverNameError" />)
      .matches(/^[a-zA-Z\s]+$/, "Must be only characters"),
    buildingName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="buildingNameError" />),
    // employeeKey: yup.string().matches(/^[0-9]+$/, "Must be only digits"),
    employeeKey: yup
      .string()
      .required(<FormattedLabel id="employeeIdError" />)
      .matches(/^[a-zA-Z0-9]+$/, "Must be only characters & digits"),
    // wardKey: yup.string().required("Please Select ward !!!"),
    // zoneKey: yup.string().required("Please Select zone !!!"),
    mobile_number: yup
      .string()
      .required(<FormattedLabel id="enterMobileNo" />)
      .matches(
        /^[6-9][0-9]+$/,
        language == "en" ? "Enter Valid Mobile Number" : "वैध मोबाईल नंबर टाका"
      )
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(10, "Mobile Number must be at least 10 number"),
    // .max(10, "Mobile Number not valid on above 10 number"),
    // mobile_number: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="mobileNoError" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
    //   )
    //   .min(
    //     10,
    //     language == "en"
    //       ? "Mobile Number must be at least 10 number"
    //       : "मोबाईल क्रमांक किमान 10 अंकी असावा"
    //   )
    //   .max(
    //     10,
    //     language == "en"
    //       ? "Mobile Number not valid on above 10 number"
    //       : "मोबाईल नंबर 10 अंकी वर वैध नाही"
    //   ),
    // officeMobileNumber: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="mobileNoError" />)
    //   .matches(
    //     /^[0-9]+$/,
    //     language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
    //   )
    //   .min(
    //     10,
    //     language == "en"
    //       ? "Mobile Number must be at least 10 number"
    //       : "मोबाईल क्रमांक किमान 10 अंकी असावा"
    //   )
    //   .max(
    //     10,
    //     language == "en"
    //       ? "Mobile Number not valid on above 10 number"
    //       : "मोबाईल नंबर 10 अंकी वर वैध नाही"
    //   ),
    officeMobileNumber: yup
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
    // .max(10, "Mobile Number not valid on above 10 number"),
    licence_number: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s]*$/,
        "Building name must only contain letters, numbers"
      )
      .required(<FormattedLabel id="licenceNumberError" />),

    current_meter_reading: yup
      .string()
      .required(<FormattedLabel id="currentMeterReadingError" />)
      .matches(/^[1-9][0-9]+$/, "Must be number, Can't start with zero!!!"),

    vehicle_name: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="vehicleNameError" />),

    // travel_destination: yup.string().required("Please Enter Travel Destination !!!"),
    // licence_number: yup.string().required("Please Enter Licence Number !!!"),
    // approx_km: yup.string().required("Please Enter Approximate kilometers !!!"),
    // approx_km: yup
    //   .required("Mobile number required")
    //   .string()
    //   .matches(/^[0-9]+$/, "Must be only digits")
    //   .min(1, "Mobile Number must be at least 1 number")
    //   .max(6, "Mobile Number not valid on above 6 number"),
    // current_meter_reading: yup.string().matches(/^[0-9]+$/, "Must be only digits"),
    // vehicleInDateTime: yup.string().nullable().required("Vehicle In Date & Time is Required !!!"),
    // vehicleInDateTime: yup
    //   .string()
    //   .nullable()
    //   .required("Vehicle In Date & Time is Required !!!"),
    //   vehicle: yup.boolean()
    //     .required()
    //     .oneOf([0, 1], "Selecting the vehicle field is required"),

    authorityLetter: yup
      .string()
      .nullable()
      .when("isDriverAbsent", {
        is: "Yes",
        then: yup.string().nullable().required("Authority letter required"),
      }),
  });
};

export default Schema;
