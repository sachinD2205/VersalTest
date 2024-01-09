import * as yup from "yup";

// schema - validation
let schema = yup.object().shape({
    taxRateChartPrefix: yup
    .string()
    .required("Tax Rate Chart Prefix is Required !!!"),
  // fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate:
  taxName: yup.string().required("Tax Name is Required !!!"),
  percentage:yup.number().typeError('you must specify a number').required("Percentage"),
  rate: yup.number().typeError('you must specify a number').required("rate"),
  // hawkigZone: yup.string().required("Hawking Zone is Required !!!"),
  usageType: yup.string().required("Usage Type is Required !!!"),
  // propertyType: yup.string().required("Property Type is Required !!!")
});
//  Yup.date().required().min(Yup.ref('startDate')),
export default schema;
