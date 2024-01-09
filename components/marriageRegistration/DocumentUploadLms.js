import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";
import style from "../fileUpload/upload.module.css";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../util/util";
import Loader from "../../containers/Layout/components/Loader";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";
import { useRouter } from "next/router";
const UploadButtonOP = (props) => {
  // const methods = useForm();
  const language = useSelector((lan) => lan?.labels?.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();
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

  const [filePath, setFilePath] = useState(null);
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [fileKey,setFileKey]=useState(null);
  useEffect(() => {
    console.log("props.fileDtl->>>>>>>", props?.fileDtl);
    // console.log("props.showDel->>>>>>>", props?.preview);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    // if ((router.query.pageMode == "Check") && props?.fileDtl) {
    if (
      (router.query.pageMode == "Check" && props?.fileDtl) ||
      (router.query.pageMode == "Edit" && props?.fileDtl)
    ) {
      console.log("props.filePath <->insie", props?.fileDtl);
      setFilePath(props.fileDtl);
      props?.fileNameEncrypted(props.fileDtl);
      const plaintext = DecryptData("passphraseaaaaaaaaupload", props?.fileDtl);
      setFilePathEncrypted(plaintext);
    }
  }, [props?.fileDtl]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    setLoading(true);
    axios
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );
        console.log("Decrypted:", plaintext);
        setFilePath(r?.data?.filePath);
        setFilePathEncrypted(plaintext);
        // props?.filePath(plaintext);
        // setValue(props.fileKey, plaintext);
        setValue(props.fileKey, r?.data?.filePath);
        props?.fileNameEncrypted(r?.data?.filePath);
        setLoading(false);
        // let f = r.data.filePath;
        // setFilePath(f);
        // // props.filePath(f);
        // setValue(props.fileKey, f);
        // console.log(props.fileKey, "=>>>>>", f);
        // console.log("kay yetoy error", props?.error);
        clearErrors(props?.fileKey);

        // console.log(props.fileKey, f)
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        swal(
          "Error!",
          "File should be in proper format or size should be below 10Mb!",
          "error"
        );
      });
  };

  function showFileName(fileName) {
    console.log("filePathfilePathNewsdfsd", fileName);

    let fileNamee = [];
    fileNamee = fileName.split("__");
    console.log("filePathfilePathNew", fileNamee);
    return fileNamee[1];
  }

  const discard = async (e, filePath) => {
    console.log("discard filePath", filePath);

    swal({
      title: language === "en" ? "Delete?" : "हटवायचे ?",
      text:
        language === "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);

        console.log("ciphertext", ciphertext);
        setLoading(true);
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            setLoading(false);
            if (res.status == 200) {
              setFilePath(null),
                setFilePathEncrypted(null),
                setValue(props.fileKey, null);
              swal({
                title: language === "en" ? "Deleted !" : "हटवले !",
                text:
                  language === "en"
                    ? "File Deleted Successfully!"
                    : "फाइल यशस्वीरित्या हटवली !",
                icon: "success",
              });
            } else {
              swal({
                text:
                  language === "en"
                    ? "Something went wrong..!!!"
                    : "काहीतरी चूक झाली..!!!",
              });
            }
          })
          .catch((e) => {
            setLoading(false);
            catchExceptionHandlingMethod(e, language);
          });
      } else {
        swal({
          text: language === "en" ? "File is Safe" : "फाइल सुरक्षित आहे",
        });
      }
    });
  };

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
          Authorization: `Bearer ${token}`,
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
        // callCatchMethod(error, language);
        catchExceptionHandlingMethod(error, language);
      });
  };

  // const viewFile = async (filePath) => {
  //   // console.log("plaintext",filePath);

  //   const DecryptPhoto = await DecryptData(
  //     "passphraseaaaaaaaaupload",
  //     filePath
  //   );

  //   const ciphertext = await EncryptData(
  //     "passphraseaaaaaaapreview",
  //     DecryptPhoto
  //   );

  //   console.log("plaintext", DecryptPhoto);
  //   if (DecryptPhoto?.includes(".pdf")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     // axios
  //     //   .get(url, {
  //     //     headers: {
  //     //       Authorization: `Bearer ${token}`,
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
  //     //     catchExceptionHandlingMethod(error, language);
  //     //   });
  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
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
  //   } else {
  //     setLoading(true);
  //     const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
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
  //         // console.log("CatchPreviewApi", error);
  //         catchExceptionHandlingMethod(error, language);
  //         // callCatchMethod(error, language);
  //       });
  //   }
  // };

  useEffect(() => {
    console.log("propsOK", props);
  }, [props]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={style.align}>
          <label className={style.uploadButton}>
            {!filePath && props.showDel === true && (
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
            {/* {console.log("filePathfilePathNew1",filePathEncrypted)} */}
            {filePath ? (
              <a
                // href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                // target="__blank"
                onClick={() => {
                  viewFile(filePath);
                  // console.log("filePathfilePath", filePath);
                  // console.log("filePathfilePath", filePath?.includes(".pdf"));
                }}
              >
                {showFileName(filePathEncrypted)}
              </a>
            ) : props?.showDel == true ? (
              <span className={style.fileName}>
                {/* Upload File */}
                <FormattedLabel id="uploadFile" />
                {/* Upload File */}
              </span>
            ) : (
              <span className={style.fileName} />
            )}
          </label>
          {filePath && props.showDel == true && (
            <IconButton
              onClick={(e) => {
                discard(e, filePath);
              }}
            >
              <Delete color="error" />
            </IconButton>
          )}
        </div>
      )}
    </>
  );
};
export default UploadButtonOP;
