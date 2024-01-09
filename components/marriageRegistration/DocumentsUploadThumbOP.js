import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import urls from "../../URLS/urls";
import Camera from "../../pages/marriageRegistration/transactions/ReissuanceofMarriageCertificate/Camera";
import style from "../fileUpload/upload.module.css";
import { DecryptData, EncryptData } from "../common/EncryptDecrypt";
import { toast } from "react-toastify";

const UploadButtonThumbOP = (props) => {
  // const methods = useForm();
  const {
    control,
    register,
    setValue,
    getValues,
    clearErrors,
    reset,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels?.language);

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
  const [filePathEncrypted, setFilePathEncrypted] = useState(null);
  const [deletedFile, setDeletedFile] = useState(null);
  // const [fileKey,setFileKey]=useState(null);

  useEffect(() => {
    console.log("props.fileKey->>>>>>>", props?.fileKey);
    console.log("props.showDel->>>>>>>", props?.showDel);
  }, []);

  // useEffect(() => {}, [props]);
  // useEffect(() => {
  //   if (props?.fileName) {
  //     setFilePath(props?.fileName);
  //   }
  // }, [props?.fileName]);
  // useEffect(() => {
  //   console.log("props.filePath <->", props?.fileDtl);
  //   if (props?.fileDtl) {
  //     setFilePath(props.fileDtl);
  //   }
  // }, [props?.fileDtl]);
  // useEffect(() => {
  //   console.log("props.filePath <->", props?.fileDtl);
  //   if (props?.fileDtl) {
  //     console.log("sdfdsf32432", props?.fileDtl.split(":")[0] == ["C"]);

  //     if (props?.fileDtl.split(":")[0] == ["C"]) {
  //       setFilePath(props?.fileDtl);
  //     } else {
  //       const plaintext = EncryptData(
  //         "passphraseaaaaaaadiscard",
  //         props.fileDtl,
  //       );
  //       const DecryptPhoto = DecryptData(
  //         "passphraseaaaaaaaaupload",
  //         props.fileDtl,
  //       );
  //       console.log("plainTextsdfsdfsdf", props?.fileDtl);
  //       setFilePath(DecryptPhoto);
  //     }

  //     // setFilePath(data);
  //     // setFilePath(props?.fileDtl);
  //   }
  // }, [props?.fileDtl]);

  useEffect(() => {
    console.log("props88888888888", props?.fileDtl);
    if (props?.fileDtl) {
      // const data =
      // ("C:,var,pcmcerp,docs,MR,MBR,15_12_2023_12_25_34__Screenshot (6).png");

      console.log("sdfdsf32432", props?.fileDtl);

      if (props?.fileDtl.split(":")[0] == ["C"]) {
        const plaintext = EncryptData(
          "passphraseaaaaaaapreview",
          props?.fileDtl,
        );
        setFilePath(plaintext);
      } else {
        setFilePath(props?.fileDtl);
      }

      // setFilePath(data);
      // setFilePath(props?.fileDtl);
    }
  }, [props?.fileDtl]);
  const handleFile1 = () => {
    setShowCamera(true);
  };
  let user = useSelector((state) => state.user.user);

  const handleFile = (imgsrc) => {
    let formData = new FormData();
    console.log("tempimg", imgsrc);
    formData.append("file", getFileFromUrl(imgsrc, props.fileName));
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      // .post(`${urls.CFCURL}/file/upload`, formData, {
      .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r?.status == "200" || r?.status == "201") {
          console.log("departmentUpload+++", f);
          let f = r?.data?.filePath;
          if (f) {
            const plaintext = f;
            console.log("plainText", plaintext);
            setFilePath(plaintext);
            props?.fileNameEncrypted(r?.data?.filePath);
            setValue(props.fileKey, plaintext);
            setFilePathEncrypted(r?.data?.filePath);
            setValue("loadderState", true);
            clearErrors(props.fileKey);
            toast.success(
              language == "en"
                ? "Document Uploaded Successfully !!!"
                : "दस्तऐवज यशस्वीरित्या अपलोड केले",
              {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              },
            );
          } else if (r?.status == "500") {
            console.log("r?.data", r?.data);
            console.log("r?.status", r?.status);
            setValue("loadderState", false);
            toast.error("Please Upload Valid Document !!!", {
              autoClose: "1000",
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName.split("__");
    return fileNamee[1];
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
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                setDeletedFile(filePath),
                setValue(props.fileKey, null);
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
    console.log("filePath2342", filePath);
    // const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", filePath);

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
              onClick={() => handleFile1()}
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
            onClick={() => {
              if (filePath) {
                console.log("filePath", filePath);
                getFilePreview(
                  DecryptData("passphraseaaaaaaaaupload", filePath),
                );
              }
            }}
          >
            {console.log("flilePath324------", filePath)}
            {
              showFileName(DecryptData("passphraseaaaaaaaaupload", filePath))
              // ,
            }
          </span>
        ) : props?.showDel == true ? (
          <span className={style.fileName}>Capture</span>
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
