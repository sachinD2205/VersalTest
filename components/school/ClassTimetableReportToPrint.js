import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
// import styles from "../security/ComponentToPrint.module.css";
import styles from "../school/ITInSchoolComponentToPrint.module.css";
// class component To Print
export default class ClassTimetableReportToPrint extends React.Component {
  render() {
    console.log("props.subjectList", this?.props?.subjectList);
    console.log("teacherList", this?.props?.teacherList);
    // console.log("mr", this?.props?.data[0]?.schoolNameMr);

    let teacherList = this?.props?.teacherList;
    let subjectList = this?.props?.subjectList;
    let lan = this?.props?.language;
    const lastIndex = (this?.props?.data?.length > 0) ? this?.props?.data?.length - 1 : 0;

    const data = this.props.data.map((r) => {
      return {
        id: r.id,
        schoolName: r.schoolName,
        schoolNameMr: r.schoolNameMr,
        academicYearName: r.academicYearName,
        className: r.className,
        divisionName: r.divisionName,
      };
    });

    const renderedData = this?.props?.data[lastIndex]?.timeTableDao?.map((r) => {
      console.log("ddd", r);
      return {
        id: r.id,
        time: `${r.fromTime} To ${r.toTime}`,
        periodDao: r.periodDao,
      };
    });

    console.log("data", data);
    console.log("renderedData_length", this.props.data?.length);

    const border = {
      border: "1px solid black",
    };
    const tdStyle = {
      border: "1px solid black",
      whiteSpace: "pre-line", // Enables line breaks
    };

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
                    शाळेचे वेळापत्रक
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
                <Typography>
                  शाळेचे नाव :
                  {lan === "en"
                    ? `${data[0]?.schoolName}`
                    : `${data[0]?.schoolNameMr}`}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>
                  वर्गाचे नाव :{" "}
                  {data[0]?.className ? data[0]?.className : "---"}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {" "}
                <Typography>
                  विभागणी:{" "}
                  {data[0]?.divisionName ? data[0]?.divisionName : "---"}
                </Typography>
              </Grid>
            </Grid>
            {/* <Divider sx={{ borderBottomWidth: 5 }} /> */}
            <div style={{ height: "60vh", width: "100vw" }}>
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
                  <th style={border}>
                    {lan === "en" ? "Sr.No." : "अनु. क्र."}
                  </th>
                  <th style={border}>{lan === "en" ? "Time" : "वेळ"}</th>
                  <th style={border}>{lan === "en" ? "Monday" : "सोमवार"}</th>
                  <th style={border}>{lan === "en" ? "Tuesday" : "मंगळवार"}</th>
                  <th style={border}>
                    {lan === "en" ? "Wednesday" : "बुधवार"}
                  </th>
                  <th style={border}>
                    {lan === "en" ? "Thursday" : "गुरुवार"}
                  </th>
                  <th style={border}>{lan === "en" ? "Friday" : "शुक्रवार"}</th>
                  <th style={border}>{lan === "en" ? "Saturday" : "शनिवार"}</th>
                </tr>
                {renderedData.map((obj, j) => {
                  let day = obj.periodDao;

                  let a = day?.find((obj) => obj?.weekDayKey === 1)?.subjectKey;
                  let a1 = subjectList?.find((obj) => obj?.value == a)?.label;
                  let a2 = day?.find(
                    (obj) => obj?.weekDayKey === 1
                  )?.teacherKey;
                  let a3 = teacherList?.find((obj) => obj?.value == a2)?.label;

                  let b = day?.find((obj) => obj?.weekDayKey === 2)?.subjectKey;
                  let b1 = subjectList?.find((obj) => obj?.value == b)?.label;
                  let b2 = day?.find((obj) => obj?.weekDayKey == 2)?.teacherKey;
                  let b3 = teacherList?.find((obj) => obj?.value == b2)?.label;

                  let c = day?.find((obj) => obj?.weekDayKey === 3)?.subjectKey;
                  let c1 = subjectList?.find((obj) => obj?.value == c)?.label;
                  let c2 = day?.find((obj) => obj?.weekDayKey == 3)?.teacherKey;
                  let c3 = teacherList?.find((obj) => obj?.value == c2)?.label;

                  let d = day?.find((obj) => obj?.weekDayKey === 4)?.subjectKey;
                  let d1 = subjectList?.find((obj) => obj?.value == d)?.label;
                  let d2 = day?.find((obj) => obj?.weekDayKey == 4)?.teacherKey;
                  let d3 = teacherList?.find((obj) => obj?.value == d2)?.label;

                  let e = day?.find((obj) => obj?.weekDayKey === 5)?.subjectKey;
                  let e1 = subjectList?.find((obj) => obj?.value == e)?.label;
                  let e2 = day?.find((obj) => obj?.weekDayKey == 5)?.teacherKey;
                  let e3 = teacherList?.find((obj) => obj?.value == e2)?.label;

                  let f = day?.find((obj) => obj?.weekDayKey === 6)?.subjectKey;
                  let f1 = subjectList?.find((obj) => obj?.value == f)?.label;
                  let f2 = day?.find((obj) => obj?.weekDayKey == 6)?.teacherKey;
                  let f3 = teacherList?.find((obj) => obj?.value == f2)?.label;

                  console.log("pp", a, b);
                  return (
                    <tr key={obj.id}>
                      <td style={border}>{j + 1}</td>
                      <td style={border}>{obj.time}</td>

                      <td style={tdStyle}>
                        {a1 && a3 ? `${a1} \n(${a3})` : ""}
                      </td>

                      <td style={tdStyle}>
                        {b1 && b3 ? `${b1} \n(${b3})` : ""}
                      </td>

                      <td style={tdStyle}>
                        {c1 && c3 ? `${c1} \n(${c3})` : ""}
                      </td>

                      <td style={tdStyle}>
                        {d1 && d3 ? `${d1} \n(${d3})` : ""}
                      </td>

                      <td style={tdStyle}>
                        {e1 && e3 ? `${e1} \n(${e3})` : ""}
                      </td>

                      <td style={tdStyle}>
                        {f1 && f3 ? `${f1} \n(${f3})` : ""}
                      </td>
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
