import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let userBasedOnDepartmentSchema = yup.object().shape({
  // areaKey: yup.string().required("This field is required!"),
  // zoneKey: yup.string().required("This field is required!"),
  // wardKey: yup.string().required("This field is required!"),
  deptKey: yup.string().nullable().required(<FormattedLabel id="deptKeyValidation" />),
  userKey: yup.string().nullable().required(<FormattedLabel id="userKeyValidation" />),
  level: yup.string().nullable().required(<FormattedLabel id="totalLevelsValidation" />),
});

export default userBasedOnDepartmentSchema;
