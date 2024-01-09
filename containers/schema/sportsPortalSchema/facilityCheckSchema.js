import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),
  // venue: yup.string().required(<FormattedLabel id="Vvenue" />),
  durationType: yup.string().required(<FormattedLabel id="VdurationType" />),
  fromDate: yup
    .string()
    .typeError(<FormattedLabel id="VfromDate" />)
    .required(<FormattedLabel id="VfromDate" />),
});

export default Schema;
