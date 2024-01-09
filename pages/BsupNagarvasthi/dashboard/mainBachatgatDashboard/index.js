import {
  Box,
  Paper,
  Tab,Grid,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import BachatgatDashboard from "../bachatgatDashboard";
import styles from "../dashboard.module.css";
// import NewSchemeApplicationDashboard from "../NewSchemeApplicationDashboard";
import NewSchemeApplicationDashboard from "../newSchemeApplicationDashboard";

const Index = () => {
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);

  const user1 = useSelector((state) => {
    let userNamed =
      state?.user?.user?.userDao && language === "en"
        ? state?.user?.user?.userDao.firstNameEn
        : state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameMr;
    return userNamed;
  });

  const [selectedDashboard, setSelectedDashboard] = useState("bachatgat");
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDashboardClick = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const renderDashboard = () => {
    if (selectedDashboard === "bachatgat") {
      return <BachatgatDashboard />;
    } else if (selectedDashboard === "newSchemeApplication") {
      return <NewSchemeApplicationDashboard />;
    } else {
      return null;
    }
  };

  const handleChangeTab = (event, newValue) => {
    setSelectedDashboard(newValue);
  };

  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        {/* <Box>
          <Box
            sx={{
              display: "flex",
              padding: "30px",
              flexDirection: "column",
            }}
          >
            <Typography>
              <p className={styles.fancy_link}>
                <>
                  <FormattedLabel id='welcomeToTheDashboard' />{" "}
                  <strong>{user1}</strong>{" "}
                </>
              </p>
            </Typography>
          </Box>
        </Box> */}
        <Grid item xs={12}>
          <h2 style={{ textAlign: "center", color: "#ff0000" }}>
            <b>
              {language == "en"
                ? "Samaj Vikas Department Dashboard"
                : "समाज विकास विभाग डॅशबोर्ड"}
            </b>
          </h2>
        </Grid>
        <Box>
          {isSmScreen ? (
            <Tabs
              value={selectedDashboard}
              onChange={handleChangeTab}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                value="bachatgat"
                label="Bachatgat Dashboard"
                onClick={() => handleDashboardClick("bachatgat")}
              />
              <Tab
                value="newSchemeApplication"
                label="New Scheme Application Dashboard"
                onClick={() => handleDashboardClick("newSchemeApplication")}
              />
            </Tabs>
          ) : (
            <Tabs
              value={selectedDashboard}
              onChange={handleChangeTab}
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                value="bachatgat"
                label="Bachatgat Dashboard"
                onClick={() => handleDashboardClick("bachatgat")}
              />
              <Tab
                value="newSchemeApplication"
                label="New Scheme Application Dashboard"
                onClick={() => handleDashboardClick("newSchemeApplication")}
              />
            </Tabs>
          )}
        </Box>
        {renderDashboard()}
      </Paper>
    </>
  );
};

export default Index;
