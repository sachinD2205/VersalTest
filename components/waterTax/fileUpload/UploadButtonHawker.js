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
import style from "./uploadButtonHawker.module.css";
import axios from "axios";
import urls from "../../../URLS/urls";
import swal from "sweetalert";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../containers/Layout/components/Loader";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../.././util/util";

const UploadButtonHawker = (props) => {
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

  // file Upload
  const handleFile = async (e) => {
    setValue("loadderState", true);
    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);

    if (
      e?.target?.files[0]?.type == "image/jpeg" ||
      e?.target?.files[0]?.type == "image/png" ||
      e?.target?.files[0]?.type == "application/pdf"
    ) {
      if (e.target.files[0].size < 10485760) {
        // upload api
        axios
          .post(`${urls.CFCURL}/file/upload`, formData)
          .then((res) => {
            // try {
            if (res?.status == "200" || res?.status == "201") {
              setFilePath(res?.data?.filePath);
              props.filePath(res?.data?.filePath);
              setValue("loadderState", false);
              language == "en"
                ? toast.success("Document Uploaded Successfully !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  })
                : toast.success("दस्तऐवज यशस्वीरित्या अपलोड केले !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  });
            } else if (res?.status == "500") {
              console.log("res?.data", res?.data);
              console.log("res?.status", res?.status);
              setValue("loadderState", false);
              language == "en"
                ? toast.error("Please Upload Valid Document !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  })
                : toast.error("कृपया वैध कागदपत्र अपलोड करा !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  });
            } else if (res?.status == "400") {
              console.log("res?.data", res?.data);
              console.log("res?.status", res?.status);
              setValue("loadderState", false);
              language == "en"
                ? toast.error("Please Upload Valid Document !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  })
                : toast.error("कृपया वैध कागदपत्र अपलोड करा !!!", {
                    autoClose: "1000",
                    position: toast.POSITION.TOP_RIGHT,
                  });
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            language == "en"
              ? toast.error("Please Upload Valid Document !!!", {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                })
              : toast.error("कृपया वैध कागदपत्र अपलोड करा !!!", {
                  autoClose: "1000",
                  position: toast.POSITION.TOP_RIGHT,
                });
          });
        // upload api end
      } else {
        setValue("loadderState", false);
        swal({
          text:
            language == "en"
              ? "File size should not exceed 10 MB"
              : "फाइलचा आकार १० मेगाबाइटपेक्षा जास्त नसावा",
          icon: "error",
          buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
        });
        var inputElement = document.getElementById("file");
        inputElement.value = "";
      }
    } else {
      setValue("loadderState", false);
      swal({
        title:
          language == "en"
            ? "Please Upload Valid Type File!"
            : "कृपया वैध प्रकार फाइल अपलोड करा!",
        text:
          language == "en"
            ? "Allowed file types are JPEG, PNG, and PDF only."
            : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });
      var inputElement = document.getElementById("file");
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
    swal({
      title: language == "en" ? "Delete?" : "हटवायचे?",
      text:
        language == "en"
          ? "are you sure you want to delete the file ? "
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?",
      icon: "warning",
      buttons: {
        cancel: language == "en" ? "Cancel" : "रद्द करा",
        confirm: language == "en" ? "OK" : "ठीक आहे",
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        setValue("loadderState", true);
        axios
          .delete(`${urls.CFCURL}/file/discard?filePath=${filePath}`)
          .then((res) => {
            setValue("loadderState", false);
            if (res.status == 200) {
              setFilePath(null), props.filePath(null);
              language == "en"
                ? swal("File Deleted Successfully!", {
                    icon: "success",
                    buttons: { ok: "OK" },
                  })
                : swal("फाइल यशस्वीरित्या हटवली!", {
                    icon: "success",
                    buttons: { ok: "ठीक आहे" },
                  });
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            callCatchMethod(error, language);
            console.log("zoneNameApiCallError", error);
          });
      } else {
        language == "en"
          ? swal("File is safe", { icon: "info", buttons: { ok: "OK" } })
          : swal("फाइल सुरक्षित आहे", {
              icon: "info",
              buttons: { ok: "ठीक आहे" },
            });
      }
    });
  };

  // ! ==================> useEffects ===============>
  // useEffect
  useEffect(() => {
    console.log("sachin", props);
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
                <a
                  href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                  target="__blank"
                >
                  {showFileName(filePath)}
                </a>
              ) : (
                <span className={style.fileName}>Add File</span>
              )}
            </label>
            {filePath && (
              <IconButton
                onClick={(e) => {
                  discard(
                    e
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
export default UploadButtonHawker;
