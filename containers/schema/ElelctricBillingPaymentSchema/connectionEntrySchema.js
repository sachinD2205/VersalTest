import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    meterConnectionDate:yup.string().nullable().required("Meter Connection Date is Required !!!"),
  sanctionedDemand: yup.number().nullable(),
  contractDemand: yup.number().nullable(),
  vanNo: yup.string().required("VAN Number is Required !!!"),
  geoCodeGisId: yup.string().required("Geo Code/GIS Id is Required !!!"),
  consumerNo: yup.number().required("Consumer Number is Required !!!"),
  meterNo: yup.number().required("Meter No is Required !!!"),
  billingCycleKey: yup.string().required("Billing Cycle is Required !!!"),
  latitude: yup.number().required("Latitude is Required !!!"),
  longitude: yup.number().required("Longitude is Required !!!"),
});

export default schema;