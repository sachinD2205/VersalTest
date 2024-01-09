import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let ownershipTypeSchema = yup.object().shape({
  // gisId: yup.string().required("GIS Id is Required !!!"),
  fromDate: yup
    .string()

    .required(<FormattedLabel id="slumFromDate" />)
    .nullable(),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="slumToDate" />),
  declarationDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="declarationDateValidation" />),

  slumPrefix: yup
    .string()
    .required(<FormattedLabel id="slumPrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in slum prefix."
    )
    .max(15, <FormattedLabel id="slumPrefixLength" />),
  gisId: yup.string().required(<FormattedLabel id="gisIdReq" />),
  slumName: yup
    .string()
    .required(<FormattedLabel id="slumNameValidation" />)
    .matches(
      /^[a-zA-Z\s]+$/,
      "Only characters and spaces are allowed in slum name."
    )
    .max(50, <FormattedLabel id="slumNameReqLength" />),

  slumNameMr: yup
    .string()
    .required(<FormattedLabel id="slumNameMrValidation" />)
    .matches(
      /^[a-zA-Z\s\u0900-\u097F]+$/,
      "Only characters are allowed in slum name (Marathi)."
    )
    .max(100, <FormattedLabel id="slumNameMrLength" />),
  areaKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),
  ownershipKey: yup
    .string()
    .required(<FormattedLabel id="ownershipKeyValidation" />),
  areaOfSlum: yup
    .string()
    .required(<FormattedLabel id="areaOfSlumValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  // declarationOrder: yup
  //   .string()
  //   .required(<FormattedLabel id="declarationOrderValidation" />),
  noOfHuts: yup
    .string()
    .required(<FormattedLabel id="noOfHutsValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),

  citySurveyNo: yup
    .string()
    .nullable()
    .test({
      name: "surveyOrGatNo",
      test: function (value) {
        const surveyOrGatNo = this.parent.surveyOrGatNo;
        const citySurveyNo = this.parent.citySurveyNo;

        // return (!!surveyOrGatNo && value) || (!surveyOrGatNo && !value);
        return (
          (citySurveyNo && !surveyOrGatNo) ||
          (!citySurveyNo && surveyOrGatNo) ||
          (citySurveyNo && surveyOrGatNo)
        );
      },
      message: "City Survey No is required when Survey No/Gat No is filled.",
    }),

  surveyOrGatNo: yup
    .string()
    .nullable()
    .test({
      name: "citySurveyNo",
      test: function (value) {
        const citySurveyNo = this.parent.citySurveyNo;
        const surveyOrGatNo = this.parent.surveyOrGatNo;

        console.log(
          "value ",
          (surveyOrGatNo && !citySurveyNo) || (!surveyOrGatNo && !citySurveyNo)
        );

        return (
          (surveyOrGatNo && !citySurveyNo) ||
          (!surveyOrGatNo && citySurveyNo) ||
          (surveyOrGatNo && citySurveyNo)
        );
      },
      message: "Survey No/Gat No is required when City Survey No is filled.",
    }),
  declarationOrderNo: yup
    .string()
    .required(<FormattedLabel id="declarationOrderNoValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  hutOccupiedArea: yup
    .string()
    .required(<FormattedLabel id="hutOccupiedAreaValidation" />),
  totalPopulation: yup
    .string()
    .required(<FormattedLabel id="totalPopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  malePopulation: yup
    .string()
    .required(<FormattedLabel id="malePopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  femalePopulation: yup
    .string()
    .required(<FormattedLabel id="femalePopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  scPopulation: yup
    .string()
    .required(<FormattedLabel id="scPopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  // zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  // clusterkey: yup
  //   .string()
  //   .required(<FormattedLabel id="clusterKeyValidation" />),
  // wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  // villageKey: yup
  //   .string()
  //   .required(<FormattedLabel id="villageKeyValidation" />),
  villageKey: yup
    .array()
    .test(
      "villageKey",
      <FormattedLabel id="villageNameValidation" />,
      (value) => {
        
        console.log("value__",  value);
        return value && value.length > 0;
      }
    )
    .nullable(),

  zoneKey: yup
    .array()
    .test("zoneKey", <FormattedLabel id="zoneNameValidation" />, (value) => {
     
      return value && value.length > 0;
    })
    .nullable(),

  wardKey: yup
    .array()
    .test("wardKey", <FormattedLabel id="wardNameValidation" />, (value) => {
      return value && value.length > 0;
    })
    .nullable(),

  clusterKey: yup
    .array()
    .test(
      "clusterKey",
      <FormattedLabel id="clusterNameValidation" />,
      (value) => {
        return value && value.length > 0;
      }
    )
    .nullable(),
  stPopulation: yup
    .string()
    .required(<FormattedLabel id="stPopulationValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  otherPopulation: yup
    .string()
    .required(<FormattedLabel id="otherPopulationValidation" />),
  slumBoundaryInfo: yup
    .string()
    .required(<FormattedLabel id="slumBoundaryInfoValidation" />),
  slumStatus: yup
    .string()
    .required(<FormattedLabel id="slumStatusValidation" />),
});

export default ownershipTypeSchema;
