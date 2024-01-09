import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

let HawkingAreaZoneSchema = yup.object().shape({
  landMarkId: yup
    .string()
    .nullable()
    .test(
      "is-required",
      <FormattedLabel id='landMarkValidation' />,
      function (value) {
        return value !== null && value !== undefined && value !== "";
      }
    )
    .typeError(<FormattedLabel id='landMarkValidation' />),

  roadId: yup
    .string()
    .nullable()
    .test(
      "is-required",
      <FormattedLabel id='roadNameValidation' />,
      function (value) {
        return value !== null && value !== undefined && value !== "";
      }
    )
    .typeError(<FormattedLabel id='roadNameValidation' />),

  zoneWardAreaMapping: yup
    .string()
    .nullable()
    .test(
      "is-required",
      <FormattedLabel id='zoneWardAreaMapping' />,
      function (value) {
        return value !== null && value !== undefined && value !== "";
      }
    )
    .typeError(<FormattedLabel id='zoneWardAreaMapping' />),
});

export default HawkingAreaZoneSchema;
