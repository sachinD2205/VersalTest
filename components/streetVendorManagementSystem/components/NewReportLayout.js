import moment from "moment";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import styles from "../styles/NewReportsLayout.module.css";

const Index = ({
  date,
  centerHeader = false,
  centerData = false,
  showDates = false,
  columns = [],
  rows = [],
  columnLength = 0,
  children = <></>,
  extraRows = <></>,
  componentRef,
  reportName,
  deptName,
  style = {},
}) => {
  const language = useSelector((state) => state?.labels?.language);

  const printedBy = useSelector((state) =>
    state?.user?.user?.userDao
      ? language === "en"
        ? state?.user?.user?.userDao?.firstNameEn +
          " " +
          state?.user?.user?.userDao?.middleNameEn +
          " " +
          state?.user?.user?.userDao?.lastNameEn
        : state?.user?.user?.userDao?.firstNameMr +
          " " +
          state?.user?.user?.userDao?.middleNameMr +
          " " +
          state?.user?.user?.userDao?.lastNameMr
      : language === "en"
      ? state?.user?.user?.firstName +
        " " +
        state?.user?.user?.middleName +
        " " +
        state?.user?.user?.surname
      : state?.user?.user?.firstNamemr +
        " " +
        state?.user?.user?.middleNamemr +
        " " +
        state?.user?.user?.surnamemr,
  );

  // return
  return (
    <div ref={componentRef} className={styles.NewDivBhai}>
      <table className={styles.reportTable}>
        <tr>
          <td colSpan={columns.length > 1 ? columns.length : columnLength}>
            {/* Header */}
            <div className={styles.row}>
              <Image
                src='/logo.png'
                alt='PCMC Logo'
                width={80}
                height={80}
                objectFit='contain'
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
                src='/smartCityPCMC.png'
                alt='Pimpri Smart City'
                width={110}
                height={60}
                objectFit='contain'
              />
            </div>

            {/* Sub-Header 1 */}
            <div className={styles.subHeader}>
              <h3>
                {language == "en" ? "Department Name" : "विभागाचे नाव"}:{" "}
                <b>
                  {language == "en" ? deptName?.en ?? "" : deptName?.mr ?? ""}
                </b>
              </h3>
              <h3>
                {language == "en" ? "Report Name" : "अहवालाचे नाव"}:{" "}
                <b>
                  {language == "en"
                    ? reportName?.en ?? ""
                    : reportName?.mr ?? ""}
                </b>
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
      </table>
      <>{children}</>

      <table className={styles.reportTable}>
        <tfoot className={styles.tableFooter}>
          <tr>
            <td
              className={styles.row}
              colSpan={columns.length > 1 ? columns.length : columnLength}>
              {/* Footer */}
              <h3>
                {language == "en" ? "Printed By" : "छापनार्याचे नाव"}:{" "}
                <b>{printedBy}</b>
              </h3>

              <h3>
                {language == "en"
                  ? "Print Date and Time"
                  : "छापतांना तारीख आणि वेळ"}
                : <b>{moment(new Date()).format("DD-MM-YYYY HH:mm")}</b>
              </h3>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Index;
