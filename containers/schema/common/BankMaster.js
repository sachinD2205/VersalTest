import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  bankName: yup
    .string()
    .required("Bank Name is Required !!!")
    .matches(/^[a-zA-Z\s\W]+$/, "Only alphabets are allowed for this field"),

  bankNameMr: yup
    .string()
    .required("Bank Name (In marathi) is Required !!!")
    .matches(
      // /^[\u0900-\u097F\s]*$/,
      /^[०-९\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u0900-\u097F]*$/,
      "Must be only in marathi/ फक्त मराठी मध्ये"
    ),

  branchName: yup
    .string()
    .required("Branch Name is Required !!!")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  branchAddress: yup
    .string()
    .required("Branch Address is Required !!!")
    .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed for this field"),

  // ifscCode: yup
  //   .string()
  //   .matches(/^[0-9a-zA-Z]+$/, "Only numbers and digits are allowed")
  //   .typeError("IFSC Code is Required"),

  ifscCode: yup
    .string()
    .required("IFSC code is required")
    .matches(
      /^([A-Z]{4}0[a-zA-Z0-9]{6})$/,
      "Enter a valid IFSC code, First 4 letters must be capital, 5th letter must be zero and remaining may be number or characters"
    )
    .typeError("Invalid IFSC code"),

  micrCode: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("MICR Code is Required"),

  // contactDetails: yup
  //   .string()
  //   .required("Contact Details is Required !!!")
  //   .matches(/^\d{10}$/, "Invalid Contact Details"),

  contactDetails: yup
    .string()
    .required("Mobile number is Required !!!")
    .matches(/^[6-9][0-9]+$/, "Enter Valid Mobile Number")
    .typeError("Invalid Quantity")
    .min(10, "Mobile Number must be at least 10 number")
    .max(10, "Mobile Number not valid on above 10 number"),

  city: yup
    .string()
    .required("City Name Is Required !!!")
    .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed for this field"),
  district: yup
    .string()
    .required("District Name Is Required !!!")
    .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed for this field"),

  state: yup
    .string()
    .required("State Name Is Required !!!")
    .matches(/^[a-zA-Z\s]*$/, "Only alphabets are allowed for this field"),
});

export default schema;
