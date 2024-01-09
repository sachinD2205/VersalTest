import * as yup from "yup";

let Schema = yup.object().shape({
  zoneKey: yup.string().required("Zone Name is Required !!!"),
  // subZoneAreaKey
  subZoneAreaKey: yup.string().required("Sub-Zone Name is Required !!!"),

  subZoneAreaName: yup.string().required("Sub-Zone  Area Name is Required !!!"),
  subZoneAreaNameMr: yup
    .string()
    .required("Sub-Sub-Zone Area Name is Required !!!"),
});

export default Schema;
