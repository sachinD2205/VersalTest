// sweetAlertMessages.js

export const deleteConfirmation = (language) => {
  return {
    title: language === "en" ? "Confirmation ?" : "काढून टाकायचं आहे का?",
    text:
      language === "en"
        ? "Are you sure you want to delete this Record ?"
        : "तुम्हाला हा अर्ज डिलीट करायचं आहे का?",
    icon: "warning",
    buttons: language === "en" ? ["Cancel", "Yes"] : ["नाही", "होय"],
    dangerMode: true,
  };
};

export const saveConfirmation = (language) => {
  return {
    title: language == "en" ? "Confirmation" : "पुष्टीकरण",
    text:
      language == "en"
        ? "Are you sure you want to submit the application ?"
        : "तुम्ही फॉर्म सबमिट करू इच्छिता का?",
    icon: "warning",
    buttons: language == "en" ? ["Cancel", "Yes"] : ["नाही", "होय"],
  };
};

export const updateConfirmation = (language) => {
  return {
    title: language == "en" ? "Confirmation" : "पुष्टीकरण",
    text:
      language == "en"
        ? "Are you sure you want to update application ?"
        : "तुम्ही अर्ज अपडेट करू इच्छिता का?",
    icon: "warning",
    buttons: language == "en" ? ["Cancel", "Yes"] : ["नाही", "होय"],
  };
};

export const recordDeleted = (language) => {
  return {
    title:
      language == "en"
        ? "Record is Successfully Deleted!"
        : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
    text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
    icon: "success",
    button: "ओके",
  };
};

export const recordIsSafe = (language) => {
  return {
    title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित",
    text:
      language == "en" ? "Your record is safe" : "तुमचे रेकॉर्ड सुरक्षित आहे",
    buttons: {
      confirm: language === "en" ? "OK" : "ओके",
    },
  };
};

export const saveRecord = (language) => {
  return {
    title: language == "en" ? "Saved!" : "जतन केले!",
    text:
      language == "en"
        ? "Record Saved successfully!"
        : "रेकॉर्ड यशस्वीरित्या जतन केले!",
    icon: "success",
    button: language == "en" ? "Ok" : "ओके",
  };
};

export const recordUpdated = (language) => {
  return {
    title: language == "en" ? "Updated!" : "अपडेट केले!",
    text:
      language == "en"
        ? "Record Updated successfully!"
        : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
    icon: "success",
    button: language == "en" ? "Ok" : "ओके",
  };
};
