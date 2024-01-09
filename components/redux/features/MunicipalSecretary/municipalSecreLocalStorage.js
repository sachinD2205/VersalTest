export const filterDocketAddToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc))
}

export const filterDocketRemoveToLocalStorage = (key) => {
  localStorage.removeItem(key)
}
export const getFilterDocketFromLocalStorage = (key) => {
  const result = localStorage.getItem(key)
  const document = result ? JSON.parse(result) : null
  return document
}
//////////////////////////////////////////////////////////

export const addPrepareAgendaDataToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc))
}

export const removePrepareAgendaDataToLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export const getPrepareAgendaDataFromLocalStorage = (key) => {
  const result = localStorage.getItem(key)
  const document = result ? JSON.parse(result) : null
  console.log("CHECK", document)

  return document
}
//////////////////////////////////////////////////////////
export const docketToShowAddToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc))
}

export const docketToShowRemoveFromLocalStorage = (key) => {
  localStorage.removeItem(key)
}
export const docketToShowFromLocalStorage = (key) => {
  const result = localStorage.getItem(key)
  const document = result ? JSON.parse(result) : null
  return document
}
//////////////////////////////////////////////////////////

export const agendaPreviewAddToLocalStorage = (key, doc) => {
  localStorage.setItem(key, JSON.stringify(doc))
}

export const agendaPreviewRemoveFromLocalStorage = (key) => {
  localStorage.removeItem(key)
}
export const agendaPreviewGetFromLocalStorage = (key) => {
  const result = localStorage.getItem(key)
  const document = result ? JSON.parse(result) : null
  return document
}
//////////////////////////////////////////////////////////
