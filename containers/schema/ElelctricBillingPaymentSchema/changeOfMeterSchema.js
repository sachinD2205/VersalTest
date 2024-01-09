import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";
// schema - validation
let schema = yup.object().shape({
msedclCategoryKey: yup.string().required(<FormattedLabel id="msedclCategoryKeyValidation" />),
meterConnectionDate: yup.string().required(<FormattedLabel id="meterConnectionDateValidation" />),
oldMeterClosingDate: yup.string().required(<FormattedLabel id="oldMeterClosingDateValidation" />),
oldMeterLastReading: yup.string().required(<FormattedLabel id="oldMeterLastReadingValidation" />),
newMeterInstallationDate: yup.string().required(<FormattedLabel id="newMeterInstallationDateValidation" />),
newMeterInitialReading: yup.string().required(<FormattedLabel id="newMeterInitialReadingValidation" />),
meterReadingDate: yup.string().required(<FormattedLabel id="meterReadingDateValidation" />),
newMeterNo: yup.string().required(<FormattedLabel id="newMeterNoValidation" />),
newMeterStatusKey: yup.string().required(<FormattedLabel id="newMeterStatusKeyValidation" />),
reasonForChange: yup.string().required(<FormattedLabel id="reasonForChangeOfMeterValidation" />),
});

export default schema;