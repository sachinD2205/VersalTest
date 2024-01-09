import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let clusterSchema = yup.object().shape({
  gisId: yup.string().required("GIS Id is Required !!!"),

  clusterNameEng: yup
    .string()
    .required(<FormattedLabel id="slumNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in slum name."
    )
    .max(50, <FormattedLabel id="slumNameReqLength" />),

  // slumKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),

  noOfHuts: yup
    .string()
    .required(<FormattedLabel id="noOfHutsValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),

  totalPopulation: yup
    .string()
    .required(<FormattedLabel id="totalPopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
});

export default clusterSchema;
