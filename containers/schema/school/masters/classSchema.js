import * as yup from 'yup'


// schema - validation for student admission form
let classSchema = yup.object().shape({
    
    schoolKey: yup.string().required("School Name is Required"),
    className: yup.string().required("Classname is Required"),
    // classPrefix: yup.string().required("Class Prefix is Required"),

})

export default classSchema;