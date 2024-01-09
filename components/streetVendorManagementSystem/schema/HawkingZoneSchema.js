import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
export let HawkingZoneSchema = (language) => {
  return yup.object().shape({
    // fromDate
    fromDate: yup
      .date()
      .required(<FormattedLabel id="fromDateValidation" />)
      .typeError(<FormattedLabel id="fromDateValidation" />),

    // module
    applicationName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="applicationNameValidation" />),

    // zone
    zone: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="zoneNameValidation" />),

    // ward
    ward: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="wardNameValidation" />),

    // area
    areaName: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="areaNameValidation" />),

    // city survey no
    citySurveyNo: yup
      .string()
      .required(<FormattedLabel id="citySurveyNoValdationA" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!"
      )
      .typeError(),

    // item
    item: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="itemValidation" />),

    // gisId
    gisId: yup
      .string()
      .required(<FormattedLabel id="gisIdValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!"
      ),

    // hawking Zone Name en
    hawkingZoneName: yup
      .string()
      .required(<FormattedLabel id="hawkingNameValidation" />)
      .matches(
        /^[A-Za-z0-9 -]+$/,
        language == "en"
          ? "only english characters are allowed !!!"
          : "फक्त इंग्रजी वर्णांना परवानगी आहे !!!"
      ),

    // hawking Zone Name mr
    hawkingZoneNameMr: yup
      .string()
      .required(<FormattedLabel id="hawkingNameMrValidation" />)
      .matches(
        /^[\u0900-\u097F0-9\s-]+$/,
        language == "en"
          ? "only marathi characters are allowed !!!"
          : "फक्त मराठी अक्षरांना परवानगी आहे !!!"
      ),

    // declaration date
    declarationDate: yup
      .date()
      .required(<FormattedLabel id="declarationDateValidation" />)
      .typeError(
        language == "en"
          ? "please enter valid date !!!"
          : "कृपया वैध तारीख प्रविष्ट करा !!!"
      ),

    // declaration order
    declarationOrder: yup
      .string()
      .required(<FormattedLabel id="declarationOrderValidation" />),

    // declaration order no
    declarationOrderNo: yup
      .string()
      .required(<FormattedLabel id="declarationOrderNoValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    // capacity of hawking zone
    capacityOfHawkingZone: yup
      .string()
      .required(<FormattedLabel id="capacityOfHawkingZoneValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .typeError(),

    // no of hawker present
    noOfHawkersPresent: yup
      .string()
      .required(<FormattedLabel id="noOfHawkersPresentValidation" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "only numbers are allowed !!!"
          : "फक्त संख्यांना परवानगी आहे !!!"
      )
      .typeError(),

    //  // period of residense in maharashtra
    capacityOfHawkingZone: yup
      .string()
      .required(<FormattedLabel id="capacityOfHawkingZoneValidation" />)
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      ),
    // // period of residense in pune
    noOfHawkersPresent: yup
      .string()
      .required(<FormattedLabel id="noOfHawkersPresentValidation" />)
      .matches(
        /^[1-9]\d*$/,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .min(
        1,
        language === "en"
          ? "Only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे"
      )
      .test({
        name: "comparePeriods",
        test: function (value) {
          console.log("value121212", value, this.parent.capacityOfHawkingZone);
          const capacityHawking = parseInt(value);
          const noOfHawkersP = parseInt(this.parent.capacityOfHawkingZone);
          return capacityHawking <= noOfHawkersP;
        },
        message:
          language === "en"
            ? "number of street vendors zone present not be more than capacity of street vendor zone !!"
            : "सध्या स्ट्रीट व्हेंडर झोनची संख्या स्ट्रीट व्हेंडर झोनच्या क्षमतेपेक्षा जास्त नसावी !!!",
      }),

    // hawking zone info
    hawkingZoneInfo: yup
      .string()
      .required(<FormattedLabel id="hawkingZoneInfoValidation" />),


      // declarationPhoto
      declarationPhoto:yup.string().nullable().required(<FormattedLabel id="declarationPhotoValidation" />)










  });
};
