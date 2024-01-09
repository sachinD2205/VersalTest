import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
   
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  toDate: yup.string().nullable().required("todate is Required !!!"),
  electedPrabhagPrefix:yup.string().required("Elected Prabhag Prefix is Required !!!"),
  electedPrabhagPrefixMr:yup.string().required("Elected Prabhag Prefix marathi is Required !!!"),
  gisId: yup.string().required("GIS Id is Required !!!"),
  electedPrabhagId: yup.string().required("Elected Prabhag Id is Required !!!"),
  electedPrabhagNo: yup.string().required("Elected Prabhag No is Required !!!"),
  electedPrabhagName: yup.string().required("Elected Prabhag Name in English is Required !!!"),
  electedPrabhagNameMr: yup.string().required("Elected Prabhag Name in Marathi is Required !!!"),
  longitude: yup.string().required(" Longitude is Required !!!"),
  latitude: yup.string().required(" Lattitude is Required !!!"),
});

export default Schema;

