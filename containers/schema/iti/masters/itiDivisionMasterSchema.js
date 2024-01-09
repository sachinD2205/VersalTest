import * as yup from "yup";

let itiDivisionMasterSchema = yup.object().shape({
  itiKey: yup.string().required("ITI Name is required"),
  tradeKey: yup.string().required("Trade Name is required"),
  divisionName: yup.string().required("Division Name is required"),
  intake: yup.string().matches(/^[0-9]+$/, "Must be only digits").required("Intake Capacity is required"),
});

export default itiDivisionMasterSchema;
