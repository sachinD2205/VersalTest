import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let hutMasterSchema = yup.object().shape({
  hutPrefix: yup
    .string()
    .required(<FormattedLabel id="hutPrefixValidation" />)
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only characters and numbers are allowed in Hut Prefix."
    )
    .max(15, <FormattedLabel id="hutPrefixLength" />),

  zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  clusterKey: yup.string().required(<FormattedLabel id="clusterKeyValidation" />),
  wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  gisId: yup.string().required(<FormattedLabel id="gisIdReq" />),
  hutNo: yup.string().required(<FormattedLabel id="hutNoValidation" />),
  gisId: yup.string().required(<FormattedLabel id="gisIdReq" />),
  lattitude: yup.string().required(<FormattedLabel id="latitudeReq" />),
  longitude: yup.string().required(<FormattedLabel id="LongitudeReq" />),


  
  slumKey: yup.string().required(<FormattedLabel id="slumKeyValidation" />),
  areaOfHut: yup
    .string()
    .required(<FormattedLabel id="areaOfHutValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  ownershipKey: yup
    .string()
    .required(<FormattedLabel id="ownershipKeyValidation" />),
  constructionTypeKey: yup
    .string()
    .required(<FormattedLabel id="constructionTypeKeyValidation" />),
  usageTypeKey: yup
    .string()
    .required(<FormattedLabel id="usageTypeKeyValidation" />),
  //   usageSubTypeKey: yup
  //     .string()
  //     .required(<FormattedLabel id="usageSubTypeKeyValidation" />),
  length: yup
    .string()
    .required(<FormattedLabel id="lengthValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  breadth: yup
    .string()
    .required(<FormattedLabel id="breadthValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  height: yup
    .string()
    .required(<FormattedLabel id="heightValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  partNoInList: yup
    .string()
    .required(<FormattedLabel id="partNoInListValidation" />),
  // rehabilitation: yup.string().required("Rehabilitaion is Required"),
  // eligibility: yup.string().required("Eligibility Required"),
  // waterConnection: yup.string().required("Water Connection is Required"),
  noOfFloors: yup
    .string()
    .required(<FormattedLabel id="noOfFloorsValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  maleCount: yup
    .string()
    .required(<FormattedLabel id="maleCountValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  femaleCount: yup
    .string()
    .required(<FormattedLabel id="femaleCountValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  totalFamilyMembers: yup
    .string()
    .required(<FormattedLabel id="totalFamilyMembersValidation" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  areaKey: yup.string().required(<FormattedLabel id="areaKeyValidation" />),
  villageKey: yup
    .string()
    .required(<FormattedLabel id="villageKeyValidation" />),
  //   cityKey: yup.string().required(<FormattedLabel id="cityKeyValidation" />),
  pincode: yup
    .string()
    .required(<FormattedLabel id="pinCodeValidtion" />)
    .matches(/^[0-9]+$/, "please enter number only")
    .min(6, <FormattedLabel id="pinCodeValidtionMinLength" />)
    .max(6, <FormattedLabel id="pinCodeValidtionLength" />),
  // lattitude: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Latitude is Required"),
  // longitude: yup.string().matches(/^[0-9]+$/, 'Must be only digits').required("Longitude is Required"),
  assemblyConstituency: yup
    .string()
    .required(<FormattedLabel id="assemblyConstituencyValidation" />),
  correction: yup
    .string()
    .required(<FormattedLabel id="correctionValidation" />),
  // remarks: yup.string().required("Remarks is Required"),
});

export default hutMasterSchema;
