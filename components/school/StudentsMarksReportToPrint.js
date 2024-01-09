import { Box, Divider, Grid, Typography } from "@mui/material";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
import moment from "moment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// class component To Print
export default class StudentsMarksReportToPrint extends React.Component {
  render() {
    console.log("grades", this.props.grades);
    const finalGrade = this.props.finalGrade;
    const grades = this.props.grades;
    const term1 = this.props.term1;
    const term2 = this.props.term2;
    console.log(finalGrade, "propsfinalGrade");
    const stuData = this.props.stuData;
    const language = this.props.language;
    console.log("stuData", stuData);
    // console.log("term1Print", term1);
    // console.log("term2Print", term2);
    let a = [1, 2, 3, 4, 5];
    //for dynamic age calc
    const dob = stuData?.dateOfBirth;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    // console.log("dob", dob);
    // console.log("age", age);
    const pageBreakstyles = {
      printPage: {
        pageBreakAfter: "always",
        "@media print": {
          pageBreakAfter: "always",
        },
      },
    };
    //styling for vertical lines
    const borderRight = {
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      fontWeight: "bold",
    };
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div className={styles.small} style={{ margin: "5px" }}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    component="div"
                    style={{ justifyContent: "center", alignItems: "center" }}
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
                      {language == "en" ? "Board of Education" : "शिक्षण मंडळ"}
                    </Box>
                    <Box
                      // style={{ justifyContent: "center", alignItems: "center", marginLeft: "50" }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: "regular",
                        m: 1,
                      }}
                    >
                      {language == "en"
                        ? "Pimpri Chinchwad Municipal Corporation,Pimpri-411018"
                        : "पिंपरी चिंचवड महानगरपालिका, पिंपरी- ४११ ०१८"}
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
                      {language == "en" ? "Academic Year : " : "सन : "}{" "}
                      {stuData?.academicYearName}
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
                      ●{" "}
                      {language == "en"
                        ? "Student Progress Sheet"
                        : "विद्यार्थी प्रगति पत्रक"}
                      ●
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
                      {language == "en"
                        ? "Class 1st to 7th"
                        : "इयत्ता १ ली ते ७ वी"}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en"
                    ? `School Name: ${stuData?.schoolName}`
                    : `शाळेचे नाव: ${stuData?.schoolNameMr}`}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en"
                    ? "Personal information"
                    : "वैयक्तिक माहिती"}
                  : {stuData?.personalInformation}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en" ? "Student Name :" : "विद्यार्थ्याचे नाव :"}
                  {language == "en" ? (
                    <b>{`${stuData?.firstName} ${stuData?.middleName} ${stuData?.lastName}`}</b>
                  ) : (
                    <b>{`${stuData?.firstNameMr} ${stuData?.middleNameMr} ${stuData?.lastNameMr}`}</b>
                  )}
                  {/* {language == "en"
                    ? `Student Name :  ${stuData?.firstName} ${stuData?.middleName} ${stuData?.lastName}`
                    : `विद्यार्थ्याचे नाव : ${stuData?.firstNameMr} ${stuData?.middleNameMr} ${stuData?.lastNameMr}`} */}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en"
                    ? `Roll Number: ${stuData?.id}`
                    : `हजेरी क्र: ${stuData?.id}`}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              sx={{ padding: "10px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={4}>
                {" "}
                <Typography style={{ float: "left" }}>
                  {language == "en" ? "Class" : "इयत्ता"}:{stuData?.className}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>
                  {language == "en" ? "Division" : "तुकडी"} :{" "}
                  {stuData?.divisionName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {" "}
                <Typography>
                  {language == "en" ? "Reg.No." : "रजि.नं."} :{" "}
                  {stuData?.admissionRegitrationNo}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              sx={{ padding: "10px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={6}>
                <Typography style={{ float: "left" }}>
                  {language == "en" ? "Father Name: " : "वडिलांचे नाव: "}
                  {`${stuData?.fatherFirstName} ${stuData?.fatherMiddleName} ${stuData?.fatherLastName}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Business" : "व्यवसाय"} :{" "}
                  {stuData?.fatherOccupation}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              sx={{ padding: "10px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={6}>
                <Typography style={{ float: "left" }}>
                  {language == "en"
                    ? `Mother Name: ${stuData?.motherName}`
                    : `आईचे नाव: ${stuData?.motherNameMr}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Business" : "व्यवसाय"} :{" "}
                  {stuData?.motherOccupation}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              sx={{ padding: "10px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={6}>
                <Typography style={{ float: "left" }}>
                  {language == "en"
                    ? `MotherTongue: ${stuData?.motherTongueName}`
                    : `मातृभाषा: ${stuData?.motherTongueName}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Medium: Marathi" : "माध्यम: मराठी"}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              sx={{ padding: "10px" }}
              style={{ textAlign: "center" }}
            >
              <Grid item xs={6}>
                <Typography style={{ float: "left" }}>
                  {language == "en" ? "Birth Date" : "जन्मतारीख"} :{" "}
                  {moment(stuData?.dateOfBirth, "YYYY-MM-DD").format(
                    "DD-MM-YYYY"
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Age" : "वय"} : {age}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {" "}
                  {language == "en" ? "Address" : "पत्ता"}:{" "}
                  {stuData?.parentAddress}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en" ? "Phone/Email no." : "दुरध्वनी / इमेल नं."}
                  :{`${stuData?.contactDetails} / ${stuData.studentEmailId}`}
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>
                  {language == "en"
                    ? "Health information : -"
                    : "आरोग्यविषयक माहिती : -"}{" "}
                  -{" "}
                </Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Weight" : "वजन"} :{" "}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {language == "en" ? "Height" : "उंची"} :{" "}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />
            <div style={{ marginTop: "300px" }}>
              <TableContainer component={Paper}>
                <Typography
                  component="div"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                    m: 1,
                  }}
                >
                  {language == "en"
                    ? "Descriptive Entries"
                    : "वर्णनात्मक नोंदी"}
                </Typography>
                <Divider />
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={borderRight}>
                        {language == "en" ? "Subjects" : "विषय"}
                      </TableCell>
                      <TableCell align="center" style={borderRight}>
                        {language == "en" ? "First Sem" : "प्रथम सत्र"}
                      </TableCell>
                      <TableCell align="center" style={borderRight}>
                        {language == "en" ? "Second Sem" : "द्वितीय सत्र"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {term1?.map((row) => {
                      let subject = row?.subject;
                      let T2subjects = term2?.find(
                        (i) => i?.subject === subject
                      );
                      let term2grade = T2subjects ? T2subjects?.grade : "";
                      return (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            style={borderRight}
                          >
                            {row.subjectName}
                          </TableCell>
                          <TableCell align="center" style={borderRight}>
                            {row.grade}
                          </TableCell>
                          <TableCell align="center" style={borderRight}>
                            {term2grade}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
              <Grid container sx={{ padding: "10px", marginTo: "10px" }}>
                <Grid item xs={12}>
                  <Typography>
                    <b>
                      {language == "en" ? "Overall Grade" : "एकूण श्रेणी"}:{" "}
                      {finalGrade?.finalGrade}
                    </b>
                  </Typography>
                </Grid>
              </Grid>
              <Divider />

              <TableContainer component={Paper}>
                <Typography
                  component="div"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "23px",
                    fontSize: 20,
                    fontWeight: "bold",
                    m: 1,
                  }}
                >
                  {language == "en" ? "Table of Grades" : "श्रेणीचा तक्ता"}
                </Typography>
                <Divider />

                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={borderRight}>
                        {language == "en"
                          ? "Range of Marks"
                          : "गुणांचे वर्गांतर"}
                      </TableCell>
                      {grades?.map((obj) => {
                        return (
                          <TableCell key={obj?.id} style={borderRight}>
                            {obj?.markRange}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    <TableRow>
                      <TableCell style={borderRight}>
                        {language == "en" ? "Grade" : "श्रेणी"}
                      </TableCell>
                      {grades?.map((obj) => {
                        return (
                          <TableCell key={obj?.id} style={borderRight}>
                            {obj?.grade}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </>
    );
  }
}
