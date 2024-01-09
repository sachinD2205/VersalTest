import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  // bill payer details
  finalAhawal: yup.object().shape({
    billPayerName: yup
      .string()
      .required("First Name is Required !!!")
      .typeError("First Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerNameMr: yup
      .string()
      .required("First Name is Required !!!")
      .typeError("First Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerMiddleName: yup
      .string()
      .required("Middle Name is Required !!!")
      .typeError("Middle Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerMiddleNameMr: yup
      .string()
      .required("Middle Name is Required !!!")
      .typeError("Middle Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerLastName: yup
      .string()
      .required("Last Name is Required !!!")
      .typeError("Last Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerLastNameMr: yup
      .string()
      .required("Last Name is Required !!!")
      .typeError("Last Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayeraddress: yup
      .string()
      .required("Address is Required !!!")
      .typeError("Address is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayeraddressMr: yup
      .string()
      .required("Address is Required !!!")
      .typeError("Address is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerVillage: yup
      .string()
      .required("Village is Required !!!")
      .typeError("Village is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerVillageMr: yup
      .string()
      .required("Village is Required !!!")
      .typeError("Village is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerContact: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError("Contact is required")
      // .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number")
      .required(),

    billPayerEmail: yup.string().email("Please enter valid mail"),
  }),
});

export default Schema;
