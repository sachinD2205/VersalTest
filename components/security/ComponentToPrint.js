import { Grid, Typography, Divider } from "@mui/material";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import styles from "./ComponentToPrint.module.css";
// class component To Print
export default class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "10px",border:'solid red' }}>
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
                <Typography variant="h4">पिंपरी चिंचवड महानगरपालिका</Typography>
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
                <img src="/smartCityPCMC.png" alt="" height="100vh" width="100vw" />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <h2 className={styles.heading}>
                  <b>प्रवेश पास</b>
                </h2>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {" "}
                <Typography>
                  वेळ आत :{" "}
                  {moment(this?.props?.data?.inTime, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss")}
                </Typography>
              </Grid>
              {/* <Grid item xs={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography>
                  दिनांक : {moment(this?.props?.data?.inTime, "YYYY-MM-DD").format("DD-MM-YYYY")}
                </Typography>
              </Grid> */}

              {this?.props?.data?.outTime !== null && (
                <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {" "}
                  <Typography>
                    वेळ बाहेर :{" "}
                    {moment(this?.props?.data?.outTime, "DD-MM-YYYY hh:mm:ss").format("DD-MM-YYYY hh:mm:ss")}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>1) अभ्यागत क्रमांक : {this?.props?.data?.visitorEntryNumber}</Typography>
              </Grid>
            </Grid>

            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>2) नागरिकाचे नाव श्री/श्रीमती : {this?.props?.data?.visitorName}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>3) कोणाला भेटायचे : {this?.props?.data?.toWhomWantToMeet}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>4) भेटण्याचे कारण : {this?.props?.data?.purpose}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>5) मोबाईल नंबर : {this?.props?.data?.mobileNumber}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>6) विभागाचे नाव : {this?.props?.data?.departmentName}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <Typography>मनपा अधिकारी/कर्मचारी यांची स्वाक्षरी : </Typography>
              </Grid>
            </Grid>

            <Divider />

            <Grid container sx={{ padding: "5px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2">पिंपरी चिंचवड महानगरपलिका,</Typography>
                <Typography variant="subtitle2">मुंबई-पुणे महामार्ग पिंपरी पुणे 411-018,</Typography>
                <Typography variant="subtitle2">महाराष्ट्र, भारत</Typography>
              </Grid>
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                <Typography>फोन क्रमांक:91-020-2742-5511/12/13/14</Typography>
                <Typography>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</Typography>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/qrcode1.png" alt="" height="70vh" width="70vw" />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "5px" }}>
              <Grid item xs={12}>
                <Typography>टीप : परत जाताना कृपया सुरक्षा विभागाकडे पास जमा करा </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}
