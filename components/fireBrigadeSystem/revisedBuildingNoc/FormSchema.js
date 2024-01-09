import * as yup from "yup";

// schema - validation
let FormSchema = yup.object().shape({
    // appliedFor: yup.string().required("Select applied for !!!"),
    architectName: yup.string().required("Architect name is Required !!!"),
    architectNameMr: yup.string().required("Architect name is Required !!!"),
    architectFirmName: yup.string().required("Architect firm name is Required !!!"),
    architectFirmNameMr: yup.string().required("Architect firm name is Required !!!"),
    architectRegistrationNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Architect registration number is Required !!!"),
    applicantPermanentAddress: yup.string().required("Applicant permanent address is Required !!!"),
    applicantPermanentAddressMr: yup.string().required("Applicant permanent address is Required !!!"),
    siteAddress: yup.string().required("Site address is Required !!!"),
    siteAddressMr: yup.string().required("Site address is Required !!!"),
    applicantContactNo: yup.string().matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, "Applicant contact is not valid").required("Applicant contact number is required"),
    finalPlotNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Final plot number is Required !!!"),
    revenueSurveyNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Revenue survey number is Required !!!"),
    townPlanningNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Town planning number is Required !!!"),
    blockNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Block number is Required !!!"),
    buildingLocation: yup.string().required("Building location is Required !!!"),
    opNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("Op number is Required !!!"),
    citySurveyNo: yup.string().matches(/^[0-9]+$/, "Must be number !!!").required("city survey number is Required !!!"),
    buildingLocationMr: yup.string().required("Building location is Required !!!"),
    // typeOfBuilding: yup.string().required("Select type of building !!!"),
    // nocFor: yup.string().required("Select noc For !!!"),

});

export default FormSchema;
