import React, { useEffect, useState } from "react";
import axios from "axios";
// import FormattedLabel from "./FormattedLabel";
import URLs from "../../../URLS/urls";
import sweetAlert from "sweetalert";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";
import { DecryptData,EncryptData } from "../../../components/common/EncryptDecrypt";

const UploadButton = ({
  appName,
  serviceName,
  label,
  filePath,
  fileUpdater,
  view = false,
  error,
  helperText,
  value,
  uploadDoc,
  objId,
  setUploadDoc,
  // registerFunction, // Register function from the parent component
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);

  const loggedUser = localStorage.getItem("loggedInUser");

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const newTab = window.open();
          newTab.location.href = url;
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
        } else {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
            <html>
              <body style="margin: 0;">
                <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
              </body>
            </html>
          `);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };


  const discard = async () => {
    swal({
      title: language === "en" ? "Delete?" : "हटवायचे?",
      text:
        language === "en"
          ? "Are you sure you want to delete this file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${URLs.CFCURL}/file/discardEncrypted?filePath=${filePath}`, {
            headers: headers,
          })
          .then((res) => {
            if (res.status === 200) {
              setUploadDoc(
                uploadDoc.map((o) => {
                  if (objId === o.id && filePath === o.documentPath) {
                    o.documentPath = "";
                  }
                  return o;
                })
              );
            }
          })
          .catch((err) => {
            cfcErrorCatchMethod(err, true);
          });
      }
    });
  };

  const handleFile = (event) => {
      // Apply the register function to the hidden file input field
      const file = event.target.files[0];;
      const MAX_FILE_SIZE = 2048;

      const allowedFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
  
      //! extension only
      const fileExtension =
        file?.name?.split(".")[file?.name?.split(".").length - 1];
      //! without extension
      const fileNameWithoutExtension = file?.name?.split("." + fileExtension)[0];
      //! regex --- letter/numbers/hypens/underscore
      const fileNameRegex = /^[a-zA-Z0-9_\s\u0900-\u097F]+$/;
      // const fileNameRegex = /^[a-zA-Z0-9_-]+$/;
      if (fileNameRegex.test(fileNameWithoutExtension)) {
        if (file && allowedFileTypes.includes(file.type)) {
          const fileSizeKiloBytes = file.size / 1024;
          if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी!",
              language == "en"
                ? "File size exceeds maximum limit 2 MB"
                : "फाइल खूप मोठी आहे, कमाल फाइल आकार 2MB आहे",
              "error"
            );
          } else {
      // let formData = new FormData();
      // formData.append("file", file);
      let formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("appName", "BSUP");
      formData.append("serviceName", "BSUP-BachatgatRegistration");
      axios
        // .post(
        //   `${URLs.CFCURL}/file/upload?appName=${appName}&serviceName=${serviceName}`,
        .post(`${URLs.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData,
          { headers: headers }
        )
        .then((r) => {
          if (r.status === 200) {
            setUploadDoc(
              uploadDoc.map((obj) => {
                if (obj.id === objId) {
                  obj.documentPath = r?.data?.filePath;
                }
                return obj;
              })
            );
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, true);
        });
    }
  } else {
    sweetAlert(
      language == "en" ? "Error!" : "त्रुटी!",
      language == "en"
        ? "File format not accepted!"
        : "फाइल स्वरूप स्वीकारले नाही!",
      "error"
    );
  }
} else {
  sweetAlert({
    text:
      language == "en"
        ? "The file name can only contain letters, numbers, hyphens, and underscores. Special characters are not allowed"
        : "फाइलचे नाव किव्हा अक्षर, अंक, हायफन आणि अंडरस्कोरच्या प्रकारे असावे. विशेष वर्णांकीत नको",
    icon: "error",
    buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
  });
}
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 9,
            width: "max-content",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "medium", fontWeight: "bold" }}>
            {label} :
          </span>
       
          {!filePath && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Add
                sx={{
                  width: 30,
                  height: 30,
                  border: "1.5px dashed #1976d2",
                  color: "#1976d2",
                  marginRight: 1.5,
                }}
              />

              <input
                id="uploadButton"
                type="file"
                onChange={(e) => {
                      handleFile(e);
                  
                }}
                // required
                hidden
              />
              <span
                style={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 12,
                  color: "#1976d2",
                }}
              >
                {/* {<FormattedLabel id="addFile" />} */}
                {language === "en" ? "Upload File" : "अपलोड फाइल"}
              </span>
            </div>
          )}
       
           { filePath && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={async () => {
                    getFilePreview(filePath);
                  }}
                >
                  {language === "en" ? "Preview" : "पूर्वावलोकन"}
                </Button>
                {!view && (
                  <IconButton
                    color="error"
                    onClick={() => discard()}
                    
                  >
                    <Delete color="error" />
                  </IconButton>
                )}
              </div>
            )
          }
        </label>
        {error && value.find((item) => item.documentPath === "") && (
          <span style={{ color: "red", fontSize: 12 }}>{helperText}</span>
        )}
      </div>
    </>
  );
};

export default UploadButton;
