import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
let completeSiteVisitSchema = yup.object().shape({
  visitTime: yup
    .string()
    .required(<FormattedLabel id="visitTimeValidation" />)
    .nullable(),
  lattitude: yup
    .string()
    .required(<FormattedLabel id="lattitudeValidation" />)
    .nullable(),
  longitude: yup
    .string()
    .required(<FormattedLabel id="longitudeValidation" />)
    .nullable(),
  geocode: yup
    .string()
    .required(<FormattedLabel id="geocodeValidation" />)
    .nullable(),
  //   toDate: yup.string().nullable().required("To Date is Required !!!"),
  //   ownershipTypePrefix: yup.string().required("Ownership type Prefix is Required"),
  remarks: yup.string().nullable().required(<FormattedLabel id='remarkReq'/>),
  //   ownershipType: yup.string().required("Ownership type is Required"),
  //   ownershipTypeMr: yup.string().required("Ownership type (marathi) is Required"),
});

export default completeSiteVisitSchema;
