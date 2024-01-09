import * as yup from "yup";

const schema = yup
  .object({
    firstName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      .required("First Name is required"),
    middleName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      .required("Middle Name is required"),
    lastName: yup
      .string()
      .matches(
        /^[aA-zZ\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      )
      .required("Last Name is required"),
    // .typeError("Firstname is required"),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]*$/, "Must be only digits")
      .typeError("Please Enter Your Mobile Number")
      .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number"),
    // mobileNumber: yup
    //   .string()
    //   .required("Enter mobile number to proceed")
    //   .matches(phoneRegex, "Phone number is not valid"),
    email: yup
      .string()
      .email("Field should contain a valid e-mail")
      .max(255)
      .required("Email address required"),
    gender: yup.string().required().typeError("Please Choose Gender"),
    loginId: yup.string().required("Login id is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    hintQuestion: yup.string().required("Required field"),
    hintQuestionAnswer: yup.string().required("Required field"),
    //emailOtp
    // emailOtp: yup
    //   .string()
    //   .matches(/^[0-9]*$/, "Must be only digits")
    //   .min(6, "Email OTP must be at least 6 number")
    //   .max(6, "Email OTP not valid on above 6 number"),
  })
  .required();

export default schema;
