import * as yup from "yup";

let schema = yup.object().shape({
  gatNameEn: yup
    .string()
    .required("Please enter a gat name.")
    .matches(/^[a-zA-Z\s]+$/, "Only alphabets are allowed for this field"),
  gisLocation: yup.string().required("Please enter a location."),
  gatNameMr: yup.string().required("Gat Name Mr is required."),
});

export default schema;
