import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
import { useSelector } from "react-redux";
// class component To Print
export default class TeacherClassTimeTable extends React.Component {
  render() {
    let lan = this.props.language;
    let renderedData = this.props.data?.dayWiseDao;
    console.log("renderedData", renderedData);

    // const mondayData = renderedData?.filter((i) => i?.weekDayKey === 1);
    // const tuesdayData = renderedData?.filter((i) => i?.weekDayKey === 2);
    // const wednesdayData = renderedData?.filter((i) => i?.weekDayKey === 3);
    // const thursdayData = renderedData?.filter((i) => i?.weekDayKey === 4);
    // const fridayData = renderedData?.filter((i) => i?.weekDayKey === 5);
    // const saturdayData = renderedData?.filter((i) => i?.weekDayKey === 6);

    const border = {
      border: "1px solid black",
    };
    const thStyle = {
      border: "1px solid black",
      width: "90%",
    };
    const tdStyle = {
      border: "1px solid black",
      paddingLeft: "10px",
      width: "90%",
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
                    <img src="/logo.png" alt="" height="100vh" width="80vw" />
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
                    {lan == "en"
                      ? "Teacher's Timetable"
                      : "शिक्षकाचे वेळापत्रक"}
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
                  {lan == "en" ? "School Name" : "शाळेचे नाव"} :{" "}
                  {lan === "en"
                    ? `${this.props.data.schoolName}`
                    : `${this.props.data.schoolNameMr}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {lan == "en" ? "Teacher's Name" : "शिक्षकाचे नाव"}:{" "}
                  {this?.props?.data?.teacherName}
                </Typography>
              </Grid>
            </Grid>
            {/* <Divider sx={{ borderBottomWidth: 5 }} /> */}
            <div style={{ height: "30vh", width: "100vw" }}>
              <table
                style={{
                  border: "1px solid black",
                  // textAlign: "center",
                  textJustify: "center",
                  width: "100%",
                  paddingTop: "5px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  marginTop: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              ></table>
              <table
                style={{
                  border: "1px solid black",
                  // textAlign: "center",
                  textJustify: "center",
                  width: "100%",
                  paddingBottom: "5px",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  marginBottom: "5px",
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                <>
                  {" "}
                  <tr style={{ display: "flex" }}>
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 1) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Monday" : "सोमवार"}
                      </th>
                    )}
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 2) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Tuesday" : "मंगळवार"}
                      </th>
                    )}
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 3) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Wednesday" : "बुधवार"}
                      </th>
                    )}
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 4) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Thursday" : "गुरुवार"}
                      </th>
                    )}
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 5) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Friday" : "शुक्रवार"}
                      </th>
                    )}
                    {renderedData?.find((wkDay) => wkDay?.weekDayKey == 6) && (
                      <th style={thStyle}>
                        {lan === "en" ? "Saturday" : "शनिवार"}
                      </th>
                    )}
                  </tr>
                  <tr style={{ display: "flex" }}>
                    {renderedData &&
                      renderedData?.map((obj) => {
                        return (
                          <td
                            // style={{
                            //   border: "1px solid black",
                            //   paddingLeft: "10px",
                            // }}
                            style={tdStyle}
                          >
                            {obj?.teacherAssginTimeAndDivisionDao?.map(
                              (data) => {
                                return (
                                  <tr>
                                    {lan == "en" ? "Time" : "वेळ"} :{" "}
                                    {`${data?.fromTime} ${
                                      lan == "en" ? "To" : "ते"
                                    } ${data?.toTime}`}{" "}
                                    <br />
                                    {lan == "en" ? "Subject" : "विषय"} :{" "}
                                    {data?.subjectName}
                                    <br />
                                    {lan == "en" ? "Division" : "तुकडी"}:{" "}
                                    {data?.divisionName}
                                    <hr />
                                  </tr>
                                );
                              }
                            )}
                          </td>
                        );
                      })}
                  </tr>
                </>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}
