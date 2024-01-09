export const nextTick = (dur = 0) =>
  new Promise((resolve) => setTimeout(resolve, dur))

//! Authore -Sachin Durge
// catch Method
export const catchExceptionHandlingMethod = (
  error,
  language,
  showErrorMessagesInModel
) => {
  console.log(
    "code faatala re ..... 🤦‍♀️💔",
    error,
    language,
    showErrorMessagesInModel
  )
  // console.log("languagedsfsd", language);
  const okButtonText = language === "en" ? "Ok" : "ठीक आहे"
  let headerMessage
  let contentMessage

  // Network Error
  if (error?.request?.status == undefined || error?.request?.status == 0) {
    headerMessage =
      language == "en" ? "Network error occurred !" : "नेटवर्क त्रुटी आली आहे !"
    contentMessage =
      language == "en"
        ? "please check your internet connection"
        : "कृपया आपल्या इंटरनेट कनेक्शनची तपासणी करा"
  }
  // Error Code 400
  else if (error?.request?.status == 400) {
    headerMessage = language == "en" ? "Bad Request !" : "अवैध विनंती !"
    contentMessage =
      language == "en"
        ? "please check your request"
        : "कृपया आपली विनंती तपासा."
  }
  // >>>>>>>>>>>>>>>>>>>>>>>>
  else if (error?.request?.status == 409) {
    headerMessage = "Oops!"
    contentMessage = "Please review the error details in the next popup."
    setTimeout(() => {
      showErrorMessagesInModel(error?.response?.data)
    }, 1000)
  }
  // Error Code 500
  else if (error?.request?.status == 500) {
    headerMessage =
      language == "en" ? "Service Unavailable !" : "सेवा उपलब्ध नाही !"
    contentMessage =
      language == "en" ? "please try again later" : "कृपया नंतर प्रयत्न करा"
  }

  // console.log("error33", error);
  // error code 401
  else if (error?.response?.status == 401) {
    headerMessage = language == "en" ? "Unauthorized !" : "अनाधिकृत !"
    contentMessage =
      language == "en"
        ? "Full authentication is required to access this resource, Please Login Again"
        : "या स्त्रोतामध्ये प्रवेश करण्यासाठी संपूर्ण प्रमाणीकरण आवश्यक आहे, कृपया पुन्हा लॉगिन करा"
  }

  // other Error Code
  else {
    headerMessage =
      language == "en" ? "Service Unavailable !" : "सेवा उपलब्ध नाही !"
    contentMessage =
      language == "en" ? "please try again later" : "कृपया नंतर प्रयत्न करा"
  }

  sweetAlert({
    title: headerMessage,
    text: contentMessage,
    icon: "error",
    button: okButtonText,
  })
}
