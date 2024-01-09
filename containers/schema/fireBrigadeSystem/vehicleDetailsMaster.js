import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let Schema = (language) => {
  return yup.object().shape({
vTSSystemID:yup
.string()
.required(<FormattedLabel id='vTSSystemIDValidation' />),
vehicleName:yup
.string()
.required(<FormattedLabel id='vehicleNameValidation' />)
.matches(
  /^[A-Za-z@. \-\s]+$/,
  language == "en"
    ? "Must be only english characters"
    : "फक्त इंग्लिश शब्द "
),
vehicleNameMr:yup
.string()
.required(<FormattedLabel id='vehicleNameMrValidation' />)
.matches(/^[\u0900-\u097F]+/, 'Must be only in marathi/ फक्त मराठी मध्ये'),
vehicleNumber:yup
.string()
.required(<FormattedLabel id='vehicleNumberValidation' />),
vehicleType:yup
.string()
.required(<FormattedLabel id='vehicleTypeValidation' />),
fireStationName:yup
.string()
.required(<FormattedLabel id='fireStationNameValidation' />),
gPSDeviceId:yup
.string()
.required(<FormattedLabel id='gPSDeviceIdValidation' />),
  
});
}

