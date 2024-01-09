import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  facilityType: yup.string().required(" Facility Type is Required !!"),
  facilityName: yup.string().required(" Facility Name is Required !!"),
  durationType: yup.string().required(" Duration Type is Required !!"),
});

export default Schema;
