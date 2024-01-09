import { Box, Button, Typography } from "@mui/material";
import React from "react";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import axios from "axios";
import urls from "../../../URLS/urls";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Fingerprint = (props) => {
  //   const [base64String, setBase64String] = React.useState("");
  const token = useSelector((state) => state.user.user.token);

  // function capture finger
  const CaptureFinger = () => {
    // call http request using axios

    var MFS100Request = {
      Quality: 0,
      TimeOut: 100,
    };
    var jsondata = JSON.stringify(MFS100Request);

    axios
      .post(`http://localhost:8004/mfs100/capture`, jsondata, {})
      .then((r) => {
        console.log("r", r);
        if (r.data.ErrorCode == "-1307") {
          console.log("err", r.data.ErrorDescription);
          toast(r.data.ErrorDescription, {
            type: "error",
          });
          return;
        }

        const url = "data:image/bmp;base64," + r.data.BitmapData;
        let _file;
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            _file = new File([blob], "fingerprint.png", { type: "image/png" });
            console.log("loglog", _file);
            let formData = new FormData();
            formData.append("file", _file);
            formData.append("appName", props.appName);
            formData.append("serviceName", props.serviceName);
            axios
              .post(`${urls.CFCURL}/file/upload`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((r) => {
                let f = r.data.filePath;
                console.log("fff34", f);
                props.setFingerPrintImg(f);
              });
          });

        props.setBase64String("data:image/bmp;base64," + r.data.BitmapData);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        clear: "both",
      }}
    >
      {/* <Typography sx={{ margin: "0px" }}>Face Reader</Typography> */}
      <Typography sx={{ margin: "0px" }}>
        <FormattedLabel id="thumbSignature" />
      </Typography>
      <Button
        onClick={CaptureFinger}
        variant="outlined"
        size="small"
        sx={{
          color: "green",
          "&:hover": {
            backgroundColor: "gray",
            color: "white",
          },
        }}
      >
        <FingerprintIcon />
      </Button>
      <div>
        {props.base64String && (
          <img
            style={{ width: "100px", height: "100px" }}
            src={props.base64String}
            alt="img"
          />
        )}
      </div>
    </Box>
  );
};

export default Fingerprint;
