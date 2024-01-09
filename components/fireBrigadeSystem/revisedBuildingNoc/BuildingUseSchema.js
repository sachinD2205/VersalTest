import * as yup from "yup";

// schema - validation
let BuildingUseSchema = yup.object().shape({
     buildingHeightFromGroundFloorInMeter: yup.string().matches(/^[0-9]+$/, "Building height in must be in number !!!").required("building Height is Required !!!"),
     noOfBasement: yup.string().matches(/^[0-9]+$/, "Basement must be in number !!!").required("Number of basement is Required !!!"),
    volumeLBHIn: yup.string().matches(/^[0-9]+$/, "Volume LBH must be in number !!!").required("Volume LBH is Required !!!"),
    totalBuildingFloor: yup.string().matches(/^[0-9]+$/, "Floor must be in number !!!").required("Building Floor is Required !!!"),
     basementAreaInsquareMeter: yup.string().matches(/^[0-9]+$/, "Basement area must be in number !!!").required("Basement area is Required !!!"),
     noOfVentilation: yup.string().matches(/^[0-9]+$/, "Ventilation must be in number !!!").required("Ventilation is Required !!!"),
     noOfTowers: yup.string().required("Number of towers is Required !!!"),
     plotAreaSquareMeter: yup.string().matches(/^[0-9]+$/, "Plot area must be in number !!!").required("Plot area is Required !!!"),
     constructionAreSqMeter: yup.string().matches(/^[0-9]+$/, "Construction area must be in number !!!").required("Construction area is Required !!!"),
     noOfApprochedRoad: yup.string().matches(/^[0-9]+$/, "Approched road must be in number !!!").required("Aapproched road is Required !!!"),
   
    

    // highTensionLine: yup.string().required("High tension line is Required !!!"),

    //   areaZone: yup.string().required("Area zone is Required !!!"),

    //   overHeadWaterTankCapacityInLiter: yup.string().required("Over head water tank capacity in liter is Required !!!"),

    //  previouslyAnyFireNocTaken: yup.string().required("Fire noc is Required !!!"),
    // underTheGroundWaterTankCapacityLighter: yup.string().required("Capacity lighter is Required !!!"),

     l: yup.string().matches(/^[0-9]+$/, "L must be in number !!!").required("L is Required !!!"),
     b: yup.string().matches(/^[0-9]+$/, "B must be in number !!!").required("B is Required !!!"),
     h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),
    
//   la: yup.string().matches(/^[0-9]+$/, "L must be in number !!!").required("L is Required !!!"),
//      ba: yup.string().matches(/^[0-9]+$/, "B must be in number !!!").required("B is Required !!!"),
//      ha: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),
    //  h: yup.string().matches(/^[0-9]+$/, "H must be in number !!!").required("H is Required !!!"),







});

export default BuildingUseSchema;