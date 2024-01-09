import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let HawkingZoneWiseFacilitiesSchema = yup.object().shape({
  applicationName: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="applicationNameValidation" />)
    .typeError(<FormattedLabel id="applicationNameValidation" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="fromDateValidation" />)
    .typeError(<FormattedLabel id="fromDateValidation" />),

  facilities: yup
    .string()
    .required(<FormattedLabel id="facilitiesValidation" />)
    .matches(/^[A-Za-z0-9@.,\-\s]+$/, "please enter valid input"),
  facilitiesMr: yup
    .string()
    .required(<FormattedLabel id="facilitiesValidation" />)
    .matches(/^[\u0900-\u097F]+/, "please enter valid input"),
  hawkigZone: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="hawkigZoneValidation" />)
    .typeError(<FormattedLabel id="hawkigZoneValidation" />),
});

export default HawkingZoneWiseFacilitiesSchema;
