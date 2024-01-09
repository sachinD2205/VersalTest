import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import moment from "moment";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class ItiTraineeAttendanceReportToPrint extends React.Component {
  render() {
    let itiDetails = this?.props?.ItiDetails;
    let traineeAttendance = this?.props?.traineeAttendance;
    console.log("this?.props?.ItiDetails", itiDetails);
    console.log("this?.props?.traineeAttendance?", traineeAttendance);

    let fromDate = new Date(this?.props?.ItiDetails?.fromDate);
    let toDate = new Date(this?.props?.ItiDetails?.toDate);
    const datesArr = [];
    for (
      let date = fromDate;
      date <= toDate;
      date.setDate(date.getDate() + 1)
    ) {
      let DD = String(date.getDate()).padStart(2, "0");
      let MM = String(date.getMonth() + 1).padStart(2, "0");
      let YY = String(date.getFullYear().toString());
      datesArr.push({ DD, MM, YY });
    }
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div className={styles.small} style={{ margin: "5px" }}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  component="div"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    <img src="/logo.png" alt="" height="100vh" width="100vw" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    शिक्षण मंडळ
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: "regular",
                      m: 1,
                    }}
                  >
                    पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८.
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 25,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    प्रशिक्षणार्थी उपस्थिती अहवाल
                  </Box>
                  <Divider />
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />

            <Grid
              container
              sx={{ padding: "6px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={4}>
                {" "}
                <Typography>आयटीआयचे नाव : {itiDetails?.itiName}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>ट्रेडचे नाव : {itiDetails?.tradeName}</Typography>
              </Grid>
              {/* <Grid item xs={4}>
                {" "}
                <Typography>तुकडी : {schoolDetails?.divisionName}</Typography>
              </Grid> */}
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />
            <div
              style={{
                height: "60vh",
                width: "100%",
                // display: "flex",
                justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <table style={{ border: "1px solid black", textAlign: "center" }}>
                <tr>
                  <th
                    style={{ width: "2%", border: "1px solid black" }}
                    rowSpan={2}
                  >
                    अनु क्रमांक.
                  </th>
                  <th
                    style={{ width: "10%", border: "1px solid black" }}
                    rowSpan={2}
                  >
                    प्रशिक्षणार्थी नाव
                  </th>
                  <th style={{ width: "10%" }} colSpan={31}>
                    Date : From{" "}
                    {moment(itiDetails?.fromDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )}{" "}
                    To{" "}
                    {moment(itiDetails?.toDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )}
                    {/* {schoolDetails?.fromDate} */}
                  </th>
                </tr>
                <tr>
                  {datesArr.map((obj, j) => {
                    return (
                      <td
                        key={j}
                        style={{ border: "1px solid black", width: 10 }}
                      >
                        {obj?.DD}
                      </td>
                    );
                  })}
                </tr>
                {traineeAttendance?.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td style={{ border: "1px solid black", width: 10 }}>
                        {i + 1}
                      </td>
                      <td
                        style={{ border: "1px solid black" }}
                      >{`${r?.traineeFirstName} ${r?.traineeMiddleName} ${r?.traineeLastName}`}</td>
                      {datesArr.map((obj, i) => {
                        let A = r?.tiDateWiseAttendance?.find(
                          (i) =>
                            i?.dayKey == obj?.DD &&
                            i?.monthKey == obj?.MM &&
                            i?.yearKey == obj?.YY
                        )?.presentAbsent;
                        let B = A ? A : "-";
                        return (
                          <td
                            key={i}
                            style={{ border: "1px solid black", width: 10 }}
                          >
                            {B}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
