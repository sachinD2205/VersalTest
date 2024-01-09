import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
  zoneKey: yup.string().nullable().required("Zone name is Required !!!"),
  wardKey: yup.string().nullable().required("Ward name is Required !!!"),
  village: yup.string().required("village Name is Required !!!"),
  gisId: yup.string().required("GIS ID is Required !!!"),
  libraryName: yup.string().required("Library Name is Required !!!"),
  libraryNameMr: yup
    .string()
    .required("Library Name Mr is Required !!!")
    .matches(
      /^[a-zA-Z\s\u0900-\u0965\u096F-\u097F]+$/,
      "Only alphabets and spaces are allowed for this field"
    ),
  libraryType: yup.string().nullable().required("Library Type is Required !!!"),
  libraryClassification: yup
    .string()
    .nullable()
    .required("Library Administrative status is Required !!!"),
});

export default schema;
