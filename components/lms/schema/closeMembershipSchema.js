import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let closeMembershipSchema = yup.object().shape({
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    membershipNo: yup.string().required(<FormattedLabel id="membershipNo" />),
    reason: yup.string().required(<FormattedLabel id="reason" />),

})