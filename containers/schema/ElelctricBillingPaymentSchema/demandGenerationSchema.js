import * as yup from "yup";
import FormattedLabel from "../../reuseableComponents/FormattedLabel";

const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

// schema - validation
let schema = yup.object().shape({ 
  zoneKey: yup.string().required(<FormattedLabel id="zoneKeyValidation" />),
  // wardKey: yup.string().required(<FormattedLabel id="wardKeyValidation" />),
  departmentKey: yup.string().required(<FormattedLabel id="departmentKeyValidation" />),
  consumerNo: yup.string().required(<FormattedLabel id="consumerNoValidation" />),
  consumerName: yup.string().required(<FormattedLabel id="consumerNameValidation" />),
  consumerAddress: yup.string().required(<FormattedLabel id="consumerAddressValidation" />),
  consumerNameMr: yup.string().required(<FormattedLabel id="consumerNameValidation" />),
  consumerAddressMr: yup.string().required(<FormattedLabel id="consumerAddressValidation" />),

  pinCode: yup
  .string()
  .required(<FormattedLabel id="pinCodeValidtion" />)
  .max(6, <FormattedLabel id="pinCodeValidtionLength" />)
  .matches(/^[0-9]+$/, "Only numbers are allowed in Pincode."),

  mobileNo: yup
  .string()
  .required(<FormattedLabel id="mobileValidtion" />)
  .max(10, <FormattedLabel id="mobileValidtionLength" />)
  .matches(/^[0-9]+$/, "Only numbers are allowed in Mobile No."),

  email: yup
  .string()
  .email(<FormattedLabel id="emailFormatValidtion" />)
  .required(<FormattedLabel id="emailValidtion" />),
  meterNo: yup.string().required(<FormattedLabel id="newMeterNoValidation" />),
  consumptionTypeKey: yup.string().required(<FormattedLabel id="consumptionTypeKeyValidation" />),
  loadTypeKey: yup.string().required(<FormattedLabel id="loadTypeKeyValidation" />),
  phaseKey: yup.string().required(<FormattedLabel id="phaseKeyValidation" />),
  slabTypeKey: yup.string().required(<FormattedLabel id="slabTypeKeyValidation" />),
  usageTypeKey: yup.string().required(<FormattedLabel id="usageTypeKeyValidation" />),
  msedclCategoryKey: yup.string().required(<FormattedLabel id="msedclCategoryKeyValidation" />),
  subDivisionKey: yup.string().required(<FormattedLabel id="subDivisionKeyValidation" />),
  billingUnitKey: yup.string().required(<FormattedLabel id="billingUnitKeyValidation" />),
  departmentCategoryKey: yup.string().required(<FormattedLabel id="departmentCategoryKeyValidation" />),
  meterConnectionDate: yup.string().required(<FormattedLabel id="meterConnectionDateValidation" />),
  newMeterInitialReading: yup.string().required(<FormattedLabel id="initialMeterReadingValidation" />),
  meterReadingDate: yup.string().required(<FormattedLabel id="meterReadingDateValidation" />),
  meterStatusKey: yup.string().required(<FormattedLabel id="newMeterStatusKeyValidation" />),
  sanctionedLoad: yup.string().required(<FormattedLabel id="sanctionedLoadValidation" />),
  connectedLoad: yup.string().required(<FormattedLabel id="connectedLoadValidation" />),
  sanctionedDemand: yup.string().required(<FormattedLabel id="sanctionedDemandValidation" />),
  contractDemand: yup.string().required(<FormattedLabel id="contractDemandValidation" />),

  msedclDivisionKey: yup.string().required(<FormattedLabel id="msedclDivisionKeyValidation" />),
  vanNo: yup.string().required(<FormattedLabel id="vanNoValidation" />),
  billingCycleKey: yup.string().required(<FormattedLabel id="billingCycleKeyValidation" />),
  juniorEnggKey: yup.string().required(<FormattedLabel id="juniorEnggKeyValidation" />),
  dyEngineerKey: yup.string().required(<FormattedLabel id="dyEngineerKeyValidation" />),
  exEngineerKey: yup.string().required(<FormattedLabel id="exEngineerKeyValidation" />),
  accountOfficerKey: yup.string().required(<FormattedLabel id="accountOfficerKeyValidation" />),
  capacityKey: yup.string().required(<FormattedLabel id="loadEquipmentCapacityValidation" />)
});

export default schema;