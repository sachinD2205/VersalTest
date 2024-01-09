import * as yup from 'yup'


// schema - validation for student admission form
let teacherSchema = yup.object().shape({

    schoolKey: yup.string().required("School Name is Required"),
    firstName: yup.string().required("Enter First Name"),
    middleName: yup.string().required("Enter Middle Name"),
    lastName: yup.string().required("Enter Last Name"),
    gender: yup.string().required("Select your gender"),
    motherTongueName: yup.string().required("Enter your MotherTongue Name"),
    permanentAddress: yup.string().required("Enter your Permanent Address"),


    contactDetails: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Mobile Number must be 10 number')
        .max(10, 'Mobile Number not valid on above 10 number')
        .required("Enter your Mobile Number"),
    emailDetails: yup
        .string()
        .email('Incorrect format')
        .required("Enter your EmailID"),
    aadharNumber: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(12, 'Adhar Number must be at least 12 number')
        .max(12, 'Adhar Number not valid on above 12 number')
        .required("Enter Your Aadhar Number"),
    pincode: yup
        .string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(6, 'Pincode Number must be at least 6 number')
        .max(6, 'Pincode Number not valid on above 6 number')
        .required("Enter Pincode"),

})

export default teacherSchema;