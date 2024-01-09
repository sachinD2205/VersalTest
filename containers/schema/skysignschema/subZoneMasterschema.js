import * as yup from "yup";

let Schema = yup.object().shape({
  zoneKey: yup.string().required("Zone Name is Required !!!"),

  subZoneName: yup.string().required("Sub-Zone Name is Required !!!"),
  subZoneNameMr: yup.string().required("Sub-Zone Name Marathi is Required !!!"),
});

export default Schema;
