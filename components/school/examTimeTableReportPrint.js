import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
import { useSelector } from "react-redux";
import moment from "moment";

// class component To Print
export default class ExamTimeTableReportPrint extends React.Component {
  render() {
    console.log("data111", this.props.data);
    console.log("uuu", this.props.language);
    console.log("uuu", this.props.sub);
    let timeTableData = this.props.data.examTimeTableDao;
    // const mondayData = this.props.data.monDayDao;
    // const tuesdayData = this.props.data.tuesDayDao;
    // const wednesdayData = this.props.data.wednesDayDao;
    // const thursdayData = this.props.data.thursDayDao;
    // const fridayData = this.props.data.fridayDao;
    // const saturdayData = this.props.data.saturdayDao;

    const border = {
      border: "1px solid black",
    };
    return (
      <>
        <div className={styles.main}>
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
                    {this?.props?.language == "en"
                      ? "Exam Timetable"
                      : "परीक्षा वेळापत्रक"}
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
              <Grid item xs={6}>
                {" "}
                <Typography>
                  {this?.props?.language == "en" ? "School Name" : "शाळेचे नाव"}{" "}
                  : {this?.props?.data?.schoolName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {" "}
                <Typography>
                  {this?.props?.language == "en" ? "Class:" : "इयत्ता:"} :{" "}
                  {this?.props?.data?.className}
                </Typography>
              </Grid>
            </Grid>
            {/* <Divider sx={{ borderBottomWidth: 5 }} /> */}
            <div style={{ height: "20vh", width: "100vw" }}>
              <table
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                  width: "100%",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <tr>
                  <th style={border}> {this?.props?.language == "en" ? "Sr.No :" : "अनु क्र"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "Date Of Exam" : "परीक्षेची तारीख"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "From Time" : " या वेळेपासून"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "To Time" : " या वेळेपर्यंत"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "Subject" : "विषय"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "Out Of Marks" : "आउट ऑफ मार्क्स"} </th>
                  <th style={border}> {this?.props?.language == "en" ? "Minimum Marks" : " किमान गुण"} </th>

                </tr>

                {timeTableData.map((exam, j) => {
                  return (
                    <>
                      <tr>
                        <td style={border}>{j + 1}</td>
                        <td style={border}>
                          {moment(exam.dateOfExam).format("DD/MM/YYYY")}
                        </td>
                        <td style={border}>
                          {" "}
                          {moment(exam.fromTime, "hh:mm:ss").format("hh:mm a")}
                        </td>
                        <td style={border}>
                          {" "}
                          {moment(exam.toTime, "hh:mm:ss").format("hh:mm a")}
                        </td>
                        {/* <td style={border}>{exam.toTime}</td> */}
                        <td style={border}>
                          {
                            this?.props?.sub?.find(
                              (sub) => sub?.id == exam.subjectKey
                            )?.subjectName
                          }
                        </td>
                        <td style={border}>{exam.outOfMarks}</td>
                        <td style={border}>{exam.minimumMark}</td>
                      </tr>
                    </>
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
