import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let totalLevelsAndDefaultDurationSchema = yup.object().shape({
  areaKey: yup.string().required(<FormattedLabel id="areaReq" />).nullable(),
  // zoneKey: yup.string().required("This field is required!"),
  // wardKey: yup.string().required("This field is required!"),
  complaintTypeKey: yup.string().required(<FormattedLabel id="complaintTypeReq" />).nullable(),
  deptKey: yup.string().required(<FormattedLabel id="deptKeyValidation" />).nullable(),
  totalLevels: yup
    .string()
    .required(<FormattedLabel id="totalLevelsValidation" />),
  selectedOption: yup
    .string()
    .required(<FormattedLabel id="selectedOptionValidation" />),
});

export default totalLevelsAndDefaultDurationSchema;
