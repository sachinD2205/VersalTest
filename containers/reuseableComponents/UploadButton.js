import React, { useState } from "react";
import styles from "../../styles/reusableComponents/UploadButton.module.css";
import axios from "axios";
import URLs from "../../URLS/urls";
import sweetAlert from "sweetalert";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import {
  DecryptData,
  EncryptData,
} from "../../components/common/EncryptDecrypt";
import { useDecryptedKeys } from "../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../util/util";

const UploadButton = ({
  appName,
  serviceName,
  label = "",
  addFileText = { en: "Add File", mr: "फाइल जोडा" },
  filePath,
  fileUpdater,
  view = false,
  onlyImage = false,
  onlyPDF = false,
  imageAndPDF = false,
  readOnly = false,
  disabled,
}) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const secretKeys = useDecryptedKeys();

  const [uploadingState, setUploadingState] = useState(false);
  const [previewDisabled, setPreviewDisabled] = useState(false);
  const [isPDF, setIsPDF] = useState(false);

  const imageFormats = ["image/jpeg", "image/jpg", "image/png"];

  const fileUpload = (fileData) => {
    setUploadingState(true);
    let formData = new FormData();
    formData.append("file", fileData);
    axios
      .post(`${URLs.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          appName,
          serviceName,
        },
      })
      .then((r) => {
        if (r.status === 200) {
          setUploadingState(false);
          fileUpdater(r.data.filePath);
          setIsPDF(r.data?.extension == ".pdf");
        }
      })
      .catch((error) => {
        setUploadingState(false);
        sweetAlert(
          language == "en" ? "Oops!" : "अरेरे!",
          language == "en"
            ? "An error occured while uploading the file. Please try again"
            : "दस्तऐवज अपलोड करताना एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा",
          "error"
        );
      });
  };

  const handleFile = (event) => {
    if (event.target.files) {
      if (onlyPDF) {
        if (event.target.files[0].type == "application/pdf") {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Please upload PDF file with size less than 10MB!"
              : "कृपया १०MB पेक्षा कमी आकाराची PDF दस्तऐवज अपलोड करा",
            "error"
          );
        }
      } else if (onlyImage) {
        if (imageFormats.includes(event.target.files[0].type)) {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Please upload JPEG/JPG/PNG file with size less than 10MB!"
              : "कृपया १०MB पेक्षा कमी आकाराची JPEG/JPG/PNG दस्तऐवज अपलोड करा",
            "error"
          );
        }
      } else if (imageAndPDF) {
        if (
          event.target.files[0].type == "application/pdf" ||
          imageFormats.includes(event.target.files[0].type)
        ) {
          fileUpload(event.target.files[0]);
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Please upload JPEG/JPG/PNG file with size less than 10MB!"
              : "कृपया १०MB पेक्षा कमी आकाराची JPEG/JPG/PNG दस्तऐवज अपलोड करा",
            "error"
          );
        }
      } else {
        fileUpload(event.target.files[0]);
      }
    }
  };

  const getFilePreview = (filePath) => {
    setPreviewDisabled(true);

    const DecryptPhoto = DecryptData(secretKeys.upload, filePath);
    const ciphertext = EncryptData(secretKeys.preview, DecryptPhoto);

    // const url = `${URLs.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    const url = `${URLs.CFCURL}/file/previewNewEncrypted`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filePath: ciphertext,
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
          setPreviewDisabled(false);
        }
        // for img
        else if (r?.data?.mimeType == "image/jpeg") {
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          setPreviewDisabled(false);
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
          setPreviewDisabled(false);
        }
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        setPreviewDisabled(false);
      });
  };

  // const previewFile = () => {
  //   setPreviewDisabled(true);

  //   try {
  //     if (isPDF) {
  //       const cipherText = DecryptData(secretKeys?.upload, filePath);

  //       const decryptedPreviewText = EncryptData(
  //         secretKeys.preview,
  //         // DecryprtPhoto
  //         cipherText
  //       );

  //       axios
  //         .get(`${URLs.CFCURL}/file/previewNewEncrypted`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           params: { filePath: decryptedPreviewText },
  //         })
  //         .then((response) => {
  //           if (response?.data?.mimeType == "application/pdf") {
  //             const byteCharacters = atob(response?.data?.fileName);
  //             const byteNumbers = new Array(byteCharacters.length);
  //             for (let i = 0; i < byteCharacters.length; i++) {
  //               byteNumbers[i] = byteCharacters.charCodeAt(i);
  //             }
  //             const byteArray = new Uint8Array(byteNumbers);
  //             const blob = new Blob([byteArray], { type: "application/pdf" });
  //             const url = URL.createObjectURL(blob);
  //             const newTab = window.open();
  //             newTab.location.href = url;

  //             setPreviewDisabled(false);
  //           } else {
  //             setPreviewDisabled(false);
  //           }
  //         })
  //         .catch((error) => {
  //           setPreviewDisabled(false);
  //           catchExceptionHandlingMethod(error, language);
  //         });
  //     } else {
  //       const cipherText = DecryptData(secretKeys?.upload, filePath);

  //       const decryptedPreviewText = EncryptData(
  //         secretKeys.preview,
  //         // DecryprtPhoto
  //         cipherText
  //       );

  //       axios
  //         .get(`${URLs.CFCURL}/file/previewNewEncrypted`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           params: { filePath: decryptedPreviewText },
  //         })
  //         .then((r) => {
  //           const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //           const newTab = window.open();
  //           newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //           setPreviewDisabled(false);
  //         })
  //         .catch((error) => {
  //           setPreviewDisabled(false);
  //           catchExceptionHandlingMethod(error, language);
  //         });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fileDiscard = () => {
    const encryptedFilePath = EncryptData(secretKeys?.discard, filePath);
    axios
      .delete(`${URLs.CFCURL}/file/discardEncrypted`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filePath: encryptedFilePath,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          fileUpdater("");
        }
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: 20,
            width: "max-content",
            cursor: "pointer",
          }}
        >
          {label != "" && (
            <span style={{ fontSize: "medium", fontWeight: "bold" }}>
              {label} :
            </span>
          )}

          {filePath ? (
            <div>
              <Button
                disabled={previewDisabled}
                size="small"
                variant="contained"
                onClick={() => {
                  // //old method
                  // window.open(
                  //   `${URLs.CFCURL}/file/preview?filePath=${filePath}`,
                  //   "_blank"
                  // );

                  //new method
                  // previewFile();
                  getFilePreview(filePath);
                }}
              >
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
              </Button>
              {!view && (
                <IconButton onClick={fileDiscard}>
                  <Delete color="error" />
                </IconButton>
              )}
            </div>
          ) : (
            <>
              {readOnly ? (
                <>
                  <label style={{ color: "red", fontWeight: "bold" }}>
                    {language == "en"
                      ? "File Not Attached"
                      : "दस्तऐवज जोडली नाही"}
                  </label>
                </>
              ) : uploadingState ? (
                <svg className={styles.loader} viewBox="25 25 50 50">
                  <circle r="20" cy="50" cx="50"></circle>
                </svg>
              ) : (
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
                      // @ts-ignore
                      if (e.target.files[0]) {
                        // @ts-ignore
                        // if (e.target.files[0].size > 2097152) {
                        if (e.target.files[0].size > 11534336) {
                          //11MB converted into Bytes validation
                          sweetAlert(
                            "Error!",
                            // 'Please upload file with size less than 2MB !',
                            "Please upload file with size less than 10MB !",
                            "error"
                          );
                          e.target.value = "";
                        } else {
                          handleFile(e);
                        }
                      }
                    }}
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
                    {addFileText[language]}
                  </span>
                </div>
              )}
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default UploadButton;
