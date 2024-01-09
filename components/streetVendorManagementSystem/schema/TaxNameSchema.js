import * as yup from "yup";

// schema - validation
let TaxNameSchema = yup.object().shape({
  taxNameMasterPrefix: yup
    .string()
    .required("Tax Name Master Prefix is Required !!!"),
  fromDate: yup.string().nullable().required("From Date is Required !!!"),
  // toDate:
  taxName: yup.string().required("Tax Name is Required !!!"),
  prioirtyOfCollectionOrder: yup
    .number()
    .typeError("you must specify a number")
    .required("Prioirty Of Collection Order"),
  priorityOfBillDisplay: yup
    .number()
    .typeError("you must specify a number")
    .required("Priority Of Bill Display"),
  taxType: yup.string().required("Tax Type is Required !!!"),
});
//  Yup.date().required().min(Yup.ref('startDate')),
export default TaxNameSchema;
