import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
let Schema = yup.object().shape({
  geoCode: yup
    .string()
    .typeError(<FormattedLabel id="VgisCode" />)
    .required(<FormattedLabel id="VgisCode" />),
  facilityTypeMr: yup
    .string()
    .matches(
      /^[अ-ज्ञs\u0900-\u097F]+$/,
      "Must be only characters / फक्त शब्दात"
    )
    .typeError(<FormattedLabel id="facilityTypeMrMsg" />)
    .required(<FormattedLabel id="facilityTypeMrMsg" />),
  // .required("Facility type name in marathi is Required !!!"),
  // faciltyName: yup.string().required(" Facility Name is Required !!"),
  // facilityType: yup.string().required(" Facility Type is Required !!"),
  facilityType: yup
    .string()
    .typeError(<FormattedLabel id="VfacilityType" />)
    .required(<FormattedLabel id="VfacilityType" />),
  // remark: yup.string().required(" Remark is Required !!"),
  remark: yup
    .string()
    .typeError(<FormattedLabel id="Vremark" />)
    .required(<FormattedLabel id="Vremark" />),
  // facilityId: yup.string().required(" Facility Id is Required !!"),
  // zoneName: yup.string().required(" Zone Name is Required !!"),
  // wardName: yup.string().required(" Ward Name is Required !!"),
});

export default Schema;
