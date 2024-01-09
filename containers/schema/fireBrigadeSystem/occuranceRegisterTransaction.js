import * as yup from "yup";

// schema - validation
let Schema = yup.object().shape({
  occuranceNo: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number !!!")
    .required("occurance number is required"),
  //   DateOfIncident: yup.date().required("Date of incident is Required !!!"),
  //   timeOfIncident: yup.date().required("Time of incident is Required !!!"),
  occuranceDetails: yup.string().required("occurance details is Required !!!"),
  informerDetails: yup.string().required("Informer details is Required !!!"),
  addressOfInformer: yup
    .string()
    .required("Address of informer is Required !!!"),
  incidanceTookPlace: yup
    .string()
    .required("Incidance took place is Required !!!"),
  damageDetails: yup.string().required("Damage details is Required !!!"),
  // occuranceWithinPCMCArea: yup.string().nullable("Occurance with in PCMC area is Required !!!"),
  chargesIfOutsidePCMC: yup
    .string()
    .required("Charges if out side PCMC is Required !!!"),
  detailsDescriptionOfIncidentSite: yup
    .string()
    .required("Details description of incidentSite is Required !!!"),
  remark: yup.string().required("Remark is Required !!!"),
  gEOLocationOfSite: yup
    .string()
    .required("Geo Location of site is Required !!!"),
});

export default Schema;
