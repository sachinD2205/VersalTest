import * as yup from "yup";

// schema - validation for student divisionSchema form
let divisionSchema = yup.object().shape({
  schoolKey: yup.string().required("School Name is Required"),
  classKey: yup.string().required("Class Name Required"),
  divisionName: yup.string().required("Division Name is Required"),
  divisionPrefix: yup.string().required("Division Prefix is Required"),

  intake: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    // .max(2, "Intake should be less than 100")
    .required("Enter Intake"),
});

export default divisionSchema;
