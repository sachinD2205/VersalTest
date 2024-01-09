import * as yup from "yup";
const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

const schema = yup
  .object({
    // departmentName: yup.string().required("Required field"),
    // designationName:yup.string().required("Required field"),
    // userName: yup.string().required("Required field"),
    // applicationName: yup.string().required("Required field"),
    // roleName: yup.string().required("Required field"),
    // employeeName: yup.string().required("Required field"),
  })
  .required();

export default schema;
