import React, { useEffect } from "react"
import { useSelector } from "react-redux"

const Table = (props) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  useEffect(() => {
    console.table(props.rows)
  }, [])

  const styles = {
    tablePrint: { margin: "2vh" },
    tableHeaders: {
      // backgroundColor: "rgb(189, 189, 189)",
      backgroundColor: "#9ccdff",
      padding: "1vh 0vh",
      fontSize: "medium",
      fontFamily: "sans-serif",
      border: "1px solid black",
    },
    tableRow: {
      padding: "1vh 0vh",
      fontFamily: "sans-serif",
      border: "1px solid black",
    },
    tableRowData: {
      border: "1px solid black",
    },
  }

  return (
    <table style={styles.tablePrint} ref={props.toPrint}>
      <tr>
        {props.columns.map((header, index) => {
          return (
            <th
              key={index}
              style={{
                ...styles.tableHeaders,
                width: header.width,
              }}
            >
              {header.headerName}
            </th>
          )
        })}
      </tr>

      {props.rows.map((rowData, index) => {
        return (
          <tr key={index} style={{ ...styles.tableRow, textAlign: "center" }}>
            <td style={styles.tableRowData}>{rowData.srNo}</td>
            <td style={styles.tableRowData}>
              {language === "en" ? rowData.fullNameEn : rowData.fullNameMr}
            </td>
            <td style={styles.tableRowData}>
              {language === "en" ? rowData.genderEn : rowData.genderMr}
            </td>
            <td style={styles.tableRowData}>{rowData.DOB}</td>
            <td style={styles.tableRowData}>
              {language === "en" ? rowData.wardEn : rowData.wardMr}
            </td>
            <td style={styles.tableRowData}>
              {language === "en"
                ? rowData.electedWardEn
                : rowData.electedWardMr}
            </td>
            <td style={styles.tableRowData}>
              {language === "en" ? rowData.religionEn : rowData.religionMr}
            </td>
          </tr>
        )
      })}
    </table>
  )
}

export default Table
