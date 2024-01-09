import * as yup from "yup";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";
const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

export let basicInformation = yup.object().shape({
  title: yup.string().required(<FormattedLabel id="titleReq" />),
  firstName: yup.string().required(<FormattedLabel id="firstNmReq" />),
  firstNameMr: yup.string().required(<FormattedLabel id="firstNmMrReq" />),
  middleName: yup.string().required(<FormattedLabel id="middleNmreq" />),
  middleNameMr: yup.string().required(<FormattedLabel id="middleNmMrReq" />),
  surname: yup.string().required(<FormattedLabel id="surnameReq" />),
  surnameMr: yup.string().required(<FormattedLabel id="surnameMrReq" />),
  houseNo: yup
    .string()
    .required(<FormattedLabel id="houseNoReq" />),
    // .max(5, <FormattedLabel id="houseNoMaxLen" />),
  houseNoMr: yup
    .string()
    .required(<FormattedLabel id="houseNoMrReq" />),
    // .max(5, <FormattedLabel id="houseNoMrMaxLen" />),
  buildingNo: yup
    .string()
    .required(<FormattedLabel id="buildingNoReq" />),
    // .max(5, <FormattedLabel id="buildingNoMaxLen" />),
  buildingNoMr: yup
    .string()
    .required(<FormattedLabel id="buildingNoMrReq" />),
    // .max(5, <FormattedLabel id="buildingNoMrMaxLen" />),
  roadName: yup.string().required(<FormattedLabel id="roadNameReq" />),
  roadNameMr: yup.string().required(<FormattedLabel id="roadNameMrReq" />),
  area: yup.string().required(<FormattedLabel id="areaReq" />),
  areaMr: yup.string().required(<FormattedLabel id="areaMrReq" />),
  location: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="locationReq" />),
  locationMr: yup.string().required(<FormattedLabel id="locationMrReq" />),
  city: yup.string().required(<FormattedLabel id="cityReq" />),
  cityMr: yup.string().required(<FormattedLabel id="cityMrReq" />),
  pincode: yup
    .string()
    .required(<FormattedLabel id="pincodeReq" />)
    .max(6, <FormattedLabel id="pincodeMaxLen" />)
    .min(6, <FormattedLabel id="pincodeMinLen" />),
  pincodeMr: yup
    .string()
    .required(<FormattedLabel id="pincodeMrReq" />)
    .max(6, <FormattedLabel id="pincodeMrMaxLen" />)
    .min(6, <FormattedLabel id="pincodeMrMinLen" />),

  email: yup
    .string()
    .required(<FormattedLabel id="emailReq" />)
    .email(<FormattedLabel id="emailInvalid" />),
  mobileNumber: yup
    .string()
    .required(<FormattedLabel id="mobileReq" />)
    .min(10, <FormattedLabel id="mobileMinLen" />)
    .max(10, <FormattedLabel id="mobileMaxLen" />)
    .matches(phoneRegex, "Mobile number is not valid"),
});

export let userGrievanceDetails = () => {
  return yup.object().shape({
    complaintTypeId: yup
      .string()
      .required(<FormattedLabel id="complaintTypeReq" />)
      .nullable(),

    complaintDescription: yup
      .string()
      .required(<FormattedLabel id="complaintDescReq" />)
      .max(1000, <FormattedLabel id="complaintDescMax" />),

    // zone
    zoneKey: yup
      .string()
      .required(<FormattedLabel id="zoneReq" />)
      .nullable(),

    // ward
    wardKey: yup
      .string()
      .required(<FormattedLabel id="wardreq" />)
      .nullable(),

    // officeLocation
    officeLocation: yup
      .string()
      .required(<FormattedLabel id="officeLocationReq" />)
      .nullable(),

    complaintDescriptionMr: yup
      .string()
      .required(<FormattedLabel id="complaintDescMrReq" />)
      .max(1000, <FormattedLabel id="complaintDescMrMax" />),
  });
};
