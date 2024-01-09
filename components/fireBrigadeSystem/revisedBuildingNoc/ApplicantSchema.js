import * as yup from "yup";

// schema - validation
let ApplicantSchema = yup.object().shape({
    applicantName: yup.string().required("Applicant name is Required !!!"),
    applicantNameMr: yup.string().required("Applicant name is Required !!!"),
    applicantMiddleName: yup.string().required("Applicant middle name is Required !!!"),
    applicantMiddleNameMr: yup.string().required("Applicant middle name is Required !!!"),
    applicantLastName: yup.string().required("Applicant last name is Required !!!"),
    applicantLastNameMr: yup.string().required("Applicant last name is Required !!!"),
    officeContactNo: yup.string().matches(/\(\d{3}\)\s*\d{3}-\d{4}/, "Contact number is not valid (ex. (044) 456-7890)").required("Contact number is not valid (ex. (044) 456-7890) is required"),

    workingSiteOnsitePersonMobileNo: yup.string().matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Mobile number is not valid").required("Mobile number is required"),
    emailId: yup.string().email("Email is not valid").required("Email Id is Required !!!"),
});

export default ApplicantSchema;
