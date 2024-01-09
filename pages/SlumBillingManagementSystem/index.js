import React from "react";
import Head from "next/head";
import { Paper } from "@mui/material";

const Index = () => {
  return (
    <>
      <Head>
        <title>SBM - Dashboard</title>
      </Head>
      <Paper sx={{ height: "76vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>Slum Billing Management System Dashboard</h1>
      </Paper>
    </>
  );
};

export default Index;
