import * as yup from "yup";

let schema = yup.object().shape({
  // departmentType: yup
  //   .string()
  //   .required("Please select a department")
  //   .typeError("Please select a department"),
  // petAnimalKey: yup
  //   .number()
  //   .required("Please select an animal")
  //   .typeError("Please select an animal"),
  fromDate: yup
    .date()
    .typeError(`Please select a from Date`)
    .required(`Please select a from Date`),
  toDate: yup
    .date()
    .typeError(`Please select a to Date`)
    .required(`Please select a to Date`),
});

export default schema;
