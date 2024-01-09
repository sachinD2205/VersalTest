import React, { useState } from "react"
import Image from "next/image"
import styles from "./ReportsLayoutComponent.module.css"
import { useSelector } from "react-redux"
import moment from "moment"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = ({
  deptName = { en: "Dept En", mr: "Dept Mr" },
  reportName = { en: "Report En", mr: "Report Mr" },
  date = { from: "", to: "" },
  centerHeader = false,
  centerData = false,
  showDates = false,
  columns = [],
  rows = [],
  columnLength = 0,
  children = <></>,
  componentRef,
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const printByNameDao =
    // @ts-ignore
    useSelector((state) => state?.user?.user?.userDao) ??
    // @ts-ignore
    useSelector((state) => state.user.user)

  return (
    <div className={styles.wrapper} ref={componentRef}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td colSpan={columns.length > 1 ? columns.length : columnLength}>
              {/* Header */}
              <div className={styles.row}>
                <Image
                  src="/logo.png"
                  alt="PCMC Logo"
                  width={80}
                  height={80}
                  objectFit="contain"
                />
                <div className={styles.middleHeader}>
                  <h2>
                    {language == "en"
                      ? "Pimpri-Chinchwad Municipal Corporation"
                      : "पिंपरी चिंचवड महानगरपालिका"}
                  </h2>

                  <h3>
                    {language == "en"
                      ? "Mumbai-Pune Road, Pimpri - 411018"
                      : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८"}
                  </h3>
                </div>
                <Image
                  src="/smartCityPCMC.png"
                  alt="Pimpri Smart City"
                  width={110}
                  height={60}
                  objectFit="contain"
                />
              </div>

              {/* Sub-Header 1 */}
              <div className={styles.subHeader}>
                <h3>
                  {language == "en" ? "Department Name" : "विभागाचे नाव"}:{" "}
                  <b>{deptName[language]}</b>
                </h3>
                <h3>
                  {language == "en" ? "Report Name" : "अहवालाचे नाव"}:{" "}
                  <b>{reportName[language]}</b>
                </h3>
              </div>

              {/* Sub-Header 2 */}
              {showDates && (
                <div className={styles.row}>
                  <h3>
                    {language == "en" ? "From Date" : "या तारखेपासून"}:{" "}
                    <b>{date.from}</b>
                  </h3>
                  <h3>
                    {language == "en" ? "To Date" : "या तारखेपर्यंत"}:{" "}
                    <b>{date.to}</b>
                  </h3>
                </div>
              )}
            </td>
          </tr>
        </thead>
        {rows.length == 0 ? (
          <>{children}</>
        ) : (
          <tbody>
            <tr className={styles.tableHeaders}>
              {columns.map((obj, i) => (
                <td
                  style={{
                    textAlign: centerHeader ? "center" : "start",
                  }}
                >
                  {obj.formattedLabel ? (
                    <FormattedLabel id={obj.formattedLabel} />
                  ) : (
                    obj.headerName
                  )}
                </td>
              ))}
            </tr>
            {rows.map((rowData) => (
              <tr className={styles.tableData}>
                {columns.map((column) => (
                  <td
                    style={{
                      textAlign: centerData ? "center" : "start",
                    }}
                  >
                    {rowData[column.field] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}

        <tfoot>
          <tr>
            <td colSpan={columns.length > 1 ? columns.length : columnLength}>
              {/* Footer */}
              <div className={styles.row} style={{ marginTop: 40 }}>
                <h3>
                  {language == "en" ? "Printed By" : "छापणाऱ्याचे नाव"}:{" "}
                  <b>
                    {useSelector(
                      (state) =>
                        // @ts-ignore
                        state?.user?.user?.userDao
                    )
                      ? language === "en"
                        ? printByNameDao.firstNameEn +
                        " " +
                        printByNameDao.middleNameEn +
                        " " +
                        printByNameDao.lastNameEn
                        : printByNameDao?.firstNameMr +
                        " " +
                        printByNameDao?.middleNameMr +
                        " " +
                        printByNameDao?.lastNameMr
                      : language === "en"
                        ? printByNameDao.firstName +
                        " " +
                        printByNameDao.middleName +
                        " " +
                        printByNameDao.surname
                        : printByNameDao.firstNamemr +
                        " " +
                        printByNameDao.middleNamemr +
                        " " +
                        printByNameDao.surnamemr}
                  </b>
                </h3>

                <h3>
                  {language == "en"
                    ? "Print Date and Time"
                    : "छापतांना तारीख आणि वेळ"}
                  : <b>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</b>
                </h3>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Index
