import * as yup from "yup";

// schema - validation
let OtherSchema = yup.object().shape({
    // applicantName: yup.string().required("Applicant name is Required !!!"),
    // applicantNameMr: yup.string().required("Applicant name is Required !!!"),

});

export default OtherSchema;
