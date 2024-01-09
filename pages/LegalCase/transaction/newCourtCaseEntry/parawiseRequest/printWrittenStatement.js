import { Grid, Box, Typography, Divider } from "@mui/material";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import styles from "../../../../../components/security/ComponentToPrint.module.css";
// class component To Print
export default class printWrittenStatement extends React.Component {
  render() {
    //for current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear());
    let todaysDate = `${dd}/${mm}/${yy}`;

    // console.log(this.props.data, "props");
    // console.log(todaysDate, "todaysDate");
    console.log(this.props.data, "props");
    console.log("advocateName", this?.props?.data?.advocateName2);
    // lawyerRemarkMr
    console.log("lawyerRemarkEn", this?.props?.data?.lawyerRemarkEn);

    // let _advRemarks = this?.props?.data?.advocateRemark
    //   ? JSON.parse(this?.props?.data?.advocateRemark)
    //   : [];
    // console.log("_advRemarks", _advRemarks);
    return (
      <>
        <div className={styles.main}>
          <div
            className={styles.small1}
            style={{ display: "flex", width: "100vw", flexDirection: "column" }}
          >
            <Grid container sx={{ padding: "1px", marginBottom: "5px" }}>
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
                xs={8}
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
                      fontSize: 16,
                      fontWeight: "regular",
                      m: 1,
                    }}
                  >
                    पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyConent: "center",
                      fontSize: 22,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    Case Entry : Written Statement by Advocate
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
            <Grid
              item
              style={{
                marginTop: "10px",
                paddingLeft: "40Px",
                paddingRight: "40Px",
                height: "100%",
                // marginLeft: "25px",
              }}
            >
              {this?.props?.data?._advRemarks?.map((r, i) => {
                return (
                  <>
                    {/*dpt Name */}
                    <Grid container key={i}>
                      <Grid
                        item
                        style={{
                          fontSize: "20px",
                          alignContent: "left",
                          // float:'left'
                        }}
                        xs={12}
                      >
                        <label
                          style={{
                            fontSize: "17px",
                          }}
                        >
                          Department Name:
                          {r?.departmentName}
                        </label>
                      </Grid>
                    </Grid>
                    {/* content in english */}
                    <Grid container>
                      <Grid
                        item
                        style={{
                          fontSize: "20px",
                          alignContent: "left",
                          // float:'left'
                        }}
                        xs={12}
                      >
                        <label
                          style={{
                            fontSize: "17px",
                          }}
                        >
                          Writtern Statement in English :
                          {r?.writtenStatementInEnglish}
                        </label>
                      </Grid>
                    </Grid>

                    {/* content in Marathi */}
                    <Grid container>
                      <Grid item xs={12}>
                        <label
                          style={{
                            fontSize: "17px",
                          }}
                        >
                          Writtern Statement in Marathi:
                          {r?.writtenStatementInMarathi}
                        </label>
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                );
              })}

              {/* Footer */}
              <Grid
                container
                style={{
                  marginTop: "100px",
                  alignContent: "end",
                  alignItems: "end",
                  paddingLeft: "500px",
                }}
              >
                <Grid
                  item
                  xs={12}
                  style={{ alignContent: "end", width: "50px" }}
                >
                  <label
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    Advocate Name:
                  </label>
                </Grid>

                <Grid
                  item
                  xs={10.3}
                  style={{ alignContent: "end", width: "50px" }}
                >
                  <label
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {this?.props?.data?.advocateName2}
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}
