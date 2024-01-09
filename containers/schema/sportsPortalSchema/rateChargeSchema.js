import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  facilityName: yup.string().required("Facility Name is Required !!"),
  facilityType: yup.string().required(" Facility Type is Required !!"),
  venue: yup.string().required("  Venue is Required !!"),
  // duration: yup.string().required("  Duration is Required !!"),
  durationType: yup.string().required("Duration Type is Required !!"),
  chargeType: yup.string().required("Charge Type is Required !!"),
  ammount: yup.string().required("Amount is Required !!"),
  // applicantType: yup.string().required("Applicant Type is Required !!"),

  // subDepartment: yup.string().required(" Sub Department is Required !!"),
  // department: yup.string().required(" Department is Required !!"),
});

export default Schema;
