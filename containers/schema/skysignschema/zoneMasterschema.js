import * as yup from "yup";

let Schema = yup.object().shape({
  zoneName: yup.string().required("Zone Name is Required !!!"),

  zoneNameMr: yup.string().required("Zone Name Marathi is Required !!!"),
});

export default Schema;
