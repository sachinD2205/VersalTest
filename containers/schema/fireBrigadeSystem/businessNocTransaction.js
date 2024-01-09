import * as yup from "yup";

// default schema
export let defaultSchema = yup.object().shape({
  // nocType: yup.string().required("Noc Type is required..!!"),
  // // Applicant Details
  // applicantName: yup
  //   .string()
  //   .required("applicantName is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // applicantMiddleName: yup
  //   .string()
  //   .required("applicant Middle is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // applicantLastName: yup
  //   .string()
  //   .required("applicant Last is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // applicantNameMr: yup
  //   .string()
  //   .required("Applicant Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // applicantMiddleNameMr: yup
  //   .string()
  //   .required("Applicant Middle Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // applicantLastNameMr: yup
  //   .string()
  //   .required("Applicant Last Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // mobileNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError("Mobile number is required")
  //   .min(10, "Mobile Number must be at least 10 number")
  //   .max(10, "Mobile Number not valid on above 10 number")
  //   .required(),
  // emailId: yup.string().email("Incorrect format"),
  // applicantAddress: yup.string().required("Applicant Address is Required !!!"),
  // applicantAddressMr: yup
  //   .string()
  //   .required("Applicant Address is Required !!!"),
  // Owner Details
  // ownerName: yup
  //   .string()
  //   .required("Owner Name is Required !!!")
  //   .typeError("Owner Name is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // ownerMiddleName: yup
  //   .string()
  //   .required("Owner Middle Name is Required !!!")
  //   .typeError("Owner Middle Name is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // ownerLastName: yup
  //   .string()
  //   .required("Owner Last Name is Required !!!")
  //   .typeError("Owner Last Name is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // ownerNameMr: yup
  //   .string()
  //   .required("Owner Name is Required !!!")
  //   .typeError("Owner Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // ownerMiddleNameMr: yup
  //   .string()
  //   .required("Owner Middle Name is Required !!!")
  //   .typeError("Owner Middle Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // ownerLastNameMr: yup
  //   .string()
  //   .required("Owner Last Name is Required !!!")
  //   .typeError("Owner Last Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // ownerAddress: yup
  //   .string()
  //   .required("Owner Address is Required !!!")
  //   .typeError("Owner Address is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // ownerAddressMr: yup
  //   .string()
  //   .required("Owner Address is Required !!!")
  //   .typeError("Owner Address is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // ownerMobileNo: yup
  //   .string()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .typeError("Mobile number is required")
  //   .min(10, "Mobile Number must be at least 10 number")
  //   .max(10, "Mobile Number not valid on above 10 number")
  //   .required(),
  // ownerEmailId: yup
  //   .string()
  //   .required("Email Required..!!")
  //   .typeError("Email Required..!!")
  //   .email("Incorrect format"),
  // Business Details
  // firmName: yup
  //   .string()
  //   .required("Firm Name is required")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // firmNameMr: yup
  //   .string()
  //   .required("Firm Name is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
  // zoneKey: yup.string().required("Please Select Zone"),
  // propertyNo: yup
  //   .number()
  //   .required("Property Number is required...!!")
  //   .typeError("Property Number is required...!!"),
  // shopNo: yup
  //   .number()
  //   .required("Shop Number is required...!!")
  //   .typeError("Shop Number is required...!!"),
  // plotNo: yup
  //   .number()
  //   .required("Plot Number is required...!!")
  //   .typeError("Plot Number is required...!!"),
  // buildingName: yup
  //   .string()
  //   .required("Building Name is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // gatNo: yup
  //   .number()
  //   .required("Gat Number is required...!!")
  //   .typeError("Gat Number is required...!!"),
  // citySurveyNo: yup
  //   .number()
  //   .required("City Survey Number is required...!!")
  //   .typeError("City Survey Number is required...!!"),
  // roadName: yup
  //   .string()
  //   .required("Road Name is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // landmark: yup
  //   .string()
  //   .required("Landmark is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // area: yup.string().required("Area is Required !!!"),
  // village: yup
  //   .string()
  //   .required("Village is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // pincode: yup
  //   .string()
  //   .typeError("Pin Code is required")
  //   .required()
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(6, "Pincode Number must be at least 6 number")
  //   .max(6, "Pincode Number not valid on above 6 number"),
  // officeContactNo: yup
  //   .string()
  //   .required("Office Contact Number is required..!!")
  //   .typeError("Office Contact Number is required..!!")
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   .max(10, "Mobile Number not valid on above 10 number"),
  // unit: yup
  //   .number()
  //   .required("Gat Number is required...!!")
  //   .typeError("Gat Number is required...!!"),
  // height: yup
  //   .number()
  //   .required("Gat Number is required...!!")
  //   .typeError("Gat Number is required...!!"),
  // officeMailId: yup
  //   .string()
  //   .required("Office Mail is required..!")
  //   .typeError("Office Mail is required..!")
  //   .email("Incorrect format"),
  // workingOnsitePersonMobileNo: yup
  //   .string()
  //   .required("Mobile Number is required..!!")
  //   .typeError("Mobile Number is required..!!")
  //   .matches(/^[0-9]*$/, "Must be only digits")
  //   // .min(10, 'Mobile Number must be at least 10 number')
  //   .max(10, "Mobile Number not valid on above 10 number"),
  // capacity: yup
  //   .number()
  //   .required("Capacity Number is required...!!")
  //   .typeError("Capacity Number is required...!!"),
  // businessAddress: yup
  //   .string()
  //   .required("Bussiness Address is Required !!!")
  //   .typeError("Bussiness Address is Required !!!")
  //   .matches(
  //     /^[aA-zZ\s]*$/,
  //     "Must be only english characters / फक्त इंग्लिश शब्द "
  //   ),
  // businessAddressMr: yup
  //   .string()
  //   .required("Bussiness Address is Required !!!")
  //   .typeError("Bussiness Address is Required !!!")
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters/ फक्त मराठी शब्द"
  //   ),
});

