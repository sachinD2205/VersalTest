import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../URLS/urls";
import swal from "sweetalert";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
import { useGetToken } from "../../containers/reuseableComponents/CustomHooks";
import { saveAs } from "file-saver";
import Loader from "../../containers/Layout/components/Loader";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  const language = useSelector((state) => state.labels.language);

  const [loading, setLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);

  const userToken = useGetToken();
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {}, [props]);
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
      const plaintext = DecryptData(
        "passphraseaaaaaaaaupload",
        props?.fileName
      );
      setFilePathEncrypted(plaintext);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);
    // axios
    //   .post(`${urls.CFCURL}/file/upload`, formData, {
    //     headers: {
    //       Authorization: `Bearer ${userToken}`,
    //     },
    //   })
    axios
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );

        setFilePath(r.data.filePath);
        props?.filePath(r.data.filePath);
        setFilePathEncrypted(plaintext);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language === "en" ? "Error!" : "त्रुटी!",
          language === "en"
            ? "Enter valid File Format !"
            : "वैध फाइल स्वरूप प्रविष्ट करा!",
          "error",
          { button: language === "en" ? "Ok" : "ठीक आहे" }
        );
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  //view----------------------------------------------------------------
  const viewFile = (filePath) => {
    setLoading(true);
    console.log("filePath123", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLoading(false);
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
        // const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
        // const newTab = window.open();
        // newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        setLoading(false);
        callCatchMethod(error, language);
      });
  };
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };
  // ------------------------------------------------------------------------

  const discard = async (e, filePath) => {
    swal({
      title: language == "en" ? "Delete?" : "हटवा?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
        // axios
        //   .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
        //     headers: {
        //       Authorization: `Bearer ${userToken}`,
        //     },
        //   })
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                setDeletedFile(filePath),
                setFilePathEncrypted(null),
                props?.filePath(null);
              swal(
                language == "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal(
                language == "en"
                  ? "Something went wrong..!!!"
                  : "काहीतरी चूक झाली..!!!"
              );
            }
          });
      } else {
        swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे");
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={style.align}>
          <label className={style.uploadButton}>
            {!filePath && (
              <>
                <Add
                  color="secondary"
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1.4px dashed #9c27b0",
                    marginRight: 1.5,
                  }}
                />
                <input
                  type="file"
                  onChange={(e) => {
                    handleFile(e);
                  }}
                  hidden
                />
              </>
            )}
            {filePath ? (
              <a
                // href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                // target="__blank"
                onClick={() => {
                  viewFile(filePath);
                }}
              >
                {/* {showFileName(filePath)} */}
                {showFileName(filePathEncrypted)}
                {/* <Button><FormattedLabel id="view"/></Button> */}
              </a>
            ) : (
              <span className={style.fileName}>
                <FormattedLabel id="attachFile" />
              </span>
            )}
          </label>
          {filePath && !props.disabled ? (
            <IconButton
              onClick={(e) => {
                discard(
                  e,
                  filePath
                ); /* setFilePath(null),props.filePath(null),discardFile() */
              }}
            >
              <Delete color="error" />
            </IconButton>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};
export default UploadButton;
