
export const manageStatus = (status, language, statusAll) => {
  // console.log("statusAl12l ",status)
  // console.log("statusAll ",statusAll)

  // console.log("language ",statusAll?.find((obj) => {
  //   return obj.status == status;
  // })
  //   ? statusAll.find((obj) => {
  //     return obj.status == status;
  //   }).statusTxt: "-")

  return language === 'en' ? statusAll?.find((obj) => {
    return obj.status == status;
  })
    ? statusAll.find((obj) => {
      return obj.status == status;
    }).statusTxt
    : "-" : statusAll?.find((obj) => {
      return obj.status == status;
    })
    ? statusAll.find((obj) => {
      return obj.status == status;
    }).statusTxtMr
    : "-"
};




