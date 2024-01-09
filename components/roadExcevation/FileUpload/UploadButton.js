import { FileUpload } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../containers/Layout/components/Loader";
import urls from "../../../URLS/urls";
// import style from "../../../styles/LegalCase_Styles/upload.module.css";
import style from "../../../pages/roadExcavation/transaction/roadExcevationForms/roadExcavationNocPermission/upload.module.css";

import { useSelector } from "react-redux";
import { setLocale } from "yup";
const UploadButton = (props) => {
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const user = useSelector((state) => state.user.user);
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

  const handleFile = (e) => {
    console.log("qqqqq",e);
    props.setloading(true)
    props.modalState(false);
    props.uploading(true);
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    formData.append("fileName", fileName);
    axios
      .post(`${urls.CFCURL}/file/uploadWithFileName`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          // serviceId: selectedMenuFromDrawer,
        },
      })
      .then((r) => {
        setFilePath(r.data.filePath);
        props.filePath(r.data);
        props.handleClose();
        props.setloading(false)
      }).catch((err)=>{
        setloading(false);
      })
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
            width: 200,
            // marginBottom: '5px'
          }}
          onChange={(e) => {
            setFileName(e.target.value);
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
              {/* Upload */}
              <input
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
