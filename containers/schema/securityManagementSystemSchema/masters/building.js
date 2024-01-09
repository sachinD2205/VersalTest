import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = (language) => {
  return yup.object().shape({
    buildingAddress: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "Building name must only contain letters, numbers"
      )
      .required(<FormattedLabel id="buildingAddressError" />),
    buildingName: yup
      .string()
      .matches(
        // /^[a-zA-Z0-9]*$/,
        /^[a-zA-Z0-9\s]+$/,
        "Building name must only contain letters, numbers"
      )
      .required(<FormattedLabel id="buildingNameError" />),
    buildingNumber: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]*$/,
        language == "en"
          ? "Building number must only contain letters, numbers"
          : "बिल्डिंग नंबरमध्ये फक्त अक्षरे, संख्या असणे आवश्यक आहे"
      )
      .required(<FormattedLabel id="buildingNumberError" />),
    wardKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardKeyError" />),
    zoneKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneKeyError" />),
    departmentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="departmentKeyError" />),
    latitude: yup
      .string()
      .required(<FormattedLabel id="latitudeError" />)
      .matches(
        /^[0-9-]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      ),
    // latitude: yup
    //   .number()
    //   .required(<FormattedLabel id="latitudeR" />)
    //   .min(-90, <FormattedLabel id="latitudeMin" />)
    //   .max(90, <FormattedLabel id="latitudeMax" />)
    //   .typeError(
    //     // language == "en"
    //     //   ? "Latitude must be a number"
    //     //   : "अक्षांश ही संख्या असणे आवश्यक आहे",
    //     <FormattedLabel id="latitudeV" />
    //   ),

    longitude: yup
      .string()
      .required(<FormattedLabel id="longitudeError" />)
      .matches(
        /^[0-9-]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंक असणे आवश्यक आहे"
      ),
    // longitude: yup
    //   .number()
    //   .typeError(
    //     // language == "en"
    //     //   ? "longitude must be a number"
    //     //   : "रेखांश ही संख्या असणे आवश्यक आहे",

    //     <FormattedLabel id="longitudeV" />
    //   )
    //   .required(<FormattedLabel id="longitudeR" />)
    //   .min(-180, <FormattedLabel id="longitudeMin" />)
    //   .max(180, <FormattedLabel id="longitudeMax" />),
    // buildingFloor: yup.string().required("Please Enter Building Floor !!!"),
    buildingFloor: yup
      .string()
      .matches(
        /^[a-zA-Z0-9]*$/,
        language == "en"
          ? "Building floor must only contain letters, numbers"
          : "इमारतीच्या मजल्यावर फक्त अक्षरे, संख्या असणे आवश्यक आहे"
      )
      .required(<FormattedLabel id="buildingFloorError" />),
  });
};
export default Schema;
