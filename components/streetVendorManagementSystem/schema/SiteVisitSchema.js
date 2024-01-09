import * as yup from "yup";

// schema - validation
let SiteVisitSchema = (language) => {
  return yup.object().shape({
    // site visit photo 1
    siteVisitPhoto1: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Site Visit photo 1 is required !!!"
          : "साइट भेट फोटो १ आवश्यक आहे !!!",
      ),
    // site visit photo 2
    siteVisitPhoto2: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Site Visit photo 2 is required !!!"
          : "साइट भेट फोटो २ आवश्यक आहे !!!",
      ),
    // site visit phtoto 3
    siteVisitPhoto3: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Site Visit photo 3 is required !!!"
          : "साइट भेट फोटो ३ आवश्यक आहे !!!",
      ),
    // site visit  photo 4
    siteVisitPhoto4: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Site Visit photo 4 is required !!!"
          : "साइट भेट फोटो ४ आवश्यक आहे !!!",
      ),
    // site visit photo 5s
    siteVisitPhoto5: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Site Visit photo 5 is required !!!"
          : "साइट भेट फोटो ५ आवश्यक आहे !!!",
      ),
    // street vendor photo
    streetVendorPhoto: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Streetvendor photo is required !!!"
          : "स्ट्रीटव्हेंडरचा फोटो आवश्यक आहे !!!",
      ),
    // street vendor thumb1
    streetVendorThumb1: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Biometric Impression of Thumb 1 is required !!!"
          : "बायोमेट्रिक अंगठ्याचा ठसा 1 आवश्यक आहे !!!",
      ),
    // streetvendor thubm 2
    streetVendorThumb2: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Biometric Impression of Thumb 2 is required !!!"
          : "बायोमेट्रिक अंगठ्याचा ठसा 2 आवश्यक आहे !!!",
      ),
    //  road With Business Location
    roadWithBusinessLocation: yup
      .string()
      .required(
        language == "en"
          ? "Road Width at Business Location is Required !!!"
          : "व्यवसाय ठिकाणची रस्ता रुंदी(फूट) आवश्यक आहे !!!",
      )
      .matches(
        /^[1-9]\d*$/,
        language == "en"
          ? "only numbers are allowed"
          : "फक्त संख्यांना परवानगी आहे",
      )
      .min(
        1,
        language == "en"
          ? "please enter valid road width"
          : "कृपया रस्त्याची वैध रुंदी प्रविष्ट करा",
      )
      .max(
        3,
        language == "en"
          ? "please enter valid road width"
          : "कृपया रस्त्याची वैध रुंदी प्रविष्ट करा",
      ),

    //business Hawking location
    businessHawkinglocation: yup
      .string()
      .required(
        language == "en" ? "selection is required !!!" : "निवड आवश्यक आहे !!!",
      ),
    // inspection Selling Goods
    inspectionSellingGoods: yup
      .string()
      .required(
        language == "en" ? "yes no is required !!!" : "होय नाही आवश्यक आहे !!!",
      ),
    // business Traffic Congestion
    businessTrafficCongestion: yup
      .string()
      .required(
        language == "en" ? "yes no is required !!!" : "होय नाही आवश्यक आहे !!!",
      ),
    // site Visit Remark
    siteVisitRemark: yup
      .string()
      .required(
        language == "en" ? "remark is required !!!" : "टिप्पणी आवश्यक आहे !!!",
      ),
  });
};

export default SiteVisitSchema;
