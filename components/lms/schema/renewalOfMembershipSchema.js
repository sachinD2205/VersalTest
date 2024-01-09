import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

export let renewalOfMembershipSchema = yup.object().shape({
    libraryKey: yup.string().required(<FormattedLabel id="selectLibrary" />),
    membershipNo: yup.string().required(<FormattedLabel id="membershipNo" />),
    membershipMonths: yup.string().required(<FormattedLabel id="membershipMonths" />)

})