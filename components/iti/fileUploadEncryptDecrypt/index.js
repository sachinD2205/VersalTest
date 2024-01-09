import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../fileUpload/upload.module.css";
import { useSelector } from "react-redux";

import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import Loader from "../../../containers/Layout/components/Loader";
import { DecryptData, EncryptData } from "../../common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  // const methods = useForm();

  const methods = useFormContext();
  const {
    control,
    register,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = methods;
  const language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();
  const [loading, setLoading] = useState(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
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

  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);

  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      setFilePath(props.fileDtl);
      props.fileNameEncrypted(props.fileDtl);
      // const plaintext = DecryptData("passphraseaaaaaaaaupload", props?.fileDtl);
      // setFilePathEncrypted(plaintext);
    }
  }, [props?.fileDtl]);

  const handleFile = async (e) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      // .post(`${urls.CFCURL}/file/upload`, formData, {
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLoading(false);
        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );
        let f = r.data.filePath;
        setFilePath(r?.data?.filePath);
        setFilePathEncrypted(plaintext);
        // props.filePath(f);
        // setValue(props.fileKey, f);
        setValue(props.fileKey, r?.data?.filePath);
        props?.fileNameEncrypted(r?.data?.filePath);
        console.log(props.fileKey, "=>>>>>", f);
        console.log("kay yetoy error", props?.error);
        clearErrors(props?.fileKey);

        // console.log(props.fileKey, f)
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        swal(
          "Error!",
          "File should be in proper format or size should be below 2Mb!",
          "error"
        );
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName.split("__");
    return fileNamee[1];
  }
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
  // const viewFile = (filePath) => {
  //   const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

  //   const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

  //   console.log("DecryptPhoto", DecryptPhoto);
  //   console.log("ciphertext", ciphertext);

  //   // if (filePath?.includes(".pdf")) {
  //   if (DecryptPhoto?.includes(".pdf")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         const dataUrl = `data:${response?.data?.mimeType};base64,${response?.data?.fileName}`;
  //         const newTab = window.open();
  //         newTab.document.write(`
  //                               <html>
  //                                 <body style="margin: 0;">
  //                                   <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
  //                                 </body>
  //                               </html>
  //                             `);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //     // const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;
  //     // axios
  //     //   .get(url, {
  //     //     headers: {
  //     //       Authorization: `Bearer ${userToken}`,
  //     //     },
  //     //     responseType: "arraybuffer",
  //     //   })
  //     //   .then((response) => {
  //     //     setLoading(false);
  //     //     if (response && response.data instanceof ArrayBuffer) {
  //     //       const pdfBlob = new Blob([response.data], {
  //     //         type: "application/pdf",
  //     //       });
  //     //       const pdfUrl = URL.createObjectURL(pdfBlob);

  //     //       const newTab = window.open();
  //     //       newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
  //     //     } else {
  //     //       console.error("Invalid or missing data in the response");
  //     //     }
  //     //   })
  //     //   .catch((error) => {
  //     //     setLoading(false);
  //     //     // console.error("Error fetching or displaying PDF:", error);
  //     //     callCatchMethod(error, language);
  //     //   });
  //   } else {
  //     setLoading(true);
  //     // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       })
  //       .then((r) => {
  //         setLoading(false);
  //         console.log(
  //           "ImageApi21312",
  //           `data:image/png;base64,${r?.data?.fileName}`
  //         );
  //         const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //         newTab.document.body.innerHTML = `<img src="${imageUrl}" style="width: 100vw; height: 100vh; object-fit: scale-down ;" />`;
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   }
  // };

  const discard = async (e) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
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
                setFilePathEncrypted(null),
                props?.fileNameEncrypted(null),
                setValue(props.fileKey, null);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        swal("File is Safe");
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
            {!filePath && props.view == false && (
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
                  id="docLms"
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
              //     href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
              //     target="__blank"
              // >
              //     {showFileName(filePath)}
              // </a>
              <Button
                variant="contained"
                style={{ marginBottom: 2 }}
                onClick={() => {
                  viewFile(filePath);
                  //   window.open(
                  //     `${urls.CFCURL}/file/preview?filePath=${filePath}`,
                  //     "_blank"
                  //   );
                }}
              >
                {language === "en" ? "Preview" : "पूर्वावलोकन"}
              </Button>
            ) : props.view == false ? (
              <span className={style.fileName}>
                {language === "en" ? "Add File" : "फाइल जोडा"}
              </span>
            ) : (
              <span className={style.fileName} />
            )}
          </label>
          {props.view == false ? (
            <>
              {filePath && props.showDel == true && (
                <IconButton
                  onClick={(e) => {
                    discard(e);
                  }}
                >
                  <Delete color="error" />
                </IconButton>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};
export default UploadButtonOP;
