import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

// schema - validation
export let buildingRateChartShema = (language) => {
  return yup.object().shape({
    typeOfUsageId: yup
      .string()
      .required(<FormattedLabel id='typeOfBuildingValidation' />)
      .typeError(<FormattedLabel id='typeOfBuildingValidation' />),

    parishishtha: yup
      .string()
      .required(<FormattedLabel id='parishishthaValidation' />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द "
      ),

    preminumPerSqm: yup
      .number()
      .required(<FormattedLabel id='preminumPerSqmValidation' />)
      .typeError(<FormattedLabel id='preminumPerSqmValidation' />),

    buildingHeightFrom: yup
      .number()
      .required(<FormattedLabel id='buildingHeightFromValidation' />)
      .typeError(<FormattedLabel id='buildingHeightFromValidation' />),

    buildingHeightTo: yup
      .number()
      .required(<FormattedLabel id='buildingHeightToValidation' />)
      .typeError(<FormattedLabel id='buildingHeightToValidation' />),

    preminumMinimumRate: yup
      .number()
      .required(<FormattedLabel id='preminumMinimumRateValidation' />)
      .typeError(<FormattedLabel id='preminumMinimumRateValidation' />),

    // parishishtha: "",
    // typeOfUsageId: "",
    // buildingHeightFrom: "",
    // buildingHeightTo: "",
    // preminumPerSqm: "",
    // preminumMinimumRate: "",
  });
};
// export default schema;
