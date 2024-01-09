import Head from "next/head";
// import styles from '../styles/Home.module.css'
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";

const Demo = () => {
  return (
    <div>
      <div style={{ width: "100%" }}></div>
    </div>
  );
};

export default Demo;
