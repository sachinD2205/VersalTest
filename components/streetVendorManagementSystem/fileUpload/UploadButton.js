import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../LegalCase";
import catchExceptionHandlingMethod from "../../../util/util"
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { DecryptData, EncryptData } from "../../../components/common/EncryptDecrypt"

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileNameUploaded, setFileNameUploaded] = useState()
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels?.language);
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

  // handleFile
  const handleFile = (e) => {
    props.modalState(false);
    props.uploading(true);



    const url = `${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`;

    console.log("file342", e?.target?.files[0])

    let formData = new FormData();
    formData.append("file", e?.target?.files[0]);
    formData.append("appName", props?.appName);
    formData.append("serviceName", props?.serviceName);
    formData.append("fileName", fileName);



    //! extension only
    const fileExtension = e?.target?.files[0]?.name?.split(".")[e?.target?.files[0]?.name?.split(".").length - 1];
    //! without extension
    const fileNameWithoutExtension = e?.target?.files[0]?.name?.split("." + fileExtension)[0];
    //! regex --- letter/numbers/hypens/underscore
    const fileNameRegex = /^[a-zA-Z0-9_-]+$/;

    //! check file type
    if (
      e?.target?.files[0]?.type == "image/jpeg" ||
      e?.target?.files[0]?.type == "image/png" ||
      e?.target?.files[0]?.type == "application/pdf"
    ) {
      //! check fileName
      if (fileNameRegex.test(fileNameWithoutExtension)) {

        //! check file size 
        if (e.target.files[0].size < 10485760) {

          // upload api
          axios
            .post(`${urls.CFCURL}/file/uploadWithFileName`, formData, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((r) => {
              if (r?.status == 200 || res?.status == 201 || res?.status == "SUCCESS") {
                setFilePath(r?.data?.filePath);
                props.filePath(r?.data);
                props.handleClose();
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
          var inputElement = document.getElementById("file");
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
        var inputElement = document.getElementById("file");
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
            ? "Allowed file types are JPEG, PNG, and PDF only."
            : "केवळ JPEG, PNG आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे",
        icon: "error",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });
      var inputElement = document.getElementById("file");
      inputElement.value = "";
    }



  };

  //! ================> useEffect

  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props?.fileName);
    }
  }, [props?.fileName]);

  useEffect(() => {
    props.fileLabel(fileName);
  }, [fileName]);

  useEffect(() => {
    props.filePath(filePath);
  }, [filePath]);


  // view
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {!filePath && (
        <TextField
          sx={{
            width: 200,
            // marginBottom: '5px'
          }}
          onChange={(e) => {
            setFileName(e?.target?.value);
            // props.setFileLabel(e.target.value)
          }}
          id="standard-basic"
          label={<FormattedLabel id="fileName" />}
          variant="standard"
          value={fileName}
        />
      )}
      <label className={style.uploadButton}>
        {!filePath && (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              if (!fileName) {
                swal({
                  text: "Please enter file name first ",
                  icon: "warning",
                });
              }
            }}
          >
            <Button startIcon={<FileUpload />} variant="contained" component="label">
              <FormattedLabel id="upload" />
              <input
                id="file"
                disabled={!fileName ? true : false}
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
                hidden
              />
            </Button>
            {/*
            // <Add
            <FileUpload
              color='secondary'
              sx={{
                width: 30,
                height: 30,
                border: '1.4px dashed #9c27b0',
                marginRight: 1.5,
              }}
            />
            <input
              disabled={!fileName ? true : false}
              type='file'
              id="file"
              onChange={(e) => {
                handleFile(e)
              }}
              hidden
            />
            <span
              className={style.fileName}
              onClick={() => {
                if (!fileName) {
                  swal({
                    text: 'Please enter file name first ',
                    icon: 'warning',
                  })
                }
              }}
            >
              Attach File
            </span> */}
          </div>
        )}
      </label>
    </div>
  );
};
export default UploadButton;
