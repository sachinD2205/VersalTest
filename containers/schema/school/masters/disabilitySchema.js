import * as yup from 'yup'


// schema - validation for disabilitySchema
let disabilitySchema = yup.object().shape({

    typeOfDisability: yup.string().matches(/^[aA-zZ\s]+$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required("Type Of Disability is required"),
    typeOfDisabilityMr: yup.string().matches(/^[\u0900-\u097F]+/, "Must be only marathi characters/ फक्त मराठी शब्द").required("Type Of Disability in Marathi is required"),
    remark: yup.string().required("remark required")


})

export default disabilitySchema;