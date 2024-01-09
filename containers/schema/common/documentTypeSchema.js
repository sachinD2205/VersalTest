import * as yup from "yup";

let schema = yup.object().shape({
    documentTypeEng: yup
    .string()
    .required("  DocumentType Eng is Required !!!"),
    documentTypeMr:yup.string().required("DocumentType Mr is Required"),
});

export default schema;