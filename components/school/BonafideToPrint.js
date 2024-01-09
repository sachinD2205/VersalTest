import { Box, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { default as React } from "react";
import styles from "../security/ComponentToPrint.module.css";
import urls from "../../URLS/urls";
// class component To Print
export default class BonafideToPrint extends React.Component {
  render() {
    //for current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear());
    let todaysDate = `${dd}/${mm}/${yy}`;

    // console.log(this.props.data.remark, "props");
    // console.log("studentDataForPrint", this.props.studentData.photograph);
    let studentData = this.props.studentData;
    const language = this.props.language;
    const principalRemark = this.props.data.principalRemarksEn;
    const principalRemarkMr = this.props.data.principalRemarksMr;
    const photo = this.props.studentData.photograph;
    let studentNameMr = `${studentData.firstNameMr} ${studentData.middleNameMr} ${studentData.lastNameMr}`;
    // console.log(todaysDate, "todaysDate");
    // console.log(photo, "language");
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div className={styles.small} style={{ margin: "5px" }}>
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
                      fontSize: 25,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {language == "en"
                      ? " Bonafide Certificate "
                      : "बोनाफाईड प्रमाणपत्र"}
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
              >
                {console.log("ssss", photo)}
                <img
                  src={`${urls.SCHOOL}/file/preview?filePath=${photo}`}
                  alt="Photo"
                  height="100vh"
                  width="100vw"
                />
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 5 }} />

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={4}>
                <Typography>
                  {language == "en" ? "Date :" : "दिनांक : "}
                  <b>{todaysDate}</b>
                </Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    This is to certify that{" "}
                    <b> {this?.props?.data?.studentName} </b> is a student of{" "}
                    <b>{this?.props?.data?.schoolName} </b>currently studying in
                    class <b>{this?.props?.data?.className}</b> and division{" "}
                    <b>{this?.props?.data?.divisionName}</b> .
                  </Typography>
                ) : (
                  <Typography>
                    हे प्रमाणित करण्यासाठी आहे की <b> {studentNameMr}</b> हा{" "}
                    <b> {studentData?.schoolNameMr}</b> चा विद्यार्थी आहे जो
                    सध्या वर्ग <b> {this?.props?.data?.className} </b>आणि{" "}
                    <b>{this?.props?.data?.divisionName}</b> विभागात शिकत आहे, .
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    According to school record, he/she belongs to{" "}
                    <b>{studentData?.casteName}</b> Category, His/Her birth date
                    is{" "}
                    <b>
                      {moment(
                        this?.props?.data?.studentDateOfBirth,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                    </b>
                  </Typography>
                ) : (
                  <Typography>
                    शाळेच्या नोंदीनुसार तो/ती <b>{studentData?.casteNameMr}</b>{" "}
                    या श्रेणीतील आहे ,तसेच त्याचि/तिची जन्मतारीख{" "}
                    <b>
                      {moment(
                        this?.props?.data?.studentDateOfBirth,
                        "YYYY-MM-DD"
                      ).format("DD-MM-YYYY")}
                    </b>
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    and place of birth is <b>{studentData?.birthPlace}</b> .
                    His/Her residential permanent address is{" "}
                    <b>{studentData?.familyPermanentAddress}</b>
                  </Typography>
                ) : (
                  <Typography>
                    आणि जन्म ठिकाण <b>{studentData?.birthPlacemr}</b> आहे.
                    त्याचा/तिचा रहिवासी कायमचा पत्ता{" "}
                    <b>{studentData?.familyPermanentAddress}</b> आहे.
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    This is to inform you that i require a bonafide certificate
                    from the school for the purpose of{" "}
                    <b>{this?.props?.data?.bonafiedPurpose}</b>
                  </Typography>
                ) : (
                  <Typography>
                    हे तुम्हाला कळवायचे आहे की मला{" "}
                    <b>{this.props.data?.bonafiedPurposeMr}</b> या उद्देशासाठी
                    शाळेकडून बोनाफाईड प्रमाणपत्र आवश्यक आहे
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{ padding: "6px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    It is certified that the above information is in the base of
                    school register no.1
                  </Typography>
                ) : (
                  <Typography>
                    हे प्रमाणित केले जाते की वरील माहिती शाळेच्या नोंदणी क्रमांक
                    1 च्या आधारावर आहे
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>{`Remark : ${principalRemark}`}</Typography>
                ) : (
                  <Typography>{`शेरा : ${principalRemarkMr}`}</Typography>
                )}
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
            <Grid container sx={{ padding: "6px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <Typography>
                    Note: 1. Unauthorized alteration of Bonafide Certificate is
                    a serious offence.
                  </Typography>
                ) : (
                  <Typography>
                    टीप: 1. बोनाफाईड प्रमाणपत्रामध्ये अनधिकृत बदल करणे हा गंभीर
                    गुन्हा आहे.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}
