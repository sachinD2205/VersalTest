import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { IconButton } from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../URLS/urls";
import swal from "sweetalert";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);

  useEffect(() => { }, [props]);
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);
    console.log("formData", formData);
    axios
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("res", r);

        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );

        console.log("Decrypted:", plaintext);
        setFilePath(plaintext);
        setFilePathEncrypted(r?.data?.filePath);
        props?.filePath(plaintext);
        props?.fileNameEncrypted(r?.data?.filePath);
        // setFilePath(r.data.filePath);
        // props?.filePath(r.data.filePath);
      })
      .catch((err) => {
        console.log("err", err);
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
  const getFilePreview = (filePath) => {

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("rrr", r);
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
      .catch((error) => {
        console.log("CatchPreviewApi", error);
      });
  };
  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  const discard = async (e, filePath) => {
    console.log("discard filePath", filePath);

    swal({
      title: language == "en" ? "Delete?" : "हटवा?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);

        console.log("ciphertext", ciphertext);
        axios
          // .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          .then((res) => {
            console.log("res", res);
            if (res.status == 200) {
              if (res?.data?.status == "SUCCESS") {
                setFilePath(null),
                  setDeletedFile(filePath),
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
                    ? "Something went wrong!"
                    : "काहीतरी चूक झाली",
                  { icon: "error" }
                );
              }
            } else {
              swal(
                language == "en"
                  ? "Something went wrong..!!!"
                  : "काहीतरी चूक झाली..!!!"
              );
            }
          })
          .catch((err) => console.log("err", err));
      } else {
        swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे");
      }
    });
  };

  return (
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
          // <a
          //   href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
          //   target="__blank"
          // >
          // getFilePreview(filePath)
          <span
            style={{ color: "blue" }}
            onClick={() => getFilePreview(filePathEncrypted)}
          >
            {showFileName(filePath)}
          </span>
        ) : (
          <span className={style.fileName}>
            <FormattedLabel id="addFile" />
          </span>
        )}
      </label>
      {filePath && (
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
      )}
    </div>
  );
};
export default UploadButton;
