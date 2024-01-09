import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
consumptionTypeKey: yup.string().required(<FormattedLabel id="consumptionTypeKeyValidation" />),
usageTypeKey: yup.string().required(<FormattedLabel id="usageTypeKeyValidation" />),
slabTypeKey: yup.string().required(<FormattedLabel id="slabTypeKeyValidation" />),
msedclCategoryKey: yup.string().required(<FormattedLabel id="msedclCategoryKeyValidation" />),
loadTypeKey: yup.string().required(<FormattedLabel id="loadTypeKeyValidation" />),
phaseKey: yup.string().required(<FormattedLabel id="phaseKeyValidation" />),
sanctionedLoad: yup.string().required(<FormattedLabel id="sanctionedLoadValidation" />),
sanctionedDemand: yup.string().required(<FormattedLabel id="sanctionedDemandValidation" />),
connectedLoad: yup.string().required(<FormattedLabel id="connectedLoadValidation" />),
contractDemand: yup.string().required(<FormattedLabel id="contractDemandValidation" />),
msedclDivisionKey: yup.string().required(<FormattedLabel id="msedclDivisionKeyValidation" />),
billingUnitKey: yup.string().required(<FormattedLabel id="billingUnitKeyValidation" />),
subDivisionKey: yup.string().required(<FormattedLabel id="subDivisionKeyValidation" />),
billingCycleKey: yup.string().required(<FormattedLabel id="billingCycleKeyValidation" />),
reasonForChangeOfLoad: yup.string().required(<FormattedLabel id="reasonForChangeOfLoadValidation" />),
});

export default schema;