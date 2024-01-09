
import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let zoneOfficeDeptSchema = yup.object().shape({
    zoneKey: yup.string().required(<FormattedLabel id="zoneNmReq"/>),
    officeLocationkey: yup.string()
    .required(<FormattedLabel id="officeLocationReq"/>),
    departmentKey: yup.string().required(<FormattedLabel id="deptReq"/>),
});

export default zoneOfficeDeptSchema;