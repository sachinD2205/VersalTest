import { Box, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { default as React } from "react";
// import styles from "../security/ComponentToPrint.module.css";
import styles from "../school/ITInSchoolComponentToPrint.module.css";
import urls from "../../URLS/urls";
// class component To Print
export default class ItiBonafideToPrint extends React.Component {
  render() {
    //for current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear());
    let todaysDate = `${dd}/${mm}/${yy}`;

    const filePath = this.props.data?.traineePhotograph;
    let data = this.props.data;
    // let studentData = this.props.studentData;
    const language = this.props.language;
    console.log("filePath", this.props.filePath, filePath);
    return (
      <>
        <div className={styles.main} style={{ border: "2px solid black" }}>
          <div
            className={styles.small}
            style={{ margin: "5px", height: "80vh" }}
          >
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={10}
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
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
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
                    <img
                      src={`${urls.SCHOOL}/file/preview?filePath=${filePath}`}
                      alt="Photograph"
                      height="100vh"
                      width="100vw"
                    />
                  </Box>
                </Typography>
              </Grid>
            </Grid>

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
                  {/* <Box
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
                  </Box> */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 27,
                      // fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {language == "en"
                      ? " Pimpri Chinchwad Municipal Corporation"
                      : "पिंपरी चिंचवड महानगरपालिका"}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {data?.itiName}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: "regular",
                      m: 1,
                    }}
                  >
                    {data?.itiAddress}
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
                      ? "(Affiliated to NCVT, DGET, NEW DELHI, Govt.of India and Recognized by Govt. of Maharashtra)"
                      : "(एनसीव्हीटी, डीजीईटी, नवी दिल्ली, भारत सरकारशी संलग्न आणि महाराष्ट्र सरकारद्वारे मान्यताप्राप्त)"}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      fontWeight: "bold",
                      fontFamily: "serif",
                      m: 1,
                    }}
                  >
                    {language == "en"
                      ? "BONAFIDE CERTIFICATE"
                      : "बोनाफाईड प्रमाणपत्र"}
                  </Box>
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ borderBottomWidth: 5 }} />

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: 20,
                    m: 1,
                  }}
                  textAlign="right"
                >
                  {language == "en" ? "Date :" : "दिनांक : "}
                  <b>{todaysDate}</b>
                </Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                {language == "en" ? (
                  <>
                    <Typography
                      sx={{
                        lineHeight: "1.5",
                        fontSize: 20,
                        m: 1,
                      }}
                    >
                      {" "}
                      <p>
                        This is to certify that
                        <b> {data?.traineeName} </b> is a student of this
                        institute for the period <b>{data?.academicYear} .</b>{" "}
                        <br />
                        He/She is studying in the <b> {data?.itiTradeName} </b>
                        trade. <br />
                        He/She bears a good moral character.{" "}
                      </p>
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: "1.5",
                        fontSize: 20,
                        m: 1,
                      }}
                    >
                      <p>
                        This is to inform you that i require a bonafide
                        certificate from the institute for the purpose of{" "}
                        <b> {data?.purposeOfBonafideEn}</b>
                      </p>
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      sx={{
                        lineHeight: "1.5",
                        fontSize: 20,
                        m: 1,
                      }}
                    >
                      प्रमाणित करण्यात येते की
                      <b> {data?.traineeName} </b> या संस्थेचा
                      विद्यार्थी/विद्यार्थीनी आहे. <br />
                      <b>{data?.academicYear} </b>
                      या कालावधीसाठी तो/ती<b> {data?.itiTradeName}</b> ट्रेडचा
                      अभ्यास करताना त्याचे/तिचे नैतिक पात्र चांगले आहे.
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: "1.5",
                        fontSize: 20,
                        m: 1,
                      }}
                    >
                      <p>
                        हे तुम्हाला कळवत आहे की मला{" "}
                        <b> {data?.purposeOfBonafideMr} </b>
                        च्या उद्देशासाठी संस्थेकडून बोनाफाईड प्रमाणपत्र आवश्यक
                        आहे.
                      </p>
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: "10%" }}>
              <Grid item xs={10}>
                <Typography
                  sx={{
                    fontSize: 20,
                    m: 1,
                  }}
                  textAlign="right"
                >
                  <u>
                    <b>
                      {language == "en"
                        ? "Principal Sign"
                        : "मुख्याध्यापकांची सही"}
                    </b>
                  </u>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}
