import * as yup from "yup";

const levelsOfRolesDaoValidation = {
  role: yup.string().required("Please Choose Role").typeError("Please Choose Role"),
  level: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Please Enter Level Of Role")
    .typeError("Please Enter Level Of Role"),
};

let schema = yup.object().shape({
  service: yup.string().required().typeError("Please Choose Service Name"),
  application: yup.string().required().typeError("Please Choose Application Name"),
  department: yup.string().required().typeError("Please Choose department Name"),

  levelsOfRolesDaoList: yup.array().of(yup.object().shape(levelsOfRolesDaoValidation)),
});

export default schema;
