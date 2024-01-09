import * as yup from "yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

// schema - validation
export let NoHawkingZoneSchema = (language) => {
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
    noHawkingZoneName: yup
      .string()
      .required(<FormattedLabel id="noHawkingZoneEnValidation" />)
      .matches(
        /^[A-Za-z0-9 -]+$/,
        language == "en"
          ? "only english characters are allowed !!!"
          : "फक्त इंग्रजी वर्णांना परवानगी आहे !!!"
      ),

    // hawking Zone Name mr
    noHawkingZoneNameMr: yup
      .string()
      .required(<FormattedLabel id="noHawkingZoneMrValidation" />)
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
      .typeError(<FormattedLabel id="declarationDateValidation" />),

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

    // hawking zone info
    noHawkingZoneInfo: yup
      .string()
      .required(<FormattedLabel id="noHawkingZoneInfoValidation" />),


       // declarationPhoto
       declarationPhoto:yup.string().nullable().required(<FormattedLabel id="declarationPhotoValidation" />)


  });
};
