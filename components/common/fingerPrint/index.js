import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import urls from "../../../URLS/urls";
import { DecryptData, EncryptData } from "../../common/EncryptDecrypt";

const Fingerprint = (props) => {
  //   const [base64String, setBase64String] = React.useState("");
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels?.language);

  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
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
        console.log("r324324324", r);
        if (r?.data?.ErrorCode == "-1307") {
          console.log("err", r?.data?.ErrorDescription);
          toast(r?.data?.ErrorDescription, {
            type: "error",
          });
          return;
        }

        const base64String = r?.data?.BitmapData;
        const contentType = "image/png"; // Set the appropriate content type
        const blob = base64toBlob(base64String, contentType);
        const _file = new File([blob], "fingerprint.png", {
          type: "image/png",
        });

        console.log("loglog", _file);
        let formData = new FormData();
        formData.append("file", _file);
        formData.append("appName", props?.appName);
        formData.append("serviceName", props?.serviceName);
        axios
          .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((r) => {
            if (r?.status == "200" || r?.status == "201") {
              console.log("departmentUpload+++", f);
              let f = r?.data?.filePath;
              if (f) {
                const plaintext = f;
                props?.setFingerPrintImg(plaintext);
                setFilePathEncrypted(r?.data?.filePath);

                console.log("plainText", plaintext);
                setFilePath(plaintext);
                // setFilePath(plaintext);
                console.log("fingerprint----", plaintext);
                toast.success(
                  language == "en"
                    ? "Document Uploaded Successfully !!!"
                    : "दस्तऐवज यशस्वीरित्या अपलोड केले",
                  {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  },
                );
              } else if (r?.status == "500") {
                console.log("r?.data", r?.data);
                console.log("r?.status", r?.status);
                setValue("loadderState", false);
                toast.error("Please Upload Valid Document !!!", {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                });
              }
            }
          });

        props?.setBase64String("data:image/bmp;base64," + r?.data?.BitmapData);

        // const url = "data:image/bmp;base64," + r?.data?.BitmapData;
        // console.log(r.data.BitmapData, "45545", "url----------------", url);
        // let _file;
        // if (r?.data?.BitmapData) {
        //   fetch(url)
        //     .then((res) => res.blob())
        //     .then((blob) => {
        //       _file = new File([blob], "fingerprint.png", {
        //         type: "image/png",
        //       });
        //       console.log("loglog", _file);
        //       let formData = new FormData();
        //       formData.append("file", _file);
        //       formData.append("appName", props.appName);
        //       formData.append("serviceName", props.serviceName);
        //       axios
        //         .post(`${urls.CFCURL}/file/upload`, formData, {
        //           headers: {
        //             Authorization: `Bearer ${token}`,
        //           },
        //         })
        //         .then((r) => {
        //           let f = r.data.filePath;
        //           console.log("fff34", f);
        //           props.setFingerPrintImg(f);
        //         });
        //     });
        // }
        // props.setBase64String("data:image/bmp;base64," + r.data.BitmapData);
      });
  };

  const base64toBlob = (base64String, contentType) => {
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  // ============> dsf
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        clear: "both",
      }}
    >
      <Typography sx={{ margin: "0px" }}>Thumb Signature</Typography>
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
