export const nextTick = (dur = 0) =>
  new Promise((resolve) => setTimeout(resolve, dur));

//! Authore -Sachin Durge
// catch Method
export const cfcCatchMethod = (error, language) => {
  // console.log("languagedsfsd", language);
  const okButtonText = language === "en" ? "Ok" : "ठीक आहे";
  let headerMessage;
  let contentMessage;

  // Network Error
  if (error?.request?.status === undefined || error?.request?.status === 0) {
    (headerMessage = language == "en" ? "Network Error" : "नेटवर्क त्रुटी !"),
      (contentMessage =
        language == "en"
          ? "Server Is Unreachable Or May Be A Network Issue, Please Try After Sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा");
  }
  // Error Code 400
  else if (error?.request?.status === 400) {
    headerMessage = language == "en" ? "Bad Request !" : "अवैध विनंती !";
    contentMessage =
      language == "en"
        ? "Please check your request"
        : "कृपया आपली विनंती तपासा.";
  }
  // Error Code 500
  else if (error?.request?.status === 500) {
    headerMessage =
      language == "en" ? "Service Unavailable !" : "सेवा उपलब्ध नाही !";
    contentMessage =
      language == "en" ? "Please try again later" : "कृपया नंतर प्रयत्न करा";
  }

  // error code 401
  else if (error?.response?.status === 401) {
    headerMessage = language == "en" ? "Unauthorized !" : "अनाधिकृत !";
    contentMessage =
      language == "en"
        ? "Full authentication is required to access this resource, Please Login Again"
        : "या स्त्रोतामध्ये प्रवेश करण्यासाठी संपूर्ण प्रमाणीकरण आवश्यक आहे, कृपया पुन्हा लॉगिन करा";
  }
  // error code 403
  else if (error?.response?.status === 403) {
    headerMessage = language == "en" ? "Forbidden!" : "निषिद्ध !";
    contentMessage =
      language == "en"
        ? "You don't have permission to access this resource"
        : "तुम्हाला या संसाधनात प्रवेश करण्याची परवानगी नाही";
  }

  // other Error Code
  else {
    (headerMessage = language == "en" ? "Error" : "त्रुटी !"),
      (contentMessage =
        language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!");
  }

  sweetAlert({
    title: headerMessage,
    text: contentMessage,
    icon: "error",
    button: okButtonText,
  });
};

export const moduleCatchMethod = (error, language) => {
  console.log("error ", error);
  const okButtonText = language === "en" ? "Ok" : "ठीक आहे";
  let headerMessage;
  let contentMessage;

  if (error?.request?.status === undefined || error?.request?.status === 0) {
    (headerMessage = language == "en" ? "Network Error" : "नेटवर्क त्रुटी !"),
      (contentMessage =
        language == "en"
          ? "Server Is Unreachable Or May Be A Network Issue, Please Try After Sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा");
  }
  // Error Code 400
  else if (error?.request?.status === 400) {
    headerMessage = language == "en" ? "Bad Request !" : "अवैध विनंती !";
    contentMessage =
      language == "en"
        ? "Please check your request"
        : "कृपया आपली विनंती तपासा.";
  }
  // Error Code 500
  else if (error?.request?.status === 500) {

    console.log('error?',error.response.data );
    if (error?.response?.data?.message === "Audit name already persent") {
      headerMessage =
        language == "en" ? "Duplicate!" : "नक्कल !",
        contentMessage =   language == "en"
          ? "Audit name already present!"
          : "ऑडिट नाव आधीच कायम आहे!";
     }else{
      
    headerMessage =
      language == "en" ? "Service Unavailable !" : "सेवा उपलब्ध नाही !";
    contentMessage =
      language == "en" ? "Please try again later" : "कृपया नंतर प्रयत्न करा";
    }
  } else if (error?.response?.status === 403) {
    headerMessage = language == "en" ? "Forbidden!" : "निषिद्ध !";
    contentMessage =
      language == "en"
        ? "You don't have permission to access this resource"
        : "तुम्हाला या संसाधनात प्रवेश करण्याची परवानगी नाही";
  } else if (error?.response?.status === 404) {
    headerMessage = language == "en" ? "Unauthorized !" : "अनाधिकृत !";
    contentMessage =
      language == "en"
        ? "Full authentication is required to access this resource, Please Login Again"
        : "या स्त्रोतामध्ये प्रवेश करण्यासाठी संपूर्ण प्रमाणीकरण आवश्यक आहे, कृपया पुन्हा लॉगिन करा";
  }

  // error code 401
  else if (error?.response?.status === 401) {
    headerMessage = language == "en" ? "Unauthorized !" : "अनाधिकृत !";
    contentMessage =
      language == "en"
        ? "Full authentication is required to access this resource, Please Login Again"
        : "या स्त्रोतामध्ये प्रवेश करण्यासाठी संपूर्ण प्रमाणीकरण आवश्यक आहे, कृपया पुन्हा लॉगिन करा";
  } 
  else {
    (headerMessage = language == "en" ? "Error" : "त्रुटी !"),
      (contentMessage =
        language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!");
  }

  sweetAlert({
    title: headerMessage,
    text: contentMessage,
    icon: "error",
    button: okButtonText,
  });
};
