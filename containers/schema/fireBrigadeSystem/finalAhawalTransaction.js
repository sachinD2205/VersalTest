import * as yup from "yup";

// schema - validation
// let Schema = yup.object().shape({
// distanceFromMainFireStation: yup
//   .number()
//   .required()
//   .typeError("Must be Number"),
// distanceFromSubFireStation: yup.number().required("Must be number"),
// constructionLoss: yup.number().required("Must be number"),
// businessSubTypePrefix: yup
//   .string()
//   .required("Business Sub Type Prefix is Required !!!"),
// fromDate: yup.string().nullable().required("From Date is Required !!!"),
// businessType: yup.string().required("Business Type is Required !!!"),
// businessSubType: yup.string().required("Sub Type Business is Required !!!"),
// });

const FormDTLDaoSchema = {
  vardiSlip: yup.object().shape({
    // informerName: yup
    //   .string()
    //   .required("Informer Name is Required !!!")
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // informerMiddleName: yup
    //   .string()
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // informerLastName: yup
    //   .string()
    //   .required("Informer Name is Required !!!")
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // informerNameMr: yup
    //   .string()
    //   .required("Informer Name (In Marathi) is Required !!!")
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
    // informerMiddleNameMr: yup
    //   .string()
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
    // informerLastNameMr: yup
    //   .string()
    //   .required("Informer Name (In Marathi) is Required !!!")
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
    // mailID: yup
    //   .string()
    //   .email("Email is not valid")
    //   .required("Email Id is Required !!!"),
    // contactNumber: yup
    //   .string()
    //   .matches(/^[0-9]+$/, "Must be only digits")
    //   .typeError("Mobile Number is Required !!")
    //   .min(10, "Mobile Number must be at least 10 number")
    //   .max(10, "Mobile Number not valid on above 10 number")
    //   .required(),
    // area: yup
    //   .string()
    //   .required("Informer Name is Required !!!")
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // areaMr: yup
    //   .string()
    //   .required("Informer Name (In Marathi) is Required !!!")
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
    // vardiPlace: yup
    //   .string()
    //   .required("Informer Name is Required !!!")
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // vardiPlaceMr: yup
    //   .string()
    //   .required("Informer Name (In Marathi) is Required !!!")
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
    // city: yup
    //   .string()
    //   .required("Informer Name is Required !!!")
    //   .matches(
    //     /^[aA-zZ\s]+$/,
    //     "Must be only english characters / फक्त इंग्लिश शब्द "
    //   ),
    // cityMr: yup
    //   .string()
    //   .required("Informer Name (In Marathi) is Required !!!")
    //   .matches(
    //     /^[\u0900-\u097F ]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये"
    //   ),
  }),

  // first ahwal

  firstAhawal: yup.object().shape({
    // vardiDispatchTime: yup.string().required(),
    // selfEmployeeInjurred: yup
    //   .number()
    //   .required()
    //   .typeError("Employee Injurred count is required"),
    // selfEmployeeDead: yup
    //   .number()
    //   .required()
    //   .typeError("Employee Dead count is required"),
    // ownerOfPropertyInjurredCount: yup
    //   .number()
    //   .required()
    //   .typeError("Owner Of Property Injurred count is required"),
    // ownerOfPropertyDeadCount: yup
    //   .number()
    //   .required()
    //   .typeError("Owner Of Property Dead count is required"),
    // otherInjurred: yup
    //   .number()
    //   .required()
    //   .typeError("Other Injurred count is required"),
    // otherDead: yup
    //   .number()
    //   .required()
    //   .typeError("Other Dead count is required"),
  }),
};

