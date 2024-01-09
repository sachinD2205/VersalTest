import * as yup from "yup";

// schema - validation
let OtherDetailSchema = yup.object().shape({
  // overHearWaterTankCoApprovedMaps: yup.string().required("OverHear water is Required !!!"),
  // approvedKeyPlan: yup.string().required("Approved key plan is Required !!!"),
  // approvedLayoutPlanPCMC: yup.string().matches(/^[0-9]+$/, "Approved layout plan must be in number !!!").required("Approved layout plan is Required !!!"),
  // approvedApproachRoadPCMC: yup.string().required("Approved approach is Required !!!"),
  // measurementOfTank: yup.string().required("H   is Required !!!"),
  // measurementOfTank: yup.string().required("Measurement of tank is Required !!!"),
  // explosiveLicense: yup.string().required("Explosive license is Required !!!"),
  // permissionLetterOfPCMC: yup.string().required("Permission letter of PCMC is Required !!!"),
  // completionCertificate: yup.string().required("Completion certificate is Required !!!"),
  // structuralStabilityCertificate: yup.string().required("Structural stability certificate is Required !!!"),
  // escalatorApprovedByGovtCertificate: yup.string().required("escalator is Required !!!"),
  // fireDrawingFloorWiseAlsoApprovedByComplianceAuthority: yup.string().required("Fire drawing is Required !!!"),
});

export default OtherDetailSchema;
