import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import moment from "moment";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class StudentsAttendanceReportToPrint extends React.Component {
  render() {
    let schoolDetails = this?.props?.schoolDetails;
    let studentAttendance = this?.props?.studentAttendance;
    console.log("this?.props?.schoolDetails", schoolDetails);
    console.log("this?.props?.studentAttendance?", studentAttendance);

    let fromDate = new Date(this?.props?.schoolDetails?.fromDate);
    let toDate = new Date(this?.props?.schoolDetails?.toDate);
    const datesArr = [];
    for (let date = fromDate; date <= toDate; date.setDate(date.getDate() + 1)) {
      let DD = String(date.getDate()).padStart(2, "0");
      let MM = String(date.getMonth() + 1).padStart(2, "0");
      let YY = String(date.getFullYear().toString());
      datesArr.push({ DD, MM, YY });
    }
    const borderRight = {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      fontWeight: "bold",
    };
    return (
      <>
        {/* <div className={styles.main} style={{ border: "2px solid black" }}> */}
        <div className={styles.main} >
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
                  style={{ justifyContent: "center", alignItems: "center", marginBottom: "10px" }}
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
                    विद्यार्थी उपस्थिती अहवाल
                  </Box>
                  <Divider />
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />

            <Grid container sx={{ padding: "6px" }} style={{ textAlign: "center" }}>
              <Grid item xs={4}>
                {" "}
                <Typography>शाळेचे नाव : {schoolDetails?.schoolNameMr}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>इयत्ता : {schoolDetails?.className}</Typography>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <Typography>तुकडी : {schoolDetails?.divisionName}</Typography>
              </Grid>
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
                  <th style={{ width: "2%", border: "1px solid black" }} rowSpan={2}>
                    अनु क्रमांक.
                  </th>
                  <th style={{ width: "10%", border: "1px solid black" }} rowSpan={2}>
                    विद्यार्थ्याचे नाव
                  </th>
                  <th style={{ width: "10%" }} colSpan={31}>
                    Date : From {moment(schoolDetails?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")} To{" "}
                    {moment(schoolDetails?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    {/* {schoolDetails?.fromDate} */}
                  </th>
                </tr>
                <tr>
                  {datesArr.map((obj, j) => {
                    // return <td style={{ border: "1px solid black", width: 10 }}>{j + 1}</td>;
                    return <td style={{ border: "1px solid black", width: 10 }}>{obj.DD}</td>;
                  })}
                </tr>
                {studentAttendance?.map((r, i) => {
                  return (
                    <tr key={r.studentKey}>
                      {/* <td style={{ border: "1px solid black", width: 10 }}>{i + 1}</td> */}
                      <td style={{ border: "1px solid black", width: 10 }}>{i + 1}</td>
                      <td
                        style={{ border: "1px solid black" }}
                      >{`${r?.studentFirstName} ${r?.studentMiddleName} ${r?.studentLastName}`}</td>
                      {datesArr.map((obj, i) => {

                        console.log("data", r?.absentPresenetStudentDao);
                        let A = r?.absentPresenetStudentDao?.find(
                          (i) => i?.dateKey == obj?.DD && i?.monthKey == obj?.MM && i?.yearKey == obj?.YY,
                        )?.studentPresentAbsent;
                        console.log("aaaa", A);
                        let B = A ? A : "-";
                        return (
                          // console.log("dd",B)
                          <td key={i} style={{ border: "1px solid black", width: 10 }}>
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
