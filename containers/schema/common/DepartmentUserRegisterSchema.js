import * as yup from "yup";
// const phoneRegex = RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/);

// const schema = yup.object({
// userName: yup.string().required("User name is required"),
// password: yup
//   .string()
//   .required("Password is required")
//   .min(8, "Password is too short - should be 8 chars minimum.")
//   .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
// employeeCode: yup.string().required("Employee code is required"),
// firstName: yup.string().required("First name is required"),
// middleName: yup.string().required("Middle name is required"),
// lastName: yup.string().required("Last name is required"),
// firstNameMr: yup.string().required("First name is required"),
// middleNameMr: yup.string().required("Middle name is required"),
// lastNameMr: yup.string().required("Last name is required"),
// email: yup
//   .string()
//   .email("Field should contain a valid e-mail")
//   .max(255)
//   .required("Email address required"),
// mobileNumber: yup
//   .string()
//   .required("Phone number is required")
//   .matches(phoneRegex, "Phone number is not valid"),
// });
//   .required();

// departmentName: yup.string().required("Required field"),
// designationName: yup.string().required("Required field"),
// applicationName: yup.string().required("Required field"),
// roleName: yup.string().required("Required field"),

const userFieldSchema = {
  officeId: yup.string().required("Please Choose Location Name").typeError("Location Name is required"),
  departmentId: yup
    .string()
    .required("Please Choose Department Name")
    .typeError("Please Choose Department Name"),
  designationId: yup.string().required("Please Choose Designation").typeError("Please Choose Designation"),
};

let Schema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required("First Name is required !!"),
  // middleName: yup
  //   .string()
  //   .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
  //   .required("First Name is required !!"),
  lastName: yup
    .string()
    .matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ")
    .required("First Name is required !!"),
  firstNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("First Name is required !!"),
  // middleNameMr: yup
  //   .string()
  //   .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
  //   .required("First Name is required !!"),
  lastNameMr: yup
    .string()
    .matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द")
    .required("First Name is required !!"),
  email: yup.string().email("Email is not valid").required("Email Id is Required !!!"),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]*$/, "Must be only digits")
    .typeError("Mobile Number is required")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number"),
  // employeeCode:
  // userName:
  // password:
  // primaryOffice: yup.string().required("Please Choose Primary Office Location"),
  // primaryDepartment: yup.string().required("Please Choose Primary Department Name"),
  // primaryDesignation: yup.string().required("Please Choose Primary Designation Name"),
  officeDepartmentDesignationUserDaoLst: yup.array().of(yup.object().shape(userFieldSchema)),
});

export default Schema;
