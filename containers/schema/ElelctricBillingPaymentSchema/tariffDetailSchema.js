import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let schema = yup.object().shape({
  energyCharge: yup
    .string()
    .required(<FormattedLabel id="energyChargeRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  fixedDemandCharge: yup
    .string()
    .required(<FormattedLabel id="fixedDemandChargeRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  fromDate: yup.string().required(<FormattedLabel id="fromDateRequired" />),
  toDate: yup.string().required(<FormattedLabel id="toDateRequired" />),
  tariffCategory: yup
    .string()
    .required(<FormattedLabel id="tariffCategoryRequired" />),
  wheelingCharge: yup
    .string()
    .required(<FormattedLabel id="wheelingChargeRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  fromRange: yup
    .string()
    .required(<FormattedLabel id="fromRangeRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  toRange: yup
    .string()
    .required(<FormattedLabel id="toRangeRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
  units: yup
    .string()
    .required(<FormattedLabel id="unitsRequired" />)
    .matches(/^[0-9]+$/, "Must be only digits"),
});

export default schema;
