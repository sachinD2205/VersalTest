import * as yup from "yup";

// Schema - validation
let Schema = yup.object().shape({
  ward:yup.number().required("Ward name is Required !!!"),
  electedWard:yup.number().required("Elected Ward Name is Required !!!"),
  firstName:yup.string().required("First Name English is Required !!!"),
  firstNameMr:yup.string().required("First Name Marathi is Required !!!"),
  middleName:yup.string().required("Middle Name English is Required !!!"),
  middleNameMr:yup.string().required("Middle Name Marathi is Required !!!"),
  lastname:yup.string().required("Last Name English is Required !!!"),
  lastnameMr:yup.string().required("Last Name Marathi is Required !!!"),
  gender:yup.string().required("Gender is Required !!!"),
  dateOfBirth:yup.string().required("Date of Birth is Required !!!"),
  religion:yup.number().required("Religion is Required !!!"),
  caste:yup.number().required("Caste is Required !!!"),
  casteCertificateNo:yup.string().required("Caste Certificate No  is Required !!!"),
  party:yup.number().required("Party Name is Required !!!"),
  idProofCategory:yup.number().required("ID Proof Category is Required !!!"),
  idProofNo:yup.string().required("ID Proof No  is Required !!!"),
  panNo:yup.string().required("Pan No is Required !!!"),
  mobileNo:yup.string().required("Mobile no is Required !!!"),
  emailAddress:yup.string().required("Email Address is Required !!!"),
  address:yup.string().required(" Address in English is Required !!!"),
  addressMr:yup.string().required("Address in Marathi is Required !!!"),
  electedDate:yup.string().required("Elected Date is Required !!!"),
  monthlyHonorariumAmount:yup.number().required("Monthly Honarium Amount is Required !!!"),
  resigndate:yup.string().required("Resign Date is Required !!!"),
  bankName:yup.string().required("Bank Name is Required !!!"),
  branchName:yup.string().required("Branch Name is Required !!!"),
  bankMicrCode:yup.string().required("MICR Code is Required !!!"),
  savingAccountNo:yup.number().required("Account no is Required !!!"),
  bankIfscCode:yup.string().required("IFSC Code is Required !!!"),
  reason:yup.string().required("Reason is Required !!!"),
 
});

export default Schema;


