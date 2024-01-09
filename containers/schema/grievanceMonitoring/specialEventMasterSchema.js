import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let specialEventMasterSchema =  yup.object().shape({
    // alert
    alert: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="alertDateValidation" />),
    // eventDate
    eventDate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="eventDateValidation" />),

    // eventType
    eventType: yup
      .string()
      .required(<FormattedLabel id="eventTypeValidation" />)
      // .matches(
      //   /^\S/,
      //   "event type name in english is required !!! / कार्यक्रम प्रकाराचे नाव इंग्रजीमध्ये आवश्यक आहे !!!"
      // )
      .max(500, <FormattedLabel id="eventTypeLengthValidation" />),

    // eventTypeMr
    eventTypeMr: yup
      .string()
      .required(<FormattedLabel id="eventTypeMrValidation" />)
      // .matches(
      //   /^[\u0900-\u097F]+/,
      //   "English characters are not allowed in the description !!! / इंग्रजी अक्षरे वर्णनात आवश्यक नाहीत !!!"
      // )
      .max(500, <FormattedLabel id="eventTypeMrLengthValidation" />),
  });

export default specialEventMasterSchema;
