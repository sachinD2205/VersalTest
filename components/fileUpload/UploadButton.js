import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { EncryptData, DecryptData } from "../common/EncryptDecrypt";
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
import { cfcCatchMethod, moduleCatchMethod } from "../../util/commonErrorUtil";
const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  useEffect(() => {
    if (props?.fileName) {
      console.log("props?.fileName", props?.fileName);
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    const file = e.target.files[0];
    const MAX_FILE_SIZE = 2048;

    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const fileExtension =
      file?.name?.split(".")[file?.name?.split(".").length - 1];
    //! without extension
    const fileNameWithoutExtension = file?.name?.split("." + fileExtension)[0];
    //! regex --- letter/numbers/hypens/underscore
    const fileNameRegex = /^[a-zA-Z0-9_\s\u0900-\u097F]+$/;
    // const fileNameRegex = /^[a-zA-Z0-9_-]+$/;
    if (fileNameRegex.test(fileNameWithoutExtension)) {
      if (file && allowedFileTypes.includes(file.type)) {
        const fileSizeKiloBytes = e.target.files[0].size / 1024;
        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "File size exceeds maximum limit 2 MB"
              : "फाइल खूप मोठी आहे, कमाल फाइल आकार 2MB आहे",
            "error"
          );
        } else {
          formData.append("file", e.target.files[0]);
          formData.append("appName", props?.appName);
          formData.append("serviceName", props?.serviceName);
          axios
            .post(
              `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            )
            .then((r) => {
              setFilePath(r.data.filePath);
              setFileName(r.data.fileName);
              props?.filePath(r.data.filePath);
              // props?.fileName(r.data.fileName);
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
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
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
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        cfcErrorCatchMethod(error, true);
      });
  };
  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    console.log("error", error);
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

  const discard = async (e, filePath) => {
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
    })
      .then((willDelete) => {
        if (willDelete) {
          const discardDecryptPhoto = DecryptData(
            "passphraseaaaaaaaaupload",
            filePath
          );
          const discardFilePath = EncryptData(
            "passphraseaaaaaaadiscard",
            discardDecryptPhoto
          );
          axios
            .delete(
              `${urls.CFCURL}/file/discardEncrypted?filePath=${discardFilePath}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            )
            .then((res) => {
              if (res.status == 200) {
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
                    ? "Something went wrong..!!!"
                    : "काहीतरी चूक झाली..!!!"
                );
              }
            });
        } else {
          swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे");
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
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
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => getFilePreview(filePath)}
          >
            {/* <FormattedLabel id="viewDoc" /> */}
            { language == "en"
                    ? "View Document"
                    : "कागदपत्र पहा"}
          </Button>
        ) : (
          <span className={style.fileName}>
            <FormattedLabel id="addFile" />
          </span>
        )}
      </label>

      {!props?.disabled == true && (
        <>
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
        </>
      )}
    </div>
  );
};
export default UploadButton;
