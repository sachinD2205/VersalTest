import { Box, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
// class component To Print
export default class LeavingCertificateToPrint extends React.Component {
  render() {
    //for current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear());
    let todaysDate = `${dd}/${mm}/${yy}`;
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const d = new Date();
    let name = month[d.getMonth()];
    console.log("props", this.props.data);
    const language = this.props.language;
    const studentData = this.props.studentData;
    let studentNameMr = `${studentData.firstNameMr} ${studentData.middleNameMr} ${studentData.lastNameMr}`;
    let isDuplicate = this?.props?.data?.isDuplicate ? (
      <span style={{ color: "red" }}>{language == "en" ? "(Duplicate)" : "(डुप्लिकेट)"}</span>
    ) : (
      ""
    );
    console.log("studentDataForLeaving", this.props.studentData);
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div className={styles.small} style={{ margin: "5px" }}>
            <Grid container sx={{ padding: "6px" }}>
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
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    zIndex: "1",
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
                    {language == "en" ? "Board of Education" : "शिक्षण मंडळ"}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      // fontWeight: "regular",
                      // m: 1,
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
                      fontSize: 20,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {language == "en" ? `School Leaving Certificate` : `शाळा सोडल्याचा दाखला `} {isDuplicate}
                  </Box>
                  {/* {isDuplicate && (
                    <div
                      style={{
                        position: "fixed",
                        top: "45%",
                        left: "40%",
                        marginTop: "-50px",
                        marginLeft: "-90px",
                        opacity: "0.4",
                        fontSize: "80px",
                        fontWeight: "bold",
                        color: "#ccc",
                        zIndex: "-1",
                      }}
                    >
                      {language == "en" ? `Duplicate` : `Duplicate`}
                    </div>
                  )} */}
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
                      ? "(as per Rule 17 of Grant in Aid Code)"
                      : "( ग्रँट - इन - एड कोडाच्या १७ व्या नियमाप्रमाणे)"}
                  </Box>
                </Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></Grid>
            </Grid>
            <Divider />
            <div style={{ marginLeft: "5px" }}>
              <Grid container sx={{ padding: "6px" }} style={{ textAlign: "center" }}>
                <Grid item xs={4}>
                  {" "}
                  {language == "en" ? (
                    <Typography>School Name : {studentData?.schoolName}</Typography>
                  ) : (
                    <Typography>शाळेचे नाव : {studentData?.schoolNameMr}</Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>Student Register Number : {studentData?.grNumber}</Typography>
                  ) : (
                    <Typography>विद्यार्थी नोंदणी क्रमांक :{studentData?.grNumber}</Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  {language == "en" ? (
                    <Typography>UDICE Code: {studentData?.udiceCode}</Typography>
                  ) : (
                    <Typography>UDICE कोड: {studentData?.udiceCode}</Typography>
                  )}
                </Grid>
              </Grid>
              <Divider sx={{ borderBottomWidth: 5 }} />

              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>1. Student Full Name : {this?.props?.data?.studentName}</Typography>
                  ) : (
                    <Typography>1. विद्यार्थ्याचे पूर्ण नाव : {studentNameMr}</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>2. Student Mother Name : {studentData?.motherName}</Typography>
                  ) : (
                    <Typography>2. विद्यार्थ्याच्या आईचे नाव : {studentData?.motherName}</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      3. Religion and Caste : {`${studentData?.religion_Name} and ${studentData?.casteName}`}
                    </Typography>
                  ) : (
                    <Typography>
                      3. धर्म आणि जात : {`${studentData?.religionNameMr} आणि ${studentData?.casteNameMr}`}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      4. Citizen : {studentData?.citizenshipName}
                      {/* {studentData?.citizenshipName} */}
                    </Typography>
                  ) : (
                    <Typography>4. नागरिक : भारतीय</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      5. BirthPlace Dist and Tal :{" "}
                      {` ${studentData?.birthPlace} and ${studentData?.fatherContactNumber}`}
                    </Typography>
                  ) : (
                    <Typography>
                      5.जन्मस्थान जिल्हा आणि दूरध्वनी :
                      {`${studentData?.birthPlacemr} and ${studentData?.fatherContactNumber}`}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      6. Date of birth, month and year as per Christian Calender :{" "}
                      {moment(studentData?.dateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  ) : (
                    <Typography>
                      6. जन्मतारीख, महिना आणि ख्रिश्चन दिनदर्शिकेनुसार वर्ष :{" "}
                      {moment(studentData?.dateOfBirth, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      In alphanumeric : {moment(studentData?.dateOfBirth, "YYYY-MM-DD").format("MMDDYYYY")}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      अल्फान्यूमेरिकमध्ये :{" "}
                      {moment(studentData?.dateOfBirth, "YYYY-MM-DD").format("MMDDYYYY")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      7. School Name that the student attended before coming to this school :{" "}
                      {studentData?.lastSchoolName}
                    </Typography>
                  ) : (
                    <Typography>
                      7. या शाळेत येण्यापूर्वी विद्यार्थ्याने उपस्थित असलेल्या शाळेचे नाव :{" "}
                      {studentData?.lastSchoolNameMr}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      8. School Admission Date :{" "}
                      {moment(studentData?.addmissionDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  ) : (
                    <Typography>
                      8.शाळा प्रवेशाची तारीख :{" "}
                      {moment(studentData?.addmissionDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>9. Study Progress : {studentData?.behaviour}</Typography>
                  ) : (
                    <Typography>9. अभ्यासाची प्रगती : {studentData?.behaviourMr}</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>10. Student Behaviour at school : {studentData?.behaviour}</Typography>
                  ) : (
                    <Typography>10. शाळेतील विद्यार्थ्याचे वर्तन : {studentData?.behaviourMr}</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      11. School leaving date in month and year :{" "}
                      {moment(this?.props?.data?.schoolLeavingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  ) : (
                    <Typography>
                      11. महिना आणि वर्षातील शाळा सोडण्याची तारीख :{" "}
                      {moment(this?.props?.data?.schoolLeavingDate, "YYYY-MM-DD").format("DD-MM-YYYY")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      12. In which grade and since when was he studying :{" "}
                      {`${studentData?.className} and since ${studentData?.addmissionDate}`}
                    </Typography>
                  ) : (
                    <Typography>
                      12. तो कोणत्या इयत्तेत आणि कधीपासून शिकत होता :{" "}
                      {`${studentData?.className} and since ${studentData?.addmissionDate}`}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      13. Reason for leaving the school : {this?.props?.data?.leavingReason}
                    </Typography>
                  ) : (
                    <Typography>
                      13. शाळा सोडण्याचे कारण : {this?.props?.data?.reasonForLeavingSchoolMr}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>14. Grade : {studentData?.className}</Typography>
                  ) : (
                    <Typography>14. ग्रेड : {studentData?.className}</Typography>
                  )}
                </Grid>
              </Grid>
              <Divider />
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      It is certified that the above information is in the base of school register no.1
                    </Typography>
                  ) : (
                    <Typography>
                      हे प्रमाणित केले जाते की वरील माहिती शाळेच्या रजिस्टर क्र. १ च्या आधारावर आहे
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={4}>
                  <Typography>
                    {language == "en" ? "Date :" : "दिनांक : "} {todaysDate}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <Typography>
                    {language == "en" ? "Month :" : "महिना : "} {name}{" "}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <Typography>
                    {" "}
                    {language == "en" ? "Year :" : "वर्ष : "} {yy}{" "}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={6}>
                  {" "}
                  {language == "en" ? (
                    <Typography>Principal Sign : </Typography>
                  ) : (
                    <Typography>मुख्याध्यापकाची स्वाक्षरी : </Typography>
                  )}
                </Grid>
              </Grid>
              <Divider />
              <Grid container sx={{ padding: "6px" }}>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      Note : 1. Any correction to be made in the certificate issued at the time of leaving the
                      school should be signed briefly by the Principal in red ink .
                    </Typography>
                  ) : (
                    <Typography>
                      टीप: 1. शाळा सोडताना दिलेल्या प्रमाणपत्रात कोणतीही दुरुस्ती करायची असल्यास
                      मुख्याध्यापकांनी लाल शाईने स्वाक्षरी केली पाहिजे.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      Note :2. Unauthorized alteration of school leaving certificate is a serious offence .
                    </Typography>
                  ) : (
                    <Typography>
                      टीप: 2.शाळा सोडल्याच्या प्रमाणपत्रात अनधिकृत बदल करणे हा गंभीर गुन्हा आहे.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}
