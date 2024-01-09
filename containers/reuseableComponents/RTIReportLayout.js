import React from "react";
import Image from "next/image";
import styles from "../../styles/reusableComponents/RTIReportsLayout.module.css";
import { useSelector } from "react-redux";
import moment from "moment";
import FormattedLabel from "./FormattedLabel";
import { Grid } from "@mui/material";

const Index = ({
  date = { from: "", to: "" },
  centerHeader = false,
  centerData = false,
  showDates = false,
  vivaranPatra = false,
  columns = [],
  rows = [],
  customReportName = { en: "", mr: "" },
  customDeptName = { en: "", mr: "" },
  columnLength = 0,
  children = <></>,
  extraRows = <></>,
  componentRef,
  style = {},
}) => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels?.language);

  console.log("date", rows);

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
    <div className={styles.wrapper}>
      <div
        className={vivaranPatra ? styles.subWrapperOne : styles.subWrapper}
        style={style}
        ref={componentRef}
      >
        <div>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <td
                  colSpan={columns.length > 1 ? columns.length : columnLength}
                >
                  {/* Header */}
                  <div className={styles.one}>
                    <div className={styles.logo}>
                      <div>
                        <img
                          src="/smartCityPCMC.png"
                          alt=""
                          height="100vh"
                          width="100vw"
                        />
                      </div>
                    </div>
                    <div
                      className={styles.one}
                      styles={{
                        paddingTop: "15vh",
                        marginTop: "20vh",
                        display: "flex",
                      }}
                    >
                      <div className={styles.logo1} style={{ margin: "5px" }}>
                        <img
                          src="/logo.png"
                          alt=""
                          height="50vh"
                          width="50vw"
                        />
                      </div>
                      <h1>
                        <b>
                          <FormattedLabel id="pimpariChinchwadMaha" />
                        </b>
                      </h1>
                    </div>
                    <div className={styles.logo1}>
                      <img
                        src="/RTIReceiptLogo.jpeg"
                        alt=""
                        height="100vh"
                        width="100vw"
                      />
                    </div>
                  </div>

                  {/* Sub-Header 1 */}
                  <div className={styles.subHeader}>
                    <h3>
                      {language == "en" ? "Department Name" : "विभागाचे नाव"}:{" "}
                      <b>
                        {/* {language == 'en'
                          ? deptName?.applicationNameEng ?? ''
                          : deptName?.applicationNameMr ?? ''} */}
                        {language == "en"
                          ? customDeptName.en != ""
                            ? customDeptName.en
                            : deptName?.applicationNameEng
                          : customDeptName.mr != ""
                          ? customDeptName.mr
                          : deptName?.applicationNameMr}
                      </b>
                    </h3>
                    <h3>
                      {language == "en" ? "Report Name" : "अहवालाचे नाव"}:{" "}
                      <b>
                        {language == "en"
                          ? customReportName.en != ""
                            ? customReportName.en
                            : reportName?.menuNameEng
                          : customReportName.mr != ""
                          ? customReportName.mr
                          : reportName?.menuNameMr}
                      </b>
                    </h3>
                  </div>
                  {(reportName?.menuNameEng == "vivaran patra 02" ||
                    reportName?.menuNameMr === "विवरण पत्र 02") && (
                    <div className={styles.row}>
                      <h3>
                        {language == "en" ? "Month-Year" : "महिना-वर्ष"}:{" "}
                        <b>{date.from}</b>
                      </h3>
                    </div>
                  )}

                  {/* Sub-Header 2 */}
                  {/* {showDates && (
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
                  )} */}
                  {showDates &&
                    (moment(date.from, "DD-MM-YYYY").isValid() ? (
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
                    ) : (
                      <div className={styles.row}>
                        <h3>
                          {language === "en"
                            ? "Month and Year"
                            : "महिना आणि वर्ष"}
                          :{" "}
                          <b>
                            {moment(date.from, "MM-YYYY").format("MMMM YYYY")}
                          </b>
                        </h3>
                      </div>
                    ))}
                </td>
              </tr>
            </thead>
            {vivaranPatra && (
              <Grid
                container
                spacing={2}
                style={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    {reportName?.menuNameEng == "vivaran patra 01" && (
                      <strong>{"विवरण पत्र ०१"}</strong>
                    )}
                    {reportName?.menuNameEng == "vivaran patra 02" && (
                      <strong>{"विवरण पत्र ०२"}</strong>
                    )}

                    {reportName?.menuNameEng == "vivaran patra 03" && (
                      <strong>{"विवरण पत्र ०३"}</strong>
                    )}
                    {reportName?.menuNameEng == "vivaran patra 04" && (
                      <strong>{"विवरण पत्र ०४"}</strong>
                    )}
                    {reportName?.menuNameEng == "vivaran patra 05" && (
                      <strong>{"विवरण पत्र ०५"}</strong>
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>कलम २५ (३) (च)</strong>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>
                      माहितीचा अधिकार अधिनियम, २००५ चा आशय व हेतू यांचे
                      कार्यान्वयन व अंमलबजावणी करण्यासाठी
                    </strong>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>
                      सार्वजनिक प्राधिकरणांकडून केलेले प्रयत्न दर्शविणा-या
                      गोष्टी
                    </strong>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={8}
                  md={8}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>
                      (क्षेत्रीय कार्यालयातील व मंत्रालयातील प्रत्येक अपिलीय
                      प्राधिका-याने
                    </strong>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>
                      अनुक्रमे विभागप्रमुख / समन्वय कक्षाकडे दरमहा माहिती
                      पाठविण्यासंदर्भातील विवरणपत्र)
                    </strong>
                  </div>
                </Grid>
              </Grid>
            )}
            <div className={styles.tableBody}>
              {columns.length == 0 ? (
                <>{children}</>
              ) : (
                <tbody>
                  <tr className={styles.tableHeaders}>
                    {columns.map((obj, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: centerHeader ? "center" : "start",
                          width: obj.width,
                          maxWidth: obj.width,
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
                  {rows.length == 0 ? (
                    <tr>
                      <td
                        className={styles.tableData}
                        colSpan={
                          columns.length > 1 ? columns.length : columnLength
                        }
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {language == "en" ? "No Data" : "माहिती उपलब्ध नाही"}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {rows.map((rowData, i) => (
                        <tr key={i}>
                          {columns.map((column, j) => (
                            <td
                              key={j}
                              className={styles.tableData}
                              style={{
                                textAlign: centerData ? "center" : "start",
                              }}
                            >
                              {rowData[column.field] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {extraRows}
                    </>
                  )}
                </tbody>
              )}
            </div>

            <tfoot className={styles.tableFooter}>
              <tr>
                <td
                  className={styles.row}
                  colSpan={columns.length > 1 ? columns.length : columnLength}
                >
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
      </div>
    </div>
  );
};

export default Index;
