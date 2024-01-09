import * as yup from "yup";

let Schema = yup.object().shape({
  zoneId: yup.string().required("Zone Name is Required !!!"),
  //   subZoneName: yup.string().required("Sub-Zone Name is Required !!!"),
  userId: yup.string().required("User Id is Required !!!"),
});

export default Schema;
