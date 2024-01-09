import React from "react";
import Image from "next/image";
// import styles from "../../styles/reusableComponents/NewReportsLayout.module.css";
import styles from "../../../styles/reusableComponents/NewReportsLayout.module.css";
import { useSelector } from "react-redux";
import moment from "moment";
// import FormattedLabel from "./FormattedLabel";

const Index = ({
  date = { from: "", to: "" },
  centerHeader = false,
  centerData = false,
  showDates = false,
  columns = [],
  rows = [],
  columnLength = 0,
  children = <></>,
  extraRows = <></>,
  componentRef,
  style = {},
}) => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels?.language);

  const printedBy = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.userDao
      ? language === "en"
        ? // @ts-ignore
          state?.user?.user?.userDao?.firstNameEn +
          " " +
          // @ts-ignore
          state?.user?.user?.userDao?.middleNameEn +
          " " +
          // @ts-ignore
          state?.user?.user?.userDao?.lastNameEn
        : // @ts-ignore
          state?.user?.user?.userDao?.firstNameMr +
          " " +
          // @ts-ignore
          state?.user?.user?.userDao?.middleNameMr +
          " " +
          // @ts-ignore
          state?.user?.user?.userDao?.lastNameMr
      : language === "en"
      ? // @ts-ignore
        state?.user?.user?.firstName +
        " " +
        // @ts-ignore
        state?.user?.user?.middleName +
        " " +
        // @ts-ignore
        state?.user?.user?.surname
      : // @ts-ignore
        state?.user?.user?.firstNamemr +
        " " +
        // @ts-ignore
        state?.user?.user?.middleNamemr +
        " " +
        // @ts-ignore
        state?.user?.user?.surnamemr
  );
  const reportName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
    )
  );

  const deptName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.applications?.find(
      // @ts-ignore
      (dept) => dept.id == state?.user?.selectedApplicationId
    )
  );

  return (
    <div ref={componentRef} className={styles.NewDivBhai}>
      <table className={styles.reportTable}>
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
                <b>
                  {language == "en"
                    ? deptName?.applicationNameEng ?? ""
                    : deptName?.applicationNameMr ?? ""}
                </b>
              </h3>
              <h3>
                {language == "en" ? "Report Name" : "अहवालाचे नाव"}:{" "}
                <b>
                  {language == "en"
                    ? reportName?.menuNameEng ?? ""
                    : reportName?.menuNameMr ?? ""}
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
              colSpan={columns.length > 1 ? columns.length : columnLength}
            >
              {/* Footer */}
              {/* <h3>
                {language == "en" ? "Printed By" : "छापनार्याचे नाव"}:{" "}
                <b>{printedBy}</b>
              </h3> */}

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
