import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import style from "./upload.module.css";
import axios from "axios";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import { EncryptData, DecryptData } from "../../common/EncryptDecrypt";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

const UploadButton = (props) => {
  console.log("props", props);
  const [filePath, setFilePath] = useState(props.fileName);
  const language = useSelector((state) => state.labels.language);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

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
    console.log("filePath", filePath);
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
        cfcErrorCatchMethod(error, true);
      });
  };

  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
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
          setLoading(true);
          let formData = new FormData();
          formData.append("file", file);
          formData.append("appName", props.appName);
          formData.append("serviceName", props.serviceName);
          axios
            .post(
              `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`,
              formData,
              { headers: headers }
            )
            .then((r) => {
              setLoading(false);
              setFilePath(r.data.filePath);
              props.filePath(r.data.filePath);
            })
            .catch((err) => {
              console.log("err", err);
              setLoading(false);
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

  const discard = async (e) => {
    swal({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला नक्की फाइल हटवायची आहे का ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((willDelete) => {
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
              headers: headers,
            }
          )
          .then((res) => {
            if (res.data.status == "SUCCESS") {
              setFilePath(null), props.filePath(null);
              swal(
                language === "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                {
                  icon: "success",
                  button: language === "en" ? "Ok" : "ठीक आहे ",
                }
              );
            } else {
              swal(
                language === "en"
                  ? "Something went wrong..!!!"
                  : "काहीतरी चूक झाली..!!!",
                { button: language === "en" ? "Ok" : "ठीक आहे " }
              );
            }
          })
          .catch((err) => {
            cfcCatchMethod(err, true);
          });
      } else {
        swal(language == "en" ? "File is Safe" : "फाइल सुरक्षित आहे", {
          button: language === "en" ? "Ok" : "ठीक आहे ",
        });
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
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => getFilePreview(filePath)}
          >
            <FormattedLabel id="viewDoc" />
          </Button>
        ) : (
          <span className={style.fileName}>
            <FormattedLabel id="addFile" />
          </span>
        )}
      </label>
      {props?.mode !== "View"
        ? filePath && (
            <IconButton
              onClick={(e) => {
                console.log("ssssss ", e);
                discard(e);
              }}
            >
              <Delete color="error" />
            </IconButton>
          )
        : ""}
    </div>
  );
};
export default UploadButton;
