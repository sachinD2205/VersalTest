import { Add, Delete } from "@mui/icons-material";
import {
  IconButton
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import swal from "sweetalert";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";
import style from "./uploadButtonHawker.module.css";
import { useSelector } from "react-redux";
import { DecryptData, EncryptData } from "../../../components/common/EncryptDecrypt"


const UploadButtonHawker = (props) => {
  const [filePath, setFilePath] = useState(null);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const [fileNameUploaded, setFileNameUploaded] = useState()
  const [photo, setPhoto] = useState(false);
  const [photo1, setPhoto1] = useState();
  const userToken = useGetToken();

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
  // file Upload
  const handleFile = async (e) => {
    setValue("loadderState", true);
    const url = `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`;
    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);


    //! extension only
    const fileExtension = e?.target?.files[0]?.name?.split(".")[e?.target?.files[0]?.name?.split(".").length - 1];
    //! without extension
    const fileNameWithoutExtension = e?.target?.files[0]?.name?.split("." + fileExtension)[0];
    //! regex --- letter/numbers/hypens/underscore
    const fileNameRegex = /^[a-zA-Z0-9_-]+$/;


    //! check file type
    if (
      e?.target?.files[0]?.type == "image/jpeg" ||
      e?.target?.files[0]?.type == "image/png"
    ) {
      //! check fileName
      if (fileNameRegex.test(fileNameWithoutExtension)) {
        //! check file size 
        if (e?.target?.files[0]?.size < 10485760) {
          //! upload Api
          axios
            .post(url, formData, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setFilePath(res?.data?.filePath);
              setFileNameUploaded(res?.data?.fileName);
              props.filePath(res?.data?.filePath);
              setValue("loadderState", false);
              toast.success("Document Uploaded Successfully !!!", {
                autoClose: "1000",
                position: toast.POSITION.TOP_RIGHT,
              });
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language)
            });
          // upload api end
        }
        //! file size error
        else {
          // setValue("loadderState", false);
          swal({
            text:
              language == "en"
                ? "File size should not exceed 10 MB"
                : "फाइलचा आकार १० मेगाबाइटपेक्षा जास्त नसावा",
            icon: "error",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
          var inputElement = document.getElementById("uploadButtonHawkerWithoutAdd");
          inputElement.value = "";
        }
      }
      //! file Name error
      else {
        // setValue("loadderState", false);
        swal({
          title:
            language == "en"
              ? "Oops!"
              : "अरे!",
          text:
            language == "en"
              ? "The file name can only contain letters, numbers, hyphens, and underscores. Special characters are not allowed"
              : "फाइलचे नाव किव्हा अक्षर, अंक, हायफन आणि अंडरस्कोरच्या प्रकारे असावे. विशेष वर्णांकीत नको",
          icon: "error",
          buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
        });
        var inputElement = document.getElementById("uploadButtonHawkerWithoutAdd");
        inputElement.value = "";
      }
    }
    //! file type error
    else {
      // setValue("loadderState", false);
      swal({
        title:
          language == "en"
            ? "Please Upload Valid Type File!"
            : "कृपया वैध प्रकार फाइल अपलोड करा!",
        text:
          language == "en"
            ? "Allowed file types are JPEG, and PNG only."
            : "केवळ JPEG आणि PNG हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });
      var inputElement = document.getElementById("uploadButtonHawkerWithoutAdd");
      inputElement.value = "";
    }




  };

  // shwoFileName
  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");
    return fileNamee[1];
  }

  // delete file
  const discard = async (e) => {

    const ciphertext = EncryptData("passphraseaaaaaaadiscard", filePath);
    const url = `${urls.CFCURL}/file/discardEncrypted?filePath=${ciphertext}`;




    swal({
      title: "Delete?",
      text: "Are you sure you want to delete the file ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setValue("loadderState", true);
        axios
          .delete(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null), props.filePath(null);
              setValue("loadderState", false);
              swal("File Deleted Successfully!", { icon: "success" });
            } else {
              setValue("loadderState", false);
              swal("Something went wrong..!!!");
            }
          }).catch((error) => {
            callCatchMethod(error, language);
          });
      } else {
        swal("File is Safe");
      }
    });
  };
  // filePreview -- pass filepath as props
  const getFilePreview = (filePath) => {
    console.log("filePath123", filePath);


    if (filePath != null && filePath != undefined && filePath != "") {
      // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
      const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
      const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;


      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
          const newTab = window.open();
          newTab.document.write(`
        <html>
          <body style="margin: 0;">
            <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
          </body>
        </html>
      `);
        })
        .catch((error) => {
          console.log("CatchPreviewApi", error)
          callCatchMethod(error, language);
        });
    }
  }


  //! ====================> useEffects <======================>

  // useEffect
  useEffect(() => {
    console.log("sachin", props);
  }, [props]);

  // useEffect
  useEffect(() => {
    console.log("props.filePath <->", props);
    setFilePath(props?.fileName);
    if (props?.fileName) {
    }
  }, [props?.fileName]);

  //view
  return (
    <div>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div className={style.align1}>
          <label className={style.uploadButton}>
            {!filePath && (
              <>
                <Add
                  color='secondary'
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1.4px dashed #9c27b0",
                    marginRight: 1.5,
                  }}
                />
                <input
                  id='uploadButtonHawkerWithoutAdd'

                  type='file'
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
                onClick={() =>
                  getFilePreview(filePath)
                }
              >
                {showFileName(filePath)}
              </span>

            ) : (
              <span className={style.fileName}>Add File</span>
            )}
          </label>
          {filePath && (
            <IconButton
              onClick={(e) => {
                discard(
                  e,
                ); /* setFilePath(null),props.filePath(null),discardFile() */
              }}>
              <Delete color='error' />
            </IconButton>
          )}
          {photo &&
            <>
            </>
          }

        </div>
      )}
    </div>
  );
};
export default UploadButtonHawker;
