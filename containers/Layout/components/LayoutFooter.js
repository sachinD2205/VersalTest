import { Typography, Grid, Box, Link } from "@mui/material";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const LayoutFooter = () => {
  let language = useSelector((state) => state.labels.language);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    // <div className="layout-footer">
    <div
      style={{
        width: "100%",
        color: "white",
        zIndex: 1,
        // padding: "20px",
        position: "fixed",
        bottom: 0,
        // marginTop: 'auto',
        // marginTop: "200px",
      }}
    >
      {/* <b>PCMC ©2022 Powered by Atos Nascent</b> */}
      <Grid
        container
        style={{
          background:
            "linear-Gradient(90deg,rgba(7,67,230,1) 2%,rgba(47,216,250,1) 100% )",
        }}
      >
        {/* <Grid
          item
          xs={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src="/logo.png" alt="Picturer" width={30} height={30} />
        </Grid>
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
          xs={1}
        >
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "PIMPRI" : "पिंपरी"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "CHINCHWAD" : "पिंपरी"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "MUNICIPAL" : "महानगर"}
          </Typography>
          <Typography style={{ fontSize: "6px" }} component="div">
            {language === "en" ? "CORPORATION" : "पालिका"}
          </Typography>
        </Grid> */}

        {/* <Typography style={{ fontSize: "10px" }} component="div">
            पिंपरी-चिंचवड
          </Typography>
          <Typography style={{ fontSize: "10px" }} component="div">
            महानगरपालिका
          </Typography> */}
        <Grid
          item
          // xs={isSmallScreen ? 6 : 5}
          xs={5}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/smartCityPCMC.png"
            alt="Picturer"
            width={50}
            height={30}
            style={{ paddingLeft: "2px" }}
          />
          <Box ml={2}>
            <Typography
              variant="body2"
              sx={{
                fontSize: isSmallScreen ? "8px" : "12px",
              }}
            >
              {language === "en"
                ? "Pimpri Chinchwad Smart City Initiative"
                : "पिंपरी चिंचवड स्मार्ट सिटी उपक्रम"}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={2}
          style={{
            // display: isSmallScreen ? "none" : "flex",
            display: "flex",

            justifyContent: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Link
              sx={{ color: "white", fontSize: isSmallScreen ? "8px" : "12px" }}
              href="https://www.pcmcindia.gov.in/contact.php"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help And Support
            </Link>
            {/* <Typography style={{ fontSize: "12px" }}>
              Help and Support
            </Typography> */}
          </Box>
        </Grid>

        <Grid
          item
          // xs={isSmallScreen ? 6 : 4}
          xs={5}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "10px",
          }}
        >
          {language === "en" ? (
            <>
              <Typography
                style={{
                  fontSize: isSmallScreen ? "8px" : "12px",
                }}
              >
                © 2024, Developed Under GIS Enabled ERP Project
              </Typography>
            </>
          ) : (
            <>
              <Typography
                style={{
                  fontSize: isSmallScreen ? "8px" : "12px",
                }}
              >
                © २०२४, जी.आय.एस. सक्षम ई.आर.पी प्रकल्पाअंतर्गत विकसित
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default LayoutFooter;
