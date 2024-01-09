import * as yup from "yup";

let itiFeesStructureMasterSchema = yup.object().shape({
  locatedAt: yup.string().matches(/^[aA-zZ\s\u0900-\u097F]+$/, "Must be only characters / फक्त शब्द ").required("Location name required"),

  fees: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Fees Required"),

  deposit: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Deposit fees Required"),
});

export default itiFeesStructureMasterSchema;
