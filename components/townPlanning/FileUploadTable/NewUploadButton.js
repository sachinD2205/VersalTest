import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import style from "./NewUploadButton.module.css";
import axios from "axios";
import urls from "../../../URLS/urls";
// import urls from "../../../URLS/urls";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../containers/Layout/components/Loader";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useRouter } from "next/router";
import { DecryptData, EncryptData } from "../../common/EncryptDecrypt";

const NewUploadButton = (props) => {
  const language = useSelector((state) => state?.labels.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;

  // loadderSetTimeOutFunction
  // const loadderSetTimeOutFunction = () => {
  //   setTimeout(() => {
  //     setValue("loadderState", false);
  //   }, 0);
  // };

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
  const router = useRouter();
  // file Upload
  const handleFile = async (e) => {
    setValue("loadderState", true);
    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);

    if (
      e.target.files[0].type == "image/jpeg" ||
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "application/pdf"
    ) {
      if (e.target.files[0].size < 2097152) {
        // upload api
        axios
        .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((res) => {
            // try {
            if (res?.status == "200" || res?.status == "201") {
              setFilePath(res?.data?.filePath);
              props.filePath(res?.data?.filePath);
              setValue("loadderState", false);
              toast.success("Document Uploaded Successfully !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
            } else if (res?.status == "500") {
              console.log("res?.data", res?.data);
              console.log("res?.status", res?.status);
              setValue("loadderState", false);
              toast.error("Please Upload Valid Document !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
            } else if (res?.status == "400") {
              console.log("res?.data", res?.data);
              console.log("res?.status", res?.status);
              setValue("loadderState", false);
              toast.error("Please Upload Valid Document !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            toast.error("Please Upload Valid Document !!!", {
              autoClose: "1000",
              position: toast.POSITION.TOP_RIGHT,
            });
          });
        // upload api end
      } else {
        setValue("loadderState", false);
        swal(
          language == "en"
            ? "File size should not exceed 2 MB"
            : "फाइलचा आकार 2 मेगाबाइटपेक्षा जास्त नसावा",
          { icon: "error" },
        );
        var inputElement = document.getElementById("file");
        inputElement.value = "";
      }
    } else {
      setValue("loadderState", false);
      swal(
        language == "en"
          ? "Please Upload Valid Type File !"
          : "कृपया वैध प्रकार फाइल अपलोड करा !",
        language == "en"
          ? "Allowed file types are JPEG, PNG, and PDF only."
          : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        { icon: "error" },
      );
      var inputElement = document.getElementById("file");
      inputElement.value = "";
    }
  };

  // shwoFileName
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
  // delete file
  const discard = async (e) => {
    swal({
      title: language == "en" ? "Delete?" : "हटवायचे आहे?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ? "
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setValue("loadderState", true);
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
              setFilePath(null), props.filePath(null);
              setValue("loadderState", false);
              {
                language == "en"
                  ? swal("File Deleted Successfully!", { icon: "success" })
                  : swal("फाइल यशस्वीरित्या हटवली!", { icon: "success" });
              }
            } else {
              setValue("loadderState", false);
              {
                language == "en"
                  ? swal("Something went wrong..!!!")
                  : swal("काहीतरी चूक झाली..!!!");
              }
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            callCatchMethod(error, language);
            console.log("zoneNameApiCallError", error);
          });
      } else {
        {
          language == "en" ? swal("File is Safe") : swal("फाइल सुरक्षित आहे");
        }
      }
    });
  };

  // ! ==================> useEffects ===============>
  // useEffect
  useEffect(() => {
    console.log("props", props);
  }, [props]);

  // useEffect
  useEffect(() => {
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  //view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <>
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
                      marginLeft: "5vw",
                    }}
                  />
                  <input
                    type="file"
                    id="file"
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
                  {showFileName(filePath)}
               </span>
                
              ) : (
                <span className={style.fileName}>
                  {language == "en" ? "Add File" : "फाइल जोडा"}
                </span>
              )}
            </label>
            {router.query.pageMode != "View" && filePath && (
              <IconButton
                onClick={(e) => {
                  discard(
                    e,
                    language,
                  ); /* setFilePath(null),props.filePath(null),discardFile() */
                }}
              >
                <Delete color="error" />
              </IconButton>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default NewUploadButton;