// 4
export let hotelSchema = yup.object().shape({
  // Hotel Noc
  hotelDTLDao: yup.object().shape({
    requireNOCAreainSqMtrs: yup
      .number()
      .required("Require NOC Area in Sq.Mtrs is required")
      .typeError("Require NOC Area in Sq.Mtrs is required"),

    area: yup
      .string()
      .required("Area is required")
      .typeError("Area is required")
      .matches(/^[0-9]+$/, "Must be only digits"),

    noOfEmployees: yup
      .string()
      .required("Number of Employee is required")
      .typeError("Number of Employee is required")
      .matches(/^[0-9]+$/, "Must be only digits"),

    detailsOfFireFightingEquipments: yup
      .string()
      .required("Details Of Fire Fighting Equipments is required")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    fireFightingWaterTankCapacity: yup
      .number()
      .required("Number of Employee is required")
      .typeError("Number of Employee is required"),

    widthOfApproachRoad: yup
      .number()
      .required("Width Of Approach Road is required")
      .typeError("Width Of Approach Road is required"),

    numberOfExit: yup
      .number()
      .required("Width Of Approach Road is required")
      .typeError("Width Of Approach Road is required"),

    carpetArea: yup
      .number()
      .required("Carpet Area is required")
      .typeError("Carpet Area is required"),

    chargebalArea: yup
      .number()
      .required("Chargebal Area is required")
      .typeError("Chargebal Area is required"),

    finalFireNocDate: yup
      .date()
      .typeError("Final Fire Noc date required")
      .required(),

    seatingCapacity: yup
      .number()
      .required("Chargebal Area is required")
      .typeError("Chargebal Area is required"),

    usageOfDryGrass: yup
      .string()
      .required("Usage Of Dry Grass is required")
      .typeError("Usage Of Dry Grass is required"),

    securityArrangement: yup
      .string()
      .required("Security Arrangement is required")
      .typeError("Security Arrangement is required"),

    parkingArrangement: yup
      .string()
      .required("Parking Arrangement is required")
      .typeError("Parking Arrangement is required"),

    listOfEmergencyContactNumber: yup
      .string()
      .required("List Of Emergency Contact Number is required")
      .typeError("List Of Emergency Contact Number is required"),

    arrangementOfLightingArrester: yup
      .string()
      .required("Arrangement Of Lighting Arrester is required")
      .typeError("Arrangement Of Lighting Arrester is required"),

    emergencyContactPersonDetails: yup
      .string()
      .required("Emergency Contact Person Details is required")
      .typeError("Emergency Contact Person Details is required")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    occupancyCertificateDate: yup
      .date()
      .typeError("Occupancy Certificate date required")
      .required(),

    firmOwnerName: yup
      .string()
      .required("Firm Owner Name is required")
      .typeError("Firm Owner Name is required")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    mobNo: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError("Mobile number is required")
      .min(10, "Mobile Number must be at least 10 number")
      .max(10, "Mobile Number not valid on above 10 number")
      .required(),

    aadharNo: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError("Adhar Number is required")
      .min(12, "Adhar Number must be at least 12 number")
      .max(12, "Adhar Number not valid on above 12 number")
      .required(),

    waterConnectionNo: yup
      .number()
      .required("Water Connection Number is required")
      .typeError("Water Connection Number is required"),

    meterConnectionNo: yup
      .number()
      .required("Meter Connection Number is required")
      .typeError("Meter Connection Number is required"),

    shopActNo: yup
      .number()
      .required("Shop Act Number is required")
      .typeError("Shop Act Number is required"),

    sactionPlanNo: yup
      .number()
      .required("Saction Plan Number is required")
      .typeError("Saction Plan Number is required"),

    occupancyCertificateNo: yup
      .number()
      .required("Occupancy Certificate Number is required")
      .typeError("Occupancy Certificate Number is required"),

    finalFireNocNo: yup
      .number()
      .required("Final Fire Noc Number is required")
      .typeError("Final Fire Noc Number is required"),

    sactionPlanDate: yup
      .date()
      .typeError("Saction Plan date required")
      .required(),

    isStarHotel: yup
      .string()
      .required("Is Star Hotel is required")
      .typeError("Is Star Hotel is required"),
  }),
});

