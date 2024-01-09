import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  buildingHeightFrom: yup.string().matches("", "must be float").typeError(),
  buildingHeightTo: yup
    .number("Number Must Be Required")
    .typeError()
    .min(
      yup.ref("buildingHeightFrom"),
      "Should be bigger than Building Height From"
    ),
});

export default Schema;
