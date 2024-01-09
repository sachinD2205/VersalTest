export const addDocumentToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc));
};

export const removeDocumentToLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getDocumentFromLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  const document = result ? JSON.parse(result) : null;
  console.log("CHECK", document);

  return document;
};

export const getDocumentFromLocalStorageForSendingTheData = (key) => {
  const result = localStorage.getItem(key);
  const document = result ? JSON.parse(result) : null;
  console.log("CHECK", document);
  let _doc = document?.map((obj) => {
    return {
      applicantKey: obj.applicantKey,
      attachedDate: obj.attachedDate,
      // documentKey: obj.documentKey,
      documentPath: obj.documentPath,
      documentType: obj.documentType,
    };
  });

  return _doc !== undefined ? [..._doc] : [];
};

////////////////////////>>>>>>>  NEW FUNCTIONS FOR QUERY DATA  <<<<<<<<////////////////////////////

export const addQueryDataToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc));
};

export const removeQueryDataToLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getQueryDataFromLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  const document = result ? JSON.parse(result) : null;

  return document;
};

////////////////////////>>>>>>>  NEW FUNCTIONS FOR LEVEL_WISE_ESCALATION  <<<<<<<<////////////////////////////

export const addLEVEL_WISE_ESCALATIONToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc));
};

export const removeLEVEL_WISE_ESCALATIONToLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getLEVEL_WISE_ESCALATIONFromLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  const document = result ? JSON.parse(result) : null;

  return document;
};
