// Create a sample next js file to test the fingerprinting
import { Paper } from '@mui/material';
import React from 'react';
import axios from 'axios';

const index = () => {

  // state to store base64 string
  const [base64String, setBase64String] = React.useState("");
  const [info, setInfo] = React.useState("");


  // function get info  
  const getInfo = () => {
    // call http request using axios
    axios
      .get(`http://localhost:8004/mfs100/info`, {
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        console.log("r", r);
        setInfo(r.data.DeviceInfo.SystemID);
      });


  };

  // function capture finger
  const CaptureFinger = () => {
    // call http request using axios

    var MFS100Request = {
      "Quality": 0,
      "TimeOut": 100
    };
    var jsondata = JSON.stringify(MFS100Request);

    axios
      .post(`http://localhost:8004/mfs100/capture`, jsondata, {})
      .then((r) => {
        console.log("r", r);
        setBase64String("data:image/bmp;base64," + r.data.BitmapData);
      });
  };



  return (
    <Paper>
      <div>
        <h1>Get Info</h1>
        <button onClick={getInfo}>Test</button>
      </div>
      <div>
        <h1>Info</h1>
        <p>{info}</p>
      </div>

      <div>
        <h1>Capture Fingerprint</h1>
        <button onClick={CaptureFinger}>Test</button>
      </div>

      <div>
        <img src={base64String} alt="My Image" />
      </div>

    </Paper>

  );
};

export default index;
