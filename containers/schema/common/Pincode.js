import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  pinCode: yup
    .string()
    .required("Pin Code is Required !!!")
    .matches(/^\d{6}$/, "Pin code should be 6 digits"),

  // pinCodeMr: yup
  //   .string()
  //   .required("Pin Code (In marathi) is Required !!!")
  //   .typeError("only numbers are allowed"),
  // .matches(/^\d{६}$/, "Pin code should be 6 digits"),
  // pinCodePrefix:yup.string().required("PinCode Prefix is Required !!!")
  pinCodeMr: yup
    .string()
    .required("Pincode (In Marathi) is Required !!!")
    .matches(
      /[१२३४५६७८९०]{6}/,
      "Must be only in marathi & Please enter 6-digits"
    )
    .min(6, "Please enter a 6-digit Marathi number")
    .max(6, "Please enter a 6-digit Marathi number"),
});

export default schema;
