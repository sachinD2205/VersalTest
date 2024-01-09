import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import style from "./upload.module.css";
import urls from "../../URLS/urls";
import { language } from "../../features/labelSlice";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../components/common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState("");
  const languagee = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
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
  const handleFile = async (e) => {
    console.log("e", e);

    let formData = new FormData();

    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);

    formData.append("serviceName", props.serviceName);

    if (
      e?.target?.files[0]?.type == "image/jpeg" ||
      e?.target?.files[0]?.type == "image/png" ||
      e?.target?.files[0]?.type == "application/pdf"
    ) {
      axios
        // .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("Shree21", r?.data?.filePath);
          let f = r?.data?.filePath;
          setFilePath(f);
          setFileName(r?.data?.fileName);
          // props.filePath(f);
          setValue(
            "attachmentss",
            watch("attachmentss")?.map((row, index) => {
              return {
                ...row,
                srNo: index + 1,
                filePath: index == props.fileKey ? f : row.filePath,
              };
            })
          );
        });
    } else {
      swal({
        text:
          languagee == "en"
            ? "Allowed file types are JPEG, PNG, and PDF only."
            : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: languagee == "en" ? "OK" : "ठीक आहे" },
      });
    }
  };

  function showFileName(fileName) {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", fileName);
    console.log("name34234",fileName)
    console.log("DecryptPhoto",DecryptPhoto)
    let fileNamee = [];
    fileNamee = DecryptPhoto.split("__");
    console.log("Shree22", fileNamee[1]);
    setFileName(fileNamee[1]);
    // return fileNamee[1];
  }

  const discard = async (e) => {
    const title = languagee == "en" ? "Delete?" : "हटवायचे आहे?";
    const titleText =
      languagee == "en"
        ? "Are you sure you want to delete the file ? "
        : "तुम्हाला नक्की फाइल हटवायची आहे का ? ";
    swal({
      title: title,
      text: titleText,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //! ------------- delete

        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);

        axios
          // .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                setValue(
                  "attachmentss",
                  getValues("attachmentss")?.map((row, index) => {
                    return {
                      ...row,
                      srNo: index + 1,
                      filePath: index == props.fileKey ? null : row.filePath,
                    };
                  })
                );
              {
                languagee == "en"
                  ? swal("File Deleted Successfully!", { icon: "success" })
                  : swal("फाइल यशस्वीरित्या हटवली!", { icon: "success" });
              }
            } else {
              {
                languagee == "en"
                  ? swal("Something went wrong..!!!")
                  : swal("काहीतरी चूक झाली..!!!");
              }
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        {
          languagee == "en" ? swal("File is Safe") : swal("फाइल सुरक्षित आहे");
        }
      }
    });
  };

  // getFilePreview
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);

    //!-------- preview
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // .then((r) => {
      //   const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
      //   const newTab = window.open();
      //   newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
      //   // const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
      //   // const newTab = window.open();
      //   // newTab.document.write(`
      //   //   <html>
      //   //     <body style="margin: 0;">
      //   //       <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
      //   //     </body>
      //   //   </html>
      //   // `);
      // })
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
        callCatchMethod(error, language);
      });
  };

  //! ======================> useEffect <=============

  useEffect(() => {
    console.log("filePath", filePath);

    if(filePath){

      showFileName(filePath)
    }


  }, [filePath]);

  useEffect(() => {
    console.log("props?.fileDtl", props?.fileDtl);
    if (props?.fileDtl) {
      setFilePath(props.fileDtl);
      // showFileName(props.fileDtl);
      // setFileName(props.fileDtl);
    }
  }, [props?.fileDtl]);

  useEffect(() => {
    console.log("props32432", props?.readOnly);
  }, [props?.readOnly]);

  //!=================> view <========
  return (
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
              type="file"
              onChange={(e) => {
                handleFile(e);
              }}
              hidden
            />
          </>
        )}
        {filePath ? (
          <span
            style={{ color: "blue" }}
            onClick={() => getFilePreview(filePath)}
          >
            
            {fileName}
            {/* {filePath} */}
          </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>
            {languagee == "en" ? "Upload File" : "अपलोड फाइल"}
          </span>
        ) : (
          <span className={style.fileName} />
        )}
      </label>

      {props?.readOnly == true ? (
        <></>
      ) : (
        filePath &&
        props.showDel == true && (
          <IconButton
            onClick={(e) => {
              discard(e);
            }}
          >
            <Delete color="error" />
          </IconButton>
        )
      )}
    </div>
  );
};
export default UploadButtonOP;
