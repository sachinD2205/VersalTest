import React from "react";
import Head from "next/head";
import router from "next/router";

import FormattedLabel from "../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { Button, Paper } from "@mui/material";
import { BugReport } from "@mui/icons-material";

const Index = () => {
  const isDeptUser = useSelector(
    // @ts-ignore
    (state) => state?.user?.user?.userDao?.deptUser
  );
  return (
    <>
      <Head>
        <title>500 | Internal Server Error</title>
      </Head>
      <Paper
        style={{
          minHeight: "76vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 25,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 20,
          }}
        >
          <div style={{ display: "flex", columnGap: 20 }}>
            <BugReport
              sx={{
                width: 150,
                height: 150,
                color: "rgb(50, 108, 180)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "65px",
                  color: "rgb(50, 108, 180)",
                }}
              >
                500
              </label>
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  color: "rgb(50, 108, 180)",
                }}
              >
                Internal Server Error
              </label>
            </div>
          </div>
          <Button
            sx={{ fontWeight: "bold" }}
            variant="contained"
            onClick={() => {
              isDeptUser
                ? // ? router.push(`/DepartmentDashboard/dashboardV1`)
                  // : router.push(`/dashboardV3`);
                  router.push(`/DepartmentDashboard`)
                : router.push(`/dashboard`);
            }}
          >
            Go to Dashboard
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
