import * as yup from "yup"
import FormattedLabel from "../../reuseableComponents/FormattedLabel"

// Schema - validation
let Schema = yup.object().shape({
  committee: yup.string().required(<FormattedLabel id="thisFieldIsrequired" />),
  corporatorNo: yup
    .string()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  fromDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  toDate: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="thisFieldIsrequired" />),
  newCorporatorNo: yup.string().nullable(),
  newFromDate: yup.string().when("newCorporatorNo", {
    is: (newCorporatorNo) => !!newCorporatorNo, // Apply when newCorporatorNo is truthy (filled)
    then: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    otherwise: yup.string(), // No validation when newCorporatorNo is not filled
  }),
  newToDate: yup.string().when("newCorporatorNo", {
    is: (newCorporatorNo) => !!newCorporatorNo, // Apply when newCorporatorNo is truthy (filled)
    then: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    otherwise: yup.string(), // No validation when newCorporatorNo is not filled
  }),
  reasonForChange: yup.string().when("newCorporatorNo", {
    is: (newCorporatorNo) => !!newCorporatorNo, // Apply when newCorporatorNo is truthy (filled)
    then: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    otherwise: yup.string(), // No validation when newCorporatorNo is not filled
  }),
  reasonForChangeMr: yup.string().when("newCorporatorNo", {
    is: (newCorporatorNo) => !!newCorporatorNo, // Apply when newCorporatorNo is truthy (filled)
    then: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    otherwise: yup.string(), // No validation when newCorporatorNo is not filled
  }),
})

export default Schema
