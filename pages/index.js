import Head from "next/head";
import React from "react";
import { Paper } from "@mui/material";
export default function Home() {
  return (
    <div>
      <Head>
        <title>PCMC ERP</title>
        {/* <meta name="PCMC ERP" content="This the PCMC ERP Portal" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Paper
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "76vh",
        }}
      >
        <h1>HOME PAGE</h1>
        {/* <h3>(Someone do something re. Kora aahe kadhi pasun)</h3> */}
      </Paper>
    </div>
  );
}
