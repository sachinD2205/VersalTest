import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    villageName: yup.string().required("village Name is Required !!!"),
    villageNameMr: yup.string().required("village Name Mr is Required !!!"),
});

export default schema;