// 12
export let companySchema = yup.object().shape({});

// 8
export let petrolPumpSchema = yup.object().shape({
  // Petrol Pump Noc
  petrolPumpDTLDao: yup.object().shape({
    requireNocAreaForPetrolDieselCngPumpInSqMtrs: yup
      .number()
      .required("Require NOC Area in Sq.Mtrs is required")
      .typeError("Require NOC Area in Sq.Mtrs is required"),

    noOfDispensingUnits: yup
      .number()
      .required("Number Of Dispensing Units is required")
      .typeError("Number Of Dispensing Units is required"),

    fuelTankCapacity: yup
      .number()
      .required("Fuel Tank Capacity Units is required")
      .typeError("Fuel Tank Capacity Units is required"),

    lengthOfCascadeForCng: yup
      .number()
      .required("Fuel Tank Capacity Units is required")
      .typeError("Fuel Tank Capacity Units is required"),

    widthOfCascadeForCng: yup
      .number()
      .required("Width Of Cascade For Cng is required")
      .typeError("Width Of Cascade For Cng is required"),

    noOfFireFightingTrainedPerson: yup
      .number()
      .required("No. Of Fire Fighting Trained Person is required")
      .typeError("No. Of Fire Fighting Trained Person is required"),

    noOfEmployees: yup
      .string()
      .required("Number of Employee is required")
      .typeError("Number of Employee is required")
      .matches(/^[0-9]+$/, "Must be only digits"),

    detailsOfFireFightingEquipments: yup
      .string()
      .required("Details Of Fire Fighting Equipments is required")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    fireFightingWaterTankCapacity: yup
      .number()
      .required("Number of Employee is required")
      .typeError("Number of Employee is required"),

    widthOfApproachRoad: yup
      .number()
      .required("Width Of Approach Road is required")
      .typeError("Width Of Approach Road is required"),

    numberOfExit: yup
      .number()
      .required("Width Of Approach Road is required")
      .typeError("Width Of Approach Road is required"),

    seatingCapacity: yup
      .number()
      .required("Chargebal Area is required")
      .typeError("Chargebal Area is required"),

    usageOfDryGrass: yup
      .string()
      .required("Usage Of Dry Grass is required")
      .typeError("Usage Of Dry Grass is required"),

    securityArrangement: yup
      .string()
      .required("Security Arrangement is required")
      .typeError("Security Arrangement is required"),

    parkingArrangement: yup
      .string()
      .required("Parking Arrangement is required")
      .typeError("Parking Arrangement is required"),

    listOfEmergencyContactNumberNoSmokingSignBoards: yup
      .string()
      .required("List Of Emergency Contact Number is required")
      .typeError("List Of Emergency Contact Number is required"),

    typesOfWiringOpenClose: yup
      .string()
      .required("Types Of Wiring Open Close is required")
      .typeError("Types Of Wiring Open Close is required"),

    arrangementOfLightingArrester: yup
      .string()
      .required("Arrangement Of Lighting Arrester is required")
      .typeError("Arrangement Of Lighting Arrester is required"),

    emergencyContactPersonDetails: yup
      .string()
      .required("Emergency Contact Person Details is required")
      .typeError("Emergency Contact Person Details is required")
      .matches(
        /^[aA-zZ\s]*$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),

    noOfCasCade: yup
      .number()
      .required("No. Of CasCade is required")
      .typeError("No. Of CasCade is required"),

    capForCng: yup
      .number()
      .required("capicity For Cng is required")
      .typeError("capicity For Cng is required"),

    batteryChargingStationUnit: yup
      .number()
      .required("Battery Charging Station Unit is required")
      .typeError("Battery Charging Station Unit is required"),
  }),
});

// 11
export let cinemaHallSchema = yup.object().shape({});
