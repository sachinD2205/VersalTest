import * as yup from "yup"

// schema - validation
const schema = yup.object().shape({
  moduleKey: yup.string().nullable().required("This Field Is Required!!!"),

  benchmarkType: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),

  parameterName: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!")
    .matches(/^[a-zA-Z .]+$/, "Only letters, spaces, and periods are allowed"),
  calculationMethod: yup
    .string()
    .nullable()
    .required("This Field Is Required!!!"),
    benchmarkValue: yup
    .mixed()
    .test('is-number-or-space', 'Only numbers and spaces are allowed', value => {
      if (value === null || value === undefined || value === '') {
        return false; // Accepts null, undefined, or empty string
      }
      return /^[0-9\s]*$/.test(value); // Validates numbers and spaces
    })
    .required("This Field Is Required!!!")
    .typeError('Please enter a valid number or leave it empty'),
  frequency: yup.string().nullable().required("This Field Is Required!!!"),
})

export default schema
