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
// import style from "../FileUpload/upload.module.css";
import style from "../../../styles/skysignstyles/upload.module.css";
import axios from "axios";

const UploadButton = (props) => {
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {
    console.log("sachin", props);
  }, [props]);
  useEffect(() => {
    console.log("props.filePath <->", props);
    if (props?.fileName) {
      setFilePath(props.fileName);
    }
  }, [props?.fileName]);

  const handleFile = async (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("appName", props.appName);
    formData.append("serviceName", props.serviceName);
    axios
      .post(`http://localhost:8090/cfc/api/file/upload`, formData)
      .then((r) => {
        setFilePath(r.data.filePath);
        props.filePath(r.data.filePath);
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
        axios
          .delete(
            `http://localhost:8090/cfc/api/file/discard?filePath=${filePath}`,
          )
          .then((res) => {
            if (res.status == 200) {
              setFilePath(null),
                props.filePath(null),
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

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!filePath && (
          <>
            <span>File Not Uploaded</span>
          </>
        )}
        {filePath ? (
          <a
            href={`http://localhost:8090/cfc/api/file/preview?filePath=${filePath}`}
            target='__blank'
          >
            <Button variant='contained' color='primary'>
              VIEW
            </Button>
          </a>
        ) : (
          <h1></h1>
        )}
      </label>
    </div>
  );
};
export default UploadButton;
