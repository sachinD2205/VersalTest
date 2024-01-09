import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import urls from "../URLS/urls";
import axios from "axios";

const adminLogin = () => {
  const [data, setData] = useState(null); // Initialize data as null
  useEffect(() => {
    // const handleSubmit = async (event) => {
    console.log("data", data);
    // event.preventDefault();

    if (!data) {
      console.error("Data is not available.");
      return;
    }

    try {
      const response = axios.post(
        // "https://noncoreuat.pcmcindia.gov.in/emIDAM/self-service-login.htm/pcmc",
        data.targetUrl,
        {
          SAMLRequest: data.encodedSamldata,
          clientID: data.clientID,
        }
      );

      console.log("POST request successful:", response);
      const form = document.getElementById("spForm");
      form.action = data.targetUrl;
      form.submit();
    } catch (error) {
      console.error("POST API call error:", error);
    }
    // };
  }, [data]);

  // Function to make a GET request on page load
  useEffect(() => {
    axios
      // .get("http://localhost:9003/gm/api/auditRemarkMaster/showLoginForm")
      // .get("http://192.168.1.112:8090/cfc/open/emas/showLoginForm")
      // .get(`${urls.CFCURL}/emas/showLoginForm`)
      .get(`${urls.SSOCFCURL}/emas/showLoginForm`)
      .then((response) => {
        const urlData = response.data;
        console.log("urlData", urlData);
        setData(urlData); // Set the data when it's fetched
      })
      .catch((error) => {
        console.error("GET API call error:", error);
      });
  }, []);
  return (
    <div>
      <form action="" method="post" id="spForm">
        <input type="hidden" name="SAMLRequest" value={data?.encodedSamldata} />
        <input type="hidden" name="clientID" value={data?.clientID} />
        {/* <button type="submit">Submit</button> */}
      </form>
    </div>
  );
};

export default adminLogin;
