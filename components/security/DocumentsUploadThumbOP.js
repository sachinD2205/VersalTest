import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import swal from "sweetalert";
import style from "../fileUpload/upload.module.css";
import urls from "../../URLS/urls";
import Camera from "../../pages/marriageRegistration/transactions/ReissuanceofMarriageCertificate/Camera";
import * as htmlToImage from "html-to-image";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";

const UploadButtonThumbOP = (props) => {
  console.log("props", props);
  // const methods = useForm();
  // const {
  //   setValue,
  //   getValues,
  //   reset,
  //   formState: { errors },
  // } = useForm();

  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    // formState: { errors },
  } = useFormContext();

  const [showCamera, setShowCamera] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);
  const blobToImage = (blob) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.src = url;
    });
  };

  const dataURLtoFile = (dataurl, filename) => {
    console.log("dataurl", dataurl);
    if (dataurl) {
      var arr = dataurl?.split(","),
        mime = arr[0]?.match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
    }

    return new File([u8arr], filename, { type: mime });
  };
  const getFileFromUrl = (url, name, defaultType = "image/jpeg") => {
    // const response = await fetch(url);
    // const data = await response.blob();
    // const temp = new File([data], name, {
    //   type: data.type || defaultType,
    // });
    // const temp = await blobToImage(data)
    console.log("datadata", url);

    var temp = dataURLtoFile(url, name);

    return temp;
  };

  const imageCallback = (imgsrc) => {
    console.log("imgsrc", imgsrc);
    handleFile(imgsrc);
    // setValue('gPhoto', imgsrc)
  };

  const refreshCamera = () => {
    setFilePath(null);
  };
  const closeCamera = (val) => {
    setShowCamera(false);
    props?.handleCaptureImageClicked(true);
    // setFilePath(null)
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
    }
  }, [props?.fileDtl]);

  const handleFile1 = () => {
    console.log("22");
    setShowCamera(true);
  };

  const handleFile = (imgsrc) => {
    let formData = new FormData();
    console.log("tempimg", imgsrc);
    formData.append("file", getFileFromUrl(imgsrc, props.fileName));
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res", r);

        const plaintext = DecryptData(
          "passphraseaaaaaaaaupload",
          r?.data?.filePath
        );

        let f = r.data.filePath;
        setFilePath(plaintext);
        setFilePathEncrypted(r?.data?.filePath);
        props?.fileNameEncrypted(r?.data?.filePath);
        // props.filePath(f);
        console.log("f is", f);
        setValue(props.fileKey, plaintext);
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName.split("__");
    return fileNamee[1];
  }

  const discard = async (e) => {
    const textAlert =
      language == "en"
        ? "Are you sure you want to delete the file ? "
        : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?";
    const title = language == "en" ? "Delete?" : "हटवायचे?";

    sweetAlert({
      title: title,
      text: textAlert,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
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
            if (res.status == 200) {
              if (res?.data?.status == "SUCCESS") {
                setFilePath(null), setValue(props.fileKey, null);
                setShowCamera(false);
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
              swal("Something went wrong..!!!");
            }
          });
      } else {
        swal("File is Safe");
      }
    });
  };

  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  return (
    <div className={style.align}>
      <label className={style.uploadButton} onClick={() => handleFile1()}>
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
              // onClick={() => handleFile1()}
            />

            {/* <input
              type="file"
              onChange={(e) => {
                handleFile(e);
              }}
              hidden
            /> */}
          </>
        )}
        {filePath ? (
          // <a
          //   href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
          //   target="__blank"
          // >
          <span
            style={{ color: "blue" }}
            onClick={() => getFilePreview(filePathEncrypted)}
          >
            {showFileName(filePath)}
          </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>
            {" "}
            <FormattedLabel id="capture" />
          </span>
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
      {showCamera ? (
        <Camera
          imageCallback={imageCallback}
          closeCamera={closeCamera}
          refreshCamera={refreshCamera}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default UploadButtonThumbOP;
