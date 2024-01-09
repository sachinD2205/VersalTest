import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation

// maintainanceDate

let Schema = yup.object().shape({
  // zoneName: yup.string().required(<FormattedLabel id="Vzone" />),
  // wardName: yup.string().required(<FormattedLabel id="Vward" />),
  maintenanceRemark: yup.string().required(<FormattedLabel id="Vremark" />),
  facilityName: yup.string().required(<FormattedLabel id="VfacilityName" />),
  facilityType: yup.string().required(<FormattedLabel id="VfacilityType" />),
  // selectSlots: yup.object().required(<FormattedLabel id="VSelectSlot" />),
  // selectSlots: yup
  //   .object()
  //   // .mixed()
  //   // .nullable()
  //   // .default(null)
  //   .required(<FormattedLabel id="VSelectSlot" />),
  venueSectionId: yup.string().required(<FormattedLabel id="Vvenue" />),
  fromDate: yup
    .string()
    .nullable()
    .typeError(<FormattedLabel id="VfromDate" />)
    .required(<FormattedLabel id="VfromDate" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VtoDate" />),
  maintainanceDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="VmaintainanceDate" />),
});

export default Schema;