const ApplicantDetailsSchema = {
  finalAhawal: yup.object().shape({
    citizenNeedToPayment: yup
      .string()
      .required("Citizen Need To Payment is Required !!!")
      .typeError("Citizen Need To Payment is Required !!!"),

    outSidePcmcArea: yup
      .string()
      .required("OutSide Pcmc Area is Required !!!")
      .typeError("OutSide Pcmc Area is Required !!!"),

    pumpingCharge: yup
      .string()
      .required("Pumping Charge is Required !!!")
      .typeError("Pumping Charge is Required !!!"),

    numberOfTrip: yup
      .number()
      .required("Number of trip required")
      .typeError("Number of trip  required"),

    rescueVardi: yup
      .string()
      .required("Rescue Vardi is Required !!!")
      .typeError("Rescue Vardi is Required !!!"),

    thirdCharge: yup
      .string()
      .required("Third Charge is Required !!!")
      .typeError("Third Charge is Required !!!"),

    otherChargesName: yup
      .string()
      .required("Other Charges Name is Required !!!")
      .typeError("Other Charges Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    otherChargesAmount: yup
      .number()
      .required("Other Charges Amount is required")
      .typeError("Other Charges Amount is required"),

    typeOfFire: yup
      .string()
      .required("Type Of Fire is Required !!!")
      .typeError("Type Of Fire is Required !!!"),

    levelOfFire: yup
      .string()
      .required("Level Of Fire is Required !!!")
      .typeError("Level Of Fire is Required !!!"),
  }),
};

const OtherDetailSchema = {
  finalAhawal: yup.object().shape({
    finacialLoss: yup
      .string()
      .required("Finacial Loss is Required !!!")
      .typeError("Finacial Loss is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    finacialLossMr: yup
      .string()
      .required("Bussiness Address is Required !!!")
      .typeError("Bussiness Address is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    lossOfBuildingMaterial: yup
      .string()
      .required("Finacial Loss is Required !!!")
      .typeError("Finacial Loss is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    lossOfBuildingMaterialMr: yup
      .string()
      .required("Bussiness Address is Required !!!")
      .typeError("Bussiness Address is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    otherOutsideLoss: yup
      .string()
      .required("Finacial Loss is Required !!!")
      .typeError("Finacial Loss is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    otherOutsideLossMr: yup
      .string()
      .required("Bussiness Address is Required !!!")
      .typeError("Bussiness Address is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    actual: yup
      .number()
      .required("Approx Loss is required")
      .typeError("Approx Loss is required"),

    saveOfLoss: yup
      .number()
      .required("Save Of Loss is required")
      .typeError("Save Of Loss is required"),

    constructionLoss: yup
      .number()
      .required("Construction Loss is required")
      .typeError("Construction Loss is required"),

    fireLossInformationDetails: yup
      .string()
      .required("Fire Loss Information Details is Required !!!")
      .typeError("Fire Loss Information Details is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    fireLossInformationDetailsMr: yup
      .string()
      .required("Fire Loss Information Details is Required !!!")
      .typeError("Fire Loss Information Details is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    // bill payer details

    billPayerName: yup
      .string()
      .required("First Name is Required !!!")
      .typeError("First Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerNameMr: yup
      .string()
      .required("First Name is Required !!!")
      .typeError("First Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerMiddleName: yup
      .string()
      .required("Middle Name is Required !!!")
      .typeError("Middle Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerMiddleNameMr: yup
      .string()
      .required("Middle Name is Required !!!")
      .typeError("Middle Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerLastName: yup
      .string()
      .required("Last Name is Required !!!")
      .typeError("Last Name is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerLastNameMr: yup
      .string()
      .required("Last Name is Required !!!")
      .typeError("Last Name is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayeraddress: yup
      .string()
      .required("Address is Required !!!")
      .typeError("Address is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayeraddressMr: yup
      .string()
      .required("Address is Required !!!")
      .typeError("Address is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerVillage: yup
      .string()
      .required("Village is Required !!!")
      .typeError("Village is Required !!!")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    billPayerVillageMr: yup
      .string()
      .required("Village is Required !!!")
      .typeError("Village is Required !!!")
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only marathi characters/ फक्त मराठी शब्द"
      ),

    billPayerContact: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError("Contact is required")
      // .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number")
      .required(),

    billPayerEmail: yup.string().email("Please enter valid mail"),
  }),
};

export let formDTLDaoSchema = yup.object().shape({
  formDTLDao: yup.object().shape(FormDTLDaoSchema),
});

export let applicantDTLDaoSchema = yup.object().shape({
  applicantDTLDao: yup.object().shape(ApplicantDetailsSchema),
});

export let otherDetailSchema = yup.object().shape({
  ownerDTLDao: yup.object().shape(OtherDetailSchema),
});

// export default Schema;
