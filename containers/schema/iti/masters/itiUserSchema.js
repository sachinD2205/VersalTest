
import * as yup from "yup";

let itiUserSchema = yup.object().shape({

    itiKey: yup.string().required("ITI Name is Required"),
    userId: yup.string().required("User is Required"),


});

export default itiUserSchema;
