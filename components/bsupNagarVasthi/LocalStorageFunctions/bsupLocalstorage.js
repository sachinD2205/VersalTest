export const addDataToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc));
};

export const removeDataToLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getDataFromLocalStorage = (key) => {
  const result = localStorage.getItem(key);
  const document = result ? JSON.parse(result) : null;
  console.log("CHECK", document);

  return document;
};
