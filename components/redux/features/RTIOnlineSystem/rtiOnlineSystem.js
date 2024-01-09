export const addDocumentToLocalStorage = (key, doc) => {
    localStorage.setItem(key, JSON.stringify(doc))
  }
  
  export const removeDocumentToLocalStorage = (key) => {
    localStorage.removeItem(key)
  }
  
  export const getDocumentFromLocalStorage = (key) => {
    const result = localStorage.getItem(key)
    const document = result ? JSON.parse(result) : null
    return document
  }
  