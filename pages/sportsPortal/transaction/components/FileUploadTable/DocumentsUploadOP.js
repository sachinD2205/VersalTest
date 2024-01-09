import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import style from "./upload.module.css";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

const UploadButtonOP = (props) => {
  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useFormContext();

  const [filePath, setFilePath] = useState(null);
  const [fileName, setFileName] = useState("");

  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("filePath", filePath);
    if (filePath) {
      showFileName(filePath);
    }
  }, [filePath]);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      setFilePath(props.fileDtl);
    }
  }, [props?.fileDtl]);
  const token = useSelector((state) => state.user.user.token);

  const handleFile = async (e) => {
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
        // .post(`${urls.CFCURL}/file/uploadAllTypeOfFile`, formData)
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData)
        .then((r) => {
          let f = r.data.filePath;
          setFilePath(f);
          setFileName(r?.data?.fileName);

          // props.filePath(f);
          setValue(
            "attachmentss",
            getValues("attachmentss")?.map((row, index) => {
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
          language == "en"
            ? "Allowed file types are JPEG, PNG, and PDF only."
            : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });
    }
  };
  // axios
  //   .post(`${urls.CFCURL}/file/uploadAllTypeOfFile`, formData)
  //   .then((r) => {
  //     let f = r.data.filePath;
  //     setFilePath(f);
  //     // props.filePath(f);
  //     setValue(props.fileKey, f);
  //   });
  // };

  // function showFileName(fileName) {
  //   let fileNamee = [];
  //   fileNamee = fileName.split("__");
  //   return fileNamee[1];
  // }

  function showFileName(fileName) {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", fileName);
    console.log("name34234", fileName);
    console.log("DecryptPhoto", DecryptPhoto);
    let fileNamee = [];
    fileNamee = DecryptPhoto.split("__");
    console.log("Shree22", fileNamee[1]);
    setFileName(fileNamee[1]);
    // return fileNamee[1];
  }
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
        axios
          .delete(`${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`)
          .then((res) => {
            if (res.status == 200) {
              if (props?.forCitizen) {
                setFilePath(null);
              } else {
                setFilePath(null), setValue(props.fileKey, null);
              }
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);
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
      // const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
      // const newTab = window.open();
      // newTab.document.body.innerHTML = `<img src="${imageUrl}"  width="100%" height="100%"/>`;
      // const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
      // const newTab = window.open();
      // newTab.document.write(`
      //   <html>
      //     <body style="margin: 0;">
      //       <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
      //     </body>
      //   </html>
      // `);
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
        // callCatchMethod(error, language);
      });
  };
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
          // <a
          //   href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
          //   target="__blank"
          // >
          //   {showFileName(filePath)}
          // </a>
          <span
            style={{ color: "blue" }}
            onClick={() => getFilePreview(filePath)}
          >
            {fileName}
            {/* {showFileName(filePath)} */}
          </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>Upload File</span>
        ) : (
          <span className={style.fileName} />
        )}
      </label>
      {filePath && props.showDel == true && (
        <IconButton
          onClick={(e) => {
            discard(e);
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
    </div>
  );
};
export default UploadButtonOP;
