import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import style from "../../LegalCase";
// import { catchExceptionHandlingMethod } from "../../../../util/util";
import { catchExceptionHandlingMethod } from "../../../util/util";

const UploadButton = (props) => {
  const language = useSelector((state) => state?.labels?.language);
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const token = useSelector((state) => state.user.user.token);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // const [fileName, setFileName] = useState("");
  //

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Define a regular expression to allow only alphanumeric characters and underscores
    const regex = /^[a-zA-Z0-9_]+$/;

    if (regex.test(inputValue)) {
      setFileName(inputValue);
      setError("");
    } else {
      setError("Special characters are not allowed.");
    }
  };
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
  useEffect(() => {
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  useEffect(() => {
    // props.fileLabel(fileName)
  }, [fileName]);

  useEffect(() => {
    props.filePath(filePath);
  }, [filePath]);

  // const handleFile = (e) => {
  // props.modalState(false);
  // props.uploading(true);
  //   let formData = new FormData();
  //   formData.append("file", e.target.files[0]);
  //   formData.append("appName", props.appName);
  //   formData.append("serviceName", props.serviceName);
  //   formData.append("fileName", fileName);
  //   axios
  //     // .post(`${urls.CFCURL}/file/uploadWithFileName`, formData)
  //     .then((r) => {
  //       setFilePath(r.data.filePath);
  // props.filePath(r.data);
  // props.handleClose();
  //     });
  // };

  const handleFile = (e) => {
    props.modalState(false);
    props.uploading(true);

    console.log(":a4", e.target.files[0].type);

    if (
      e.target.files[0].type == "image/jpeg" ||
      e.target.files[0].type == "image/png" ||
      e.target.files[0].type == "application/pdf" ||
      e.target.files[0].type == "text/csv" ||
      e.target.files[0].type == "text/xlsx" ||
      e.target.files[0].type == "text/xls" ||
      e.target.files[0].type == "xls" ||
      e.target.files[0].type == "xlsx" ||
      e.target.files[0].type == "XLSX" ||
      e.target.files[0].type === "application/msword" || // for .doc
      e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // for .docx

      // ||
      // e.target.files[0].type ==
      //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      if (e.target.files[0].size < 10485760) {
        // -------------------Old Code------------------------------------------------------------
        // let formData = new FormData();
        // formData.append("file", e.target.files[0]);
        // -------------------New Code By Vishal for input base file Name---------------------------------------------------------------
        let ext = e.target.files[0]?.name?.split(".").pop();
        const originalFile = e.target.files[0];
        let formData = new FormData();
        // CHANGES
        formData.append("appName", props?.appName);
        formData.append("serviceName", props?.serviceName);
        const blob = new Blob([originalFile], { type: originalFile.type });
        const modifiedFile = new File([blob], `${fileName}.${ext}`, {
          type: originalFile.type,
        });
        console.log("modifiedFile", modifiedFile);
        formData.append("file", modifiedFile);
        // ----------------------------------------------------------------------------------
        axios
          .post(`${urls.CFCURL}/file/uploadAllTypeOfFileEncrypted`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((r) => {
            if (r.status === 200) {
              setFilePath(r?.data?.filePath);
              // setFileNameOrig(r?.data?.fileName)
              props.filePath(r.data);
              props.handleClose();
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      } else {
        swal(
          language == "en"
            ? "File size should not exceed 10 MB"
            : "फाइलचा आकार 10 मेगाबाइटपेक्षा जास्त नसावा",
          { icon: "error" }
        );
      }
    } else {
      swal(
        language == "en"
          ? "Please Upload Valid Type File !"
          : "कृपया वैध प्रकार फाइल अपलोड करा !",
        language == "en"
          ? "Allowed file types are JPEG, PNG, cvs, xls and PDF only."
          : "केवळ JPEG, PNG ,cvs ,xls आणि PDF हे फाइल प्रकार अपलोड करण्यास अनुमती आहे"
      );
    }
  };

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
            width: 220,
            // marginBottom: '5px'
          }}
          onChange={handleInputChange}
          id="standard-basic"
          // label={<FormattedLabel id="fileName" />}
          label="File Name (without Extension)"
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
            <Button
              startIcon={<FileUpload />}
              variant="contained"
              component="label"
            >
              <FormattedLabel id="documentUpload" />
              <input
                disabled={!fileName ? true : false}
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
                hidden
              />
            </Button>
            {/* {filePath ? (
              <a
                href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                target='__blank'
              >
                {showFileName(filePath)}
              </a>
            ) : props?.showDel == true ? (
              <span className={style.fileName}>Upload File</span>
            ) : (
              <span className={style.fileName} />
            )} */}
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

    // new
    //   <div className={style.align}>
    //   <label className={style.uploadButton}>
    //     {!filePath && props.showDel === true && (
    //       <>
    //         <Add
    //           color="secondary"
    //           sx={{
    //             width: 30,
    //             height: 30,
    //             border: "1.4px dashed #9c27b0",
    //             marginRight: 1.5,
    //           }}
    //         />
    //         <input
    //           type="file"
    //           onChange={(e) => {
    //             handleFile(e)
    //           }}
    //           hidden
    //         />
    //       </>
    //     )}
    // {filePath ? (
    //   <a
    //     href={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
    //     target="__blank"
    //   >
    //     {showFileName(filePath)}
    //   </a>
    // ) : props?.showDel == true ? (
    //   <span className={style.fileName}>Upload File</span>
    // ) : (
    //   <span className={style.fileName} />
    // )}
    //   </label>
    //   {filePath && props.showDelBtn == true && (
    //     <IconButton
    //       onClick={(e) => {
    //         discard(e)
    //       }}
    //     >
    //       <Delete color="error" />
    //     </IconButton>
    //   )}
    // </div>
  );
};
export default UploadButton;
