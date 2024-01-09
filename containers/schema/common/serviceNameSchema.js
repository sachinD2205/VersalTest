import * as yup from "yup";

let schema = yup.object().shape({
  fromDate: yup.date().required().typeError("From Date is required !!"),

  toDate: yup.date().required().typeError("To Date is required !!"),

  application: yup
    .string()
    .required()
    .typeError("Plase Choose Application Name"),

  department: yup.string().required().typeError("Plase Choose Department Name"),

  serviceName: yup
    .string()
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters / फक्त इंग्लिश शब्द "
    )
    .required("Service Name is Required !!!"),

  serviceNameMr: yup
    .string()
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters/ फक्त मराठी शब्द"
    )
    .required("Service Name is Required !!!"),

  serviceDays: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Service Days is Required")
    .required(),

  displayOrder: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .typeError("Display Order is Required")
    .required(),

  noOfScrutinyLevel: yup
    .number()
    .required()
    .typeError("Plase Enter Scrutiny Level"),

  serviceCode: yup.string().required().typeError("Service Code is required !!"),

  //   scrutinyProcess

  //   rtsSelection: yup
  //     .bool() // use bool instead of boolean
  //     .oneOf([true], "You must Check"),

  //   loiGeneration: yup
  //     .bool() // use bool instead of boolean
  //     .oneOf([true], "You must Check"),

  clickTo: yup
    .string()
    .required()
    .typeError("URL is required !!")
    .matches(
      /^[a-zA-Z\s/]+$/,
      "Only alphabets and '/' are allowed for this field"
    ),
});

export default schema;
