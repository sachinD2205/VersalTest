import { Box, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { default as React } from "react";
import styles from "../school/ITInSchoolComponentToPrint.module.css";
// class component To Print
export default class admissionConfirmationSlipToPrint extends React.Component {
  render() {
    const data = this.props.data;
    const language = this.props.language;
    console.log("Printtt", data);
    //for current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear());
    let todaysDate = `${dd}/${mm}/${yy}`;

    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "6px" }}>
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
                      // fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {language == "en" ? (
                      <b>
                        Pimpri Chinchwad Municipal Corporation, Pimpri- 411 018
                      </b>
                    ) : (
                      <b>पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८</b>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      // fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {language == "en" ? (
                      <b>Industrial Training Department</b>
                    ) : (
                      <b>औद्योगिक प्रशिक्षण विभाग</b>
                    )}
                  </Box>
                  {/* <Divider /> */}
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
                    ● {language == "en" ? `Admission Receipt` : `प्रवेश पावती`}●
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
                    {data?.recieptAcademicYear}
                  </Box>
                </Typography>
              </Grid>
            </Grid>

            <Divider />

            <div style={{ marginLeft: "5px" }}>
              {/*  <div className={styles.Innn}>
                <div className={styles.itiem}>Item 1</div>
                <div className={styles.itiem}>Item 2</div>
                <div className={styles.itiem}>Item 3</div>
              </div> */}

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        Reciept No : <br />
                      </span>{" "}
                      <span className={styles.span2}>{data?.receiptNo}</span>
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>
                        पावती क्र :<br />
                      </span>{" "}
                      <span className={styles.span2}>{data?.receiptNo}</span>
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        Registration Number :{" "}
                      </span>
                      {data?.admissionRegistrationNo}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>नोंदणी क्रमांक : </span>
                      {data?.admissionRegistrationNo}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>Date :</span> {todaysDate}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>दिनांक :</span>{" "}
                      {todaysDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item xs={3}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>First Name :</span>{" "}
                      {data?.traineeFirstName}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>पहिले नाव :</span>{" "}
                      {data?.traineeFirstName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>Middle Name :</span>{" "}
                      {data?.traineeMiddleName}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>मधले नाव :</span>{" "}
                      {data?.traineeMiddleName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>Last Name :</span>{" "}
                      {data?.traineeLastName}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>आडनाव :</span>{" "}
                      {data?.traineeLastName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}> Mother Name :</span>{" "}
                      {data?.motherFirstName}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>आईचे नाव :</span>{" "}
                      {data?.motherFirstName}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={4}>
                  {language == "en" ? (
                    <Typography item style={{ display: "flex" }} xs={2}>
                      <span className={styles.span1}>gender :</span>{" "}
                      {data?.gender}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>लिंग :</span>{" "}
                      {data?.gender}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>Mobile No :</span>{" "}
                      {data?.traineeMobileNumber}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>मोबाईल क्र :</span>{" "}
                      {data?.traineeMobileNumber}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}> Email :</span>{" "}
                      {data?.traineeEmailId}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}> ईमेल :</span>{" "}
                      {data?.traineeEmailId}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={4}>
                  {language == "en" ? (
                    <Typography item style={{ display: "flex" }} xs={2}>
                      <span className={styles.span1}>Date of Birth :</span>{" "}
                      {moment(data?.traineeDateOfBirth, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>जन्मतारीख :</span>{" "}
                      {moment(data?.traineeDateOfBirth, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        Allotment Round :
                      </span>{" "}
                      {data?.allotmentRound}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>प्रवेश फेरी :</span>{" "}
                      {data?.allotmentRound}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>ITI Code :</span>{" "}
                      {data?.itiCodeAllocated}
                    </Typography>
                  ) : (
                    <Typography>
                      <span className={styles.span1}>आयटीआय कोड :</span>{" "}
                      {data?.itiCodeAllocated}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item xs={12}>
                  {language == "en" ? (
                    <Typography>
                      <span className={styles.span1}>
                        Name of ITI Admitted :
                      </span>
                      {data?.itiNameAllocated}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        {" "}
                        आयटीआय प्रवेशाचे नाव:{" "}
                      </span>
                      {data?.itiNameAllocated}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={4}>
                  {language == "en" ? (
                    <Typography item style={{ display: "flex" }} xs={2}>
                      {" "}
                      <span className={styles.span1}>Name of Trade :</span>
                      {data?.itiTradeName}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>ट्रेडचे नाव : </span>{" "}
                      {data?.itiTradeName}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        Admission Confirm Date:
                      </span>
                      {moment(data?.admissionConfirmDate, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>
                        प्रवेश निश्चिती तारीख :
                      </span>
                      {moment(data?.admissionConfirmDate, "YYYY-MM-DD").format(
                        "DD-MM-YYYY"
                      )}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={4}>
                  {language == "en" ? (
                    <Typography>
                      <span className={styles.span1}>Total Admission Fees</span>{" "}
                      <span>&#x20B9; :</span>
                      <br />
                      {data?.totalAdmissionFeeRs}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>एकूण प्रवेश फी</span>{" "}
                      <span>&#x20B9; :</span>
                      <br />
                      {data?.totalAdmissionFeeRs}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4} sx={{ paddingRight: "18px" }}>
                  {language == "en" ? (
                    <Typography>
                      <span className={styles.span1}>Recieved Fees</span>{" "}
                      <span>&#x20B9; :</span>
                      <br />
                      {data?.admissionFeeAmountToPay}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>प्राप्त रक्कम</span>{" "}
                      <span>&#x20B9; :</span>
                      <br />
                      {data?.admissionFeeAmountToPay}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4} sx={{ paddingRight: "18px" }}>
                  {language == "en" ? (
                    <Typography>
                      <span className={styles.span1}>
                        Remaining Admission Fees
                      </span>{" "}
                      <span>&#x20B9;:</span>
                      <br />
                      {data?.remainingFeesAmount}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>बाकी प्रवेश फी</span>{" "}
                      <span>&#x20B9; :</span>
                      <br />
                      {data?.remainingFeesAmount}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={4}>
                  {language == "en" ? (
                    <Typography item style={{ display: "flex" }} xs={2}>
                      {" "}
                      <span className={styles.span1}>Admission Incharge: </span>
                      {data?.principalName}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>प्रवेश प्रभारी:</span>{" "}
                      {data?.principalName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {language == "en" ? (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>Principal :</span> Mr.
                      {data?.principalName}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>प्राचार्य : </span>{" "}
                      {data?.principalName}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Grid
                container
                sx={{ padding: "6px", marginTop: "20px", marginBottom: "20px" }}
                style={{ textAlign: "start" }}
              >
                <Grid item flexDirection="row" xs={12}>
                  {language == "en" ? (
                    <Typography item style={{ display: "flex" }} xs={2}>
                      <span className={styles.span1}>Remark :</span>{" "}
                      {data?.accountantRemarks}
                    </Typography>
                  ) : (
                    <Typography>
                      {" "}
                      <span className={styles.span1}>टिप्पणी :</span>{" "}
                      {data?.accountantRemarks}
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
