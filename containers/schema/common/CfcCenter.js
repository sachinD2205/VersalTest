import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  wardId: yup.string().nullable().required("Ward Is Required !!"),
  zoneId: yup.string().nullable().required("Zone Is Required !!"),
  cfcName: yup.string().required("CFC Name is Required !!"),
  cfcOwnerName: yup.string().required("CFC Owner Name Is Required !!"),
  cfcAddress: yup.string().required("CFC Address Is Required !!"),
  cfcGisID: yup.string().required("CFC GIS ID Is Required !!"),
  cfcGstinNo: yup
    .string()
    .required("CFC GSTIN No Is Required !!")
    .matches(/^[0-9A-Z]{15}$/, "Enter a valid GST Number")
    .min(15, "GST number must be at least 15")
    .max(15, "GST number is not valid on above 15 number"),
  cfcOwnerAadharNo: yup
    .string()
    .required("CFC Owner Aadhar No is Required!!")
    .typeError("Invalid Quantity")
    .min(12, "Aadhaar number must be at least 12 number")
    .max(12, "Aadhaar number is not valid on above 12 number")
    .matches(/^[0-9]+$/, "Must be only digits"),
  cfcOwnerPanNo: yup
    .string()
    .required("CFC Owner PAN No is Required!!")
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]/, "Invalid PAN Number Format")
    .min(10, "PAN Number must be 10 characters long")
    .max(10, "PAN Number must be 10 characters long"),
  licenseNo: yup
    .string()
    .required("License No is Required !!")
    .matches(/^[0-9]+$/, "License No must consist of numeric digits"),
  walletId: yup.string().required("Wallet Id is Required !!"),
  BankName: yup
    .string()
    .required("Bank Name is Required !!")
    .matches(
      /^[A-Za-z\s.-]+$/,
      "Bank Name can only contain letters, spaces, full stop and hyphens"
    ),
  accountNumber: yup
    .string()
    .required("Account Number is Required !!")
    .matches(/^[0-9]+$/, "Account Number must consist of numeric digits"),
  branchNumber: yup
    .string()
    .required("Branch Code is Required !!")
    .matches(
      /^[A-Za-z0-9]+$/,
      "Branch Code can only contain letters and numbers"
    ),
  branchAddress: yup
    .string()
    .required("Branch Address is Required !!")
    .matches(
      /^[A-Za-z0-9]+$/,
      "Branch Address can only contain letters and numbers"
    ),
  ifscCode: yup
    .string()
    .required("IFSC code is required")
    .matches(
      /^([A-Z]{4}0[a-zA-Z0-9]{6})$/,
      "Enter a valid IFSC code, First 4 letters must be capital, 5th letter must be zero and remaining may be number or characters"
    )
    .typeError("Invalid IFSC code"),
  microde: yup
    .string()
    .required("MICR Code is Required!!")
    .matches(/^\d{9}$/, "Invalid MICR Code Format")
    .min(9, "MICR Code must be 9 digits long")
    .max(9, "MICR Code must be 9 digits long"),
  maximumDailyLimitForWalletRechargeRs: yup
    .string()
    .required("Maximum Daily Limit For Wallet Recharge (Rs) is Required !!")
    .matches(/^\d+(\.\d+)?$/, "Number must consist of numeric digits"),
  threshholdBalanceRs: yup
    .string()
    .required("Threshhold Balance (Rs) is Required !!")
    .matches(
      /^\d+(\.\d+)?$/,
      "Threshhold Balance must consist of numeric digits"
    ),
  minimumBalanceRs: yup
    .string()
    .required("Minimum Balance (Rs) is Required !!")
    .matches(/^\d+(\.\d+)?$/, "Minimum Balance must consist of numeric digits"),
  BalanceAvailableRs: yup
    .string()
    .required("Balance Available (Rs) is Required !!")
    .matches(
      /^\d+(\.\d+)?$/,
      "Balance Available must consist of numeric digits"
    ),
});

export default schema;
