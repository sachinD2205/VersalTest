import * as yup from "yup";

let schoolUserSchema = yup.object().shape({

    schoolKey: yup.string().required("School Name is Required"),
    userId: yup.string().required("User is Required"),


});

export default schoolUserSchema;
