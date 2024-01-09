import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
// const language = useSelector((state) => state?.labels.language);
export let applicationDetailsSchema = (language) => {
  return yup.object().shape({
    // areaKey: yup
    //   .string()
    //   .nullable()
    //   .required(
    //     language == "en" ? "कृपया एरिया निवडा" : "Please select a Area ",
    //   ),
    zoneKey: yup.string().required(<FormattedLabel id="selectZone" />),
    wardKey: yup.string().required(<FormattedLabel id="selectWard" />),
    whoAreYou: yup.string().required(<FormattedLabel id="whoAreYouV" />),

    lawOfMarriage: yup
      .string()
      .required(<FormattedLabel id="lawOfMarriageE" />),
    // atitle: yup.string().required(<FormattedLabel id="selectTitle" />),
    // atitleMr: yup.string().required(<FormattedLabel id="selectTitle" />),
    afName: yup
      .string()
      .required(<FormattedLabel id="enterFName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
        // language == "en"
        // ? "Must be only english characters"
        // : "फक्त इंग्लिश शब्द ",
      )
      .typeError(),
    amName: yup
      .string()
      .matches(
        /^[aA-zZ\s]*$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    // .required(<FormattedLabel id="enterMName" />),
    alName: yup
      .string()
      .required(<FormattedLabel id="enterLName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    afNameMr: yup
      .string()
      .required(<FormattedLabel id="enterFNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    amNameMr: yup
      .string()
      .matches(
        /^[\u0900-\u097F]*/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    // .required(<FormattedLabel id="enterMNameMr" />),
    alNameMr: yup
      .string()
      .required(<FormattedLabel id="enterLNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    aemail: yup
      .string()
      .email(<FormattedLabel id="emailV" />)
      .required(<FormattedLabel id="enterEmailAddress" />),
    amobileNo: yup
      .string()
      .required(<FormattedLabel id="enterMobileNo" />)
      .matches(
        /^[6-9][0-9]+$/,
        language == "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका",
      )
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(10, <FormattedLabel id="mobileV1" />)
      .max(10, <FormattedLabel id="mobileV2" />),
    // aflatBuildingNo: yup
    //   .string()
    //   .matches(
    //      /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterFlat" />),
    // abuildingName: yup
    //   .string()
    //   .matches(
    //      /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterApartment" />),
    aroadName: yup
      .string()
      .required(<FormattedLabel id="enterRoadName" />)
      .nullable()
      .matches(
        // /^[A-Za-z0-9@-\s]+$/,
        /^[A-Za-z0-9@.,\-\s]+$/,
        // /^[A-Za-z][A-Za-z0-9!@#$%^&*]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    alandmark: yup
      .string()
      .required(<FormattedLabel id="enterLandmark" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    // aflatBuildingNoMr: yup
    //   .string()
    //   .matches(
    //     /^[\u0900-\u097F]+/,
    //     "Must be only in marathi/ फक्त मराठी मध्ये",
    //   ),
    // .required(<FormattedLabel id="enterFlatMr" />),
    // abuildingNameMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी मध्ये")
    //   .required(<FormattedLabel id="enterApartmentMr" />),
    aroadNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    alandmarkMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmarkMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    acityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCity" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    astate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="state" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    acityNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCityMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    astateMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    apincode: yup
      .string()
      .required(<FormattedLabel id="enterPinCode" />)
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंकात ",
      )
      .typeError(<FormattedLabel id="enterPinCode" />)
      .min(6, <FormattedLabel id="pincodeV1" />)
      .max(6, <FormattedLabel id="pincodeV2" />),
    marriageDate: yup
      .date()
      .typeError(<FormattedLabel id="selectDate" />)
      .required(),
    pplaceOfMarriage: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="placeMarriage" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    pplaceOfMarriageMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="placeMarriageMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
  });
};

export let groomSchema = (gstatusAtTimeMarriageKey, language) => {
  console.log("sssssssss333333ssss", gstatusAtTimeMarriageKey);
  return yup.object().shape({
    // gtitle: yup.string().required(<FormattedLabel id="selectTitle" />),
    gfName: yup
      .string()
      .required(<FormattedLabel id="enterFName" />)
      .matches(
        // /^[aA-zZ\s]+$/,
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    gmName: yup
      .string()
      .required(<FormattedLabel id="enterMName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    glName: yup
      .string()
      .required(<FormattedLabel id="enterLName" />)
      .matches(
        /^[A-Za-z@. \-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    // gtitleMar: yup.string().required(<FormattedLabel id="selectTitle" />),
    gfNameMr: yup
      .string()
      .required(<FormattedLabel id="enterFNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    gmNameMr: yup
      .string()
      .required(<FormattedLabel id="enterMNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    glNameMr: yup
      .string()
      .required(<FormattedLabel id="enterLNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    gbirthDate: yup
      .date()
      .typeError(<FormattedLabel id="selectDate" />)
      .required(),
    gage: yup
      .number()
      .required(<FormattedLabel id="enterAge" />)
      .typeError(<FormattedLabel id="enterAge" />)
      .min(21, <FormattedLabel id="agev211" />)
      .max(99, <FormattedLabel id="agev212" />),
    ggender: yup.string().required(<FormattedLabel id="selectGender" />),
    gaadharNo: yup
      .string()
      .required(<FormattedLabel id="enteraadhaarNo" />)
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError(<FormattedLabel id="enteraadhaarNo" />)
      .min(12, <FormattedLabel id="adharV2" />)
      .max(12, <FormattedLabel id="adharV1" />),
    gemail: yup.string().email(<FormattedLabel id="emailV" />),
    // .required(<FormattedLabel id="enterEmailAddress" />),
    greligionByBirth: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectReligionby" />),
    //greligionByAdoption: yup.string().required(<FormattedLabel id="selectAdoptionby" />),

    // gbuildingNo: yup
    //   .string()
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    // .required(<FormattedLabel id="enterFlat" />),
    // gbuildingName: yup
    //   .string()
    //   .matches(
    //     /^[A-Za-z0-9@-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterApartment" />),
    groadName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadName" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    glandmark: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmark" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    // gbuildingNoMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    // .required(<FormattedLabel id="enterFlatMr" />),
    // gbuildingNameMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    //   .required(<FormattedLabel id="enterApartmentMr" />),
    groadNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadNameMr" />)
      .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    glandmarkMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmarkMr" />)
      .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    gcityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCity" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    gstate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="state" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    gcityNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCityMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    gstateMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="stateMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    gpincode: yup
      .string()
      .required(<FormattedLabel id="enterPinCode" />)
      .matches(
        /^[0-9]+$/,
        language == "en" ? "Must be only digits" : "फक्त अंकात ",
      )
      .typeError(<FormattedLabel id="enterPinCode" />)
      .min(6, <FormattedLabel id="pincodeV1" />)
      .max(6, <FormattedLabel id="pincodeV2" />),
    // .number()
    gmobileNo: yup
      .string()
      .matches(
        /^[6-9][0-9]+$/,
        language == "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका",
      )
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(10, <FormattedLabel id="mobileV1" />)
      .max(10, <FormattedLabel id="mobileV2" />)
      .required(),
    gstatusAtTimeMarriageKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectStatusAt" />),
    gdivorceDate: yup
      .date()
      // .string()
      .nullable()
      .typeError("date required")
      .when("gstatusAtTimeMarriageKey", {
        is: "1",
        then: yup
          .date()
          .nullable()
          .required(<FormattedLabel id="dateV" />),
      }),
    gwidowDate: yup
      .date()
      .nullable()
      .typeError("date required")
      .when("gstatusAtTimeMarriageKey", {
        is: "3",
        then: yup
          .date()
          .nullable()
          .required(<FormattedLabel id="dateV" />),
      }),

    // gdivorceDate: yup
    // .date()
    // .typeError("date required")
    // .test("is-divorce-date-required", "date required", function(value) {
    //   console.log("dddddddd",status)
    //   const statusd = this.resolve(yup.ref("status"));
    //   if (statusd = 1) {
    //     return !!value;
    //   }
    //   return true;
    // }),
    // gwidowDate: yup
    // .date()
    // .typeError("w date required")
    // .test("is-widow-date-required", "w date required", function(value) {
    //   const statusw = this.resolve(yup.ref("status"));
    //   if (statusw = 3) {
    //     return !!value;
    //   }
    //   return true;
    // }),
    // goccupation: yup
    // .string()
    // .matches(
    //   /^[A-Za-z0-9@-\s]+$/,
    //   language == "en"
    // ? "Must be only english characters"
    // : "फक्त इंग्लिश शब्द ",
    // )
    // .required(<FormattedLabel id="occupation" />),
    // goccupationAddress: yup
    // .string()
    // .matches(
    //   /^[A-Za-z0-9@-\s]+$/,
    //   language == "en"
    // ? "Must be only english characters"
    // : "फक्त इंग्लिश शब्द ",
    // )
    // .required(<FormattedLabel id="occupationAddress" />),
  });
};
export let brideSchema = (bstatusAtTimeMarriageKey, language) => {
  console.log("bstatusAtTimeMarriageKey", bstatusAtTimeMarriageKey);
  return yup.object().shape({
    // btitle: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="selectTitle" />),
    bfName: yup
      .string()
      .required(<FormattedLabel id="enterFName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    bmName: yup
      .string()
      .required(<FormattedLabel id="enterMName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    blName: yup
      .string()
      .required(<FormattedLabel id="enterLName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    // btitleMar: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="selectTitle" />),
    bfNameMr: yup
      .string()
      .required(<FormattedLabel id="enterFNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    bmNameMr: yup
      .string()
      .required(<FormattedLabel id="enterMNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    blNameMr: yup
      .string()
      .required(<FormattedLabel id="enterLNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    bbirthDate: yup
      .date()
      .typeError(<FormattedLabel id="selectDate" />)
      .required(),
    bage: yup
      // .number()
      // .required(<FormattedLabel id="enterAge" />)
      // .min(18, <FormattedLabel id="agev181" />)
      // .max(99, <FormattedLabel id="agev182" />)
      // .typeError(),

      .number()
      // .nullable()
      .min(18, <FormattedLabel id="agev181" />)
      .max(99, <FormattedLabel id="agev182" />)
      .required(<FormattedLabel id="enterAge" />)
      .typeError(<FormattedLabel id="enterAge" />),
    bgender: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectGender" />),
    baadharNo: yup
      .string()
      .required(<FormattedLabel id="enteraadhaarNo" />)
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError(<FormattedLabel id="enteraadhaarNo" />)
      .min(12, <FormattedLabel id="adharV2" />)
      .max(12, <FormattedLabel id="adharV1" />),
    // bemail: yup.string().email(<FormattedLabel id="emailV" />),
    // .required(<FormattedLabel id="enterEmailAddress" />),
    breligionByBirth: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectReligionby" />),
    //breligionByAdoption: yup.string().required(<FormattedLabel id="selectAdoptionby" />),
    bstatusAtTimeMarriageKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectStatusAt" />),

    bdivorceDate: yup
      .date()
      .nullable()
      .typeError("date required")
      .when("bstatusAtTimeMarriageKey", {
        is: "1",
        then: yup
          .date()
          .nullable()
          .required(<FormattedLabel id="dateV" />),
      }),
    bwidowDate: yup
      .date()
      .nullable()
      .typeError("date required")
      .when("bstatusAtTimeMarriageKey", {
        is: "3",
        then: yup
          .date()
          .nullable()
          .required(<FormattedLabel id="dateV" />),
      }),

    // bbuildingNo: yup
    //   .string()
    //   .matches(
    //     /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   ),
    // // .required(<FormattedLabel id="enterFlat" />),
    // bbuildingName: yup
    //   .string()
    //   .matches(
    //      /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterApartment" />),
    broadName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadName" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    blandmark: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmark" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    // bbuildingNoMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    // // .required(<FormattedLabel id="enterFlatMr" />),
    // bbuildingNameMr: yup
    //   .string()
    //   .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द")
    //   .required(<FormattedLabel id="enterApartmentMr" />),
    broadNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadNameMr" />)
      .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    blandmarkMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmarkMr" />)
      .matches(/^[\u0900-\u097F]+/, "Must be only in marathi/ फक्त मराठी शब्द"),
    bcityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCity" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    bstate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="state" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    bcityNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCityMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    // bstateMr: yup
    //   .string()
    //   .matches(
    //     /^[\u0900-\u097F]+/,
    //     language == "en"
    // ? "Must be only marathi characters"
    // : "फक्त मराठी शब्द ",
    //   )
    //   .required(<FormattedLabel id="stateMr" />),
    bpincode: yup
      .string()
      .required(<FormattedLabel id="enterPinCode" />)
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError(<FormattedLabel id="enterPinCode" />)
      .min(6, <FormattedLabel id="pincodeV1" />)
      .max(6, <FormattedLabel id="pincodeV2" />),
    bmobileNo: yup
      .string()
      .nullable()
      .matches(
        /^[6-9][0-9]+$/,
        language == "en"
          ? "Enter a Valid Mobile Number"
          : "वैध मोबाईल नंबर टाका",
      )
      .typeError(<FormattedLabel id="enterMobileNo" />)
      .min(10, <FormattedLabel id="mobileV1" />)
      .max(10, <FormattedLabel id="mobileV2" />)
      .required(),
  });
};
export let priestSchema = (language) => {
  return yup.object().shape({
    // ptitle: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="selectTitle" />),
    pfName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterFName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    pmName: yup
      .string()
      .matches(
        /^[aA-zZ\s]*$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    // .required(<FormattedLabel id="enterMName" />),
    plName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLName" />)
      .matches(
        /^[aA-zZ\s]+$/,
        language == "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द ",
      ),
    // ptitleMar: yup.string().required(<FormattedLabel id="selectTitle" />),
    pfNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterFNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    // pmNameMr: yup
    //   .string()
    //   .required(<FormattedLabel id="enterMNameMr" />)
    //   .matches(
    //     /^[\u0900-\u097F]+/,
    //     language == "en"
    //       ? "Must be only marathi characters"
    //       : "फक्त मराठी शब्द ",
    //   ),
    plNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    // pbirthDate: yup.date().typeError(<FormattedLabel id="selectDate" />),
    // .required(),
    page: yup
      .number()
      .nullable()
      .typeError()
      .min(18, <FormattedLabel id="agev181" />)
      .max(99, <FormattedLabel id="agev182" />)
      .required(<FormattedLabel id="enterAge" />),
    pgender: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="selectGender" />),
    // paadharNo: yup
    //   .string()
    //   .nullable()
    //   .matches(/^[0-9]*$/, "Must be only digits")
    //   .typeError(<FormattedLabel id="enteraadhaarNo" />)
    //   // .min(12, "Adhar Number must be at least 12 number")
    //   .max(12, "Adhar Number not valid on above 12 number"),
    // // .required(),
    pemail: yup.string().email(<FormattedLabel id="emailV" />),
    // .required(<FormattedLabel id="enterEmailAddress" />),
    // preligionByBirth: yup.string(),
    // .required(<FormattedLabel id="selectReligionby" />),
    // preligionByAdoption: yup.string(),
    // .required(<FormattedLabel id="selectAdoptionby" />),
    // pbuildingNo: yup
    //   .string()
    //   .matches(
    //      /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterFlat" />),
    // pbuildingName: yup
    //   .string()
    //   .matches(
    //      /^[A-Za-z0-9@.,\-\s]+$/,
    //     "Must be only in english / फक्त इंग्लिश मध्ये ",
    //   )
    //   .required(<FormattedLabel id="enterApartment" />),
    proadName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadName" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    plandmark: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmark" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    proadNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterRoadNameMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    plandmarkMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterLandmarkMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        "Must be only in marathi/ फक्त मराठी मध्ये",
      ),
    pcityName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCity" />)
      .matches(
        /^[A-Za-z0-9@.,\-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    pcityNameMr: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="enterCityMr" />)
      .matches(
        /^[\u0900-\u097F]+/,
        language == "en"
          ? "Must be only marathi characters"
          : "फक्त मराठी शब्द ",
      ),
    pstate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="state" />)
      .matches(
        /^[A-Za-z0-9@-\s]+$/,
        "Must be only in english / फक्त इंग्लिश मध्ये ",
      ),
    ppincode: yup
      .string()
      .required(<FormattedLabel id="enterPinCode" />)
      .matches(/^[0-9]+$/, "Must be only digits")
      .typeError(<FormattedLabel id="enterPinCode" />)
      .min(6, <FormattedLabel id="pincodeV1" />)
      .max(6, <FormattedLabel id="pincodeV2" />),
    // pmobileNo: yup
    //   .string()
    //   .nullable()
    //   .matches(
    //   /^[6-9][0-9]+$/,
    //   language == "en"
    //     ? "Enter a Valid Mobile Number"
    //     : "वैध मोबाईल नंबर टाका",
    // )
    //   .typeError(<FormattedLabel id="enterMobileNo" />)
    // .min(10, <FormattedLabel id="mobileV1" />)
    // .max(10, <FormattedLabel id="mobileV2" />),
    // .required(),
  });
};
// export let documentsUpload = yup.object().shape({
//   gageProofDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="birthProf" />),
//   gresidentialDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProof" />),
//   gidProofDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="IdentyProof" />),
//   bageProofDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="birthProf" />),
//   bresidentialDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProof" />),
//   bidProofDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="IdentyProof" />),
//   // presidentialDocumentKey: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="ResideProof" />),
//   wfResidentialDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProof" />),
//   wsResidentialDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProof" />),
//   wtResidentialDocumentKey: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProof" />),
//   uinvitationCard: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="EnterDocName" />),
//   umarrigePhotoCouple: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="EnterDocName" />),
//   // ustampDetail: yup.string().required(<FormattedLabel id="EnterDocName" />),
//   //groom
//   gageProofDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="birthProfV" />),
//   gresidentialProofDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProofV" />),
//   gidDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="IdentyProofV" />),
//   //bride
//   bageProofDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="birthProfV" />),
//   bresidentialDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProofV" />),
//   bidDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="IdentyProofV" />),
//   //prist
//   // presidentialDocument: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="ResideProofV" />),
//   //witnesss
//   wfResidentialDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProofV" />),
//   wsResidentialDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProofV" />),
//   wtResidentialDocument: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="ResideProofV" />),
//   //other details
//   uinvitationCardPath: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="invetaionCardV" />),
//   umarrigePhotoCouplePath: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="marrigePhotoCV" />),
//     ubdisabled: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="personDisabled" />),
//     ugdisabled: yup
//     .string()
//     .nullable()
//     .required(<FormattedLabel id="personDisabled1" />),
//   // ustampDetailPath: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="marDrfV" />),
//   // wfageProofDocument: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="birthProfV" />),
//   // wsageProofDocument: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="birthProfV" />),
//   // wtageProofDocument: yup
//   //   .string()
//   //   .nullable()
//   //   .required(<FormattedLabel id="birthProfV" />),
//   // wfageProofDocumentKey: yup
//   //   .string()
//   //   .required(<FormattedLabel id="birthProf" />),
//   // wsageProofDocumentKey: yup
//   //   .string()
//   //   .required(<FormattedLabel id="birthProf" />),
//   // wtageProofDocumentKey: yup
//   //   .string()
//   //   .required(<FormattedLabel id="birthProf" />),
// });

export let documentsUpload = (
  gdisabled,
  bdisabled,
  gstatusAtTimeMarriageKey,
  lawOfMarriage,
) => {
  return yup.object().shape({
    gageProofDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="birthProf" />),
    gresidentialDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProof" />),
    gidProofDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="IdentyProof" />),
    bageProofDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="birthProf" />),
    bresidentialDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProof" />),
    bidProofDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="IdentyProof" />),
    // presidentialDocumentKey: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="ResideProof" />),
    wfResidentialDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProof" />),
    wsResidentialDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProof" />),
    wtResidentialDocumentKey: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProof" />),
    uinvitationCard: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="EnterDocName" />),
    umarrigePhotoCouple: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="EnterDocName" />),
    // ustampDetail: yup.string().required(<FormattedLabel id="EnterDocName" />),
    //groom
    gageProofDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="birthProfV" />),
    gresidentialProofDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProofV" />),
    gidDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="IdentyProofV" />),
    //bride
    bageProofDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="birthProfV" />),
    bresidentialDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProofV" />),
    bidDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="IdentyProofV" />),
    //prist
    // presidentialDocument: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="ResideProofV" />),
    //witnesss
    wfResidentialDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProofV" />),
    wsResidentialDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProofV" />),
    wtResidentialDocument: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="ResideProofV" />),
    //other details
    uinvitationCardPath: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="invetaionCardV" />),
    umarrigePhotoCouplePath: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="marrigePhotoCV" />),
    ubdisabled: yup
      .string()
      .nullable()
      .when("bdisabled", {
        is: true,
        then: yup.string().required(<FormattedLabel id="personDisabled" />),
      }),
    ugdisabled: yup
      .string()
      .nullable()
      .when("gdisabled", {
        is: true,
        then: yup.string().required(<FormattedLabel id="personDisabled1" />),
      }),
    gudivorcePaperPath: yup
      .string()
      .nullable()
      .when("gstatusAtTimeMarriageKey", {
        is: 1,
        then: yup.string().required(<FormattedLabel id="gudivorcePaper" />),
      }),
    budivorcePaperPath: yup
      .string()
      .nullable()
      .when("bstatusAtTimeMarriageKey", {
        is: 1,
        then: yup.string().required(<FormattedLabel id="budivorcePaper" />),
      }),
    gudeathcerPath: yup
      .string()
      .nullable()
      .when("gstatusAtTimeMarriageKey", {
        is: 3,
        then: yup.string().required(<FormattedLabel id="deathcerti" />),
      }),
    budeathcerPath: yup
      .string()
      .nullable()
      .when("bstatusAtTimeMarriageKey", {
        is: 3,
        then: yup.string().required(<FormattedLabel id="deathcerti" />),
      }),
    nikahnamaofLawpath: yup
      .string()
      .nullable()
      .when("lawOfMarriage", {
        is: 2,
        then: yup.string().required(<FormattedLabel id="nikahnama" />),
      }),

    // ustampDetailPath: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="marDrfV" />),
    // wfageProofDocument: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="birthProfV" />),
    // wsageProofDocument: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="birthProfV" />),
    // wtageProofDocument: yup
    //   .string()
    //   .nullable()
    //   .required(<FormattedLabel id="birthProfV" />),
    // wfageProofDocumentKey: yup
    //   .string()
    //   .required(<FormattedLabel id="birthProf" />),
    // wsageProofDocumentKey: yup
    //   .string()
    //   .required(<FormattedLabel id="birthProf" />),
    // wtageProofDocumentKey: yup
    //   .string()
    //   .required(<FormattedLabel id="birthProf" />),
  });
};

const witnessFieldSchema = {
  // wtitle: yup.string().required(<FormattedLabel id="selectTitle" />),
  witnessFName: yup
    .string()
    .required(<FormattedLabel id="enterFName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters/फक्त इंग्लिश शब्द ",
    ),
  witnessMName: yup
    .string()
    .matches(
      /^[aA-zZ\s]*$/,
      "Must be only english characters/फक्त इंग्लिश शब्द ",
    ),
  // .required(<FormattedLabel id="enterMName" />),
  witnessLName: yup
    .string()
    .required(<FormattedLabel id="enterLName" />)
    .matches(
      /^[aA-zZ\s]+$/,
      "Must be only english characters/फक्त इंग्लिश शब्द ",
    ),
  // wtitleMr: yup.string().required(<FormattedLabel id="selectTitle" />),
  witnessFNameMr: yup
    .string()
    .required(<FormattedLabel id="enterFNameMr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters / फक्त मराठी शब्द ",
    ),
  // witnessMNameMr: yup
  //   .string()
  //   .required(<FormattedLabel id="enterMNameMr" />)
  //   .matches(
  //     /^[\u0900-\u097F]+/,
  //     "Must be only marathi characters / फक्त मराठी शब्द ",
  //   ),
  witnessLNameMr: yup
    .string()
    .required(<FormattedLabel id="enterLNameMr" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters / फक्त मराठी शब्द ",
    ),
  genderKey: yup.string().required(<FormattedLabel id="selectGender" />),
  witnessAddressC: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="witnessAddressC" />)
    .matches(
      /^[A-Za-z0-9@.,\-\s]+$/,
      "Must be only in english / फक्त इंग्लिश मध्ये ",
    ),
  witnessAddressCMar: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="witnessAddressCMar" />)
    .matches(
      /^[\u0900-\u097F]+/,
      "Must be only marathi characters / फक्त मराठी शब्द ",
    ),
  // witnessaadharNo: yup
  //   .string()
  //   .nullable()
  //   .min(12, "Aadhar Number must be at least 12 number")
  //   .max(12, "Aadhar Number not valid on above 12 number")
  //   .matches(/^[0-9]+$/, "Must be only digits"),
  // witnessaadharNo: yup
  //   .string()
  //   .nullable()
  //   .min(12, "Aadhar Number must be at least 12 number")
  //   .max(12, "Aadhar Number not valid on above 12 number")
  //   .matches(/^[0-9]+$/, "Must be only digits"),
  // witnessMobileNo: yup
  //   .string()
  //   .nullable()
  //   // .required(<FormattedLabel id="enterMobileNo" />)
  // .matches(
  //   /^[6-9][0-9]+$/,
  //   language == "en"
  //     ? "Enter a Valid Mobile Number"
  //     : "वैध मोबाईल नंबर टाका",
  // )
  //   .typeError(<FormattedLabel id="enterMobileNo" />)
  // .min(10, <FormattedLabel id="mobileV1" />)
  // .max(10, <FormattedLabel id="mobileV2" />),
  emailAddress: yup.string().email(<FormattedLabel id="emailV" />),
  // .required(<FormattedLabel id="enterEmailAddress" />),
  // witnessDob: yup
  //   .date()
  //   .typeError(<FormattedLabel id="selectDate" />)
  //   .required(),
  witnessAge: yup
    .number()
    .required(<FormattedLabel id="enterAge" />)
    // .nullable()
    .min(18, <FormattedLabel id="agev181" />)
    .max(99, <FormattedLabel id="agev182" />)
    .typeError(),
  witnessRelation: yup
    .string()
    .required(<FormattedLabel id="witnessRelation" />),
};

export let witnessDetailsSchema = yup.object().shape({
  witnesses: yup.array().of(yup.object().shape(witnessFieldSchema)),
});
