import { CameraAltOutlined, Delete } from "@mui/icons-material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import swal from "sweetalert";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Camera from "../../pages/marriageRegistration/transactions/ReissuanceofMarriageCertificate/Camera";
import style from "../fileUpload/upload.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
import { useSelector } from "react-redux";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";
const UploadButtonThumbOP = (props) => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();

  const [showCamera, setShowCamera] = useState(false);
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
    // setFilePath(null)
  };

  const [filePath, setFilePath] = useState(null);
  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  useEffect(() => {
    console.log("props.filePath <->", props?.fileDtl);
    if (props?.fileDtl) {
      // setFilePath(props.fileDtl);
      setValue(props.fileKey, props.fileDtl);
    }
  }, [props?.fileDtl]);

  const handleFile1 = () => {
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
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let f = r.data.filePath;
        // setFilePath(f);
        // props.filePath(f);
        setValue(props.fileKey, f);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  function showFileName(fileName) {
    console.log("ppFilename",fileName);
    const DecryptfilePath = DecryptData("passphraseaaaaaaaaupload", fileName);
    let fileNamee = [];
    fileNamee = DecryptfilePath?.split("__");
    return fileNamee ? fileNamee[1] : null;
  }
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

        console.log("ciphertext", ciphertext);
        axios
           .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,{
        // axios
        //   .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
              setValue(props.fileKey, null);
              setShowCamera(false);
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
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!watch(props.fileKey) && props.showDel === true && (
          <>
            <CameraAltOutlined
              color="secondary"
              endIcon={<CameraAltIcon />}
              sx={{
                width: 30,
                height: 30,
                // border: "1.4px dashed #9c27b0",
                marginRight: 1.5,
              }}
              onClick={() => handleFile1()}
            />

            {/* <input
              onChange={(e) => {
                handleFile(e);
              }}
              hidden
            /> */}

            {/* <span className={style.fileName}>Capture</span> */}
          </>
        )}

        {watch(props.fileKey) ? (
           <span
           style={{ color: "blue" }}
           onClick={() => getFilePreview(watch(props.fileKey))}
         >
            {showFileName(watch(props.fileKey))}
         </span>
         
        ) : // props?.showDel ==

        true ? (
          <span className={style.fileName} style={{ cursor: "default" }}>
            <FormattedLabel id="capture" />
          </span>
        ) : (
          <span className={style.fileName} />
        )}
      </label>
      {watch(props.fileKey) && props.showDel == true && (
        <IconButton
          onClick={(e) => {
            discard(e);
          }}
        >
          <Delete color="error" />
        </IconButton>
      )}
      {showCamera ? (
        <>
          {" "}
          <Camera
            imageCallback={imageCallback}
            closeCamera={closeCamera}
            refreshCamera={refreshCamera}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};
export default UploadButtonThumbOP;
