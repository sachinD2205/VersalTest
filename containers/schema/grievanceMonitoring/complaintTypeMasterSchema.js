import * as Yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let complaintTypeMasterSchema =  Yup.object().shape({
    // complaintType
    complaintType: Yup.string()
      .required(<FormattedLabel id="complaintTypeReq" />)
      // .matches(
      //   /^\S/,
      //   "complaint type is required in english !!! / इंग्रजीमध्ये तक्रार प्रकार आवश्यक आहे !!!"
      // )
      .max(500, <FormattedLabel id="complaintTypeMax" />),

    // complaintTypeMr
    complaintTypeMr: Yup.string()
      .required(<FormattedLabel id="complaintTypeMrReq" />)
      .max(500, <FormattedLabel id="complaintTypeMrMax" />),
      // .matches(
      //   /^[\u0900-\u097F0-9\s!@#$%^&*(),.?":{}|<>]*$/,
      //   "English characters are not allowed in the complaint type!!! / इंग्रजी अक्षरे तक्रार प्रकारात आवश्यक नाहीत!!!"
      // ),
    // department
    departmentId: Yup.string()
      .nullable()
      .required(<FormattedLabel id="deptKeyValidation" />),
  });


export default complaintTypeMasterSchema;
